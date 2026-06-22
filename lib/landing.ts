// ============================================================================
// LANDING CONFIG — hosted public landing pages for forms (/p/{slug})
// ============================================================================
//
// Clients without a website get a hosted landing page per form at `/p/{slug}`:
// a logo + headline + subheadline + background, with the published form embedded
// beneath it. Stored on the NEW `public.forms.landing` (jsonb) column.
//
// DESIGN: simple now, extensible later. The config starts as a hero + the form,
// but carries an optional `sections: Block[]` array that REUSES the exact same
// block `settings` shapes from lib/blocks.ts. This means the landing page can
// grow into a full section builder later without changing the data model — it
// converges with the form block system.
//
// RESOLUTION: `resolveFormForLanding(slugOrId)` is the SINGLE place that turns a
// `/p/{slug}` path segment into a form row. It mirrors the public form API's
// UUID-or-slug logic. A future custom-domain layer maps a domain -> slug and
// then calls this same helper — no rework needed.
// ============================================================================

import type { BlockSettingsMap } from './blocks'
import type { ContentBlockType } from './field-types'

// ----------------------------------------------------------------------------
// A landing "section" block — same shape family as form content blocks. We keep
// the union open via `type: string` + `settings` so it stays forward-compatible
// with new block types, while the known shapes come from BlockSettingsMap.
// ----------------------------------------------------------------------------
export interface LandingBlock {
  id?: string
  type: ContentBlockType | string
  settings: Partial<BlockSettingsMap[ContentBlockType]> & Record<string, any>
}

export type LandingTheme = 'auto' | 'light' | 'dark'

export interface LandingConfig {
  // Master switch. When false, /p/{slug} shows a tasteful "not published" notice.
  enabled: boolean
  logoUrl?: string
  headline?: string
  subheadline?: string
  // Hero background. `backgroundColor` is a solid colour (hex). When
  // `backgroundImageUrl` is set it wins and is rendered as a cover image.
  backgroundColor?: string
  backgroundImageUrl?: string
  // Optional hint for hero text contrast / chrome. 'auto' lets the renderer
  // pick from the background colour.
  theme?: LandingTheme
  // Optional extra content blocks rendered above the form (future richness).
  sections?: LandingBlock[]
}

// Field caps to keep stored config sane and the page fast/safe.
export const LANDING_LIMITS = {
  headline: 160,
  subheadline: 320,
  url: 2048,
  color: 32,
  sections: 30,
} as const

export function defaultLanding(): LandingConfig {
  return {
    enabled: false,
    logoUrl: '',
    headline: '',
    subheadline: '',
    backgroundColor: '',
    backgroundImageUrl: '',
    theme: 'auto',
    sections: [],
  }
}

// Coerce an arbitrary stored jsonb value into a safe, fully-populated config.
export function normalizeLanding(raw: any): LandingConfig {
  const d = defaultLanding()
  if (!raw || typeof raw !== 'object') return d

  const str = (v: any, cap: number) =>
    typeof v === 'string' ? v.slice(0, cap) : undefined

  const sections = Array.isArray(raw.sections)
    ? raw.sections
        .slice(0, LANDING_LIMITS.sections)
        .filter((b: any) => b && typeof b === 'object' && typeof b.type === 'string')
        .map((b: any) => ({
          id: typeof b.id === 'string' ? b.id : undefined,
          type: String(b.type),
          settings: b.settings && typeof b.settings === 'object' ? b.settings : {},
        }))
    : []

  return {
    enabled: raw.enabled === true,
    logoUrl: str(raw.logoUrl, LANDING_LIMITS.url) ?? '',
    headline: str(raw.headline, LANDING_LIMITS.headline) ?? '',
    subheadline: str(raw.subheadline, LANDING_LIMITS.subheadline) ?? '',
    backgroundColor: str(raw.backgroundColor, LANDING_LIMITS.color) ?? '',
    backgroundImageUrl: str(raw.backgroundImageUrl, LANDING_LIMITS.url) ?? '',
    theme: (['auto', 'light', 'dark'].includes(raw.theme) ? raw.theme : 'auto') as LandingTheme,
    sections,
  }
}

// Sanitize+cap an incoming PUT payload before persisting. Mirrors normalize but
// is intended for write-side validation (drops unknown keys, enforces caps).
export function sanitizeLandingInput(raw: any): LandingConfig {
  return normalizeLanding(raw)
}
