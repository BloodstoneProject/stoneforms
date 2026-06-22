'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Check, Loader2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface PlanData {
  plan: { id: string; name: string; currency: string; price_gbp: number }
  usage: {
    forms: { current: number; limit: number; percentage: number }
    responses: { current: number; limit: number; percentage: number }
    storage: { current: number; limit: number; percentage: number }
  }
  subscription: { status?: string; current_period_end?: string; cancel_at_period_end?: boolean } | null
}

export default function BillingSettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>}>
      <BillingInner />
    </Suspense>
  )
}

function BillingInner() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status')

  const [data, setData] = useState<PlanData | null>(null)
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/user/plan')
      .then((r) => r.json())
      .then((d) => { if (d.plan) setData(d) })
      .finally(() => setLoading(false))
  }, [])

  const startCheckout = async (plan: 'pro' | 'business') => {
    setWorking(true)
    setError(null)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const d = await res.json()
      if (res.ok && d.url) { window.location.href = d.url; return }
      setError(d.error || 'Could not start checkout.')
    } catch {
      setError('Could not start checkout.')
    } finally {
      setWorking(false)
    }
  }

  const openPortal = async () => {
    setWorking(true)
    setError(null)
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' })
      const d = await res.json()
      if (res.ok && d.url) { window.location.href = d.url; return }
      setError(d.error || 'Could not open billing portal.')
    } catch {
      setError('Could not open billing portal.')
    } finally {
      setWorking(false)
    }
  }

  const isPaid = data?.plan.id === 'pro' || data?.plan.id === 'business'

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center gap-4">
          <Link href="/dashboard/settings" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Billing & Subscription</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your plan</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {status === 'success' && (
          <div className="p-4 card-surface bg-secondary text-foreground text-sm">
            Your subscription is active. It may take a few seconds to reflect below.
          </div>
        )}
        {status === 'cancelled' && (
          <div className="p-4 card-surface bg-muted text-muted-foreground text-sm">
            Checkout cancelled — no changes were made.
          </div>
        )}
        {error && (
          <div className="p-4 card-surface bg-destructive/10 text-destructive text-sm">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
        ) : !data ? (
          <p className="text-muted-foreground">Could not load your plan.</p>
        ) : (
          <>
            {/* Current plan */}
            <div className="card-surface p-6">
              <h2 className="text-lg font-semibold tracking-tight text-foreground mb-4">Current plan</h2>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-semibold tracking-tight text-foreground">{data.plan.name}</h3>
                    <Badge variant="solid" className="capitalize">
                      {data.subscription?.status || 'active'}
                    </Badge>
                  </div>
                  {data.plan.id !== 'free' && (
                    <p className="text-muted-foreground">£{data.plan.price_gbp} / month</p>
                  )}
                  {data.subscription?.cancel_at_period_end && data.subscription.current_period_end && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Cancels on {new Date(data.subscription.current_period_end).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {isPaid && (
                  <Button variant="outline" onClick={openPortal} disabled={working} size="sm">
                    {working ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                    Manage billing
                  </Button>
                )}
              </div>

              {/* Usage */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                <UsageBar label="Forms" {...data.usage.forms} />
                <UsageBar label="Responses (mo)" {...data.usage.responses} />
                <UsageBar label="Storage (MB)" {...data.usage.storage} />
              </div>
            </div>

            {/* Upgrade options (only on free) */}
            {!isPaid && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PlanCard
                  name="Pro" price="£15" tagline="For growing businesses"
                  features={['Unlimited forms', '10,000 responses/mo', 'Email notifications', 'Remove branding']}
                  onSelect={() => startCheckout('pro')} working={working}
                />
                <PlanCard
                  name="Business" price="£25" tagline="For teams & power users"
                  features={['Everything in Pro', 'Unlimited responses', 'Webhooks & API', 'Custom domains', 'Priority support']}
                  onSelect={() => startCheckout('business')} working={working} highlight
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function UsageBar({ label, current, limit, percentage }: { label: string; current: number; limit: number; percentage: number }) {
  const unlimited = limit >= 999999
  const pct = unlimited ? 0 : Math.min(100, percentage)
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground font-medium">{current}{unlimited ? '' : ` / ${limit}`}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${pct > 90 ? 'bg-destructive' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function PlanCard({ name, price, tagline, features, onSelect, working, highlight }: {
  name: string; price: string; tagline: string; features: string[]; onSelect: () => void; working: boolean; highlight?: boolean
}) {
  return (
    <div className={`card-surface p-6 ${highlight ? 'border-foreground ring-1 ring-foreground' : ''}`}>
      <h3 className="text-xl font-semibold tracking-tight text-foreground">{name}</h3>
      <p className="text-sm text-muted-foreground mb-3">{tagline}</p>
      <p className="text-3xl font-semibold tracking-tight text-foreground mb-4">{price}<span className="text-base font-normal text-muted-foreground"> /mo</span></p>
      <ul className="space-y-2 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-foreground">
            <Check className="w-4 h-4 text-muted-foreground shrink-0" /> {f}
          </li>
        ))}
      </ul>
      <Button
        onClick={onSelect}
        disabled={working}
        variant={highlight ? 'default' : 'outline'}
        className="w-full"
      >
        {working ? 'Working…' : `Upgrade to ${name}`}
      </Button>
    </div>
  )
}
