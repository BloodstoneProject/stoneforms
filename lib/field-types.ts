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

export interface FieldTypeMeta {
  value: FieldType
  label: string
  icon: string
  // true when the field needs a list of choices (options[])
  hasOptions: boolean
  // value shape produced by the player for this field
  valueKind: 'string' | 'number' | 'boolean' | 'string[]' | 'object' | 'file' | 'none'
  category: 'text' | 'choice' | 'number' | 'date' | 'media' | 'display'
}

export const FIELD_TYPES: FieldTypeMeta[] = [
  { value: 'short_text', label: 'Short Text', icon: '📝', hasOptions: false, valueKind: 'string', category: 'text' },
  { value: 'long_text', label: 'Long Text', icon: '📄', hasOptions: false, valueKind: 'string', category: 'text' },
  { value: 'email', label: 'Email', icon: '✉️', hasOptions: false, valueKind: 'string', category: 'text' },
  { value: 'phone', label: 'Phone', icon: '📞', hasOptions: false, valueKind: 'string', category: 'text' },
  { value: 'url', label: 'URL', icon: '🔗', hasOptions: false, valueKind: 'string', category: 'text' },
  { value: 'number', label: 'Number', icon: '🔢', hasOptions: false, valueKind: 'number', category: 'number' },
  { value: 'multiple_choice', label: 'Multiple Choice', icon: '☑️', hasOptions: true, valueKind: 'string', category: 'choice' },
  { value: 'picture_choice', label: 'Picture Choice', icon: '🖼️', hasOptions: true, valueKind: 'string', category: 'choice' },
  { value: 'checkboxes', label: 'Checkboxes', icon: '✅', hasOptions: true, valueKind: 'string[]', category: 'choice' },
  { value: 'dropdown', label: 'Dropdown', icon: '▼', hasOptions: true, valueKind: 'string', category: 'choice' },
  { value: 'yes_no', label: 'Yes / No', icon: '🔘', hasOptions: false, valueKind: 'boolean', category: 'choice' },
  { value: 'consent', label: 'Consent (GDPR)', icon: '🛡️', hasOptions: false, valueKind: 'boolean', category: 'choice' },
  { value: 'rating', label: 'Rating', icon: '⭐', hasOptions: false, valueKind: 'number', category: 'number' },
  { value: 'opinion_scale', label: 'Opinion Scale', icon: '📊', hasOptions: false, valueKind: 'number', category: 'number' },
  { value: 'calculator', label: 'Calculator', icon: '🧮', hasOptions: false, valueKind: 'number', category: 'number' },
  { value: 'ranking', label: 'Ranking', icon: '🔢', hasOptions: true, valueKind: 'string[]', category: 'choice' },
  { value: 'date', label: 'Date', icon: '📅', hasOptions: false, valueKind: 'string', category: 'date' },
  { value: 'signature', label: 'Signature', icon: '✍️', hasOptions: false, valueKind: 'string', category: 'media' },
  { value: 'address', label: 'Address', icon: '🏠', hasOptions: false, valueKind: 'object', category: 'text' },
  { value: 'file_upload', label: 'File Upload', icon: '📎', hasOptions: false, valueKind: 'file', category: 'media' },
  { value: 'statement', label: 'Statement', icon: '💬', hasOptions: false, valueKind: 'none', category: 'display' },
  { value: 'hidden', label: 'Hidden Field', icon: '🕵️', hasOptions: false, valueKind: 'string', category: 'display' },
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
