'use client'

// MagazineView — the showcase "magazine" presentation: blocks are paginated into
// pages, shown as book SPREADS (2 pages on desktop, 1 on mobile) with a CSS 3D
// page-turn animation. Prev/next buttons + swipe + keyboard. Questions stay fully
// interactive on the page; content blocks render inline. The final spread submits
// via the SAME handleSubmit owned by FormPlayer. Reduced motion -> simple fade.
//
// SINGLE SOURCE OF TRUTH: this component owns NONE of the form state. It receives
// answers/errors/setAnswer/validateQuestion/onSubmit from FormPlayer, so answers
// persist across spreads, quiz/redirect/payment all run through the parent.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Question } from '@/types'
import { QuestionRenderer } from '@/components/player/QuestionRenderer'
import { ContentBlock } from '@/components/player/ContentBlock'
import { isInputField, isContentBlock } from '@/lib/field-types'
import type { FormTheme } from '@/lib/themes'
import { fontStack, buttonRadius, backgroundCss } from '@/lib/themes'

export interface MagazineViewProps {
  formTitle: string
  formDescription?: string
  blocks: Question[]
  answers: Record<string, any>
  errors: Record<string, string>
  setAnswer: (qid: string, value: any) => void
  validateQuestion: (q: Question) => string | null
  setErrors: (e: Record<string, string>) => void
  onSubmit: () => void
  submitting: boolean
  submitError: string | null
  theme: FormTheme
  hideBranding: boolean
  reduceMotion: boolean
}

// Max blocks per auto-chunked page (when no section/page_break boundary).
const MAX_PER_PAGE = 4

// Build the list of pages. A page is an ordered array of blocks.
// Boundaries: a `section` block STARTS a new page (and is the page's header).
// A `page_break` ends the current page (and is itself dropped). Otherwise chunk
// to MAX_PER_PAGE so a page never overflows the spread.
function paginate(blocks: Question[]): Question[][] {
  const visible = blocks.filter((b) => b.type !== 'hidden')
  const pages: Question[][] = []
  let cur: Question[] = []
  const push = () => {
    if (cur.length) pages.push(cur)
    cur = []
  }
  for (const b of visible) {
    if (b.type === 'page_break') {
      push()
      continue
    }
    if (b.type === 'section') {
      push()
      cur = [b]
      continue
    }
    if (cur.length >= MAX_PER_PAGE) push()
    cur.push(b)
  }
  push()
  return pages.length ? pages : [[]]
}

