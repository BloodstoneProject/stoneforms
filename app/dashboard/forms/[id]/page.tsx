'use client'
import { useParams } from 'next/navigation'

import { use, useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Plus, Trash2, GripVertical, Eye, Share2,
  Settings2, ChevronDown, ChevronUp, Check, Loader2, Globe, Pencil, BarChart3, Webhook, Palette, GitBranch,
} from 'lucide-react'
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy, useSortable,
  arrayMove, sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import ShareModal from '@/components/forms/share-modal'
import FieldOptionsEditor from '@/components/forms/field-options-editor'
import { FIELD_TYPES, fieldHasOptions, getFieldMeta } from '@/lib/field-types'

interface QuizOutcome {
  id: string
  minScore: number
  maxScore: number
  title: string
  message: string
}

interface QuizConfig {
  enabled?: boolean
  showResults?: boolean
  outcomes?: QuizOutcome[]
}

interface FormSchedule {
  opensAt?: string
  closesAt?: string
  maxResponses?: number
  closedMessage?: string
}

interface FormSettings {
  showProgressBar?: boolean
  allowMultipleSubmissions?: boolean
  requireEmail?: boolean
  redirectUrl?: string
  customEndingMessage?: string
  welcome?: { enabled?: boolean; title?: string; description?: string; buttonText?: string }
  ending?: { title?: string; message?: string }
  quiz?: QuizConfig
  schedule?: FormSchedule
  recaptcha?: { enabled?: boolean }
  // Unknown keys written by other features (emailBranding, integrations, …) are
  // preserved on save — see persistMeta / updateSetting spreads.
  [key: string]: any
}

interface Form {
  id: string
  title: string
  description: string
  status: string
  slug?: string | null
  settings?: FormSettings
}

interface Field {
  id: string
  field_type: string
  label: string
  placeholder: string
  required: boolean
  options: string[] | null
  position: number
  settings?: Record<string, any> | null
}

type SaveState = 'saved' | 'saving' | 'unsaved'

