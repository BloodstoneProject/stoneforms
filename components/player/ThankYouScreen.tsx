'use client'

import { useEffect, useRef } from 'react'
import { Check } from 'lucide-react'
import { Confetti, type ConfettiHandle } from '@/components/player/Confetti'
import { RewardBadge } from '@/components/player/RewardScreen'

interface ThankYouScreenProps {
  title?: string
  message?: string
  hideBranding?: boolean
  theme: {
    primaryColor: string
    backgroundColor: string
    textColor: string
    font?: string
    buttonRadius?: string
  }
  // Gamification (optional). When `gamify` is provided, the screen shows the
  // end-reward badge (total XP + level + badge) and fires a confetti finale.
  // Omitted => byte-for-byte the original thank-you screen.
  gamify?: { xp: number }
  // Palette for the confetti finale (theme-derived).
  confettiColors?: string[]
}

export function ThankYouScreen({
  title,
  message,
  hideBranding = false,
  theme,
  gamify,
  confettiColors,
}: ThankYouScreenProps) {
  const confettiRef = useRef<ConfettiHandle | null>(null)
  const fired = useRef(false)

  useEffect(() => {
    if (!gamify || fired.current) return
    fired.current = true
    // Slight delay so the badge has scaled in before the finale rains down.
    const t = setTimeout(() => confettiRef.current?.finale(confettiColors), 280)
    return () => clearTimeout(t)
  }, [gamify, confettiColors])

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: theme.backgroundColor, fontFamily: theme.font }}
    >
      {gamify && <Confetti ref={confettiRef} colors={confettiColors} zIndex={5} />}

      <div className="w-full max-w-xl text-center relative" style={{ zIndex: 10 }}>
        {gamify ? (
          <div className="mb-8 flex justify-center">
            <RewardBadge xp={gamify.xp} primary={theme.primaryColor} text={theme.textColor} />
          </div>
        ) : (
          <div
            className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center animate-scale-in"
            style={{ backgroundColor: theme.primaryColor }}
          >
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: theme.textColor }}>
          {title || 'Thank you!'}
        </h1>
        <p className="text-lg md:text-xl opacity-70" style={{ color: theme.textColor }}>
          {message || 'Your response has been recorded.'}
        </p>
        {!hideBranding && (
          <p className="text-xs mt-12 opacity-40" style={{ color: theme.textColor }}>
            Powered by <span className="font-semibold">Stoneforms</span>
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes scale-in { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scale-in { animation: scale-in 0.45s ease-out; }
      `}</style>
    </div>
  )
}
