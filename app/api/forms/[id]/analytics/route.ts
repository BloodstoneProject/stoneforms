import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

// GET /api/forms/[id]/analytics
// Owner-only aggregated analytics for a single form.
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Ownership check.
  const { data: form } = await supabase
    .from('forms')
    .select('id')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!form) {
    return NextResponse.json({ error: 'Form not found' }, { status: 404 })
  }

  // Ordered fields for the drop-off funnel.
  const { data: fields } = await supabase
    .from('form_fields')
    .select('id, label, position')
    .eq('form_id', params.id)
    .order('position', { ascending: true })

  // Accurate top-line totals via count queries (immune to row limits).
  const [{ count: viewCount }, { count: submissionCount }] = await Promise.all([
    supabase.from('form_events').select('id', { count: 'exact', head: true })
      .eq('form_id', params.id).eq('event_type', 'view'),
    supabase.from('submissions').select('id', { count: 'exact', head: true })
      .eq('form_id', params.id),
  ])

  const totalViews = viewCount || 0
  const totalSubmissions = submissionCount || 0
  const completionRate = totalViews > 0 ? Math.round((totalSubmissions / totalViews) * 100) : 0

  // Responses over the last 30 days.
  const since = new Date()
  since.setDate(since.getDate() - 29)
  since.setHours(0, 0, 0, 0)

  const { data: recentSubs } = await supabase
    .from('submissions')
    .select('created_at')
    .eq('form_id', params.id)
    .gte('created_at', since.toISOString())
    .limit(10000)

  const dayBuckets: Record<string, number> = {}
  for (let i = 0; i < 30; i++) {
    const d = new Date(since)
    d.setDate(since.getDate() + i)
    dayBuckets[d.toISOString().slice(0, 10)] = 0
  }
  for (const s of recentSubs || []) {
    const key = new Date(s.created_at).toISOString().slice(0, 10)
    if (key in dayBuckets) dayBuckets[key]++
  }
  const responsesByDay = Object.entries(dayBuckets).map(([date, count]) => ({ date, count }))

  // Per-question drop-off from "step" events: how many distinct sessions
  // reached each question position.
  const { data: stepEvents } = await supabase
    .from('form_events')
    .select('session_id, position')
    .eq('form_id', params.id)
    .eq('event_type', 'step')
    .limit(20000)

  const maxPosBySession: Record<string, number> = {}
  for (const e of stepEvents || []) {
    const sid = e.session_id || 'anon'
    const pos = typeof e.position === 'number' ? e.position : 0
    if (maxPosBySession[sid] === undefined || pos > maxPosBySession[sid]) {
      maxPosBySession[sid] = pos
    }
  }
  const maxValues = Object.values(maxPosBySession)
  const funnel = (fields || []).map((f, index) => {
    const reached = maxValues.filter((m) => m >= index).length
    return { questionId: f.id, label: f.label, position: index, reached }
  })

  // ---- Reactions rollup ----
  // Aggregate metadata.reactions ({ [fieldId]: emoji }) across this form's
  // submissions into per-question emoji counts. Owner-scoped (this route is
  // owner-authed) so RLS lets us read the rows. Old submissions without
  // metadata.reactions simply contribute nothing.
  const { data: reactionRows } = await supabase
    .from('submissions')
    .select('metadata')
    .eq('form_id', params.id)
    .limit(20000)

  const labelById: Record<string, string> = {}
  for (const f of fields || []) labelById[f.id] = f.label || 'Untitled'

  // perQuestion: fieldId -> { emoji -> count }
  const perQuestionCounts: Record<string, Record<string, number>> = {}
  let totalReactions = 0
  for (const row of reactionRows || []) {
    const reactions = (row?.metadata as any)?.reactions
    if (!reactions || typeof reactions !== 'object') continue
    for (const [fieldId, emoji] of Object.entries(reactions)) {
      if (typeof emoji !== 'string') continue
      if (!perQuestionCounts[fieldId]) perQuestionCounts[fieldId] = {}
      perQuestionCounts[fieldId][emoji] = (perQuestionCounts[fieldId][emoji] || 0) + 1
      totalReactions++
    }
  }

  // Shape per question in field order, only including questions that got reactions.
  const reactionQuestions = (fields || [])
    .filter((f) => perQuestionCounts[f.id])
    .map((f) => {
      const counts = perQuestionCounts[f.id]
      const emojis = Object.entries(counts)
        .map(([emoji, count]) => ({ emoji, count }))
        .sort((a, b) => b.count - a.count)
      const total = emojis.reduce((sum, e) => sum + e.count, 0)
      return { questionId: f.id, label: labelById[f.id] || 'Untitled', total, emojis }
    })

  return NextResponse.json({
    totals: { views: totalViews, submissions: totalSubmissions, completionRate },
    responsesByDay,
    funnel,
    fieldCount: (fields || []).length,
    reactions: { total: totalReactions, questions: reactionQuestions },
  })
}
