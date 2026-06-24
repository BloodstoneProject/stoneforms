'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Question } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Star, Check, Heart, ThumbsUp, Circle } from 'lucide-react'
import { FileUploadField } from '@/components/player/FileUploadField'
import { SignatureField } from '@/components/player/SignatureField'
import { AddressField } from '@/components/player/AddressField'
import { ConsentField } from '@/components/player/ConsentField'
import { CalculatorField } from '@/components/player/CalculatorField'
import { PaymentField } from '@/components/player/PaymentField'

interface QuestionRendererProps {
  question: Question
  value: any
  error?: string
  onChange: (value: any) => void
  // All current answers, keyed by field id — needed by computed fields (calculator).
  allAnswers?: Record<string, any>
  theme: {
    primaryColor: string
    backgroundColor: string
    textColor: string
  }
}

export function QuestionRenderer({
  question,
  value,
  error,
  onChange,
  allAnswers = {},
  theme,
}: QuestionRendererProps) {
  const labelId = `sf-q-${question.id}`
  const descId = question.description ? `sf-qd-${question.id}` : undefined
  const errorId = error ? `sf-qe-${question.id}` : undefined
  // Programmatic accessible name + description/error for the control(s) below.
  const a11y = { labelId, descId, errorId }

  return (
    <div className="space-y-6">
      {/* Question Label */}
      <div>
        <h2
          id={labelId}
          className="text-3xl md:text-4xl font-bold mb-3"
          style={{ color: theme.textColor }}
        >
          {question.label}
          {question.required && (
            <span className="text-red-500 ml-1" aria-hidden="true">*</span>
          )}
        </h2>
        {question.description && (
          <p
            id={descId}
            className="text-lg"
            style={{ color: theme.textColor, opacity: 0.7 }}
          >
            {question.description}
          </p>
        )}
      </div>

      {/* Question Input */}
      <div>
        {renderQuestionInput(question, value, onChange, theme, allAnswers, a11y)}
      </div>

      {/* Error Message */}
      {error && (
        <div
          id={errorId}
          role="alert"
          className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  )
}

interface A11y {
  labelId: string
  descId?: string
  errorId?: string
}

// Per-field config lives on field.settings, mapped onto question.properties by
// lib/form-mapping. Safe accessor with a default that preserves prior behaviour.
function settingsOf(question: Question): Record<string, any> {
  return (question.properties as Record<string, any>) || {}
}

// Deterministic shuffle keyed by the question id so a randomized choice order is
// stable across re-renders within one session (avoids options jumping on keypress).
function seededShuffle<T>(arr: T[], seed: string): T[] {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  const rand = () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// Keyboard hotkey label for the i-th choice: A,B,C… (then 1,2,3…). Used as the
// visible badge AND the key respondents press to pick that option.
function hotkeyFor(i: number): string {
  if (i < 26) return String.fromCharCode(65 + i)
  return String(i - 26 + 1)
}

// Minimal ISO-2 -> dial-code list for the phone country picker. Common-first.
const PHONE_COUNTRIES: { iso: string; name: string; dial: string }[] = [
  { iso: 'GB', name: 'United Kingdom', dial: '+44' },
  { iso: 'US', name: 'United States', dial: '+1' },
  { iso: 'CA', name: 'Canada', dial: '+1' },
  { iso: 'IE', name: 'Ireland', dial: '+353' },
  { iso: 'AU', name: 'Australia', dial: '+61' },
  { iso: 'NZ', name: 'New Zealand', dial: '+64' },
  { iso: 'DE', name: 'Germany', dial: '+49' },
  { iso: 'FR', name: 'France', dial: '+33' },
  { iso: 'ES', name: 'Spain', dial: '+34' },
  { iso: 'IT', name: 'Italy', dial: '+39' },
  { iso: 'NL', name: 'Netherlands', dial: '+31' },
  { iso: 'PT', name: 'Portugal', dial: '+351' },
  { iso: 'SE', name: 'Sweden', dial: '+46' },
  { iso: 'NO', name: 'Norway', dial: '+47' },
  { iso: 'DK', name: 'Denmark', dial: '+45' },
  { iso: 'CH', name: 'Switzerland', dial: '+41' },
  { iso: 'AT', name: 'Austria', dial: '+43' },
  { iso: 'BE', name: 'Belgium', dial: '+32' },
  { iso: 'PL', name: 'Poland', dial: '+48' },
  { iso: 'IN', name: 'India', dial: '+91' },
  { iso: 'AE', name: 'UAE', dial: '+971' },
  { iso: 'SG', name: 'Singapore', dial: '+65' },
  { iso: 'ZA', name: 'South Africa', dial: '+27' },
  { iso: 'BR', name: 'Brazil', dial: '+55' },
  { iso: 'MX', name: 'Mexico', dial: '+52' },
  { iso: 'JP', name: 'Japan', dial: '+81' },
]

function dialForCountry(iso: string | undefined): string {
  const c = PHONE_COUNTRIES.find((x) => x.iso === (iso || '').toUpperCase())
  return c?.dial || '+44'
}

// Rating icon picker.
function RatingIcon({ kind, filled, color }: { kind: string; filled: boolean; color: string }) {
  const cls = cn('w-8 h-8', filled && 'fill-current')
  if (kind === 'heart') return <Heart aria-hidden="true" className={cls} style={{ color }} />
  if (kind === 'thumb') return <ThumbsUp aria-hidden="true" className={cls} style={{ color }} />
  if (kind === 'circle') return <Circle aria-hidden="true" className={cls} style={{ color }} />
  return <Star aria-hidden="true" className={cls} style={{ color }} />
}

function renderQuestionInput(
  question: Question,
  value: any,
  onChange: (value: any) => void,
  theme: { primaryColor: string; backgroundColor: string; textColor: string },
  allAnswers: Record<string, any>,
  a11y: A11y
) {
  // `describedby` chains the description + error so screen readers announce both.
  const describedBy = [a11y.descId, a11y.errorId].filter(Boolean).join(' ') || undefined
  // For single inputs: name them by the question heading + describe by desc/error.
  const inputA11y = {
    'aria-labelledby': a11y.labelId,
    'aria-describedby': describedBy,
    'aria-invalid': a11y.errorId ? true : undefined,
    'aria-required': question.required || undefined,
  } as const
  // For grouped controls (choices/rating/scale): a labelled radiogroup/group wrapper.
  const groupA11y = {
    role: 'group' as const,
    'aria-labelledby': a11y.labelId,
    'aria-describedby': describedBy,
  }

  // Cast to string: 'nps' is a valid runtime field type (see lib/field-types)
  // but the legacy QuestionType union in types/ doesn't list it yet.
  switch (question.type as string) {
    case 'short_text':
      return (
        <TextField
          question={question}
          value={typeof value === 'string' ? value : ''}
          onChange={onChange}
          theme={theme}
          inputA11y={inputA11y}
          multiline={false}
        />
      )

    case 'long_text':
      return (
        <TextField
          question={question}
          value={typeof value === 'string' ? value : ''}
          onChange={onChange}
          theme={theme}
          inputA11y={inputA11y}
          multiline
        />
      )

    case 'email':
      return (
        <Input
          {...inputA11y}
          type="email"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder || 'name@example.com'}
          className="text-xl py-6 border-2 focus:ring-2"
          style={{ borderColor: '#e8e4db' }}
          autoFocus
        />
      )

    case 'phone':
      return (
        <PhoneField
          question={question}
          value={typeof value === 'string' ? value : ''}
          onChange={onChange}
          theme={theme}
          inputA11y={inputA11y}
        />
      )

    case 'url':
      return (
        <Input
          {...inputA11y}
          type="url"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder || 'https://example.com'}
          className="text-xl py-6 border-2 focus:ring-2"
          style={{ borderColor: '#e8e4db' }}
          autoFocus
        />
      )

    case 'number':
      return (
        <Input
          {...inputA11y}
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder || 'Enter a number...'}
          className="text-xl py-6 border-2 focus:ring-2"
          style={{ borderColor: '#e8e4db' }}
          autoFocus
          min={question.validation?.min}
          max={question.validation?.max}
        />
      )

    case 'multiple_choice':
      return (
        <ChoiceField
          question={question}
          value={value}
          onChange={onChange}
          theme={theme}
          a11y={a11y}
          describedBy={describedBy}
          mode="single"
        />
      )

    case 'checkboxes':
      return (
        <ChoiceField
          question={question}
          value={value}
          onChange={onChange}
          theme={theme}
          a11y={a11y}
          describedBy={describedBy}
          mode="multi"
        />
      )

    case 'dropdown':
      return (
        <DropdownField
          question={question}
          value={typeof value === 'string' ? value : ''}
          onChange={onChange}
          theme={theme}
          inputA11y={inputA11y}
        />
      )

    case 'rating': {
      const s = settingsOf(question)
      // Default scale 5 (today's behaviour). Clamp to a sane 1..10 range.
      const scale = Math.max(1, Math.min(10, Number(s.scale) || 5))
      const icon = (s.icon as string) || 'star'
      return (
        <div className="flex flex-wrap gap-2 justify-center md:justify-start" role="radiogroup" aria-labelledby={a11y.labelId} aria-describedby={describedBy}>
          {Array.from({ length: scale }, (_, i) => i + 1).map((n) => {
            const isSelected = typeof value === 'number' && value >= n
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={value === n}
                aria-label={`${n} of ${scale}`}
                onClick={() => onChange(n)}
                className={cn(
                  'w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl border-2 flex items-center justify-center transition-all hover:scale-110',
                  isSelected && 'ring-2'
                )}
                style={isSelected
                  ? { borderColor: theme.primaryColor, backgroundColor: `${theme.primaryColor}10` }
                  : { borderColor: '#e8e4db' }
                }
              >
                <RatingIcon kind={icon} filled={isSelected} color={isSelected ? theme.primaryColor : '#3d5948'} />
              </button>
            )
          })}
        </div>
      )
    }

    case 'opinion_scale': {
      const s = settingsOf(question)
      const min = Number.isFinite(Number(s.min)) ? Number(s.min) : 0
      const maxRaw = Number.isFinite(Number(s.max)) ? Number(s.max) : 10
      // Guard against an inverted/oversized range.
      const max = Math.max(min, Math.min(min + 20, maxRaw))
      const leftLabel = typeof s.leftLabel === 'string' ? s.leftLabel : 'Not likely'
      const rightLabel = typeof s.rightLabel === 'string' ? s.rightLabel : 'Very likely'
      const steps: number[] = []
      for (let n = min; n <= max; n++) steps.push(n)
      return (
        <div role="radiogroup" aria-labelledby={a11y.labelId} aria-describedby={describedBy}>
          <div className="flex flex-wrap gap-2">
            {steps.map((n) => {
              const isSelected = value === n
              return (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={String(n)}
                  onClick={() => onChange(n)}
                  className={cn(
                    'w-12 h-12 rounded-lg border-2 flex items-center justify-center font-semibold transition-all hover:scale-105',
                    isSelected && 'ring-2'
                  )}
                  style={isSelected
                    ? { borderColor: theme.primaryColor, backgroundColor: theme.primaryColor, color: '#fff' }
                    : { borderColor: `${theme.textColor}33`, color: theme.textColor }
                  }
                >
                  {n}
                </button>
              )
            })}
          </div>
          {(leftLabel || rightLabel) && (
            <div className="flex justify-between mt-2 text-sm opacity-60" style={{ color: theme.textColor }}>
              <span>{leftLabel}</span>
              <span>{rightLabel}</span>
            </div>
          )}
        </div>
      )
    }

    case 'nps': {
      const s = settingsOf(question)
      const leftLabel = typeof s.leftLabel === 'string' ? s.leftLabel : 'Not at all likely'
      const rightLabel = typeof s.rightLabel === 'string' ? s.rightLabel : 'Extremely likely'
      // NPS is a fixed 0..10 scale. 0-6 detractor, 7-8 passive, 9-10 promoter.
      const npsColor = (n: number, selected: boolean): React.CSSProperties => {
        if (!selected) return { borderColor: `${theme.textColor}33`, color: theme.textColor }
        const band = n <= 6 ? '#dc2626' : n <= 8 ? '#d97706' : '#16a34a'
        return { borderColor: band, backgroundColor: band, color: '#fff' }
      }
      return (
        <div role="radiogroup" aria-labelledby={a11y.labelId} aria-describedby={describedBy}>
          <div className="grid grid-cols-6 sm:grid-cols-11 gap-2">
            {Array.from({ length: 11 }, (_, n) => {
              const isSelected = value === n
              return (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${n}${n === 0 ? ` — ${leftLabel}` : n === 10 ? ` — ${rightLabel}` : ''}`}
                  onClick={() => onChange(n)}
                  className={cn(
                    'h-12 rounded-lg border-2 flex items-center justify-center font-semibold transition-all hover:scale-105',
                    isSelected && 'ring-2'
                  )}
                  style={npsColor(n, isSelected)}
                >
                  {n}
                </button>
              )
            })}
          </div>
          <div className="flex justify-between mt-2 text-sm opacity-60" style={{ color: theme.textColor }}>
            <span>{leftLabel}</span>
            <span>{rightLabel}</span>
          </div>
        </div>
      )
    }

    case 'ranking': {
      const allValues = question.choices?.map((c) => c.value) || []
      const order: string[] = Array.isArray(value) && value.length === allValues.length ? value : allValues
      const move = (from: number, to: number) => {
        if (to < 0 || to >= order.length) return
        const next = [...order]
        const [item] = next.splice(from, 1)
        next.splice(to, 0, item)
        onChange(next)
      }
      const labelFor = (val: string) => question.choices?.find((c) => c.value === val)?.label || val
      return (
        <div className="space-y-2">
          {order.map((val, i) => (
            <div
              key={val}
              className="flex items-center gap-3 p-3 rounded-xl border-2"
              style={{ borderColor: `${theme.textColor}22` }}
            >
              <span
                className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: theme.primaryColor, color: '#fff' }}
              >
                {i + 1}
              </span>
              <span className="flex-1 font-medium" style={{ color: theme.textColor }}>{labelFor(val)}</span>
              <div className="flex flex-col">
                <button onClick={() => move(i, i - 1)} disabled={i === 0} className="px-2 leading-none disabled:opacity-30" style={{ color: theme.textColor }} aria-label="Move up">▲</button>
                <button onClick={() => move(i, i + 1)} disabled={i === order.length - 1} className="px-2 leading-none disabled:opacity-30" style={{ color: theme.textColor }} aria-label="Move down">▼</button>
              </div>
            </div>
          ))}
          <p className="text-sm opacity-50" style={{ color: theme.textColor }}>Order them from most to least preferred.</p>
        </div>
      )
    }

    case 'statement':
      // Informational block — no input. The label/description carry the message.
      return null

    case 'page_break':
      // Purely structural divider — splits the flow into pages, renders nothing.
      return null

    case 'yes_no':
      return (
        <div className="grid grid-cols-2 gap-4" role="radiogroup" aria-labelledby={a11y.labelId} aria-describedby={describedBy}>
          <button
            role="radio"
            aria-checked={value === true}
            onClick={() => onChange(true)}
            className={cn(
              'py-8 px-6 rounded-xl border-2 font-semibold text-xl transition-all hover:shadow-md',
              value === true && 'ring-2'
            )}
            style={value === true
              ? { borderColor: theme.primaryColor, backgroundColor: `${theme.primaryColor}10`, color: theme.primaryColor }
              : { borderColor: '#e8e4db', color: theme.textColor }
            }
          >
            Yes
          </button>
          <button
            role="radio"
            aria-checked={value === false}
            onClick={() => onChange(false)}
            className={cn(
              'py-8 px-6 rounded-xl border-2 font-semibold text-xl transition-all hover:shadow-md',
              value === false && 'ring-2'
            )}
            style={value === false
              ? { borderColor: theme.primaryColor, backgroundColor: `${theme.primaryColor}10`, color: theme.primaryColor }
              : { borderColor: '#e8e4db', color: theme.textColor }
            }
          >
            No
          </button>
        </div>
      )

    case 'date': {
      const s = settingsOf(question)
      const mode = (s.mode as string) === 'time' || (s.mode as string) === 'datetime' ? s.mode : 'date'
      const inputType = mode === 'time' ? 'time' : mode === 'datetime' ? 'datetime-local' : 'date'
      return (
        <Input
          {...inputA11y}
          type={inputType}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          min={typeof s.min === 'string' ? s.min : undefined}
          max={typeof s.max === 'string' ? s.max : undefined}
          className="text-xl py-6 border-2 focus:ring-2"
          style={{ borderColor: '#e8e4db' }}
          autoFocus
        />
      )
    }

    case 'file_upload':
      return (
        <FileUploadField
          value={typeof value === 'string' ? value : undefined}
          onChange={onChange}
          theme={{ primaryColor: theme.primaryColor, textColor: theme.textColor }}
        />
      )

    case 'picture_choice':
      return (
        <PictureChoiceField
          question={question}
          value={value}
          onChange={onChange}
          theme={theme}
          a11y={a11y}
          describedBy={describedBy}
        />
      )

    case 'signature':
      return (
        <SignatureField
          value={typeof value === 'string' ? value : undefined}
          onChange={onChange}
          theme={{ primaryColor: theme.primaryColor, textColor: theme.textColor }}
        />
      )

    case 'address':
      return (
        <AddressField
          value={value && typeof value === 'object' ? value : undefined}
          onChange={onChange}
          theme={{ primaryColor: theme.primaryColor, textColor: theme.textColor }}
        />
      )

    case 'consent': {
      const props = question.properties || {}
      return (
        <ConsentField
          value={value === true}
          onChange={onChange}
          label={props.consentLabel || question.placeholder}
          policyUrl={props.policyUrl}
          policyText={props.policyText}
          theme={{ primaryColor: theme.primaryColor, textColor: theme.textColor }}
        />
      )
    }

    case 'calculator':
      return (
        <CalculatorField
          field={{ properties: question.properties, settings: question.properties }}
          answers={allAnswers}
          theme={{ primaryColor: theme.primaryColor, textColor: theme.textColor }}
        />
      )

    case 'payment': {
      // Config lives at field.settings.payment -> question.properties.payment.
      const pay = (question.properties?.payment as Record<string, any>) || {}
      // The player injects whether the owner can actually accept payments under
      // properties._canAcceptPayments (defaults to true when unknown).
      const canAcceptPayments = question.properties?._canAcceptPayments !== false
      return (
        <PaymentField
          amount={typeof pay.amount === 'number' ? pay.amount : Number(pay.amount)}
          currency={pay.currency}
          description={pay.description}
          canAcceptPayments={canAcceptPayments}
          theme={{ primaryColor: theme.primaryColor, textColor: theme.textColor }}
        />
      )
    }

    default:
      return (
        <Input
          {...inputA11y}
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer here..."
          className="text-xl py-6 border-2 focus:ring-2"
          style={{ borderColor: '#e8e4db' }}
          autoFocus
        />
      )
  }
}

// ===================== Field subcomponents =====================
// These need local state/effects (hotkeys, "Other" write-in, live counters),
// so they live as components rather than inline in the switch.

type RendererTheme = { primaryColor: string; backgroundColor: string; textColor: string }
type InputA11y = {
  'aria-labelledby': string
  'aria-describedby': string | undefined
  'aria-invalid': true | undefined
  'aria-required': true | undefined
}

const OTHER_VALUE = '__other__'

// ---- Text (short_text / long_text): prefill default + live max-length counter
function TextField({
  question, value, onChange, theme, inputA11y, multiline,
}: {
  question: Question; value: string; onChange: (v: any) => void
  theme: RendererTheme; inputA11y: InputA11y; multiline: boolean
}) {
  const s = settingsOf(question)
  // settings.maxLength wins; fall back to legacy validation.maxLength.
  const maxLength: number | undefined =
    Number.isFinite(Number(s.maxLength)) && Number(s.maxLength) > 0
      ? Number(s.maxLength)
      : (question.validation?.maxLength || undefined)
  const defaultVal = typeof s.default === 'string' ? s.default : ''
  // Prefill the author default once, when the field is still empty.
  const seeded = useRef(false)
  useEffect(() => {
    if (seeded.current) return
    seeded.current = true
    if (defaultVal && (value === undefined || value === null || value === '')) {
      onChange(defaultVal)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const len = (value || '').length
  const over = maxLength !== undefined && len > maxLength
  const counter = maxLength !== undefined && (
    <div
      className="mt-1.5 text-sm text-right tabular-nums"
      aria-live="polite"
      style={{ color: over ? '#dc2626' : theme.textColor, opacity: over ? 1 : 0.55 }}
    >
      {len} / {maxLength}
    </div>
  )
  return (
    <div>
      {multiline ? (
        <textarea
          {...inputA11y}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder || 'Type your answer here...'}
          rows={6}
          maxLength={maxLength}
          className="w-full rounded-lg border-2 p-4 text-lg focus:ring-2 focus:outline-none"
          style={{ borderColor: '#e8e4db' }}
          autoFocus
        />
      ) : (
        <Input
          {...inputA11y}
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder || 'Type your answer here...'}
          maxLength={maxLength}
          className="text-xl py-6 border-2 focus:ring-2"
          style={{ borderColor: '#e8e4db' }}
          autoFocus
        />
      )}
      {counter}
    </div>
  )
}

// ---- Phone: country-code picker (settings.defaultCountry) + national number.
// Stores an E.164-ish string: "<dial><national digits>" e.g. "+447700900123".
function PhoneField({
  question, value, onChange, theme, inputA11y,
}: {
  question: Question; value: string; onChange: (v: any) => void
  theme: RendererTheme; inputA11y: InputA11y
}) {
  const s = settingsOf(question)
  const defaultDial = dialForCountry(s.defaultCountry)
  // Split a stored E.164-ish value back into dial + national for editing.
  const matchedDial = useMemo(() => {
    const v = (value || '').trim()
    if (!v.startsWith('+')) return defaultDial
    // Longest matching dial code wins (+1 vs +44 vs +353).
    const dials = [...new Set(PHONE_COUNTRIES.map((c) => c.dial))].sort((a, b) => b.length - a.length)
    return dials.find((d) => v.startsWith(d)) || defaultDial
  }, [value, defaultDial])
  const national = (() => {
    const v = (value || '').trim()
    if (v.startsWith(matchedDial)) return v.slice(matchedDial.length).replace(/^\s+/, '')
    if (v.startsWith('+')) return v // unknown code: keep raw
    return v
  })()
  const setParts = (dial: string, nat: string) => {
    const digits = nat.replace(/[^\d]/g, '')
    onChange(digits ? `${dial}${digits}` : '')
  }
  return (
    <div className="flex gap-2">
      <select
        aria-label="Country code"
        value={matchedDial}
        onChange={(e) => setParts(e.target.value, national)}
        className="rounded-lg border-2 px-3 text-lg focus:ring-2 focus:outline-none"
        style={{ borderColor: '#e8e4db', color: theme.textColor, maxWidth: '8.5rem' }}
      >
        {PHONE_COUNTRIES.map((c) => (
          <option key={c.iso} value={c.dial}>
            {c.iso} {c.dial}
          </option>
        ))}
      </select>
      <Input
        {...inputA11y}
        type="tel"
        inputMode="tel"
        value={national}
        onChange={(e) => setParts(matchedDial, e.target.value)}
        placeholder={question.placeholder || '7700 900123'}
        className="text-xl py-6 border-2 focus:ring-2 flex-1"
        style={{ borderColor: '#e8e4db' }}
        autoFocus
      />
    </div>
  )
}

// ---- Choice (multiple_choice single / checkboxes multi): hotkeys, randomize,
// min/max select enforcement (multi), optional "Other" write-in.
function ChoiceField({
  question, value, onChange, theme, a11y, describedBy, mode,
}: {
  question: Question; value: any; onChange: (v: any) => void
  theme: RendererTheme; a11y: A11y; describedBy?: string; mode: 'single' | 'multi'
}) {
  const s = settingsOf(question)
  const allowOther = s.allowOther === true
  const randomize = s.randomize === true
  const minSelect = Number.isFinite(Number(s.minSelect)) ? Number(s.minSelect) : undefined
  const maxSelect = Number.isFinite(Number(s.maxSelect)) && Number(s.maxSelect) > 0 ? Number(s.maxSelect) : undefined

  const baseChoices = question.choices || []
  const ordered = useMemo(
    () => (randomize ? seededShuffle(baseChoices, question.id) : baseChoices),
    [baseChoices, randomize, question.id]
  )
  const items = useMemo(
    () => (allowOther ? [...ordered, { id: OTHER_VALUE, label: 'Other', value: OTHER_VALUE }] : ordered),
    [ordered, allowOther]
  )

  // ---- value plumbing ----
  const selectedArr: string[] = mode === 'multi' ? (Array.isArray(value) ? value : []) : (value !== undefined && value !== null && value !== '' ? [String(value)] : [])
  const [otherText, setOtherText] = useState('')

  const isSel = (v: string) => selectedArr.includes(v)

  const pickSingle = (v: string) => {
    if (v === OTHER_VALUE) { onChange(OTHER_VALUE); return }
    onChange(v)
  }
  const toggleMulti = (v: string) => {
    const has = selectedArr.includes(v)
    let next: string[]
    if (has) next = selectedArr.filter((x) => x !== v)
    else {
      if (maxSelect !== undefined && selectedArr.length >= maxSelect) return // cap reached
      next = [...selectedArr, v]
    }
    onChange(next)
  }
  const onPick = (v: string) => (mode === 'single' ? pickSingle(v) : toggleMulti(v))

  // ---- keyboard hotkeys (A/B/C… then 1/2/3…) ----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't hijack typing in inputs/textareas/selects.
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || (t as any).isContentEditable)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const key = e.key.toUpperCase()
      const idx = items.findIndex((_, i) => hotkeyFor(i) === key)
      if (idx >= 0) {
        e.preventDefault()
        e.stopPropagation()
        onPick(items[idx].value)
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, selectedArr, mode, maxSelect])

  const helper = (() => {
    const bits: string[] = []
    if (mode === 'multi' && minSelect) bits.push(`Choose at least ${minSelect}`)
    if (mode === 'multi' && maxSelect) bits.push(`up to ${maxSelect}`)
    return bits.length ? bits.join(', ') : null
  })()

  return (
    <div
      className="space-y-3"
      role={mode === 'single' ? 'radiogroup' : 'group'}
      aria-labelledby={a11y.labelId}
      aria-describedby={describedBy}
    >
      {items.map((choice, i) => {
        const selected = isSel(choice.value)
        const atCap = mode === 'multi' && !selected && maxSelect !== undefined && selectedArr.length >= maxSelect
        return (
          <button
            key={choice.id}
            type="button"
            role={mode === 'single' ? 'radio' : 'checkbox'}
            aria-checked={selected}
            aria-keyshortcuts={hotkeyFor(i)}
            disabled={atCap}
            onClick={() => onPick(choice.value)}
            className={cn(
              'w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left hover:shadow-sm',
              selected && 'ring-2',
              atCap && 'opacity-50 cursor-not-allowed'
            )}
            style={selected
              ? { borderColor: theme.primaryColor, backgroundColor: `${theme.primaryColor}14` }
              : { borderColor: `${theme.textColor}22` }
            }
          >
            <span
              aria-hidden="true"
              className={cn(
                'w-7 h-7 border-2 flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all',
                mode === 'single' ? 'rounded-md' : 'rounded-md'
              )}
              style={selected
                ? { backgroundColor: theme.primaryColor, borderColor: theme.primaryColor, color: '#fff' }
                : { borderColor: `${theme.textColor}33`, color: theme.textColor }
              }
            >
              {selected && mode === 'multi' ? <Check className="w-4 h-4" /> : hotkeyFor(i)}
            </span>
            <span className="text-lg font-medium flex-1" style={{ color: theme.textColor }}>
              {choice.label}
            </span>
            {selected && mode === 'single' && (
              <Check className="w-5 h-5 flex-shrink-0" style={{ color: theme.primaryColor }} aria-hidden="true" />
            )}
          </button>
        )
      })}

      {/* "Other" write-in: revealed when the Other option is selected. */}
      {allowOther && (mode === 'single' ? value === OTHER_VALUE : selectedArr.includes(OTHER_VALUE)) && (
        <Input
          type="text"
          value={otherText}
          aria-label="Other — please specify"
          onChange={(e) => {
            setOtherText(e.target.value)
            const txt = e.target.value
            if (mode === 'single') {
              onChange(txt ? `Other: ${txt}` : OTHER_VALUE)
            } else {
              const without = selectedArr.filter((v) => v !== OTHER_VALUE && !v.startsWith('Other: '))
              onChange(txt ? [...without, OTHER_VALUE, `Other: ${txt}`] : [...without, OTHER_VALUE])
            }
          }}
          placeholder="Please specify…"
          className="text-lg py-5 border-2 focus:ring-2"
          style={{ borderColor: theme.primaryColor }}
        />
      )}

      {helper && (
        <p className="text-sm opacity-55" style={{ color: theme.textColor }} aria-live="polite">{helper}</p>
      )}
    </div>
  )
}

// ---- Dropdown: settings-driven (allowOther + randomize). Single value.
function DropdownField({
  question, value, onChange, theme, inputA11y,
}: {
  question: Question; value: string; onChange: (v: any) => void
  theme: RendererTheme; inputA11y: InputA11y
}) {
  const s = settingsOf(question)
  const randomize = s.randomize === true
  const allowOther = s.allowOther === true
  const baseChoices = question.choices || []
  const ordered = useMemo(
    () => (randomize ? seededShuffle(baseChoices, question.id) : baseChoices),
    [baseChoices, randomize, question.id]
  )
  const isOther = value === OTHER_VALUE || (typeof value === 'string' && value.startsWith('Other: '))
  const [otherText, setOtherText] = useState(typeof value === 'string' && value.startsWith('Other: ') ? value.slice(7) : '')
  return (
    <div className="space-y-3">
      <select
        {...inputA11y}
        value={isOther ? OTHER_VALUE : (value || '')}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border-2 p-4 text-lg focus:ring-2 focus:outline-none"
        style={{ borderColor: '#e8e4db', color: theme.textColor }}
        autoFocus
      >
        <option value="">Select an option...</option>
        {ordered.map((choice) => (
          <option key={choice.id} value={choice.value}>{choice.label}</option>
        ))}
        {allowOther && <option value={OTHER_VALUE}>Other</option>}
      </select>
      {allowOther && isOther && (
        <Input
          type="text"
          value={otherText}
          aria-label="Other — please specify"
          onChange={(e) => { setOtherText(e.target.value); onChange(e.target.value ? `Other: ${e.target.value}` : OTHER_VALUE) }}
          placeholder="Please specify…"
          className="text-lg py-5 border-2 focus:ring-2"
          style={{ borderColor: theme.primaryColor }}
        />
      )}
    </div>
  )
}

// ---- Picture choice: hotkeys + randomize. Single-select (value = string),
// preserving the existing value shape and behaviour by default.
function PictureChoiceField({
  question, value, onChange, theme, a11y, describedBy,
}: {
  question: Question; value: any; onChange: (v: any) => void
  theme: RendererTheme; a11y: A11y; describedBy?: string
}) {
  const s = settingsOf(question)
  const randomize = s.randomize === true
  const images: Record<string, string> = (s.images as Record<string, string>) || {}
  const baseChoices = question.choices || []
  const ordered = useMemo(
    () => (randomize ? seededShuffle(baseChoices, question.id) : baseChoices),
    [baseChoices, randomize, question.id]
  )
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || (t as any).isContentEditable)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const key = e.key.toUpperCase()
      const idx = ordered.findIndex((_, i) => hotkeyFor(i) === key)
      if (idx >= 0) { e.preventDefault(); e.stopPropagation(); onChange(ordered[idx].value) }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordered])
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4" role="radiogroup" aria-labelledby={a11y.labelId} aria-describedby={describedBy}>
      {ordered.map((choice, i) => {
        const isSelected = value === choice.value
        const img = images[choice.value]
        return (
          <button
            key={choice.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={choice.label}
            aria-keyshortcuts={hotkeyFor(i)}
            onClick={() => onChange(choice.value)}
            className={cn(
              'group flex flex-col rounded-xl border-2 overflow-hidden transition-all text-left hover:shadow-md',
              isSelected && 'ring-2'
            )}
            style={isSelected
              ? { borderColor: theme.primaryColor, backgroundColor: `${theme.primaryColor}10` }
              : { borderColor: `${theme.textColor}22` }
            }
          >
            <div className="relative w-full aspect-square flex items-center justify-center" style={{ backgroundColor: `${theme.textColor}08` }}>
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt={choice.label} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl opacity-30" aria-hidden="true">🖼️</span>
              )}
              <span
                aria-hidden="true"
                className="absolute top-2 left-2 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: `${theme.textColor}cc`, color: theme.backgroundColor }}
              >
                {hotkeyFor(i)}
              </span>
              {isSelected && (
                <span className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.primaryColor }}>
                  <Check className="w-4 h-4 text-white" aria-hidden="true" />
                </span>
              )}
            </div>
            <span className="px-3 py-2.5 text-sm font-medium" style={{ color: theme.textColor }}>
              {choice.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
