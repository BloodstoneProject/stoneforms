// Stripe server client + plan/price mapping. Lazily initialized so the app
// builds and runs without Stripe configured (billing simply stays disabled).

import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null
  if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  return _stripe
}

export type PaidPlan = 'pro' | 'business'

// Stripe Price IDs are created in the Stripe dashboard and supplied via env.
export function priceIdForPlan(plan: PaidPlan): string | undefined {
  if (plan === 'pro') return process.env.STRIPE_PRICE_PRO
  if (plan === 'business') return process.env.STRIPE_PRICE_BUSINESS
  return undefined
}

export function planForPriceId(priceId: string | undefined | null): PaidPlan | null {
  if (!priceId) return null
  if (priceId === process.env.STRIPE_PRICE_PRO) return 'pro'
  if (priceId === process.env.STRIPE_PRICE_BUSINESS) return 'business'
  return null
}
