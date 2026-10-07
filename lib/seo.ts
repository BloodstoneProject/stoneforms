import type { Metadata } from 'next'

// Canonical origin for the marketing site. Hard-coded on purpose: canonicals,
// the sitemap and robots.txt must never point at a preview or *.vercel.app
// host, and vercel.json still sets NEXT_PUBLIC_SITE_URL to stoneforms.vercel.app.
export const SITE_URL = 'https://stoneforms.io'
export const SITE_NAME = 'Stoneforms'

export const DEFAULT_DESCRIPTION =
  'A form builder with logic, answer recall, variables and 25+ field types on every plan, including Free. Build conversational forms, quizzes and surveys and embed them anywhere.'

// Per-page metadata with a self-referencing canonical and matching OG/Twitter.
export function pageMetadata(opts: {
  title: string
  description: string
  path: string
  noindex?: boolean
}): Metadata {
  const url = `${SITE_URL}${opts.path === '/' ? '' : opts.path}`
  return {
    title: opts.title,
    description: opts.description,
    // A noindex page gets no canonical: a section layout's canonical would
    // otherwise be inherited by every child route (e.g. /auth/login).
    ...(opts.noindex ? {} : { alternates: { canonical: url } }),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      url,
      title: opts.title,
      description: opts.description,
      locale: 'en_GB',
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
    },
    ...(opts.noindex ? { robots: { index: false, follow: true } } : {}),
  }
}
