'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X, Check, Minus } from 'lucide-react'

// ── "Electric & sharp" brand — scoped to the marketing homepage only.
// Acid lime on near-black, Space Grotesk display (var set in app/layout.tsx).
const LIME = '#C6F24E'
const INK = '#0E0E0E'
const grotesk = { fontFamily: 'var(--font-grotesk)' }

// Lightweight scroll-reveal: gentle heavy fade-up as elements enter the
// viewport (IntersectionObserver, transform/opacity only — GPU-safe).
function Reveal({
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

// Pill CTA with the nested "button-in-button" trailing icon + magnetic press.
function LimeCTA({ href, children }: { href: string; children: React.ReactNode }) {
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

function GhostCTA({ href, children }: { href: string; children: React.ReactNode }) {
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

export default function Homepage() {
  const [open, setOpen] = useState(false)

  const navLinks = [
    { href: '/features', label: 'Features' },
    { href: '/templates', label: 'Templates' },
    { href: '/pricing', label: 'Pricing' },
  ]

  // Real, defensible differentiators — no fabricated user counts.
  const features = [
    {
      span: 'md:col-span-3',
      kicker: 'Logic that ships free',
      title: 'Branching, recall & variables',
      desc: 'Jump logic, multi-condition rules, named variables and answer piping ({{name}}) — the power features Typeform tucks behind paid plans. Here they’re just on.',
    },
    {
      span: 'md:col-span-3',
      kicker: 'Describe it, get a form',
      title: 'AI form generation built in',
      desc: 'Type what you want. Get a real, editable form with the right field types in seconds — then make it yours.',
    },
    {
      span: 'md:col-span-2',
      kicker: '25+ field types',
      title: 'Every input you need',
      desc: 'Contact info, matrix, NPS, scheduling, payments, signature, file upload, rating, ranking — and more.',
    },
    {
      span: 'md:col-span-2',
      kicker: 'Not just a form',
      title: 'Presentation modes',
      desc: 'One-question conversational, classic, or a 3D magazine flip. Forms that don’t look like everyone else’s.',
    },
    {
      span: 'md:col-span-2',
      kicker: 'Share anywhere',
      title: 'Embed, link, QR',
      desc: 'Inline, popup, slide-over or full page. Drop one snippet anywhere. Per-form analytics included.',
    },
  ]

  const gated = [
    'Logic jumps locked to paid plans',
    'Per-response limits on free',
    'Remove-branding = upgrade',
    'Integrations behind higher tiers',
    'Price climbs as you grow',
  ]
  const unlocked = [
    'Logic, recall & variables — free',
    'AI form generation — built in',
    '25+ field types, all of them',
    'Multiple endings + redirects',
    'Embed & analytics included',
  ]

  const proof = [
    'No credit card',
    'Everything unlocked',
    'Built-in AI',
    'Self-serve in minutes',
  ]

  return (
    <div className="min-h-[100dvh] overflow-x-clip text-white" style={{ backgroundColor: INK, ...grotesk }}>
      {/* fixed grain + ambient lime glow (pointer-events-none, GPU-safe) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── Floating glass pill nav ───────────────────────────── */}
      <nav className="fixed inset-x-0 top-0 z-50 px-4">
        <div className="mx-auto mt-5 flex max-w-5xl items-center justify-between rounded-full border border-white/10 bg-black/50 py-2 pl-5 pr-2 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2" style={grotesk}>
            <span className="flex h-6 w-6 items-center justify-center rounded-md text-[13px] font-bold text-black" style={{ backgroundColor: LIME }}>S</span>
            <span className="text-[15px] font-semibold tracking-tight">Stoneforms</span>
          </Link>

          <div className="hidden items-center gap-7 text-sm text-white/60 md:flex">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-white">
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

      {/* Mobile full-screen menu */}
      {open && (
        <div className="fixed inset-0 z-40 flex flex-col bg-black/90 px-6 pb-10 pt-28 backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-1 text-3xl font-semibold tracking-tight">
            {navLinks.map((l, i) => (
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

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative z-10 px-4">
        {/* ambient radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-6rem] -z-10 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
          style={{ background: `radial-gradient(circle, ${LIME} 0%, transparent 60%)` }}
        />
        <div className="mx-auto max-w-5xl pb-20 pt-40 text-center sm:pt-44">
          <Reveal>
            <span
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-white/60"
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: LIME }} />
              Typeform-grade. Not Typeform-priced.
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mx-auto mt-7 max-w-4xl text-[2.75rem] font-semibold leading-[0.98] tracking-tight sm:text-7xl">
              Forms that don&rsquo;t suck.
              <br />
              And don&rsquo;t cost{' '}
              <span style={{ color: LIME }}>a fortune.</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
              Logic, recall, variables, AI generation, 25+ field types — everything the
              big guys charge for, unlocked. Build a beautiful form in minutes. Free.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LimeCTA href="/auth/signup">Start building — free</LimeCTA>
              <GhostCTA href="/pricing">See pricing</GhostCTA>
            </div>
            <p className="mt-5 text-xs text-white/35">No card. No catch. Everything unlocked.</p>
          </Reveal>

          {/* Hero product preview — double-bezel, faintly tilted */}
          <Reveal delay={340} className="mt-20">
            <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-2 backdrop-blur-sm">
              <div
                className="relative overflow-hidden rounded-[calc(2rem-0.5rem)] border border-white/10 px-6 py-12 text-left shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] sm:px-12 sm:py-16"
                style={{ backgroundColor: '#141414' }}
              >
                <div className="mb-6 flex items-center gap-3 text-xs text-white/40">
                  <span className="h-1 w-24 overflow-hidden rounded-full bg-white/10">
                    <span className="block h-full w-2/3 rounded-full" style={{ backgroundColor: LIME }} />
                  </span>
                  Question 2 of 3
                </div>
                <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  What should we build you first,{' '}
                  <span style={{ color: LIME }}>Alex</span>?
                </p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {['A lead-gen form', 'A customer survey', 'A quiz', 'A booking form'].map((opt, i) => (
                    <div
                      key={opt}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/80"
                      style={i === 0 ? { borderColor: LIME, color: '#fff' } : undefined}
                    >
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-md border border-white/15 text-[11px] font-semibold"
                        style={i === 0 ? { backgroundColor: LIME, color: '#000', borderColor: LIME } : undefined}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-xs text-white/30">
                  &ldquo;Alex&rdquo; is piped in with recall — one of the things you&rsquo;d normally pay for.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── The "no Typeform tax" centerpiece ─────────────────── */}
      <section className="relative z-10 px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mb-14 text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">The difference</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
              Same power. None of the toll booths.
            </h2>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Them */}
            <Reveal>
              <div className="h-full rounded-[2rem] border border-white/10 bg-white/[0.02] p-2">
                <div className="h-full rounded-[calc(2rem-0.5rem)] border border-white/5 p-7 sm:p-9" style={{ backgroundColor: '#121212' }}>
                  <p className="text-sm font-medium text-white/40">The other guys</p>
                  <ul className="mt-6 space-y-4">
                    {gated.map((g) => (
                      <li key={g} className="flex items-start gap-3 text-sm text-white/55">
                        <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-white/5">
                          <Minus className="h-3 w-3 text-white/40" strokeWidth={2} />
                        </span>
                        <span className="line-through decoration-white/20">{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            {/* Us */}
            <Reveal delay={120}>
              <div
                className="h-full rounded-[2rem] p-2"
                style={{ backgroundColor: 'rgba(198,242,78,0.12)', border: '1px solid rgba(198,242,78,0.25)' }}
              >
                <div className="h-full rounded-[calc(2rem-0.5rem)] border border-white/5 p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] sm:p-9" style={{ backgroundColor: '#141a0c' }}>
                  <p className="text-sm font-semibold" style={{ color: LIME }}>Stoneforms</p>
                  <ul className="mt-6 space-y-4">
                    {unlocked.map((u) => (
                      <li key={u} className="flex items-start gap-3 text-sm text-white">
                        <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full" style={{ backgroundColor: LIME }}>
                          <Check className="h-3 w-3 text-black" strokeWidth={2.5} />
                        </span>
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Feature bento ─────────────────────────────────────── */}
      <section className="relative z-10 px-4 py-12 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mb-12 max-w-2xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">What you get</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
              Everything to build, share, and learn from your forms.
            </h2>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-6">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 80} className={f.span}>
                <div className="group h-full rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-2 transition-colors duration-500 hover:border-white/20">
                  <div className="flex h-full flex-col rounded-[calc(1.75rem-0.5rem)] border border-white/5 p-6 sm:p-7" style={{ backgroundColor: '#131313' }}>
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em]" style={{ color: LIME }}>
                      {f.kicker}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold tracking-tight">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/50">{f.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Proof band (honest, not fabricated metrics) ───────── */}
      <section className="relative z-10 px-4 py-14">
        <Reveal className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 sm:gap-x-6">
            {proof.map((p, i) => (
              <div key={p} className="flex items-center gap-3 sm:gap-6">
                {i > 0 && <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />}
                <span className="flex items-center gap-2 text-sm font-medium text-white/70">
                  <Check className="h-4 w-4" strokeWidth={2} style={{ color: LIME }} />
                  {p}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="relative z-10 px-4 py-24 sm:py-32">
        <Reveal className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 p-2" style={{ backgroundColor: 'rgba(198,242,78,0.1)' }}>
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[100px]"
              style={{ background: `radial-gradient(circle, ${LIME} 0%, transparent 65%)` }}
            />
            <div className="relative rounded-[calc(2.5rem-0.5rem)] px-6 py-16 text-center sm:px-12 sm:py-20" style={{ backgroundColor: '#101510' }}>
              <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
                Build your first form in the next five minutes.
              </h2>
              <p className="mx-auto mt-5 max-w-md text-white/55">
                Free to start. Everything unlocked. No card, no sales call, no catch.
              </p>
              <div className="mt-9 flex justify-center">
                <LimeCTA href="/auth/signup">Start building — free</LimeCTA>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col justify-between gap-10 md:flex-row">
            <div className="max-w-xs">
              <Link href="/" className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md text-[13px] font-bold text-black" style={{ backgroundColor: LIME }}>S</span>
                <span className="text-[15px] font-semibold tracking-tight">Stoneforms</span>
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
          <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/35">
            © 2026 Stoneforms
          </div>
        </div>
      </footer>
    </div>
  )
}
