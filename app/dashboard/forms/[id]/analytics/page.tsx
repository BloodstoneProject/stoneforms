'use client'
import { useParams } from 'next/navigation'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Eye, CheckCircle2, TrendingUp, BarChart3, Loader2 } from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'

interface ReactionQuestion {
  questionId: string
  label: string
  total: number
  emojis: { emoji: string; count: number }[]
}

interface Analytics {
  totals: { views: number; submissions: number; completionRate: number }
  responsesByDay: { date: string; count: number }[]
  funnel: { questionId: string; label: string; position: number; reached: number }[]
  fieldCount: number
  reactions?: { total: number; questions: ReactionQuestion[] }
}

export default function FormAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: formId } = (useParams() as any)
  const [data, setData] = useState<Analytics | null>(null)
  const [formTitle, setFormTitle] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`/api/forms/${formId}`).then((r) => r.json()).catch(() => ({})),
      fetch(`/api/forms/${formId}/analytics`).then((r) => r.json()).catch(() => ({})),
    ])
      .then(([formData, analytics]) => {
        if (formData?.form) setFormTitle(formData.form.title)
        if (analytics?.totals) setData(analytics)
      })
      .finally(() => setLoading(false))
  }, [formId])

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    )
  }

  const totals = data?.totals || { views: 0, submissions: 0, completionRate: 0 }
  const maxReached = Math.max(1, ...(data?.funnel || []).map((f) => f.reached))
  const chartData = (data?.responsesByDay || []).map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
  }))

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/forms/${formId}`} className="text-stone-600 hover:text-stone-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-stone-900">Analytics</h1>
              <p className="text-sm text-stone-600">{formTitle}</p>
            </div>
          </div>
          <Link
            href={`/dashboard/forms/${formId}/responses`}
            className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 text-sm font-medium"
          >
            View responses
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={<Eye className="w-5 h-5" />} label="Views" value={totals.views} tint="stone" />
          <StatCard icon={<CheckCircle2 className="w-5 h-5" />} label="Submissions" value={totals.submissions} tint="green" />
          <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Completion rate" value={`${totals.completionRate}%`} tint="blue" />
        </div>

        {/* Responses over time */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-bold text-stone-900 mb-1">Responses over time</h2>
          <p className="text-sm text-stone-500 mb-6">Last 30 days</p>
          {totals.submissions === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0eee9" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#78716c' }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#78716c' }} tickLine={false} axisLine={false} width={32} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e7e5e4', fontSize: 13 }}
                  labelStyle={{ color: '#1c1917', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="count" name="Responses" stroke="#16a34a" strokeWidth={2} fill="url(#fill)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Drop-off funnel */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-bold text-stone-900 mb-1">Question drop-off</h2>
          <p className="text-sm text-stone-500 mb-6">How many people reached each question</p>
          {(data?.funnel || []).length === 0 ? (
            <EmptyChart message="No questions to analyze yet." />
          ) : (
            <div className="space-y-3">
              {data!.funnel.map((f, i) => {
                const pct = Math.round((f.reached / maxReached) * 100)
                const prev = i > 0 ? data!.funnel[i - 1].reached : f.reached
                const dropped = prev - f.reached
                return (
                  <div key={f.questionId}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-stone-700 truncate pr-4">
                        <span className="text-stone-400 mr-2">{i + 1}.</span>{f.label || 'Untitled'}
                      </span>
                      <span className="text-stone-500 shrink-0">
                        {f.reached} reached
                        {i > 0 && dropped > 0 && (
                          <span className="text-red-500 ml-2">−{dropped}</span>
                        )}
                      </span>
                    </div>
                    <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-stone-900 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Question reactions */}
        {data?.reactions && data.reactions.questions.length > 0 && (
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h2 className="font-bold text-stone-900 mb-1">Question reactions</h2>
            <p className="text-sm text-stone-500 mb-6">
              How people reacted as they answered · {data.reactions.total} total
            </p>
            <div className="space-y-4">
              {data.reactions.questions.map((q, i) => (
                <div key={q.questionId} className="flex items-start justify-between gap-4">
                  <span className="text-sm text-stone-700 truncate pr-2 min-w-0">
                    <span className="text-stone-400 mr-2">{i + 1}.</span>{q.label || 'Untitled'}
                  </span>
                  <div className="flex items-center gap-3 flex-wrap justify-end shrink-0">
                    {q.emojis.map((e) => (
                      <span
                        key={e.emoji}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-full text-sm"
                        title={`${e.count} ${e.count === 1 ? 'reaction' : 'reactions'}`}
                      >
                        <span className="text-base leading-none">{e.emoji}</span>
                        <span className="text-stone-600 tabular-nums">{e.count}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, tint }: { icon: React.ReactNode; label: string; value: string | number; tint: 'stone' | 'green' | 'blue' }) {
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

function EmptyChart({ message = 'No data yet — share your form to start collecting responses.' }: { message?: string }) {
  return (
    <div className="h-[200px] flex flex-col items-center justify-center text-center">
      <BarChart3 className="w-10 h-10 text-stone-300 mb-3" />
      <p className="text-sm text-stone-500 max-w-xs">{message}</p>
    </div>
  )
}