export default function FormBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: formId } = (useParams() as any)
  const router = useRouter()

  const [form, setForm] = useState<Form | null>(null)
  const [fields, setFields] = useState<Field[]>([])
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [expandedSettingsId, setExpandedSettingsId] = useState<string | null>(null)
  const [formSettingsOpen, setFormSettingsOpen] = useState(false)
  const [saveState, setSaveState] = useState<SaveState>('saved')
  const [slugInput, setSlugInput] = useState('')
  const [slugStatus, setSlugStatus] = useState<{ kind: 'idle' | 'saving' | 'saved' | 'error'; message?: string }>({ kind: 'idle' })

  // refs to drive debounced autosave without re-running on first render
  const metaTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hydrated = useRef(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  useEffect(() => {
    fetchFormAndFields()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId])

  const fetchFormAndFields = async () => {
    try {
      const formRes = await fetch(`/api/forms/${formId}`)
      if (!formRes.ok) {
        router.push('/dashboard/forms')
        return
      }
      const formData = await formRes.json()
      if (formData.form) {
        setForm(formData.form)
        setSlugInput(formData.form.slug || '')
      }

      const fieldsRes = await fetch(`/api/forms/${formId}/fields`)
      const fieldsData = await fieldsRes.json()
      if (fieldsData.fields) setFields(fieldsData.fields)
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }

  // ---- Debounced autosave of title/description ----
  const persistMeta = useCallback(async (next: Form) => {
    setSaveState('saving')
    try {
      const res = await fetch(`/api/forms/${formId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: next.title,
          description: next.description,
          settings: next.settings || {},
        }),
      })
      setSaveState(res.ok ? 'saved' : 'unsaved')
    } catch {
      setSaveState('unsaved')
    }
  }, [formId])

  useEffect(() => {
    if (!form) return
    if (!hydrated.current) { hydrated.current = true; return }
    setSaveState('unsaved')
    if (metaTimer.current) clearTimeout(metaTimer.current)
    metaTimer.current = setTimeout(() => persistMeta(form), 800)
    return () => { if (metaTimer.current) clearTimeout(metaTimer.current) }
  }, [form?.title, form?.description, JSON.stringify(form?.settings), persistMeta]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateSetting = (key: keyof FormSettings, value: any) => {
    setForm((prev) => (prev ? { ...prev, settings: { ...(prev.settings || {}), [key]: value } } : prev))
  }

  const updateNestedSetting = (group: 'welcome' | 'ending', key: string, value: any) => {
    setForm((prev) => prev ? {
      ...prev,
      settings: { ...(prev.settings || {}), [group]: { ...((prev.settings as any)?.[group] || {}), [key]: value } },
    } : prev)
  }

  const updateScheduleSetting = (key: keyof FormSchedule, value: any) => {
    setForm((prev) => {
      if (!prev) return prev
      const schedule = { ...((prev.settings as any)?.schedule || {}) }
      if (value === '' || value === undefined || value === null) delete schedule[key]
      else schedule[key] = value
      return { ...prev, settings: { ...(prev.settings || {}), schedule } }
    })
  }

  const updateRecaptchaSetting = (enabled: boolean) => {
    setForm((prev) => prev ? {
      ...prev,
      settings: { ...(prev.settings || {}), recaptcha: { ...((prev.settings as any)?.recaptcha || {}), enabled } },
    } : prev)
  }

  // ---- Quiz settings helpers ----
  const updateQuizSetting = (key: keyof QuizConfig, value: any) => {
    setForm((prev) => prev ? {
      ...prev,
      settings: { ...(prev.settings || {}), quiz: { ...((prev.settings as any)?.quiz || {}), [key]: value } },
    } : prev)
  }

  const updateOutcomes = (outcomes: QuizOutcome[]) => updateQuizSetting('outcomes', outcomes)

  const addOutcome = () => {
    const existing = form?.settings?.quiz?.outcomes || []
    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `o_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
    updateOutcomes([
      ...existing,
      { id, minScore: 0, maxScore: 0, title: '', message: '' },
    ])
  }

  const updateOutcome = (id: string, patch: Partial<QuizOutcome>) => {
    const existing = form?.settings?.quiz?.outcomes || []
    updateOutcomes(existing.map((o) => (o.id === id ? { ...o, ...patch } : o)))
  }

  const removeOutcome = (id: string) => {
    const existing = form?.settings?.quiz?.outcomes || []
    updateOutcomes(existing.filter((o) => o.id !== id))
  }

  // ---- Custom slug (separate PATCH so we can surface taken/invalid errors) ----
  const saveSlug = async () => {
    if (!form) return
    const value = slugInput.trim().toLowerCase()
    if (value && !/^[a-z0-9-]{3,40}$/.test(value)) {
      setSlugStatus({ kind: 'error', message: 'Use 3-40 lowercase letters, numbers or hyphens.' })
      return
    }
    setSlugStatus({ kind: 'saving' })
    try {
      const res = await fetch(`/api/forms/${formId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: value || null }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setSlugStatus({ kind: 'error', message: data.error || 'Could not save link.' })
        return
      }
      setForm((prev) => (prev ? { ...prev, slug: data.form?.slug ?? (value || null) } : prev))
      setSlugInput(data.form?.slug || '')
      setSlugStatus({ kind: 'saved' })
    } catch {
      setSlugStatus({ kind: 'error', message: 'Could not save link.' })
    }
  }

  const addField = async (fieldType: string) => {
    const defaultOptions = fieldHasOptions(fieldType)
      ? ['Option 1', 'Option 2', 'Option 3']
      : null
    try {
      const res = await fetch(`/api/forms/${formId}/fields`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field_type: fieldType,
          label: 'Untitled question',
          required: false,
          options: defaultOptions,
        }),
      })
      if (!res.ok) return
      const data = await res.json()
      if (data.field) {
        setFields((prev) => [...prev, data.field])
        if (fieldHasOptions(fieldType)) setExpandedSettingsId(data.field.id)
      }
    } catch (error) {
      console.error('Failed to add field:', error)
    }
  }

  // Optimistic field update + persist. `optimistic` patches local state immediately.
  const updateField = async (fieldId: string, updates: Partial<Field>) => {
    setFields((prev) => prev.map((f) => (f.id === fieldId ? { ...f, ...updates } : f)))
    try {
      await fetch(`/api/forms/${formId}/fields/${fieldId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
    } catch (error) {
      console.error('Failed to update field:', error)
    }
  }

  // Merge a single key into a field's settings JSONB.
  const updateFieldSetting = (field: Field, key: string, value: any) => {
    const nextSettings = { ...(field.settings || {}), [key]: value }
    if (value === '' || value === undefined || value === null) delete nextSettings[key]
    updateField(field.id, { settings: nextSettings })
  }

  const deleteField = async (fieldId: string) => {
    if (!confirm('Delete this field?')) return
    setFields((prev) => prev.filter((f) => f.id !== fieldId))
    try {
      await fetch(`/api/forms/${formId}/fields/${fieldId}`, { method: 'DELETE' })
    } catch (error) {
      console.error('Failed to delete field:', error)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = fields.findIndex((f) => f.id === active.id)
    const newIndex = fields.findIndex((f) => f.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(fields, oldIndex, newIndex)
    setFields(reordered)
    // Persist new positions only for the rows whose index changed.
    reordered.forEach((field, index) => {
      if (field.position !== index) {
        fetch(`/api/forms/${formId}/fields/${field.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ position: index }),
        }).catch(() => {})
      }
    })
    setFields(reordered.map((f, i) => ({ ...f, position: i })))
  }

  const setStatus = async (status: 'draft' | 'published') => {
    if (!form) return
    if (status === 'published' && fields.length === 0) {
      alert('Add at least one field before publishing.')
      return
    }
    setPublishing(true)
    try {
      const res = await fetch(`/api/forms/${formId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setForm({ ...form, status })
        if (status === 'published') setShareModalOpen(true)
      }
    } finally {
      setPublishing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">Form Not Found</h1>
          <Link href="/dashboard/forms" className="text-stone-600 hover:text-stone-900">← Back to Forms</Link>
        </div>
      </div>
    )
  }

  const isPublished = form.status === 'published'

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Link href="/dashboard/forms" className="text-stone-600 hover:text-stone-900 shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="min-w-0">
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="text-xl font-bold text-stone-900 border-none focus:outline-none bg-transparent w-full"
                  placeholder="Form Title"
                />
                <div className="flex items-center gap-2 text-sm text-stone-500">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${isPublished ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-600'}`}>
                    {isPublished ? <Globe className="w-3 h-3" /> : <Pencil className="w-3 h-3" />}
                    {isPublished ? 'Published' : 'Draft'}
                  </span>
                  <span>· {fields.length} {fields.length === 1 ? 'field' : 'fields'}</span>
                  <span>·</span>
                  <SaveIndicator state={saveState} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/f/${formId}`}
                target="_blank"
                className="flex items-center gap-2 px-3 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 text-sm"
              >
                <Eye className="w-4 h-4" /> Preview
              </Link>

              <Link
                href={`/dashboard/forms/${formId}/themes`}
                className="flex items-center gap-2 px-3 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 text-sm"
              >
                <Palette className="w-4 h-4" /> Design
              </Link>

              <Link
                href={`/dashboard/forms/${formId}/logic`}
                className="flex items-center gap-2 px-3 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 text-sm"
              >
                <GitBranch className="w-4 h-4" /> Logic
              </Link>

              <Link
                href={`/dashboard/forms/${formId}/integrations`}
                className="flex items-center gap-2 px-3 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 text-sm"
              >
                <Webhook className="w-4 h-4" /> Integrations
              </Link>

              {isPublished && (
                <button
                  onClick={() => setShareModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 text-sm"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
              )}

              {isPublished ? (
                <>
                  <Link
                    href={`/dashboard/forms/${formId}/analytics`}
                    className="flex items-center gap-2 px-3 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 text-sm"
                  >
                    <BarChart3 className="w-4 h-4" /> Analytics
                  </Link>
                  <Link
                    href={`/dashboard/forms/${formId}/responses`}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Responses
                  </Link>
                  <button
                    onClick={() => setStatus('draft')}
                    disabled={publishing}
                    className="px-3 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 text-sm disabled:opacity-50"
                  >
                    {publishing ? 'Working…' : 'Unpublish'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setStatus('published')}
                  disabled={publishing}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
                >
                  {publishing ? 'Publishing…' : 'Publish'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Field Types Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-stone-200 p-4 sticky top-24">
              <h3 className="font-bold text-stone-900 mb-4">Add Fields</h3>
              <div className="space-y-2">
                {FIELD_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => addField(type.value)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 border border-stone-200 rounded-lg hover:bg-stone-50 hover:border-stone-300 text-left transition-colors"
                  >
                    <span className="text-xl">{type.icon}</span>
                    <span className="text-sm font-medium text-stone-900">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Builder */}
          <div className="lg:col-span-3 space-y-6">
            {/* Form Header */}
            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="text-2xl font-bold text-stone-900 w-full border-none focus:outline-none mb-2"
                placeholder="Form Title"
              />
              <textarea
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full text-stone-600 border-none focus:outline-none resize-none"
                placeholder="Add a description..."
                rows={2}
              />
            </div>

            {/* Form Settings */}
            <div className="bg-white rounded-lg border border-stone-200">
              <button
                onClick={() => setFormSettingsOpen((v) => !v)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="flex items-center gap-2 font-medium text-stone-900">
                  <Settings2 className="w-4 h-4" /> Form settings
                </span>
                {formSettingsOpen ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
              </button>
              {formSettingsOpen && (
                <div className="px-6 pb-6 space-y-4 border-t border-stone-100 pt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.settings?.showProgressBar !== false}
                      onChange={(e) => updateSetting('showProgressBar', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-stone-700">Show progress bar</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.settings?.allowMultipleSubmissions !== false}
                      onChange={(e) => updateSetting('allowMultipleSubmissions', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-stone-700">Allow multiple submissions per visitor</span>
                  </label>
                  {/* Welcome screen */}
                  <div className="pt-3 border-t border-stone-100">
                    <label className="flex items-center gap-3 cursor-pointer mb-2">
                      <input
                        type="checkbox"
                        checked={form.settings?.welcome?.enabled !== false}
                        onChange={(e) => updateNestedSetting('welcome', 'enabled', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-stone-700">Show welcome screen</span>
                    </label>
                    {form.settings?.welcome?.enabled !== false && (
                      <div className="space-y-2 pl-6">
                        <input type="text" value={form.settings?.welcome?.title || ''} onChange={(e) => updateNestedSetting('welcome', 'title', e.target.value)}
                          className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900" placeholder="Welcome title (defaults to form title)" />
                        <input type="text" value={form.settings?.welcome?.description || ''} onChange={(e) => updateNestedSetting('welcome', 'description', e.target.value)}
                          className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900" placeholder="Welcome subtitle" />
                        <input type="text" value={form.settings?.welcome?.buttonText || ''} onChange={(e) => updateNestedSetting('welcome', 'buttonText', e.target.value)}
                          className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900" placeholder="Start button text (default: Start)" />
                      </div>
                    )}
                  </div>

                  {/* Ending screen */}
                  <div className="pt-3 border-t border-stone-100">
                    <p className="text-sm font-medium text-stone-700 mb-2">Ending screen</p>
                    <div className="space-y-2">
                      <input type="text" value={form.settings?.ending?.title || ''} onChange={(e) => updateNestedSetting('ending', 'title', e.target.value)}
                        className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900" placeholder="Ending title (default: Thank you!)" />
                      <textarea value={form.settings?.ending?.message || ''} onChange={(e) => updateNestedSetting('ending', 'message', e.target.value)} rows={2}
                        className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900 resize-none" placeholder="Ending message" />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100">
                    <label className="block text-xs font-medium text-stone-700 mb-1">Redirect URL after submit (overrides ending screen)</label>
                    <input
                      type="text"
                      value={form.settings?.redirectUrl || ''}
                      onChange={(e) => updateSetting('redirectUrl', e.target.value)}
                      className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900"
                      placeholder="https://example.com/thank-you"
                    />
                  </div>

                  {/* Custom link / slug */}
                  <div className="pt-3 border-t border-stone-100">
                    <label className="block text-xs font-medium text-stone-700 mb-1">Custom link / slug (optional)</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-stone-400 shrink-0">/f/</span>
                      <input
                        type="text"
                        value={slugInput}
                        onChange={(e) => { setSlugInput(e.target.value.toLowerCase()); setSlugStatus({ kind: 'idle' }) }}
                        onBlur={saveSlug}
                        className="flex-1 text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900 font-mono"
                        placeholder="my-form"
                      />
                      <button
                        type="button"
                        onClick={saveSlug}
                        disabled={slugStatus.kind === 'saving'}
                        className="px-3 py-2 text-sm border border-stone-300 rounded hover:bg-stone-50 disabled:opacity-50 shrink-0"
                      >
                        {slugStatus.kind === 'saving' ? 'Saving…' : 'Save'}
                      </button>
                    </div>
                    {slugStatus.kind === 'error' && <p className="text-xs text-red-600 mt-1">{slugStatus.message}</p>}
                    {slugStatus.kind === 'saved' && <p className="text-xs text-green-600 mt-1">Custom link saved.</p>}
                    <p className="text-xs text-stone-400 mt-1">3-40 chars: lowercase letters, numbers, hyphens. Leave blank to use the default link.</p>
                  </div>

                  {/* Quiz mode */}
                  <div className="pt-3 border-t border-stone-100">
                    <label className="flex items-center gap-3 cursor-pointer mb-2">
                      <input
                        type="checkbox"
                        checked={!!form.settings?.quiz?.enabled}
                        onChange={(e) => updateQuizSetting('enabled', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-stone-700">Quiz mode (score answers)</span>
                    </label>
                    {form.settings?.quiz?.enabled && (
                      <div className="space-y-3 pl-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.settings?.quiz?.showResults !== false}
                            onChange={(e) => updateQuizSetting('showResults', e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm text-stone-700">Show results screen to respondents</span>
                        </label>

                        <div>
                          <p className="text-xs font-medium text-stone-700 mb-2">Outcomes (score ranges)</p>
                          <div className="space-y-3">
                            {(form.settings?.quiz?.outcomes || []).map((o) => (
                              <div key={o.id} className="rounded-lg border border-stone-200 p-3 space-y-2">
                                <div className="flex items-center gap-2">
                                  <input type="number" value={o.minScore} onChange={(e) => updateOutcome(o.id, { minScore: Number(e.target.value) })}
                                    className="w-20 text-sm border border-stone-300 rounded px-2 py-1.5 focus:outline-none focus:border-stone-900" placeholder="Min" />
                                  <span className="text-stone-400 text-sm">to</span>
                                  <input type="number" value={o.maxScore} onChange={(e) => updateOutcome(o.id, { maxScore: Number(e.target.value) })}
                                    className="w-20 text-sm border border-stone-300 rounded px-2 py-1.5 focus:outline-none focus:border-stone-900" placeholder="Max" />
                                  <button type="button" onClick={() => removeOutcome(o.id)} className="ml-auto text-red-600 hover:text-red-700" aria-label="Remove outcome">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <input type="text" value={o.title} onChange={(e) => updateOutcome(o.id, { title: e.target.value })}
                                  className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900" placeholder="Outcome title (e.g. Great job!)" />
                                <textarea value={o.message} onChange={(e) => updateOutcome(o.id, { message: e.target.value })} rows={2}
                                  className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900 resize-none" placeholder="Message shown for this score range" />
                              </div>
                            ))}
                          </div>
                          <button type="button" onClick={addOutcome} className="mt-2 flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900">
                            <Plus className="w-4 h-4" /> Add outcome
                          </button>
                          <p className="text-xs text-stone-400 mt-2">Set per-question points in each question's Settings panel.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Schedule + response caps */}
                  <div className="pt-3 border-t border-stone-100">
                    <p className="text-sm font-medium text-stone-700 mb-2">Schedule &amp; limits</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">Opens at</label>
                        <input
                          type="datetime-local"
                          value={toLocalInput(form.settings?.schedule?.opensAt)}
                          onChange={(e) => updateScheduleSetting('opensAt', fromLocalInput(e.target.value))}
                          className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">Closes at</label>
                        <input
                          type="datetime-local"
                          value={toLocalInput(form.settings?.schedule?.closesAt)}
                          onChange={(e) => updateScheduleSetting('closesAt', fromLocalInput(e.target.value))}
                          className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-stone-700 mb-1">Max responses (leave blank for unlimited)</label>
                      <input
                        type="number"
                        min={1}
                        value={form.settings?.schedule?.maxResponses ?? ''}
                        onChange={(e) => updateScheduleSetting('maxResponses', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-40 text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900"
                        placeholder="Unlimited"
                      />
                    </div>
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-stone-700 mb-1">Closed message</label>
                      <textarea
                        value={form.settings?.schedule?.closedMessage || ''}
                        onChange={(e) => updateScheduleSetting('closedMessage', e.target.value)}
                        rows={2}
                        className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900 resize-none"
                        placeholder="Shown when the form isn't open (e.g. Registration is now closed.)"
                      />
                    </div>
                    <p className="text-xs text-stone-400 mt-1">Times use your local timezone. The window and cap are enforced server-side.</p>
                  </div>

                  {/* Spam protection (reCAPTCHA v3) */}
                  <div className="pt-3 border-t border-stone-100">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!form.settings?.recaptcha?.enabled}
                        onChange={(e) => updateRecaptchaSetting(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-stone-700">Enable reCAPTCHA v3 spam protection</span>
                    </label>
                    <p className="text-xs text-stone-400 mt-1 pl-6">
                      Only active once the <code>NEXT_PUBLIC_RECAPTCHA_SITE_KEY</code> and <code>RECAPTCHA_SECRET_KEY</code> env vars are configured.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Fields */}
            {fields.length === 0 ? (
              <div className="bg-white rounded-lg border-2 border-dashed border-stone-200 p-12 text-center">
                <Plus className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-stone-900 mb-2">No fields yet</h3>
                <p className="text-stone-600">Click a field type on the left to add your first question</p>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <SortableField
                        key={field.id}
                        field={field}
                        index={index}
                        allFields={fields}
                        quizEnabled={!!form.settings?.quiz?.enabled}
                        expanded={expandedSettingsId === field.id}
                        onToggleExpand={() =>
                          setExpandedSettingsId(expandedSettingsId === field.id ? null : field.id)
                        }
                        onUpdate={updateField}
                        onUpdateSetting={updateFieldSetting}
                        onDelete={deleteField}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {isPublished && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-green-900 mb-2">✅ Form Published</h3>
                <p className="text-sm text-green-700 mb-4">Your form is live and ready to share.</p>
                <button
                  onClick={() => setShareModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Share2 className="w-4 h-4" /> Share Form
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ShareModal
        formId={formId}
        formTitle={form.title}
        slug={form.slug || undefined}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </div>
  )
}

// Convert a stored ISO string to the value a <input type="datetime-local">
// expects (local wall-clock, no timezone suffix). Empty when unset/invalid.
function toLocalInput(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Convert a datetime-local value (local wall-clock) back to a stored ISO string.
function fromLocalInput(local: string): string {
  if (!local) return ''
  const d = new Date(local)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString()
}

function SaveIndicator({ state }: { state: SaveState }) {
  if (state === 'saving') {
    return <span className="inline-flex items-center gap-1 text-stone-500"><Loader2 className="w-3 h-3 animate-spin" /> Saving…</span>
  }
  if (state === 'unsaved') {
    return <span className="text-amber-600">Unsaved changes</span>
  }
  return <span className="inline-flex items-center gap-1 text-stone-500"><Check className="w-3 h-3" /> All changes saved</span>
}

interface SortableFieldProps {
  field: Field
  index: number
  allFields: Field[]
  quizEnabled: boolean
  expanded: boolean
  onToggleExpand: () => void
  onUpdate: (id: string, updates: Partial<Field>) => void
  onUpdateSetting: (field: Field, key: string, value: any) => void
  onDelete: (id: string) => void
}

const SCORABLE_NUMERIC = new Set(['rating', 'opinion_scale', 'number'])

// Field types whose answers can feed a calculator term (numeric-ish).
const CALC_SOURCE_TYPES = new Set(['number', 'rating', 'opinion_scale', 'yes_no', 'consent'])

interface CalcTerm { fieldId: string; weight: number }
interface CalcConfig { terms?: CalcTerm[]; constant?: number; prefix?: string; suffix?: string }

function SortableField({ field, index, allFields, quizEnabled, expanded, onToggleExpand, onUpdate, onUpdateSetting, onDelete }: SortableFieldProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }
  const meta = getFieldMeta(field.field_type)
  const settings = field.settings || {}
  const isNumeric = meta?.category === 'number'
  const isText = field.field_type === 'short_text' || field.field_type === 'long_text'
  const scoring: Record<string, number> = (settings.scoring as Record<string, number>) || {}
  const showOptionScoring = quizEnabled && (field.field_type === 'multiple_choice' || field.field_type === 'dropdown' || field.field_type === 'picture_choice')

  // Page break is a structural divider, not an editable question — render a
  // clear separator rather than the label/options/settings UI.
  if (field.field_type === 'page_break') {
    return (
      <div ref={setNodeRef} style={style} className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="text-stone-300 hover:text-stone-500 cursor-grab active:cursor-grabbing touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>
        <div className="flex-1 flex items-center gap-3" aria-label="Page break">
          <div className="flex-1 border-t-2 border-dashed border-stone-300" />
          <span className="px-3 py-1 bg-stone-100 text-stone-600 text-xs font-medium rounded-full uppercase tracking-wide shrink-0">
            Page break
          </span>
          <div className="flex-1 border-t-2 border-dashed border-stone-300" />
        </div>
        <button onClick={() => onDelete(field.id)} className="text-stone-400 hover:text-red-600" aria-label="Delete page break">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    )
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-white rounded-lg border border-stone-200 p-5">
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="text-stone-300 hover:text-stone-500 mt-1.5 cursor-grab active:cursor-grabbing touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <div className="flex-1 space-y-3 min-w-0">
          <div className="flex items-center gap-3">
            <span className="text-stone-400 text-sm font-medium w-5 shrink-0">{index + 1}</span>
            <input
              type="text"
              value={field.label}
              onChange={(e) => onUpdate(field.id, { label: e.target.value })}
              className="flex-1 text-lg font-medium text-stone-900 border-b border-transparent hover:border-stone-200 focus:outline-none focus:border-stone-900 pb-1"
              placeholder="Question"
            />
            <span className="px-2.5 py-1 bg-stone-100 text-stone-600 text-xs rounded-full shrink-0">
              {meta?.icon} {meta?.label || field.field_type}
            </span>
          </div>

          {/* Choice options */}
          {fieldHasOptions(field.field_type) && (
            <div className="pt-2 pl-8">
              <FieldOptionsEditor
                options={field.options || ['Option 1', 'Option 2', 'Option 3']}
                onChange={(opts) => onUpdate(field.id, { options: opts })}
                fieldType={field.field_type as any}
                images={field.field_type === 'picture_choice' ? (settings.images as Record<string, string>) : undefined}
                onImagesChange={field.field_type === 'picture_choice' ? (imgs) => onUpdateSetting(field, 'images', imgs) : undefined}
                scoring={showOptionScoring ? scoring : undefined}
                onScoringChange={showOptionScoring ? (sc) => onUpdateSetting(field, 'scoring', sc) : undefined}
              />
            </div>
          )}

          {/* Controls row */}
          <div className="flex items-center gap-4 pl-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => onUpdate(field.id, { required: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-stone-600">Required</span>
            </label>
            <button
              onClick={onToggleExpand}
              className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900"
            >
              <Settings2 className="w-4 h-4" /> Settings
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Expandable per-field settings */}
          {expanded && (
            <div className="pl-8 pt-3 mt-2 border-t border-stone-100 space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Help text</label>
                <input
                  type="text"
                  value={settings.description || ''}
                  onChange={(e) => onUpdateSetting(field, 'description', e.target.value)}
                  className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900"
                  placeholder="Extra guidance shown under the question"
                />
              </div>

              {/* Consent (GDPR) config */}
              {field.field_type === 'consent' && (
                <div className="rounded-lg border border-stone-200 p-3 space-y-2">
                  <p className="text-xs font-medium text-stone-700">Consent</p>
                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Consent text</label>
                    <input
                      type="text"
                      value={settings.consentLabel || ''}
                      onChange={(e) => onUpdateSetting(field, 'consentLabel', e.target.value)}
                      className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900"
                      placeholder="I agree to the terms and conditions"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Privacy policy URL</label>
                      <input
                        type="text"
                        value={settings.policyUrl || ''}
                        onChange={(e) => onUpdateSetting(field, 'policyUrl', e.target.value)}
                        className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900"
                        placeholder="https://example.com/privacy"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Link text</label>
                      <input
                        type="text"
                        value={settings.policyText || ''}
                        onChange={(e) => onUpdateSetting(field, 'policyText', e.target.value)}
                        className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900"
                        placeholder="Privacy Policy"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-stone-400">Mark the field Required to force respondents to tick the box.</p>
                </div>
              )}

              {/* Calculator config */}
              {field.field_type === 'calculator' && (
                <CalculatorConfig
                  field={field}
                  allFields={allFields}
                  onUpdateSetting={onUpdateSetting}
                />
              )}

              {!fieldHasOptions(field.field_type) && field.field_type !== 'yes_no' && field.field_type !== 'consent' && field.field_type !== 'calculator' && (
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Placeholder</label>
                  <input
                    type="text"
                    value={field.placeholder || ''}
                    onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
                    className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900"
                    placeholder="Placeholder text…"
                  />
                </div>
              )}

              {field.field_type === 'hidden' && (
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">URL parameter name</label>
                  <input
                    type="text"
                    value={settings.ref || ''}
                    onChange={(e) => onUpdateSetting(field, 'ref', e.target.value)}
                    className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900 font-mono"
                    placeholder="e.g. utm_source"
                  />
                  <p className="text-xs text-stone-400 mt-1">Captured from <code>?{settings.ref || 'param'}=value</code> in the form URL.</p>
                </div>
              )}

              {isNumeric && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Min</label>
                    <input
                      type="number"
                      value={settings.min ?? ''}
                      onChange={(e) => onUpdateSetting(field, 'min', e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Max</label>
                    <input
                      type="number"
                      value={settings.max ?? ''}
                      onChange={(e) => onUpdateSetting(field, 'max', e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>
              )}

              {isText && (
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Max length (characters)</label>
                  <input
                    type="number"
                    value={settings.maxLength ?? ''}
                    onChange={(e) => onUpdateSetting(field, 'maxLength', e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-40 text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900"
                    placeholder="No limit"
                  />
                </div>
              )}

              {/* Quiz scoring — yes/no points */}
              {quizEnabled && field.field_type === 'yes_no' && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2">
                  <p className="text-xs font-medium text-amber-800">Quiz scoring</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Points for "Yes"</label>
                      <input type="number" value={scoring['true'] ?? ''} onChange={(e) => onUpdateSetting(field, 'scoring', { ...scoring, ...(e.target.value === '' ? (() => { const n = { ...scoring }; delete n['true']; return n })() : { true: Number(e.target.value) }) })}
                        className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900" />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Points for "No"</label>
                      <input type="number" value={scoring['false'] ?? ''} onChange={(e) => onUpdateSetting(field, 'scoring', { ...scoring, ...(e.target.value === '' ? (() => { const n = { ...scoring }; delete n['false']; return n })() : { false: Number(e.target.value) }) })}
                        className="w-full text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900" />
                    </div>
                  </div>
                </div>
              )}

              {/* Quiz scoring — checkbox per-option points */}
              {quizEnabled && field.field_type === 'checkboxes' && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2">
                  <p className="text-xs font-medium text-amber-800">Quiz scoring (points per selected option)</p>
                  {(field.options || []).map((opt) => (
                    <div key={opt} className="flex items-center gap-2">
                      <span className="flex-1 text-sm text-stone-700 truncate">{opt}</span>
                      <input type="number" value={scoring[opt] ?? ''}
                        onChange={(e) => { const n = { ...scoring }; if (e.target.value === '') delete n[opt]; else n[opt] = Number(e.target.value); onUpdateSetting(field, 'scoring', n) }}
                        className="w-24 text-sm border border-stone-300 rounded px-2 py-1.5 focus:outline-none focus:border-stone-900" placeholder="pts" />
                    </div>
                  ))}
                </div>
              )}

              {/* Quiz scoring — numeric weight */}
              {quizEnabled && SCORABLE_NUMERIC.has(field.field_type) && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2">
                  <p className="text-xs font-medium text-amber-800">Quiz scoring</p>
                  <label className="block text-xs text-stone-600 mb-1">Weight (points = answer × weight)</label>
                  <input type="number" step="any" value={scoring['weight'] ?? ''}
                    onChange={(e) => { const n = { ...scoring }; if (e.target.value === '') delete n['weight']; else n['weight'] = Number(e.target.value); onUpdateSetting(field, 'scoring', n) }}
                    className="w-40 text-sm border border-stone-300 rounded px-3 py-2 focus:outline-none focus:border-stone-900" placeholder="1" />
                </div>
              )}
            </div>
          )}
        </div>

        <button onClick={() => onDelete(field.id)} className="text-stone-400 hover:text-red-600 mt-1.5" aria-label="Delete field">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// Config UI for a calculator field. Writes settings.calculation =
// { terms: [{fieldId, weight}], constant?, prefix?, suffix? }.
function CalculatorConfig({
  field,
  allFields,
  onUpdateSetting,
}: {
  field: Field
  allFields: Field[]
  onUpdateSetting: (field: Field, key: string, value: any) => void
}) {
  const calc: CalcConfig = (field.settings?.calculation as CalcConfig) || {}
  const terms: CalcTerm[] = Array.isArray(calc.terms) ? calc.terms : []
  // Candidate source fields: numeric-ish fields, excluding this calculator itself.
  const sources = allFields.filter(
    (f) => f.id !== field.id && CALC_SOURCE_TYPES.has(f.field_type)
  )
  const labelFor = (id: string) => allFields.find((f) => f.id === id)?.label || 'Unknown field'

  const write = (next: CalcConfig) => onUpdateSetting(field, 'calculation', next)

  const addTerm = () => {
    const used = new Set(terms.map((t) => t.fieldId))
    const candidate = sources.find((s) => !used.has(s.id)) || sources[0]
    if (!candidate) return
    write({ ...calc, terms: [...terms, { fieldId: candidate.id, weight: 1 }] })
  }
  const updateTerm = (i: number, patch: Partial<CalcTerm>) => {
    write({ ...calc, terms: terms.map((t, idx) => (idx === i ? { ...t, ...patch } : t)) })
  }
  const removeTerm = (i: number) => {
    write({ ...calc, terms: terms.filter((_, idx) => idx !== i) })
  }

  return (
    <div className="rounded-lg border border-stone-200 p-3 space-y-3">
      <p className="text-xs font-medium text-stone-700">Calculation</p>
      {sources.length === 0 && (
        <p className="text-xs text-stone-400">
          Add Number, Rating, Opinion Scale, Yes/No or Consent fields above to reference them here.
        </p>
      )}

      <div className="space-y-2">
        {terms.map((t, i) => (
          <div key={i} className="flex items-center gap-2">
            <select
              value={t.fieldId}
              onChange={(e) => updateTerm(i, { fieldId: e.target.value })}
              className="flex-1 text-sm border border-stone-300 rounded px-2 py-1.5 focus:outline-none focus:border-stone-900"
            >
              {!sources.some((s) => s.id === t.fieldId) && (
                <option value={t.fieldId}>{labelFor(t.fieldId)}</option>
              )}
              {sources.map((s) => (
                <option key={s.id} value={s.id}>{s.label || 'Untitled'}</option>
              ))}
            </select>
            <span className="text-xs text-stone-400">×</span>
            <input
              type="number"
              step="any"
              value={t.weight}
              onChange={(e) => updateTerm(i, { weight: e.target.value === '' ? 0 : Number(e.target.value) })}
              className="w-20 text-sm border border-stone-300 rounded px-2 py-1.5 focus:outline-none focus:border-stone-900"
              placeholder="1"
            />
            <button type="button" onClick={() => removeTerm(i)} className="text-red-600 hover:text-red-700" aria-label="Remove term">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addTerm}
        disabled={sources.length === 0}
        className="flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 disabled:opacity-40"
      >
        <Plus className="w-4 h-4" /> Add field to formula
      </button>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100">
        <div>
          <label className="block text-xs text-stone-600 mb-1">Constant (+)</label>
          <input
            type="number"
            step="any"
            value={calc.constant ?? ''}
            onChange={(e) => write({ ...calc, constant: e.target.value === '' ? undefined : Number(e.target.value) })}
            className="w-full text-sm border border-stone-300 rounded px-2 py-1.5 focus:outline-none focus:border-stone-900"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-xs text-stone-600 mb-1">Prefix</label>
          <input
            type="text"
            value={calc.prefix ?? ''}
            onChange={(e) => write({ ...calc, prefix: e.target.value || undefined })}
            className="w-full text-sm border border-stone-300 rounded px-2 py-1.5 focus:outline-none focus:border-stone-900"
            placeholder="£"
          />
        </div>
        <div>
          <label className="block text-xs text-stone-600 mb-1">Suffix</label>
          <input
            type="text"
            value={calc.suffix ?? ''}
            onChange={(e) => write({ ...calc, suffix: e.target.value || undefined })}
            className="w-full text-sm border border-stone-300 rounded px-2 py-1.5 focus:outline-none focus:border-stone-900"
            placeholder=" pts"
          />
        </div>
      </div>
      <p className="text-xs text-stone-400">Value = sum(field × weight) + constant. Computed live and recomputed on submit.</p>
    </div>
  )
}
