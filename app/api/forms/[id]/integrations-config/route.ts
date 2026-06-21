// Owner-authenticated CRUD over public.form_integrations rows for a form, plus
// a `test` action that sends a sample payload to the configured destination.
// One row per (form_id, type). Config shapes:
//   slack:     { webhookUrl }
//   notion:    { token, databaseId, titleProperty? }
//   mailchimp: { apiKey, audienceId, tags? }

import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { sendSlackMessage } from '@/lib/integrations/slack'
import { createNotionPage } from '@/lib/integrations/notion'
import { syncMailchimpMember } from '@/lib/integrations/mailchimp'
import type { AnswerPair } from '@/lib/integrations/format'

const VALID_TYPES = new Set(['slack', 'notion', 'mailchimp'])

async function requireOwner(formId: string) {
  const supabase = createServerSupabaseClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  const { data: form } = await supabase
    .from('forms')
    .select('id, title')
    .eq('id', formId)
    .eq('user_id', user.id)
    .single()
  if (!form) {
    return { error: NextResponse.json({ error: 'Form not found' }, { status: 404 }) }
  }
  return { supabase, form }
}

// Strip empty strings so we never persist blank credentials.
function cleanConfig(type: string, config: any): Record<string, any> {
  const c = config && typeof config === 'object' ? config : {}
  const out: Record<string, any> = {}
  if (type === 'slack') {
    if (c.webhookUrl) out.webhookUrl = String(c.webhookUrl).trim()
  } else if (type === 'notion') {
    if (c.token) out.token = String(c.token).trim()
    if (c.databaseId) out.databaseId = String(c.databaseId).trim()
    if (c.titleProperty) out.titleProperty = String(c.titleProperty).trim()
  } else if (type === 'mailchimp') {
    if (c.apiKey) out.apiKey = String(c.apiKey).trim()
    if (c.audienceId) out.audienceId = String(c.audienceId).trim()
    if (c.tags) {
      out.tags = Array.isArray(c.tags)
        ? c.tags
        : String(c.tags).split(',').map((t: string) => t.trim()).filter(Boolean)
    }
  }
  return out
}

// GET — list all integration rows for the form (credentials included so the
// owner can see/edit them; this route is owner-only).
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const guard = await requireOwner(params.id)
  if (guard.error) return guard.error
  const { supabase } = guard

  const { data, error } = await supabase
    .from('form_integrations')
    .select('id, type, config, enabled, created_at, updated_at')
    .eq('form_id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ integrations: data || [] })
}

// PUT — upsert (and optionally test) one integration by type.
//   body: { type, config, enabled?, action?: 'save' | 'test' }
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const guard = await requireOwner(params.id)
  if (guard.error) return guard.error
  const { supabase, form } = guard

  const body = await request.json().catch(() => ({}))
  const { type, config, enabled, action } = body || {}

  if (!type || !VALID_TYPES.has(type)) {
    return NextResponse.json({ error: 'Invalid integration type' }, { status: 400 })
  }

  const cleaned = cleanConfig(type, config)

  // Test action: don't require persistence — validate against the live service.
  if (action === 'test') {
    try {
      await runTest(type, cleaned, form.title)
      return NextResponse.json({ ok: true, message: 'Test sent successfully.' })
    } catch (err: any) {
      return NextResponse.json({ ok: false, error: err?.message || 'Test failed' }, { status: 400 })
    }
  }

  const { data, error } = await supabase
    .from('form_integrations')
    .upsert(
      {
        form_id: params.id,
        type,
        config: cleaned,
        enabled: enabled ?? true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'form_id,type' }
    )
    .select('id, type, config, enabled')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ integration: data })
}

// DELETE — remove one integration by type. body or query: { type }
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const guard = await requireOwner(params.id)
  if (guard.error) return guard.error
  const { supabase } = guard

  const url = new URL(request.url)
  let type = url.searchParams.get('type') || ''
  if (!type) {
    const body = await request.json().catch(() => ({}))
    type = body?.type || ''
  }
  if (!type || !VALID_TYPES.has(type)) {
    return NextResponse.json({ error: 'Invalid integration type' }, { status: 400 })
  }

  const { error } = await supabase
    .from('form_integrations')
    .delete()
    .eq('form_id', params.id)
    .eq('type', type)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// Send a representative sample payload to the configured destination.
function samplePairs(): AnswerPair[] {
  return [
    { fieldId: 'sample-name', fieldType: 'text', label: 'Name', value: 'Sample Respondent' },
    { fieldId: 'sample-email', fieldType: 'email', label: 'Email', value: 'sample@example.com' },
    { fieldId: 'sample-msg', fieldType: 'textarea', label: 'Message', value: 'This is a Stoneforms test submission.' },
  ]
}

async function runTest(type: string, config: any, formTitle: string): Promise<void> {
  const pairs = samplePairs()
  if (type === 'slack') {
    if (!config.webhookUrl) throw new Error('Enter a Slack webhook URL first.')
    await sendSlackMessage({ webhookUrl: config.webhookUrl, formTitle: `${formTitle} (test)`, pairs })
    return
  }
  if (type === 'notion') {
    if (!config.token || !config.databaseId) throw new Error('Enter a Notion token and database ID first.')
    await createNotionPage({
      token: config.token,
      databaseId: config.databaseId,
      titleProperty: config.titleProperty,
      formTitle: `${formTitle} (test)`,
      pairs,
    })
    return
  }
  if (type === 'mailchimp') {
    if (!config.apiKey || !config.audienceId) throw new Error('Enter a Mailchimp API key and audience ID first.')
    const fields = [
      { id: 'sample-name', field_type: 'text', label: 'Name' },
      { id: 'sample-email', field_type: 'email', label: 'Email' },
    ]
    const responses = { 'sample-name': 'Sample Respondent', 'sample-email': 'sample@example.com' }
    const result = await syncMailchimpMember({
      apiKey: config.apiKey,
      audienceId: config.audienceId,
      tags: config.tags,
      fields,
      responses,
      pairs,
    })
    if (result.skipped) throw new Error('No email detected in the sample.')
    return
  }
  throw new Error('Unknown integration type')
}
