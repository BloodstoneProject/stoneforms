'use client'

import { useState } from 'react'
import { Check, Minus, Plus } from 'lucide-react'
import {
  BrandShell,
  Reveal,
  LimeCTA,
  GhostCTA,
  Eyebrow,
  Bezel,
  LIME,
  grotesk,
} from '@/components/marketing/brand'

// Everything in the BUILD column ships on every plan, including Free. This is
// the lead message: you never pay to unlock how a form works. Mirrors the real
// per-tier flags in lib/plan-limits.ts (all builder features are free).
const BUILD_FOR_EVERYONE = [
  '25+ field types',
  'Conditional logic & branching',
  'Answer recall & variables',
  'AI form generation',
  'Embed anywhere',
  'Unlimited fields per form',
]

type Plan = {
  id: string
  name: string
  price: string
  period: string
  blurb: string
  responses: string
  forms: string
  // Lines reflect lib/plan-limits.ts features exactly. No invented features.
  lines: string[]
  cta: string
  highlight: boolean
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '£0',
    period: 'forever',
    blurb: 'Everything you need to build. Free, for real.',
    responses: '100 responses / month',
    forms: 'Up to 3 forms',
    lines: [
      'All builder features',
      '100 responses / month',
      'Up to 3 forms',
      'Basic analytics',
      'Stoneforms branding on forms',
    ],
    cta: 'Start free',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '£15',
    period: '/ month',
    blurb: 'For when forms start pulling real volume.',
    responses: '10,000 responses / month',
    forms: 'Unlimited forms',
    lines: [
      'Everything in Free',
      '10,000 responses / month',
      'Unlimited forms',
      'Remove Stoneforms branding',
      'File uploads (1 GB storage)',
      'Email notifications',
      'Advanced analytics',
    ],
    cta: 'Go Pro',
    highlight: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: '£25',
    period: '/ month',
    blurb: 'No caps. For forms that never stop.',
    responses: 'Unlimited responses',
    forms: 'Unlimited forms',
    lines: [
      'Everything in Pro',
      'Unlimited responses',
      '10 GB storage',
      'Webhooks',
      'Priority support',
    ],
    cta: 'Go Business',
    highlight: false,
  },
]

const FAQ = [
  {
    q: 'Is logic really free?',
    a: 'Yes. Conditional logic, branching, answer recall, variables, AI generation, 25+ field types and embedding all ship on the Free plan. You never pay to unlock how a form works. Paid plans are about scale, not features.',
  },
  {
    q: 'Do I need a credit card to start?',
    a: 'No. The Free plan is free forever and needs no card. You only enter payment details if and when you decide to move up to Pro or Business.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel whenever you like and you keep building on the Free plan. No phone call, no retention maze, no contract.',
  },
  {
    q: 'What happens if I hit my response limit?',
    a: 'Your forms keep working and your existing data is safe. New responses pause for the rest of the month until the limit resets, or you can move up a plan for more headroom on the spot.',
  },
  {
    q: "What's the catch versus Typeform?",
    a: 'There is no Typeform tax. The same builder muscle, minus the price tag that climbs every time you want logic or volume. You build for free and pay a flat, honest rate only when you scale.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <Bezel className="!p-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 text-left"
      >
        <span className="text-base font-medium tracking-tight text-white sm:text-lg" style={grotesk}>
          {q}
        </span>
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors duration-300">
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      <div
        className="grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          gridTemplateRows: open ? '1fr' : '0fr',
          opacity: open ? 1 : 0,
          marginTop: open ? '1rem' : 0,
        }}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl text-sm leading-relaxed text-white/55">{a}</p>
        </div>
      </div>
    </Bezel>
  )
}

