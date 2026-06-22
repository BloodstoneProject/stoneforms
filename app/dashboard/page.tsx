'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, Eye, BarChart3, Plus, ArrowRight, Loader2, Inbox } from 'lucide-react'
import { GettingStarted } from '@/components/dashboard/GettingStarted'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { PlanId } from '@/lib/plan-limits'

interface FormRow {
  id: string
  title: string
  status: 'draft' | 'published' | 'archived'
  updated_at: string
}

interface Usage {
  forms: { current: number; limit: number }
  responses: { current: number; limit: number }
}

export default function DashboardHome() {
  const [forms, setForms] = useState<FormRow[]>([])
  const [usage, setUsage] = useState<Usage | null>(null)
  const [planName, setPlanName] = useState('Free')
  const [planId, setPlanId] = useState<PlanId>('free')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/forms').then((r) => r.json()).catch(() => ({})),
      fetch('/api/user/plan').then((r) => r.json()).catch(() => ({})),
    ]).then(([formsData, planData]) => {
      if (Array.isArray(formsData.forms)) setForms(formsData.forms)
      if (planData.usage) setUsage(planData.usage)
      if (planData.plan?.name) setPlanName(planData.plan.name)
      if (planData.plan?.id) setPlanId(planData.plan.id as PlanId)
      setLoading(false)
    })
  }, [])

  const createForm = async () => {
    setCreating(true)
    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled Form' }),
      })
      const data = await res.json()
      if (res.ok && data.form) {
        window.location.href = `/dashboard/forms/${data.form.id}`
      } else {
        alert(data.error || 'Could not create form')
        setCreating(false)
      }
    } catch {
      setCreating(false)
    }
  }

  const published = forms.filter((f) => f.status === 'published').length
  const drafts = forms.filter((f) => f.status === 'draft').length
  const recent = [...forms]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5)

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
          <Skeleton className="h-9 w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  // First-run / empty state: a friendly getting-started experience until the
  // user has created their first form. Afterwards we show the normal dashboard.
  if (forms.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">You're on the {planName} plan.</p>
          </div>
          <GettingStarted
            hasForm={false}
            hasPublished={false}
            hasResponse={(usage?.responses.current ?? 0) > 0}
            plan={planId}
            onCreateForm={createForm}
            creating={creating}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">You're on the {planName} plan.</p>
          </div>
          <Button onClick={createForm} disabled={creating}>
            <Plus className="w-4 h-4" /> {creating ? 'Creating…' : 'Create form'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Stat icon={<FileText className="w-5 h-5" />} label="Total forms" value={forms.length} />
          <Stat icon={<Eye className="w-5 h-5" />} label="Published" value={published} />
          <Stat
            icon={<BarChart3 className="w-5 h-5" />}
            label="Responses this month"
            value={usage?.responses.current ?? 0}
          />
        </div>

        {/* Recent forms */}
        <div className="card-surface">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-semibold tracking-tight text-foreground">Recent forms</h2>
            <Link href="/dashboard/forms" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Inbox className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No forms yet. Create your first one.</p>
              <Button onClick={createForm} disabled={creating} size="sm">
                <Plus className="w-4 h-4" /> Create form
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recent.map((form) => (
                <Link
                  key={form.id}
                  href={`/dashboard/forms/${form.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{form.title}</p>
                    <p className="text-xs text-muted-foreground">Updated {new Date(form.updated_at).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={form.status === 'published' ? 'solid' : form.status === 'draft' ? 'outline' : 'default'} className="shrink-0 capitalize">
                    {form.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="card-surface p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-semibold tracking-tight text-foreground mt-1">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-md flex items-center justify-center bg-muted text-muted-foreground">{icon}</div>
      </div>
    </div>
  )
}
