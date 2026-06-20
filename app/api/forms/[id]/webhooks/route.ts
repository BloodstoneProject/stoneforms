import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

async function requireOwner(supabase: ReturnType<typeof createServerSupabaseClient>, formId: string) {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return { error: 'Unauthorized', status: 401 as const }
  const { data: form } = await supabase
    .from('forms').select('id').eq('id', formId).eq('user_id', user.id).single()
  if (!form) return { error: 'Form not found', status: 404 as const }
  return { user }
}

// GET /api/forms/[id]/webhooks
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()
  const auth = await requireOwner(supabase, params.id)
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { data: webhooks, error } = await supabase
    .from('webhooks')
    .select('*')
    .eq('form_id', params.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ webhooks: webhooks || [] })
}

// POST /api/forms/[id]/webhooks
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()
  const auth = await requireOwner(supabase, params.id)
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const body = await request.json().catch(() => ({}))
  const url = String(body.url || '').trim()

  // Validate the URL and require https (no internal/plaintext targets).
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:') {
      return NextResponse.json({ error: 'Webhook URL must use https' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid webhook URL' }, { status: 400 })
  }

  const events = Array.isArray(body.events) && body.events.length > 0
    ? body.events.filter((e: any) => typeof e === 'string')
    : ['submission.created']

  const { data: webhook, error } = await supabase
    .from('webhooks')
    .insert({
      form_id: params.id,
      url,
      events,
      secret: crypto.randomBytes(24).toString('hex'),
      is_active: true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ webhook })
}
