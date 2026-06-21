// Owner-authenticated GET/PUT over forms.email_branding (jsonb).
// Shape: { fromName?, replyTo?, logoUrl?, accentColor?, signature? }

import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

async function requireOwner(formId: string) {
  const supabase = createServerSupabaseClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  const { data: form } = await supabase
    .from('forms')
    .select('id')
    .eq('id', formId)
    .eq('user_id', user.id)
    .single()
  if (!form) {
    return { error: NextResponse.json({ error: 'Form not found' }, { status: 404 }) }
  }
  return { supabase }
}

function clean(branding: any): Record<string, any> {
  const b = branding && typeof branding === 'object' ? branding : {}
  const out: Record<string, any> = {}
  if (b.fromName) out.fromName = String(b.fromName).slice(0, 120).trim()
  if (b.replyTo) out.replyTo = String(b.replyTo).slice(0, 200).trim()
  if (b.logoUrl) out.logoUrl = String(b.logoUrl).slice(0, 500).trim()
  if (b.accentColor && /^#[0-9a-fA-F]{3,8}$/.test(String(b.accentColor).trim())) {
    out.accentColor = String(b.accentColor).trim()
  }
  if (b.signature) out.signature = String(b.signature).slice(0, 2000)
  return out
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const guard = await requireOwner(params.id)
  if (guard.error) return guard.error
  const { supabase } = guard

  const { data, error } = await supabase
    .from('forms')
    .select('email_branding')
    .eq('id', params.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ branding: data?.email_branding || {} })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const guard = await requireOwner(params.id)
  if (guard.error) return guard.error
  const { supabase } = guard

  const body = await request.json().catch(() => ({}))
  const branding = clean(body?.branding ?? body)

  const { data, error } = await supabase
    .from('forms')
    .update({ email_branding: branding, updated_at: new Date().toISOString() })
    .eq('id', params.id)
    .select('email_branding')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ branding: data?.email_branding || {} })
}
