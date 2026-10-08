// Stoneforms' OWN site analytics (GA4) for the marketing pages on
// stoneforms.io. This is NOT the per-form Google Analytics a form owner sets
// up for their own forms: that lives with the form player and is untouched.
//
// Switched on by ONE env var, NEXT_PUBLIC_GA_ID. Unset means no tag and no
// banner. Hosted forms (/f, /p, /embed), the dashboard and onboarding never
// get this tag, and neither does any host other than stoneforms.io, so a
// branded subdomain or custom domain serving a form stays clean.

const MEASUREMENT_ID = /^G-[A-Z0-9]{4,20}$/

export function siteGaId(raw: string | undefined = process.env.NEXT_PUBLIC_GA_ID): string | null {
  const id = raw?.trim()
  return id && MEASUREMENT_ID.test(id) ? id : null
}

const SITE_HOSTS = new Set(['stoneforms.io', 'www.stoneforms.io'])

// Opt-in: only these marketing paths. Everything else is excluded by default,
// so a new product route can never pick up the site tag by accident.
const MARKETING_PREFIXES = ['/features', '/pricing', '/templates', '/blog', '/help', '/contact', '/legal', '/auth']

export function isMarketingPage(host: string, pathname: string): boolean {
  if (!SITE_HOSTS.has(host.toLowerCase())) return false
  if (pathname === '/') return true
  return MARKETING_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

export const CONSENT_KEY = 'stoneforms-site-analytics'
export const CONSENT_EVENT = 'stoneforms:consent'
export type Consent = 'pending' | 'accepted' | 'rejected'

export function readConsent(): Consent {
  if (typeof window === 'undefined') return 'pending'
  try {
    const v = window.localStorage.getItem(CONSENT_KEY)
    return v === 'accepted' || v === 'rejected' ? v : 'pending'
  } catch {
    return 'pending'
  }
}

export function writeConsent(value: Exclude<Consent, 'pending'>): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, value)
  } catch {
    // Storage blocked: the choice holds for this page view only.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }))
}

type Gtag = (...args: unknown[]) => void

/** GA4 recommended lead event. A no-op before consent, because gtag does not exist. */
export function trackLead(formName: string): void {
  if (typeof window === 'undefined') return
  const gtag = (window as unknown as { gtag?: Gtag }).gtag
  if (typeof gtag === 'function') gtag('event', 'generate_lead', { form_name: formName })
}
