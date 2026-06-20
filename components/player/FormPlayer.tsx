'use client'

import { useState, useEffect } from 'react'
import { Question } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowRight, 
  ArrowLeft, 
  Check,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import { QuestionRenderer } from '@/components/player/QuestionRenderer'
import { ThankYouScreen } from '@/components/player/ThankYouScreen'

interface FormSettings {
  showProgressBar?: boolean
  redirectUrl?: string
  customEndingMessage?: string
}

interface FormPlayerProps {
  formId: string
  formTitle: string
  formDescription?: string
  questions: Question[]
  settings?: FormSettings
  theme?: {
    primaryColor: string
    backgroundColor: string
    textColor: string
  }
}

export default function FormPlayer({
  formId,
  formTitle,
  formDescription,
  questions,
  settings = {},
  theme = {
    primaryColor: '#142c1c',
    backgroundColor: '#f4f2ed',
    textColor: '#142c1c',
  }
}: FormPlayerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const showProgressBar = settings.showProgressBar !== false

  const currentQuestion = questions[currentQuestionIndex]
  const isFirstQuestion = currentQuestionIndex === 0
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  // Handle answer change
  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[questionId]
        return newErrors
      })
    }
  }

  // Validate current question
  const validateCurrentQuestion = (): boolean => {
    if (!currentQuestion) return true

    const answer = answers[currentQuestion.id]

    // Check if required
    if (currentQuestion.required && (!answer || answer === '' || (Array.isArray(answer) && answer.length === 0))) {
      setErrors({ [currentQuestion.id]: 'This question is required' })
      return false
    }

    // Validate email
    if (currentQuestion.type === 'email' && answer) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(answer)) {
        setErrors({ [currentQuestion.id]: 'Please enter a valid email address' })
        return false
      }
    }

    // Validate number range
    if (currentQuestion.type === 'number' && answer) {
      const num = Number(answer)
      if (currentQuestion.validation?.min !== undefined && num < currentQuestion.validation.min) {
        setErrors({ [currentQuestion.id]: `Minimum value is ${currentQuestion.validation.min}` })
        return false
      }
      if (currentQuestion.validation?.max !== undefined && num > currentQuestion.validation.max) {
        setErrors({ [currentQuestion.id]: `Maximum value is ${currentQuestion.validation.max}` })
        return false
      }
    }

    // Validate URL
    if (currentQuestion.type === 'url' && answer) {
      try {
        // eslint-disable-next-line no-new
        new URL(/^https?:\/\//i.test(answer) ? answer : `https://${answer}`)
      } catch {
        setErrors({ [currentQuestion.id]: 'Please enter a valid URL' })
        return false
      }
    }

    // Validate text length
    if (['short_text', 'long_text'].includes(currentQuestion.type) && typeof answer === 'string' && answer) {
      const max = currentQuestion.validation?.maxLength
      if (max !== undefined && answer.length > max) {
        setErrors({ [currentQuestion.id]: `Maximum length is ${max} characters` })
        return false
      }
    }

    return true
  }

  // Navigate to next question
  const handleNext = () => {
    if (!validateCurrentQuestion()) return

    if (isLastQuestion) {
      handleSubmit()
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  // Navigate to previous question
  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  // Handle Enter key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentQuestionIndex, answers])

  // Submit form
  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch(`/api/forms/${formId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // The submit API expects answers keyed by field id.
        body: JSON.stringify({ responses: answers }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setSubmitError(data.error || 'Failed to submit form. Please try again.')
        return
      }

      if (settings.redirectUrl) {
        const target = /^https?:\/\//i.test(settings.redirectUrl)
          ? settings.redirectUrl
          : `https://${settings.redirectUrl}`
        window.location.href = target
        return
      }

      setIsComplete(true)
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitError('Something went wrong. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isComplete) {
    return (
      <ThankYouScreen
        formTitle={formTitle}
        theme={theme}
        customMessage={settings.customEndingMessage}
      />
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: theme.backgroundColor }}>
        <p style={{ color: theme.textColor, opacity: 0.7 }}>This form has no questions yet.</p>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Progress Bar */}
      {showProgressBar && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Progress value={progress} className="h-1 rounded-none" />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 pt-8">
        <div className="w-full max-w-2xl">
          {/* Question Number */}
          <div className="flex items-center justify-between mb-6">
            <div 
              className="text-sm font-medium"
              style={{ color: theme.textColor, opacity: 0.6 }}
            >
              {currentQuestionIndex + 1} → {questions.length}
            </div>
            
            {/* Navigation Hints */}
            <div className="flex items-center gap-4 text-xs" style={{ color: theme.textColor, opacity: 0.5 }}>
              {!isFirstQuestion && (
                <div className="flex items-center gap-1">
                  <ChevronUp className="w-3 h-3" />
                  <span>or Shift + Enter to go back</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span>Press Enter</span>
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div 
            className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl mb-6 transition-all duration-300"
            style={{ borderTop: `4px solid ${theme.primaryColor}` }}
          >
            <QuestionRenderer
              question={currentQuestion}
              value={answers[currentQuestion.id]}
              error={errors[currentQuestion.id]}
              onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              theme={theme}
            />
          </div>

          {/* Submit error */}
          {submitError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {submitError}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={isFirstQuestion}
              className="gap-2"
              style={!isFirstQuestion ? { color: theme.primaryColor } : {}}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className="gap-2 text-white px-8"
              style={{ backgroundColor: theme.primaryColor }}
              size="lg"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : isLastQuestion ? (
                <>
                  Submit <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          {/* Form Branding */}
          <div className="text-center mt-12">
            <p className="text-xs" style={{ color: theme.textColor, opacity: 0.4 }}>
              Powered by <span className="font-semibold">Stoneforms</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
