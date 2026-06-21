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

interface FormSettings {
  showProgressBar?: boolean
  allowMultipleSubmissions?: boolean
  requireEmail?: boolean
  redirectUrl?: string
  customEndingMessage?: string
  welcome?: { enabled?: boolean; title?: string; description?: string; buttonText?: string }
  ending?: { title?: string; message?: string }
}

interface Form {
  id: string
  title: string
  description: string
  status: string
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
      if (formData.form) setForm(formData.form)

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
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </div>
  )
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
  expanded: boolean
  onToggleExpand: () => void
  onUpdate: (id: string, updates: Partial<Field>) => void
  onUpdateSetting: (field: Field, key: string, value: any) => void
  onDelete: (id: string) => void
}

function SortableField({ field, index, expanded, onToggleExpand, onUpdate, onUpdateSetting, onDelete }: SortableFieldProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }
  const meta = getFieldMeta(field.field_type)
  const settings = field.settings || {}
  const isNumeric = meta?.category === 'number'
  const isText = field.field_type === 'short_text' || field.field_type === 'long_text'

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

              {!fieldHasOptions(field.field_type) && field.field_type !== 'yes_no' && (
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
