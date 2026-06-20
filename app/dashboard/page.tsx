'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, Eye, BarChart3, Plus, ArrowRight, Loader2, Inbox } from 'lucide-react'

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
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Dashboard</h1>
            <p className="text-stone-600 mt-1">You're on the {planName} plan.</p>
          </div>
          <button
            onClick={createForm}
            disabled={creating}
            className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> {creating ? 'Creating…' : 'Create form'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Stat icon={<FileText className="w-5 h-5" />} label="Total forms" value={forms.length} tint="stone" />
          <Stat icon={<Eye className="w-5 h-5" />} label="Published" value={published} tint="green" />
          <Stat
            icon={<BarChart3 className="w-5 h-5" />}
            label="Responses this month"
            value={usage?.responses.current ?? 0}
            tint="blue"
          />
        </div>

        {/* Recent forms */}
        <div className="bg-white rounded-xl border border-stone-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
            <h2 className="font-bold text-stone-900">Recent forms</h2>
            <Link href="/dashboard/forms" className="text-sm text-stone-600 hover:text-stone-900 flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Inbox className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-600 mb-4">No forms yet. Create your first one.</p>
              <button
                onClick={createForm}
                disabled={creating}
                className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 text-sm disabled:opacity-50"
              >
                <Plus className="w-4 h-4" /> Create form
              </button>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {recent.map((form) => (
                <Link
                  key={form.id}
                  href={`/dashboard/forms/${form.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-stone-50"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-stone-900 truncate">{form.title}</p>
                    <p className="text-xs text-stone-500">Updated {new Date(form.updated_at).toLocaleDateString()}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${
                      form.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : form.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {form.status}
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
