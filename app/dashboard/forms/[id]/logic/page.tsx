'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Save, Eye, Zap, Loader } from 'lucide-react'

interface LogicRule {
  id: string
  condition: {
    field: string
    operator: string
    value: string
  }
  action: {
    type: 'show' | 'hide' | 'skip' | 'calculate'
    target: string
    value?: string
  }
}

interface QuestionRef {
  id: string
  label: string
  type: string
}

export default function ConditionalLogicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [form, setForm] = useState<{ id: string; title: string } | null>(null)
  const [questions, setQuestions] = useState<QuestionRef[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [rules, setRules] = useState<LogicRule[]>([])

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
          setQuestions(
            fieldsRes.fields.map((f: any) => ({ id: f.id, label: f.label, type: f.field_type }))
          )
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const saveLogic = async () => {
    setSaving(true)
    try {
      await fetch(`/api/forms/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logic: rules }),
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader className="w-6 h-6 animate-spin text-stone-400" />
      </div>
    )
  }

  if (!form) return <div className="p-8">Form not found</div>

  const operators = [
    { value: 'equals', label: 'equals' },
    { value: 'not_equals', label: 'does not equal' },
    { value: 'contains', label: 'contains' },
    { value: 'greater_than', label: 'is greater than' },
    { value: 'less_than', label: 'is less than' },
    { value: 'is_filled', label: 'is filled' },
    { value: 'is_empty', label: 'is empty' },
  ]

  const actions = [
    { value: 'show', label: 'Show field' },
    { value: 'hide', label: 'Hide field' },
    { value: 'skip', label: 'Skip to field' },
    { value: 'calculate', label: 'Calculate value' },
  ]

  const addRule = () => {
    if (questions.length < 1) return
    const newRule: LogicRule = {
      id: Date.now().toString(),
      condition: { field: questions[0].id, operator: 'equals', value: '' },
      action: { type: 'show', target: questions[questions.length > 1 ? 1 : 0].id }
    }
    setRules([...rules, newRule])
  }

  const updateRule = (ruleId: string, updates: Partial<LogicRule>) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, ...updates } : rule
    ))
  }

  const deleteRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId))
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/dashboard/forms/${id}`} className="p-2 hover:bg-stone-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-stone-900">Conditional Logic</h1>
                <p className="text-sm text-stone-600">{form.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/f/${id}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Link>
              <button
                onClick={saveLogic}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving…' : 'Save Logic'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 mb-2">Create Dynamic Forms</h3>
              <p className="text-blue-800 mb-3">
                Show or hide fields based on user responses. Create personalized form experiences that adapt in real-time.
              </p>
              <div className="flex gap-4 text-sm text-blue-800">
                <span>• Improve completion rates</span>
                <span>• Reduce form length</span>
                <span>• Collect better data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rules List */}
        <div className="space-y-6 mb-8">
          {rules.map((rule, idx) => (
            <div key={rule.id} className="bg-white rounded-xl border-2 border-stone-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <h3 className="font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-stone-900 text-white rounded-lg flex items-center justify-center text-sm">
                    {idx + 1}
                  </span>
                  Logic Rule
                </h3>
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* IF Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg font-semibold text-sm">
                    IF
                  </span>
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    {/* Field Select */}
                    <select
                      value={rule.condition.field}
                      onChange={(e) => updateRule(rule.id, {
                        condition: { ...rule.condition, field: e.target.value }
                      })}
                      className="px-4 py-3 border-2 border-stone-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-stone-200 focus:border-stone-900"
                    >
                      {questions.map(q => (
                        <option key={q.id} value={q.id}>{q.label}</option>
                      ))}
                    </select>

                    {/* Operator Select */}
                    <select
                      value={rule.condition.operator}
                      onChange={(e) => updateRule(rule.id, {
                        condition: { ...rule.condition, operator: e.target.value }
                      })}
                      className="px-4 py-3 border-2 border-stone-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-stone-200 focus:border-stone-900"
                    >
                      {operators.map(op => (
                        <option key={op.value} value={op.value}>{op.label}</option>
                      ))}
                    </select>

                    {/* Value Input */}
                    {!['is_filled', 'is_empty'].includes(rule.condition.operator) && (
                      <input
                        type="text"
                        value={rule.condition.value}
                        onChange={(e) => updateRule(rule.id, {
                          condition: { ...rule.condition, value: e.target.value }
                        })}
                        placeholder="Value..."
                        className="px-4 py-3 border-2 border-stone-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-stone-200 focus:border-stone-900"
                      />
                    )}
                  </div>
                </div>

                {/* THEN Section */}
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-semibold text-sm">
                    THEN
                  </span>
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    {/* Action Type */}
                    <select
                      value={rule.action.type}
                      onChange={(e) => updateRule(rule.id, {
                        action: { ...rule.action, type: e.target.value as any }
                      })}
                      className="px-4 py-3 border-2 border-stone-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-stone-200 focus:border-stone-900"
                    >
                      {actions.map(action => (
                        <option key={action.value} value={action.value}>{action.label}</option>
                      ))}
                    </select>

                    {/* Target Field */}
                    <select
                      value={rule.action.target}
                      onChange={(e) => updateRule(rule.id, {
                        action: { ...rule.action, target: e.target.value }
                      })}
                      className="px-4 py-3 border-2 border-stone-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-stone-200 focus:border-stone-900"
                    >
                      {questions
                        .filter(q => q.id !== rule.condition.field)
                        .map(q => (
                          <option key={q.id} value={q.id}>{q.label}</option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Visual Preview */}
              <div className="mt-6 p-4 bg-stone-50 rounded-lg border border-stone-200">
                <p className="text-sm text-stone-600">
                  <strong>Plain English:</strong> When{' '}
                  <span className="font-semibold text-stone-900">
                    {questions.find(q => q.id === rule.condition.field)?.label}
                  </span>{' '}
                  {rule.condition.operator.replace('_', ' ')}{' '}
                  {rule.condition.value && (
                    <span className="font-semibold text-stone-900">"{rule.condition.value}"</span>
                  )}, then {rule.action.type}{' '}
                  <span className="font-semibold text-stone-900">
                    {questions.find(q => q.id === rule.action.target)?.label}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Add Rule Button */}
        <button
          onClick={addRule}
          className="w-full py-4 border-2 border-dashed border-stone-300 rounded-xl hover:border-stone-400 hover:bg-stone-50 transition-all flex items-center justify-center gap-2 text-stone-600 hover:text-stone-900 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Logic Rule
        </button>

        {/* Example Templates */}
        <div className="mt-12 bg-white rounded-xl border border-stone-200 p-6">
          <h3 className="font-bold text-stone-900 mb-4">Common Logic Patterns</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                name: 'Show follow-up question',
                desc: 'If answer is "Yes", show additional details field',
                example: 'IF Q1 equals "Yes" THEN Show Q2'
              },
              {
                name: 'Skip irrelevant sections',
                desc: 'Skip questions that don\'t apply to the user',
                example: 'IF Q1 equals "No" THEN Skip to Q5'
              },
              {
                name: 'Calculate totals',
                desc: 'Automatically calculate based on inputs',
                example: 'IF Q1 is filled THEN Calculate Q3 = Q1 + Q2'
              },
              {
                name: 'Conditional requirements',
                desc: 'Make fields required based on other answers',
                example: 'IF Q1 equals "Business" THEN Show Q4'
              },
            ].map((template, i) => (
              <div key={i} className="p-4 border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer">
                <h4 className="font-semibold text-stone-900 mb-1">{template.name}</h4>
                <p className="text-sm text-stone-600 mb-2">{template.desc}</p>
                <code className="text-xs bg-stone-100 text-stone-700 px-2 py-1 rounded">
                  {template.example}
                </code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
