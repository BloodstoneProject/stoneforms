// Runnable assertion script: npx tsx lib/__tests__/byter-lab.test.ts
//
// The contact form copies each real lead into Byter Lab. Three promises:
//   1. a real submission is forwarded, with the right site, form and header
//   2. a honeypot hit is never forwarded
//   3. the form still succeeds when the Lab call throws
//
// fetch is mocked for both Resend (the form's own write) and the Lab intake,
// so nothing leaves the machine.

process.env.RESEND_API_KEY = 're_test_key'
process.env.BYTER_LAB_LEAD_SECRET = 'test-secret-value'
process.env.BYTER_LAB_LEAD_URL = 'https://lab.example.test/intake'

let passed = 0
function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exit(1)
  }
  passed++
}

type Call = { url: string; init: RequestInit }
let calls: Call[] = []
let labMode: 'ok' | 'throw' = 'ok'

globalThis.fetch = (async (input: RequestInfo | URL, init: RequestInit = {}) => {
  const url = String(input instanceof Request ? input.url : input)
  calls.push({ url, init })
  if (url.startsWith('https://lab.example.test')) {
    if (labMode === 'throw') throw new Error('network down')
    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  }
  // Resend
  return new Response(JSON.stringify({ id: 'email_123' }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
}) as typeof fetch

let ipCounter = 0
function makeRequest(body: Record<string, unknown>) {
  ipCounter++
  return new Request('https://stoneforms.io/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': `10.0.0.${ipCounter}`,
      referer: 'https://stoneforms.io/contact?utm_source=google&utm_campaign=autumn&gclid=abc123',
    },
    body: JSON.stringify(body),
  })
}

const labCalls = () => calls.filter((c) => c.url.startsWith('https://lab.example.test'))

async function main() {
  const { POST } = await import('../../app/api/contact/route')
  const real = { name: 'Ada Lovelace', email: 'ada@example.com', message: 'I would like a demo.' }

  // 1. Forwarded on success.
  calls = []
  labMode = 'ok'
  let res = await POST(makeRequest(real))
  assert(res.status === 200, `real submission returns 200, got ${res.status}`)
  const lab = labCalls()
  assert(lab.length === 1, `one Lab call, got ${lab.length}`)
  const headers = lab[0].init.headers as Record<string, string>
  assert(headers['x-lead-secret'] === 'test-secret-value', 'sends x-lead-secret header')
  const sent = JSON.parse(String(lab[0].init.body))
  assert(sent.site === 'stoneforms.io', `site is stoneforms.io, got ${sent.site}`)
  assert(sent.form === 'contact', 'form is contact')
  assert(sent.email === 'ada@example.com', 'email forwarded')
  assert(sent.name === 'Ada Lovelace', 'name forwarded')
  assert(sent.payload.message === 'I would like a demo.', 'message in payload')
  assert(sent.payload.form_name === 'contact', 'form_name in payload')
  assert(sent.attribution.utm_source === 'google', 'utm_source from referer')
  assert(sent.attribution.click_id === 'abc123', 'gclid becomes click_id')
  assert(sent.attribution.landing_page === 'https://stoneforms.io/contact', 'landing page without query')
  const resendIndex = calls.findIndex((c) => !c.url.startsWith('https://lab.example.test'))
  const labIndex = calls.findIndex((c) => c.url.startsWith('https://lab.example.test'))
  assert(resendIndex !== -1 && resendIndex < labIndex, 'Lab call happens after the email is sent')

  // 2. Not forwarded on a honeypot hit.
  calls = []
  res = await POST(makeRequest({ ...real, company: 'Spam Co' }))
  assert(res.status === 200, 'honeypot still answers 200')
  assert(labCalls().length === 0, 'honeypot hit is not forwarded')

  // 3. Form still succeeds when the Lab call throws.
  calls = []
  labMode = 'throw'
  const origError = console.error
  console.error = () => {}
  res = await POST(makeRequest(real))
  console.error = origError
  assert(res.status === 200, `form succeeds when Lab throws, got ${res.status}`)
  assert(labCalls().length === 1, 'Lab was attempted')

  // No secret configured means no call at all.
  calls = []
  labMode = 'ok'
  delete process.env.BYTER_LAB_LEAD_SECRET
  res = await POST(makeRequest(real))
  assert(res.status === 200, 'form succeeds with no secret')
  assert(labCalls().length === 0, 'no secret, no Lab call')

  console.log(`byter-lab: ${passed} passed`)
}

main().catch((err) => {
  console.error('FAIL:', err)
  process.exit(1)
})
