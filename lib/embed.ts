// Distribution & embedding helpers.
// Builds the share URLs and the paste-able embed snippets (inline / popup /
// slide-over / iframe) that the dashboard hands to users. The canonical origin
// comes from @/lib/site (NEXT_PUBLIC_SITE_URL → VERCEL_URL → window.origin),
// so a single env var repoints every snippet to the right deploy.

import { getSiteUrl } from '@/lib/site'

export type EmbedMode = 'inline' | 'popup' | 'slider'

// The chrome-less route the iframe / embed.js points at.
export function getEmbedUrl(idOrSlug: string): string {
  return `${getSiteUrl()}/embed/${idOrSlug}`
}

// Public, fully-chromed form page (used for direct links + iframe fallback).
export function getPublicFormUrl(idOrSlug: string): string {
  return `${getSiteUrl()}/f/${idOrSlug}`
}

// URL of the hosted loader script users paste once per page.
export function getEmbedScriptUrl(): string {
  return `${getSiteUrl()}/embed.js`
}

export interface UtmParams {
  source?: string
  medium?: string
  campaign?: string
  term?: string
  content?: string
}

// Append non-empty utm_* params to any URL, preserving existing query string.
export function appendUtm(url: string, utm: UtmParams): string {
  const entries: [string, string | undefined][] = [
    ['utm_source', utm.source],
    ['utm_medium', utm.medium],
    ['utm_campaign', utm.campaign],
    ['utm_term', utm.term],
    ['utm_content', utm.content],
  ]
  const parts = entries
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `${k}=${encodeURIComponent(v!.trim())}`)
  if (!parts.length) return url
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}${parts.join('&')}`
}

// Hosted QR image (no new dependency) for any URL.
export function getQrImageUrl(data: string, size = 300): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`
}

// ---------------------------------------------------------------------------
// Snippet builders. Kept as pure strings so the generator UI can show + copy
// them and a live preview can render the same markup.
// ---------------------------------------------------------------------------

export interface SnippetOptions {
  /** Form id or vanity slug. */
  id: string
  title: string
  /** Origin for the script + iframe src. Defaults to getSiteUrl(). */
  origin?: string
  /** Inline default height (px) before auto-resize kicks in. */
  height?: number
  /** Button label for popup / slider modes. */
  buttonLabel?: string
}

function originOf(opts: SnippetOptions): string {
  return (opts.origin || getSiteUrl()).replace(/\/$/, '')
}

// Plain iframe — works with no JavaScript at all.
export function buildIframeSnippet(opts: SnippetOptions): string {
  const origin = originOf(opts)
  const height = opts.height ?? 600
  return `<!-- Stoneforms — ${opts.title} -->
<iframe
  src="${origin}/embed/${opts.id}"
  width="100%"
  height="${height}"
  frameborder="0"
  style="border:none;border-radius:12px;max-width:100%;"
  title="${escapeAttr(opts.title)}"
  allow="clipboard-write; fullscreen"
></iframe>`
}

// Hosted-script inline embed (auto-height via postMessage).
export function buildInlineSnippet(opts: SnippetOptions): string {
  const origin = originOf(opts)
  const height = opts.height ?? 600
  return `<!-- Stoneforms — ${opts.title} -->
<div data-stoneform="${opts.id}" data-mode="inline" data-height="${height}">
  <noscript>
    <a href="${origin}/f/${opts.id}">Open ${escapeAttr(opts.title)}</a>
  </noscript>
</div>
<script src="${origin}/embed.js" async></script>`
}

// Hosted-script popup (centered modal opened by a button).
export function buildPopupSnippet(opts: SnippetOptions): string {
  const origin = originOf(opts)
  const label = opts.buttonLabel || 'Open form'
  return `<!-- Stoneforms — ${opts.title} -->
<div data-stoneform="${opts.id}" data-mode="popup" data-button="${escapeAttr(label)}">
  <noscript>
    <a href="${origin}/f/${opts.id}">${escapeAttr(label)}</a>
  </noscript>
</div>
<script src="${origin}/embed.js" async></script>`
}

// Hosted-script slide-over (panel slides in from the right).
export function buildSliderSnippet(opts: SnippetOptions): string {
  const origin = originOf(opts)
  const label = opts.buttonLabel || 'Open form'
  return `<!-- Stoneforms — ${opts.title} -->
<div data-stoneform="${opts.id}" data-mode="slider" data-button="${escapeAttr(label)}">
  <noscript>
    <a href="${origin}/f/${opts.id}">${escapeAttr(label)}</a>
  </noscript>
</div>
<script src="${origin}/embed.js" async></script>`
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
