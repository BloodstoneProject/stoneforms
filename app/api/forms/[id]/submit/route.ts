import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { checkCanAcceptResponse } from '@/lib/plan-enforcement'
import { sendSubmissionNotification, sendAutoResponder } from '@/lib/email-utils'
import { deliverWebhooks } from '@/lib/webhooks'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

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
    const { responses, session_id, metadata } = body

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

    // Validate required fields (handles strings, arrays, booleans, numbers)
    const isEmpty = (v: any) =>
      v === undefined ||
      v === null ||
      (typeof v === 'string' && v.trim() === '') ||
      (Array.isArray(v) && v.length === 0)

    const requiredFields = fields?.filter(f => f.required) || []
    for (const field of requiredFields) {
      if (isEmpty(responses?.[field.id])) {
        return NextResponse.json({
          error: `${field.label} is required`
        }, { status: 400 })
      }
    }

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
        status: 'completed',
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
            formTitle: form.title,
            subject: autoResponder.subject,
            message: autoResponder.message,
          }).catch((err) => console.error('Auto-responder error:', err))
        }
      }
    } catch (autoErr) {
      console.error('Auto-responder error:', autoErr)
    }

    return NextResponse.json({
      success: true,
      submission_id: submission.id
    })
  } catch (error) {
    console.error('Submit error:', error)
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 })
  }
}
