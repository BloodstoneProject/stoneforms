// ============================================================================
// BLOCK ARCHITECTURE — the canonical contract for the block-based content system
// ============================================================================
//
// THE BLOCK MODEL
// ---------------
// A form is an ordered list of BLOCKS. Every block (question OR content) is a
// row in the existing `form_fields` table:
//   - field_type : free-text string (no DB constraint; new types insert fine)
//   - position   : integer; THE ordering of the whole form, questions + content
//   - settings   : JSONB; per-block config. Content blocks store ALL their
//                  presentational content here.
//
// There are two kinds of block, distinguished by the `input` flag in
// lib/field-types.ts (see isInputField / isContentBlock):
//
//   INPUT blocks  (input: true)  — real questions. They collect an answer that
//                                  ends up in submissions.answers, and they
//                                  participate in required-validation, quiz
//                                  scoring and calculator recompute.
//   CONTENT blocks (input: false) — presentational / structural. They collect
//                                  NO answer. They render content read from
//                                  `settings`. They are NEVER required, scored,
//                                  or expected to have a response.
//
// HOW POSITIONS INTERLEAVE
// ------------------------
// Content blocks and questions share one ordered list. A form might be:
//   position 0: heading      (content)
//   position 1: text_block   (content)
//   position 2: email        (input — question)
//   position 3: divider      (content)
//   position 4: multiple_choice (input — question)
// The player walks `form_fields` ordered by `position` and renders each block
// according to its type. Content blocks are skipped by validation/scoring/calc
// purely via the `input` flag — never by hard-coding their type names.
//
// PRESENTATION MODE
// -----------------
// `forms.settings.presentation` selects a RENDERER over this same block list.
// It is NOT a separate data model — every mode reads the identical blocks:
//   'conversational' (default) — one block per screen, Typeform-style.
//   'classic'                  — all blocks on one scrolling page.
//   'magazine'                 — editorial layout; `section` blocks act as
//                                spread / page boundaries.
//
// SECURITY: the `html` block
// --------------------------
// The `html` block's `settings.html` is arbitrary author-supplied markup. It
// MUST be rendered SANDBOXED — the player puts it inside a sandboxed <iframe>
// (e.g. `sandbox` without allow-same-origin, srcDoc-injected). It MUST NEVER be
// injected into the parent document (no dangerouslySetInnerHTML into the form
// DOM), because that would allow author HTML/JS to run in the form's origin and
// read other respondents' answers. Treat every other URL/text field as
// untrusted too, but `html` is the one that is explicitly raw markup.
// ============================================================================

import {
  CONTENT_BLOCK_TYPES,
  type ContentBlockType,
  isContentBlock,
} from './field-types'

// Re-export so consumers can import the content-block identity helpers straight
// from the block contract module.
export { CONTENT_BLOCK_TYPES, isContentBlock }
export type { ContentBlockType }

// ----------------------------------------------------------------------------
// Shared primitives
// ----------------------------------------------------------------------------

export type BlockAlign = 'left' | 'center' | 'right'
export type HeadingLevel = 1 | 2 | 3
export type ImageWidth = 'sm' | 'md' | 'lg' | 'full'
export type SpacerSize = 'sm' | 'md' | 'lg'
export type ButtonStyle = 'primary' | 'secondary'

// ----------------------------------------------------------------------------
// Per-block `settings` shapes (the EXACT keys other agents read/write)
// ----------------------------------------------------------------------------

export interface HeadingBlockSettings {
  text: string
  level?: HeadingLevel // default 2
  align?: BlockAlign // default 'left'
}

export interface TextBlockSettings {
  // Plain text or LIGHT markdown only (bold **x**, italic *x*, links [t](url),
  // line breaks). The player is responsible for safe rendering — render via a
  // minimal markdown-to-safe-React path, NOT raw HTML injection. Do not put raw
  // HTML here; use the `html` block (sandboxed) for that.
  text: string
  align?: BlockAlign // default 'left'
}

export interface ImageBlockSettings {
  url: string
  alt?: string
  align?: BlockAlign // default 'center'
  width?: ImageWidth // default 'md'
  caption?: string
}

export interface VideoBlockSettings {
  // YouTube, Vimeo or direct .mp4 URL. Provider detection / embed lives in the
  // player.
  url: string
  caption?: string
}

export interface EmbedBlockSettings {
  // Generic iframe / oEmbed target. Rendered in an iframe by the player.
  url: string
  height?: number // px; default 400
}

export interface HtmlBlockSettings {
  // Arbitrary author markup. MUST be rendered SANDBOXED (see file header).
  html: string
}

export interface DividerBlockSettings {
  // Intentionally empty — a horizontal rule.
}

export interface SpacerBlockSettings {
  size?: SpacerSize // default 'md'
}

export interface QuoteBlockSettings {
  text: string
  author?: string
  role?: string
}

