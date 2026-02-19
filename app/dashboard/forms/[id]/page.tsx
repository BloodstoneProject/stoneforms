'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, GripVertical, Save, Eye, Settings } from 'lucide-react'

interface Form {
  id: string
  title: string
  description: string
  status: string
}

interface Field {
  id: string
  field_type: string
  label: string
  placeholder: string
  required: boolean
  options: string[] | null
  position: number
}

export default function FormBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: formId } = use(params)
  const router = useRouter()
  
  const [form, setForm] = useState<Form | null>(null)
  const [fields, setFields] = useState<Field[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const fieldTypes = [
    { value: 'short_text', label: 'Short Text', icon: '📝' },
    { value: 'long_text', label: 'Long Text', icon: '📄' },
    { value: 'email', label: 'Email', icon: '✉️' },
    { value: 'number', label: 'Number', icon: '🔢' },
    { value: 'phone', label: 'Phone', icon: '📞' },
    { value: 'url', label: 'URL', icon: '🔗' },
    { value: 'multiple_choice', label: 'Multiple Choice', icon: '☑️' },
    { value: 'checkboxes', label: 'Checkboxes', icon: '✅' },
    { value: 'dropdown', label: 'Dropdown', icon: '▼' },
    { value: 'date', label: 'Date', icon: '📅' },
    { value: 'rating', label: 'Rating', icon: '⭐' },
    { value: 'yes_no', label: 'Yes/No', icon: '✓' },
  ]

  useEffect(() => {
    fetchFormAndFields()
  }, [formId])

  const fetchFormAndFields = async () => {
    try {
      const formRes = await fetch(`/api/forms/${formId}`)
      if (!formRes.ok) {
        const error = await formRes.json()
        alert(`Error loading form: ${error.error}`)
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
      alert('Failed to load form')
    } finally {
      setLoading(false)
    }
  }

  const saveForm = async () => {
    if (!form) return
    setSaving(true)

    try {
      const res = await fetch(`/api/forms/${formId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description
        })
      })

      if (!res.ok) {
        const error = await res.json()
        alert(`Error saving: ${error.error}`)
      } else {
        alert('Form saved successfully!')
      }
    } catch (error) {
      console.error('Failed to save:', error)
      alert('Failed to save form')
    } finally {
      setSaving(false)
    }
  }

  const addField = async (fieldType: string) => {
    try {
      const res = await fetch(`/api/forms/${formId}/fields`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field_type: fieldType,
          label: 'New Question',
          required: false
        })
      })

      if (!res.ok) {
        const error = await res.json()
        alert(`Error adding field: ${error.error}`)
        return
      }

      const data = await res.json()
      if (data.field) {
        setFields([...fields, data.field])
      }
    } catch (error) {
      console.error('Failed to add field:', error)
      alert('Failed to add field')
    }
  }

  const updateField = async (fieldId: string, updates: Partial<Field>) => {
    try {
      const res = await fetch(`/api/forms/${formId}/fields/${fieldId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!res.ok) {
        const error = await res.json()
        alert(`Error updating field: ${error.error}`)
        return
      }

      const data = await res.json()
      if (data.field) {
        setFields(fields.map(f => f.id === fieldId ? data.field : f))
      }
    } catch (error) {
      console.error('Failed to update field:', error)
    }
  }

  const deleteField = async (fieldId: string) => {
    if (!confirm('Delete this field?')) return

    try {
      const res = await fetch(`/api/forms/${formId}/fields/${fieldId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const error = await res.json()
        alert(`Error deleting: ${error.error}`)
        return
      }

      setFields(fields.filter(f => f.id !== fieldId))
    } catch (error) {
      console.error('Failed to delete field:', error)
    }
  }

  const publishForm = async () => {
    if (!form) return
    setPublishing(true)
    
    try {
      const res = await fetch(`/api/forms/${formId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' })
      })

      if (!res.ok) {
        const error = await res.json()
        alert(`Error publishing: ${error.error}`)
      } else {
        setForm({ ...form, status: 'published' })
        alert('Form published! Share this link: ' + window.location.origin + '/f/' + formId)
      }
    } catch (error) {
      console.error('Failed to publish:', error)
      alert('Failed to publish form')
    } finally {
      setPublishing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto"></div>
          <p className="mt-4 text-stone-600">Loading form...</p>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">Form Not Found</h1>
          <Link href="/dashboard/forms" className="text-stone-600 hover:text-stone-900">
            ← Back to Forms
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/forms" className="text-stone-600 hover:text-stone-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="text-xl font-bold text-stone-900 border-none focus:outline-none bg-transparent"
                  placeholder="Form Title"
                />
                <p className="text-sm text-stone-600">{form.status} · {fields.length} fields</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/f/${formId}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Link>
              <button
                onClick={saveForm}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
              {form.status === 'draft' && (
                <button
                  onClick={publishForm}
                  disabled={publishing}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {publishing ? 'Publishing...' : 'Publish'}
                </button>
              )}
              {form.status === 'published' && (
                <Link
                  href={`/dashboard/forms/${formId}/responses`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View Responses
                </Link>
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
                {fieldTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => addField(type.value)}
                    className="w-full flex items-center gap-3 px-4 py-3 border border-stone-200 rounded-lg hover:bg-stone-50 text-left transition-colors"
                  >
                    <span className="text-2xl">{type.icon}</span>
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
                className="text-2xl font-bold text-stone-900 w-full border-none focus:outline-none mb-4"
                placeholder="Form Title"
              />
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full text-stone-600 border-none focus:outline-none resize-none"
                placeholder="Add a description..."
                rows={2}
              />
            </div>

            {/* Fields */}
            {fields.length === 0 ? (
              <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
                <Plus className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-stone-900 mb-2">No fields yet</h3>
                <p className="text-stone-600">Click a field type on the left to add your first question</p>
              </div>
            ) : (
              fields.map((field, index) => (
                <div key={field.id} className="bg-white rounded-lg border border-stone-200 p-6">
                  <div className="flex items-start gap-4">
                    <GripVertical className="w-5 h-5 text-stone-400 mt-2 cursor-move" />
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                          className="flex-1 text-lg font-medium text-stone-900 border-b border-stone-200 focus:outline-none focus:border-stone-900 pb-2"
                          placeholder="Question"
                        />
                        <span className="px-3 py-1 bg-stone-100 text-stone-700 text-xs rounded-full">
                          {fieldTypes.find(t => t.value === field.field_type)?.label}
                        </span>
                      </div>

                      <input
                        type="text"
                        value={field.placeholder || ''}
                        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                        className="w-full text-sm text-stone-600 border border-stone-200 rounded px-3 py-2 mb-4 focus:outline-none focus:border-stone-900"
                        placeholder="Placeholder text..."
                      />

                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateField(field.id, { required: e.target.checked })}
                            className="rounded"
                          />
                          <span className="text-sm text-stone-600">Required</span>
                        </label>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteField(field.id)}
                      className="text-red-600 hover:text-red-700 mt-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Share Link */}
            {form.status === 'published' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-green-900 mb-2">✅ Form Published!</h3>
                <p className="text-sm text-green-700 mb-4">Share this link with others:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/f/${formId}`}
                    readOnly
                    className="flex-1 px-4 py-2 bg-white border border-green-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/f/${formId}`)
                      alert('Link copied!')
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
