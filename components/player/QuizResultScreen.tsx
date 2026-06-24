'use client'

import { Award, ArrowRight } from 'lucide-react'
import type { QuizOutcome } from '@/lib/quiz'
import { resolveRecall, type RecallContext } from '@/lib/recall'
import type { Ending } from '@/lib/endings'

interface QuizResultScreenProps {
  total: number
  max: number
  outcome: QuizOutcome | null
  hideBranding?: boolean
  theme: {
    primaryColor: string
    backgroundColor: string
    textColor: string
    font?: string
    buttonRadius?: string
  }
  // ---- Custom endings (Typeform parity) ----
  // A resolved Ending (lib/endings), when provided, supplies the headline /
  // message / redirect button and takes precedence over the matched outcome
  // copy. Its text (and the outcome text) may contain recall tokens, resolved
  // against `recallCtx`. When absent, the screen renders exactly as before.
  ending?: Ending | null
  recallCtx?: RecallContext
}

// Themed quiz results screen shown after a successful submit when the form is a
// quiz with showResults enabled. Displays score (total / max) and the matched
// outcome's title + message (or a custom ending when one is routed to).
export function QuizResultScreen({ total, max, outcome, hideBranding = false, theme, ending, recallCtx }: QuizResultScreenProps) {
  const pct = max > 0 ? Math.round((total / max) * 100) : 0

  // Recall context: default in the live score so {{score}} works even when the
  // player doesn't pass one explicitly.
  const ctx: RecallContext = { answers: {}, score: total, ...(recallCtx ?? {}) }
  const pipe = (text?: string) => (text ? resolveRecall(text, ctx) : text)

  // A custom ending wins over the matched outcome for the headline + message.
  const headline = pipe(ending?.title ?? outcome?.title)
  const body = pipe(ending?.message ?? outcome?.message)
  const redirectUrl = ending?.redirectUrl
  const buttonText = ending?.buttonText

  const goToRedirect = () => {
    if (!redirectUrl) return
    const href = /^https?:\/\//i.test(redirectUrl) ? redirectUrl : `https://${redirectUrl}`
    window.location.href = href
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: theme.backgroundColor, fontFamily: theme.font }}
    >
      <div className="w-full max-w-xl text-center">
        <div
          className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center animate-scale-in"
          style={{ backgroundColor: theme.primaryColor }}
        >
          <Award className="w-10 h-10 text-white" strokeWidth={2.5} />
        </div>

        <p className="text-sm font-semibold uppercase tracking-wide opacity-60 mb-2" style={{ color: theme.textColor }}>
          Your score
        </p>
        <div className="flex items-end justify-center gap-1 mb-2">
          <span className="text-6xl font-bold" style={{ color: theme.primaryColor }}>{total}</span>
          {max > 0 && (
            <span className="text-3xl font-semibold opacity-50 mb-1" style={{ color: theme.textColor }}>/ {max}</span>
          )}
        </div>
        {max > 0 && (
          <div className="mx-auto max-w-xs mb-8">
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${theme.textColor}1a` }}>
              <div className="h-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: theme.primaryColor }} />
            </div>
          </div>
        )}

        {headline ? (
          <>
            <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: theme.textColor }}>
              {headline}
            </h1>
            {body && (
              <p className="text-lg md:text-xl opacity-70" style={{ color: theme.textColor }}>
                {body}
              </p>
            )}
          </>
        ) : (
          <p className="text-lg md:text-xl opacity-70" style={{ color: theme.textColor }}>
            Thanks for completing the quiz!
          </p>
        )}

        {redirectUrl && (
          <div className="mt-8">
            <button
              onClick={goToRedirect}
              className="inline-flex items-center gap-2 px-7 py-3 font-semibold text-white transition-transform hover:scale-[1.03]"
              style={{ backgroundColor: theme.primaryColor, borderRadius: theme.buttonRadius ?? '0.5rem' }}
            >
              {buttonText || 'Continue'} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {!hideBranding && (
          <p className="text-xs mt-12 opacity-40" style={{ color: theme.textColor }}>
            Powered by <span className="font-semibold">Stoneforms</span>
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes scale-in { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scale-in { animation: scale-in 0.45s ease-out; }
      `}</style>
    </div>
  )
}
