'use client'
import { useParams } from 'next/navigation'

import { use, useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import FormPlayer from '@/components/player/FormPlayer'
import { dbFieldsToQuestions, type DbField } from '@/lib/form-mapping'
import { normalizeTheme } from '@/lib/themes'

interface PublicForm {
  id: string
  title: string
  description?: string
  theme?: any
  logic?: any[]
  settings?: {
    showProgressBar?: boolean
    redirectUrl?: string
    customEndingMessage?: string
  }
}

export default function PublicFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: formId } = (useParams() as any)

  const [form, setForm] = useState<PublicForm | null>(null)
  const [fields, setFields] = useState<DbField[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    fetch(`/api/public/forms/${formId}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (!active) return
        if (!res.ok) {
          setError(data.error || 'This form is not available.')
        } else {
          setForm(data.form)
          setFields(data.fields || [])
        }
      })
      .catch(() => active && setError('Failed to load form.'))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [formId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f2ed]">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    )
  }

  if (error || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f2ed] p-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-stone-900 mb-2">Form unavailable</h1>
          <p className="text-stone-600">{error || 'This form may have been unpublished or removed.'}</p>
        </div>
      </div>
    )
  }

  const questions = dbFieldsToQuestions(fields)
  const theme = normalizeTheme(form.theme)

  return (
    <FormPlayer
      formId={form.id}
      formTitle={form.title}
      formDescription={form.description}
      questions={questions}
      settings={form.settings || {}}
      theme={theme}
      logic={form.logic || []}
    />
  )
}
