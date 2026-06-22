// Canonical field-type registry — the single source of truth shared by the
// builder, the player/renderer, validation, and the DB <-> Question mapper.
// `value` matches form_fields.field_type stored in the database.

export type FieldType =
  | 'short_text'
  | 'long_text'
  | 'email'
  | 'number'
  | 'phone'
  | 'url'
  | 'multiple_choice'
  | 'checkboxes'
  | 'dropdown'
  | 'yes_no'
  | 'rating'
  | 'opinion_scale'
  | 'ranking'
  | 'date'
  | 'file_upload'
  | 'statement'
  | 'hidden'
  | 'picture_choice'
  | 'signature'
  | 'address'
  | 'consent'
  | 'calculator'
  | 'payment'
  | 'page_break'
  // ---- Content blocks (non-input, presentational/structural) ----
  // These collect NO answer; their content lives in form_fields.settings.
  // See lib/blocks.ts for the canonical settings shapes.
  | 'heading'
  | 'text_block'
  | 'image'
  | 'video'
  | 'embed'
  | 'html'
  | 'divider'
  | 'spacer'
  | 'quote'
  | 'button'
  | 'section'

export interface FieldTypeMeta {
  value: FieldType
  label: string
  icon: string
  // true when the field needs a list of choices (options[])
  hasOptions: boolean
  // value shape produced by the player for this field
  valueKind: 'string' | 'number' | 'boolean' | 'string[]' | 'object' | 'file' | 'none'
  category: 'text' | 'choice' | 'number' | 'date' | 'media' | 'display' | 'payment' | 'content' | 'layout'
  // true when the block collects an answer (a real question); false for
  // presentational/structural content blocks (heading, image, divider, …) and
  // the legacy non-input display types (statement, page_break).
  // The single source of truth used by validation/scoring/calc to skip blocks
  // that have no answer. See isInputField() / isContentBlock() below.
  input: boolean
}

