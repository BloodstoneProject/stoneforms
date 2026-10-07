// Runnable assertion script: npx tsx lib/__tests__/copy-dashes.test.ts
//
// House style: no em dashes in anything a reader can see. Marketing pages,
// the form player, template copy, emails and dashboard strings all count.
// Code comments do not.
//
// A guard that reads nothing reports clean, so this one proves it read the
// tree: it must scan a minimum number of files, and must find a set of known
// files with a known string in each. Rename one of those and this fails loudly.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

let passed = 0
function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exit(1)
  }
  passed++
}

const ROOT = join(__dirname, '..', '..')
const DIRS = ['app', 'components', 'lib']
const EM_DASH = String.fromCharCode(0x2014)
// The character, plus the entities JSX renders as one.
const DASH = new RegExp(`${EM_DASH}|&mdash;|&#8212;|&#x2014;`, 'i')

// Blank out comments but keep line numbers, so a failure points at the line.
export function copyOnly(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ''))
    .replace(/(^|[^:'"`\\])\/\/.*$/gm, '$1')
}

function walk(dir: string, out: string[]) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) {
      if (name === '__tests__' || name === 'node_modules') continue
      walk(p, out)
    } else if (/\.(tsx?|jsx?)$/.test(name)) {
      out.push(p)
    }
  }
}

// Self-test: the guard sees a dash in copy and in entities, not in comments.
{
  const sample = `<p>one ${EM_DASH} two</p>\n/* ${EM_DASH}\n${EM_DASH} */\n// ${EM_DASH}\nconst a = 1 // ${EM_DASH}`
  const hits = copyOnly(sample).split('\n').filter((l) => DASH.test(l))
  assert(hits.length === 1, `self-test: expected 1 hit in sample, got ${hits.length}`)
  for (const e of ['&mdash;', '&#8212;', '&#x2014;']) assert(DASH.test(`a ${e} b`), `self-test: ${e} not caught`)
  assert(!DASH.test('a - b &ndash; c'), 'self-test: hyphen or en dash was flagged')
  assert(copyOnly(`const u = 'https://x.y'`).includes('https://x.y'), 'self-test: a URL was stripped as a comment')
}

const files: string[] = []
for (const d of DIRS) walk(join(ROOT, d), files)
assert(files.length >= 150, `expected to scan 150+ files, scanned ${files.length}`)

const MARKERS: Record<string, string> = {
  'components/marketing/HomePage.tsx': 'Same power. None of the toll booths.',
  'app/features/page.tsx': 'Connect the tools you already run.',
  'app/pricing/page.tsx': 'Is logic really free?',
  'lib/form-templates.ts': 'Quote / Estimate Request',
  'components/player/QuestionRenderer.tsx': 'please specify',
}
const scanned = new Set(files.map((f) => relative(ROOT, f)))
for (const [file, marker] of Object.entries(MARKERS)) {
  assert(scanned.has(file), `${file} was not scanned; update this guard`)
  assert(readFileSync(join(ROOT, file), 'utf8').includes(marker), `${file} no longer contains "${marker}"; update this guard`)
}

const offenders: string[] = []
for (const f of files) {
  const lines = copyOnly(readFileSync(f, 'utf8')).split('\n')
  lines.forEach((l, i) => {
    if (DASH.test(l)) offenders.push(`${relative(ROOT, f)}:${i + 1}: ${l.trim().slice(0, 120)}`)
  })
}
assert(offenders.length === 0, `em dashes in copy:\n  ${offenders.join('\n  ')}`)

console.log(`copy-dashes.test.ts: ${passed} assertions passed (${files.length} files scanned)`)
