// Runnable assertion script: npx tsx lib/__tests__/recall.test.ts
import { resolveRecall, extractRecallTokens, type RecallContext } from '../recall'

let passed = 0
function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exit(1)
  }
  passed++
}
function eq(a: any, b: any, msg: string) {
  assert(a === b, `${msg} (got ${JSON.stringify(a)}, want ${JSON.stringify(b)})`)
}

const ctx: RecallContext = {
  answers: {
    name: 'Lewis',
    fav: ['Red', 'Blue'],
    addr: { line1: '1 High St', city: 'London' },
    yes: true,
    empty: null,
  },
  variables: { tier: 'Gold', count: 3 },
  hidden: { utm: 'spring' },
  score: 42,
  price: 99.5,
}

// field
eq(resolveRecall('Hi {{field:name}}!', ctx), 'Hi Lewis!', 'field token')
// array joins with ', '
eq(resolveRecall('{{field:fav}}', ctx), 'Red, Blue', 'array join')
// object -> readable string (no label key -> space-joined values)
eq(resolveRecall('{{field:addr}}', ctx), '1 High St London', 'object readable')
// boolean
eq(resolveRecall('{{field:yes}}', ctx), 'Yes', 'boolean')
// var
eq(resolveRecall('{{var:tier}} ({{var:count}})', ctx), 'Gold (3)', 'var token')
// hidden
eq(resolveRecall('src={{hidden:utm}}', ctx), 'src=spring', 'hidden token')
// score / price
eq(resolveRecall('Score {{score}} Price {{price}}', ctx), 'Score 42 Price 99.5', 'score+price')
// missing field -> ''
eq(resolveRecall('[{{field:nope}}]', ctx), '[]', 'missing field')
// null answer -> ''
eq(resolveRecall('[{{field:empty}}]', ctx), '[]', 'null answer')
// whitespace tolerance
eq(resolveRecall('{{ field:name }}', ctx), 'Lewis', 'whitespace tolerance')
// null/undefined input safety
eq(resolveRecall(null as any, ctx), '', 'null input')
eq(resolveRecall(undefined as any, ctx), '', 'undefined input')
// no-token passthrough
eq(resolveRecall('plain text', ctx), 'plain text', 'passthrough')
// safe with empty ctx
eq(resolveRecall('{{field:x}}{{score}}', { answers: {} }), '', 'empty ctx')

// extractRecallTokens
const toks = extractRecallTokens('Hi {{field:name}} {{score}} {{field:name}} {{var:tier}}')
eq(JSON.stringify(toks), JSON.stringify(['{{field:name}}', '{{score}}', '{{var:tier}}']), 'extract dedup+order')
eq(JSON.stringify(extractRecallTokens('none here')), '[]', 'extract empty')

console.log(`recall.test.ts: ${passed} assertions passed`)
