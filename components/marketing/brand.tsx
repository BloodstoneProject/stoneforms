'use client'

// ── "Electric & sharp" marketing brand system ──────────────────────────────
// Shared across all public marketing pages. Acid lime on near-black, Space
// Grotesk display (var set in app/layout.tsx). Scoped to marketing only — the
// app/dashboard and the form player do NOT import this.

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'

export const LIME = '#C6F24E'
export const INK = '#0E0E0E'
export const grotesk = { fontFamily: 'var(--font-grotesk)' } as const

// Gentle heavy fade-up as elements enter the viewport (IntersectionObserver,
// transform/opacity/filter only — GPU-safe).
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transitionProperty: 'transform, opacity, filter',
        transitionDuration: '900ms',
        transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
        transitionDelay: `${delay}ms`,
        transform: shown ? 'translateY(0)' : 'translateY(28px)',
        opacity: shown ? 1 : 0,
        filter: shown ? 'blur(0)' : 'blur(6px)',
      }}
    >
      {children}
    </div>
  )
}

// Pill CTA with nested "button-in-button" trailing icon + magnetic press.
export function LimeCTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-3 rounded-full pl-6 pr-2 py-2 text-sm font-semibold text-black transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.97]"
      style={{ ...grotesk, backgroundColor: LIME }}
    >
      {children}
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/15 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
      </span>
    </Link>
  )
}

export function GhostCTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-sm font-medium text-white/80 transition-colors duration-300 hover:border-white/30 hover:text-white"
      style={grotesk}
    >
      {children}
    </Link>
  )
}

// Microscopic pill badge that precedes major headings.
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-white/60">
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: LIME }} />
      {children}
    </span>
  )
}

// Double-bezel card (outer shell + inner core, concentric radii).
export function Bezel({
  children,
  className = '',
  inner = '#131313',
  glow = false,
}: {
  children: React.ReactNode
  className?: string
  inner?: string
  glow?: boolean
}) {
  return (
    <div
      className={`rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-2 transition-colors duration-500 hover:border-white/20 ${className}`}
    >
      <div
        className="h-full rounded-[calc(1.75rem-0.5rem)] border border-white/5 p-6 sm:p-7"
        style={{
          backgroundColor: inner,
          boxShadow: glow ? 'inset 0 1px 1px rgba(255,255,255,0.08)' : undefined,
        }}
      >
        {children}
      </div>
    </div>
  )
}

const NAV_LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/templates', label: 'Templates' },
  { href: '/pricing', label: 'Pricing' },
]

// Floating glass pill nav + full-screen mobile menu.
export function BrandNav({ active }: { active?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 px-4">
        <div className="mx-auto mt-5 flex max-w-5xl items-center justify-between rounded-full border border-white/10 bg-black/50 py-2 pl-5 pr-2 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2" style={grotesk}>
            <span className="flex h-6 w-6 items-center justify-center rounded-md text-[13px] font-bold text-black" style={{ backgroundColor: LIME }}>S</span>
            <span className="text-[15px] font-semibold tracking-tight text-white">Stoneforms</span>
          </Link>

          <div className="hidden items-center gap-7 text-sm text-white/60 md:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="transition-colors hover:text-white"
                style={active === l.href ? { color: '#fff' } : undefined}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Link href="/auth/login" className="px-3 text-sm text-white/60 transition-colors hover:text-white">
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-full px-4 py-2 text-sm font-semibold text-black transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-95"
              style={{ backgroundColor: LIME }}
            >
              Start free
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white md:hidden"
          >
            {open ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-40 flex flex-col bg-black/90 px-6 pb-10 pt-28 backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-1 text-3xl font-semibold tracking-tight text-white">
            {NAV_LINKS.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 transition-colors hover:text-[#C6F24E]"
                style={{ ...grotesk, transitionDelay: `${i * 40}ms` }}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-3">
            <Link href="/auth/login" onClick={() => setOpen(false)} className="rounded-full border border-white/15 py-3 text-center text-sm font-medium text-white/80">
              Sign in
            </Link>
            <Link href="/auth/signup" onClick={() => setOpen(false)} className="rounded-full py-3 text-center text-sm font-semibold text-black" style={{ backgroundColor: LIME }}>
              Start free
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export function BrandFooter() {
  return (
    <footer className="relative z-10 border-t border-white/10 px-6 py-14" style={grotesk}>
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md text-[13px] font-bold text-black" style={{ backgroundColor: LIME }}>S</span>
              <span className="text-[15px] font-semibold tracking-tight text-white">Stoneforms</span>
            </Link>
            <p className="mt-4 text-sm text-white/40">Typeform-grade forms, without the Typeform tax.</p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40">Product</h4>
              <ul className="mt-4 space-y-3 text-sm text-white/60">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/templates" className="hover:text-white">Templates</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40">Company</h4>
              <ul className="mt-4 space-y-3 text-sm text-white/60">
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/help" className="hover:text-white">Help</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40">Legal</h4>
              <ul className="mt-4 space-y-3 text-sm text-white/60">
                <li><Link href="/legal/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/legal/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/35">© 2026 Stoneforms</div>
      </div>
    </footer>
  )
}

// Shared page shell: near-black canvas + fixed grain. Wrap marketing pages.
export function BrandShell({ children, active }: { children: React.ReactNode; active?: string }) {
  return (
    <div className="min-h-[100dvh] overflow-x-clip text-white" style={{ backgroundColor: INK, ...grotesk }}>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <BrandNav active={active} />
      {children}
      <BrandFooter />
    </div>
  )
}
