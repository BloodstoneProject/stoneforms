'use client'

// ClassicView — the "classic" presentation mode: every block (questions AND
// content blocks) stacked on a single scrolling page, in form order, with one
// Submit at the bottom. All validation runs on submit. Fully themed. Shares the
// single source of truth (answers / validation / submit) owned by FormPlayer;
// this component is pure rendering + a validate-all-then-submit handler.

import { useMemo, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { Question } from '@/types'
import { QuestionRenderer } from '@/components/player/QuestionRenderer'
import { ContentBlock } from '@/components/player/ContentBlock'
import { isInputField, isContentBlock } from '@/lib/field-types'
import type { FormTheme } from '@/lib/themes'
import { fontStack, buttonRadius, backgroundCss } from '@/lib/themes'
import { resolveRecall } from '@/lib/recall'
import { resolveLogic, type LogicRule } from '@/lib/logic'

// Compose the page background. With a backgroundImage, layer a dim overlay
// (driven by backgroundBrightness; 1 = full) over the image; otherwise fall back
// to the theme's solid/gradient. Backward-compatible: no image => prior behaviour.
function themeBackground(theme: FormTheme): React.CSSProperties {
  if (theme.backgroundImage) {
    const b = typeof theme.backgroundBrightness === 'number' ? theme.backgroundBrightness : 1
    const dim = Math.max(0, Math.min(1, 1 - b))
    return {
      backgroundImage: `linear-gradient(rgba(0,0,0,${dim}), rgba(0,0,0,${dim})), url(${theme.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }
  }
  return { background: backgroundCss(theme) }
}

// Walk the ordered flow honouring jump logic to decide which blocks are visible
// and whether an end-jump truncates the rest. Pure + defensive: when there are
// no rules the full list is returned unchanged (today's behaviour).
function visibleByLogic(blocks: Question[], answers: Record<string, any>, logic: LogicRule[]): Question[] {
  if (!logic || logic.length === 0) return blocks
  const ids = blocks.map((b) => b.id)
  const shown = new Set<string>()
  let cursor = ids[0]
  let guard = 0
  while (cursor && cursor !== 'end' && guard < ids.length + 2) {
    guard++
    shown.add(cursor)
    const res = resolveLogic(cursor, ids, answers, logic)
    if (res.end) break
    cursor = res.next
  }
  return blocks.filter((b) => shown.has(b.id))
}

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
  // Optional jump-logic rules. When absent (today's default) every block renders
  // and no end-jump truncation happens — fully backward-compatible.
  logic?: LogicRule[]
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
  logic = [],
}: ClassicViewProps) {
  const c = theme.colors
  const ff = fontStack(theme.font)
  const bgStyle = themeBackground(theme)
  const radius = buttonRadius(theme.buttonStyle)
  const [localError, setLocalError] = useState<string | null>(null)

  // page_break has no meaning in classic mode (everything is on one page); drop
  // it and hidden fields. Everything else renders in order.
  const baseRenderable = blocks.filter((b) => b.type !== 'page_break' && b.type !== 'hidden')
  // Apply jump-logic show/hide + end-jump truncation against the live answers.
  const renderable = useMemo(
    () => visibleByLogic(baseRenderable, answers, logic),
    [baseRenderable, answers, logic]
  )

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

  // Resolve recall tokens against the answers this view already holds.
  const rctx = { answers }
  const recall = (s?: string) => (s ? resolveRecall(s, rctx) : s)

  return (
    <div className="min-h-screen" style={{ ...bgStyle, fontFamily: ff }}>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 sm:py-16">
        {/* Form header */}
        <header className="mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight" style={{ color: c.text }}>
            {recall(formTitle)}
          </h1>
          {formDescription && (
            <p className="mt-3 text-base sm:text-lg md:text-xl opacity-70" style={{ color: c.text }}>
              {recall(formDescription)}
            </p>
          )}
        </header>

        <div className="space-y-10">
          {renderable.map((b) => {
            // Pre-resolve recall in the block's own copy so QuestionRenderer /
            // ContentBlock display piped values without owning recall.
            const rb: Question = { ...b, label: recall(b.label) ?? b.label, description: recall(b.description) }
            return (
            <div key={b.id} id={`sf-block-${b.id}`}>
              {isContentBlock(b.type) ? (
                <ContentBlock block={rb} theme={theme} />
              ) : (
                <QuestionRenderer
                  question={rb}
                  value={answers[b.id]}
                  error={errors[b.id]}
                  onChange={(v) => setAnswer(b.id, v)}
                  allAnswers={answers}
                  theme={{ primaryColor: c.primary, backgroundColor: c.background, textColor: c.text }}
                />
              )}
            </div>
            )
          })}
        </div>

        {(submitError || localError) && (
          <div
            role="alert"
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
            className="sf-cta inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 px-7 py-3.5 font-semibold text-lg disabled:opacity-60 shadow-sm hover:shadow-md transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ backgroundColor: c.button, color: c.buttonText, borderRadius: radius }}
          >
            {submitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Submitting…</>
            ) : (
              <>Submit <Check className="w-5 h-5" /></>
            )}
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
