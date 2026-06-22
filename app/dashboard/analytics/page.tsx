'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, Eye, BarChart3, Inbox, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface Form {
  id: string
  title: string
  status: string
  updated_at: string
}

export default function AnalyticsPage() {
  const [forms, setForms] = useState<Form[]>([])
  const [responsesThisMonth, setResponsesThisMonth] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/forms').then((r) => r.json()).catch(() => ({})),
      fetch('/api/user/plan').then((r) => r.json()).catch(() => ({})),
    ]).then(([formsData, planData]) => {
      if (Array.isArray(formsData.forms)) setForms(formsData.forms)
      if (planData.usage?.responses) setResponsesThisMonth(planData.usage.responses.current)
      setLoading(false)
    })
  }, [])

  const published = forms.filter((f) => f.status === 'published')

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
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

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Performance across all your forms</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Stat icon={<FileText className="w-5 h-5" />} label="Total forms" value={forms.length} />
          <Stat icon={<Eye className="w-5 h-5" />} label="Published" value={published.length} />
          <Stat icon={<BarChart3 className="w-5 h-5" />} label="Responses this month" value={responsesThisMonth} />
        </div>

        <div className="card-surface">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold tracking-tight text-foreground">Per-form analytics</h2>
            <Link href="/dashboard/forms" className="text-sm text-muted-foreground hover:text-foreground">All forms</Link>
          </div>
          {forms.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Inbox className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">No forms yet — create one to start collecting analytics.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {forms.map((form) => (
                <Link
                  key={form.id}
                  href={`/dashboard/forms/${form.id}/analytics`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{form.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{form.status}</p>
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground flex items-center gap-1">
                    View <ArrowRight className="w-4 h-4" />
                  </span>
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
