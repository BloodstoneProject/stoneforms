// Dynamic Open Graph social card for a public form.
// Rendered on the edge via next/og (ships with Next 14 — no new dependency).
// Shows the form title + the Stoneforms mark over a branded gradient.
import { ImageResponse } from 'next/og'
import { getSiteUrl } from '@/lib/site'

export const runtime = 'edge'
export const alt = 'Stoneforms form'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Best-effort fetch of the form's title from the public API. Falls back to a
// generic label so the card always renders even if the form is private/missing.
async function getTitle(id: string): Promise<string> {
  try {
    const res = await fetch(`${getSiteUrl()}/api/public/forms/${id}`, {
      // Edge fetch; cache briefly so we don't hammer the API for crawlers.
      next: { revalidate: 300 },
    })
    if (!res.ok) return 'A form on Stoneforms'
    const data = await res.json()
    const title = data?.form?.title
    return typeof title === 'string' && title.trim() ? title.trim() : 'A form on Stoneforms'
  } catch {
    return 'A form on Stoneforms'
  }
}

export default async function OpengraphImage({ params }: { params: { id: string } }) {
  const title = await getTitle(params.id)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #1c1917 0%, #292524 55%, #44403c 100%)',
          color: '#fafaf9',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Brand mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: '#fafaf9',
              color: '#1c1917',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            S
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>Stoneforms</div>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <div style={{ fontSize: 26, color: '#a8a29e', fontWeight: 500 }}>You're invited to fill out</div>
          <div
            style={{
              fontSize: title.length > 50 ? 60 : 74,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              maxWidth: 1040,
              display: 'flex',
            }}
          >
            {title.length > 110 ? title.slice(0, 107) + '…' : title}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, color: '#d6d3d1' }}>
          <div
            style={{
              padding: '8px 18px',
              borderRadius: 999,
              background: 'rgba(250,250,249,0.12)',
              display: 'flex',
            }}
          >
            Powered by Stoneforms
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
