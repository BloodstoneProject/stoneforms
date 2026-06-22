'use client'

import { Input } from '@/components/ui/input'

export interface AddressValue {
  line1?: string
  line2?: string
  city?: string
  state?: string
  postal?: string
  country?: string
}

interface AddressFieldProps {
  value?: AddressValue
  onChange: (value: AddressValue) => void
  theme: { primaryColor: string; textColor: string }
}

// Composite address input. value = { line1, line2, city, state, postal, country }.
export function AddressField({ value, onChange, theme }: AddressFieldProps) {
  const v = value || {}
  const set = (key: keyof AddressValue, next: string) => onChange({ ...v, [key]: next })
  const borderStyle = { borderColor: '#e8e4db' as const }

  return (
    <div className="space-y-3">
      <Input
        type="text"
        value={v.line1 || ''}
        onChange={(e) => set('line1', e.target.value)}
        placeholder="Address line 1 *"
        aria-label="Address line 1"
        autoComplete="address-line1"
        className="text-lg py-5 border-2 focus:ring-2"
        style={borderStyle}
        autoFocus
      />
      <Input
        type="text"
        value={v.line2 || ''}
        onChange={(e) => set('line2', e.target.value)}
        placeholder="Address line 2 (optional)"
        aria-label="Address line 2"
        autoComplete="address-line2"
        className="text-lg py-5 border-2 focus:ring-2"
        style={borderStyle}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          type="text"
          value={v.city || ''}
          onChange={(e) => set('city', e.target.value)}
          placeholder="City *"
          aria-label="City"
          autoComplete="address-level2"
          className="text-lg py-5 border-2 focus:ring-2"
          style={borderStyle}
        />
        <Input
          type="text"
          value={v.state || ''}
          onChange={(e) => set('state', e.target.value)}
          placeholder="State / Region"
          aria-label="State or region"
          autoComplete="address-level1"
          className="text-lg py-5 border-2 focus:ring-2"
          style={borderStyle}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          type="text"
          value={v.postal || ''}
          onChange={(e) => set('postal', e.target.value)}
          placeholder="Postal / ZIP code *"
          aria-label="Postal or ZIP code"
          autoComplete="postal-code"
          className="text-lg py-5 border-2 focus:ring-2"
          style={borderStyle}
        />
        <Input
          type="text"
          value={v.country || ''}
          onChange={(e) => set('country', e.target.value)}
          placeholder="Country"
          aria-label="Country"
          autoComplete="country-name"
          className="text-lg py-5 border-2 focus:ring-2"
          style={borderStyle}
        />
      </div>
    </div>
  )
}
