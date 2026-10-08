// Copies a real lead into Byter Lab's New Leads inbox (bl_leads), so the
// morning brief shows every lead across the group by site.
//
// Best effort by design. The site's own write (here, the email to the inbox)
// has already happened by the time this runs, so a Lab outage must never cost
// a visitor their confirmation. No secret configured means no-op, and nothing
// here ever throws or logs the secret.
//
// Same contract as byter.com and byterafrica.com's lib/lab.ts: POST to the
// bl-lead-intake edge function with an x-lead-secret header.

// Which business this lead belongs to. A constant, never a caller argument: a
// lead filed under the wrong site is worse than one not filed at all.
export const LAB_SITE = 'stoneforms.io'

const DEFAULT_URL = 'https://hcdvyzdkkrpzgaeedktp.supabase.co/functions/v1/bl-lead-intake'
const TIMEOUT_MS = 3000

export interface LabAttribution {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  click_id?: string
  referrer?: string
  landing_page?: string
}

export interface LabLead {
  /** Intake vocabulary: contact, enquiry, quote, tool, guide, newsletter. */
  form: string
  email: string
  name?: string
  phone?: string
  companyName?: string
  website?: string
  serviceInterest?: string
  /** Human readable origin, e.g. "Contact page". */
  sourceDetail?: string
  attribution?: LabAttribution
  spamScore?: number
  payload?: Record<string, unknown>
}

const CLICK_ID_KEYS = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'ttclid', 'msclkid', 'li_fat_id']
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

/**
 * Attribution recovered from the Referer header, which is the page the form
 * sat on. Only works when the visitor submitted from a URL still carrying its
 * UTMs or click id, but it needs no new client-side tracking.
 */
export function attributionFromRequest(request: Request): LabAttribution {
  const out: LabAttribution = {}
  const ref = request.headers.get('referer') || request.headers.get('referrer')
  if (!ref) return out
  let url: URL
  try {
    url = new URL(ref)
  } catch {
    return out
  }
  out.landing_page = `${url.origin}${url.pathname}`
  for (const key of UTM_KEYS) {
    const v = url.searchParams.get(key)
    if (v) out[key] = v.slice(0, 500)
  }
  const clickKey = CLICK_ID_KEYS.find((k) => url.searchParams.get(k))
  if (clickKey) {
    out.click_id = String(url.searchParams.get(clickKey)).slice(0, 500)
    if (!out.utm_medium) out.utm_medium = 'cpc'
  }
  return out
}

function compact<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Partial<T> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null && v !== '') (out as Record<string, unknown>)[k] = v
  }
  return out
}

/** Throws on failure. Use forwardLeadToLab from routes. */
export async function sendLeadToLab(lead: LabLead): Promise<boolean> {
  const secret = process.env.BYTER_LAB_LEAD_SECRET
  if (!secret) return false
  if (!lead.email || !lead.email.includes('@')) return false

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(process.env.BYTER_LAB_LEAD_URL || DEFAULT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-lead-secret': secret },
      signal: controller.signal,
      body: JSON.stringify(
        compact({
          form: lead.form,
          site: LAB_SITE,
          email: lead.email,
          name: lead.name,
          phone: lead.phone,
          company_name: lead.companyName,
          website: lead.website,
          service_interest: lead.serviceInterest,
          source_detail: lead.sourceDetail,
          attribution: compact({ ...(lead.attribution ?? {}) }),
          spam_score: lead.spamScore,
          payload: compact({ ...(lead.payload ?? {}) }),
        })
      ),
    })
    if (!res.ok) throw new Error(`bl-lead-intake responded ${res.status}`)
    return true
  } finally {
    clearTimeout(timer)
  }
}

/** sendLeadToLab that never throws and never waits more than 3 seconds. */
export async function forwardLeadToLab(lead: LabLead): Promise<boolean> {
  try {
    return await sendLeadToLab(lead)
  } catch (err) {
    const reason = err instanceof Error ? err.message : 'unknown error'
    console.error(`Byter Lab lead sync failed (lead still captured): ${reason}`)
    return false
  }
}
