import { createAdminClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const ALLOWED_EVENTS = new Set(['view', 'start', 'step', 'submit'])

// POST /api/public/forms/[id]/events
// Lightweight, anonymous analytics beacon. Since 9 Oct 2026 anon cannot insert
// into form_events directly; this route checks the form is PUBLISHED and writes
// with the service-role client, behind the per-IP limit below.
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Analytics beacons are high-volume but capped per IP. Fail silently (202)
  // when exceeded so the respondent's form is never disrupted.
  const ip = getClientIp(request)
  if (!rateLimit(`events:${ip}`, 100, 60_000).allowed) {
    return NextResponse.json({ ok: false }, { status: 202 })
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const eventType = String(body?.event_type || '')
  if (!ALLOWED_EVENTS.has(eventType)) {
    return NextResponse.json({ error: 'Invalid event_type' }, { status: 400 })
  }

  // Only accept a small, known set of fields. Ignore everything else so the
  // beacon can't be used to write arbitrary data.
  const sessionId = typeof body.session_id === 'string' ? body.session_id.slice(0, 64) : null
  const questionId = typeof body.question_id === 'string' ? body.question_id : null
  const position = Number.isInteger(body.position) ? body.position : null

  const supabase = createAdminClient()
  const { data: published } = await supabase
    .from('forms')
    .select('id')
    .eq('id', params.id)
    .eq('status', 'published')
    .maybeSingle()
  if (!published) {
    return NextResponse.json({ ok: false }, { status: 202 })
  }

  const { error } = await supabase.from('form_events').insert({
    form_id: params.id,
    event_type: eventType,
    session_id: sessionId,
    question_id: questionId,
    position,
  })

  if (error) {
    // Any failure: fail quietly,
    // analytics must never block the respondent.
    return NextResponse.json({ ok: false }, { status: 202 })
  }

  return NextResponse.json({ ok: true })
}
