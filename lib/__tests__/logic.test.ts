// Runnable assertion script: npx tsx lib/__tests__/logic.test.ts
import {
  evaluateRule,
  nextQuestionId,
  resolveLogic,
  progressFor,
  type LogicRule,
} from '../logic'

let passed = 0
function eq(a: any, b: any, msg: string) {
  if (a !== b) {
    console.error(`FAIL: ${msg} (got ${JSON.stringify(a)}, want ${JSON.stringify(b)})`)
    process.exit(1)
  }
  passed++
}

// ---- Legacy single-condition behaviour MUST be unchanged ----
const r1: LogicRule = { id: 'r1', field: 'q1', operator: 'equals', value: 'yes', jumpTo: 'q5' }
eq(evaluateRule(r1, 'yes'), true, 'legacy equals match')
eq(evaluateRule(r1, 'no'), false, 'legacy equals no match')

const ordered = ['q1', 'q2', 'q3', 'q4', 'q5']
eq(nextQuestionId('q1', ordered, { q1: 'yes' }, [r1]), 'q5', 'legacy jump')
eq(nextQuestionId('q1', ordered, { q1: 'no' }, [r1]), 'q2', 'legacy linear next')
eq(nextQuestionId('q5', ordered, {}, []), 'end', 'last -> end')
const gt: LogicRule = { id: 'g', field: 'age', operator: 'greater_than', value: '18', jumpTo: 'end' }
eq(evaluateRule(gt, 21), true, 'greater_than')
eq(evaluateRule(gt, 10), false, 'greater_than false')

// ---- Multi-condition rules evaluate over the FULL answers map ----
const multi: LogicRule = {
  id: 'm1',
  field: 'q1', // attached to q1, but conditions read other fields too
  operator: 'equals',
  jumpTo: 'q4',
  combinator: 'and',
  conditions: [
    { fieldId: 'country', operator: 'equals', value: 'UK' },
    { fieldId: 'budget', operator: 'greater_than', value: 1000 },
  ],
}
eq(evaluateRule(multi, { country: 'UK', budget: 5000 }), true, 'multi AND both true')
eq(evaluateRule(multi, { country: 'UK', budget: 500 }), false, 'multi AND one false')

const multiOr: LogicRule = { ...multi, id: 'm2', combinator: 'or' }
eq(evaluateRule(multiOr, { country: 'UK', budget: 0 }), true, 'multi OR one true')
eq(evaluateRule(multiOr, { country: 'US', budget: 0 }), false, 'multi OR none')

// nextQuestionId routes via multi-condition rule over full answers
eq(
  nextQuestionId('q1', ordered, { q1: 'anything', country: 'UK', budget: 5000 }, [multi]),
  'q4',
  'multi-condition jump over full answers'
)
eq(
  nextQuestionId('q1', ordered, { q1: 'anything', country: 'US', budget: 5000 }, [multi]),
  'q2',
  'multi-condition no match -> linear'
)

// ---- resolveLogic: side-effects (mutations + ending) ----
const ruleEnd: LogicRule = {
  id: 'e1',
  field: 'q5',
  operator: 'is_filled',
  jumpTo: 'end',
  targetEndingId: 'qualified',
  variableMutations: [{ variableId: 'score', op: 'add', value: 10 }],
}
const res = resolveLogic('q5', ordered, { q5: 'x' }, [ruleEnd])
eq(res.next, 'end', 'resolveLogic next end')
eq(res.end, true, 'resolveLogic end flag')
eq(res.endingId, 'qualified', 'resolveLogic ending id')
eq(res.mutations.length, 1, 'resolveLogic mutations')
eq(res.matchedRuleId, 'e1', 'resolveLogic matched rule id')

const resNone = resolveLogic('q2', ordered, {}, [])
eq(resNone.next, 'q3', 'resolveLogic linear next')
eq(resNone.endingId, null, 'resolveLogic no ending')

// progressFor unchanged
eq(Math.round(progressFor('q3', ordered)), 60, 'progressFor')

console.log(`logic.test.ts: ${passed} assertions passed`)
