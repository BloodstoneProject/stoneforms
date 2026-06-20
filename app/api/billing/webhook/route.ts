import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe, planForPriceId } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase-server'

// Stripe needs the raw, unparsed body to verify the signature.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function syncSubscription(stripeSub: Stripe.Subscription) {
  const admin = createAdminClient()
  const priceId = stripeSub.items?.data?.[0]?.price?.id
  const plan = planForPriceId(priceId)
  const userId = (stripeSub.metadata as any)?.user_id

  // Period end lives at the top level on most API versions; fall back to the item.
  const periodEnd =
    (stripeSub as any).current_period_end ??
    (stripeSub.items?.data?.[0] as any)?.current_period_end ??
    null
  const periodStart =
    (stripeSub as any).current_period_start ??
    (stripeSub.items?.data?.[0] as any)?.current_period_start ??
    null

  const update = {
    stripe_subscription_id: stripeSub.id,
    stripe_customer_id: typeof stripeSub.customer === 'string' ? stripeSub.customer : stripeSub.customer.id,
    plan_id: plan || 'free',
    status: stripeSub.status,
    cancel_at_period_end: stripeSub.cancel_at_period_end ?? false,
    current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    updated_at: new Date().toISOString(),
  }

  // Prefer matching by user_id (from metadata); else by the Stripe customer id.
  if (userId) {
    await admin.from('subscriptions').update(update).eq('user_id', userId)
  } else {
    await admin.from('subscriptions').update(update).eq('stripe_customer_id', update.stripe_customer_id)
  }
}

export async function POST(request: Request) {
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: 'Billing not configured' }, { status: 503 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const rawBody = await request.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Invalid signature: ${err.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.subscription) {
          const subId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id
          const sub = await stripe.subscriptions.retrieve(subId)
          // Ensure metadata carries user_id from the checkout session.
          if (!sub.metadata?.user_id && session.metadata?.user_id) {
            sub.metadata = { ...sub.metadata, user_id: session.metadata.user_id }
          }
          await syncSubscription(sub)
        }
        break
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        await syncSubscription(event.data.object as Stripe.Subscription)
        break
      }
      default:
        break
    }
  } catch (err) {
    console.error('Stripe webhook handler error:', err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
