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
import Script from 'next/script'
import { resolveFormForLanding } from '@/lib/landing-server'
import { normalizeTheme, fontStack, googleFontHref } from '@/lib/themes'
import { getSiteUrl } from '@/lib/site'
import LandingHero from '@/components/landing/LandingHero'
import LandingSections from '@/components/landing/LandingSections'
import LandingEmbed from '@/components/landing/LandingEmbed'

interface LandingTracking { ga4MeasurementId?: string; metaPixelId?: string }

function readLandingTracking(settings: Record<string, any> | undefined): LandingTracking {
  const t = settings?.tracking
  if (!t || typeof t !== 'object') return {}
  return {
    ga4MeasurementId: typeof t.ga4MeasurementId === 'string' && t.ga4MeasurementId.trim() ? t.ga4MeasurementId.trim() : undefined,
    metaPixelId: typeof t.metaPixelId === 'string' && t.metaPixelId.trim() ? t.metaPixelId.trim() : undefined,
  }
}

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
  // Per-form OG/meta overrides (settings.metaTitle/metaDescription) win, then the
  // landing copy, then the form's own title/description.
  const settings = resolved.settings || {}
  const metaTitle = typeof settings.metaTitle === 'string' && settings.metaTitle.trim() ? settings.metaTitle.trim() : undefined
  const metaDescription = typeof settings.metaDescription === 'string' && settings.metaDescription.trim() ? settings.metaDescription.trim() : undefined
  const title = metaTitle || resolved.landing.headline?.trim() || resolved.title
  const description = metaDescription || resolved.landing.subheadline?.trim() || resolved.description
  const theme = normalizeTheme(resolved.theme)
  return {
    title,
    description,
    icons: theme.faviconUrl ? { icon: theme.faviconUrl } : undefined,
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
  const tracking = readLandingTracking(resolved.settings)

  // Embed the existing chrome-less form via /embed/{slug} so we never touch the
  // player. Prefer slug for stable, shareable URLs; fall back to id.
  const embedRef = resolved.slug || resolved.id
  const embedSrc = `${getSiteUrl()}/embed/${embedRef}`

  return (
    <>
      {/* Client-branded font (loaded for the public page, independent of app chrome). */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href={googleFontHref(theme.font)} rel="stylesheet" />

      {/* Author-supplied custom CSS (advanced; sanitised downstream). */}
      {theme.customCss && (
        // eslint-disable-next-line react/no-danger
        <style dangerouslySetInnerHTML={{ __html: theme.customCss }} />
      )}

      {/* Tracking: GA4 (gtag.js) + Meta Pixel. Render nothing unless configured. */}
      {tracking.ga4MeasurementId && (
        <>
          <Script id="sf-ga4-src" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${tracking.ga4MeasurementId}`} />
          <Script id="sf-ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${tracking.ga4MeasurementId}');`}
          </Script>
        </>
      )}
      {tracking.metaPixelId && (
        <Script id="sf-meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${tracking.metaPixelId}');fbq('track','PageView');`}
        </Script>
      )}
      <main
        className="min-h-screen w-full bg-white"
        style={{
          fontFamily: fontStack(theme.font),
          color: theme.colors.text,
          backgroundColor: theme.colors.background,
        }}
      >
        <LandingHero landing={landing} theme={theme} fallbackTitle={resolved.title} />

        <LandingSections sections={landing.sections || []} accent={accent} theme={theme} />

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
            className="inline-block rounded px-2 py-1 text-xs opacity-50 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ color: theme.colors.text }}
          >
            Powered by Stoneforms
          </a>
        </footer>
      </main>
    </>
  )
}
