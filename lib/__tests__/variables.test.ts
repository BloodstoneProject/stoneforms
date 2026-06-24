// Runnable assertion script: npx tsx lib/__tests__/variables.test.ts
import { initVariables, applyMutation, type FormVariable } from '../variables'

let passed = 0
function eq(a: any, b: any, msg: string) {
  if (a !== b) {
    console.error(`FAIL: ${msg} (got ${JSON.stringify(a)}, want ${JSON.stringify(b)})`)
    process.exit(1)
  }
  passed++
}

const vars: FormVariable[] = [
  { id: 'score', name: 'Score', type: 'number', default: 0 },
  { id: 'label', name: 'Label', type: 'text', default: '' },
  { id: 'badnum', name: 'Bad', type: 'number', default: 'x' as any },
]

const init = initVariables(vars)
eq(init.score, 0, 'init number')
eq(init.label, '', 'init text')
eq(init.badnum, 0, 'init non-numeric default coerces to 0')

// pure: applyMutation does not mutate input
const s0 = { score: 10, label: 'a' }
const s1 = applyMutation(s0, { variableId: 'score', op: 'add', value: 5 })
eq(s0.score, 10, 'input not mutated')
eq(s1.score, 15, 'add')
eq(applyMutation(s0, { variableId: 'score', op: 'subtract', value: 4 }).score, 6, 'subtract')
eq(applyMutation(s0, { variableId: 'score', op: 'multiply', value: 3 }).score, 30, 'multiply')
eq(applyMutation(s0, { variableId: 'score', op: 'divide', value: 2 }).score, 5, 'divide')
eq(applyMutation(s0, { variableId: 'score', op: 'divide', value: 0 }).score, 10, 'divide by zero keeps value')
eq(applyMutation(s0, { variableId: 'score', op: 'set', value: 99 }).score, 99, 'set')
// numeric coercion of string operand
eq(applyMutation(s0, { variableId: 'score', op: 'add', value: '5' as any }).score, 15, 'string operand coerced')
// concat
eq(applyMutation(s0, { variableId: 'label', op: 'concat', value: 'b' }).label, 'ab', 'concat')
// unknown variableId -> no change
eq(applyMutation(s0, { variableId: 'nope', op: 'add', value: 1 }).score, 10, 'unknown var no change')

console.log(`variables.test.ts: ${passed} assertions passed`)
