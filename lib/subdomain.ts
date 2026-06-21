// Pure helper for parsing a branded form subdomain out of a request host.
//
// The product serves public forms at `{slug}.stoneforms.app`. This helper is
// build-ready but stays inert until the wildcard domain `*.stoneforms.app` is
// added in Vercel and (optionally) NEXT_PUBLIC_ROOT_DOMAIN is set. Until then,
// every real host (apex, localhost, *.vercel.app preview) returns null and the
// middleware falls through to its normal behaviour.

const RESERVED_LABELS = new Set(['www', 'app', 'api', 'admin', 'stoneforms', ''])

/**
 * Given a request host (e.g. "acme.stoneforms.app" or "localhost:3000"),
 * return the subdomain label if the host is `{label}.{rootDomain}` and `label`
 * is not a reserved label. Returns null in every other case, including the
 * apex domain, localhost, 127.0.0.1, and *.vercel.app preview hosts.
 */
export function getSubdomain(host: string | null | undefined): string | null {
  if (!host) return null

  // Strip port (e.g. "localhost:3000" -> "localhost") and lowercase.
  const hostname = host.split(':')[0].trim().toLowerCase()
  if (!hostname) return null

  // Never treat local/dev or Vercel preview hosts as branded subdomains.
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname.endsWith('.vercel.app')
  ) {
    return null
  }

  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'stoneforms.app')
    .split(':')[0]
    .trim()
    .toLowerCase()

  // Apex domain itself (or anything that does not sit under the root) -> null.
  if (hostname === rootDomain) return null
  if (!hostname.endsWith(`.${rootDomain}`)) return null

  // The part before `.${rootDomain}`. Only accept a single-label subdomain
  // (e.g. "acme"), not deep nesting like "a.b.stoneforms.app".
  const label = hostname.slice(0, hostname.length - rootDomain.length - 1)
  if (!label || label.includes('.')) return null
  if (RESERVED_LABELS.has(label)) return null

  return label
}
