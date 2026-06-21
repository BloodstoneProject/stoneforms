'use client'

import { CreditCard, Lock } from 'lucide-react'

interface PaymentFieldProps {
  // Major-unit amount (e.g. 25.00) and currency from the field config.
  amount?: number
  currency?: string
  description?: string
  // Whether the form owner can actually accept payments right now (Connect
  // enabled + onboarded). When false, this is purely informational and the
  // respondent can continue without paying (dormant-safe).
  canAcceptPayments?: boolean
  theme: { primaryColor: string; textColor: string }
}

const CURRENCY_SYMBOL: Record<string, string> = { gbp: '£', usd: '$', eur: '€' }

function formatAmount(amount: number | undefined, currency: string | undefined): string {
  const cur = (currency || 'gbp').toLowerCase()
  const symbol = CURRENCY_SYMBOL[cur] || ''
  const value = Number.isFinite(amount) ? Number(amount) : 0
  return `${symbol}${value.toFixed(2)}`
}

// Read-only payment panel. The respondent doesn't enter card details here —
// they're redirected to Stripe Checkout on final submit. This is just a clear
// "you'll pay X" disclosure shown inline in the flow.
export function PaymentField({ amount, currency, description, canAcceptPayments = true, theme }: PaymentFieldProps) {
  const display = formatAmount(amount, currency)
  return (
    <div
      className="rounded-xl border-2 p-5"
      style={{ borderColor: `${theme.primaryColor}33`, backgroundColor: `${theme.primaryColor}08` }}
    >
      <div className="flex items-start gap-4">
        <span
          className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${theme.primaryColor}14`, color: theme.primaryColor }}
        >
          <CreditCard className="w-5 h-5" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold" style={{ color: theme.textColor }}>
              {display}
            </span>
            <span className="text-sm opacity-60" style={{ color: theme.textColor }}>
              {(currency || 'gbp').toUpperCase()}
            </span>
          </div>
          {description && (
            <p className="text-sm mt-1 opacity-70" style={{ color: theme.textColor }}>
              {description}
            </p>
          )}
          {canAcceptPayments ? (
            <p className="flex items-center gap-1.5 text-xs mt-3 opacity-60" style={{ color: theme.textColor }}>
              <Lock className="w-3.5 h-3.5" />
              You'll be redirected to a secure Stripe checkout after you finish the form.
            </p>
          ) : (
            <p className="text-xs mt-3 opacity-60" style={{ color: theme.textColor }}>
              Online payment isn't available yet. You can still submit this form.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
