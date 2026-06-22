'use client'
import { useParams } from 'next/navigation'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Save, Eye, Zap, Loader2, ArrowRight } from 'lucide-react'
import { LOGIC_OPERATORS, type LogicRule, type LogicOperator } from '@/lib/logic'

interface QuestionRef { id: string; label: string; type: string }

export default function ConditionalLogicPage() {
  const { id } = (useParams() as any)
  const [form, setForm] = useState<{ id: string; title: string } | null>(null)
  const [questions, setQuestions] = useState<QuestionRef[]>([])
  const [rules, setRules] = useState<LogicRule[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [formRes, fieldsRes] = await Promise.all([
          fetch(`/api/forms/${id}`).then((r) => r.json()),
          fetch(`/api/forms/${id}/fields`).then((r) => r.json()),
        ])
        if (formRes.form) {
          setForm(formRes.form)
          if (Array.isArray(formRes.form.logic)) setRules(formRes.form.logic)
        }
        if (Array.isArray(fieldsRes.fields)) {
          setQuestions(fieldsRes.fields.map((f: any) => ({ id: f.id, label: f.label, type: f.field_type })))
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const label = (qid: string) => questions.find((q) => q.id === qid)?.label || 'a question'

  const addRule = () => {
    if (questions.length === 0) return
    setRules([...rules, {
      id: `${Date.now()}`,
      field: questions[0].id,
      operator: 'equals',
      value: '',
      jumpTo: questions[questions.length - 1].id,
    }])
  }
  const update = (id: string, patch: Partial<LogicRule>) =>
    setRules(rules.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  const remove = (id: string) => setRules(rules.filter((r) => r.id !== id))

  const save = async () => {
    setSaving(true); setSaved(false)
    const res = await fetch(`/api/forms/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ logic: rules }),
    })
    setSaving(false)
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  }

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
  if (!form) return <div className="p-8">Form not found</div>

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card text-card-foreground border-b border-border sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/forms/${id}`} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></Link>
            <div>
              <h1 className="text-xl heading-tight text-foreground">Logic</h1>
              <p className="text-sm text-muted-foreground">{form.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/f/${id}`} target="_blank" className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-secondary text-sm"><Eye className="w-4 h-4" /> Preview</Link>
            <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm font-medium disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save logic'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-secondary border border-border rounded-lg p-5 mb-6 flex items-start gap-3">
          <Zap className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            Jump logic skips respondents to a later question (or ends the form) based on their answers.
            Rules are checked in order; the first match wins. This runs live in the player.
          </p>
        </div>

        {questions.length === 0 ? (
          <div className="card-surface p-10 text-center text-muted-foreground">
            Add some fields to your form first, then come back to set up logic.
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {rules.map((rule, idx) => {
                const op = LOGIC_OPERATORS.find((o) => o.value === rule.operator)
                return (
                  <div key={rule.id} className="card-surface p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold text-muted-foreground">RULE {idx + 1}</span>
                      <button onClick={() => remove(rule.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 bg-secondary text-foreground rounded font-semibold">IF</span>
                        <select value={rule.field} onChange={(e) => update(rule.id, { field: e.target.value })} className="border border-input rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:border-foreground flex-1 min-w-[140px]">
                          {questions.map((q) => <option key={q.id} value={q.id}>{q.label}</option>)}
                        </select>
                        <select value={rule.operator} onChange={(e) => update(rule.id, { operator: e.target.value as LogicOperator })} className="border border-input rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:border-foreground">
                          {LOGIC_OPERATORS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        {op?.needsValue && (
                          <input type="text" value={rule.value || ''} onChange={(e) => update(rule.id, { value: e.target.value })} placeholder="value" className="border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground w-32" />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 bg-secondary text-foreground rounded font-semibold">THEN jump to</span>
                        <select value={rule.jumpTo} onChange={(e) => update(rule.id, { jumpTo: e.target.value })} className="border border-input rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:border-foreground flex-1 min-w-[140px]">
                          {questions.map((q) => <option key={q.id} value={q.id}>{q.label}</option>)}
                          <option value="end">⏹ End of form</option>
                        </select>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
                        When <strong className="text-foreground">{label(rule.field)}</strong> {op?.label}
                        {op?.needsValue && <> “<strong className="text-foreground">{rule.value}</strong>”</>}
                        <ArrowRight className="w-3 h-3" /> jump to <strong className="text-foreground">{rule.jumpTo === 'end' ? 'the end' : label(rule.jumpTo)}</strong>
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <button onClick={addRule} className="w-full mt-4 py-4 border-2 border-dashed border-border rounded-lg hover:border-foreground hover:bg-secondary transition-all flex items-center justify-center gap-2 text-muted-foreground font-medium">
              <Plus className="w-5 h-5" /> Add logic rule
            </button>
          </>
        )}
      </div>
    </div>
  )
}
