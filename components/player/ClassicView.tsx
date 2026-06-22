'use client'

// ClassicView — the "classic" presentation mode: every block (questions AND
// content blocks) stacked on a single scrolling page, in form order, with one
// Submit at the bottom. All validation runs on submit. Fully themed. Shares the
// single source of truth (answers / validation / submit) owned by FormPlayer;
// this component is pure rendering + a validate-all-then-submit handler.

import { useState } from 'react'
import { Check } from 'lucide-react'
import { Question } from '@/types'
import { QuestionRenderer } from '@/components/player/QuestionRenderer'
import { ContentBlock } from '@/components/player/ContentBlock'
import { isInputField, isContentBlock } from '@/lib/field-types'
import type { FormTheme } from '@/lib/themes'
import { fontStack, buttonRadius, backgroundCss } from '@/lib/themes'

export interface ClassicViewProps {
  formTitle: string
  formDescription?: string
  // Blocks in render order (hidden already filtered out by the parent).
  blocks: Question[]
  answers: Record<string, any>
  errors: Record<string, string>
  setAnswer: (qid: string, value: any) => void
  // Validate one question; null when acceptable. Reused from FormPlayer.
  validateQuestion: (q: Question) => string | null
  setErrors: (e: Record<string, string>) => void
  onSubmit: () => void
  submitting: boolean
  submitError: string | null
  theme: FormTheme
  hideBranding: boolean
  showProgressBar: boolean
}

export function ClassicView({
  formTitle,
  formDescription,
  blocks,
  answers,
  errors,
  setAnswer,
  validateQuestion,
  setErrors,
  onSubmit,
  submitting,
  submitError,
  theme,
  hideBranding,
}: ClassicViewProps) {
  const c = theme.colors
  const ff = fontStack(theme.font)
  const bg = backgroundCss(theme)
  const radius = buttonRadius(theme.buttonStyle)
  const [localError, setLocalError] = useState<string | null>(null)

  // page_break has no meaning in classic mode (everything is on one page); drop
  // it and hidden fields. Everything else renders in order.
  const renderable = blocks.filter((b) => b.type !== 'page_break' && b.type !== 'hidden')

  const handleSubmit = () => {
    // Validate EVERY input question; collect all errors at once.
    const all: Record<string, string> = {}
    for (const q of renderable) {
      if (!isInputField(q.type)) continue
      const msg = validateQuestion(q)
      if (msg) all[q.id] = msg
    }
    if (Object.keys(all).length > 0) {
      setErrors(all)
      setLocalError('Please fix the highlighted questions before submitting.')
      // Scroll to the first error.
      const firstId = renderable.find((q) => all[q.id])?.id
      if (firstId && typeof document !== 'undefined') {
        document.getElementById(`sf-block-${firstId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }
    setLocalError(null)
    setErrors({})
    onSubmit()
  }

  return (
    <div className="min-h-screen" style={{ background: bg, fontFamily: ff }}>
      <div className="mx-auto max-w-2xl px-6 py-16">
        {/* Form header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" style={{ color: c.text }}>
            {formTitle}
          </h1>
          {formDescription && (
            <p className="mt-3 text-lg md:text-xl opacity-70" style={{ color: c.text }}>
              {formDescription}
            </p>
          )}
        </header>

        <div className="space-y-10">
          {renderable.map((b) => (
            <div key={b.id} id={`sf-block-${b.id}`}>
              {isContentBlock(b.type) ? (
                <ContentBlock block={b} theme={theme} />
              ) : (
                <QuestionRenderer
                  question={b}
                  value={answers[b.id]}
                  error={errors[b.id]}
                  onChange={(v) => setAnswer(b.id, v)}
                  allAnswers={answers}
                  theme={{ primaryColor: c.primary, backgroundColor: c.background, textColor: c.text }}
                />
              )}
            </div>
          ))}
        </div>

        {(submitError || localError) && (
          <div
            className="mt-8 p-3 rounded-lg text-sm"
            style={{ backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}
          >
            {submitError || localError}
          </div>
        )}

        <div className="mt-10">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="sf-cta inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-lg disabled:opacity-60 shadow-sm hover:shadow-md transition-transform active:scale-95"
            style={{ backgroundColor: c.button, color: c.buttonText, borderRadius: radius }}
          >
            {submitting ? 'Submitting…' : <>Submit <Check className="w-5 h-5" /></>}
          </button>
        </div>

        {!hideBranding && (
          <p className="text-center text-xs mt-16 opacity-40" style={{ color: c.text }}>
            Powered by <span className="font-semibold">Stoneforms</span>
          </p>
        )}
      </div>
    </div>
  )
}

export default ClassicView
