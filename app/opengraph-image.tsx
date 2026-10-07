// Default social card for the marketing site. /f/[id] has its own per-form card.
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Stoneforms: Typeform-grade forms, without the Typeform tax'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const LIME = '#C6F24E'

export default function OpengraphImage() {
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
          background: '#0b0b0b',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: LIME,
              color: '#000',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2, display: 'flex' }}>
            Forms that don&apos;t suck.
          </div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2, color: LIME, display: 'flex' }}>
            And don&apos;t cost a fortune.
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: 'rgba(255,255,255,0.6)' }}>
          Logic, recall and 25+ field types on every plan. stoneforms.io
        </div>
      </div>
    ),
    { ...size }
  )
}
