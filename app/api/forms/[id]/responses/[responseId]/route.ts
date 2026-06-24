import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

// PATCH /api/forms/[id]/responses/[responseId]
// Update a per-response review status and/or tags. Both live inside the
// submissions.metadata JSONB column (no new columns / migration).
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; responseId: string } }
) {
  const supabase = createServerSupabaseClient()

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

  let body: any = {}
  try {
    body = await request.json()
  } catch {
    body = {}
  }

  // Load the current metadata so we merge rather than clobber (quiz, reactions,
  // url_params, etc. must be preserved).
  const { data: existing, error: loadErr } = await supabase
    .from('submissions')
    .select('metadata')
    .eq('id', params.responseId)
    .eq('form_id', params.id)
    .single()

  if (loadErr || !existing) {
    return NextResponse.json({ error: 'Response not found' }, { status: 404 })
  }

  const metadata: Record<string, any> = { ...(existing.metadata || {}) }

  // status: a short review/triage label. Empty string clears it.
  if ('status' in body) {
    const s = body.status
    if (s === null || s === '' || s === undefined) {
      delete metadata.status
    } else if (typeof s === 'string') {
      metadata.status = s.slice(0, 64)
    }
  }

  // tags: replace the whole array with a sanitized, de-duplicated list.
  if ('tags' in body) {
    if (Array.isArray(body.tags)) {
      const clean: string[] = []
      const seen = new Set<string>()
      for (const t of body.tags) {
        if (typeof t !== 'string') continue
        const trimmed = t.trim().slice(0, 48)
        if (!trimmed || seen.has(trimmed)) continue
        seen.add(trimmed)
        clean.push(trimmed)
        if (clean.length >= 30) break
      }
      if (clean.length) metadata.tags = clean
      else delete metadata.tags
    } else if (body.tags === null) {
      delete metadata.tags
    }
  }

  const { error: updateErr } = await supabase
    .from('submissions')
    .update({ metadata })
    .eq('id', params.responseId)
    .eq('form_id', params.id)

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, metadata })
}

// DELETE /api/forms/[id]/responses/[responseId] - Delete single response
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; responseId: string } }
) {
  const supabase = createServerSupabaseClient()
  
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

  const { error } = await supabase
    .from('submissions')
    .delete()
    .eq('id', params.responseId)
    .eq('form_id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
