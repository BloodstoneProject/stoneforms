import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase-server'

// Stripe needs the raw, unparsed body to verify the signature.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/payments/webhook
// Stripe Connect webhook. Verifies with STRIPE_CONNECT_WEBHOOK_SECRET. On
// checkout.session.completed it marks the matching form_payments row paid and
// flips the submission to 'completed'. Best-effort and never throws to Stripe
// for handled events (always returns 200 once the signature is valid), so a
// transient DB hiccup doesn't trigger endless Stripe retries on success.
export async function POST(request: Request) {
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET
  // Dormant: without the connect webhook secret configured, do nothing.
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: 'Connect webhooks not configured' }, { status: 503 })
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
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session
        // Only mark paid when the payment actually succeeded.
        if (session.payment_status === 'paid' || event.type === 'checkout.session.async_payment_succeeded') {
          await markPaid(session)
        }
        break
      }
      default:
        break
    }
  } catch (err) {
    // Log but still return 200 — the signature was valid and we don't want
    // Stripe retrying a handled-but-DB-flaky event indefinitely.
    console.error('Connect webhook handler error:', err)
  }

  return NextResponse.json({ received: true })
}

async function markPaid(session: Stripe.Checkout.Session) {
  const admin = createAdminClient()
  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id ?? null
  const submissionId = (session.metadata as any)?.submission_id || null

  // Mark the form_payments row paid (keyed by checkout session id).
  await admin
    .from('form_payments')
    .update({
      status: 'paid',
      payment_intent_id: paymentIntentId,
    })
    .eq('checkout_session_id', session.id)

  // Flip the submission to completed and record the payment in its metadata.
  if (submissionId) {
    try {
      const { data: sub } = await admin
        .from('submissions')
        .select('metadata')
        .eq('id', submissionId)
        .maybeSingle()
      const metadata = { ...((sub?.metadata as any) || {}) }
      metadata.payment = {
        status: 'paid',
        checkout_session_id: session.id,
        payment_intent_id: paymentIntentId,
        amount_total: session.amount_total ?? null,
        currency: session.currency ?? null,
      }
      await admin
        .from('submissions')
        .update({ status: 'completed', metadata })
        .eq('id', submissionId)
    } catch (e) {
      console.error('Submission payment update error:', e)
    }
  }
}
