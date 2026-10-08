'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CONSENT_EVENT, isMarketingPage, readConsent, writeConsent, type Consent } from '@/lib/site-analytics'

type Gtag = (...args: unknown[]) => void
type GaWindow = Window & { dataLayer?: unknown[]; gtag?: Gtag; __sfSiteGa?: boolean }

function loadGa(gaId: string) {
  const w = window as GaWindow
  if (w.__sfSiteGa) {
    w.gtag?.('consent', 'update', { analytics_storage: 'granted' })
    return
  }
  w.__sfSiteGa = true
  w.dataLayer = w.dataLayer || []
  w.gtag = function gtag() {
    // gtag must push the arguments object itself.
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments)
  }
  w.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
  })
  w.gtag('consent', 'update', { analytics_storage: 'granted' })
  w.gtag('js', new Date())
  w.gtag('config', gaId, { anonymize_ip: true })
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`
  document.head.appendChild(s)
}

/**
 * Banner + hard-gated GA4 for the marketing pages only. Rendered by the root
 * layout only when NEXT_PUBLIC_GA_ID is set. Once loaded on a marketing page,
 * gtag stays for that tab, but it is never loaded first on a form, embed or
 * dashboard page, and those pages never show the banner.
 */
export default function SiteAnalytics({ gaId }: { gaId: string }) {
  const pathname = usePathname() || '/'
  const [inScope, setInScope] = useState(false)
  const [consent, setConsent] = useState<Consent>('pending')

  useEffect(() => {
    setInScope(isMarketingPage(window.location.hostname, pathname))
  }, [pathname])

  useEffect(() => {
    setConsent(readConsent())
    const onChange = (e: Event) => setConsent((e as CustomEvent<Consent>).detail)
    window.addEventListener(CONSENT_EVENT, onChange)
    return () => window.removeEventListener(CONSENT_EVENT, onChange)
  }, [])

  useEffect(() => {
    if (!inScope) return
    if (consent === 'accepted') loadGa(gaId)
    else if (consent === 'rejected' && (window as GaWindow).__sfSiteGa) {
      ;(window as GaWindow).gtag?.('consent', 'update', { analytics_storage: 'denied' })
    }
  }, [inScope, consent, gaId])

  if (!inScope || consent !== 'pending') return null

  return (
    <div
      role="region"
      aria-label="Cookie choice"
      className="fixed inset-x-3 bottom-3 z-[2147483000] mx-auto max-w-2xl rounded-xl border border-border bg-background p-4 text-foreground shadow-lg sm:inset-x-6 sm:bottom-6 sm:p-5"
    >
      <p className="text-sm text-muted-foreground">
        May we use Google Analytics cookies to see how people find and use stoneforms.io? Nothing
        loads unless you accept.{' '}
        <Link href="/legal/privacy" className="underline hover:text-foreground">
          Privacy policy
        </Link>
      </p>
      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => writeConsent('rejected')}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={() => writeConsent('accepted')}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Accept
        </button>
      </div>
    </div>
  )
}
