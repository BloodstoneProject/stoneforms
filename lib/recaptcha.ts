// reCAPTCHA v3 server-side verification — built dormant.
//
// The presence of the RECAPTCHA_SECRET_KEY env var is the real gate:
//   - If unset, verification is SKIPPED entirely (returns { ok: true, skipped })
//     so nothing breaks before keys are added.
//   - If set, the token is POSTed to Google's siteverify endpoint and rejected
//     when success === false or the risk score is below MIN_SCORE.
//
// No new npm packages: raw fetch to the verify endpoint.

const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'
const MIN_SCORE = 0.5

export interface RecaptchaResult {
  ok: boolean
  skipped: boolean
  score?: number
  reason?: string
}

export async function verifyRecaptcha(
  token: unknown,
  remoteIp?: string
): Promise<RecaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  // Dormant: no secret configured -> never block submissions.
  if (!secret) return { ok: true, skipped: true }

  // Secret is configured but the client sent no token -> reject.
  if (typeof token !== 'string' || token.trim() === '') {
    return { ok: false, skipped: false, reason: 'missing_token' }
  }

  try {
    const params = new URLSearchParams()
    params.set('secret', secret)
    params.set('response', token)
    if (remoteIp) params.set('remoteip', remoteIp)

    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })
    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean
      score?: number
      'error-codes'?: string[]
    }

    if (!data.success) {
      return { ok: false, skipped: false, reason: 'verification_failed', score: data.score }
    }
    if (typeof data.score === 'number' && data.score < MIN_SCORE) {
      return { ok: false, skipped: false, reason: 'low_score', score: data.score }
    }
    return { ok: true, skipped: false, score: data.score }
  } catch {
    // Network error talking to Google: fail open so we don't lose legitimate
    // responses to a transient outage.
    return { ok: true, skipped: false, reason: 'verify_error' }
  }
}
