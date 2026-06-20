import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getSiteUrl } from '@/lib/site'

// POST /api/billing/portal
// Opens the Stripe Billing Portal so the user can manage / cancel their plan.
export async function POST() {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: 'Billing is not configured' }, { status: 503 })
  }

  const supabase = createServerSupabaseClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { data: sub } = await admin
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!sub?.stripe_customer_id) {
    return NextResponse.json({ error: 'No active subscription to manage' }, { status: 400 })
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${getSiteUrl()}/dashboard/settings/billing`,
  })

  return NextResponse.json({ url: session.url })
}
