// Form variables — author-defined counters/strings that logic rules can mutate
// as a respondent progresses (e.g. a running quiz score, a price total, a
// segment label). Pure module: NO React. State is a flat Record kept in the
// player and persisted into submissions.metadata.variables. Mutations are driven
// by logic rule actions (see lib/logic.ts VariableMutation).

export type FormVariable = {
  id: string
  name: string
  type: 'number' | 'text'
  default: number | string
}

export type VariableMutation = {
  variableId: string
  op: 'set' | 'add' | 'subtract' | 'multiply' | 'divide' | 'concat'
  value: number | string
}

// Build the initial state from the form's variable definitions. Each variable is
// keyed by its `id`. A number variable with a non-numeric default coerces to 0;
// a text variable always stores a string.
export function initVariables(vars: FormVariable[]): Record<string, number | string> {
  const state: Record<string, number | string> = {}
  for (const v of vars || []) {
    if (!v || !v.id) continue
    if (v.type === 'number') {
      const n = Number(v.default)
      state[v.id] = Number.isFinite(n) ? n : 0
    } else {
      state[v.id] = v.default === null || v.default === undefined ? '' : String(v.default)
    }
  }
  return state
}

function toNum(v: number | string | undefined): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

// Apply a single mutation, returning a NEW state object (pure — does not mutate
// the input). Numeric ops (add/subtract/multiply/divide) coerce both the current
// value and the operand to numbers. `concat` coerces to string. `set` writes the
// raw value through. Division by zero yields the unchanged numeric current value
// (guards against Infinity/NaN). Unknown variableId / op leaves state unchanged.
export function applyMutation(
  state: Record<string, number | string>,
  m: VariableMutation
): Record<string, number | string> {
  if (!m || !m.variableId) return { ...state }
  const next = { ...state }
  const cur = next[m.variableId]
  switch (m.op) {
    case 'set':
      next[m.variableId] = m.value
      break
    case 'add':
      next[m.variableId] = toNum(cur) + toNum(m.value)
      break
    case 'subtract':
      next[m.variableId] = toNum(cur) - toNum(m.value)
      break
    case 'multiply':
      next[m.variableId] = toNum(cur) * toNum(m.value)
      break
    case 'divide': {
      const d = toNum(m.value)
      next[m.variableId] = d === 0 ? toNum(cur) : toNum(cur) / d
      break
    }
    case 'concat':
      next[m.variableId] = `${cur ?? ''}${m.value ?? ''}`
      break
    default:
      // unknown op: no change
      break
  }
  return next
}
