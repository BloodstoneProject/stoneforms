// Runnable assertion script: npx tsx lib/__tests__/endings.test.ts
import { resolveEnding, type Ending } from '../endings'

let passed = 0
function eq(a: any, b: any, msg: string) {
  if (a !== b) {
    console.error(`FAIL: ${msg} (got ${JSON.stringify(a)}, want ${JSON.stringify(b)})`)
    process.exit(1)
  }
  passed++
}

const endings: Ending[] = [
  { id: 'a', title: 'First' },
  { id: 'b', title: 'Qualified', redirectUrl: 'https://x' },
]

eq(resolveEnding(endings, { endingId: 'b' })?.id, 'b', 'pick by id')
eq(resolveEnding(endings, { endingId: null })?.id, 'a', 'null -> first')
eq(resolveEnding(endings, {})?.id, 'a', 'no id -> first')
eq(resolveEnding(endings, { endingId: 'zzz' })?.id, 'a', 'unknown id -> first')
eq(resolveEnding([], { endingId: 'a' }), null, 'empty -> null')
eq(resolveEnding(undefined, { endingId: 'a' }), null, 'undefined -> null')

console.log(`endings.test.ts: ${passed} assertions passed`)
