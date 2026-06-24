// Recall (a.k.a. "piping") — substitutes answer/variable/hidden/score/price
// tokens into question titles, descriptions, endings, and any author-supplied
// text. Pure module: NO React, no DOM. Shared by the player, server-side
// submit/email rendering, and the editor preview.
//
// Token syntax (exact):
//   {{field:FIELD_ID}}   -> ctx.answers[FIELD_ID]
//   {{var:NAME}}         -> ctx.variables[NAME]
//   {{hidden:REF}}       -> ctx.hidden[REF]
//   {{score}}            -> ctx.score
//   {{price}}            -> ctx.price
// Unknown / unresolved tokens render as '' (empty string). Whitespace inside the
// braces is tolerated, e.g. {{ field:abc }}.

export type RecallContext = {
  answers: Record<string, any>
  variables?: Record<string, string | number>
  hidden?: Record<string, string>
  score?: number
  price?: number
}

// Matches {{field:X}}, {{var:X}}, {{hidden:X}}, {{score}}, {{price}}.
// Group 1 = kind, Group 2 = ref (absent for score/price).
const TOKEN_RE = /\{\{\s*(field|var|hidden|score|price)\s*(?::\s*([^}]*?))?\s*\}\}/gi

// Turn any resolved value into a display string.
// - null/undefined -> ''
// - arrays -> join with ', ' (each element stringified, null/undefined dropped)
// - objects -> readable string (prefer common label keys, else JSON-ish)
// - everything else -> String(v)
function stringifyValue(v: any): string {
  if (v === null || v === undefined) return ''
  if (Array.isArray(v)) {
    return v
      .filter((x) => x !== null && x !== undefined)
      .map((x) => stringifyValue(x))
      .filter((s) => s !== '')
      .join(', ')
  }
  if (typeof v === 'object') {
    // Prefer human-friendly keys when present (e.g. choice/option objects,
    // address objects). Fall back to space-joined own string/number values.
    const labelKeys = ['label', 'text', 'value', 'name', 'title']
    for (const k of labelKeys) {
      if (typeof v[k] === 'string' && v[k].trim()) return v[k]
      if (typeof v[k] === 'number') return String(v[k])
    }
    const parts = Object.values(v)
      .filter((x) => typeof x === 'string' || typeof x === 'number')
      .map((x) => String(x))
      .filter((s) => s.trim() !== '')
    if (parts.length) return parts.join(' ')
    try {
      return JSON.stringify(v)
    } catch {
      return ''
    }
  }
  if (typeof v === 'boolean') return v ? 'Yes' : 'No'
  return String(v)
}

function resolveToken(kind: string, ref: string | undefined, ctx: RecallContext): string {
  const k = kind.toLowerCase()
  switch (k) {
    case 'field':
      return stringifyValue(ctx.answers ? ctx.answers[ref ?? ''] : undefined)
    case 'var':
      return stringifyValue(ctx.variables ? ctx.variables[ref ?? ''] : undefined)
    case 'hidden':
      return stringifyValue(ctx.hidden ? ctx.hidden[ref ?? ''] : undefined)
    case 'score':
      return stringifyValue(ctx.score)
    case 'price':
      return stringifyValue(ctx.price)
    default:
      return ''
  }
}

// Replace every recognised token in `text`. Safe on null/undefined input.
export function resolveRecall(text: string, ctx: RecallContext): string {
  if (text === null || text === undefined) return ''
  const str = typeof text === 'string' ? text : String(text)
  if (str.indexOf('{{') === -1) return str
  const safeCtx: RecallContext = ctx || { answers: {} }
  return str.replace(TOKEN_RE, (_m, kind: string, ref?: string) =>
    resolveToken(kind, ref, safeCtx)
  )
}

// Returns the distinct list of raw token strings found in `text`, e.g.
// ['{{field:abc}}', '{{score}}']. Order of first appearance, de-duplicated.
export function extractRecallTokens(text: string): string[] {
  if (text === null || text === undefined) return []
  const str = typeof text === 'string' ? text : String(text)
  const out: string[] = []
  const seen = new Set<string>()
  const re = new RegExp(TOKEN_RE.source, 'gi')
  let m: RegExpExecArray | null
  while ((m = re.exec(str)) !== null) {
    const raw = m[0]
    if (!seen.has(raw)) {
      seen.add(raw)
      out.push(raw)
    }
  }
  return out
}
