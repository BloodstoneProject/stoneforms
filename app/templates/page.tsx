'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { FORM_TEMPLATES } from '@/lib/form-templates'
import { TEMPLATE_CATEGORIES, CATEGORY_BLURBS } from '@/lib/template-categories'
import {
  BrandShell,
  Reveal,
  LimeCTA,
  Eyebrow,
  Bezel,
  LIME,
  grotesk,
} from '@/components/marketing/brand'

const FILTERS = ['All', ...TEMPLATE_CATEGORIES] as const
type Filter = (typeof FILTERS)[number]

// Snappy chip motion. Custom curve — quick out, soft settle.
const CHIP_EASE = 'cubic-bezier(0.22,1,0.36,1)'

export default function TemplatesPage() {
  const [filter, setFilter] = useState<Filter>('All')

  const shown =
    filter === 'All'
      ? FORM_TEMPLATES
      : FORM_TEMPLATES.filter((t) => t.category === filter)

  const sections = TEMPLATE_CATEGORIES.map((cat) => ({
    cat,
    items: shown.filter((t) => t.category === cat),
  })).filter((s) => s.items.length > 0)

  return (
    <BrandShell active="/templates">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 pt-40 pb-20 sm:pt-48">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>Templates</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1
              className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl"
              style={grotesk}
            >
              Start from a template,
              <br />
              <span style={{ color: LIME }}>ship in minutes.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/50">
              Real, working forms built for solo creators. Pick one, make it
              yours, send it. No starting from a blank page, no busywork.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-9">
              <LimeCTA href="/auth/signup">Build your first form</LimeCTA>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Filter chips ────────────────────────────────────────────────── */}
      <section className="relative z-10 px-6">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="flex flex-wrap gap-2 border-b border-white/10 pb-8">
              {FILTERS.map((f) => {
                const isActive = filter === f
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className="rounded-full border px-4 py-2 text-sm font-medium"
                    style={{
                      ...grotesk,
                      transition: `background-color 280ms ${CHIP_EASE}, color 280ms ${CHIP_EASE}, border-color 280ms ${CHIP_EASE}`,
                      backgroundColor: isActive ? LIME : 'transparent',
                      color: isActive ? '#0E0E0E' : 'rgba(255,255,255,0.55)',
                      borderColor: isActive ? LIME : 'rgba(255,255,255,0.10)',
                    }}
                    onMouseEnter={(e) => {
                      if (isActive) return
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.30)'
                    }}
                    onMouseLeave={(e) => {
                      if (isActive) return
                      e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
                      e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.10)'
                    }}
                  >
                    {f}
                  </button>
                )
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Grid ────────────────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 pt-16 pb-28">
        <div className="mx-auto max-w-5xl space-y-20">
          {sections.length === 0 && (
            <Reveal>
              <div className="py-20 text-center">
                <p className="text-lg font-medium text-white" style={grotesk}>
                  Nothing here yet.
                </p>
                <p className="mt-2 text-sm text-white/50">
                  Try another category, or look at all of them.
                </p>
                <button
                  type="button"
                  onClick={() => setFilter('All')}
                  className="mt-6 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 transition-colors duration-300 hover:border-white/30 hover:text-white"
                  style={grotesk}
                >
                  Show everything
                </button>
              </div>
            </Reveal>
          )}

          {sections.map((section) => (
            <div key={section.cat}>
              <Reveal>
                <div className="max-w-2xl">
                  <h2
                    className="text-2xl font-semibold tracking-tight sm:text-3xl"
                    style={grotesk}
                  >
                    {section.cat}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    {CATEGORY_BLURBS[section.cat]}
                  </p>
                </div>
              </Reveal>

              <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {section.items.map((t, i) => (
                  <Reveal key={t.id} delay={Math.min(i, 5) * 60}>
                    <TemplateCard
                      icon={t.icon}
                      name={t.name}
                      description={t.description}
                      category={t.category}
                      meta={
                        t.quiz ? 'Scored quiz' : `${t.fields.length} fields`
                      }
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Closing CTA ─────────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-32">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Bezel className="text-center" inner="#101010" glow>
              <div className="px-2 py-12 sm:py-16">
                <Eyebrow>Free to start</Eyebrow>
                <h2
                  className="mx-auto mt-6 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl"
                  style={grotesk}
                >
                  Grab a template and
                  <br />
                  <span style={{ color: LIME }}>have it live today.</span>
                </h2>
                <div className="mt-9 flex justify-center">
                  <LimeCTA href="/auth/signup">Start free</LimeCTA>
                </div>
              </div>
            </Bezel>
          </Reveal>
        </div>
      </section>
    </BrandShell>
  )
}

// Double-bezel template card. Whole card links to signup (logged-out
// marketing visitor → /auth/signup). Lime category chip + lift on hover.
function TemplateCard({
  icon,
  name,
  description,
  category,
  meta,
}: {
  icon: string
  name: string
  description: string
  category: string
  meta: string
}) {
  return (
    <Link
      href="/auth/signup"
      className="group block h-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1"
    >
      <Bezel className="h-full">
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between">
            <span className="text-3xl leading-none" aria-hidden>
              {icon}
            </span>
            <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-white/40 transition-colors duration-300 group-hover:border-transparent group-hover:text-black">
              <span
                aria-hidden
                className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ backgroundColor: LIME }}
              />
              <ArrowUpRight
                className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={2}
              />
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span
              className="rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em]"
              style={{
                color: LIME,
                borderColor: 'rgba(198,242,78,0.30)',
                backgroundColor: 'rgba(198,242,78,0.06)',
              }}
            >
              {category}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
              {meta}
            </span>
          </div>

          <h3
            className="mt-3 text-lg font-semibold tracking-tight text-white"
            style={grotesk}
          >
            {name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/50">
            {description}
          </p>
        </div>
      </Bezel>
    </Link>
  )
}
