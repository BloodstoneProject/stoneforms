'use client'

import { useRef } from 'react'
import { REACTION_EMOJIS, type ReactionEmoji } from '@/lib/gamify'

interface ReactionBarProps {
  // Currently selected emoji for this question (or undefined).
  value?: string
  // Toggle handler — passes the emoji and the tap point (for a localized pop).
  onSelect: (emoji: ReactionEmoji, point: { x: number; y: number }) => void
  // Theme colors for the selected chip.
  primary: string
  text: string
  reduceMotion?: boolean
}

// A tappable 👍 ❤️ 😮 🔥 row that sits under each question. Optional, never
// required, never blocks Next. Tapping selects one (re-tap to change/clear) with
// a springy pop. The parent fires a tiny localized confetti at the tap point.
export function ReactionBar({ value, onSelect, primary, text, reduceMotion }: ReactionBarProps) {
  const lastTapped = useRef<string | null>(null)

  return (
    <div className="mt-7" aria-label="React to this question">
      <p className="text-xs font-medium mb-2 opacity-50 select-none" style={{ color: text }}>
        How do you feel about this one?
      </p>
      <div className="flex items-center gap-2">
        {REACTION_EMOJIS.map((emoji) => {
          const selected = value === emoji
          return (
            <button
              key={emoji}
              type="button"
              aria-pressed={selected}
              aria-label={`React ${emoji}`}
              onPointerDown={() => { lastTapped.current = emoji }}
              onClick={(e) => {
                onSelect(emoji, { x: e.clientX, y: e.clientY })
              }}
              className="sf-reaction relative flex items-center justify-center text-2xl leading-none rounded-full transition-transform"
              style={{
                width: 48,
                height: 48,
                backgroundColor: selected ? `${primary}1f` : `${text}0d`,
                boxShadow: selected ? `inset 0 0 0 2px ${primary}` : 'inset 0 0 0 1px transparent',
                transform: selected ? 'scale(1.06)' : 'scale(1)',
                animation:
                  selected && !reduceMotion && lastTapped.current === emoji
                    ? 'sf-react-pop 0.42s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    : undefined,
              }}
            >
              <span style={{ filter: selected ? 'none' : 'grayscale(0.35)', opacity: selected ? 1 : 0.85 }}>
                {emoji}
              </span>
            </button>
          )
        })}
      </div>

      <style jsx>{`
        .sf-reaction:hover {
          transform: scale(1.08);
        }
        .sf-reaction:active {
          transform: scale(0.92);
        }
        @keyframes sf-react-pop {
          0% { transform: scale(0.7); }
          45% { transform: scale(1.28); }
          70% { transform: scale(0.96); }
          100% { transform: scale(1.06); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sf-reaction { transition: none !important; animation: none !important; }
        }
      `}</style>
    </div>
  )
}