export interface ButtonBlockSettings {
  label: string
  url: string
  style?: ButtonStyle // default 'primary'
}

export interface SectionBlockSettings {
  // A grouping / page boundary. Presentation modes MAY treat it as a spread or
  // page break ('magazine' especially).
  title?: string
  description?: string
}

// A discriminated-union-friendly map from block type to its settings shape.
export interface BlockSettingsMap {
  heading: HeadingBlockSettings
  text_block: TextBlockSettings
  image: ImageBlockSettings
  video: VideoBlockSettings
  embed: EmbedBlockSettings
  html: HtmlBlockSettings
  divider: DividerBlockSettings
  spacer: SpacerBlockSettings
  quote: QuoteBlockSettings
  button: ButtonBlockSettings
  section: SectionBlockSettings
}

export type AnyBlockSettings = BlockSettingsMap[ContentBlockType]

// ----------------------------------------------------------------------------
// Default settings factory — used by the builder when a content block is added.
// ----------------------------------------------------------------------------

const DEFAULTS: { [K in ContentBlockType]: () => BlockSettingsMap[K] } = {
  heading: () => ({ text: 'Heading', level: 2, align: 'left' }),
  text_block: () => ({ text: '', align: 'left' }),
  image: () => ({ url: '', alt: '', align: 'center', width: 'md' }),
  video: () => ({ url: '' }),
  embed: () => ({ url: '', height: 400 }),
  html: () => ({ html: '' }),
  divider: () => ({}),
  spacer: () => ({ size: 'md' }),
  quote: () => ({ text: '' }),
  button: () => ({ label: 'Button', url: '', style: 'primary' }),
  section: () => ({ title: '', description: '' }),
}

// Returns a fresh default settings object for a content-block type, or {} when
// the type is not a known content block (caller-safe).
export function defaultBlockSettings<K extends ContentBlockType>(type: K): BlockSettingsMap[K]
export function defaultBlockSettings(type: string): AnyBlockSettings | Record<string, never>
export function defaultBlockSettings(type: string): any {
  const make = (DEFAULTS as Record<string, () => any>)[type]
  return make ? make() : {}
}

// ----------------------------------------------------------------------------
// BLOCK_LIBRARY — describes each content block for the builder's "add block" menu.
// ----------------------------------------------------------------------------

export type BlockGroup = 'content' | 'media' | 'layout'

export interface BlockLibraryEntry {
  type: ContentBlockType
  label: string
  // lucide-react icon name (the builder maps name -> component; matches the
  // icons wired in components/forms/QuestionsList.tsx).
  icon: string
  group: BlockGroup
  description: string
}

export const BLOCK_LIBRARY: BlockLibraryEntry[] = [
  { type: 'heading', label: 'Heading', icon: 'Heading', group: 'content', description: 'A section title or headline.' },
  { type: 'text_block', label: 'Text', icon: 'AlignLeft', group: 'content', description: 'A paragraph of text or light markdown.' },
  { type: 'quote', label: 'Quote', icon: 'Quote', group: 'content', description: 'A pull quote with optional attribution.' },
  { type: 'button', label: 'Button', icon: 'MousePointerClick', group: 'content', description: 'A link styled as a call-to-action button.' },
  { type: 'image', label: 'Image', icon: 'Image', group: 'media', description: 'An image with optional caption.' },
  { type: 'video', label: 'Video', icon: 'Video', group: 'media', description: 'A YouTube, Vimeo or MP4 video.' },
  { type: 'embed', label: 'Embed', icon: 'AppWindow', group: 'media', description: 'Embed an external page or widget via iframe.' },
  { type: 'html', label: 'Custom HTML', icon: 'Code2', group: 'media', description: 'Custom HTML, rendered sandboxed.' },
  { type: 'divider', label: 'Divider', icon: 'Minus', group: 'layout', description: 'A horizontal rule between blocks.' },
  { type: 'spacer', label: 'Spacer', icon: 'MoveVertical', group: 'layout', description: 'Vertical empty space.' },
  { type: 'section', label: 'Section', icon: 'LayoutGrid', group: 'layout', description: 'A grouping / page boundary.' },
]

// ----------------------------------------------------------------------------
// Presentation mode
// ----------------------------------------------------------------------------

export const PRESENTATION_MODES = ['conversational', 'classic', 'magazine'] as const
export type PresentationMode = (typeof PRESENTATION_MODES)[number]
export const DEFAULT_PRESENTATION: PresentationMode = 'conversational'

// Reads the presentation mode from a form (form.settings.presentation),
// falling back to the default for missing/invalid values. Accepts either a full
// form object or a bare settings object.
export function getPresentation(form: any): PresentationMode {
  const settings = form?.settings ?? form ?? {}
  const mode = settings?.presentation
  return (PRESENTATION_MODES as readonly string[]).includes(mode)
    ? (mode as PresentationMode)
    : DEFAULT_PRESENTATION
}
