'use client'

import { use, useState } from 'react'
import { getFormById } from '@/lib/mock-data'
import { ArrowRight, Check } from 'lucide-react'

export default function FormPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const form = getFormById(id)
  
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Default questions if form has none
  const questions = form?.questions && form.questions.length > 0 ? form.questions : [
    { id: 'q1', type: 'email', label: 'What is your email address?', required: true },
    { id: 'q2', type: 'short_text', label: 'What is your name?', required: true },
    { id: 'q3', type: 'long_text', label: 'How can we help you?', required: false },
  ]

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">Form Not Found</h1>
          <p className="text-stone-600">This form does not exist or has been removed.</p>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsSubmitted(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-6">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
          * { font-family: 'DM Sans', sans-serif; }
        `}</style>
        <div className="max-w-2xl w-full text-center">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-stone-900 mb-4">
            Thank You!
          </h1>
          <p className="text-xl text-stone-600 mb-8">
            Your response has been recorded. We will get back to you soon.
          </p>
          <div className="bg-white rounded-lg border-2 border-green-200 p-6">
            <p className="text-sm text-stone-600">
              Form ID: {form.id}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Progress Bar */}
      {form.settings?.showProgressBar && (
        <div className="fixed top-0 left-0 right-0 h-2 bg-stone-200 z-50">
          <div
            className="h-full bg-stone-900 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center p-6 pt-16">
        <div className="max-w-3xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
              {form.title}
            </h1>
            {form.description && (
              <p className="text-xl text-stone-600">
                {form.description}
              </p>
            )}
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8 md:p-12 mb-6">
            {/* Question Number */}
            <div className="text-sm font-medium text-stone-500 mb-4">
              Question {currentStep + 1} of {questions.length}
            </div>

            {/* Question */}
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-8">
              {currentQuestion.label}
              {currentQuestion.required && (
                <span className="text-red-600 ml-2">*</span>
              )}
            </h2>

            {/* Input based on type */}
            <div className="mb-8">
              {(currentQuestion.type === 'short_text' || currentQuestion.type === 'email') && (
                <input
                  type={currentQuestion.type === 'email' ? 'email' : 'text'}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                  placeholder="Type your answer here..."
                  className="w-full px-6 py-4 text-xl border-2 border-stone-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-stone-200 focus:border-stone-900 transition-all"
                  autoFocus
                />
              )}

              {currentQuestion.type === 'long_text' && (
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                  placeholder="Type your answer here..."
                  rows={6}
                  className="w-full px-6 py-4 text-xl border-2 border-stone-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-stone-200 focus:border-stone-900 transition-all resize-none"
                  autoFocus
                />
              )}

              {currentQuestion.type === 'multiple_choice' && currentQuestion.choices && (
                <div className="space-y-3">
                  {currentQuestion.choices.map((choice, idx) => (
                    <button
                      key={choice.id}
                      onClick={() => setAnswers({ ...answers, [currentQuestion.id]: choice.label })}
                      className={`w-full text-left px-6 py-4 text-lg border-2 rounded-xl transition-all ${
                        answers[currentQuestion.id] === choice.label
                          ? 'border-stone-900 bg-stone-50'
                          : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'
                      }`}
                    >
                      <span className="font-medium text-stone-400 mr-3">{String.fromCharCode(65 + idx)}</span>
                      {choice.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="px-6 py-3 text-stone-600 hover:text-stone-900 font-medium disabled:opacity-0 disabled:cursor-not-allowed transition-opacity"
              >
                ← Back
              </button>

              <button
                onClick={handleNext}
                disabled={currentQuestion.required && !answers[currentQuestion.id]}
                className="flex items-center gap-2 px-8 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all"
              >
                {currentStep === questions.length - 1 ? 'Submit' : 'Next'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-stone-500">
            Powered by <span className="font-semibold text-stone-700">Stoneforms</span>
          </div>
        </div>
      </div>
    </div>
  )
}
