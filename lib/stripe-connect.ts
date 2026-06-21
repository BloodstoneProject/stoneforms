// Stripe Connect helpers — collecting payments on behalf of form owners.
//
// This is DORMANT by default. Even though STRIPE_SECRET_KEY is set in prod (it
// powers subscription billing), Connect features only activate once Lewis:
//   1. enables Stripe Connect on the platform account, and
//   2. sets STRIPE_CONNECT_ENABLED=true (default off).
//
// Until then `isConnectConfigured()` returns false and every Connect surface
// degrades gracefully: the builder shows "Connect Stripe to accept payments",
// the public form treats the payment field as informational/skippable, and the
// owner onboarding UI shows "Payments coming soon". Forms without a payment
// field are entirely unaffected — none of this code runs for them.

import { getStripe } from '@/lib/stripe'
import { getSiteUrl } from '@/lib/site'
import { createAdminClient } from '@/lib/supabase-server'

// True only when the platform secret key is present AND Connect has been turned
// on via env. This single gate keeps the whole feature dormant.
export function isConnectConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY) && process.env.STRIPE_CONNECT_ENABLED === 'true'
}

export type ConnectCurrency = 'gbp' | 'usd' | 'eur'

const ALLOWED_CURRENCIES: ConnectCurrency[] = ['gbp', 'usd', 'eur']

export function normalizeCurrency(input: unknown): ConnectCurrency {
  const c = typeof input === 'string' ? input.toLowerCase() : ''
  return (ALLOWED_CURRENCIES as string[]).includes(c) ? (c as ConnectCurrency) : 'gbp'
}

// Shape stored on a payment field at field.settings.payment.
export interface PaymentFieldConfig {
  amount: number // major units, e.g. 25.00
  currency: ConnectCurrency
  description?: string
  label?: string
}

// Read + sanitize the payment config off a field's settings JSONB. Returns null
// when the field has no usable (positive) amount configured.
export function readPaymentConfig(settings: Record<string, any> | null | undefined): PaymentFieldConfig | null {
  const raw = (settings || {}).payment
  if (!raw || typeof raw !== 'object') return null
  const amount = Number(raw.amount)
  if (!Number.isFinite(amount) || amount <= 0) return null
  return {
    amount,
    currency: normalizeCurrency(raw.currency),
    description: typeof raw.description === 'string' ? raw.description : undefined,
    label: typeof raw.label === 'string' ? raw.label : undefined,
  }
}

// Convert a major-unit amount (e.g. 25.00) to the integer minor units Stripe
// expects (e.g. 2500). All supported currencies are 2-decimal.
export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100)
}

// Ensure the user has a Stripe Express connected account, returning its id.
// Creates one on first call. Throws when Connect isn't configured.
export async function ensureConnectedAccount(opts: {
  existingAccountId?: string | null
  email?: string | null
  userId: string
}): Promise<string> {
  const stripe = getStripe()
  if (!stripe || !isConnectConfigured()) {
    throw new Error('Stripe Connect is not configured')
  }
  if (opts.existingAccountId) return opts.existingAccountId

  const account = await stripe.accounts.create({
    type: 'express',
    email: opts.email || undefined,
    metadata: { user_id: opts.userId },
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  })
  return account.id
}

