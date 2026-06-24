'use client'
import { useParams } from 'next/navigation'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Eye, CheckCircle2, TrendingUp, BarChart3, Loader2 } from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'

interface ReactionQuestion {
  questionId: string
  label: string
  total: number
  emojis: { emoji: string; count: number }[]
}

type QBreakdown =
  | { kind: 'choice'; total: number; options: { label: string; count: number }[] }
  | { kind: 'scale'; total: number; average: number; min: number; max: number; distribution: { value: number; count: number }[] }
  | { kind: 'nps'; total: number; score: number; detractors: number; passives: number; promoters: number }
  | { kind: 'yesno'; total: number; yes: number; no: number }

interface QuestionBreakdown {
  questionId: string
  label: string
  fieldType: string
  breakdown: QBreakdown
}

interface SourceBucket { name: string; count: number }

interface Analytics {
  totals: { views: number; submissions: number; completionRate: number }
  responsesByDay: { date: string; count: number }[]
  funnel: { questionId: string; label: string; position: number; reached: number }[]
  fieldCount: number
  reactions?: { total: number; questions: ReactionQuestion[] }
  questionBreakdowns?: QuestionBreakdown[]
  sources?: { attributed: number; bySource: SourceBucket[]; byMedium: SourceBucket[]; byCampaign: SourceBucket[] }
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/forms/${formId}`} aria-label="Back to form builder" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl heading-tight text-foreground">Analytics</h1>
              <p className="text-sm text-muted-foreground">{formTitle}</p>
            </div>
          </div>
          <Link
            href={`/dashboard/forms/${formId}/responses`}
            className="px-4 py-2 border border-border rounded-md hover:bg-secondary text-sm font-medium"
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
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="heading-tight text-foreground mb-1">Responses over time</h2>
          <p className="text-sm text-muted-foreground mb-6">Last 30 days</p>
          {totals.submissions === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} width={32} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 13, color: 'hsl(var(--foreground))' }}
                  labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="count" name="Responses" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#fill)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Drop-off funnel */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="heading-tight text-foreground mb-1">Question drop-off</h2>
          <p className="text-sm text-muted-foreground mb-6">How many people reached each question</p>
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
                      <span className="text-foreground truncate pr-4">
                        <span className="text-muted-foreground mr-2">{i + 1}.</span>{f.label || 'Untitled'}
                      </span>
                      <span className="text-muted-foreground shrink-0">
                        {f.reached} reached
                        {i > 0 && dropped > 0 && (
                          <span className="text-destructive ml-2">−{dropped}</span>
                        )}
                      </span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Per-question answer breakdowns */}
        {data?.questionBreakdowns && data.questionBreakdowns.length > 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="heading-tight text-foreground mb-1">Answer breakdown</h2>
              <p className="text-sm text-muted-foreground">How people answered each question</p>
            </div>
            {data.questionBreakdowns.map((q, i) => (
              <QuestionCard key={q.questionId} q={q} index={i} />
            ))}
          </div>
        )}

        {/* Source / UTM attribution */}
        {data?.sources && data.sources.attributed > 0 && (
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="heading-tight text-foreground mb-1">Traffic sources</h2>
            <p className="text-sm text-muted-foreground mb-6">
              UTM attribution · {data.sources.attributed} attributed {data.sources.attributed === 1 ? 'response' : 'responses'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SourceList title="Source" buckets={data.sources.bySource} />
              <SourceList title="Medium" buckets={data.sources.byMedium} />
              <SourceList title="Campaign" buckets={data.sources.byCampaign} />
            </div>
          </div>
        )}

        {/* Question reactions */}
        {data?.reactions && data.reactions.questions.length > 0 && (
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="heading-tight text-foreground mb-1">Question reactions</h2>
            <p className="text-sm text-muted-foreground mb-6">
              How people reacted as they answered · {data.reactions.total} total
            </p>
            <div className="space-y-4">
              {data.reactions.questions.map((q, i) => (
                <div key={q.questionId} className="flex items-start justify-between gap-4">
                  <span className="text-sm text-foreground truncate pr-2 min-w-0">
                    <span className="text-muted-foreground mr-2">{i + 1}.</span>{q.label || 'Untitled'}
                  </span>
                  <div className="flex items-center gap-3 flex-wrap justify-end shrink-0">
                    {q.emojis.map((e) => (
                      <span
                        key={e.emoji}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary border border-border rounded-full text-sm"
                        title={`${e.count} ${e.count === 1 ? 'reaction' : 'reactions'}`}
                      >
                        <span className="text-base leading-none">{e.emoji}</span>
                        <span className="text-muted-foreground tabular-nums">{e.count}</span>
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
    stone: 'bg-secondary text-muted-foreground',
    green: 'bg-secondary text-muted-foreground',
    blue: 'bg-secondary text-muted-foreground',
  }
  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl heading-tight text-foreground mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-md flex items-center justify-center ${tints[tint]}`}>{icon}</div>
      </div>
    </div>
  )
}

