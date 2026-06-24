'use client'

import { Input } from '@/components/ui/input'

export interface ContactValue {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  company?: string
}

export type ContactSubField = 'firstName' | 'lastName' | 'email' | 'phone' | 'company'

export interface ContactFieldConfig {
  enabled?: boolean
  required?: boolean
}

export interface ContactSettings {
  fields?: Partial<Record<ContactSubField, ContactFieldConfig>>
}

// Default sub-field config: first/last name + email enabled; email required.
// Mirrors the shape documented in lib/field-types.ts. Used by the player,
// validation and the builder so all three agree on defaults.
export const CONTACT_SUBFIELDS: { key: ContactSubField; label: string; placeholder: string; type: string; autoComplete: string }[] = [
  { key: 'firstName', label: 'First name', placeholder: 'First name', type: 'text', autoComplete: 'given-name' },
  { key: 'lastName', label: 'Last name', placeholder: 'Last name', type: 'text', autoComplete: 'family-name' },
  { key: 'email', label: 'Email', placeholder: 'name@example.com', type: 'email', autoComplete: 'email' },
  { key: 'phone', label: 'Phone', placeholder: 'Phone number', type: 'tel', autoComplete: 'tel' },
  { key: 'company', label: 'Company', placeholder: 'Company', type: 'text', autoComplete: 'organization' },
]

export const CONTACT_DEFAULTS: Record<ContactSubField, ContactFieldConfig> = {
  firstName: { enabled: true, required: false },
  lastName: { enabled: true, required: false },
  email: { enabled: true, required: true },
  phone: { enabled: false, required: false },
  company: { enabled: false, required: false },
}

// Resolve the effective per-sub-field config, falling back to CONTACT_DEFAULTS
// for any key the author hasn't explicitly configured.
export function resolveContactConfig(settings?: ContactSettings): Record<ContactSubField, ContactFieldConfig> {
  const out = {} as Record<ContactSubField, ContactFieldConfig>
  for (const { key } of CONTACT_SUBFIELDS) {
    const cfg = settings?.fields?.[key]
    out[key] = {
      enabled: cfg?.enabled ?? CONTACT_DEFAULTS[key].enabled,
      required: cfg?.required ?? CONTACT_DEFAULTS[key].required,
    }
  }
  return out
}

interface ContactInfoFieldProps {
  value?: ContactValue
  onChange: (value: ContactValue) => void
  settings?: ContactSettings
  theme: { primaryColor: string; textColor: string }
}

// Composite contact input. value = { firstName?, lastName?, email?, phone?, company? }.
// Only the enabled sub-fields render; required ones show an asterisk.
export function ContactInfoField({ value, onChange, settings }: ContactInfoFieldProps) {
  const v = value || {}
  const cfg = resolveContactConfig(settings)
  const set = (key: ContactSubField, next: string) => onChange({ ...v, [key]: next })
  const borderStyle = { borderColor: '#e8e4db' as const }

  const enabled = CONTACT_SUBFIELDS.filter((f) => cfg[f.key].enabled)
  // Pair first/last name on one row when both are enabled; everything else is full width.
  const firstNameEnabled = cfg.firstName.enabled
  const lastNameEnabled = cfg.lastName.enabled
  const nameRow = firstNameEnabled && lastNameEnabled
  const rest = enabled.filter((f) => !(nameRow && (f.key === 'firstName' || f.key === 'lastName')))

  let firstControl = true
  const renderInput = (f: typeof CONTACT_SUBFIELDS[number]) => {
    const required = cfg[f.key].required
    const autoFocus = firstControl
    firstControl = false
    return (
      <Input
        key={f.key}
        type={f.type}
        value={v[f.key] || ''}
        onChange={(e) => set(f.key, e.target.value)}
        placeholder={`${f.placeholder}${required ? ' *' : ''}`}
        aria-label={f.label}
        autoComplete={f.autoComplete}
        className="text-lg py-5 border-2 focus:ring-2"
        style={borderStyle}
        autoFocus={autoFocus}
      />
    )
  }

  return (
    <div className="space-y-3">
      {nameRow && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {renderInput(CONTACT_SUBFIELDS[0])}
          {renderInput(CONTACT_SUBFIELDS[1])}
        </div>
      )}
      {rest.map((f) => renderInput(f))}
    </div>
  )
}
