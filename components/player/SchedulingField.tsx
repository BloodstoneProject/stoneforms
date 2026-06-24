'use client'

import { useMemo } from 'react'

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export interface SchedulingSettings {
  days?: Partial<Record<Weekday, boolean>>
  startTime?: string // 'HH:MM'
  endTime?: string // 'HH:MM'
  slotMinutes?: number
  maxDaysAhead?: number
  leadDays?: number
  timezoneLabel?: string
}

// value = { date: 'YYYY-MM-DD', time: 'HH:MM' }
export interface SchedulingValue {
  date?: string
  time?: string
}

export const WEEKDAY_ORDER: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
export const WEEKDAY_LABELS: Record<Weekday, string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',
}

// Sensible defaults: Mon–Fri, 09:00–17:00, 30-min slots, 30 days ahead.
export const SCHEDULING_DEFAULTS: Required<Omit<SchedulingSettings, 'timezoneLabel'>> & { timezoneLabel?: string } = {
  days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
  startTime: '09:00',
  endTime: '17:00',
  slotMinutes: 30,
  maxDaysAhead: 30,
  leadDays: 0,
  timezoneLabel: undefined,
}

export function resolveScheduling(settings?: SchedulingSettings) {
  const days = { ...SCHEDULING_DEFAULTS.days, ...(settings?.days || {}) }
  return {
    days,
    startTime: settings?.startTime || SCHEDULING_DEFAULTS.startTime,
    endTime: settings?.endTime || SCHEDULING_DEFAULTS.endTime,
    slotMinutes: settings?.slotMinutes && settings.slotMinutes > 0 ? settings.slotMinutes : SCHEDULING_DEFAULTS.slotMinutes,
    maxDaysAhead: settings?.maxDaysAhead && settings.maxDaysAhead > 0 ? settings.maxDaysAhead : SCHEDULING_DEFAULTS.maxDaysAhead,
    leadDays: typeof settings?.leadDays === 'number' && settings.leadDays >= 0 ? settings.leadDays : SCHEDULING_DEFAULTS.leadDays,
    timezoneLabel: settings?.timezoneLabel,
  }
}

// 'YYYY-MM-DD' in local time (avoids UTC off-by-one from toISOString).
function toLocalDateString(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function weekdayOf(dateStr: string): Weekday {
  // Parse as local date.
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(y, (m || 1) - 1, d || 1)
  // JS getDay: 0=Sun..6=Sat. Map to our keys.
  const map: Weekday[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  return map[dt.getDay()]
}

function minutesToHHMM(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function hhmmToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

// Generate the list of 'HH:MM' slots for a day from [start, end) at slotMinutes.
export function generateSlots(startTime: string, endTime: string, slotMinutes: number): string[] {
  const start = hhmmToMinutes(startTime)
  const end = hhmmToMinutes(endTime)
  const step = slotMinutes > 0 ? slotMinutes : 30
  const out: string[] = []
  for (let t = start; t + step <= end; t += step) out.push(minutesToHHMM(t))
  return out
}

interface SchedulingFieldProps {
  value?: SchedulingValue
  onChange: (value: SchedulingValue) => void
  settings?: SchedulingSettings
  theme: { primaryColor: string; textColor: string }
}

// In-form time-slot booking. Self-contained: a native date input limited to the
// enabled weekday window, then a generated list of time slots for the chosen day.
//
// KNOWN LIMITATION: this is an in-form scheduler, not a calendar backend. There is
// NO double-booking prevention — two respondents can pick the same slot. Pair with
// an external calendar/CRM if you need real availability.
export function SchedulingField({ value, onChange, settings, theme }: SchedulingFieldProps) {
  const cfg = resolveScheduling(settings)
  const v = value || {}

  const { min, max } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const minDate = new Date(today)
    minDate.setDate(minDate.getDate() + cfg.leadDays)
    const maxDate = new Date(today)
    maxDate.setDate(maxDate.getDate() + cfg.maxDaysAhead)
    return { min: toLocalDateString(minDate), max: toLocalDateString(maxDate) }
  }, [cfg.leadDays, cfg.maxDaysAhead])

  const slots = useMemo(
    () => generateSlots(cfg.startTime, cfg.endTime, cfg.slotMinutes),
    [cfg.startTime, cfg.endTime, cfg.slotMinutes]
  )

  // A chosen date is only valid when its weekday is enabled.
  const dayEnabled = (dateStr: string): boolean => !!cfg.days[weekdayOf(dateStr)]
  const selectedDateValid = !!v.date && dayEnabled(v.date)

  const onDateChange = (dateStr: string) => {
    if (!dateStr) { onChange({}); return }
    // Clear any previously chosen time when the date changes.
    onChange({ date: dateStr, time: undefined })
  }

  const enabledList = WEEKDAY_ORDER.filter((d) => cfg.days[d]).map((d) => WEEKDAY_LABELS[d])

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: theme.textColor }}>
          Choose a date
        </label>
        <input
          type="date"
          value={v.date || ''}
          min={min}
          max={max}
          onChange={(e) => onDateChange(e.target.value)}
          aria-label="Booking date"
          className="text-lg py-3 px-3 border-2 rounded-lg focus:ring-2 focus:outline-none w-full sm:w-auto"
          style={{ borderColor: '#e8e4db', color: theme.textColor }}
          autoFocus
        />
        {enabledList.length > 0 && (
          <p className="text-xs mt-1.5 opacity-60" style={{ color: theme.textColor }}>
            Available on: {enabledList.join(', ')}
            {cfg.timezoneLabel ? ` · ${cfg.timezoneLabel}` : ''}
          </p>
        )}
      </div>

      {v.date && !selectedDateValid && (
        <p role="alert" className="text-sm" style={{ color: '#dc2626' }}>
          That day isn&rsquo;t available. Please pick {enabledList.join(', ') || 'an open day'}.
        </p>
      )}

      {selectedDateValid && (
        <div role="radiogroup" aria-label="Available time slots">
          <label className="block text-sm font-medium mb-1.5" style={{ color: theme.textColor }}>
            Choose a time
          </label>
          {slots.length === 0 ? (
            <p className="text-sm opacity-60" style={{ color: theme.textColor }}>
              No time slots are available for this configuration.
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((slot) => {
                const selected = v.time === slot
                return (
                  <button
                    key={slot}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => onChange({ date: v.date, time: slot })}
                    className="py-2.5 px-2 rounded-lg border-2 text-sm font-medium transition-all hover:shadow-sm"
                    style={selected
                      ? { borderColor: theme.primaryColor, backgroundColor: `${theme.primaryColor}14`, color: theme.primaryColor }
                      : { borderColor: '#e8e4db', color: theme.textColor }
                    }
                  >
                    {slot}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
