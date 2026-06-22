// Public hero for the hosted landing page (/p/{slug}). Rendered in the CLIENT's
// branding (form theme + landing colours) — NOT the app's dark-mode chrome.
// Server component (no interactivity); pure presentational.
import type { CSSProperties } from 'react'
import type { LandingConfig } from '@/lib/landing'
import type { FormTheme } from '@/lib/themes'

function isDarkHex(hex?: string): boolean {
  if (!hex || !/^#?[0-9a-fA-F]{6}$/.test(hex.replace('#', ''))) return false
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  // Perceived luminance.
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5
}

export default function LandingHero({
  landing,
  theme,
  fallbackTitle,
}: {
  landing: LandingConfig
  theme: FormTheme
  fallbackTitle: string
}) {
  const headline = landing.headline?.trim() || fallbackTitle
  const sub = landing.subheadline?.trim()

  // Decide hero background + text contrast.
  const bgColor = landing.backgroundColor?.trim() || theme.colors.primary
  const hasImage = !!landing.backgroundImageUrl?.trim()
  const dark =
    landing.theme === 'dark'
      ? true
      : landing.theme === 'light'
      ? false
      : hasImage || isDarkHex(bgColor)

  const fg = dark ? '#ffffff' : '#0f172a'
  const muted = dark ? 'rgba(255,255,255,0.82)' : 'rgba(15,23,42,0.7)'

  const bgStyle: CSSProperties = hasImage
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.32), rgba(0,0,0,0.5)), url("${landing.backgroundImageUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : { backgroundColor: bgColor }

  return (
    <header
      style={bgStyle}
      className="relative w-full px-6 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-2xl text-center">
        {landing.logoUrl?.trim() ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={landing.logoUrl}
            alt=""
            className="mx-auto mb-8 h-14 w-auto object-contain"
          />
        ) : null}

        <h1
          className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.1]"
          style={{ color: fg }}
        >
          {headline}
        </h1>

        {sub ? (
          <p
            className="mt-5 text-base sm:text-lg leading-relaxed"
            style={{ color: muted }}
          >
            {sub}
          </p>
        ) : null}
      </div>
    </header>
  )
}
