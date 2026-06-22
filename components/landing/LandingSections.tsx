// Optional extra content blocks rendered above the embedded form on /p/{slug}.
//
// Rendering is delegated to the shared player ContentBlock so that EVERY block
// type (heading, text_block, image, quote, button, divider, spacer, and any new
// media blocks like cover_image / testimonial / logo_strip / logo added to
// lib/blocks.ts) renders with the exact same look as inside a form — no per-type
// code to maintain here. Each landing section `{ type, settings }` is mapped to
// the Question-like shape ContentBlock expects (`{ type, properties }`) and
// rendered in the form's theme, with the landing accent applied to the
// primary/button colours so CTAs/quotes pick up the page accent.
import ContentBlock from '@/components/player/ContentBlock'
import { normalizeTheme, type FormTheme } from '@/lib/themes'
import type { Question } from '@/types'
import type { LandingBlock } from '@/lib/landing'

export default function LandingSections({
  sections,
  accent,
  theme,
}: {
  sections: LandingBlock[]
  accent: string
  // The form/landing theme. Optional for backward-compat; falls back to a
  // normalized default tinted with the accent.
  theme?: FormTheme
}) {
  if (!sections?.length) return null

  const base = theme || normalizeTheme(null)
  // Tint the theme with the landing accent so buttons/quotes use the page accent.
  const sectionTheme: FormTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: accent || base.colors.primary,
      button: accent || base.colors.button,
    },
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 space-y-6">
      {sections.map((b, i) => {
        const block = {
          id: b.id || `section-${i}`,
          type: b.type,
          label: '',
          properties: b.settings || {},
        } as unknown as Question
        return <ContentBlock key={b.id || i} block={block} theme={sectionTheme} />
      })}
    </div>
  )
}
