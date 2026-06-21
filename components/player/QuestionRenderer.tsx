'use client'

import { Question } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Star, Check } from 'lucide-react'
import { FileUploadField } from '@/components/player/FileUploadField'
import { SignatureField } from '@/components/player/SignatureField'
import { AddressField } from '@/components/player/AddressField'
import { ConsentField } from '@/components/player/ConsentField'
import { CalculatorField } from '@/components/player/CalculatorField'

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
  return (
    <div className="space-y-6">
      {/* Question Label */}
      <div>
        <h2 
          className="text-3xl md:text-4xl font-bold mb-3"
          style={{ color: theme.textColor }}
        >
          {question.label}
          {question.required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </h2>
        {question.description && (
          <p 
            className="text-lg"
            style={{ color: theme.textColor, opacity: 0.7 }}
          >
            {question.description}
          </p>
        )}
      </div>

      {/* Question Input */}
      <div>
        {renderQuestionInput(question, value, onChange, theme, allAnswers)}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  )
}

function renderQuestionInput(
  question: Question,
  value: any,
  onChange: (value: any) => void,
  theme: { primaryColor: string; backgroundColor: string; textColor: string },
  allAnswers: Record<string, any>
) {
  switch (question.type) {
    case 'short_text':
      return (
        <Input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder || 'Type your answer here...'}
          className="text-xl py-6 border-2 focus:ring-2"
          style={{ borderColor: '#e8e4db' }}
          autoFocus
        />
      )

    case 'long_text':
      return (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder || 'Type your answer here...'}
          rows={6}
          className="w-full rounded-lg border-2 p-4 text-lg focus:ring-2 focus:outline-none"
          style={{ borderColor: '#e8e4db' }}
          autoFocus
        />
      )

    case 'email':
      return (
        <Input
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
        <Input
          type="tel"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder || '+1 (555) 000-0000'}
          className="text-xl py-6 border-2 focus:ring-2"
          style={{ borderColor: '#e8e4db' }}
          autoFocus
        />
      )

    case 'url':
      return (
        <Input
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
        <div className="space-y-3">
          {question.choices?.map((choice, i) => {
            const isSelected = value === choice.value
            return (
              <button
                key={choice.id}
                onClick={() => onChange(choice.value)}
                className={cn(
                  'w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left hover:shadow-sm',
                  isSelected && 'ring-2'
                )}
                style={isSelected
                  ? { borderColor: theme.primaryColor, backgroundColor: `${theme.primaryColor}14` }
                  : { borderColor: `${theme.textColor}22` }
                }
              >
                <span
                  className="w-7 h-7 rounded-md border-2 flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all"
                  style={isSelected
                    ? { backgroundColor: theme.primaryColor, borderColor: theme.primaryColor, color: '#fff' }
                    : { borderColor: `${theme.textColor}33`, color: theme.textColor }
                  }
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-lg font-medium flex-1" style={{ color: theme.textColor }}>
                  {choice.label}
                </span>
                {isSelected && <Check className="w-5 h-5 flex-shrink-0" style={{ color: theme.primaryColor }} />}
              </button>
            )
          })}
        </div>
      )

    case 'checkboxes': {
      const selected: string[] = Array.isArray(value) ? value : []
      const toggle = (choiceValue: string) => {
        if (selected.includes(choiceValue)) {
          onChange(selected.filter((v) => v !== choiceValue))
        } else {
          onChange([...selected, choiceValue])
        }
      }
      return (
        <div className="space-y-3">
          {question.choices?.map((choice) => {
            const isSelected = selected.includes(choice.value)
            return (
              <button
                key={choice.id}
                onClick={() => toggle(choice.value)}
                className={cn(
                  'w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all text-left group hover:shadow-md',
                  isSelected && 'ring-2'
                )}
                style={isSelected
                  ? { borderColor: theme.primaryColor, backgroundColor: `${theme.primaryColor}10` }
                  : { borderColor: '#e8e4db' }
                }
              >
                <div
                  className={cn(
                    'w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all',
                    isSelected && 'border-transparent'
                  )}
                  style={isSelected
                    ? { backgroundColor: theme.primaryColor }
                    : { borderColor: '#3d5948' }
                  }
                >
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className="text-lg font-medium" style={{ color: theme.textColor }}>
                  {choice.label}
                </span>
              </button>
            )
          })}
        </div>
      )
    }

    case 'dropdown':
      return (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border-2 p-4 text-lg focus:ring-2 focus:outline-none"
          style={{ borderColor: '#e8e4db', color: theme.textColor }}
          autoFocus
        >
          <option value="">Select an option...</option>
          {question.choices?.map((choice) => (
            <option key={choice.id} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </select>
      )

    case 'rating':
      return (
        <div className="flex gap-2 justify-center md:justify-start">
          {[1, 2, 3, 4, 5].map((star) => {
            const isSelected = value >= star
            return (
              <button
                key={star}
                onClick={() => onChange(star)}
                className={cn(
                  'w-16 h-16 md:w-20 md:h-20 rounded-xl border-2 flex items-center justify-center transition-all hover:scale-110',
                  isSelected && 'ring-2'
                )}
                style={isSelected
                  ? { borderColor: theme.primaryColor, backgroundColor: `${theme.primaryColor}10` }
                  : { borderColor: '#e8e4db' }
                }
              >
                <Star
                  className={cn('w-8 h-8', isSelected && 'fill-current')}
                  style={{ color: isSelected ? theme.primaryColor : '#3d5948' }}
                />
              </button>
            )
          })}
        </div>
      )

    case 'opinion_scale':
      return (
        <div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 11 }, (_, n) => {
              const isSelected = value === n
              return (
                <button
                  key={n}
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
          <div className="flex justify-between mt-2 text-sm opacity-60" style={{ color: theme.textColor }}>
            <span>Not likely</span>
            <span>Very likely</span>
          </div>
        </div>
      )

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

    case 'yes_no':
      return (
        <div className="grid grid-cols-2 gap-4">
          <button
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

    case 'date':
      return (
        <Input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="text-xl py-6 border-2 focus:ring-2"
          style={{ borderColor: '#e8e4db' }}
          autoFocus
        />
      )

    case 'file_upload':
      return (
        <FileUploadField
          value={typeof value === 'string' ? value : undefined}
          onChange={onChange}
          theme={{ primaryColor: theme.primaryColor, textColor: theme.textColor }}
        />
      )

    case 'picture_choice': {
      const images: Record<string, string> = (question.properties?.images as Record<string, string>) || {}
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {question.choices?.map((choice) => {
            const isSelected = value === choice.value
            const img = images[choice.value]
            return (
              <button
                key={choice.id}
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
                <div
                  className="relative w-full aspect-square flex items-center justify-center"
                  style={{ backgroundColor: `${theme.textColor}08` }}
                >
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={choice.label} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl opacity-30">🖼️</span>
                  )}
                  {isSelected && (
                    <span
                      className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      <Check className="w-4 h-4 text-white" />
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

    default:
      return (
        <Input
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
