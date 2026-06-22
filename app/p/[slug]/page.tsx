// ============================================================================
// /p/{slug} — the hosted public landing page for a form.
// ============================================================================
// For clients without a website: logo + headline + subheadline + background +
// the published form (embedded chrome-lessly via /embed/{slug}). Rendered in the
// CLIENT's branding (form theme + landing colours), NOT the app's dark chrome.
//
// Resolution is centralized in resolveFormForLanding() so a future custom-domain
// layer (domain -> slug) reuses it with zero rework. Loads with the anon server
// client honouring RLS (published forms are publicly readable).
// ============================================================================
import type { Metadata } from 'next'
import { resolveFormForLanding } from '@/lib/landing-server'
import { normalizeTheme, fontStack, googleFontHref } from '@/lib/themes'
import { getSiteUrl } from '@/lib/site'
import LandingHero from '@/components/landing/LandingHero'
import LandingSections from '@/components/landing/LandingSections'
import LandingEmbed from '@/components/landing/LandingEmbed'

// Always render fresh from the DB (config + publish state can change).
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const resolved = await resolveFormForLanding(params.slug)
  if (!resolved || !resolved.landing.enabled) {
    return { title: 'Form', robots: { index: false } }
  }
  const title = resolved.landing.headline?.trim() || resolved.title
  const description = resolved.landing.subheadline?.trim() || resolved.description
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: resolved.landing.backgroundImageUrl
        ? [resolved.landing.backgroundImageUrl]
        : undefined,
    },
  }
}

function Fallback({ message }: { message: string }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50 px-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          This page isn’t available
        </h1>
        <p className="mt-3 text-neutral-600">{message}</p>
      </div>
    </main>
  )
}

export default async function LandingPage({
  params,
}: {
  params: { slug: string }
}) {
  const resolved = await resolveFormForLanding(params.slug)

  if (!resolved) {
    return <Fallback message="This form may have been unpublished or removed." />
  }
  if (!resolved.landing.enabled) {
    return (
      <Fallback message="The landing page for this form hasn’t been turned on yet." />
    )
  }

  const theme = normalizeTheme(resolved.theme)
  const landing = resolved.landing
  const accent = landing.backgroundColor?.trim() || theme.colors.primary

  // Embed the existing chrome-less form via /embed/{slug} so we never touch the
  // player. Prefer slug for stable, shareable URLs; fall back to id.
  const embedRef = resolved.slug || resolved.id
  const embedSrc = `${getSiteUrl()}/embed/${embedRef}`

  return (
    <>
      {/* Client-branded font (loaded for the public page, independent of app chrome). */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href={googleFontHref(theme.font)} rel="stylesheet" />
      <main
        className="min-h-screen w-full bg-white"
        style={{
          fontFamily: fontStack(theme.font),
          color: theme.colors.text,
          backgroundColor: theme.colors.background,
        }}
      >
        <LandingHero landing={landing} theme={theme} fallbackTitle={resolved.title} />

        <LandingSections sections={landing.sections || []} accent={accent} />

        <section className="mx-auto max-w-2xl px-4 sm:px-6 pb-16 -mt-4">
          <div
            className="rounded-2xl overflow-hidden border bg-white shadow-sm"
            style={{ borderColor: 'rgba(15,23,42,0.08)' }}
          >
            <LandingEmbed src={embedSrc} formRef={embedRef} title={resolved.title} />
          </div>
        </section>

        <footer className="pb-10 text-center">
          <a
            href={getSiteUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs opacity-50 hover:opacity-80 transition-opacity"
            style={{ color: theme.colors.text }}
          >
            Powered by Stoneforms
          </a>
        </footer>
      </main>
    </>
  )
}
