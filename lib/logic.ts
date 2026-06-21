// Conditional logic ("jump logic") engine shared by the editor and the player.
// A rule watches one field; when its condition is met, the form jumps to a
// target question (or ends). Rules are evaluated in order; the first match wins.

export type LogicOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'greater_than'
  | 'less_than'
  | 'is_filled'
  | 'is_empty'

export interface LogicRule {
  id: string
  field: string // question id this rule watches
  operator: LogicOperator
  value?: string
  jumpTo: string // target question id, or 'end'
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

export function evaluateRule(rule: LogicRule, answer: any): boolean {
  const target = (rule.value ?? '').toString().toLowerCase()
  switch (rule.operator) {
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
      return Number(answer) > Number(rule.value)
    case 'less_than':
      return Number(answer) < Number(rule.value)
    default:
      return false
  }
}

// Returns the next question id after `currentId`, or 'end' to finish the form.
export function nextQuestionId(
  currentId: string,
  orderedIds: string[],
  answers: Record<string, any>,
  rules: LogicRule[]
): string {
  const matched = (rules || []).find(
    (r) => r.field === currentId && evaluateRule(r, answers[currentId])
  )
  if (matched) return matched.jumpTo
  const idx = orderedIds.indexOf(currentId)
  if (idx >= 0 && idx < orderedIds.length - 1) return orderedIds[idx + 1]
  return 'end'
}

// Best-effort progress %, based on position in the linear order.
export function progressFor(currentId: string, orderedIds: string[]): number {
  const idx = orderedIds.indexOf(currentId)
  if (idx < 0 || orderedIds.length === 0) return 0
  return ((idx + 1) / orderedIds.length) * 100
}
