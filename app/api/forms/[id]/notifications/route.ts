import { createClient } from '@/lib/supabase-client'
import { NextResponse } from 'next/server'

// GET /api/forms/[id]/notifications - Get notification settings
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify user owns this form
  const { data: form } = await supabase
    .from('forms')
    .select('id')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!form) {
    return NextResponse.json({ error: 'Form not found' }, { status: 404 })
  }

  // Get notification settings
  const { data: settings } = await supabase
    .from('notification_settings')
    .select('*')
    .eq('form_id', params.id)
    .single()

  // Return default settings if none exist
  if (!settings) {
    return NextResponse.json({
      settings: {
        notify_on_submission: true,
        notification_emails: [user.email],
        email_subject: 'New form submission',
        email_template: null
      }
    })
  }

  return NextResponse.json({ settings })
}

// POST /api/forms/[id]/notifications - Update notification settings
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify user owns this form
  const { data: form } = await supabase
    .from('forms')
    .select('id')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!form) {
    return NextResponse.json({ error: 'Form not found' }, { status: 404 })
  }

  const body = await request.json()
  const { notify_on_submission, notification_emails, email_subject } = body

  // Upsert notification settings
  const { data: settings, error } = await supabase
    .from('notification_settings')
    .upsert({
      form_id: params.id,
      notify_on_submission: notify_on_submission ?? true,
      notification_emails: notification_emails || [user.email],
      email_subject: email_subject || 'New form submission',
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'form_id'
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ settings })
}
