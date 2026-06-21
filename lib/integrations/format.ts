// Shared helpers for turning (fields, responses) into readable label -> value
// pairs that integrations can map into Slack messages, Notion properties and
// Mailchimp merge fields. Defensive: handles strings, numbers, booleans, arrays
// and address/signature objects, and skips non-answer field types.

export interface FieldLike {
  id: string
  field_type?: string
  label?: string
}

export interface AnswerPair {
  fieldId: string
  fieldType: string
  label: string
  value: string
}

// Field types that never carry a respondent answer worth forwarding.
const SKIP_TYPES = new Set(['hidden', 'statement'])

// Turn an arbitrary response value into a readable single-line-ish string.
export function stringifyValue(value: any, fieldType?: string): string {
  if (value === undefined || value === null) return ''

  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string') return value

  if (Array.isArray(value)) {
    return value.map((v) => stringifyValue(v)).filter(Boolean).join(', ')
  }

  if (typeof value === 'object') {
    // Address object: { line1, line2?, city, state?, postal, country? }
    if (fieldType === 'address' || 'line1' in value || 'postal' in value) {
      const parts = [value.line1, value.line2, value.city, value.state, value.postal, value.country]
      const joined = parts.filter((p) => typeof p === 'string' && p.trim()).join(', ')
      if (joined) return joined
    }
    // Generic object: flatten key: value pairs.
    try {
      const entries = Object.entries(value)
        .filter(([, v]) => v !== null && v !== undefined && v !== '')
        .map(([k, v]) => `${k}: ${stringifyValue(v)}`)
      if (entries.length) return entries.join(', ')
    } catch {
      /* fall through */
    }
    try {
      return JSON.stringify(value)
    } catch {
      return ''
    }
  }

  return String(value)
}

// Build an ordered list of readable label/value pairs for a submission.
export function buildAnswerPairs(
  fields: FieldLike[],
  responses: Record<string, any>
): AnswerPair[] {
  const list = Array.isArray(fields) ? fields : []
  const pairs: AnswerPair[] = []

  for (const field of list) {
    if (!field || !field.id) continue
    const type = field.field_type || 'text'
    if (SKIP_TYPES.has(type)) continue

    const raw = responses ? responses[field.id] : undefined
    const value = stringifyValue(raw, type)
    if (value === '') continue

    pairs.push({
      fieldId: field.id,
      fieldType: type,
      label: (field.label || 'Untitled').toString(),
      value,
    })
  }

  return pairs
}

// Best-effort detection of the respondent's email address.
export function detectEmail(
  fields: FieldLike[],
  responses: Record<string, any>
): string | null {
  const list = Array.isArray(fields) ? fields : []

  // Prefer an explicit email field type.
  const emailField = list.find((f) => f && f.field_type === 'email')
  if (emailField) {
    const v = responses?.[emailField.id]
    if (typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) {
      return v.trim()
    }
  }

  // Fall back to a label that looks like an email, then any email-shaped value.
  for (const f of list) {
    if (!f) continue
    const v = responses?.[f.id]
    if (typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) {
      if ((f.label || '').toLowerCase().includes('email')) return v.trim()
    }
  }
  for (const f of list) {
    if (!f) continue
    const v = responses?.[f.id]
    if (typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) {
      return v.trim()
    }
  }

  return null
}

// Best-effort split of a "full name" answer into first/last.
export function detectName(
  fields: FieldLike[],
  responses: Record<string, any>
): { first?: string; last?: string } {
  const list = Array.isArray(fields) ? fields : []

  let first: string | undefined
  let last: string | undefined

  for (const f of list) {
    if (!f) continue
    const label = (f.label || '').toLowerCase()
    const v = responses?.[f.id]
    if (typeof v !== 'string' || !v.trim()) continue

    if (/first\s*name|given\s*name/.test(label)) first = v.trim()
    else if (/last\s*name|surname|family\s*name/.test(label)) last = v.trim()
    else if (!first && !last && /\bname\b/.test(label)) {
      const parts = v.trim().split(/\s+/)
      first = parts[0]
      if (parts.length > 1) last = parts.slice(1).join(' ')
    }
  }

  return { first, last }
}
