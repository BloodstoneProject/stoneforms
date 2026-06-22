'use client'

import { useState } from 'react'
import { Plus, Loader2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FORM_TEMPLATES, type FormTemplate } from '@/lib/form-templates'
import { TEMPLATE_CATEGORIES, CATEGORY_BLURBS } from '@/lib/template-categories'

const CATEGORIES = ['All', ...TEMPLATE_CATEGORIES] as const

export default function TemplatesPage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All')
  const [busyId, setBusyId] = useState<string | null>(null)

  const useTemplate = async (template: FormTemplate | null) => {
    setBusyId(template ? template.id : 'blank')
    try {
      const res = template
        ? await fetch('/api/forms/from-template', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ templateId: template.id }),
          })
        : await fetch('/api/forms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Untitled Form' }),
          })
      const data = await res.json()
      if (res.ok && data.form) {
        window.location.href = `/dashboard/forms/${data.form.id}`
      } else {
        alert(data.error || 'Could not create form')
        setBusyId(null)
      }
    } catch {
      setBusyId(null)
    }
  }

  const shown = category === 'All' ? FORM_TEMPLATES : FORM_TEMPLATES.filter((t) => t.category === category)

  // Group the shown templates by category so we can render section headers.
  const sections = TEMPLATE_CATEGORIES
    .map((cat) => ({ cat, items: shown.filter((t) => t.category === cat) }))
    .filter((s) => s.items.length > 0)

  const renderCard = (t: FormTemplate) => (
    <div key={t.id} className="card-surface p-6 flex flex-col">
      <div className="w-11 h-11 rounded-md bg-muted flex items-center justify-center text-xl mb-4">{t.icon}</div>
      <h3 className="font-semibold tracking-tight text-foreground">{t.name}</h3>
      <p className="text-sm text-muted-foreground mt-1 flex-1">{t.description}</p>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3">
        <FileText className="w-3.5 h-3.5" /> {t.fields.length} fields
        {t.quiz ? ' · scored quiz' : ''}
      </div>
      <Button
        onClick={() => useTemplate(t)}
        disabled={busyId !== null}
        className="mt-4 w-full"
        size="sm"
      >
        {busyId === t.id ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : 'Use template'}
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Templates</h1>
          <p className="text-muted-foreground mt-1">Start from a ready-made form or a blank canvas</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Category filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                category === c
                  ? 'bg-secondary text-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:bg-muted/50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Blank form (only on the "All" view) */}
        {category === 'All' && (
          <div className="mb-10">
            <button
              onClick={() => useTemplate(null)}
              disabled={busyId !== null}
              className="text-left w-full sm:max-w-sm bg-card rounded-lg border border-dashed border-border p-6 hover:border-foreground transition-colors disabled:opacity-50 flex flex-col"
            >
              <div className="w-11 h-11 rounded-md bg-muted flex items-center justify-center text-xl mb-4">
                <Plus className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="font-semibold tracking-tight text-foreground">Blank form</h3>
              <p className="text-sm text-muted-foreground mt-1 flex-1">Start from scratch and add your own fields.</p>
              <span className="text-sm font-medium text-foreground mt-4">
                {busyId === 'blank' ? 'Creating…' : 'Start blank →'}
              </span>
            </button>
          </div>
        )}

        {/* Templates grouped by category */}
        <div className="space-y-12">
          {sections.map((section) => (
            <section key={section.cat}>
              <div className="mb-4">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">{section.cat}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{CATEGORY_BLURBS[section.cat]}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {section.items.map(renderCard)}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
