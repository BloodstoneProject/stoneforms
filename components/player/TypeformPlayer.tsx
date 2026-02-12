'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowRight, ArrowLeft, Check, Upload, Play, Image as ImageIcon } from 'lucide-react'

interface Question {
  id: string
  type: 'short_text' | 'long_text' | 'email' | 'multiple_choice' | 'image_choice' | 'video' | 'rating'
  label: string
  description?: string
  placeholder?: string
  required: boolean
  choices?: { id: string; label: string; value: string; image?: string }[]
  maxRating?: number
  videoUrl?: string
}

interface FormPlayerProps {
  formId: string
  title: string
  description?: string
  questions: Question[]
  onSubmit: (answers: Record<string, any>) => void
  theme?: {
    primaryColor?: string
    backgroundColor?: string
  }
}

export default function TypeformPlayer({ 
  formId, 
  title, 
  description, 
  questions,
  onSubmit,
  theme = {}
}: FormPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isComplete, setIsComplete] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [rating, setRating] = useState(0)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const canGoNext = currentQuestion.required ? !!answers[currentQuestion.id] : true

  // Auto-focus input on question change
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
    // Load existing answer
    setInputValue(answers[currentQuestion?.id] || '')
    setSelectedChoice(answers[currentQuestion?.id] || null)
    setRating(answers[currentQuestion?.id] || 0)
  }, [currentIndex, currentQuestion, answers])

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setInputValue('')
      setSelectedChoice(null)
      setRating(0)
    } else {
      // Complete form
      setIsComplete(true)
      onSubmit(answers)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && canGoNext) {
      e.preventDefault()
      if (inputValue.trim()) {
        setAnswers({ ...answers, [currentQuestion.id]: inputValue })
        handleNext()
      }
    }
  }

  const handleChoiceSelect = (value: string) => {
    setSelectedChoice(value)
    setAnswers({ ...answers, [currentQuestion.id]: value })
    // Auto-advance after 300ms
    setTimeout(() => handleNext(), 300)
  }

  const handleRatingSelect = (value: number) => {
    setRating(value)
    setAnswers({ ...answers, [currentQuestion.id]: value })
    setTimeout(() => handleNext(), 300)
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-6">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
          * { font-family: 'DM Sans', sans-serif; }
        `}</style>

        <div className="max-w-2xl w-full text-center animate-fade-in">
          {/* Art Deco Success Badge */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 blur-3xl opacity-30 animate-pulse" />
            <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center border-4 border-white shadow-2xl">
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
            You're All Set!
          </h2>
          <p className="text-xl text-stone-600 mb-8">
            Thank you for completing the form. Your responses have been recorded.
          </p>

          {/* Art Deco Divider */}
          <div className="flex items-center justify-center gap-4 my-8">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-amber-600" />
            <div className="w-2 h-2 bg-amber-600 rotate-45" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-amber-600" />
          </div>

          <div className="bg-white border-4 border-stone-900 p-8 relative">
            {/* Art Deco Corners */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-amber-600" />
            <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-amber-600" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-amber-600" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-amber-600" />

            <p className="text-stone-600">
              We've sent a confirmation to your email.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex flex-col">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-stone-200 relative">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
        {/* Art Deco Progress Indicator */}
        <div 
          className="absolute top-0 w-4 h-4 bg-amber-600 border-2 border-white transform -translate-y-1/3 transition-all duration-500"
          style={{ left: `calc(${progress}% - 8px)` }}
        >
          <div className="absolute inset-0 bg-amber-400 animate-ping opacity-50" />
        </div>
      </div>

      {/* Question Number Indicator */}
      <div className="px-6 py-4 text-stone-500 text-sm font-medium">
        {currentIndex + 1} → {questions.length}
      </div>

      {/* Main Question Area */}
      <div className="flex-1 flex items-center justify-center px-6 pb-20">
        <div className="w-full max-w-3xl animate-slide-in" key={currentQuestion.id}>
          {/* Question */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-5xl font-bold text-stone-900 mb-4 leading-tight">
              {currentQuestion.label}
              {currentQuestion.required && <span className="text-red-500 ml-2">*</span>}
            </h2>
            {currentQuestion.description && (
              <p className="text-lg md:text-xl text-stone-600">
                {currentQuestion.description}
              </p>
            )}
          </div>

          {/* Input Area */}
          <div className="space-y-4">
            {/* Text Inputs */}
            {(currentQuestion.type === 'short_text' || currentQuestion.type === 'email') && (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type={currentQuestion.type === 'email' ? 'email' : 'text'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                onBlur={() => inputValue && setAnswers({ ...answers, [currentQuestion.id]: inputValue })}
                placeholder={currentQuestion.placeholder || 'Type your answer here...'}
                className="w-full px-6 py-5 text-2xl bg-white border-b-4 border-stone-900 focus:border-amber-600 outline-none transition-colors placeholder:text-stone-300"
              />
            )}

            {/* Long Text */}
            {currentQuestion.type === 'long_text' && (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={() => inputValue && setAnswers({ ...answers, [currentQuestion.id]: inputValue })}
                placeholder={currentQuestion.placeholder || 'Type your answer here...'}
                rows={4}
                className="w-full px-6 py-5 text-2xl bg-white border-4 border-stone-900 focus:border-amber-600 outline-none transition-colors resize-none placeholder:text-stone-300"
              />
            )}

            {/* Multiple Choice */}
            {currentQuestion.type === 'multiple_choice' && (
              <div className="space-y-3">
                {currentQuestion.choices?.map((choice, idx) => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoiceSelect(choice.value)}
                    className={`group w-full text-left px-6 py-5 border-2 transition-all ${
                      selectedChoice === choice.value
                        ? 'bg-amber-600 border-amber-600 text-white'
                        : 'bg-white border-stone-900 text-stone-900 hover:border-amber-600'
                    }`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        selectedChoice === choice.value 
                          ? 'border-white bg-white/20' 
                          : 'border-stone-900 group-hover:border-amber-600'
                      }`}>
                        <span className="font-bold">{String.fromCharCode(65 + idx)}</span>
                      </div>
                      <span className="text-xl font-medium">{choice.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Image Choice */}
            {currentQuestion.type === 'image_choice' && (
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.choices?.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoiceSelect(choice.value)}
                    className={`group relative overflow-hidden border-4 transition-all aspect-square ${
                      selectedChoice === choice.value
                        ? 'border-amber-600'
                        : 'border-stone-900 hover:border-amber-600'
                    }`}
                  >
                    {choice.image ? (
                      <img 
                        src={choice.image} 
                        alt={choice.label}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-stone-200 flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-stone-400" />
                      </div>
                    )}
                    <div className={`absolute inset-x-0 bottom-0 p-4 transition-all ${
                      selectedChoice === choice.value
                        ? 'bg-amber-600 text-white'
                        : 'bg-white/90 text-stone-900'
                    }`}>
                      <span className="font-semibold">{choice.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Rating */}
            {currentQuestion.type === 'rating' && (
              <div className="flex gap-4 justify-center py-8">
                {Array.from({ length: currentQuestion.maxRating || 5 }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRatingSelect(idx + 1)}
                    className={`group w-16 h-16 md:w-20 md:h-20 border-4 transition-all ${
                      rating >= idx + 1
                        ? 'bg-amber-600 border-amber-600 text-white scale-110'
                        : 'bg-white border-stone-900 text-stone-900 hover:border-amber-600 hover:scale-105'
                    }`}
                  >
                    <span className="text-2xl md:text-3xl font-bold">{idx + 1}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Video */}
            {currentQuestion.type === 'video' && currentQuestion.videoUrl && (
              <div className="relative aspect-video bg-stone-900 border-4 border-stone-900 overflow-hidden">
                <video 
                  src={currentQuestion.videoUrl}
                  controls
                  className="w-full h-full"
                />
              </div>
            )}

            {/* Enter hint for text inputs */}
            {(currentQuestion.type === 'short_text' || currentQuestion.type === 'email') && (
              <div className="flex items-center gap-2 text-stone-500 text-sm mt-4">
                <kbd className="px-2 py-1 bg-stone-200 border border-stone-300 rounded text-xs font-mono">
                  Enter ↵
                </kbd>
                <span>to continue</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur border-t-2 border-stone-900 p-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all ${
              currentIndex === 0
                ? 'opacity-0 pointer-events-none'
                : 'text-stone-900 hover:text-amber-600'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Next/Submit Button */}
          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className={`group flex items-center gap-2 px-8 py-4 font-semibold transition-all ${
              canGoNext
                ? 'bg-stone-900 text-white hover:bg-amber-600'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            <span>{currentIndex === questions.length - 1 ? 'Submit' : 'Next'}</span>
            <ArrowRight className={`w-5 h-5 ${canGoNext ? 'group-hover:translate-x-1' : ''} transition-transform`} />
          </button>
        </div>
      </div>
    </div>
  )
}
