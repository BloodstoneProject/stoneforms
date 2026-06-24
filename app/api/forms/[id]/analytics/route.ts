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

  // Ordered fields for the drop-off funnel and per-question breakdowns.
  const { data: fields } = await supabase
    .from('form_fields')
    .select('id, label, position, field_type, options, settings')
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
    .select('answers, metadata')
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

  // ---- Per-question answer breakdowns ----
  // Aggregate from submission.answers (already fetched above as reactionRows).
  // Choice/checkbox/dropdown/picture_choice -> option counts.
  // rating / opinion_scale -> average + distribution.
  // nps -> detractor/passive/promoter buckets + NPS score.
  // yes_no -> yes/no counts.
  const BREAKDOWN_TYPES = new Set([
    'multiple_choice', 'picture_choice', 'dropdown', 'checkboxes', 'ranking',
    'rating', 'opinion_scale', 'nps', 'yes_no', 'consent', 'matrix',
  ])

  // Build option label lookup per field (for picture_choice / choice that store
  // values; we surface the label when available, else the raw value).
  const optionLabel: Record<string, Record<string, string>> = {}
  for (const f of fields || []) {
    if (!Array.isArray((f as any).options)) continue
    const map: Record<string, string> = {}
    for (const opt of (f as any).options as any[]) {
      if (opt && typeof opt === 'object') {
        const val = opt.value ?? opt.label ?? opt.id
        const lab = opt.label ?? opt.text ?? opt.value ?? opt.id
        if (val != null) map[String(val)] = String(lab)
      } else if (opt != null) {
        map[String(opt)] = String(opt)
      }
    }
    optionLabel[f.id] = map
  }

  type QBreakdown =
    | { kind: 'choice'; total: number; options: { label: string; count: number }[] }
    | { kind: 'scale'; total: number; average: number; min: number; max: number; distribution: { value: number; count: number }[] }
    | { kind: 'nps'; total: number; score: number; detractors: number; passives: number; promoters: number }
    | { kind: 'yesno'; total: number; yes: number; no: number }
    | { kind: 'matrix'; total: number; columns: { label: string }[]; rows: { label: string; total: number; counts: { label: string; count: number }[] }[] }

  // Accumulators per field.
  const choiceCounts: Record<string, Record<string, number>> = {}
  const scaleValues: Record<string, number[]> = {}
  const npsAcc: Record<string, { d: number; p: number; pr: number; total: number }> = {}
  const yesNoAcc: Record<string, { yes: number; no: number }> = {}
  // matrix: fieldId -> rowId -> colId -> count, plus a count of responses that answered.
  const matrixAcc: Record<string, { byRow: Record<string, Record<string, number>>; total: number }> = {}

  const toNumber = (v: any): number | null => {
    const n = typeof v === 'number' ? v : Number(v)
    return Number.isFinite(n) ? n : null
  }

  for (const row of reactionRows || []) {
    const answers = (row?.answers as any) || {}
    if (!answers || typeof answers !== 'object') continue
    for (const f of fields || []) {
      if (!BREAKDOWN_TYPES.has(f.field_type)) continue
      const raw = answers[f.id]
      if (raw === null || raw === undefined || raw === '') continue
      const type = f.field_type

      if (type === 'multiple_choice' || type === 'picture_choice' || type === 'dropdown' || type === 'checkboxes' || type === 'ranking') {
        if (!choiceCounts[f.id]) choiceCounts[f.id] = {}
        const vals = Array.isArray(raw) ? raw : [raw]
        for (const v of vals) {
          if (v === null || v === undefined || v === '') continue
          const key = String(v)
          choiceCounts[f.id][key] = (choiceCounts[f.id][key] || 0) + 1
        }
      } else if (type === 'rating' || type === 'opinion_scale') {
        const n = toNumber(raw)
        if (n === null) continue
        if (!scaleValues[f.id]) scaleValues[f.id] = []
        scaleValues[f.id].push(n)
      } else if (type === 'nps') {
        const n = toNumber(raw)
        if (n === null) continue
        if (!npsAcc[f.id]) npsAcc[f.id] = { d: 0, p: 0, pr: 0, total: 0 }
        const acc = npsAcc[f.id]
        acc.total++
        if (n <= 6) acc.d++
        else if (n <= 8) acc.p++
        else acc.pr++
      } else if (type === 'yes_no' || type === 'consent') {
        if (!yesNoAcc[f.id]) yesNoAcc[f.id] = { yes: 0, no: 0 }
        const truthy = raw === true || raw === 'true' || raw === 'Yes' || raw === 'yes' || raw === 1 || raw === '1'
        if (truthy) yesNoAcc[f.id].yes++
        else yesNoAcc[f.id].no++
      } else if (type === 'matrix') {
        // raw = { [rowId]: colId | colId[] }. Tally each row's chosen column(s).
        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) continue
        if (!matrixAcc[f.id]) matrixAcc[f.id] = { byRow: {}, total: 0 }
        const acc = matrixAcc[f.id]
        acc.total++
        for (const [rowId, sel] of Object.entries(raw)) {
          if (sel === null || sel === undefined || sel === '') continue
          if (!acc.byRow[rowId]) acc.byRow[rowId] = {}
          const cols = Array.isArray(sel) ? sel : [sel]
          for (const colId of cols) {
            if (colId === null || colId === undefined || colId === '') continue
            const key = String(colId)
            acc.byRow[rowId][key] = (acc.byRow[rowId][key] || 0) + 1
          }
        }
      }
    }
  }

  // Shape per-question breakdowns in field order; only include answered questions.
  const questionBreakdowns: { questionId: string; label: string; fieldType: string; breakdown: QBreakdown }[] = []
  for (const f of fields || []) {
    const label = labelById[f.id] || 'Untitled'
    const type = f.field_type

    if (choiceCounts[f.id]) {
      const lut = optionLabel[f.id] || {}
      const entries = Object.entries(choiceCounts[f.id])
        .map(([value, count]) => ({ label: lut[value] || value, count }))
        .sort((a, b) => b.count - a.count)
      const total = entries.reduce((s, e) => s + e.count, 0)
      if (total > 0) {
        questionBreakdowns.push({
          questionId: f.id, label, fieldType: type,
          breakdown: { kind: 'choice', total, options: entries },
        })
      }
    } else if (scaleValues[f.id]) {
      const vals = scaleValues[f.id]
      const total = vals.length
      if (total > 0) {
        const sum = vals.reduce((s, v) => s + v, 0)
        const average = Math.round((sum / total) * 100) / 100
        const min = Math.min(...vals)
        const max = Math.max(...vals)
        const distMap: Record<number, number> = {}
        for (const v of vals) distMap[v] = (distMap[v] || 0) + 1
        const distribution = Object.entries(distMap)
          .map(([value, count]) => ({ value: Number(value), count }))
          .sort((a, b) => a.value - b.value)
        questionBreakdowns.push({
          questionId: f.id, label, fieldType: type,
          breakdown: { kind: 'scale', total, average, min, max, distribution },
        })
      }
    } else if (npsAcc[f.id]) {
      const acc = npsAcc[f.id]
      if (acc.total > 0) {
        const score = Math.round(((acc.pr - acc.d) / acc.total) * 100)
        questionBreakdowns.push({
          questionId: f.id, label, fieldType: type,
          breakdown: { kind: 'nps', total: acc.total, score, detractors: acc.d, passives: acc.p, promoters: acc.pr },
        })
      }
    } else if (yesNoAcc[f.id]) {
      const acc = yesNoAcc[f.id]
      const total = acc.yes + acc.no
      if (total > 0) {
        questionBreakdowns.push({
          questionId: f.id, label, fieldType: type,
          breakdown: { kind: 'yesno', total, yes: acc.yes, no: acc.no },
        })
      }
    } else if (matrixAcc[f.id]) {
      const acc = matrixAcc[f.id]
      if (acc.total > 0) {
        const cfg = (f as any).settings?.matrix || {}
        const cfgRows: { id: string; label: string }[] = Array.isArray(cfg.rows) ? cfg.rows : []
        const cfgCols: { id: string; label: string }[] = Array.isArray(cfg.columns) ? cfg.columns : []
        const colLabel = (id: string) => cfgCols.find((c) => c.id === id)?.label || id
        // Per-row column distribution. Prefer configured row order; fall back to
        // any row ids present in the data.
        const rowIds = cfgRows.length ? cfgRows.map((r) => r.id) : Object.keys(acc.byRow)
        const rows = rowIds.map((rowId) => {
          const counts = acc.byRow[rowId] || {}
          const rowTotal = Object.values(counts).reduce((s, n) => s + n, 0)
          const distribution = Object.entries(counts)
            .map(([colId, count]) => ({ label: colLabel(colId), count }))
            .sort((a, b) => b.count - a.count)
          const rowLabel = cfgRows.find((r) => r.id === rowId)?.label || rowId
          return { label: rowLabel, total: rowTotal, counts: distribution }
        })
        questionBreakdowns.push({
          questionId: f.id, label, fieldType: type,
          breakdown: {
            kind: 'matrix',
            total: acc.total,
            columns: cfgCols.map((c) => ({ label: c.label })),
            rows,
          },
        })
      }
    }
  }

  // ---- Source / UTM attribution ----
  // Aggregate metadata.url_params.{source,medium,campaign} across submissions.
  const sourceCounts: Record<string, number> = {}
  const mediumCounts: Record<string, number> = {}
  const campaignCounts: Record<string, number> = {}
  let attributedSubs = 0
  for (const row of reactionRows || []) {
    const up = (row?.metadata as any)?.url_params
    if (!up || typeof up !== 'object') continue
    const source = up.source ?? up.utm_source
    const medium = up.medium ?? up.utm_medium
    const campaign = up.campaign ?? up.utm_campaign
    let touched = false
    if (typeof source === 'string' && source.trim()) { sourceCounts[source] = (sourceCounts[source] || 0) + 1; touched = true }
    if (typeof medium === 'string' && medium.trim()) { mediumCounts[medium] = (mediumCounts[medium] || 0) + 1; touched = true }
    if (typeof campaign === 'string' && campaign.trim()) { campaignCounts[campaign] = (campaignCounts[campaign] || 0) + 1; touched = true }
    if (touched) attributedSubs++
  }
  const toSorted = (m: Record<string, number>) =>
    Object.entries(m).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
  const sources = {
    attributed: attributedSubs,
    bySource: toSorted(sourceCounts),
    byMedium: toSorted(mediumCounts),
    byCampaign: toSorted(campaignCounts),
  }

  return NextResponse.json({
    totals: { views: totalViews, submissions: totalSubmissions, completionRate },
    responsesByDay,
    funnel,
    fieldCount: (fields || []).length,
    reactions: { total: totalReactions, questions: reactionQuestions },
    questionBreakdowns,
    sources,
  })
}
