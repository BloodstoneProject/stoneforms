'use client'

import { getCalcConfig, computeCalc, formatCalc } from '@/lib/calc'

interface CalculatorFieldProps {
  // The full field/question carrying the calculation config in `properties`
  // (the mapped settings JSONB).
  field: { settings?: Record<string, any> | null; properties?: Record<string, any> | null }
  // All current answers, keyed by field id, so the value updates live.
  answers: Record<string, any>
  theme: { primaryColor: string; textColor: string }
}

// Read-only computed display. The actual numeric value is persisted to answers
// by the FormPlayer (and recomputed server-side); this just renders the result.
export function CalculatorField({ field, answers, theme }: CalculatorFieldProps) {
  const cfg = getCalcConfig(field)
  const value = computeCalc(field, answers)
  const display = formatCalc(value, cfg)
  return (
    <div
      className="rounded-xl border-2 px-6 py-5 flex items-center justify-center"
      style={{ borderColor: `${theme.primaryColor}33`, backgroundColor: `${theme.primaryColor}0d` }}
    >
      <span className="text-4xl font-bold tabular-nums" style={{ color: theme.primaryColor }}>
        {display}
      </span>
    </div>
  )
}
