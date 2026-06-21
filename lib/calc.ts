// Calculator field engine — a pure, eval-free evaluator shared by the player
// (live display) and the submit route (authoritative recompute).
//
// Config shape (field.settings.calculation):
//   {
//     terms: Array<{ fieldId: string, weight: number }>,
//     constant?: number,
//     prefix?: string,   // e.g. "£"
//     suffix?: string,   // e.g. " pts"
//     decimals?: number, // optional fixed decimal places for display
//   }
//
// Value = sum(Number(answers[fieldId] || 0) * weight) + (constant || 0)
// Answers that aren't finite numbers contribute 0 (never NaN, never throws).

export interface CalcTerm {
  fieldId: string
  weight: number
}

export interface CalcConfig {
  terms?: CalcTerm[]
  constant?: number
  prefix?: string
  suffix?: string
  decimals?: number
}

// A field-like object that may carry a calculation config in its settings.
interface CalcField {
  settings?: Record<string, any> | null
  properties?: Record<string, any> | null
}

function toNumber(v: any): number {
  if (v === undefined || v === null || v === '') return 0
  // Booleans (e.g. yes_no / consent answers) count as 1 / 0.
  if (typeof v === 'boolean') return v ? 1 : 0
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

// Read the calculation config off a field, tolerating both the raw DB shape
// (field.settings.calculation) and the mapped Question shape
// (question.properties.calculation — properties === the settings JSONB).
export function getCalcConfig(field: CalcField): CalcConfig | null {
  const fromSettings = (field.settings || {}).calculation
  const fromProps = (field.properties || {}).calculation
  const cfg = fromSettings ?? fromProps
  if (!cfg || typeof cfg !== 'object') return null
  return cfg as CalcConfig
}

// Compute the numeric value of a calculator field given the current answers
// (keyed by field id). Returns 0 when there's no config or no contributing terms.
export function computeCalc(field: CalcField, answers: Record<string, any>): number {
  const cfg = getCalcConfig(field)
  if (!cfg) return 0
  const terms = Array.isArray(cfg.terms) ? cfg.terms : []
  let sum = 0
  for (const term of terms) {
    if (!term || typeof term.fieldId !== 'string') continue
    const weight = toNumber(term.weight)
    sum += toNumber(answers?.[term.fieldId]) * weight
  }
  sum += toNumber(cfg.constant)
  // Round to avoid floating point noise from weighted sums.
  return Math.round(sum * 1e6) / 1e6
}

// Format a computed value for display, applying prefix/suffix and optional
// fixed decimals. Kept separate so the player and any export share formatting.
export function formatCalc(value: number, cfg: CalcConfig | null): string {
  const prefix = cfg?.prefix ?? ''
  const suffix = cfg?.suffix ?? ''
  let body: string
  if (cfg && typeof cfg.decimals === 'number' && cfg.decimals >= 0) {
    body = value.toFixed(Math.min(cfg.decimals, 10))
  } else {
    body = String(value)
  }
  return `${prefix}${body}${suffix}`
}