export function MagazineView(props: MagazineViewProps) {
  const {
    formTitle, formDescription, blocks, answers, errors, setAnswer,
    validateQuestion, setErrors, onSubmit, submitting, submitError, theme,
    hideBranding, reduceMotion,
  } = props

  const c = theme.colors
  const ff = fontStack(theme.font)
  const bg = backgroundCss(theme)
  const radius = buttonRadius(theme.buttonStyle)

  const contentPages = useMemo(() => paginate(blocks), [blocks])

  const [isDesktop, setIsDesktop] = useState(false)
  // Desktop = render 2-page spreads; mobile = 1 page at a time.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(min-width: 900px)')
    const apply = () => setIsDesktop(mq.matches)
    apply()
    mq.addEventListener?.('change', apply)
    return () => mq.removeEventListener?.('change', apply)
  }, [])

  // A leaf is one printed page. The cover is its own leaf; content pages follow.
  type Leaf = { kind: 'cover' } | { kind: 'content'; page: Question[]; idx: number }
  // Build the SPREADS shown to the user. The cover always occupies its own
  // spread; content pages then pair up (2 per spread on desktop, 1 on mobile).
  // Modelling spreads explicitly (instead of leaf arithmetic) keeps validation,
  // the final-spread test, and progress unambiguous.
  const spreads = useMemo<Leaf[][]>(() => {
    const contentLeaves: Leaf[] = contentPages.map((page, idx) => ({ kind: 'content', page, idx }))
    const out: Leaf[][] = [[{ kind: 'cover' }]]
    const per = isDesktop ? 2 : 1
    for (let i = 0; i < contentLeaves.length; i += per) {
      out.push(contentLeaves.slice(i, i + per))
    }
    return out
  }, [contentPages, isDesktop])

  const [spreadIdx, setSpreadIdx] = useState(0)
  const [flip, setFlip] = useState<'none' | 'next' | 'prev'>('none')
  const animatingRef = useRef(false)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  // Clamp against a layout change (e.g. desktop<->mobile re-pagination).
  const safeIdx = Math.min(spreadIdx, spreads.length - 1)
  const atStart = safeIdx <= 0
  const lastSpread = spreads.length - 1
  // Final spread = the last one AND not the lone cover (cover-only forms still
  // need a content spread before submit, but an empty form submits from cover).
  const isFinalSpread = safeIdx >= lastSpread && (spreads[safeIdx]?.some((l) => l.kind === 'content') || lastSpread === 0)

  // Validate every input question on the current spread. True when clear.
  const validateSpread = useCallback(
    (idx: number): boolean => {
      const all: Record<string, string> = {}
      for (const lf of spreads[idx] || []) {
        if (lf.kind !== 'content') continue
        for (const q of lf.page) {
          if (!isInputField(q.type)) continue
          const msg = validateQuestion(q)
          if (msg) all[q.id] = msg
        }
      }
      if (Object.keys(all).length > 0) { setErrors(all); return false }
      setErrors({})
      return true
    },
    [spreads, validateQuestion, setErrors]
  )

  const FLIP_MS = reduceMotion ? 160 : 620

  const goNext = useCallback(() => {
    if (animatingRef.current) return
    if (safeIdx >= lastSpread) {
      // Last spread — validate then submit through the shared handler.
      if (!validateSpread(safeIdx)) return
      onSubmit()
      return
    }
    if (!validateSpread(safeIdx)) return
    animatingRef.current = true
    setFlip('next')
    window.setTimeout(() => {
      setSpreadIdx((i) => Math.min(i + 1, lastSpread))
      setFlip('none')
      animatingRef.current = false
    }, FLIP_MS)
  }, [safeIdx, lastSpread, validateSpread, onSubmit, FLIP_MS])

  const goPrev = useCallback(() => {
    if (animatingRef.current || atStart) return
    animatingRef.current = true
    setFlip('prev')
    window.setTimeout(() => {
      setSpreadIdx((i) => Math.max(i - 1, 0))
      setFlip('none')
      animatingRef.current = false
    }, FLIP_MS)
  }, [atStart, FLIP_MS])

  // Keyboard navigation (don't hijack Enter inside textareas/inputs on a page).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      const inField = tag === 'TEXTAREA' || tag === 'INPUT' || tag === 'SELECT'
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext() }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev() }
      else if (e.key === 'Enter' && !inField && !e.shiftKey) { e.preventDefault(); goNext() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStart.current.x
    const dy = t.clientY - touchStart.current.y
    touchStart.current = null
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy)) return // not a horizontal swipe
    if (dx < 0) goNext()
    else goPrev()
  }

  const currentSpread = spreads[safeIdx] || []
  const isCoverSpread = currentSpread.length === 1 && currentSpread[0].kind === 'cover'
  // Progress: fraction of content spreads completed (cover excluded).
  const contentSpreadTotal = Math.max(spreads.length - 1, 1)
  const progress = Math.round((safeIdx / contentSpreadTotal) * 100)

  const renderPage = (lf: Leaf) => {
    if (lf.kind === 'cover') {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center px-8 py-12">
          <div className="mb-6 text-xs tracking-[0.3em] uppercase opacity-50" style={{ color: c.primary }}>
            Stoneforms
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" style={{ color: c.text }}>
            {formTitle}
          </h1>
          {formDescription && (
            <p className="mt-4 text-lg opacity-70 max-w-md" style={{ color: c.text }}>
              {formDescription}
            </p>
          )}
          <div className="mt-10 text-sm opacity-60 flex items-center gap-2" style={{ color: c.text }}>
            Turn the page <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      )
    }
    return (
      <div className="h-full overflow-y-auto px-8 md:px-10 py-10 sf-mag-scroll">
        <div className="space-y-8 max-w-xl mx-auto">
          {lf.page.map((b) => (
            <div key={b.id} id={`sf-block-${b.id}`}>
              {isContentBlock(b.type) ? (
                <ContentBlock block={b} theme={theme} density="compact" />
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
        {/* Page footer: little folio number */}
        <div className="mt-10 text-center text-xs opacity-40" style={{ color: c.text }}>
          {lf.idx + 1}
        </div>
      </div>
    )
  }

  // A single printed "page" surface (paper). `side` only affects the inner-edge
  // shadow + corner radius so a spread reads like a bound book.
  const paper = (lf: Leaf | undefined, side: 'left' | 'right' | 'solo', key: string) => (
    <div
      key={key}
      className="relative h-full overflow-hidden"
      style={{
        background: lf?.kind === 'cover'
          ? `linear-gradient(150deg, ${c.primary}14, ${bg})`
          : theme.colors.background,
        boxShadow: side === 'left'
          ? 'inset -14px 0 24px -18px rgba(0,0,0,0.45)'
          : side === 'right'
            ? 'inset 14px 0 24px -18px rgba(0,0,0,0.45)'
            : 'none',
        borderRadius: side === 'left' ? '10px 0 0 10px' : side === 'right' ? '0 10px 10px 0' : '10px',
      }}
    >
      {lf ? renderPage(lf) : <div className="h-full" style={{ background: theme.colors.background }} />}
    </div>
  )

  // Spread layout: the cover (and mobile) is a single page; a desktop content
  // spread is two pages with a center spine.
  const twoUp = isDesktop && !isCoverSpread
  const leftLeaf = currentSpread[0]
  const rightLeaf = twoUp ? currentSpread[1] : undefined

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{ background: bg, fontFamily: ff }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* progress */}
      <div className="fixed top-0 left-0 right-0 h-1.5 z-50" style={{ backgroundColor: `${c.text}14` }}>
        <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: c.primary }} />
      </div>

      <div className="flex-1 w-full flex items-center justify-center px-3 md:px-8 py-10 md:py-16">
        <div
          className="sf-book relative w-full"
          style={{ maxWidth: isDesktop ? 1040 : 560, perspective: reduceMotion ? undefined : '2200px' }}
        >
          <div
            key={safeIdx}
            className={`sf-spread grid ${twoUp ? 'grid-cols-2' : 'grid-cols-1'} ${reduceMotion ? 'sf-fade-in' : flip === 'next' ? 'sf-turn-next' : flip === 'prev' ? 'sf-turn-prev' : ''}`}
            style={{ aspectRatio: twoUp ? '2 / 1.32' : '1 / 1.4', borderRadius: 12, boxShadow: '0 30px 70px -30px rgba(0,0,0,0.5)' }}
          >
            {paper(leftLeaf, twoUp ? 'left' : 'solo', `L${safeIdx}`)}
            {twoUp && paper(rightLeaf, 'right', `R${safeIdx}`)}
            {/* center spine on a two-up desktop spread */}
            {twoUp && (
              <div
                aria-hidden
                className="pointer-events-none absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6"
                style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.18), rgba(0,0,0,0) 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.18))' }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Errors */}
      {submitError && (
        <div className="px-6 -mt-4 mb-2 w-full max-w-xl">
          <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}>
            {submitError}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4 pb-10">
        <button
          onClick={goPrev}
          disabled={atStart}
          aria-label="Previous page"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium disabled:opacity-30 transition-opacity"
          style={{ color: c.text, border: `1px solid ${c.text}33` }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <button
          onClick={goNext}
          disabled={submitting}
          className="sf-cta inline-flex items-center gap-2 px-7 py-3 font-semibold disabled:opacity-60 shadow-sm hover:shadow-md transition-transform active:scale-95"
          style={{ backgroundColor: c.button, color: c.buttonText, borderRadius: radius }}
        >
          {submitting
            ? 'Submitting…'
            : isFinalSpread
              ? <>Submit <Check className="w-5 h-5" /></>
              : <>Next <ArrowRight className="w-5 h-5" /></>}
        </button>
      </div>

      {!hideBranding && (
        <p className="text-center text-xs pb-6 opacity-40" style={{ color: c.text }}>
          Powered by <span className="font-semibold">Stoneforms</span>
        </p>
      )}

      <style jsx global>{`
        .sf-spread { transform-style: preserve-3d; }
        .sf-mag-scroll::-webkit-scrollbar { width: 6px; }
        .sf-mag-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 4px; }
        @keyframes sf-turn-next {
          0% { transform: rotateY(0deg); transform-origin: left center; opacity: 1; }
          45% { transform: rotateY(-18deg); }
          55% { opacity: 0.55; }
          100% { transform: rotateY(0deg); opacity: 1; }
        }
        @keyframes sf-turn-prev {
          0% { transform: rotateY(0deg); transform-origin: right center; opacity: 1; }
          45% { transform: rotateY(18deg); }
          55% { opacity: 0.55; }
          100% { transform: rotateY(0deg); opacity: 1; }
        }
        .sf-turn-next { animation: sf-turn-next 0.62s cubic-bezier(0.42, 0, 0.2, 1); }
        .sf-turn-prev { animation: sf-turn-prev 0.62s cubic-bezier(0.42, 0, 0.2, 1); }
        @keyframes sf-fade-in { from { opacity: 0; } to { opacity: 1; } }
        .sf-fade-in { animation: sf-fade-in 0.16s ease; }
        @media (prefers-reduced-motion: reduce) {
          .sf-turn-next, .sf-turn-prev { animation: sf-fade-in 0.16s ease !important; }
          .sf-cta { transition: none !important; }
        }
      `}</style>
    </div>
  )
}

export default MagazineView
