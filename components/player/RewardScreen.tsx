'use client'

import { Zap, Trophy } from 'lucide-react'
import { levelFromXp, badgeForLevel } from '@/lib/gamify'

interface RewardBadgeProps {
  xp: number
  primary: string
  text: string
  reduceMotion?: boolean
  // When true, render compact (used alongside the quiz result, which already
  // has its own hero). When false, render the full hero badge.
  compact?: boolean
}

// The end-reward badge: total XP earned, the level reached, and a friendly badge
// title, on a celebratory animated chip. Designed to layer into ThankYouScreen
// or sit above/below the QuizResultScreen without replacing it.
export function RewardBadge({ xp, primary, text, reduceMotion, compact = false }: RewardBadgeProps) {
  const { level, progress } = levelFromXp(xp)
  const badge = badgeForLevel(level)

  if (compact) {
    return (
      <div
        className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl"
        style={{
          backgroundColor: `${primary}14`,
          boxShadow: `inset 0 0 0 1px ${primary}33`,
          animation: reduceMotion ? undefined : 'sf-reward-pop 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        <span className="flex items-center gap-1.5 font-bold" style={{ color: primary }}>
          <Zap className="w-4 h-4" fill={primary} /> {xp} XP
        </span>
        <span className="opacity-30" style={{ color: text }}>•</span>
        <span className="font-bold" style={{ color: text }}>
          Level {level}
        </span>
        <span
          className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
          style={{ backgroundColor: primary, color: '#fff' }}
        >
          {badge}
        </span>
        <style jsx>{`
          @keyframes sf-reward-pop {
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    )
  }

  const R = 34
  const C = 2 * Math.PI * R
  const dash = C * Math.min(1, Math.max(0, progress))

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative mb-5"
        style={{
          width: 96,
          height: 96,
          animation: reduceMotion ? undefined : 'sf-reward-pop 0.55s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        <svg width="96" height="96" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="40" cy="40" r={R} fill="none" stroke={`${text}1a`} strokeWidth="5" />
          <circle
            cx="40"
            cy="40"
            r={R}
            fill="none"
            stroke={primary}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${C}`}
          />
        </svg>
        <div
          className="absolute inset-2 rounded-full flex items-center justify-center"
          style={{ backgroundColor: primary }}
        >
          <Trophy className="w-9 h-9 text-white" strokeWidth={2} />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-1">
        <span className="text-3xl font-extrabold" style={{ color: primary }}>
          <span className="inline-flex items-center gap-1.5">
            <Zap className="w-6 h-6" fill={primary} stroke={primary} /> {xp}
          </span>
        </span>
        <span className="text-xl font-bold opacity-60" style={{ color: text }}>XP earned</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-base font-bold" style={{ color: text }}>Level {level}</span>
        <span
          className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
          style={{ backgroundColor: primary, color: '#fff' }}
        >
          {badge}
        </span>
      </div>

      <style jsx>{`
        @keyframes sf-reward-pop {
          0% { opacity: 0; transform: scale(0.7) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}
