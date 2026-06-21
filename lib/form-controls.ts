// Form availability controls — scheduling (open/close windows) and response caps.
// Pure functions shared by the public GET route, the submit route (server-side
// re-check) and surfaced to the player so it can render a themed closed screen.
//
// Config shape (forms.settings.schedule):
//   {
//     opensAt?: ISOString,     // form is "not_open" before this instant
//     closesAt?: ISOString,    // form is "closed" at/after this instant
//     maxResponses?: number,   // form is "cap" once responseCount >= this
//     closedMessage?: string,  // shown on the themed closed screen
//   }

export interface FormSchedule {
  opensAt?: string
  closesAt?: string
  maxResponses?: number
  closedMessage?: string
}

export type ClosedReason = 'not_open' | 'closed' | 'cap'

export interface FormAvailability {
  open: boolean
  reason?: ClosedReason
  message?: string
}

// Minimal shape we need off a form row.
interface FormLike {
  settings?: Record<string, any> | null
}

function parseDate(value: any): number | null {
  if (typeof value !== 'string' || value.trim() === '') return null
  const t = Date.parse(value)
  return Number.isFinite(t) ? t : null
}

const DEFAULT_NOT_OPEN = 'This form is not open yet. Please check back later.'
const DEFAULT_CLOSED = 'This form is now closed.'
const DEFAULT_CAP = 'This form is no longer accepting responses.'

// Determine whether a form is currently accepting responses, given how many
// submissions it already has. `now` is injectable for testability.
export function getFormAvailability(
  form: FormLike,
  responseCount: number,
  now: number = Date.now()
): FormAvailability {
  const schedule = ((form?.settings as any)?.schedule as FormSchedule) || {}
  const closedMessage =
    typeof schedule.closedMessage === 'string' && schedule.closedMessage.trim() !== ''
      ? schedule.closedMessage
      : undefined

  const opensAt = parseDate(schedule.opensAt)
  if (opensAt !== null && now < opensAt) {
    return { open: false, reason: 'not_open', message: closedMessage || DEFAULT_NOT_OPEN }
  }

  const closesAt = parseDate(schedule.closesAt)
  if (closesAt !== null && now >= closesAt) {
    return { open: false, reason: 'closed', message: closedMessage || DEFAULT_CLOSED }
  }

  const cap = schedule.maxResponses
  if (typeof cap === 'number' && cap > 0 && responseCount >= cap) {
    return { open: false, reason: 'cap', message: closedMessage || DEFAULT_CAP }
  }

  return { open: true }
}
