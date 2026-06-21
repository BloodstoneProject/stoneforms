'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Question } from '@/types'
import { QuestionRenderer } from '@/components/player/QuestionRenderer'
import { ThankYouScreen } from '@/components/player/ThankYouScreen'
import { QuizResultScreen } from '@/components/player/QuizResultScreen'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import {
  type FormTheme, DEFAULT_THEME, fontStack, googleFontHref, buttonRadius, backgroundCss,
} from '@/lib/themes'
import { nextQuestionId, progressFor, type LogicRule } from '@/lib/logic'
import type { QuizConfig, QuizOutcome } from '@/lib/quiz'
import { computeCalc } from '@/lib/calc'
import type { FormAvailability } from '@/lib/form-controls'

interface FormSettings {
  showProgressBar?: boolean
  redirectUrl?: string
  customEndingMessage?: string
  welcome?: { enabled?: boolean; title?: string; description?: string; buttonText?: string }
  ending?: { title?: string; message?: string }
  quiz?: QuizConfig
}

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, opts: { action: string }) => Promise<string>
    }
  }
}

interface QuizResultData {
  total: number
  max: number
  outcome: QuizOutcome | null
}

interface FormPlayerProps {
  formId: string
  formTitle: string
  formDescription?: string
  questions: Question[]
  settings?: FormSettings
  theme?: FormTheme
  logic?: LogicRule[]
  hideBranding?: boolean
  // Server-computed open/closed state (schedule + response cap). When closed,
  // the player renders a themed "closed" screen instead of the form.
  availability?: FormAvailability
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

export default function FormPlayer({
  formId, formTitle, formDescription, questions, settings = {}, theme = DEFAULT_THEME, logic = [], hideBranding = false,
  availability,
}: FormPlayerProps) {
  // Capture URL query params once (for lead tracking + hidden-field prefill).
  const [urlParams] = useState<Record<string, string>>(() =>
    typeof window !== 'undefined' ? Object.fromEntries(new URLSearchParams(window.location.search)) : {}
  )
  // Hidden fields are prefilled from URL params and never shown in the flow.
  const flowQuestions = questions.filter((q) => q.type !== 'hidden')
  const orderedIds = flowQuestions.map((q) => q.id)
  const draftKey = `stoneforms:draft:${formId}`
  // Field ids whose values we never persist to localStorage (sensitive / large).
  const nonPersistedIds = questions
    .filter((q) => q.type === 'signature' || q.type === 'file_upload')
    .map((q) => q.id)

  // Read any saved draft for this form (SSR-guarded). Returns null if none/invalid.
  const readDraft = (): { answers?: Record<string, any>; currentId?: string } | null => {
    if (typeof window === 'undefined') return null
    try {
      const raw = window.localStorage.getItem(draftKey)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      return parsed && typeof parsed === 'object' ? parsed : null
    } catch { return null }
  }
  const [draft] = useState(() => readDraft())

  const [started, setStarted] = useState(false)
  const [currentId, setCurrentId] = useState<string>(() => {
    const saved = draft?.currentId
    return saved && orderedIds.includes(saved) ? saved : (orderedIds[0] || '')
  })
  const [history, setHistory] = useState<string[]>([])
  const [draftRestored, setDraftRestored] = useState(false)
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {}
    const search = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
    questions.filter((q) => q.type === 'hidden').forEach((q) => {
      const ref = (q.properties?.ref || q.label || '').toString()
      const val = search.get(ref)
      if (ref && val !== null) init[q.id] = val
    })
    // Layer any restored draft answers on top of the hidden-field seeds.
    if (draft?.answers && typeof draft.answers === 'object') {
      for (const [k, v] of Object.entries(draft.answers)) init[k] = v
    }
    return init
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [complete, setComplete] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResultData | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [anim, setAnim] = useState<'in' | 'out-up' | 'out-down'>('in')

  const showProgressBar = settings.showProgressBar !== false
  const welcomeEnabled = settings.welcome?.enabled !== false
  const current = questions.find((q) => q.id === currentId)
  const index = orderedIds.indexOf(currentId)
  const isFirst = history.length === 0
  // Last when the logic engine would end the form after this question.
  const isLast = nextQuestionId(currentId, orderedIds, answers, logic) === 'end'
  const progress = progressFor(currentId, orderedIds)

  const [sessionId] = useState(() =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `s_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
  )

  // Load the theme's Google Font once.
  useEffect(() => {
    const href = googleFontHref(theme.font)
    if (document.querySelector(`link[href="${href}"]`)) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
  }, [theme.font])

  const track = useCallback((eventType: 'view' | 'start' | 'step' | 'submit', extra: Record<string, any> = {}) => {
    try {
      const payload = JSON.stringify({ event_type: eventType, session_id: sessionId, ...extra })
      const url = `/api/public/forms/${formId}/events`
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }))
      } else {
        fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(() => {})
      }
    } catch { /* never break the form */ }
  }, [formId, sessionId])

  useEffect(() => { track('view') }, [track])
  useEffect(() => {
    if (started && current) track('step', { question_id: current.id, position: index })
  }, [started, currentId, current, index, track])

  // If a draft was restored, skip the welcome screen and show a brief note.
  useEffect(() => {
    if (draft && (draft.answers || draft.currentId)) {
      setStarted(true)
      setDraftRestored(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load Google reCAPTCHA v3 once, only when a site key is configured (dormant otherwise).
  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY || typeof window === 'undefined') return
    const src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
    if (document.querySelector(`script[src="${src}"]`)) return
    const s = document.createElement('script')
    s.src = src
    s.async = true
    document.head.appendChild(s)
  }, [])

  // Calculator fields are computed, read-only — recompute and persist their value
  // whenever the answers they depend on change, so they're stored on submit.
  const calcFields = questions.filter((q) => q.type === 'calculator')
  useEffect(() => {
    if (calcFields.length === 0) return
    setAnswers((prev) => {
      let changed = false
      const next = { ...prev }
      for (const f of calcFields) {
        const v = computeCalc({ properties: f.properties, settings: f.properties }, prev)
        if (next[f.id] !== v) { next[f.id] = v; changed = true }
      }
      return changed ? next : prev
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(answers), questions])

  // ---- Partial save & resume: debounce-persist progress to localStorage ----
  const draftTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (typeof window === 'undefined' || complete) return
    if (draftTimer.current) clearTimeout(draftTimer.current)
    draftTimer.current = setTimeout(() => {
      try {
        // Exclude sensitive / large fields (signatures, uploads) from the draft.
        const persistable: Record<string, any> = {}
        for (const [k, v] of Object.entries(answers)) {
          if (!nonPersistedIds.includes(k)) persistable[k] = v
        }
        window.localStorage.setItem(draftKey, JSON.stringify({ answers: persistable, currentId }))
      } catch { /* storage full / disabled — ignore */ }
    }, 500)
    return () => { if (draftTimer.current) clearTimeout(draftTimer.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(answers), currentId, complete])

  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined') return
    try { window.localStorage.removeItem(draftKey) } catch { /* ignore */ }
  }, [draftKey])

  const setAnswer = (qid: string, value: any) => {
    setAnswers((p) => ({ ...p, [qid]: value }))
    if (errors[qid]) setErrors((p) => { const n = { ...p }; delete n[qid]; return n })
  }

  const validate = (): boolean => {
    if (!current) return true
    if (current.type === 'statement') return true // informational, no answer
    if (current.type === 'calculator') return true // computed display, never blocks
    const a = answers[current.id]
    // Consent: required means the box must be ticked (answer exactly true).
    if (current.type === 'consent') {
      if (current.required && a !== true) {
        setErrors({ [current.id]: 'Please tick this box to continue' }); return false
      }
      return true
    }
    let empty = a === undefined || a === null || a === '' || (Array.isArray(a) && a.length === 0)
    // Address is empty unless line1, city and postal are all present.
    if (current.type === 'address') {
      const addr = (a && typeof a === 'object') ? a : {}
      empty = !(addr.line1?.trim() && addr.city?.trim() && addr.postal?.trim())
    }
    // Signature is empty when the data-URL string is blank.
    if (current.type === 'signature') {
      empty = typeof a !== 'string' || a.trim() === ''
    }
    if (current.required && empty) { setErrors({ [current.id]: 'This question is required' }); return false }
    if (current.type === 'address' && !empty) {
      const addr = (a && typeof a === 'object') ? a : {}
      if (!(addr.line1?.trim() && addr.city?.trim() && addr.postal?.trim())) {
        setErrors({ [current.id]: 'Please fill in address line 1, city and postal code' }); return false
      }
    }
    if (current.type === 'email' && a && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a)) {
      setErrors({ [current.id]: 'Please enter a valid email address' }); return false
    }
    if (current.type === 'url' && a) {
      try { new URL(/^https?:\/\//i.test(a) ? a : `https://${a}`) } catch { setErrors({ [current.id]: 'Please enter a valid URL' }); return false }
    }
    if (current.type === 'number' && a !== undefined && a !== '') {
      const n = Number(a), v = current.validation || {}
      if (v.min !== undefined && n < v.min) { setErrors({ [current.id]: `Minimum value is ${v.min}` }); return false }
      if (v.max !== undefined && n > v.max) { setErrors({ [current.id]: `Maximum value is ${v.max}` }); return false }
    }
    if ((current.type === 'short_text' || current.type === 'long_text') && typeof a === 'string') {
      const max = current.validation?.maxLength
      if (max && a.length > max) { setErrors({ [current.id]: `Maximum length is ${max} characters` }); return false }
    }
    return true
  }

