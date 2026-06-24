// Conditional logic ("jump logic") engine shared by the editor and the player.
// A rule watches one field; when its condition is met, the form jumps to a
// target question (or ends). Rules are evaluated in order; the first match wins.
//
// Backward-compatible upgrade: a rule may now (optionally) carry MULTIPLE
// conditions combined with and/or, plus action side-effects (variable mutations
// and a target ending id). The legacy single-condition shape (field/operator/
// value) is unchanged and still fully supported — when `conditions` is absent we
// evaluate exactly as before.

import type { VariableMutation } from './variables'

export type { VariableMutation }

export type LogicOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'greater_than'
  | 'less_than'
  | 'is_filled'
  | 'is_empty'

// A single condition over one field. Used by the multi-condition shape below.
export interface LogicCondition {
  fieldId: string
  operator: LogicOperator
  value?: any
}

export interface LogicRule {
  id: string
  field: string // question id this rule watches (legacy single-condition shape)
  operator: LogicOperator
  value?: string
  jumpTo: string // target question id, or 'end'
  // ---- Optional multi-condition shape (Typeform parity) ----
  // When present, these conditions are evaluated over the FULL answers map
  // (any answered field, not just the current question) and `field`/`operator`/
  // `value` above are ignored. `combinator` defaults to 'and'.
  conditions?: LogicCondition[]
  combinator?: 'and' | 'or'
  // ---- Optional action side-effects ----
  // Variable mutations applied when this rule matches (in array order).
  variableMutations?: VariableMutation[]
  // When the rule ends the form (jumpTo === 'end'), route to this custom ending
  // (see lib/endings.ts). Ignored for non-terminal jumps.
  targetEndingId?: string
}

export const LOGIC_OPERATORS: { value: LogicOperator; label: string; needsValue: boolean }[] = [
  { value: 'equals', label: 'is equal to', needsValue: true },
  { value: 'not_equals', label: 'is not equal to', needsValue: true },
  { value: 'contains', label: 'contains', needsValue: true },
  { value: 'greater_than', label: 'is greater than', needsValue: true },
  { value: 'less_than', label: 'is less than', needsValue: true },
  { value: 'is_filled', label: 'is filled in', needsValue: false },
  { value: 'is_empty', label: 'is empty', needsValue: false },
]

function isEmpty(v: any): boolean {
  return v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)
}

// Evaluate one operator against one answer + comparison value. Shared by the
// legacy single-condition path and the new multi-condition path.
function evalOne(operator: LogicOperator, answer: any, value: any): boolean {
  const target = (value ?? '').toString().toLowerCase()
  switch (operator) {
    case 'is_filled':
      return !isEmpty(answer)
    case 'is_empty':
      return isEmpty(answer)
    case 'equals':
      if (Array.isArray(answer)) return answer.map((a) => `${a}`.toLowerCase()).includes(target)
      return `${answer ?? ''}`.toLowerCase() === target
    case 'not_equals':
      if (Array.isArray(answer)) return !answer.map((a) => `${a}`.toLowerCase()).includes(target)
      return `${answer ?? ''}`.toLowerCase() !== target
    case 'contains':
      if (Array.isArray(answer)) return answer.map((a) => `${a}`.toLowerCase()).some((a) => a.includes(target))
      return `${answer ?? ''}`.toLowerCase().includes(target)
    case 'greater_than':
      return Number(answer) > Number(value)
    case 'less_than':
      return Number(answer) < Number(value)
    default:
      return false
  }
}

// Evaluate a rule.
// - Legacy single-condition rules: pass the watched field's answer as `answer`
//   (existing call signature, unchanged behaviour).
// - Multi-condition rules (rule.conditions present): pass the FULL answers map
//   as the second argument; each condition reads its own field from the map and
//   they are combined with rule.combinator ('and' default | 'or').
export function evaluateRule(rule: LogicRule, answerOrAnswers: any): boolean {
  if (rule.conditions && rule.conditions.length > 0) {
    const answers: Record<string, any> =
      answerOrAnswers && typeof answerOrAnswers === 'object' && !Array.isArray(answerOrAnswers)
        ? answerOrAnswers
        : {}
    const combinator = rule.combinator || 'and'
    const results = rule.conditions.map((c) => evalOne(c.operator, answers[c.fieldId], c.value))
    return combinator === 'or' ? results.some(Boolean) : results.every(Boolean)
  }
  return evalOne(rule.operator, answerOrAnswers, rule.value)
}

// Does this rule match against the full answers map? Handles both shapes by
// reading the correct answer(s) from `answers`.
export function ruleMatches(rule: LogicRule, answers: Record<string, any>): boolean {
  if (rule.conditions && rule.conditions.length > 0) {
    return evaluateRule(rule, answers)
  }
  return evaluateRule(rule, answers[rule.field])
}

// Find the first rule (in order) that is "attached" to `currentId` and matches.
// A rule is attached to currentId when its legacy `field` equals currentId, OR
// (for multi-condition rules) when `field` is unset/equals currentId — multi
// condition rules still fire as the respondent leaves the current question, but
// they evaluate their conditions over the full answers map.
function matchedRuleFor(
  currentId: string,
  answers: Record<string, any>,
  rules: LogicRule[]
): LogicRule | undefined {
  return (rules || []).find((r) => {
    const attached = r.field === currentId || (!!r.conditions && (!r.field || r.field === currentId))
    return attached && ruleMatches(r, answers)
  })
}

// Returns the next question id after `currentId`, or 'end' to finish the form.
export function nextQuestionId(
  currentId: string,
  orderedIds: string[],
  answers: Record<string, any>,
  rules: LogicRule[]
): string {
  const matched = matchedRuleFor(currentId, answers, rules)
  if (matched) return matched.jumpTo
  const idx = orderedIds.indexOf(currentId)
  if (idx >= 0 && idx < orderedIds.length - 1) return orderedIds[idx + 1]
  return 'end'
}

// Consolidated resolver — returns the next step plus any side-effects from the
// matched rule, in one pass. Additive: existing call sites can keep using
// nextQuestionId; new players use this to also collect variable mutations and the
// target ending id. `next` is the next question id or 'end'.
export interface LogicResolution {
  next: string // next question id, or 'end'
  end: boolean // true when next === 'end'
  endingId: string | null // targetEndingId of the matched terminal rule, else null
  mutations: VariableMutation[] // variableMutations of the matched rule (order preserved)
  matchedRuleId: string | null
}

export function resolveLogic(
  currentId: string,
  orderedIds: string[],
  answers: Record<string, any>,
  rules: LogicRule[]
): LogicResolution {
  const matched = matchedRuleFor(currentId, answers, rules)
  if (matched) {
    const next = matched.jumpTo
    const end = next === 'end'
    return {
      next,
      end,
      endingId: end ? matched.targetEndingId ?? null : null,
      mutations: matched.variableMutations || [],
      matchedRuleId: matched.id ?? null,
    }
  }
  const idx = orderedIds.indexOf(currentId)
  const next = idx >= 0 && idx < orderedIds.length - 1 ? orderedIds[idx + 1] : 'end'
  return { next, end: next === 'end', endingId: null, mutations: [], matchedRuleId: null }
}

// Best-effort progress %, based on position in the linear order.
export function progressFor(currentId: string, orderedIds: string[]): number {
  const idx = orderedIds.indexOf(currentId)
  if (idx < 0 || orderedIds.length === 0) return 0
  return ((idx + 1) / orderedIds.length) * 100
}
