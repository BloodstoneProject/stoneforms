'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CreditCard, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ConnectStatus {
  configured: boolean
  connected: boolean
  chargesEnabled: boolean
  detailsSubmitted: boolean
  accountId?: string
}

export default function PaymentsSettingsPage() {
  const [status, setStatus] = useState<ConnectStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadStatus = async () => {
    try {
      const res = await fetch('/api/payments/connect/status')
      const data = await res.json().catch(() => ({}))
      if (res.ok) setStatus(data)
      else setError(data.error || 'Could not load payment status.')
    } catch {
      setError('Could not load payment status.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStatus()
  }, [])

  const startOnboarding = async () => {
    setStarting(true)
    setError(null)
    try {
      const res = await fetch('/api/payments/connect', { method: 'POST' })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.url) {
        window.location.href = data.url
        return
      }
      setError(data.error || 'Could not start Stripe onboarding.')
    } catch {
      setError('Could not start Stripe onboarding.')
    } finally {
      setStarting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <Link href="/dashboard/settings" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
            <ArrowLeft className="w-4 h-4" /> Settings
          </Link>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">Payments</h1>
          <p className="text-muted-foreground mt-1">Collect payments from respondents on your forms via Stripe.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="card-surface p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Stripe payments</h2>
              <p className="text-sm text-muted-foreground">
                Add a Payment field to a form to charge a fixed amount. Respondents are redirected to a secure Stripe
                checkout when they submit.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-6">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading status…
            </div>
          ) : !status?.configured ? (
            // Dormant: Connect not enabled on the platform yet.
            <div className="rounded-md border border-border bg-muted p-4">
              <p className="text-sm font-medium text-foreground">Payments coming soon</p>
              <p className="text-sm text-muted-foreground mt-1">
                Online payment collection isn't enabled on this account yet. Contact support to turn it on.
              </p>
            </div>
          ) : status.connected && status.chargesEnabled ? (
            <div className="rounded-md border border-border bg-secondary p-4">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <CheckCircle2 className="w-5 h-5" /> Stripe connected — you can accept payments
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Payments on your forms will be deposited to your connected Stripe account.
              </p>
              <button
                onClick={startOnboarding}
                disabled={starting}
                className="mt-3 inline-flex items-center gap-2 text-sm text-foreground underline disabled:opacity-50"
              >
                {starting ? 'Opening…' : 'Update Stripe details'} <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : status.connected ? (
            <div className="rounded-md border border-border bg-muted p-4">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <AlertCircle className="w-5 h-5" /> Onboarding incomplete
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Your Stripe account needs more details before you can accept payments.
              </p>
              <Button onClick={startOnboarding} disabled={starting} size="sm" className="mt-3">
                {starting ? 'Opening…' : 'Continue Stripe onboarding'}
              </Button>
            </div>
          ) : (
            <div>
              <Button onClick={startOnboarding} disabled={starting}>
                {starting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                Connect with Stripe
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                You'll be taken to Stripe to set up payouts, then returned here.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
