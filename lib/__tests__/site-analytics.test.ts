// Runnable assertion script: npx tsx lib/__tests__/site-analytics.test.ts
//
// Stoneforms' own GA4 must (a) do nothing when NEXT_PUBLIC_GA_ID is unset,
// (b) set Consent Mode v2 defaults to denied before gtag.js, and (c) never
// reach a hosted form, an embed or the dashboard.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { isMarketingPage, siteGaId } from '../site-analytics'

let passed = 0
function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exit(1)
  }
  passed++
}

const ROOT = join(__dirname, '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')

// (a) no tag when unset
assert(siteGaId(undefined) === null, 'unset env must give no ID')
assert(siteGaId('') === null, 'empty env must give no ID')
assert(siteGaId('UA-1-1') === null, 'non GA4 ID rejected')
assert(siteGaId(' G-ABC1234\n') === 'G-ABC1234', 'valid ID trimmed')
assert(
  /\{SITE_GA_ID && <SiteAnalytics gaId=\{SITE_GA_ID\} \/>\}/.test(read('app/layout.tsx')),
  'layout must render SiteAnalytics only when the ID is set'
)

// (b) consent default denied before gtag.js
const comp = read('components/site-analytics/SiteAnalytics.tsx')
const def = comp.indexOf("'consent', 'default'")
assert(def > -1, 'consent default missing')
for (const k of ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage']) {
  assert(comp.includes(`${k}: 'denied'`), `${k} must default to denied`)
}
assert(def < comp.indexOf('googletagmanager.com/gtag/js'), 'gtag.js referenced before consent default')

// (c) scope
for (const p of ['/', '/pricing', '/blog/some-post', '/contact', '/legal/privacy']) {
  assert(isMarketingPage('stoneforms.io', p), `${p} should be in scope`)
}
for (const p of ['/f/abc', '/p/slug', '/embed/abc', '/dashboard', '/dashboard/forms/1', '/onboarding', '/api/contact', '/features-x']) {
  assert(!isMarketingPage('stoneforms.io', p), `${p} must be out of scope`)
}
assert(!isMarketingPage('acme.stoneforms.io', '/'), 'branded subdomain must be out of scope')
assert(!isMarketingPage('forms.example.com', '/'), 'custom domain must be out of scope')
assert(!isMarketingPage('stoneforms.vercel.app', '/'), 'vercel alias out of scope')

console.log(`site-analytics: ${passed} assertions passed`)