const BAR_TOOLTIP = {
  background: 'hsl(var(--card))', borderRadius: 8, border: '1px solid hsl(var(--border))',
  fontSize: 13, color: 'hsl(var(--foreground))',
} as const

function QuestionCard({ q, index }: { q: QuestionBreakdown; index: number }) {
  const b = q.breakdown
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-start justify-between gap-4 mb-1">
        <h3 className="text-foreground font-medium">
          <span className="text-muted-foreground mr-2">{index + 1}.</span>{q.label || 'Untitled'}
        </h3>
        <span className="text-xs text-muted-foreground shrink-0 mt-1 tabular-nums">
          {b.total} {b.total === 1 ? 'answer' : 'answers'}
        </span>
      </div>

      {b.kind === 'choice' && (
        <div className="mt-4 space-y-2">
          {b.options.map((o) => {
            const pct = b.total > 0 ? Math.round((o.count / b.total) * 100) : 0
            return (
              <div key={o.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-foreground truncate pr-4">{o.label}</span>
                  <span className="text-muted-foreground shrink-0 tabular-nums">{o.count} · {pct}%</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {b.kind === 'scale' && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Average <span className="text-foreground font-medium tabular-nums">{b.average}</span>
            <span className="mx-1">·</span>range {b.min}–{b.max}
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={b.distribution} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="value" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} width={32} />
              <Tooltip contentStyle={BAR_TOOLTIP} labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }} cursor={{ fill: 'hsl(var(--secondary))' }} />
              <Bar dataKey="count" name="Responses" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {b.kind === 'nps' && (
        <div className="mt-4">
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl heading-tight text-foreground tabular-nums">{b.score}</span>
            <span className="text-sm text-muted-foreground">NPS score</span>
          </div>
          <div className="h-4 rounded-full overflow-hidden flex bg-secondary">
            {b.detractors > 0 && <div className="h-full" style={{ width: `${(b.detractors / b.total) * 100}%`, backgroundColor: '#ef4444' }} title={`Detractors: ${b.detractors}`} />}
            {b.passives > 0 && <div className="h-full" style={{ width: `${(b.passives / b.total) * 100}%`, backgroundColor: '#f59e0b' }} title={`Passives: ${b.passives}`} />}
            {b.promoters > 0 && <div className="h-full" style={{ width: `${(b.promoters / b.total) * 100}%`, backgroundColor: '#22c55e' }} title={`Promoters: ${b.promoters}`} />}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
            <span><span className="inline-block w-2 h-2 rounded-full mr-1 align-middle" style={{ backgroundColor: '#ef4444' }} />Detractors (0–6): {b.detractors}</span>
            <span><span className="inline-block w-2 h-2 rounded-full mr-1 align-middle" style={{ backgroundColor: '#f59e0b' }} />Passives (7–8): {b.passives}</span>
            <span><span className="inline-block w-2 h-2 rounded-full mr-1 align-middle" style={{ backgroundColor: '#22c55e' }} />Promoters (9–10): {b.promoters}</span>
          </div>
        </div>
      )}

      {b.kind === 'yesno' && (
        <div className="mt-4 space-y-2">
          {[{ label: 'Yes', count: b.yes, color: '#22c55e' }, { label: 'No', count: b.no, color: '#ef4444' }].map((row) => {
            const pct = b.total > 0 ? Math.round((row.count / b.total) * 100) : 0
            return (
              <div key={row.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-foreground">{row.label}</span>
                  <span className="text-muted-foreground shrink-0 tabular-nums">{row.count} · {pct}%</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: row.color }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function SourceList({ title, buckets }: { title: string; buckets: SourceBucket[] }) {
  const total = buckets.reduce((s, b) => s + b.count, 0)
  return (
    <div>
      <p className="text-sm font-medium text-foreground mb-3">{title}</p>
      {buckets.length === 0 ? (
        <p className="text-sm text-muted-foreground">No data</p>
      ) : (
        <div className="space-y-2">
          {buckets.slice(0, 8).map((b) => {
            const pct = total > 0 ? Math.round((b.count / total) * 100) : 0
            return (
              <div key={b.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-foreground truncate pr-2">{b.name}</span>
                  <span className="text-muted-foreground shrink-0 tabular-nums">{b.count}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function EmptyChart({ message = 'No data yet — share your form to start collecting responses.' }: { message?: string }) {
  return (
    <div className="h-[200px] flex flex-col items-center justify-center text-center">
      <BarChart3 className="w-10 h-10 text-muted-foreground mb-3" />
      <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
    </div>
  )
}
