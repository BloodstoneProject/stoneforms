import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { getUserPlan } from '@/lib/plan-enforcement'
import { hasPlanFeature } from '@/lib/plan-limits'
import { getFormAvailability } from '@/lib/form-controls'

// Matches a canonical v4-style UUID (the shape Supabase generates for form ids).
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// GET /api/public/forms/[id]
// Public, unauthenticated read of a PUBLISHED form and its fields.
// The [id] param may be a UUID *or* a vanity slug. When it isn't a UUID we
// resolve the form by slug (case-insensitive). This powers /f/{slug} and the
// subdomain rewrite ({sub}.host -> /f/{sub}).
// Relies on RLS policies ("Public can view published forms" / "...fields of
// published forms"), so anonymous respondents can load the form to fill it in.
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()
  const idParam = params.id

  const baseSelect = 'id, title, description, theme, settings, status, logic, user_id'

  let query = supabase
    .from('forms')
    .select(baseSelect)
    .eq('status', 'published')

  if (UUID_RE.test(idParam)) {
    query = query.eq('id', idParam)
  } else {
    // Vanity slug — unique index is on lower(slug), so match case-insensitively.
    query = query.ilike('slug', idParam)
  }

  const { data: formRow, error: formError } = await query.single()

  if (formError || !formRow) {
    return NextResponse.json({ error: 'Form not available' }, { status: 404 })
  }

  const { data: fields } = await supabase
    .from('form_fields')
    .select('id, field_type, label, placeholder, required, options, position, settings')
    .eq('form_id', formRow.id)
    .order('position', { ascending: true })

  // Compute white-label branding from the form owner's plan (privileged read).
  let hideBranding = false
  try {
    const plan = await getUserPlan((formRow as any).user_id)
    hideBranding = hasPlanFeature(plan, 'remove_branding')
  } catch {
    hideBranding = false
  }

  // Compute open/closed availability (schedule window + response cap). Count
  // this form's submissions with the service-role client (anon can't SELECT them).
  let availability = { open: true } as ReturnType<typeof getFormAvailability>
  try {
    const schedule = ((formRow as any).settings || {}).schedule
    // Only pay for the count query when a cap is configured.
    let responseCount = 0
    if (schedule && typeof schedule.maxResponses === 'number' && schedule.maxResponses > 0) {
      const admin = createAdminClient()
      const { count } = await admin
        .from('submissions')
        .select('id', { count: 'exact', head: true })
        .eq('form_id', formRow.id)
      responseCount = count ?? 0
    }
    availability = getFormAvailability(formRow as any, responseCount)
  } catch {
    availability = { open: true }
  }

  // Don't leak user_id to the public client.
  const { user_id, ...form } = formRow as any

  return NextResponse.json({
    form,
    fields: fields || [],
    branding: { hide: hideBranding },
    availability,
  })
}
