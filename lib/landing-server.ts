// Server-only landing helpers. Kept separate from lib/landing.ts so the pure
// config types/normalizers there stay importable by client components (the
// landing editor) without pulling in next/headers via the server Supabase client.
import { createServerSupabaseClient } from './supabase-server'
import { normalizeLanding, type LandingConfig } from './landing'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export interface ResolvedLandingForm {
  id: string
  title: string
  description?: string
  slug?: string
  theme: any
  settings: Record<string, any>
  landing: LandingConfig
}

// SINGLE place that turns a slug-or-id into a published form + its landing
// config. A future custom-domain layer maps domain -> slug then calls this, so
// resolution logic never has to be duplicated.
export async function resolveFormForLanding(
  slugOrId: string
): Promise<ResolvedLandingForm | null> {
  if (!slugOrId) return null
  const supabase = createServerSupabaseClient()

  let query = supabase
    .from('forms')
    .select('id, title, description, slug, theme, settings, landing, status')
    .eq('status', 'published')

  if (UUID_RE.test(slugOrId)) {
    query = query.eq('id', slugOrId)
  } else {
    // Vanity slug — unique index is on lower(slug); match case-insensitively.
    query = query.ilike('slug', slugOrId)
  }

  const { data, error } = await query.single()
  if (error || !data) return null

  const row = data as any
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    slug: row.slug ?? undefined,
    theme: row.theme,
    settings: row.settings || {},
    landing: normalizeLanding(row.landing),
  }
}
