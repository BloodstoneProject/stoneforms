// Single source of truth for the app's public base URL.
// Order of precedence:
//   1. NEXT_PUBLIC_SITE_URL (explicit, set in env)
//   2. VERCEL_URL (auto-set on Vercel deployments)
//   3. window.location.origin (browser fallback)
//   4. localhost dev default

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')

  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL
  if (vercel) return `https://${vercel.replace(/\/$/, '')}`

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }

  return 'http://localhost:3000'
}

// Public URL for a published form.
export function getFormUrl(formId: string): string {
  return `${getSiteUrl()}/f/${formId}`
}
