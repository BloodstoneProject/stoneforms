// Lightweight in-memory rate limiter for public endpoints.
//
// NOTE: state is per-serverless-instance, so this is best-effort burst
// protection, not a distributed guarantee. For hard global limits, back this
// with Upstash/Redis. It still meaningfully blunts spam from a single source
// hitting a warm instance, and complements the per-plan monthly response caps.

type Entry = { count: number; resetAt: number }

const buckets = new Map<string, Entry>()
const MAX_BUCKETS = 10_000

export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfter: number } {
  const now = Date.now()

  // Opportunistic cleanup to bound memory.
  if (buckets.size > MAX_BUCKETS) {
    for (const [k, v] of buckets) {
      if (now > v.resetAt) buckets.delete(k)
    }
  }

  const entry = buckets.get(key)
  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfter: 0 }
  }
  if (entry.count >= limit) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }
  entry.count++
  return { allowed: true, retryAfter: 0 }
}
