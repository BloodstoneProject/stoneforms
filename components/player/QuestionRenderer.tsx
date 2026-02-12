'use client'

import { Question } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Star, Check } from 'lucide-react'

interface QuestionRendererProps {
  question: Question
  value: any
  error?: string
  onChange: (value: any) => void
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
        {renderQuestionInput(question, value, onChange, theme)}
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
  theme: { primaryColor: string; backgroundColor: string; textColor: string }
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
          {question.choices?.map((choice) => {
            const isSelected = value === choice.value
            return (
              <button
                key={choice.id}
                onClick={() => onChange(choice.value)}
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
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                    isSelected && 'border-transparent'
                  )}
                  style={isSelected 
                    ? { backgroundColor: theme.primaryColor }
                    : { borderColor: '#3d5948' }
                  }
                >
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
                <span 
                  className="text-lg font-medium"
                  style={{ color: theme.textColor }}
                >
                  {choice.label}
                </span>
              </button>
            )
          })}
        </div>
      )

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
        <div>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onChange(file)
            }}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full p-12 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
            style={{ borderColor: '#e8e4db' }}
          >
            <svg className="w-16 h-16 mb-4" style={{ color: theme.primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {value ? (
              <div className="text-center">
                <p className="text-lg font-medium" style={{ color: theme.textColor }}>
                  {value.name}
                </p>
                <p className="text-sm mt-1" style={{ color: theme.textColor, opacity: 0.6 }}>
                  Click to change file
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-lg font-medium" style={{ color: theme.textColor }}>
                  Click to upload or drag and drop
                </p>
                <p className="text-sm mt-1" style={{ color: theme.textColor, opacity: 0.6 }}>
                  Max file size: 10MB
                </p>
              </div>
            )}
          </label>
        </div>
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
