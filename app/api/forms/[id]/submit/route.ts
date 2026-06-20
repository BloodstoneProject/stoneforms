import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { checkCanAcceptResponse } from '@/lib/plan-enforcement'
import { sendSubmissionNotification } from '@/lib/email-utils'

// POST /api/forms/[id]/submit - Submit form response
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()

  try {
    const body = await request.json()
    const { responses, session_id } = body

    // Get form to verify it exists and is published
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('id, status, title, user_id')
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

    // Create submission - use correct column names (answers, not response_data)
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .insert({
        form_id: params.id,
        answers: responses,
        status: 'completed'
      })
      .select()
      .single()

    if (submissionError) {
      console.error('Submission error:', submissionError)
      return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 })
    }

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

    // Send email notification (async, don't wait)
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

    return NextResponse.json({
      success: true,
      submission_id: submission.id
    })
  } catch (error) {
    console.error('Submit error:', error)
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 })
  }
}