// Create an onboarding / re-onboarding account link for an Express account.
export async function createAccountLink(accountId: string): Promise<string> {
  const stripe = getStripe()
  if (!stripe || !isConnectConfigured()) {
    throw new Error('Stripe Connect is not configured')
  }
  const siteUrl = getSiteUrl()
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${siteUrl}/dashboard/settings/payments?refresh=1`,
    return_url: `${siteUrl}/dashboard/settings/payments?connected=1`,
    type: 'account_onboarding',
  })
  return link.url
}

export interface ConnectAccountStatus {
  accountId: string
  chargesEnabled: boolean
  detailsSubmitted: boolean
}

// Retrieve the live onboarding status of a connected account.
export async function retrieveAccountStatus(accountId: string): Promise<ConnectAccountStatus> {
  const stripe = getStripe()
  if (!stripe || !isConnectConfigured()) {
    throw new Error('Stripe Connect is not configured')
  }
  const account = await stripe.accounts.retrieve(accountId)
  return {
    accountId: account.id,
    chargesEnabled: Boolean(account.charges_enabled),
    detailsSubmitted: Boolean(account.details_submitted),
  }
}

// Create a Checkout Session on the owner's connected account for a fixed-amount
// payment. The amount is taken from the server-side field config (never the
// client). Returns the hosted Checkout URL the respondent is redirected to.
export async function createCheckoutSession(opts: {
  connectedAccountId: string
  config: PaymentFieldConfig
  formId: string
  submissionId: string
  successUrl: string
  cancelUrl: string
}): Promise<{ id: string; url: string | null; paymentIntentId: string | null }> {
  const stripe = getStripe()
  if (!stripe || !isConnectConfigured()) {
    throw new Error('Stripe Connect is not configured')
  }

  const session = await stripe.checkout.sessions.create(
    {
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: opts.config.currency,
            unit_amount: toMinorUnits(opts.config.amount),
            product_data: {
              name: opts.config.label || opts.config.description || 'Payment',
              ...(opts.config.description ? { description: opts.config.description } : {}),
            },
          },
        },
      ],
      // No platform application fee for the fixed-amount model. (Omit
      // payment_intent_data entirely rather than send application_fee_amount: 0.)
      success_url: opts.successUrl,
      cancel_url: opts.cancelUrl,
      metadata: {
        form_id: opts.formId,
        submission_id: opts.submissionId,
      },
    },
    { stripeAccount: opts.connectedAccountId }
  )

  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id ?? null

  return { id: session.id, url: session.url, paymentIntentId }
}

export type CheckoutResult =
  | { ok: true; checkoutUrl: string | null }
  | { ok: false; reason: string }

// Shared by the standalone checkout route AND the submit route. Looks up the
// form's payment field + owner connected account, creates the Checkout Session
// on that account, and records a pending form_payments row. Returns ok:false
// (no throw) for any dormant / not-ready condition so callers degrade cleanly.
// Lives in lib/ (not a route file) because Next route modules may only export
// HTTP handlers.
export async function createCheckoutForSubmission(opts: {
  formId: string
  submissionId: string
}): Promise<CheckoutResult> {
  if (!isConnectConfigured()) return { ok: false, reason: 'connect_not_configured' }

  const admin = createAdminClient()

  // Resolve the form owner.
  const { data: form } = await admin
    .from('forms')
    .select('id, user_id')
    .eq('id', opts.formId)
    .maybeSingle()
  if (!form?.user_id) return { ok: false, reason: 'form_not_found' }

  // Find the first payment field on the form with a valid config.
  const { data: fields } = await admin
    .from('form_fields')
    .select('id, field_type, settings')
    .eq('form_id', opts.formId)
    .eq('field_type', 'payment')
    .order('position', { ascending: true })

  let config = null as PaymentFieldConfig | null
  for (const f of fields || []) {
    config = readPaymentConfig(f.settings as any)
    if (config) break
  }
  if (!config) return { ok: false, reason: 'no_payment_field' }

  // The owner must have an onboarded connected account.
  const { data: acct } = await admin
    .from('connect_accounts')
    .select('account_id, charges_enabled')
    .eq('user_id', form.user_id)
    .maybeSingle()
  if (!acct?.account_id || !acct.charges_enabled) {
    return { ok: false, reason: 'owner_not_connected' }
  }

  const siteUrl = getSiteUrl()
  try {
    const session = await createCheckoutSession({
      connectedAccountId: acct.account_id,
      config,
      formId: opts.formId,
      submissionId: opts.submissionId,
      successUrl: `${siteUrl}/f/${opts.formId}?paid=1`,
      cancelUrl: `${siteUrl}/f/${opts.formId}?canceled=1`,
    })

    // Record a pending payment row keyed by the checkout session for webhook
    // reconciliation. Best-effort — a failed insert must not block checkout.
    try {
      await admin.from('form_payments').insert({
        form_id: opts.formId,
        submission_id: opts.submissionId,
        checkout_session_id: session.id,
        payment_intent_id: session.paymentIntentId,
        amount: toMinorUnits(config.amount),
        currency: config.currency,
        status: 'pending',
      })
    } catch (e) {
      console.error('form_payments insert error:', e)
    }

    return { ok: true, checkoutUrl: session.url }
  } catch (err) {
    console.error('Checkout session create error:', err)
    return { ok: false, reason: 'stripe_error' }
  }
}
