'use client'

import { Check, Minus } from 'lucide-react'
import { BrandShell, Reveal, LimeCTA, GhostCTA, Eyebrow, LIME } from '@/components/marketing/brand'

export default function Homepage() {
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
  const proof = ['No credit card', 'Everything unlocked', 'Built-in AI', 'Self-serve in minutes']

  return (
    <BrandShell active="/">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative z-10 px-4">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-6rem] -z-10 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
          style={{ background: `radial-gradient(circle, ${LIME} 0%, transparent 60%)` }}
        />
        <div className="mx-auto max-w-5xl pb-20 pt-40 text-center sm:pt-44">
          <Reveal>
            <Eyebrow>Typeform-grade. Not Typeform-priced.</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mx-auto mt-7 max-w-4xl text-[2.75rem] font-semibold leading-[0.98] tracking-tight sm:text-7xl">
              Forms that don&rsquo;t suck.
              <br />
              And don&rsquo;t cost <span style={{ color: LIME }}>a fortune.</span>
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
                  What should we build you first, <span style={{ color: LIME }}>Alex</span>?
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

      {/* ── "No Typeform tax" centerpiece ─────────────────────── */}
      <section className="relative z-10 px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mb-14 text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">The difference</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">Same power. None of the toll booths.</h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2">
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
            <Reveal delay={120}>
              <div className="h-full rounded-[2rem] p-2" style={{ backgroundColor: 'rgba(198,242,78,0.12)', border: '1px solid rgba(198,242,78,0.25)' }}>
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
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">Everything to build, share, and learn from your forms.</h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-6">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 80} className={f.span}>
                <div className="group h-full rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-2 transition-colors duration-500 hover:border-white/20">
                  <div className="flex h-full flex-col rounded-[calc(1.75rem-0.5rem)] border border-white/5 p-6 sm:p-7" style={{ backgroundColor: '#131313' }}>
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em]" style={{ color: LIME }}>{f.kicker}</p>
                    <h3 className="mt-3 text-xl font-semibold tracking-tight">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/50">{f.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Proof band (honest) ───────────────────────────────── */}
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
    </BrandShell>
  )
}
