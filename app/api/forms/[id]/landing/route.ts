// ============================================================================
// /api/forms/[id]/landing — owner-authed read/write of forms.landing (jsonb).
// ============================================================================
// GET  -> the current (normalized) landing config for a form the caller owns.
// PUT  -> sanitize + cap the payload, persist to forms.landing.
// Ownership is verified against auth.getUser() before any read/write.
// ============================================================================
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { defaultLanding, normalizeLanding, sanitizeLandingInput } from '@/lib/landing'

async function getOwnedForm(id: string) {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const { data: form } = await supabase
    .from('forms')
    .select('id, slug, landing, user_id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!form) {
    return { error: NextResponse.json({ error: 'Form not found' }, { status: 404 }) }
  }

  return { supabase, user, form }
}

// GET /api/forms/[id]/landing
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const ctx = await getOwnedForm(params.id)
  if (ctx.error) return ctx.error
  const { form } = ctx

  const landing = form!.landing ? normalizeLanding(form!.landing) : defaultLanding()
  return NextResponse.json({ landing, slug: (form as any)!.slug ?? null })
}

// PUT /api/forms/[id]/landing
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const ctx = await getOwnedForm(params.id)
  if (ctx.error) return ctx.error
  const { supabase, form } = ctx

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Accept either { landing: {...} } or a bare config object.
  const incoming = body && typeof body.landing === 'object' ? body.landing : body
  const clean = sanitizeLandingInput(incoming)

  const { error } = await supabase!
    .from('forms')
    .update({ landing: clean })
    .eq('id', form!.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ landing: clean })
}
