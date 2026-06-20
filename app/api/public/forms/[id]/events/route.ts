import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

const ALLOWED_EVENTS = new Set(['view', 'start', 'step', 'submit'])

// POST /api/public/forms/[id]/events
// Lightweight, anonymous analytics beacon. RLS only permits inserting events
// for PUBLISHED forms, so this cannot be used to probe draft/private forms.
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
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

  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from('form_events').insert({
    form_id: params.id,
    event_type: eventType,
    session_id: sessionId,
    question_id: questionId,
    position,
  })

  if (error) {
    // RLS rejection (form not published) or other failure — fail quietly,
    // analytics must never block the respondent.
    return NextResponse.json({ ok: false }, { status: 202 })
  }

  return NextResponse.json({ ok: true })
}
