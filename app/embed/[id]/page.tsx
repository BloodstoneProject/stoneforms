'use client'
// Chrome-less, frame-safe wrapper around the existing public form.
// Mirrors app/f/[id]/page.tsx data loading (read-only) but drops any page
// chrome so it sits cleanly inside an embed iframe. Posts its document height
// to the parent window (postMessage) so embed.js can auto-resize the iframe.
import { useParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
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
  settings?: Record<string, any>
}

export default function EmbedFormPage() {
  const { id: formId } = (useParams() as any)

  const [form, setForm] = useState<PublicForm | null>(null)
  const [fields, setFields] = useState<DbField[]>([])
  const [hideBranding, setHideBranding] = useState(false)
  const [availability, setAvailability] = useState<{ open: boolean; reason?: string; message?: string }>({ open: true })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

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
          setHideBranding(!!data.branding?.hide)
          if (data.availability) setAvailability(data.availability)
        }
      })
      .catch(() => active && setError('Failed to load form.'))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [formId])

  // Auto-resize support: report our document height to the parent frame.
  // Defensive — only posts when actually framed. embed.js listens for the
  // `stoneforms:resize` message and resizes the matching iframe.
  useEffect(() => {
    if (typeof window === 'undefined' || window.parent === window) return

    let lastHeight = 0
    const post = () => {
      const h = Math.max(
        document.documentElement.scrollHeight,
        rootRef.current?.scrollHeight || 0
      )
      if (h && h !== lastHeight) {
        lastHeight = h
        try {
          window.parent.postMessage(
            { type: 'stoneforms:resize', formId, height: h },
            '*'
          )
        } catch {
          /* cross-origin parent without listener — ignore */
        }
      }
    }

    post()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(post) : null
    if (ro && rootRef.current) ro.observe(rootRef.current)
    if (ro) ro.observe(document.documentElement)
    window.addEventListener('load', post)
    const interval = window.setInterval(post, 1000)

    return () => {
      ro?.disconnect()
      window.removeEventListener('load', post)
      window.clearInterval(interval)
    }
  }, [formId, loading, form])

  if (loading) {
    return (
      <div ref={rootRef} className="min-h-[200px] flex items-center justify-center bg-neutral-50">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    )
  }

  if (error || !form) {
    return (
      <div ref={rootRef} className="min-h-[200px] flex items-center justify-center bg-neutral-50 p-6">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900 mb-2">Form unavailable</h1>
          <p className="text-neutral-600">{error || 'This form may have been unpublished or removed.'}</p>
        </div>
      </div>
    )
  }

  const questions = dbFieldsToQuestions(fields)
  const theme = normalizeTheme(form.theme)

  return (
    <div ref={rootRef}>
      <FormPlayer
        formId={form.id}
        formTitle={form.title}
        formDescription={form.description}
        questions={questions}
        settings={form.settings || {}}
        theme={theme}
        logic={form.logic || []}
        hideBranding={hideBranding}
        availability={availability as any}
      />
    </div>
  )
}