export default function PricingPage() {
  return (
    <BrandShell active="/pricing">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 pt-40 pb-24 sm:pt-48">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <Eyebrow>Pricing</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1
              className="mt-8 text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
              style={grotesk}
            >
              Build for free.
              <br />
              Pay only to{' '}
              <span style={{ color: LIME }}>scale.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-white/55">
              Every builder feature is unlocked on day one, free. No Typeform tax,
              no feature gates, no surprises. You only pay when your forms start
              pulling serious volume.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <LimeCTA href="/auth/signup">Start free</LimeCTA>
              <GhostCTA href="/features">See what you get</GhostCTA>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Build-is-free banner ─────────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-8">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Bezel glow>
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-md">
                  <span
                    className="text-xs font-semibold uppercase tracking-[0.22em]"
                    style={{ color: LIME }}
                  >
                    Free on every plan
                  </span>
                  <h2
                    className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl"
                    style={grotesk}
                  >
                    Everything you need to build.
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">
                    Logic, recall, variables, AI generation and 25+ field types
                    are not premium add-ons here. They are the baseline, on the
                    Free plan, no card required.
                  </p>
                </div>
                <ul className="grid flex-none grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                  {BUILD_FOR_EVERYONE.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-white/75">
                      <span
                        className="flex h-5 w-5 flex-none items-center justify-center rounded-full"
                        style={{ backgroundColor: LIME }}
                      >
                        <Check className="h-3 w-3 text-black" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Bezel>
          </Reveal>
        </div>
      </section>

      {/* ── Plans ────────────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-4 md:grid-cols-3">
            {PLANS.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 90} className="h-full">
                <Bezel
                  glow={plan.highlight}
                  className={`relative h-full ${plan.highlight ? '!border-white/20' : ''}`}
                  inner={plan.highlight ? '#161608' : '#131313'}
                >
                  {plan.highlight && (
                    <span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-black"
                      style={{ backgroundColor: LIME }}
                    >
                      Most popular
                    </span>
                  )}

                  <div className="flex h-full flex-col">
                    <div>
                      <h3
                        className="text-sm font-semibold uppercase tracking-[0.18em]"
                        style={{ ...grotesk, color: plan.highlight ? LIME : 'rgba(255,255,255,0.6)' }}
                      >
                        {plan.name}
                      </h3>
                      <div className="mt-5 flex items-baseline gap-2">
                        <span className="text-5xl font-semibold tracking-tight" style={grotesk}>
                          {plan.price}
                        </span>
                        <span className="text-sm text-white/45">{plan.period}</span>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-white/55">{plan.blurb}</p>
                    </div>

                    <div className="my-7 h-px w-full bg-white/10" />

                    <ul className="space-y-3">
                      {plan.lines.map((line) => (
                        <li key={line} className="flex items-start gap-3 text-sm text-white/70">
                          <Check
                            className="mt-0.5 h-4 w-4 flex-none"
                            strokeWidth={2.25}
                            style={{ color: plan.highlight ? LIME : 'rgba(255,255,255,0.45)' }}
                          />
                          {line}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 pt-2">
                      {plan.highlight ? (
                        <LimeCTA href="/auth/signup">{plan.cta}</LimeCTA>
                      ) : (
                        <GhostCTA href="/auth/signup">{plan.cta}</GhostCTA>
                      )}
                    </div>
                  </div>
                </Bezel>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <p className="mt-8 text-center text-xs text-white/40">
              All prices in GBP. Move up or down a plan anytime. Cancel anytime.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <Eyebrow>Straight answers</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2
              className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl"
              style={grotesk}
            >
              No small print.
            </h2>
          </Reveal>

          <div className="mt-12 space-y-3">
            {FAQ.map((item, i) => (
              <Reveal key={item.q} delay={i * 60}>
                <FaqItem q={item.q} a={item.a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-28">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Bezel glow className="text-center">
              <h2
                className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl"
                style={grotesk}
              >
                Start building for free. Pay nothing until you scale.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/55">
                No card, no trial countdown, no Typeform tax. Just the builder.
              </p>
              <div className="mt-8 flex justify-center">
                <LimeCTA href="/auth/signup">Create your first form</LimeCTA>
              </div>
            </Bezel>
          </Reveal>
        </div>
      </section>
    </BrandShell>
  )
}
