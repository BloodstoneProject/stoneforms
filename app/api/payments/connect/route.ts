import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import {
  isConnectConfigured,
  ensureConnectedAccount,
  createAccountLink,
} from '@/lib/stripe-connect'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/payments/connect
// Owner-authed. Starts (or resumes) Stripe Express onboarding and returns the
// hosted account-link URL to redirect the owner to. Dormant-safe: returns 503
// when Connect isn't configured so the UI can show "Payments coming soon".
export async function POST() {
  if (!isConnectConfigured()) {
    return NextResponse.json({ error: 'Stripe Connect is not configured' }, { status: 503 })
  }

  const supabase = createServerSupabaseClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()

  try {
    // Reuse an existing connected account if we already created one.
    const { data: existing } = await admin
      .from('connect_accounts')
      .select('account_id')
      .eq('user_id', user.id)
      .maybeSingle()

    const accountId = await ensureConnectedAccount({
      existingAccountId: existing?.account_id ?? null,
      email: user.email ?? null,
      userId: user.id,
    })

    // Persist the account id (upsert so the row exists for status reads later).
    await admin
      .from('connect_accounts')
      .upsert(
        {
          user_id: user.id,
          account_id: accountId,
          status: 'onboarding',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )

    const url = await createAccountLink(accountId)
    return NextResponse.json({ url })
  } catch (err: any) {
    console.error('Connect onboarding error:', err)
    return NextResponse.json({ error: 'Could not start Stripe onboarding' }, { status: 500 })
  }
}