  const goNext = () => {
    if (!validate()) return
    const next = nextQuestionId(currentId, orderedIds, answers, logic)
    if (next === 'end') { handleSubmit(); return }
    setAnim('out-up')
    setTimeout(() => {
      setHistory((h) => [...h, currentId])
      setCurrentId(next)
      setAnim('in')
    }, 180)
  }
  const goPrev = () => {
    if (history.length === 0) return
    setAnim('out-down')
    setTimeout(() => {
      setHistory((h) => {
        const prev = h[h.length - 1]
        setCurrentId(prev)
        return h.slice(0, -1)
      })
      setAnim('in')
    }, 180)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (e.shiftKey) { e.preventDefault(); started ? goPrev() : undefined }
        else { e.preventDefault(); started ? goNext() : setStarted(true) }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, index, answers])

  // Fetch a reCAPTCHA v3 token if a site key is configured and the script loaded.
  // Returns undefined when dormant / unavailable so the submit still proceeds.
  const getRecaptchaToken = async (): Promise<string | undefined> => {
    if (!RECAPTCHA_SITE_KEY || typeof window === 'undefined' || !window.grecaptcha) return undefined
    try {
      return await new Promise<string | undefined>((resolve) => {
        window.grecaptcha!.ready(() => {
          window.grecaptcha!.execute(RECAPTCHA_SITE_KEY!, { action: 'submit' })
            .then((token) => resolve(token))
            .catch(() => resolve(undefined))
        })
      })
    } catch { return undefined }
  }

  const handleSubmit = async () => {
    setSubmitting(true); setSubmitError(null)
    try {
      const recaptchaToken = await getRecaptchaToken()
      const res = await fetch(`/api/forms/${formId}/submit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responses: answers,
          session_id: sessionId,
          metadata: Object.keys(urlParams).length ? { url_params: urlParams } : {},
          ...(recaptchaToken ? { recaptchaToken } : {}),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setSubmitError(data.error || 'Failed to submit. Please try again.'); return }
      // Successful submit — drop any saved progress.
      clearDraft()
      // Redirect takes precedence over any ending / results screen.
      if (settings.redirectUrl) {
        window.location.href = /^https?:\/\//i.test(settings.redirectUrl) ? settings.redirectUrl : `https://${settings.redirectUrl}`
        return
      }
      // Trust the server's authoritative score for the results screen.
      if (settings.quiz?.enabled && settings.quiz?.showResults && data.quiz) {
        setQuizResult({ total: data.quiz.total, max: data.quiz.max, outcome: data.quiz.outcome ?? null })
      }
      setComplete(true)
    } catch {
      setSubmitError('Something went wrong. Check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const radius = buttonRadius(theme.buttonStyle)
  const bg = backgroundCss(theme)
  const ff = fontStack(theme.font)
  const c = theme.colors

  const primaryBtn = (label: React.ReactNode, onClick: () => void, disabled = false) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-lg transition-transform active:scale-95 disabled:opacity-60 shadow-sm hover:shadow-md"
      style={{ backgroundColor: c.button, color: c.buttonText, borderRadius: radius }}
    >
      {label}
    </button>
  )

  if (complete) {
    if (quizResult) {
      return (
        <QuizResultScreen
          total={quizResult.total}
          max={quizResult.max}
          outcome={quizResult.outcome}
          hideBranding={hideBranding}
          theme={{ primaryColor: c.primary, backgroundColor: bg, textColor: c.text, font: ff, buttonRadius: radius }}
        />
      )
    }
    return (
      <ThankYouScreen
        title={settings.ending?.title}
        message={settings.ending?.message || settings.customEndingMessage}
        hideBranding={hideBranding}
        theme={{ primaryColor: c.primary, backgroundColor: c.background, textColor: c.text, font: ff, buttonRadius: radius }}
      />
    )
  }

  // Closed screen — schedule window not open, or response cap reached.
  // A respondent who already completed (above) still sees their thank-you screen.
  if (availability && availability.open === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: bg, fontFamily: ff }}>
        <div className="w-full max-w-xl text-center">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl"
            style={{ backgroundColor: `${c.primary}1a` }}
          >
            🔒
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: c.text }}>
            {availability.reason === 'not_open' ? 'Not open yet' : 'Form closed'}
          </h1>
          <p className="text-lg opacity-70" style={{ color: c.text }}>
            {availability.message || 'This form is not currently accepting responses.'}
          </p>
          {!hideBranding && (
            <p className="text-xs mt-10 opacity-40" style={{ color: c.text }}>
              Powered by <span className="font-semibold">Stoneforms</span>
            </p>
          )}
        </div>
      </div>
    )
  }

  // Welcome screen
  if (!started && welcomeEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: bg, fontFamily: ff }}>
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ color: c.text }}>
            {settings.welcome?.title || formTitle}
          </h1>
          {(settings.welcome?.description || formDescription) && (
            <p className="text-lg md:text-xl mb-10 opacity-70" style={{ color: c.text }}>
              {settings.welcome?.description || formDescription}
            </p>
          )}
          {primaryBtn(<>{settings.welcome?.buttonText || 'Start'} <ArrowRight className="w-5 h-5" /></>, () => setStarted(true))}
          <p className="text-xs mt-6 opacity-50" style={{ color: c.text }}>press <strong>Enter</strong> ↵</p>
        </div>
      </div>
    )
  }

  if (!current) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: bg, fontFamily: ff }}>
        <p style={{ color: c.text, opacity: 0.7 }}>This form has no questions yet.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: bg, fontFamily: ff }}>
      {showProgressBar && (
        <div className="fixed top-0 left-0 right-0 h-1.5 z-50" style={{ backgroundColor: `${c.text}14` }}>
          <div className="h-full transition-all duration-300" style={{ width: `${progress}%`, backgroundColor: c.primary }} />
        </div>
      )}

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div
          key={currentId}
          className="w-full max-w-2xl"
          style={{ animation: `${anim === 'in' ? 'sf-in' : anim === 'out-up' ? 'sf-out-up' : 'sf-out-down'} 0.22s ease` }}
        >
          <div className="flex items-center gap-2 mb-5 text-sm font-medium" style={{ color: c.primary }}>
            <span>{index + 1}</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            <span className="opacity-50">{questions.length}</span>
          </div>

          {draftRestored && (
            <div
              className="flex items-center justify-between gap-3 mb-5 px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: `${c.primary}12`, color: c.text }}
            >
              <span className="opacity-80">We restored your progress on this form.</span>
              <button
                onClick={() => {
                  clearDraft()
                  setDraftRestored(false)
                  setHistory([])
                  setErrors({})
                  setCurrentId(orderedIds[0] || '')
                  // Keep hidden/URL-captured fields, drop respondent-entered answers.
                  setAnswers((prev) => {
                    const kept: Record<string, any> = {}
                    questions.filter((q) => q.type === 'hidden').forEach((q) => {
                      if (prev[q.id] !== undefined) kept[q.id] = prev[q.id]
                    })
                    return kept
                  })
                }}
                className="text-xs font-medium underline opacity-70 hover:opacity-100"
              >
                Start over
              </button>
            </div>
          )}

          <QuestionRenderer
            question={current}
            value={answers[current.id]}
            error={errors[current.id]}
            onChange={(v) => setAnswer(current.id, v)}
            allAnswers={answers}
            theme={{ primaryColor: c.primary, backgroundColor: c.background, textColor: c.text }}
          />

          {submitError && (
            <div className="mt-5 p-3 rounded-lg text-sm" style={{ backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}>
              {submitError}
            </div>
          )}

          <div className="flex items-center gap-4 mt-9">
            {primaryBtn(
              submitting ? 'Submitting…' : isLast ? <>Submit <Check className="w-5 h-5" /></> : <>OK <ArrowRight className="w-5 h-5" /></>,
              goNext, submitting
            )}
            {!isFirst && (
              <button onClick={goPrev} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm opacity-60 hover:opacity-100 transition-opacity" style={{ color: c.text }}>
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            <span className="text-xs opacity-40 ml-auto hidden sm:block" style={{ color: c.text }}>
              press <strong>Enter</strong> ↵
            </span>
          </div>
        </div>
      </div>

      {!hideBranding && (
        <div className="text-center pb-6">
          <p className="text-xs opacity-40" style={{ color: c.text }}>
            Powered by <span className="font-semibold">Stoneforms</span>
          </p>
        </div>
      )}

      <style jsx global>{`
        @keyframes sf-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sf-out-up { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-16px); } }
        @keyframes sf-out-down { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(16px); } }
      `}</style>
    </div>
  )
}
