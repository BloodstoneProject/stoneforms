import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { getStripe, priceIdForPlan, type PaidPlan } from '@/lib/stripe'
import { getSiteUrl } from '@/lib/site'

// POST /api/billing/checkout  { plan: 'pro' | 'business' }
// Creates a Stripe Checkout Session and returns its URL.
export async function POST(request: Request) {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: 'Billing is not configured' }, { status: 503 })
  }

  const supabase = createServerSupabaseClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const plan = body.plan as PaidPlan
  if (plan !== 'pro' && plan !== 'business') {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const priceId = priceIdForPlan(plan)
  if (!priceId) {
    return NextResponse.json({ error: `No Stripe price configured for ${plan}` }, { status: 503 })
  }

  // Reuse an existing Stripe customer if we have one; otherwise create it.
  const admin = createAdminClient()
  const { data: sub } = await admin
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle()

  let customerId = sub?.stripe_customer_id || undefined
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email || undefined,
      metadata: { user_id: user.id },
    })
    customerId = customer.id
    await admin
      .from('subscriptions')
      .update({ stripe_customer_id: customerId })
      .eq('user_id', user.id)
  }

  const siteUrl = getSiteUrl()
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: user.id,
    metadata: { user_id: user.id, plan },
    subscription_data: { metadata: { user_id: user.id, plan } },
    success_url: `${siteUrl}/dashboard/settings/billing?status=success`,
    cancel_url: `${siteUrl}/dashboard/settings/billing?status=cancelled`,
    allow_promotion_codes: true,
  })

  return NextResponse.json({ url: session.url })
}
