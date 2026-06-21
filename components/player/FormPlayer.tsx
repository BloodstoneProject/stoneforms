'use client'

import { useState, useEffect, useCallback } from 'react'
import { Question } from '@/types'
import { QuestionRenderer } from '@/components/player/QuestionRenderer'
import { ThankYouScreen } from '@/components/player/ThankYouScreen'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import {
  type FormTheme, DEFAULT_THEME, fontStack, googleFontHref, buttonRadius, backgroundCss,
} from '@/lib/themes'

interface FormSettings {
  showProgressBar?: boolean
  redirectUrl?: string
  customEndingMessage?: string
  welcome?: { enabled?: boolean; title?: string; description?: string; buttonText?: string }
}

interface FormPlayerProps {
  formId: string
  formTitle: string
  formDescription?: string
  questions: Question[]
  settings?: FormSettings
  theme?: FormTheme
}

export default function FormPlayer({
  formId, formTitle, formDescription, questions, settings = {}, theme = DEFAULT_THEME,
}: FormPlayerProps) {
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [complete, setComplete] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [anim, setAnim] = useState<'in' | 'out-up' | 'out-down'>('in')

  const showProgressBar = settings.showProgressBar !== false
  const welcomeEnabled = settings.welcome?.enabled !== false
  const current = questions[index]
  const isFirst = index === 0
  const isLast = index === questions.length - 1
  const progress = questions.length ? ((index + 1) / questions.length) * 100 : 0

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
  }, [started, index, current, track])

  const setAnswer = (qid: string, value: any) => {
    setAnswers((p) => ({ ...p, [qid]: value }))
    if (errors[qid]) setErrors((p) => { const n = { ...p }; delete n[qid]; return n })
  }

  const validate = (): boolean => {
    if (!current) return true
    const a = answers[current.id]
    const empty = a === undefined || a === null || a === '' || (Array.isArray(a) && a.length === 0)
    if (current.required && empty) { setErrors({ [current.id]: 'This question is required' }); return false }
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
    if (isLast) { handleSubmit(); return }
    setAnim('out-up')
    setTimeout(() => { setIndex((i) => i + 1); setAnim('in') }, 180)
  }
  const goPrev = () => {
    if (isFirst) return
    setAnim('out-down')
    setTimeout(() => { setIndex((i) => i - 1); setAnim('in') }, 180)
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

  const handleSubmit = async () => {
    setSubmitting(true); setSubmitError(null)
    try {
      const res = await fetch(`/api/forms/${formId}/submit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: answers, session_id: sessionId }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setSubmitError(data.error || 'Failed to submit. Please try again.'); return }
      if (settings.redirectUrl) {
        window.location.href = /^https?:\/\//i.test(settings.redirectUrl) ? settings.redirectUrl : `https://${settings.redirectUrl}`
        return
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
    return <ThankYouScreen formTitle={formTitle} theme={{ primaryColor: c.primary, backgroundColor: c.background, textColor: c.text }} customMessage={settings.customEndingMessage} />
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
          key={index}
          className="w-full max-w-2xl"
          style={{ animation: `${anim === 'in' ? 'sf-in' : anim === 'out-up' ? 'sf-out-up' : 'sf-out-down'} 0.22s ease` }}
        >
          <div className="flex items-center gap-2 mb-5 text-sm font-medium" style={{ color: c.primary }}>
            <span>{index + 1}</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            <span className="opacity-50">{questions.length}</span>
          </div>

          <QuestionRenderer
            question={current}
            value={answers[current.id]}
            error={errors[current.id]}
            onChange={(v) => setAnswer(current.id, v)}
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

      <div className="text-center pb-6">
        <p className="text-xs opacity-40" style={{ color: c.text }}>
          Powered by <span className="font-semibold">Stoneforms</span>
        </p>
      </div>

      <style jsx global>{`
        @keyframes sf-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sf-out-up { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-16px); } }
        @keyframes sf-out-down { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(16px); } }
      `}</style>
    </div>
  )
}
