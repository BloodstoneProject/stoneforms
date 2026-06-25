'use client'

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

// ── Tiny lime-accented bullet, reused inside cards ───────────────────────────
function Spark() {
  return (
    <span
      aria-hidden
      className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
      style={{ backgroundColor: LIME }}
    />
  )
}

// ── Section header: eyebrow + giant tracking-tight heading + lede ────────────
function SectionHead({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string
  title: React.ReactNode
  lede: string
}) {
  return (
    <div className="max-w-2xl">
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={60}>
        <h2
          className="mt-6 text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl"
          style={grotesk}
        >
          {title}
        </h2>
      </Reveal>
      <Reveal delay={120}>
        <p className="mt-5 text-base leading-relaxed text-white/50 sm:text-lg">{lede}</p>
      </Reveal>
    </div>
  )
}

// ── A double-bezel feature card (kicker + title + body + optional chips) ─────
function FeatureCard({
  kicker,
  title,
  body,
  chips,
  delay = 0,
}: {
  kicker: string
  title: string
  body: string
  chips?: string[]
  delay?: number
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <Bezel className="h-full">
        <div className="flex h-full flex-col">
          <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">
            {kicker}
          </span>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-white" style={grotesk}>
            {title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-white/55">{body}</p>
          {chips && chips.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1 text-[11px] text-white/55"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </Bezel>
    </Reveal>
  )
}

// ── 25+ field types — the real list, grouped ────────────────────────────────
const FIELD_GROUPS: { label: string; types: string[] }[] = [
  { label: 'Text & choice', types: ['Short text', 'Long text', 'Email', 'Phone', 'Multiple choice', 'Dropdown', 'Yes / No', 'Number'] },
  { label: 'Rich inputs', types: ['Rating', 'Ranking', 'Matrix', 'NPS', 'Opinion scale', 'Date', 'Address', 'Contact info'] },
  { label: 'Heavy lifting', types: ['File upload', 'Signature', 'Payment', 'Scheduling', 'Statement', 'Legal / consent'] },
]

export default function FeaturesPage() {
  return (
    <BrandShell active="/features">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative px-6 pb-24 pt-40 sm:pt-48">
        {/* faint lime bloom behind the headline */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-28 -z-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-[0.10] blur-[120px]"
          style={{ background: LIME }}
        />
        <div className="relative mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>The whole toolkit</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1
              className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl lg:text-[5.25rem]"
              style={grotesk}
            >
              Everything Typeform
              <br />
              charges extra for.
              <span className="text-white/30"> Built in.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/55">
              Logic, scoring, payments, integrations, analytics. The features that sit
              behind Typeform&apos;s paywall ship in Stoneforms on day one. Built by a solo
              maker, for solo makers.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <LimeCTA href="/auth/signup">Start building free</LimeCTA>
              <GhostCTA href="/pricing">See the price</GhostCTA>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 1. AI + BUILDER ──────────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            eyebrow="Start in seconds"
            title={<>Describe it. Watch it build itself.</>}
            lede="Type what you want to ask and the AI generates a full form: the right field types, the order, the logic. Then 25+ field types let you make it exactly yours."
          />

          <div className="mt-14 grid gap-4 lg:grid-cols-12">
            {/* big editorial AI panel */}
            <Reveal className="lg:col-span-7">
              <Bezel className="h-full" glow>
                <div className="flex h-full flex-col justify-between gap-8">
                  <div>
                    <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">
                      AI form generation
                    </span>
                    <h3
                      className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl"
                      style={grotesk}
                    >
                      A prompt in. A finished form out.
                    </h3>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">
                      Stoneforms reads your intent and assembles a working draft: questions,
                      field types and ordering already in place. Tweak, don&apos;t start
                      from a blank canvas.
                    </p>
                  </div>
                  {/* faux prompt bar — purely decorative, no fake metric */}
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-[12px] font-bold text-black"
                        style={{ backgroundColor: LIME }}
                      >
                        S
                      </span>
                      <span className="text-sm text-white/45">
                        &ldquo;A lead intake form for my design studio with budget and
                        timeline&hellip;&rdquo;
                      </span>
                    </div>
                  </div>
                </div>
              </Bezel>
            </Reveal>

            <div className="grid gap-4 lg:col-span-5">
              <FeatureCard
                kicker="Builder"
                title="Block-based editor"
                body="Reorder, duplicate and edit every question inline. No mystery menus, no magic numbers."
                delay={80}
              />
              <FeatureCard
                kicker="Field library"
                title="25+ field types"
                body="From plain text to contact info, matrix grids, NPS, scheduling, payments, e-signatures and file uploads."
                chips={['Matrix', 'NPS', 'Signature', 'Payment', 'Scheduling']}
                delay={160}
              />
            </div>
          </div>

          {/* the full field-type ledger */}
          <Reveal delay={120} className="mt-4">
            <Bezel>
              <div className="grid gap-8 sm:grid-cols-3">
                {FIELD_GROUPS.map((g) => (
                  <div key={g.label}>
                    <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">
                      {g.label}
                    </span>
                    <ul className="mt-4 space-y-2.5">
                      {g.types.map((t) => (
                        <li key={t} className="flex items-start gap-2.5 text-sm text-white/65">
                          <Spark />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Bezel>
          </Reveal>
        </div>
      </section>

      {/* ── 2. LOGIC ENGINE — editorial split ────────────────────────────── */}
      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-14 lg:grid-cols-2">
            <div className="lg:sticky lg:top-28">
              <SectionHead
                eyebrow="The logic engine"
                title={
                  <>
                    Forms that <span style={{ color: LIME }}>think</span> as people answer.
                  </>
                }
                lede="Branch, skip, score and personalise in real time. This is the part most builders bury behind a premium tier. Here it's just how Stoneforms works."
              />
              <Reveal delay={180} className="mt-8">
                <GhostCTA href="/auth/signup">Build a branching flow</GhostCTA>
              </Reveal>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FeatureCard
                kicker="Jump logic"
                title="Multi-condition branching"
                body="Route respondents with AND / OR conditions. Send each answer down the path that actually fits."
                delay={40}
              />
              <FeatureCard
                kicker="Recall & piping"
                title="{{field}} + named vars"
                body="Pipe earlier answers back into later questions and copy. Define named variables and reuse them anywhere."
                chips={['{{name}}', '{{score}}', 'Variables']}
                delay={120}
              />
              <FeatureCard
                kicker="Endings"
                title="Logic-selected outcomes"
                body="Multiple endings chosen by logic, plus redirects to any URL when the form completes."
                delay={200}
              />
              <FeatureCard
                kicker="Scoring"
                title="Quizzes & calculators"
                body="Assign points for a quiz result, or run live calculations for quotes, totals and scores."
                delay={280}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. PRESENTATION & PLAYER ─────────────────────────────────────── */}
      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            eyebrow="How it feels to answer"
            title={<>Three ways to present. One that wins.</>}
            lede="Pick the format that suits the moment, theme it to your brand, and let the gamified player make finishing feel good."
          />

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            <FeatureCard
              kicker="Mode 01"
              title="Conversational"
              body="One question at a time, full-screen, keyboard-driven. The classic high-completion flow."
              delay={40}
            />
            <FeatureCard
              kicker="Mode 02"
              title="Classic"
              body="Every field on a single scrollable page when speed beats theatre."
              delay={120}
            />
            <FeatureCard
              kicker="Mode 03"
              title="3D magazine flip"
              body="Pages turn like a printed magazine. A presentation mode nobody expects from a form."
              delay={200}
            />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <FeatureCard
              kicker="Theming"
              title="Make it unmistakably yours"
              body="Colours, type and layout themes so the form reads as your product, not someone else's template."
              delay={80}
            />
            <FeatureCard
              kicker="The player"
              title="Gamified, celebratory finish"
              body="Smooth transitions and a payoff at the end. Respondents enjoy completing it, so more of them do."
              delay={160}
            />
          </div>
        </div>
      </section>

      {/* ── 4. SHARE & EMBED ─────────────────────────────────────────────── */}
      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            eyebrow="Put it everywhere"
            title={<>Ship it inline, popup, slide-over or full page.</>}
            lede="Embed however the moment calls for it, generate a QR code, share a link, or spin up a hosted landing page. No engineer required."
          />

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            <FeatureCard
              kicker="Embed"
              title="Four embed modes"
              body="Drop it inline in a page, trigger a popup or slide-over, or hand someone a full-page form."
              chips={['Inline', 'Popup', 'Slide-over', 'Full page']}
              delay={40}
            />
            <FeatureCard
              kicker="Share"
              title="Link, QR & landing pages"
              body="Share a clean link, print a QR code for the real world, or publish a hosted landing page in a click."
              delay={120}
            />
            <FeatureCard
              kicker="Tracking"
              title="GA4 & Meta pixels"
              body="Fire your GA4 and Meta tracking pixels on view and submit so your funnel data stays honest."
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* ── 5. ANALYTICS — editorial split ───────────────────────────────── */}
      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-14 lg:grid-cols-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <FeatureCard
                kicker="Per question"
                title="Breakdowns that matter"
                body="Choice counts, average ratings and NPS buckets, computed per question, not just a response dump."
                chips={['Choice counts', 'Rating avg', 'NPS buckets']}
                delay={40}
              />
              <FeatureCard
                kicker="Per form"
                title="The view that counts"
                body="See how each form performs on its own page so you know exactly what to fix next."
                delay={120}
              />
            </div>
            <div className="lg:sticky lg:top-28 lg:order-first">
              <SectionHead
                eyebrow="Know what's happening"
                title={
                  <>
                    Analytics that read the <span style={{ color: LIME }}>answers</span>.
                  </>
                }
                lede="Per-form analytics with real per-question breakdowns. Understand why people drop, what they pick and how they rate, without exporting to a spreadsheet."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. INTEGRATIONS & CONTROL ────────────────────────────────────── */}
      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            eyebrow="Wire it into your stack"
            title={<>Connect the tools you already run.</>}
            lede="Push responses where they belong, then keep your forms locked down with access controls that don't need an enterprise plan."
          />

          <div className="mt-14 grid gap-4 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <Bezel className="h-full">
                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">
                  Integrations
                </span>
                <h3 className="mt-3 text-xl font-semibold tracking-tight" style={grotesk}>
                  Native destinations + webhooks
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55">
                  Send submissions straight to the apps you live in, or fire a raw webhook to
                  anything else you can dream up.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['Slack', 'Notion', 'Mailchimp', 'Google Sheets', 'Airtable', 'Webhooks'].map(
                    (name) => (
                      <span
                        key={name}
                        className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[13px] text-white/65"
                      >
                        {name}
                      </span>
                    )
                  )}
                </div>
              </Bezel>
            </Reveal>

            <div className="grid gap-4 lg:col-span-5">
              <FeatureCard
                kicker="Access"
                title="Password protection"
                body="Gate any form behind a password so only the people you invite get in."
                delay={80}
              />
              <FeatureCard
                kicker="Control"
                title="Scheduling & limits"
                body="Open and close forms on a schedule and cap total responses. No more orphaned, over-collecting links."
                delay={160}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ──────────────────────────────────────────────────── */}
      <section className="px-6 pb-32 pt-12">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div
              className="relative overflow-hidden rounded-[2rem] border border-white/10 px-8 py-20 text-center sm:px-16 sm:py-24"
              style={{ backgroundColor: '#131313' }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full opacity-[0.12] blur-[110px]"
                style={{ background: LIME }}
              />
              <div className="relative">
                <Eyebrow>No paywall games</Eyebrow>
                <h2
                  className="mx-auto mt-6 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl"
                  style={grotesk}
                >
                  Every feature on this page.
                  <br />
                  <span style={{ color: LIME }}>One honest price.</span>
                </h2>
                <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-white/55">
                  Stop renting your form logic. Build it once, own it, ship it. Start free and
                  see how far it goes.
                </p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                  <LimeCTA href="/auth/signup">Start building free</LimeCTA>
                  <GhostCTA href="/pricing">Compare the price</GhostCTA>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </BrandShell>
  )
}
