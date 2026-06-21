import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { isConnectConfigured, retrieveAccountStatus } from '@/lib/stripe-connect'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/payments/connect/status
// Owner-authed. Refreshes the owner's connected-account status from Stripe,
// persists it, and returns it. Dormant-safe: when Connect isn't configured it
// reports configured:false so the UI shows "Payments coming soon".
export async function GET() {
  const supabase = createServerSupabaseClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isConnectConfigured()) {
    return NextResponse.json({
      configured: false,
      connected: false,
      chargesEnabled: false,
      detailsSubmitted: false,
    })
  }

  const admin = createAdminClient()

  const { data: row } = await admin
    .from('connect_accounts')
    .select('account_id, charges_enabled, details_submitted, status')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!row?.account_id) {
    return NextResponse.json({
      configured: true,
      connected: false,
      chargesEnabled: false,
      detailsSubmitted: false,
    })
  }

  // Refresh live status from Stripe and persist it. If Stripe fails, fall back
  // to the last-known stored values so the UI still renders.
  try {
    const status = await retrieveAccountStatus(row.account_id)
    await admin
      .from('connect_accounts')
      .update({
        charges_enabled: status.chargesEnabled,
        details_submitted: status.detailsSubmitted,
        status: status.chargesEnabled ? 'active' : 'onboarding',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    return NextResponse.json({
      configured: true,
      connected: true,
      accountId: status.accountId,
      chargesEnabled: status.chargesEnabled,
      detailsSubmitted: status.detailsSubmitted,
    })
  } catch (err) {
    console.error('Connect status refresh error:', err)
    return NextResponse.json({
      configured: true,
      connected: true,
      accountId: row.account_id,
      chargesEnabled: !!row.charges_enabled,
      detailsSubmitted: !!row.details_submitted,
    })
  }
}
