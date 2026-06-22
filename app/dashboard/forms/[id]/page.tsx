'use client'
import { useParams } from 'next/navigation'

import { use, useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Plus, Trash2, GripVertical, Eye, Share2,
  Settings2, ChevronDown, ChevronUp, Check, Loader2, Globe, Pencil, BarChart3, Webhook, Palette, GitBranch,
  Heading, AlignLeft, Quote, MousePointerClick, Image as ImageIcon, Video, AppWindow, Code2, Minus, MoveVertical, LayoutGrid,
  type LucideIcon,
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
import BlockEditor, { blockPreview } from '@/components/forms/BlockEditor'
import { Badge } from '@/components/ui/badge'
import { FIELD_TYPES, fieldHasOptions, getFieldMeta, isContentBlock } from '@/lib/field-types'
import {
  BLOCK_LIBRARY, defaultBlockSettings, PRESENTATION_MODES, getPresentation,
  type BlockGroup, type PresentationMode,
} from '@/lib/blocks'

// Maps the lucide icon NAME from BLOCK_LIBRARY to the actual component.
const BLOCK_ICONS: Record<string, LucideIcon> = {
  Heading, AlignLeft, Quote, MousePointerClick, Image: ImageIcon, Video,
  AppWindow, Code2, Minus, MoveVertical, LayoutGrid,
}

const BLOCK_GROUP_LABELS: Record<BlockGroup, string> = {
  content: 'Content',
  media: 'Media',
  layout: 'Layout',
}

const PRESENTATION_LABELS: Record<PresentationMode, { label: string; description: string }> = {
  conversational: { label: 'Conversational', description: 'One block per screen, Typeform-style.' },
  classic: { label: 'Classic', description: 'All blocks on one scrolling page.' },
  magazine: { label: 'Magazine', description: 'Editorial layout; sections act as page boundaries.' },
}

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
  gamify?: { enabled?: boolean; reactions?: boolean; milestones?: boolean }
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

  // ---- Gamification settings ----
  // Spread prev.settings so other keys (quiz, schedule, recaptcha, emailBranding,
  // …) are never dropped when the PATCH replaces settings wholesale.
  const updateGamifySetting = (key: 'enabled' | 'reactions' | 'milestones', value: boolean) => {
    setForm((prev) => prev ? {
      ...prev,
      settings: { ...(prev.settings || {}), gamify: { ...((prev.settings as any)?.gamify || {}), [key]: value } },
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

  // Add a CONTENT block. Reuses the EXACT same fields API as questions: a block
  // is a form_fields row whose field_type is the block type and whose content
  // lives in settings (seeded from defaultBlockSettings). No new API.
  const addBlock = async (blockType: string) => {
    try {
      const res = await fetch(`/api/forms/${formId}/fields`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field_type: blockType,
          label: '',
          required: false,
          options: null,
          settings: defaultBlockSettings(blockType),
        }),
      })
      if (!res.ok) return
      const data = await res.json()
      if (data.field) {
        setFields((prev) => [...prev, data.field])
        // Open its editor straight away so the owner can fill it in.
        setExpandedSettingsId(data.field.id)
      }
    } catch (error) {
      console.error('Failed to add block:', error)
    }
  }

  // Presentation mode lives in forms.settings.presentation. Spread existing
  // settings so quiz/schedule/gamify/etc. are never dropped.
  const setPresentation = (mode: PresentationMode) => updateSetting('presentation', mode)

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl heading-tight text-foreground mb-4">Form Not Found</h1>
          <Link href="/dashboard/forms" className="text-muted-foreground hover:text-foreground">← Back to Forms</Link>
        </div>
      </div>
    )
  }

  const isPublished = form.status === 'published'

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Link href="/dashboard/forms" aria-label="Back to forms" className="text-muted-foreground hover:text-foreground shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="min-w-0">
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  aria-label="Form title"
                  className="text-xl heading-tight text-foreground border-none focus:outline-none bg-transparent w-full"
                  placeholder="Form Title"
                />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${isPublished ? 'bg-secondary text-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {isPublished ? <Globe className="w-3 h-3" /> : <Pencil className="w-3 h-3" />}
                    {isPublished ? 'Published' : 'Draft'}
                  </span>
                  <span>· {fields.length} {fields.length === 1 ? 'field' : 'fields'}</span>
                  <span>·</span>
                  <SaveIndicator state={saveState} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap lg:shrink-0 -mx-6 px-6 lg:mx-0 lg:px-0 overflow-x-auto lg:overflow-visible">
              <Link
                href={`/f/${formId}`}
                target="_blank"
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-md hover:bg-secondary text-sm text-foreground transition-colors shrink-0"
              >
                <Eye className="w-4 h-4" /> Preview
              </Link>

              <Link
                href={`/dashboard/forms/${formId}/themes`}
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-md hover:bg-secondary text-sm text-foreground transition-colors shrink-0"
              >
                <Palette className="w-4 h-4" /> Design
              </Link>

              <Link
                href={`/dashboard/forms/${formId}/logic`}
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-md hover:bg-secondary text-sm text-foreground transition-colors shrink-0"
              >
                <GitBranch className="w-4 h-4" /> Logic
              </Link>

              <Link
                href={`/dashboard/forms/${formId}/integrations`}
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-md hover:bg-secondary text-sm text-foreground transition-colors shrink-0"
              >
                <Webhook className="w-4 h-4" /> Integrations
              </Link>

              {isPublished && (
                <button
                  onClick={() => setShareModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 border border-border rounded-md hover:bg-secondary text-sm text-foreground transition-colors shrink-0"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
              )}

              {isPublished ? (
                <>
                  <Link
                    href={`/dashboard/forms/${formId}/analytics`}
                    className="flex items-center gap-2 px-3 py-2 border border-border rounded-md hover:bg-secondary text-sm text-foreground transition-colors shrink-0"
                  >
                    <BarChart3 className="w-4 h-4" /> Analytics
                  </Link>
                  <Link
                    href={`/dashboard/forms/${formId}/responses`}
                    className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm transition-colors shrink-0"
                  >
                    Responses
                  </Link>
                  <button
                    onClick={() => setStatus('draft')}
                    disabled={publishing}
                    className="px-3 py-2 border border-border rounded-md hover:bg-secondary text-sm text-foreground disabled:opacity-50 transition-colors shrink-0"
                  >
                    {publishing ? 'Working…' : 'Unpublish'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setStatus('published')}
                  disabled={publishing}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 text-sm font-medium transition-colors shrink-0"
                >
                  {publishing ? 'Publishing…' : 'Publish'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Field Types + Content Blocks Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-surface p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
              <h3 className="heading-tight text-foreground mb-4">Add Fields</h3>
              <div className="space-y-2">
                {FIELD_TYPES.filter((t) => t.input || t.value === 'statement' || t.value === 'page_break').map((type) => (
                  <button
                    key={type.value}
                    onClick={() => addField(type.value)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 border border-border rounded-md hover:bg-secondary text-left transition-colors"
                  >
                    <span className="text-xl">{type.icon}</span>
                    <span className="text-sm font-medium text-foreground">{type.label}</span>
                  </button>
                ))}
              </div>

              {/* Content blocks — grouped per BLOCK_LIBRARY (Content / Media / Layout) */}
              <div className="mt-6 pt-4 border-t border-border">
                <h3 className="heading-tight text-foreground mb-1">Add Content</h3>
                <p className="text-xs text-muted-foreground mb-4">Non-question blocks that interleave with your questions.</p>
                {(['content', 'media', 'layout'] as BlockGroup[]).map((group) => {
                  const entries = BLOCK_LIBRARY.filter((b) => b.group === group)
                  if (entries.length === 0) return null
                  return (
                    <div key={group} className="mb-4 last:mb-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                        {BLOCK_GROUP_LABELS[group]}
                      </p>
                      <div className="space-y-2">
                        {entries.map((b) => {
                          const Icon = BLOCK_ICONS[b.icon] || LayoutGrid
                          return (
                            <button
                              key={b.type}
                              onClick={() => addBlock(b.type)}
                              title={b.description}
                              className="w-full flex items-center gap-3 px-3 py-2.5 border border-border rounded-md hover:bg-secondary text-left transition-colors"
                            >
                              <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                              <span className="text-sm font-medium text-foreground">{b.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Form Builder */}
          <div className="lg:col-span-3 space-y-6">
            {/* Form Header */}
            <div className="card-surface p-6">
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                aria-label="Form title"
                className="text-2xl heading-tight text-foreground w-full border-none focus:outline-none mb-2 bg-transparent"
                placeholder="Form Title"
              />
              <textarea
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                aria-label="Form description"
                className="w-full text-muted-foreground border-none focus:outline-none resize-none bg-transparent"
                placeholder="Add a description..."
                rows={2}
              />
            </div>

            {/* Form Settings */}
            <div className="card-surface">
              <button
                onClick={() => setFormSettingsOpen((v) => !v)}
                aria-expanded={formSettingsOpen}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <Settings2 className="w-4 h-4" /> Form settings
                </span>
                {formSettingsOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {formSettingsOpen && (
                <div className="px-6 pb-6 space-y-4 border-t border-border pt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.settings?.showProgressBar !== false}
                      onChange={(e) => updateSetting('showProgressBar', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-foreground">Show progress bar</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.settings?.allowMultipleSubmissions !== false}
                      onChange={(e) => updateSetting('allowMultipleSubmissions', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-foreground">Allow multiple submissions per visitor</span>
                  </label>
                  {/* Presentation mode — selects how the whole block list is rendered */}
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm font-medium text-foreground mb-1">Presentation mode</p>
                    <p className="text-xs text-muted-foreground mb-3">How questions and content blocks are presented to respondents.</p>
                    <div className="space-y-2">
                      {PRESENTATION_MODES.map((mode) => {
                        const active = getPresentation(form) === mode
                        const info = PRESENTATION_LABELS[mode]
                        return (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setPresentation(mode)}
                            className={`w-full flex items-start gap-3 text-left px-3 py-2.5 border rounded-md transition-colors ${
                              active ? 'border-foreground bg-secondary' : 'border-border hover:bg-secondary/60'
                            }`}
                          >
                            <span className={`mt-0.5 w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${active ? 'border-foreground' : 'border-input'}`}>
                              {active && <span className="w-2 h-2 rounded-full bg-foreground" />}
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-medium text-foreground">{info.label}</span>
                              <span className="block text-xs text-muted-foreground">{info.description}</span>
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Welcome screen */}
                  <div className="pt-3 border-t border-border">
                    <label className="flex items-center gap-3 cursor-pointer mb-2">
                      <input
                        type="checkbox"
                        checked={form.settings?.welcome?.enabled !== false}
                        onChange={(e) => updateNestedSetting('welcome', 'enabled', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-foreground">Show welcome screen</span>
                    </label>
                    {form.settings?.welcome?.enabled !== false && (
                      <div className="space-y-2 pl-6">
                        <input type="text" value={form.settings?.welcome?.title || ''} onChange={(e) => updateNestedSetting('welcome', 'title', e.target.value)}
                          className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground" placeholder="Welcome title (defaults to form title)" />
                        <input type="text" value={form.settings?.welcome?.description || ''} onChange={(e) => updateNestedSetting('welcome', 'description', e.target.value)}
                          className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground" placeholder="Welcome subtitle" />
                        <input type="text" value={form.settings?.welcome?.buttonText || ''} onChange={(e) => updateNestedSetting('welcome', 'buttonText', e.target.value)}
                          className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground" placeholder="Start button text (default: Start)" />
                      </div>
                    )}
                  </div>

                  {/* Ending screen */}
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm font-medium text-foreground mb-2">Ending screen</p>
                    <div className="space-y-2">
                      <input type="text" value={form.settings?.ending?.title || ''} onChange={(e) => updateNestedSetting('ending', 'title', e.target.value)}
                        className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground" placeholder="Ending title (default: Thank you!)" />
                      <textarea value={form.settings?.ending?.message || ''} onChange={(e) => updateNestedSetting('ending', 'message', e.target.value)} rows={2}
                        className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground resize-none" placeholder="Ending message" />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Redirect URL after submit (overrides ending screen)</label>
                    <input
                      type="text"
                      value={form.settings?.redirectUrl || ''}
                      onChange={(e) => updateSetting('redirectUrl', e.target.value)}
                      className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                      placeholder="https://example.com/thank-you"
                    />
                  </div>

                  {/* Custom link / slug */}
                  <div className="pt-3 border-t border-border">
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Custom link / slug (optional)</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground shrink-0">/f/</span>
                      <input
                        type="text"
                        value={slugInput}
                        onChange={(e) => { setSlugInput(e.target.value.toLowerCase()); setSlugStatus({ kind: 'idle' }) }}
                        onBlur={saveSlug}
                        className="flex-1 text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground font-mono"
                        placeholder="my-form"
                      />
                      <button
                        type="button"
                        onClick={saveSlug}
                        disabled={slugStatus.kind === 'saving'}
                        className="px-3 py-2 text-sm border border-input rounded hover:bg-secondary disabled:opacity-50 shrink-0"
                      >
                        {slugStatus.kind === 'saving' ? 'Saving…' : 'Save'}
                      </button>
                    </div>
                    {slugStatus.kind === 'error' && <p className="text-xs text-destructive mt-1">{slugStatus.message}</p>}
                    {slugStatus.kind === 'saved' && <p className="text-xs text-muted-foreground mt-1">Custom link saved.</p>}
                    <p className="text-xs text-muted-foreground mt-1">3-40 chars: lowercase letters, numbers, hyphens. Leave blank to use the default link.</p>
                  </div>

                  {/* Quiz mode */}
                  <div className="pt-3 border-t border-border">
                    <label className="flex items-center gap-3 cursor-pointer mb-2">
                      <input
                        type="checkbox"
                        checked={!!form.settings?.quiz?.enabled}
                        onChange={(e) => updateQuizSetting('enabled', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-foreground">Quiz mode (score answers)</span>
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
                          <span className="text-sm text-foreground">Show results screen to respondents</span>
                        </label>

                        <div>
                          <p className="text-xs font-medium text-foreground mb-2">Outcomes (score ranges)</p>
                          <div className="space-y-3">
                            {(form.settings?.quiz?.outcomes || []).map((o) => (
                              <div key={o.id} className="rounded-lg border border-border p-3 space-y-2">
                                <div className="flex items-center gap-2">
                                  <input type="number" value={o.minScore} onChange={(e) => updateOutcome(o.id, { minScore: Number(e.target.value) })}
                                    className="w-20 text-sm border border-input rounded-md px-2 py-1.5 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground" placeholder="Min" />
                                  <span className="text-muted-foreground text-sm">to</span>
                                  <input type="number" value={o.maxScore} onChange={(e) => updateOutcome(o.id, { maxScore: Number(e.target.value) })}
                                    className="w-20 text-sm border border-input rounded-md px-2 py-1.5 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground" placeholder="Max" />
                                  <button type="button" onClick={() => removeOutcome(o.id)} className="ml-auto text-destructive hover:text-destructive/80" aria-label="Remove outcome">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <input type="text" value={o.title} onChange={(e) => updateOutcome(o.id, { title: e.target.value })}
                                  className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground" placeholder="Outcome title (e.g. Great job!)" />
                                <textarea value={o.message} onChange={(e) => updateOutcome(o.id, { message: e.target.value })} rows={2}
                                  className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground resize-none" placeholder="Message shown for this score range" />
                              </div>
                            ))}
                          </div>
                          <button type="button" onClick={addOutcome} className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                            <Plus className="w-4 h-4" /> Add outcome
                          </button>
                          <p className="text-xs text-muted-foreground mt-2">Set per-question points in each question's Settings panel.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Schedule + response caps */}
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm font-medium text-foreground mb-2">Schedule &amp; limits</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Opens at</label>
                        <input
                          type="datetime-local"
                          value={toLocalInput(form.settings?.schedule?.opensAt)}
                          onChange={(e) => updateScheduleSetting('opensAt', fromLocalInput(e.target.value))}
                          className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Closes at</label>
                        <input
                          type="datetime-local"
                          value={toLocalInput(form.settings?.schedule?.closesAt)}
                          onChange={(e) => updateScheduleSetting('closesAt', fromLocalInput(e.target.value))}
                          className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Max responses (leave blank for unlimited)</label>
                      <input
                        type="number"
                        min={1}
                        value={form.settings?.schedule?.maxResponses ?? ''}
                        onChange={(e) => updateScheduleSetting('maxResponses', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-40 text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                        placeholder="Unlimited"
                      />
                    </div>
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Closed message</label>
                      <textarea
                        value={form.settings?.schedule?.closedMessage || ''}
                        onChange={(e) => updateScheduleSetting('closedMessage', e.target.value)}
                        rows={2}
                        className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground resize-none"
                        placeholder="Shown when the form isn't open (e.g. Registration is now closed.)"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Times use your local timezone. The window and cap are enforced server-side.</p>
                  </div>

                  {/* Spam protection (reCAPTCHA v3) */}
                  <div className="pt-3 border-t border-border">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!form.settings?.recaptcha?.enabled}
                        onChange={(e) => updateRecaptchaSetting(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-foreground">Enable reCAPTCHA v3 spam protection</span>
                    </label>
                    <p className="text-xs text-muted-foreground mt-1 pl-6">
                      Only active once the <code>NEXT_PUBLIC_RECAPTCHA_SITE_KEY</code> and <code>RECAPTCHA_SECRET_KEY</code> env vars are configured.
                    </p>
                  </div>

                  {/* Gamified experience */}
                  <div className="pt-3 border-t border-border">
                    <label className="flex items-center gap-3 cursor-pointer mb-2">
                      <input
                        type="checkbox"
                        checked={form.settings?.gamify?.enabled !== false}
                        onChange={(e) => updateGamifySetting('enabled', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-foreground">Gamified experience</span>
                    </label>
                    <p className="text-xs text-muted-foreground mb-2 pl-6">
                      Adds playful touches as people answer — celebratory confetti at milestones and an emoji reaction bar on each question.
                    </p>
                    {form.settings?.gamify?.enabled !== false && (
                      <div className="space-y-2 pl-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.settings?.gamify?.reactions !== false}
                            onChange={(e) => updateGamifySetting('reactions', e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm text-foreground">Emoji reactions on each question</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.settings?.gamify?.milestones !== false}
                            onChange={(e) => updateGamifySetting('milestones', e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm text-foreground">Milestone celebrations (confetti)</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Fields */}
            {fields.length === 0 ? (
              <div className="card-surface border-dashed border-2 p-12 text-center">
                <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg heading-tight text-foreground mb-2">No fields yet</h3>
                <p className="text-muted-foreground">Click a field type on the left to add your first question</p>
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
              <div className="bg-secondary border border-border rounded-lg p-6">
                <h3 className="heading-tight text-foreground mb-2">✅ Form Published</h3>
                <p className="text-sm text-muted-foreground mb-4">Your form is live and ready to share.</p>
                <button
                  onClick={() => setShareModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
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
    return <span className="inline-flex items-center gap-1 text-muted-foreground"><Loader2 className="w-3 h-3 animate-spin" /> Saving…</span>
  }
  if (state === 'unsaved') {
    return <span className="text-muted-foreground">Unsaved changes</span>
  }
  return <span className="inline-flex items-center gap-1 text-muted-foreground"><Check className="w-3 h-3" /> All changes saved</span>
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
          className="text-muted-foreground/50 hover:text-muted-foreground cursor-grab active:cursor-grabbing touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>
        <div className="flex-1 flex items-center gap-3" aria-label="Page break">
          <div className="flex-1 border-t-2 border-dashed border-input" />
          <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full uppercase tracking-wide shrink-0">
            Page break
          </span>
          <div className="flex-1 border-t-2 border-dashed border-input" />
        </div>
        <button onClick={() => onDelete(field.id)} className="text-muted-foreground hover:text-destructive" aria-label="Delete page break">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    )
  }

  // ---- Content block row ----
  // Content blocks (heading/text/image/…) are presentational, collect no answer,
  // and have no label/required/options. Render a lighter, visually distinct row
  // with the block icon + a "Content" badge + a preview snippet. They stay in the
  // SAME sortable list (shared `position`) and edit via the same settings PATCH.
  if (isContentBlock(field.field_type)) {
    const Icon = BLOCK_ICONS[BLOCK_LIBRARY.find((b) => b.type === field.field_type)?.icon || ''] || LayoutGrid
    const preview = blockPreview(field)
    return (
      <div ref={setNodeRef} style={style} className="rounded-lg border border-dashed border-border bg-secondary/40 p-4">
        <div className="flex items-start gap-3">
          <button
            {...attributes}
            {...listeners}
            className="text-muted-foreground/50 hover:text-muted-foreground mt-1 cursor-grab active:cursor-grabbing touch-none"
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-muted-foreground text-sm font-medium w-5 shrink-0">{index + 1}</span>
              <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-medium text-foreground shrink-0">{meta?.label || field.field_type}</span>
              <Badge variant="outline" className="shrink-0">Content</Badge>
              {preview && <span className="text-sm text-muted-foreground truncate">{preview}</span>}
              <button
                onClick={onToggleExpand}
                aria-expanded={expanded}
                className="ml-auto flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground shrink-0"
              >
                <Settings2 className="w-4 h-4" /> Edit
                {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {expanded && (
              <div className="pl-8 pt-3 mt-2 border-t border-border">
                <BlockEditor field={field} onUpdateSetting={onUpdateSetting as any} />
              </div>
            )}
          </div>

          <button onClick={() => onDelete(field.id)} className="text-muted-foreground hover:text-destructive mt-1" aria-label="Delete block">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div ref={setNodeRef} style={style} className="card-surface p-5">
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="text-muted-foreground/50 hover:text-muted-foreground mt-1.5 cursor-grab active:cursor-grabbing touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <div className="flex-1 space-y-3 min-w-0">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-sm font-medium w-5 shrink-0">{index + 1}</span>
            <input
              type="text"
              value={field.label}
              onChange={(e) => onUpdate(field.id, { label: e.target.value })}
              aria-label={`Question ${index + 1} label`}
              className="flex-1 text-lg font-medium text-foreground border-b border-transparent hover:border-border focus:outline-none focus:border-foreground pb-1"
              placeholder="Question"
            />
            <span className="px-2.5 py-1 bg-muted text-muted-foreground text-xs rounded-full shrink-0">
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
              <span className="text-sm text-muted-foreground">Required</span>
            </label>
            <button
              onClick={onToggleExpand}
              aria-expanded={expanded}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <Settings2 className="w-4 h-4" /> Settings
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Expandable per-field settings */}
          {expanded && (
            <div className="pl-8 pt-3 mt-2 border-t border-border space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Help text</label>
                <input
                  type="text"
                  value={settings.description || ''}
                  onChange={(e) => onUpdateSetting(field, 'description', e.target.value)}
                  className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                  placeholder="Extra guidance shown under the question"
                />
              </div>

              {/* Consent (GDPR) config */}
              {field.field_type === 'consent' && (
                <div className="rounded-lg border border-border p-3 space-y-2">
                  <p className="text-xs font-medium text-foreground">Consent</p>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Consent text</label>
                    <input
                      type="text"
                      value={settings.consentLabel || ''}
                      onChange={(e) => onUpdateSetting(field, 'consentLabel', e.target.value)}
                      className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                      placeholder="I agree to the terms and conditions"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Privacy policy URL</label>
                      <input
                        type="text"
                        value={settings.policyUrl || ''}
                        onChange={(e) => onUpdateSetting(field, 'policyUrl', e.target.value)}
                        className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                        placeholder="https://example.com/privacy"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Link text</label>
                      <input
                        type="text"
                        value={settings.policyText || ''}
                        onChange={(e) => onUpdateSetting(field, 'policyText', e.target.value)}
                        className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                        placeholder="Privacy Policy"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Mark the field Required to force respondents to tick the box.</p>
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

              {/* Payment config (Stripe Connect, fixed amount) */}
              {field.field_type === 'payment' && (
                <PaymentConfig field={field} onUpdateSetting={onUpdateSetting} />
              )}

              {!fieldHasOptions(field.field_type) && field.field_type !== 'yes_no' && field.field_type !== 'consent' && field.field_type !== 'calculator' && field.field_type !== 'payment' && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Placeholder</label>
                  <input
                    type="text"
                    value={field.placeholder || ''}
                    onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
                    className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                    placeholder="Placeholder text…"
                  />
                </div>
              )}

              {field.field_type === 'hidden' && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">URL parameter name</label>
                  <input
                    type="text"
                    value={settings.ref || ''}
                    onChange={(e) => onUpdateSetting(field, 'ref', e.target.value)}
                    className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground font-mono"
                    placeholder="e.g. utm_source"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Captured from <code>?{settings.ref || 'param'}=value</code> in the form URL.</p>
                </div>
              )}

              {isNumeric && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Min</label>
                    <input
                      type="number"
                      value={settings.min ?? ''}
                      onChange={(e) => onUpdateSetting(field, 'min', e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Max</label>
                    <input
                      type="number"
                      value={settings.max ?? ''}
                      onChange={(e) => onUpdateSetting(field, 'max', e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                    />
                  </div>
                </div>
              )}

              {isText && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Max length (characters)</label>
                  <input
                    type="number"
                    value={settings.maxLength ?? ''}
                    onChange={(e) => onUpdateSetting(field, 'maxLength', e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-40 text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                    placeholder="No limit"
                  />
                </div>
              )}

              {/* Quiz scoring — yes/no points */}
              {quizEnabled && field.field_type === 'yes_no' && (
                <div className="rounded-lg border border-border bg-secondary p-3 space-y-2">
                  <p className="text-xs font-medium text-foreground">Quiz scoring</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Points for "Yes"</label>
                      <input type="number" value={scoring['true'] ?? ''} onChange={(e) => onUpdateSetting(field, 'scoring', { ...scoring, ...(e.target.value === '' ? (() => { const n = { ...scoring }; delete n['true']; return n })() : { true: Number(e.target.value) }) })}
                        className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground" />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Points for "No"</label>
                      <input type="number" value={scoring['false'] ?? ''} onChange={(e) => onUpdateSetting(field, 'scoring', { ...scoring, ...(e.target.value === '' ? (() => { const n = { ...scoring }; delete n['false']; return n })() : { false: Number(e.target.value) }) })}
                        className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground" />
                    </div>
                  </div>
                </div>
              )}

              {/* Quiz scoring — checkbox per-option points */}
              {quizEnabled && field.field_type === 'checkboxes' && (
                <div className="rounded-lg border border-border bg-secondary p-3 space-y-2">
                  <p className="text-xs font-medium text-foreground">Quiz scoring (points per selected option)</p>
                  {(field.options || []).map((opt) => (
                    <div key={opt} className="flex items-center gap-2">
                      <span className="flex-1 text-sm text-foreground truncate">{opt}</span>
                      <input type="number" value={scoring[opt] ?? ''}
                        onChange={(e) => { const n = { ...scoring }; if (e.target.value === '') delete n[opt]; else n[opt] = Number(e.target.value); onUpdateSetting(field, 'scoring', n) }}
                        className="w-24 text-sm border border-input rounded-md px-2 py-1.5 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground" placeholder="pts" />
                    </div>
                  ))}
                </div>
              )}

              {/* Quiz scoring — numeric weight */}
              {quizEnabled && SCORABLE_NUMERIC.has(field.field_type) && (
                <div className="rounded-lg border border-border bg-secondary p-3 space-y-2">
                  <p className="text-xs font-medium text-foreground">Quiz scoring</p>
                  <label className="block text-xs text-muted-foreground mb-1">Weight (points = answer × weight)</label>
                  <input type="number" step="any" value={scoring['weight'] ?? ''}
                    onChange={(e) => { const n = { ...scoring }; if (e.target.value === '') delete n['weight']; else n['weight'] = Number(e.target.value); onUpdateSetting(field, 'scoring', n) }}
                    className="w-40 text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground" placeholder="1" />
                </div>
              )}
            </div>
          )}
        </div>

        <button onClick={() => onDelete(field.id)} className="text-muted-foreground hover:text-destructive mt-1.5" aria-label="Delete field">
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
    <div className="rounded-lg border border-border p-3 space-y-3">
      <p className="text-xs font-medium text-foreground">Calculation</p>
      {sources.length === 0 && (
        <p className="text-xs text-muted-foreground">
          Add Number, Rating, Opinion Scale, Yes/No or Consent fields above to reference them here.
        </p>
      )}

      <div className="space-y-2">
        {terms.map((t, i) => (
          <div key={i} className="flex items-center gap-2">
            <select
              value={t.fieldId}
              onChange={(e) => updateTerm(i, { fieldId: e.target.value })}
              className="flex-1 text-sm border border-input rounded-md px-2 py-1.5 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
            >
              {!sources.some((s) => s.id === t.fieldId) && (
                <option value={t.fieldId}>{labelFor(t.fieldId)}</option>
              )}
              {sources.map((s) => (
                <option key={s.id} value={s.id}>{s.label || 'Untitled'}</option>
              ))}
            </select>
            <span className="text-xs text-muted-foreground">×</span>
            <input
              type="number"
              step="any"
              value={t.weight}
              onChange={(e) => updateTerm(i, { weight: e.target.value === '' ? 0 : Number(e.target.value) })}
              className="w-20 text-sm border border-input rounded-md px-2 py-1.5 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
              placeholder="1"
            />
            <button type="button" onClick={() => removeTerm(i)} className="text-destructive hover:text-destructive/80" aria-label="Remove term">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addTerm}
        disabled={sources.length === 0}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
      >
        <Plus className="w-4 h-4" /> Add field to formula
      </button>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Constant (+)</label>
          <input
            type="number"
            step="any"
            value={calc.constant ?? ''}
            onChange={(e) => write({ ...calc, constant: e.target.value === '' ? undefined : Number(e.target.value) })}
            className="w-full text-sm border border-input rounded-md px-2 py-1.5 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Prefix</label>
          <input
            type="text"
            value={calc.prefix ?? ''}
            onChange={(e) => write({ ...calc, prefix: e.target.value || undefined })}
            className="w-full text-sm border border-input rounded-md px-2 py-1.5 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
            placeholder="£"
          />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Suffix</label>
          <input
            type="text"
            value={calc.suffix ?? ''}
            onChange={(e) => write({ ...calc, suffix: e.target.value || undefined })}
            className="w-full text-sm border border-input rounded-md px-2 py-1.5 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
            placeholder=" pts"
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Value = sum(field × weight) + constant. Computed live and recomputed on submit.</p>
    </div>
  )
}

interface PaymentConfigShape {
  amount?: number
  currency?: 'gbp' | 'usd' | 'eur'
  description?: string
  label?: string
}

// Config UI for a payment field. Writes settings.payment =
// { amount, currency, description?, label? }. Amount is in major units (e.g.
// 25.00). Collection only happens once the owner connects Stripe — a banner
// links to the Payments settings page. Dormant-safe: this just persists config.
function PaymentConfig({
  field,
  onUpdateSetting,
}: {
  field: Field
  onUpdateSetting: (field: Field, key: string, value: any) => void
}) {
  const pay: PaymentConfigShape = (field.settings?.payment as PaymentConfigShape) || {}
  const write = (patch: Partial<PaymentConfigShape>) =>
    onUpdateSetting(field, 'payment', { ...pay, ...patch })

  return (
    <div className="rounded-lg border border-border p-3 space-y-3">
      <p className="text-xs font-medium text-foreground">Payment (fixed amount)</p>

      <div className="rounded-lg border border-border bg-secondary p-3 text-xs text-muted-foreground">
        Connect a Stripe account to actually collect this payment.{' '}
        <Link href="/dashboard/settings/payments" className="underline font-medium">
          Set up payments
        </Link>
        . Until connected, this is shown to respondents but they can still submit without paying.
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Amount</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={pay.amount ?? ''}
            onChange={(e) => write({ amount: e.target.value === '' ? undefined : Number(e.target.value) })}
            className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
            placeholder="25.00"
          />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Currency</label>
          <select
            value={pay.currency || 'gbp'}
            onChange={(e) => write({ currency: e.target.value as PaymentConfigShape['currency'] })}
            className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
          >
            <option value="gbp">GBP (£)</option>
            <option value="usd">USD ($)</option>
            <option value="eur">EUR (€)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs text-muted-foreground mb-1">Payment description (optional)</label>
        <input
          type="text"
          value={pay.description || ''}
          onChange={(e) => write({ description: e.target.value || undefined })}
          className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
          placeholder="e.g. Event ticket — General admission"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Respondents fill the form, then are redirected to a secure Stripe checkout on submit. The amount is enforced
        server-side.
      </p>
    </div>
  )
}