export const FIELD_TYPES: FieldTypeMeta[] = [
  // ---- Input blocks (real questions; collect an answer) ----
  { value: 'short_text', label: 'Short Text', icon: '📝', hasOptions: false, valueKind: 'string', category: 'text', input: true },
  { value: 'long_text', label: 'Long Text', icon: '📄', hasOptions: false, valueKind: 'string', category: 'text', input: true },
  { value: 'email', label: 'Email', icon: '✉️', hasOptions: false, valueKind: 'string', category: 'text', input: true },
  { value: 'phone', label: 'Phone', icon: '📞', hasOptions: false, valueKind: 'string', category: 'text', input: true },
  { value: 'url', label: 'URL', icon: '🔗', hasOptions: false, valueKind: 'string', category: 'text', input: true },
  { value: 'number', label: 'Number', icon: '🔢', hasOptions: false, valueKind: 'number', category: 'number', input: true },
  { value: 'multiple_choice', label: 'Multiple Choice', icon: '☑️', hasOptions: true, valueKind: 'string', category: 'choice', input: true },
  { value: 'picture_choice', label: 'Picture Choice', icon: '🖼️', hasOptions: true, valueKind: 'string', category: 'choice', input: true },
  { value: 'checkboxes', label: 'Checkboxes', icon: '✅', hasOptions: true, valueKind: 'string[]', category: 'choice', input: true },
  { value: 'dropdown', label: 'Dropdown', icon: '▼', hasOptions: true, valueKind: 'string', category: 'choice', input: true },
  { value: 'yes_no', label: 'Yes / No', icon: '🔘', hasOptions: false, valueKind: 'boolean', category: 'choice', input: true },
  { value: 'consent', label: 'Consent (GDPR)', icon: '🛡️', hasOptions: false, valueKind: 'boolean', category: 'choice', input: true },
  { value: 'rating', label: 'Rating', icon: '⭐', hasOptions: false, valueKind: 'number', category: 'number', input: true },
  { value: 'opinion_scale', label: 'Opinion Scale', icon: '📊', hasOptions: false, valueKind: 'number', category: 'number', input: true },
  { value: 'calculator', label: 'Calculator', icon: '🧮', hasOptions: false, valueKind: 'number', category: 'number', input: true },
  { value: 'ranking', label: 'Ranking', icon: '🔢', hasOptions: true, valueKind: 'string[]', category: 'choice', input: true },
  { value: 'date', label: 'Date', icon: '📅', hasOptions: false, valueKind: 'string', category: 'date', input: true },
  { value: 'signature', label: 'Signature', icon: '✍️', hasOptions: false, valueKind: 'string', category: 'media', input: true },
  { value: 'address', label: 'Address', icon: '🏠', hasOptions: false, valueKind: 'object', category: 'text', input: true },
  { value: 'file_upload', label: 'File Upload', icon: '📎', hasOptions: false, valueKind: 'file', category: 'media', input: true },
  { value: 'payment', label: 'Payment', icon: '💳', hasOptions: false, valueKind: 'none', category: 'payment', input: true },
  // hidden carries a tracking value into responses, so it counts as input.
  { value: 'hidden', label: 'Hidden Field', icon: '🕵️', hasOptions: false, valueKind: 'string', category: 'display', input: true },
  // ---- Legacy non-input display types (collect no answer) ----
  { value: 'statement', label: 'Statement', icon: '💬', hasOptions: false, valueKind: 'none', category: 'display', input: false },
  { value: 'page_break', label: 'Page Break', icon: '🔀', hasOptions: false, valueKind: 'none', category: 'display', input: false },
  // ---- Content blocks (non-input; content lives in settings, see lib/blocks.ts) ----
  { value: 'heading', label: 'Heading', icon: '🔠', hasOptions: false, valueKind: 'none', category: 'content', input: false },
  { value: 'text_block', label: 'Text', icon: '📃', hasOptions: false, valueKind: 'none', category: 'content', input: false },
  { value: 'image', label: 'Image', icon: '🖼️', hasOptions: false, valueKind: 'none', category: 'content', input: false },
  { value: 'video', label: 'Video', icon: '🎬', hasOptions: false, valueKind: 'none', category: 'content', input: false },
  { value: 'embed', label: 'Embed', icon: '🧩', hasOptions: false, valueKind: 'none', category: 'content', input: false },
  { value: 'html', label: 'Custom HTML', icon: '⟨⟩', hasOptions: false, valueKind: 'none', category: 'content', input: false },
  { value: 'quote', label: 'Quote', icon: '❝', hasOptions: false, valueKind: 'none', category: 'content', input: false },
  { value: 'button', label: 'Button', icon: '🔲', hasOptions: false, valueKind: 'none', category: 'content', input: false },
  { value: 'divider', label: 'Divider', icon: '➖', hasOptions: false, valueKind: 'none', category: 'layout', input: false },
  { value: 'spacer', label: 'Spacer', icon: '↕️', hasOptions: false, valueKind: 'none', category: 'layout', input: false },
  { value: 'section', label: 'Section', icon: '🗂️', hasOptions: false, valueKind: 'none', category: 'layout', input: false },
]

const BY_VALUE: Record<string, FieldTypeMeta> = Object.fromEntries(
  FIELD_TYPES.map((f) => [f.value, f])
)

export function getFieldMeta(type: string): FieldTypeMeta | undefined {
  return BY_VALUE[type]
}

export function fieldHasOptions(type: string): boolean {
  return BY_VALUE[type]?.hasOptions ?? false
}

export function isKnownFieldType(type: string): type is FieldType {
  return type in BY_VALUE
}

// The set of content-block types: known, non-input, presentational/structural
// blocks introduced for the block-based content system. This deliberately
// EXCLUDES the legacy non-input display types (statement, page_break) and the
// input-but-non-visible `hidden` type — those predate the content system and
// are handled by their own player/submit paths. Membership is the canonical
// "is this one of the new presentational blocks?" check.
export const CONTENT_BLOCK_TYPES = [
  'heading',
  'text_block',
  'image',
  'video',
  'embed',
  'html',
  'divider',
  'spacer',
  'quote',
  'button',
  'section',
] as const

export type ContentBlockType = (typeof CONTENT_BLOCK_TYPES)[number]

const CONTENT_BLOCK_SET: Set<string> = new Set(CONTENT_BLOCK_TYPES)

// True when a block collects an answer (a real question). Unknown/custom types
// default to true (treated as input) so a new question type is never silently
// dropped from validation. Only types explicitly flagged `input: false` are
// non-input.
export function isInputField(type: string): boolean {
  return BY_VALUE[type]?.input !== false
}

// True only for the new presentational content blocks (heading, text_block,
// image, video, embed, html, divider, spacer, quote, button, section).
// statement / page_break / hidden are intentionally NOT content blocks.
export function isContentBlock(type: string): boolean {
  return CONTENT_BLOCK_SET.has(type)
}
