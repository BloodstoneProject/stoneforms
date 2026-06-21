'use client'

import { useEffect, useRef, useState } from 'react'
import { Zap, Flame } from 'lucide-react'
import { levelFromXp } from '@/lib/gamify'

interface GamifyHudProps {
  xp: number
  streak: number
  // Theme colors.
  primary: string
  text: string
  reduceMotion?: boolean
}

// A tasteful, theme-colored HUD pinned to the top-right. Shows total XP (with a
// count-up + flash when it changes), the current level on a filling "journey"
// ring/bar, and a streak flame. Unobtrusive, glassy, on-brand.
export function GamifyHud({ xp, streak, primary, text, reduceMotion }: GamifyHudProps) {
  const { level, progress } = levelFromXp(xp)
  const [displayXp, setDisplayXp] = useState(xp)
  const [bump, setBump] = useState(false)
  const prevXp = useRef(xp)
  const raf = useRef<number | null>(null)

  // Animated count-up toward the real XP value, with a brief scale bump on gain.
  useEffect(() => {
    if (xp === prevXp.current) return
    const gained = xp > prevXp.current
    if (reduceMotion) {
      setDisplayXp(xp)
      prevXp.current = xp
      if (gained) {
        setBump(true)
        const t = setTimeout(() => setBump(false), 280)
        return () => clearTimeout(t)
      }
      return
    }
    if (gained) {
      setBump(true)
      const t = setTimeout(() => setBump(false), 420)
      const from = prevXp.current
      const to = xp
      const start = performance.now()
      const dur = 600
      const tick = (now: number) => {
        const k = Math.min(1, (now - start) / dur)
        const eased = 1 - Math.pow(1 - k, 3)
        setDisplayXp(Math.round(from + (to - from) * eased))
        if (k < 1) raf.current = requestAnimationFrame(tick)
      }
      raf.current = requestAnimationFrame(tick)
      prevXp.current = xp
      return () => {
        clearTimeout(t)
        if (raf.current != null) cancelAnimationFrame(raf.current)
      }
    }
    setDisplayXp(xp)
    prevXp.current = xp
  }, [xp, reduceMotion])

  // Ring geometry for the level indicator.
  const R = 15
  const C = 2 * Math.PI * R
  const dash = C * Math.min(1, Math.max(0, progress))

  return (
    <div
      className="fixed top-3 right-3 z-40 select-none"
      style={{ fontVariantNumeric: 'tabular-nums' }}
      aria-hidden="true"
    >
      <div
        className="flex items-center gap-2.5 pl-2.5 pr-3 py-1.5 rounded-full backdrop-blur-md"
        style={{
          backgroundColor: `${text}0f`,
          boxShadow: `inset 0 0 0 1px ${text}14, 0 4px 14px ${text}12`,
        }}
      >
        {/* Level ring */}
        <div className="relative" style={{ width: 36, height: 36 }}>
          <svg width="36" height="36" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="18" cy="18" r={R} fill="none" stroke={`${text}1f`} strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r={R}
              fill="none"
              stroke={primary}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${C}`}
              style={{ transition: reduceMotion ? 'none' : 'stroke-dasharray 0.6s cubic-bezier(0.22,1,0.36,1)' }}
            />
          </svg>
          <span
            className="absolute inset-0 flex items-center justify-center text-[11px] font-bold"
            style={{ color: primary }}
          >
            {level}
          </span>
        </div>

        {/* XP */}
        <div
          className="flex items-center gap-1"
          style={{
            transform: bump && !reduceMotion ? 'scale(1.12)' : 'scale(1)',
            transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <Zap className="w-3.5 h-3.5" style={{ color: primary }} fill={primary} />
          <span className="text-sm font-bold leading-none" style={{ color: text }}>
            {displayXp}
          </span>
          <span className="text-[10px] font-semibold leading-none opacity-50" style={{ color: text }}>
            XP
          </span>
        </div>

        {/* Streak — only once it's worth showing */}
        {streak >= 2 && (
          <div
            className="flex items-center gap-0.5 pl-2"
            style={{ borderLeft: `1px solid ${text}1f` }}
            title={`${streak} in a row`}
          >
            <Flame className="w-3.5 h-3.5" style={{ color: '#f97316' }} fill="#f97316" />
            <span className="text-sm font-bold leading-none" style={{ color: text }}>
              {streak}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
