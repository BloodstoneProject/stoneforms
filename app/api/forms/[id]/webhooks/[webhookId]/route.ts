import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

async function requireOwner(supabase: ReturnType<typeof createServerSupabaseClient>, formId: string) {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return { error: 'Unauthorized', status: 401 as const }
  const { data: form } = await supabase
    .from('forms').select('id').eq('id', formId).eq('user_id', user.id).single()
  if (!form) return { error: 'Form not found', status: 404 as const }
  return { user }
}

// PATCH /api/forms/[id]/webhooks/[webhookId] - toggle active / update events
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; webhookId: string } }
) {
  const supabase = createServerSupabaseClient()
  const auth = await requireOwner(supabase, params.id)
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const body = await request.json().catch(() => ({}))
  const updates: Record<string, any> = {}
  if (typeof body.is_active === 'boolean') updates.is_active = body.is_active
  if (Array.isArray(body.events)) updates.events = body.events.filter((e: any) => typeof e === 'string')
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const { data: webhook, error } = await supabase
    .from('webhooks')
    .update(updates)
    .eq('id', params.webhookId)
    .eq('form_id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ webhook })
}

// DELETE /api/forms/[id]/webhooks/[webhookId]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; webhookId: string } }
) {
  const supabase = createServerSupabaseClient()
  const auth = await requireOwner(supabase, params.id)
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { error } = await supabase
    .from('webhooks')
    .delete()
    .eq('id', params.webhookId)
    .eq('form_id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
