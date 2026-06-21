'use client'

import { Check } from 'lucide-react'

interface ConsentFieldProps {
  value: boolean | undefined
  onChange: (value: boolean) => void
  // The consent label / rich text + optional privacy-policy link.
  label?: string
  policyUrl?: string
  policyText?: string
  theme: { primaryColor: string; textColor: string }
}

// GDPR-style consent checkbox with a rich label and optional privacy-policy link.
export function ConsentField({ value, onChange, label, policyUrl, policyText, theme }: ConsentFieldProps) {
  const checked = value === true
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left hover:shadow-sm"
      style={checked
        ? { borderColor: theme.primaryColor, backgroundColor: `${theme.primaryColor}10` }
        : { borderColor: `${theme.textColor}22` }
      }
      aria-pressed={checked}
    >
      <span
        className="w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
        style={checked
          ? { backgroundColor: theme.primaryColor, borderColor: theme.primaryColor }
          : { borderColor: `${theme.textColor}44` }
        }
      >
        {checked && <Check className="w-4 h-4 text-white" />}
      </span>
      <span className="text-base leading-relaxed" style={{ color: theme.textColor }}>
        {label || 'I agree'}
        {policyUrl && (
          <>
            {' '}
            <a
              href={/^https?:\/\//i.test(policyUrl) ? policyUrl : `https://${policyUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="underline font-medium"
              style={{ color: theme.primaryColor }}
            >
              {policyText || 'Privacy Policy'}
            </a>
          </>
        )}
      </span>
    </button>
  )
}
