import { NextResponse } from 'next/server'
import { createCheckoutForSubmission } from '@/lib/stripe-connect'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/payments/checkout  { formId, submissionId }
// Public/anon. Creates a Stripe Checkout Session on the form owner's connected
// account for the form's fixed-amount payment field, records a pending
// form_payments row, and returns the hosted checkout URL.
//
// The amount is ALWAYS taken from the field config in the database (never the
// client). Dormant-safe: returns { ok: false } without error when Connect isn't
// configured or the owner isn't connected, so the caller just skips payment.
// The shared helper lives in lib/stripe-connect.ts because Next route modules
// may only export HTTP handlers.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const formId = typeof body.formId === 'string' ? body.formId : null
  const submissionId = typeof body.submissionId === 'string' ? body.submissionId : null

  if (!formId || !submissionId) {
    return NextResponse.json({ error: 'Missing formId or submissionId' }, { status: 400 })
  }

  const result = await createCheckoutForSubmission({ formId, submissionId })
  if (result.ok) {
    return NextResponse.json({ ok: true, checkoutUrl: result.checkoutUrl })
  }
  // Dormant / not-connected / no-payment-field are all non-error outcomes.
  return NextResponse.json({ ok: false, reason: (result as { reason?: string }).reason })
}
