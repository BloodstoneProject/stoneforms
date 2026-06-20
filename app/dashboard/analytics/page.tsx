'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, Eye, BarChart3, Inbox, Loader2, ArrowRight } from 'lucide-react'

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
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-stone-900">Analytics</h1>
          <p className="text-stone-600 mt-1">Performance across all your forms</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Stat icon={<FileText className="w-5 h-5" />} label="Total forms" value={forms.length} tint="stone" />
          <Stat icon={<Eye className="w-5 h-5" />} label="Published" value={published.length} tint="green" />
          <Stat icon={<BarChart3 className="w-5 h-5" />} label="Responses this month" value={responsesThisMonth} tint="blue" />
        </div>

        <div className="bg-white rounded-xl border border-stone-200">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-bold text-stone-900">Per-form analytics</h2>
            <Link href="/dashboard/forms" className="text-sm text-stone-600 hover:text-stone-900">All forms</Link>
          </div>
          {forms.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Inbox className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-600">No forms yet — create one to start collecting analytics.</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {forms.map((form) => (
                <Link
                  key={form.id}
                  href={`/dashboard/forms/${form.id}/analytics`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-stone-50 group"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-stone-900 truncate">{form.title}</p>
                    <p className="text-xs text-stone-500 capitalize">{form.status}</p>
                  </div>
                  <span className="text-sm text-stone-400 group-hover:text-stone-900 flex items-center gap-1">
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

function Stat({ icon, label, value, tint }: { icon: React.ReactNode; label: string; value: number; tint: 'stone' | 'green' | 'blue' }) {
  const tints: Record<string, string> = {
    stone: 'bg-stone-100 text-stone-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
  }
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-stone-500">{label}</p>
          <p className="text-3xl font-bold text-stone-900 mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tints[tint]}`}>{icon}</div>
      </div>
    </div>
  )
}
