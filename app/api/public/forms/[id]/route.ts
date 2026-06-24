import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { getUserPlan } from '@/lib/plan-enforcement'
import { hasPlanFeature } from '@/lib/plan-limits'
import { getFormAvailability } from '@/lib/form-controls'
import { isConnectConfigured } from '@/lib/stripe-connect'

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

  // ---- Password gate (forms.settings.access.password = sha256 hex hash) ----
  // When a password is configured and the provided ?pw= (sha256 hex of the entered
  // password) does not match, respond WITHOUT fields and flag the form as locked.
  // The player renders a password prompt and re-fetches with ?pw= to unlock. Fully
  // dormant when no password is set (today's behaviour, no extra cost).
  {
    const access = ((formRow as any).settings || {}).access
    const expected = typeof access?.password === 'string' ? access.password.trim().toLowerCase() : ''
    if (expected) {
      const url = new URL(request.url)
      const provided = (url.searchParams.get('pw') || '').trim().toLowerCase()
      if (provided !== expected) {
        // Don't leak user_id / fields / real settings to a locked client. Expose
        // only a minimal `locked` hint (on the form AND in settings.access.locked)
        // so the player can render its password prompt without a prop change. Carry
        // the form title through so the prompt isn't blank.
        return NextResponse.json({
          form: {
            id: formRow.id,
            title: (formRow as any).title,
            locked: true,
            theme: (formRow as any).theme || null,
            settings: { access: { locked: true } },
          },
          fields: [],
          branding: { hide: false },
          availability: { open: true },
          payments: { enabled: false },
        })
      }
    }
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

  // Whether the form owner can accept payments right now. Dormant unless Stripe
  // Connect is configured AND the owner has an onboarded (charges_enabled)
  // connected account. Only worth checking when the form actually has a payment
  // field — otherwise this is irrelevant and we skip the extra query.
  let paymentsEnabled = false
  try {
    const hasPaymentField = (fields || []).some((f) => f.field_type === 'payment')
    if (hasPaymentField && isConnectConfigured()) {
      const admin = createAdminClient()
      const { data: acct } = await admin
        .from('connect_accounts')
        .select('charges_enabled')
        .eq('user_id', (formRow as any).user_id)
        .maybeSingle()
      paymentsEnabled = !!acct?.charges_enabled
    }
  } catch {
    paymentsEnabled = false
  }

  // Don't leak user_id to the public client.
  const { user_id, ...form } = formRow as any

  return NextResponse.json({
    form,
    fields: fields || [],
    branding: { hide: hideBranding },
    availability,
    payments: { enabled: paymentsEnabled },
  })
}
