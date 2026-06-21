'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CreditCard, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react'

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
    <div className="min-h-screen bg-stone-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="bg-white border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <Link href="/dashboard/settings" className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-3">
            <ArrowLeft className="w-4 h-4" /> Settings
          </Link>
          <h1 className="text-3xl font-bold text-stone-900">Payments</h1>
          <p className="text-stone-600 mt-1">Collect payments from respondents on your forms via Stripe.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white border border-stone-200 rounded-lg p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6 text-stone-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">Stripe payments</h2>
              <p className="text-sm text-stone-600">
                Add a Payment field to a form to charge a fixed amount. Respondents are redirected to a secure Stripe
                checkout when they submit.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-stone-500 py-6">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading status…
            </div>
          ) : !status?.configured ? (
            // Dormant: Connect not enabled on the platform yet.
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm font-medium text-stone-800">Payments coming soon</p>
              <p className="text-sm text-stone-600 mt-1">
                Online payment collection isn't enabled on this account yet. Contact support to turn it on.
              </p>
            </div>
          ) : status.connected && status.chargesEnabled ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2 text-green-800 font-medium">
                <CheckCircle2 className="w-5 h-5" /> Stripe connected — you can accept payments
              </div>
              <p className="text-sm text-green-700 mt-1">
                Payments on your forms will be deposited to your connected Stripe account.
              </p>
              <button
                onClick={startOnboarding}
                disabled={starting}
                className="mt-3 inline-flex items-center gap-2 text-sm text-green-800 underline disabled:opacity-50"
              >
                {starting ? 'Opening…' : 'Update Stripe details'} <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : status.connected ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-amber-800 font-medium">
                <AlertCircle className="w-5 h-5" /> Onboarding incomplete
              </div>
              <p className="text-sm text-amber-700 mt-1">
                Your Stripe account needs more details before you can accept payments.
              </p>
              <button
                onClick={startOnboarding}
                disabled={starting}
                className="mt-3 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 text-sm disabled:opacity-50"
              >
                {starting ? 'Opening…' : 'Continue Stripe onboarding'}
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={startOnboarding}
                disabled={starting}
                className="px-4 py-2.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800 text-sm font-medium disabled:opacity-50 inline-flex items-center gap-2"
              >
                {starting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                Connect with Stripe
              </button>
              <p className="text-xs text-stone-400 mt-2">
                You'll be taken to Stripe to set up payouts, then returned here.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-center gap-2 text-sm text-red-700">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
