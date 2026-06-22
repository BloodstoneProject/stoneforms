import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { checkCanAcceptResponse } from '@/lib/plan-enforcement'
import { sendSubmissionNotification, sendAutoResponder } from '@/lib/email-utils'
import { deliverWebhooks } from '@/lib/webhooks'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { appendSubmissionToSheet } from '@/lib/google-sheets'
import { computeScore, resolveOutcome, type QuizConfig } from '@/lib/quiz'
import { getFormAvailability } from '@/lib/form-controls'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { computeCalc } from '@/lib/calc'
import { dispatchIntegrations } from '@/lib/integrations/dispatch'
import { createCheckoutForSubmission } from '@/lib/stripe-connect'
import { isInputField } from '@/lib/field-types'

// POST /api/forms/[id]/submit - Submit form response
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Throttle submissions per IP to blunt spam bursts.
  const ip = getClientIp(request)
  const limit = rateLimit(`submit:${ip}`, 10, 60_000)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many submissions. Please wait a moment and try again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    )
  }

  const supabase = createServerSupabaseClient()

  try {
    const body = await request.json()
    const { responses, session_id, metadata, recaptchaToken } = body

    // reCAPTCHA v3 (dormant unless RECAPTCHA_SECRET_KEY is set). Verify before
    // doing any real work so spam is cheap to reject.
    const recaptcha = await verifyRecaptcha(recaptchaToken, ip)
    if (!recaptcha.ok) {
      return NextResponse.json(
        { error: 'Could not verify you are human. Please refresh and try again.' },
        { status: 403 }
      )
    }

    // Sanitize incoming metadata (URL params / hidden tracking) — cap size.
    let safeMetadata: Record<string, any> = {}
    if (metadata && typeof metadata === 'object') {
      try {
        const trimmed = JSON.stringify(metadata).slice(0, 8000)
        safeMetadata = JSON.parse(trimmed)
      } catch { safeMetadata = {} }
    }

    // Get form to verify it exists and is published
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('id, status, title, user_id, settings')
      .eq('id', params.id)
      .single()

    if (formError || !form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    if (form.status !== 'published') {
      return NextResponse.json({ error: 'Form is not published' }, { status: 400 })
    }

    // Re-check schedule window + response cap server-side (never trust the client).
    {
      const schedule = (form.settings as any)?.schedule
      let responseCount = 0
      if (schedule && typeof schedule.maxResponses === 'number' && schedule.maxResponses > 0) {
        try {
          const admin = createAdminClient()
          const { count } = await admin
            .from('submissions')
            .select('id', { count: 'exact', head: true })
            .eq('form_id', params.id)
          responseCount = count ?? 0
        } catch { responseCount = 0 }
      }
      const availability = getFormAvailability(form as any, responseCount)
      if (!availability.open) {
        return NextResponse.json(
          { error: availability.message || 'This form is not currently accepting responses.' },
          { status: 403 }
        )
      }
    }

    // Check plan limits
    const limitCheck = await checkCanAcceptResponse(params.id)

    if (!limitCheck.allowed) {
      return NextResponse.json({
        error: 'This form has reached its response limit for this month. Please contact the form owner.',
        plan: limitCheck.plan,
        limit: limitCheck.limit
      }, { status: 403 })
    }

    // Get form fields to validate
    const { data: fields } = await supabase
      .from('form_fields')
      .select('*')
      .eq('form_id', params.id)
      .order('position')

    // Validate required fields (handles strings, arrays, booleans, numbers,
    // address objects and signature data-URL strings).
    const isEmpty = (v: any, fieldType?: string) => {
      // Address: empty unless line1, city and postal are all present.
      if (fieldType === 'address') {
        const a = (v && typeof v === 'object') ? v : {}
        return !(
          typeof a.line1 === 'string' && a.line1.trim() &&
          typeof a.city === 'string' && a.city.trim() &&
          typeof a.postal === 'string' && a.postal.trim()
        )
      }
      // Signature: empty when the data-URL string is blank.
      if (fieldType === 'signature') {
        return typeof v !== 'string' || v.trim() === ''
      }
      return (
        v === undefined ||
        v === null ||
        (typeof v === 'string' && v.trim() === '') ||
        (Array.isArray(v) && v.length === 0)
      )
    }

    const requiredFields = fields?.filter(f => f.required) || []
    for (const field of requiredFields) {
      // Content blocks (heading, image, divider, …) and other non-input blocks
      // collect no answer — never require them, even if `required` got set.
      if (!isInputField(field.field_type)) continue
      // Consent: required means the box must be ticked (answer exactly true).
      if (field.field_type === 'consent') {
        if (responses?.[field.id] !== true) {
          return NextResponse.json({
            error: `${field.label} is required`
          }, { status: 400 })
        }
        continue
      }
      // Calculator is a computed display — never block submission on it.
      if (field.field_type === 'calculator') continue
      // Payment is a disclosure panel collected on submit — never block on it.
      if (field.field_type === 'payment') continue
      if (isEmpty(responses?.[field.id], field.field_type)) {
        return NextResponse.json({
          error: `${field.label} is required`
        }, { status: 400 })
      }
    }

    // Recompute calculator fields server-side (don't trust the client) and write
    // the authoritative value back into responses before storing.
    const calcFields = (fields || []).filter((f) => f.field_type === 'calculator')
    if (calcFields.length > 0 && responses && typeof responses === 'object') {
      for (const f of calcFields) {
        responses[f.id] = computeCalc({ settings: f.settings }, responses)
      }
    }

    // ---- Quiz scoring (server is authoritative) ----
    const quizConfig = (form.settings as any)?.quiz as QuizConfig | undefined
    let quizMeta: { total: number; max: number; outcomeId: string | null } | null = null
    let quizResponse: { total: number; max: number; outcome: any } | null = null
    if (quizConfig?.enabled) {
      const { total, max } = computeScore(fields || [], responses || {})
      const outcome = resolveOutcome(quizConfig, total)
      quizMeta = { total, max, outcomeId: outcome?.id ?? null }
      quizResponse = { total, max, outcome }
    }

    if (quizMeta) {
      safeMetadata = { ...safeMetadata, quiz: quizMeta }
    }

    // ---- Per-question reactions (gamification feedback, pure analytics) ----
    // The player may send body.reactions = { [fieldId]: emoji }. Reactions are
    // optional, never required, never affect validation/scoring. Sanitize hard:
    // only whitelisted emojis, only keys that match a real field id, capped.
    // Merge into safeMetadata WITHOUT clobbering quiz / url_params keys.
    const REACTION_EMOJIS = new Set(['👍', '❤️', '😮', '🔥', '😍', '🎉'])
    const incomingReactions = (body as any)?.reactions
    if (incomingReactions && typeof incomingReactions === 'object' && !Array.isArray(incomingReactions)) {
      const validFieldIds = new Set((fields || []).map((f) => f.id))
      const cleanReactions: Record<string, string> = {}
      let count = 0
      for (const [fieldId, emoji] of Object.entries(incomingReactions)) {
        if (count >= 200) break // cap to blunt abuse
        if (validFieldIds.has(fieldId) && typeof emoji === 'string' && REACTION_EMOJIS.has(emoji)) {
          cleanReactions[fieldId] = emoji
          count++
        }
      }
      if (count > 0) {
        safeMetadata = { ...safeMetadata, reactions: cleanReactions }
      }
    }

    // Detect a payment field — its presence makes this a pay-on-submit form. The
    // submission is stored as 'pending' (awaiting payment) when we'll actually
    // create a Stripe Checkout below; the Connect webhook flips it to 'completed'
    // once paid. Forms with no payment field keep the exact original behaviour.
    const hasPaymentField = (fields || []).some((f) => f.field_type === 'payment')

    // Create submission. Generate the id ourselves and do NOT .select() it back:
    // anonymous respondents can INSERT (RLS) but cannot SELECT submissions (only
    // the form owner can), so reading the row back would fail for them.
    const submissionId = crypto.randomUUID()
    const { error: submissionError } = await supabase
      .from('submissions')
      .insert({
        id: submissionId,
        form_id: params.id,
        answers: responses,
        metadata: safeMetadata,
        status: hasPaymentField ? 'pending' : 'completed',
      })

    if (submissionError) {
      console.error('Submission error:', submissionError)
      return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 })
    }

    const submission = { id: submissionId }

    // Record an authoritative completion event for analytics (best-effort).
    try {
      await supabase.from('form_events').insert({
        form_id: params.id,
        event_type: 'submit',
        submission_id: submission.id,
        session_id: typeof session_id === 'string' ? session_id.slice(0, 64) : null,
      })
    } catch (eventError) {
      console.error('Analytics event error:', eventError)
    }

    // Append to a connected Google Sheet (best-effort; no-ops if not connected).
    try {
      await appendSubmissionToSheet(params.id, responses, fields || [])
    } catch (sheetError) {
      console.error('Google Sheets append error:', sheetError)
    }

    // Deliver signed webhooks (logs delivery status). Best-effort; never fails the submit.
    try {
      await deliverWebhooks({
        formId: params.id,
        submissionId: submission.id,
        event: 'submission.created',
        data: responses,
      })
    } catch (webhookError) {
      console.error('Webhook delivery error:', webhookError)
    }

    // Dispatch to connected integrations (owned by the integrations agent).
    // Best-effort; never fails the submit.
    try {
      await dispatchIntegrations({
        formId: params.id,
        submissionId: submission.id,
        form,
        fields: fields || [],
        responses,
      })
    } catch (e) {
      console.error('Integrations dispatch error:', e)
    }

    // Owner notification email.
    try {
      const { data: notificationSettings } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('form_id', params.id)
        .single()

      if (notificationSettings?.notify_on_submission && notificationSettings.notification_emails?.length > 0) {
        sendSubmissionNotification({
          formTitle: form.title,
          formId: params.id,
          submissionId: submission.id,
          responses,
          notificationEmails: notificationSettings.notification_emails,
          formFields: fields || []
        }).catch(err => console.error('Email notification error:', err))
      }
    } catch (emailError) {
      console.error('Email notification error:', emailError)
    }

    // Auto-responder to the respondent (if enabled and we captured their email).
    try {
      const autoResponder = (form.settings as any)?.autoResponder
      if (autoResponder?.enabled) {
        const emailField = (fields || []).find((f) => f.field_type === 'email')
        const respondentEmail = emailField ? responses?.[emailField.id] : null
        if (typeof respondentEmail === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(respondentEmail)) {
          sendAutoResponder({
            to: respondentEmail,
            formId: params.id,
            formTitle: form.title,
            subject: autoResponder.subject,
            message: autoResponder.message,
          }).catch((err) => console.error('Auto-responder error:', err))
        }
      }
    } catch (autoErr) {
      console.error('Auto-responder error:', autoErr)
    }

    // ---- Payment collection (Stripe Connect, fixed amount) ----
    // When the form has a payment field, try to create a Checkout Session on the
    // owner's connected account and return its URL for the player to redirect to.
    // Fully dormant-safe: if Connect isn't configured or the owner isn't
    // connected, createCheckoutForSubmission returns ok:false and we simply mark
    // the submission completed and finish normally (the payment field was just
    // informational). The amount is server-authoritative (read from the field).
    let checkoutUrl: string | null = null
    if (hasPaymentField) {
      try {
        const result = await createCheckoutForSubmission({
          formId: params.id,
          submissionId: submission.id,
        })
        if (result.ok && result.checkoutUrl) {
          checkoutUrl = result.checkoutUrl
        }
      } catch (payErr) {
        console.error('Payment checkout error:', payErr)
      }
      // No checkout URL means payment is dormant / unavailable — don't leave the
      // submission stuck in 'pending'. Promote it to 'completed' (service-role).
      if (!checkoutUrl) {
        try {
          const admin = createAdminClient()
          await admin
            .from('submissions')
            .update({ status: 'completed' })
            .eq('id', submission.id)
        } catch (e) {
          console.error('Submission status promote error:', e)
        }
      }
    }

    return NextResponse.json({
      success: true,
      submission_id: submission.id,
      ...(checkoutUrl ? { checkoutUrl } : {}),
      ...(quizResponse ? { quiz: quizResponse } : {}),
    })
  } catch (error) {
    console.error('Submit error:', error)
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 })
  }
}
