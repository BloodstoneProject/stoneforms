import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

// GET /api/forms/[id]/responses - Get all responses for a form
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
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

  const url = new URL(request.url)
  const sp = url.searchParams

  // --- Filtering / sorting / pagination params ---
  // status: 'all' | a specific metadata.status value | 'completed'/'pending' (DB column)
  const completion = sp.get('completion') || 'all'       // all | complete | partial
  const status = (sp.get('status') || '').trim()          // metadata.status review state
  const tag = (sp.get('tag') || '').trim()                // single metadata.tags[] value
  const search = (sp.get('search') || '').trim().toLowerCase()
  const from = sp.get('from')                             // ISO date (inclusive)
  const to = sp.get('to')                                 // ISO date (inclusive end-of-day)
  const sort = sp.get('sort') === 'oldest' ? 'oldest' : 'newest'
  const limit = Math.min(Math.max(parseInt(sp.get('limit') || '50', 10) || 50, 1), 500)
  const offset = Math.max(parseInt(sp.get('offset') || '0', 10) || 0, 0)

  // Build the base query. Date range + DB-level completion status are pushed to
  // Postgres; metadata-derived filters (status/tag/search) are applied in JS
  // because they live inside JSONB and answers, then paginated post-filter.
  let query = supabase
    .from('submissions')
    .select('*')
    .eq('form_id', params.id)
    .order('created_at', { ascending: sort === 'oldest' })

  if (from) {
    const d = new Date(from)
    if (!isNaN(d.getTime())) query = query.gte('created_at', d.toISOString())
  }
  if (to) {
    const d = new Date(to)
    if (!isNaN(d.getTime())) {
      d.setHours(23, 59, 59, 999)
      query = query.lte('created_at', d.toISOString())
    }
  }

  const { data: allRows, error } = await query.limit(10000)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let rows = allRows || []

  // metadata.status filter (review/triage state stored in JSONB).
  if (status) {
    rows = rows.filter((r: any) => (r.metadata?.status || '') === status)
  }

  // metadata.tags[] filter.
  if (tag) {
    rows = rows.filter((r: any) => Array.isArray(r.metadata?.tags) && r.metadata.tags.includes(tag))
  }

  // completion filter — a "complete" submission has its DB status 'completed'
  // (or no payment-pending flag). Partial = anything not completed.
  if (completion === 'complete') {
    rows = rows.filter((r: any) => (r.status || 'completed') === 'completed')
  } else if (completion === 'partial') {
    rows = rows.filter((r: any) => (r.status || 'completed') !== 'completed')
  }

  // Free-text search across answer values (stringified).
  if (search) {
    rows = rows.filter((r: any) => {
      const ans = r.answers || {}
      try {
        return JSON.stringify(ans).toLowerCase().includes(search)
      } catch {
        return false
      }
    })
  }

  const total = rows.length
  const paged = rows.slice(offset, offset + limit)

  // Surface the distinct tags present across the (filtered-by-date) result set
  // so the UI can render tag chips without a second round-trip.
  const tagSet = new Set<string>()
  for (const r of rows as any[]) {
    if (Array.isArray(r.metadata?.tags)) {
      for (const t of r.metadata.tags) if (typeof t === 'string' && t.trim()) tagSet.add(t)
    }
  }

  return NextResponse.json({
    responses: paged,
    total,
    limit,
    offset,
    hasMore: offset + limit < total,
    tags: Array.from(tagSet).sort(),
  })
}

// DELETE /api/forms/[id]/responses - Delete all responses (with confirmation)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
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
    .eq('form_id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
