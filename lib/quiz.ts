// Quiz / scoring engine — pure, unit-testable functions shared by the player
// (display) and the submit route (authoritative scoring).
//
// Config shapes:
//   forms.settings.quiz = {
//     enabled: boolean,
//     showResults: boolean,
//     outcomes: Array<{ id, minScore, maxScore, title, message }>
//   }
//   field.settings.scoring:
//     - choice fields (multiple_choice, dropdown, picture_choice, checkboxes):
//         a map { [optionValue]: points }
//     - yes_no:   map with keys "true" / "false"
//     - numeric fields (rating, opinion_scale, number):
//         { weight: number }  →  points = numericAnswer * (weight ?? 1)
//
// Choice option *values* in this codebase equal the option label strings
// (see lib/form-mapping.ts optionToChoice). So scoring maps are keyed by the
// option label. We additionally accept index-keyed maps as a fallback.

export interface QuizOutcome {
  id: string
  minScore: number
  maxScore: number
  title: string
  message: string
}

export interface QuizConfig {
  enabled?: boolean
  showResults?: boolean
  outcomes?: QuizOutcome[]
}

export interface ScoreResult {
  total: number
  max: number
}

// A field as it exists in the DB (form_fields row) — only the parts we need.
interface ScorableField {
  id: string
  field_type?: string
  type?: string
  options?: string[] | null
  settings?: Record<string, any> | null
}

const CHOICE_SINGLE = new Set(['multiple_choice', 'dropdown', 'picture_choice'])
const NUMERIC = new Set(['rating', 'opinion_scale', 'number'])

function fieldType(f: ScorableField): string {
  return (f.field_type || f.type || '') as string
}

function num(v: any): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

// Points awarded to a single field given its answer. Returns 0 when the field
// has no scoring config or the answer doesn't match anything.
function pointsForField(f: ScorableField, answer: any): number {
  const scoring = (f.settings || {}).scoring
  if (scoring === undefined || scoring === null) return 0
  const type = fieldType(f)

  if (NUMERIC.has(type)) {
    const weight = num(scoring.weight ?? 1)
    if (answer === undefined || answer === null || answer === '') return 0
    return num(answer) * weight
  }

  if (type === 'yes_no') {
    if (answer === true || answer === 'true') return num(scoring['true'])
    if (answer === false || answer === 'false') return num(scoring['false'])
    return 0
  }

  if (type === 'checkboxes') {
    const selected: any[] = Array.isArray(answer) ? answer : []
    return selected.reduce((sum, v) => sum + num(scoring[v]), 0)
  }

  if (CHOICE_SINGLE.has(type)) {
    if (answer === undefined || answer === null || answer === '') return 0
    return num(scoring[answer])
  }

  return 0
}

// Maximum possible points for a field (for the "X / Y" display).
function maxForField(f: ScorableField): number {
  const scoring = (f.settings || {}).scoring
  if (scoring === undefined || scoring === null) return 0
  const type = fieldType(f)

  if (NUMERIC.has(type)) {
    const weight = num(scoring.weight ?? 1)
    // Cap at the field's configured max, else sensible per-type maxima.
    const cfgMax = (f.settings || {}).max
    let scaleMax: number
    if (cfgMax !== undefined && cfgMax !== null && cfgMax !== '') scaleMax = num(cfgMax)
    else if (type === 'rating') scaleMax = 5
    else if (type === 'opinion_scale') scaleMax = 10
    else scaleMax = 0 // unbounded number: can't bound the max meaningfully
    return scaleMax * weight
  }

  if (type === 'yes_no') {
    return Math.max(num(scoring['true']), num(scoring['false']), 0)
  }

  if (type === 'checkboxes') {
    // Best case = sum of all positive option points.
    return Object.values(scoring).reduce<number>((sum, v) => sum + Math.max(num(v), 0), 0)
  }

  if (CHOICE_SINGLE.has(type)) {
    const vals = Object.values(scoring).map(num)
    return vals.length ? Math.max(...vals, 0) : 0
  }

  return 0
}

// Compute the total score and the maximum attainable score for a set of fields
// + the respondent's answers (keyed by field id).
export function computeScore(
  fields: ScorableField[],
  answers: Record<string, any>
): ScoreResult {
  let total = 0
  let max = 0
  for (const f of fields || []) {
    total += pointsForField(f, answers?.[f.id])
    max += maxForField(f)
  }
  // Round to avoid floating point noise from weighted numerics.
  return { total: Math.round(total * 100) / 100, max: Math.round(max * 100) / 100 }
}

// Resolve the first outcome whose [minScore, maxScore] range contains `total`.
// Outcomes are evaluated in ascending minScore order.
export function resolveOutcome(quiz: QuizConfig | null | undefined, total: number): QuizOutcome | null {
  const outcomes = quiz?.outcomes
  if (!Array.isArray(outcomes) || outcomes.length === 0) return null
  const sorted = [...outcomes].sort((a, b) => num(a.minScore) - num(b.minScore))
  for (const o of sorted) {
    const min = num(o.minScore)
    const max = num(o.maxScore)
    if (total >= min && total <= max) return o
  }
  return null
}
