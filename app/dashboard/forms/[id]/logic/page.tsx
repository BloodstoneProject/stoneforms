'use client'
import { useParams } from 'next/navigation'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Save, Eye, Zap, Loader2, ArrowRight, Map, Variable, Flag, GitBranch } from 'lucide-react'
import {
  LOGIC_OPERATORS,
  type LogicRule,
  type LogicOperator,
  type LogicCondition,
} from '@/lib/logic'
import type { FormVariable, VariableMutation } from '@/lib/variables'
import type { Ending } from '@/lib/endings'
import { LogicMap, type LogicMapField } from '@/components/forms/LogicMap'

interface QuestionRef { id: string; label: string; type: string }

const MUTATION_OPS: { value: VariableMutation['op']; label: string }[] = [
  { value: 'set', label: 'set to' },
  { value: 'add', label: 'add' },
  { value: 'subtract', label: 'subtract' },
  { value: 'multiply', label: 'multiply by' },
  { value: 'divide', label: 'divide by' },
  { value: 'concat', label: 'append (text)' },
]

function uid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export default function ConditionalLogicPage() {
  const { id } = (useParams() as any)
  const [form, setForm] = useState<{ id: string; title: string } | null>(null)
  const [questions, setQuestions] = useState<QuestionRef[]>([])
  const [rules, setRules] = useState<LogicRule[]>([])
  const [variables, setVariables] = useState<FormVariable[]>([])
  const [endings, setEndings] = useState<Ending[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showMap, setShowMap] = useState(false)

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
          const s = formRes.form.settings || {}
          if (Array.isArray(s.variables)) setVariables(s.variables)
          if (Array.isArray(s.endings)) setEndings(s.endings)
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

  // ---- Rules ----
  const addRule = () => {
    if (questions.length === 0) return
    setRules([...rules, {
      id: uid('rule'),
      field: questions[0].id,
      operator: 'equals',
      value: '',
      jumpTo: questions[questions.length - 1].id,
    }])
  }
  const update = (rid: string, patch: Partial<LogicRule>) =>
    setRules(rules.map((r) => (r.id === rid ? { ...r, ...patch } : r)))
  const remove = (rid: string) => setRules(rules.filter((r) => r.id !== rid))

  // Convert a legacy single-condition rule into a multi-condition one (and back).
  const enableMultiCondition = (rule: LogicRule) => {
    update(rule.id, {
      conditions: [{ fieldId: rule.field || questions[0]?.id || '', operator: rule.operator, value: rule.value }],
      combinator: rule.combinator || 'and',
    })
  }
  const disableMultiCondition = (rule: LogicRule) => {
    const first = rule.conditions?.[0]
    update(rule.id, {
      conditions: undefined,
      combinator: undefined,
      field: first?.fieldId || rule.field || questions[0]?.id || '',
      operator: first?.operator || rule.operator,
      value: first?.value ?? rule.value,
    })
  }
  const addCondition = (rule: LogicRule) => {
    const conditions = [...(rule.conditions || []), { fieldId: questions[0]?.id || '', operator: 'equals' as LogicOperator, value: '' }]
    update(rule.id, { conditions })
  }
  const updateCondition = (rule: LogicRule, idx: number, patch: Partial<LogicCondition>) => {
    const conditions = (rule.conditions || []).map((c, i) => (i === idx ? { ...c, ...patch } : c))
    update(rule.id, { conditions })
  }
  const removeCondition = (rule: LogicRule, idx: number) => {
    const conditions = (rule.conditions || []).filter((_, i) => i !== idx)
    if (conditions.length === 0) {
      disableMultiCondition(rule)
    } else {
      update(rule.id, { conditions })
    }
  }

  // ---- Variable mutations (rule actions) ----
  const addMutation = (rule: LogicRule) => {
    if (variables.length === 0) return
    const mutations = [...(rule.variableMutations || []), { variableId: variables[0].id, op: 'add' as VariableMutation['op'], value: 0 }]
    update(rule.id, { variableMutations: mutations })
  }
  const updateMutation = (rule: LogicRule, idx: number, patch: Partial<VariableMutation>) => {
    const mutations = (rule.variableMutations || []).map((m, i) => (i === idx ? { ...m, ...patch } : m))
    update(rule.id, { variableMutations: mutations })
  }
  const removeMutation = (rule: LogicRule, idx: number) =>
    update(rule.id, { variableMutations: (rule.variableMutations || []).filter((_, i) => i !== idx) })

  // ---- Variables ----
  const addVariable = () =>
    setVariables([...variables, { id: uid('var'), name: `variable_${variables.length + 1}`, type: 'number', default: 0 }])
  const updateVariable = (vid: string, patch: Partial<FormVariable>) =>
    setVariables(variables.map((v) => (v.id === vid ? { ...v, ...patch } : v)))
  const removeVariable = (vid: string) => {
    setVariables(variables.filter((v) => v.id !== vid))
    // Drop any rule mutations that referenced the deleted variable.
    setRules(rules.map((r) =>
      r.variableMutations
        ? { ...r, variableMutations: r.variableMutations.filter((m) => m.variableId !== vid) }
        : r
    ))
  }

  // ---- Endings ----
  const addEnding = () =>
    setEndings([...endings, { id: uid('end'), title: `Ending ${endings.length + 1}`, message: '', redirectUrl: '', buttonText: '' }])
  const updateEnding = (eid: string, patch: Partial<Ending>) =>
    setEndings(endings.map((e) => (e.id === eid ? { ...e, ...patch } : e)))
  const removeEnding = (eid: string) => {
    setEndings(endings.filter((e) => e.id !== eid))
    // Clear any rule that targeted the deleted ending.
    setRules(rules.map((r) => (r.targetEndingId === eid ? { ...r, targetEndingId: undefined } : r)))
  }

  const save = async () => {
    setSaving(true); setSaved(false)
    // Merge variables + endings into the existing settings JSONB (read fresh so
    // we don't clobber other settings groups own).
    const current = await fetch(`/api/forms/${id}`).then((r) => r.json()).catch(() => null)
    const settings = { ...(current?.form?.settings || {}), variables, endings }
    const res = await fetch(`/api/forms/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ logic: rules, settings }),
    })
    setSaving(false)
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  }

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
  if (!form) return <div className="p-8">Form not found</div>

  const mapFields: LogicMapField[] = questions.map((q) => ({ id: q.id, label: q.label, type: q.type }))
  const endingTitles = Object.fromEntries(endings.map((e) => [e.id, e.title]))

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card text-card-foreground border-b border-border sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/forms/${id}`} aria-label="Back to form builder" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></Link>
            <div>
              <h1 className="text-xl heading-tight text-foreground">Logic</h1>
              <p className="text-sm text-muted-foreground">{form.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMap((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-md text-sm ${showMap ? 'bg-secondary border-foreground text-foreground' : 'border-border hover:bg-secondary'}`}
            >
              <Map className="w-4 h-4" /> {showMap ? 'Hide map' : 'Map'}
            </button>
            <Link href={`/f/${id}`} target="_blank" className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-secondary text-sm"><Eye className="w-4 h-4" /> Preview</Link>
            <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm font-medium disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">
        {showMap && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <GitBranch className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Flow map</h2>
            </div>
            <LogicMap fields={mapFields} rules={rules} endingTitles={endingTitles} />
          </section>
        )}

        {/* ---------------------------------------------------------------- RULES */}
        <section>
          <div className="bg-secondary border border-border rounded-lg p-5 mb-6 flex items-start gap-3">
            <Zap className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">
              Jump logic skips respondents to a later question (or ends the form) based on their answers.
              Rules run in order; the first match wins. Multi-condition rules combine several fields with AND/OR,
              can update variables, and can route to a custom ending.
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
                  const multi = !!rule.conditions && rule.conditions.length > 0
                  const op = LOGIC_OPERATORS.find((o) => o.value === rule.operator)
                  return (
                    <div key={rule.id} className="card-surface p-5">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-muted-foreground">RULE {idx + 1}</span>
                        <div className="flex items-center gap-3">
                          {multi ? (
                            <button onClick={() => disableMultiCondition(rule)} className="text-xs text-muted-foreground hover:text-foreground">Use single condition</button>
                          ) : (
                            <button onClick={() => enableMultiCondition(rule)} className="text-xs text-muted-foreground hover:text-foreground">Add conditions</button>
                          )}
                          <button onClick={() => remove(rule.id)} aria-label={`Delete rule ${idx + 1}`} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm">
                        {!multi ? (
                          /* ---- legacy single condition ---- */
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
                        ) : (
                          /* ---- multi-condition ---- */
                          <div className="space-y-2">
                            {(rule.conditions || []).map((cond, ci) => {
                              const cop = LOGIC_OPERATORS.find((o) => o.value === cond.operator)
                              return (
                                <div key={ci} className="flex flex-wrap items-center gap-2">
                                  {ci === 0 ? (
                                    <span className="px-2.5 py-1 bg-secondary text-foreground rounded font-semibold">IF</span>
                                  ) : (
                                    <select
                                      value={rule.combinator || 'and'}
                                      onChange={(e) => update(rule.id, { combinator: e.target.value as 'and' | 'or' })}
                                      className="border border-input rounded-md px-2 py-1.5 bg-background text-foreground font-semibold focus:outline-none focus:border-foreground"
                                    >
                                      <option value="and">AND</option>
                                      <option value="or">OR</option>
                                    </select>
                                  )}
                                  <select value={cond.fieldId} onChange={(e) => updateCondition(rule, ci, { fieldId: e.target.value })} className="border border-input rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:border-foreground flex-1 min-w-[130px]">
                                    {questions.map((q) => <option key={q.id} value={q.id}>{q.label}</option>)}
                                  </select>
                                  <select value={cond.operator} onChange={(e) => updateCondition(rule, ci, { operator: e.target.value as LogicOperator })} className="border border-input rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:border-foreground">
                                    {LOGIC_OPERATORS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                  </select>
                                  {cop?.needsValue && (
                                    <input type="text" value={(cond.value as string) || ''} onChange={(e) => updateCondition(rule, ci, { value: e.target.value })} placeholder="value" className="border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground w-28" />
                                  )}
                                  <button onClick={() => removeCondition(rule, ci)} aria-label="Remove condition" className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                              )
                            })}
                            <button onClick={() => addCondition(rule)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add condition</button>
                          </div>
                        )}

                        {/* THEN jump */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="px-2.5 py-1 bg-secondary text-foreground rounded font-semibold">THEN jump to</span>
                          <select value={rule.jumpTo} onChange={(e) => update(rule.id, { jumpTo: e.target.value })} className="border border-input rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:border-foreground flex-1 min-w-[140px]">
                            {questions.map((q) => <option key={q.id} value={q.id}>{q.label}</option>)}
                            <option value="end">⏹ End of form</option>
                          </select>
                          {rule.jumpTo === 'end' && endings.length > 0 && (
                            <select
                              value={rule.targetEndingId || ''}
                              onChange={(e) => update(rule.id, { targetEndingId: e.target.value || undefined })}
                              className="border border-input rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:border-foreground"
                            >
                              <option value="">Default ending</option>
                              {endings.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
                            </select>
                          )}
                        </div>

                        {/* Variable mutations (actions) */}
                        {variables.length > 0 && (
                          <div className="space-y-2 pt-1">
                            {(rule.variableMutations || []).map((m, mi) => (
                              <div key={mi} className="flex flex-wrap items-center gap-2">
                                <span className="px-2.5 py-1 bg-secondary text-foreground rounded font-semibold">AND set</span>
                                <select value={m.variableId} onChange={(e) => updateMutation(rule, mi, { variableId: e.target.value })} className="border border-input rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:border-foreground">
                                  {variables.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                                </select>
                                <select value={m.op} onChange={(e) => updateMutation(rule, mi, { op: e.target.value as VariableMutation['op'] })} className="border border-input rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:border-foreground">
                                  {MUTATION_OPS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                                <input
                                  type="text"
                                  value={String(m.value ?? '')}
                                  onChange={(e) => {
                                    const v = e.target.value
                                    const isNum = m.op !== 'concat' && m.op !== 'set' ? true : false
                                    updateMutation(rule, mi, { value: isNum && v !== '' && !Number.isNaN(Number(v)) ? Number(v) : v })
                                  }}
                                  placeholder="value"
                                  className="border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground w-28"
                                />
                                <button onClick={() => removeMutation(rule, mi)} aria-label="Remove action" className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            ))}
                            <button onClick={() => addMutation(rule)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add variable action</button>
                          </div>
                        )}

                        {!multi && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
                            When <strong className="text-foreground">{label(rule.field)}</strong> {op?.label}
                            {op?.needsValue && <> “<strong className="text-foreground">{rule.value}</strong>”</>}
                            <ArrowRight className="w-3 h-3" /> jump to <strong className="text-foreground">{rule.jumpTo === 'end' ? 'the end' : label(rule.jumpTo)}</strong>
                          </p>
                        )}
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
        </section>

        {/* ------------------------------------------------------------ VARIABLES */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Variable className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Variables</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Counters or text values that logic rules update as a respondent progresses (e.g. a running score
            or price). Reference them in question and ending copy with <code className="px-1 py-0.5 bg-secondary rounded text-xs">{'{{var:name}}'}</code>.
          </p>
          <div className="space-y-3">
            {variables.map((v) => (
              <div key={v.id} className="card-surface p-4 flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={v.name}
                  onChange={(e) => updateVariable(v.id, { name: e.target.value })}
                  placeholder="name"
                  className="border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground flex-1 min-w-[140px]"
                />
                <select
                  value={v.type}
                  onChange={(e) => {
                    const type = e.target.value as FormVariable['type']
                    updateVariable(v.id, { type, default: type === 'number' ? (Number.isFinite(Number(v.default)) ? Number(v.default) : 0) : String(v.default ?? '') })
                  }}
                  className="border border-input rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:border-foreground"
                >
                  <option value="number">Number</option>
                  <option value="text">Text</option>
                </select>
                <input
                  type={v.type === 'number' ? 'number' : 'text'}
                  value={String(v.default ?? '')}
                  onChange={(e) => updateVariable(v.id, { default: v.type === 'number' ? Number(e.target.value) : e.target.value })}
                  placeholder="default"
                  className="border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground w-32"
                />
                <button onClick={() => removeVariable(v.id)} aria-label="Delete variable" className="text-muted-foreground hover:text-destructive ml-auto"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
          <button onClick={addVariable} className="w-full mt-3 py-3 border-2 border-dashed border-border rounded-lg hover:border-foreground hover:bg-secondary transition-all flex items-center justify-center gap-2 text-muted-foreground font-medium text-sm">
            <Plus className="w-4 h-4" /> Add variable
          </button>
        </section>

        {/* -------------------------------------------------------------- ENDINGS */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Flag className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Endings</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Custom thank-you screens. A logic rule that ends the form (or a quiz outcome) can route to a specific
            ending. Titles and messages support recall tokens like <code className="px-1 py-0.5 bg-secondary rounded text-xs">{'{{field:id}}'}</code>.
          </p>
          <div className="space-y-3">
            {endings.map((e, idx) => (
              <div key={e.id} className="card-surface p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">ENDING {idx + 1}</span>
                  <button onClick={() => removeEnding(e.id)} aria-label="Delete ending" className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
                <input
                  type="text"
                  value={e.title}
                  onChange={(ev) => updateEnding(e.id, { title: ev.target.value })}
                  placeholder="Title"
                  className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground text-sm font-medium"
                />
                <textarea
                  value={e.message || ''}
                  onChange={(ev) => updateEnding(e.id, { message: ev.target.value })}
                  placeholder="Message (optional)"
                  rows={2}
                  className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground text-sm resize-y"
                />
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={e.redirectUrl || ''}
                    onChange={(ev) => updateEnding(e.id, { redirectUrl: ev.target.value })}
                    placeholder="Redirect URL (optional)"
                    className="flex-1 min-w-[180px] border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground text-sm"
                  />
                  <input
                    type="text"
                    value={e.buttonText || ''}
                    onChange={(ev) => updateEnding(e.id, { buttonText: ev.target.value })}
                    placeholder="Button text (optional)"
                    className="w-40 border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
          <button onClick={addEnding} className="w-full mt-3 py-3 border-2 border-dashed border-border rounded-lg hover:border-foreground hover:bg-secondary transition-all flex items-center justify-center gap-2 text-muted-foreground font-medium text-sm">
            <Plus className="w-4 h-4" /> Add ending
          </button>
        </section>
      </div>
    </div>
  )
}
