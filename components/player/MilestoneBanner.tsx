'use client'

import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

interface MilestoneBannerProps {
  // A unique, monotonically-changing token. When it changes, the banner shows.
  // (We pass the milestone number; passing null hides immediately.)
  token: number | null
  label: string
  xpGain: number
  primary: string
  buttonText: string
  reduceMotion?: boolean
}

// A celebratory banner that slides down from the top for ~2.2s on each milestone,
// then auto-dismisses. Theme-colored, springy, non-blocking (pointer-events:none).
export function MilestoneBanner({
  token,
  label,
  xpGain,
  primary,
  buttonText,
  reduceMotion,
}: MilestoneBannerProps) {
  const [visible, setVisible] = useState(false)
  const [content, setContent] = useState({ label, xpGain })

  useEffect(() => {
    if (token == null) {
      setVisible(false)
      return
    }
    setContent({ label, xpGain })
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 2200)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if (!visible) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-5"
      style={{ pointerEvents: 'none' }}
      role="status"
      aria-live="polite"
    >
      <div
        className="flex items-center gap-2.5 pl-4 pr-5 py-3 rounded-2xl shadow-xl"
        style={{
          backgroundColor: primary,
          color: buttonText,
          animation: reduceMotion
            ? undefined
            : 'sf-banner-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <Sparkles className="w-5 h-5 shrink-0" />
        <span className="font-bold text-base sm:text-lg">{content.label}</span>
        {content.xpGain > 0 && (
          <span
            className="ml-1 text-sm font-extrabold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}
          >
            +{content.xpGain} XP
          </span>
        )}
      </div>

      <style jsx>{`
        @keyframes sf-banner-in {
          0% { opacity: 0; transform: translateY(-32px) scale(0.92); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
