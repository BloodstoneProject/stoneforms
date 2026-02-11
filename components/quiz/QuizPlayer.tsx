'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, ArrowLeft, Share2, Download, RefreshCw } from 'lucide-react'
import type { QuizTemplate, QuizQuestion, QuizResult } from '@/lib/quiz-templates'

interface QuizPlayerProps {
  quiz: QuizTemplate
  onComplete?: (answers: Record<string, any>, result: QuizResult) => void
}

export default function QuizPlayer({ quiz, onComplete }: QuizPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isComplete, setIsComplete] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)

  const currentQuestion = quiz.questions[currentIndex]
  const progress = ((currentIndex + 1) / quiz.questions.length) * 100

  const calculateResult = () => {
    if (quiz.scoringType === 'points' || quiz.scoringType === 'percentage') {
      // Calculate total points
      let totalPoints = 0
      let maxPoints = 0

      quiz.questions.forEach((q) => {
        const answer = answers[q.id]
        if (!answer) return

        q.choices.forEach((choice) => {
          if (choice.points !== undefined) {
            maxPoints = Math.max(maxPoints, choice.points)
            if (Array.isArray(answer)) {
              if (answer.includes(choice.id)) {
                totalPoints += choice.points || 0
              }
            } else if (answer === choice.id) {
              totalPoints += choice.points || 0
            }
          }
        })
      })

      // For percentage scoring
      if (quiz.scoringType === 'percentage') {
        const percentage = (totalPoints / (quiz.questions.length * 5)) * 100
        const foundResult = quiz.results.find(
          (r) => percentage >= (r.minScore || 0) && percentage <= (r.maxScore || 100)
        )
        return foundResult || quiz.results[0]
      }

      // Find matching result by score range
      const foundResult = quiz.results.find(
        (r) => totalPoints >= (r.minScore || 0) && totalPoints <= (r.maxScore || 999)
      )
      return foundResult || quiz.results[0]
    } else {
      // Category-based scoring
      const categoryCount: Record<string, number> = {}

      Object.values(answers).forEach((answer) => {
        if (Array.isArray(answer)) {
          answer.forEach((a) => {
            const choice = quiz.questions
              .flatMap((q) => q.choices)
              .find((c) => c.id === a)
            if (choice?.category) {
              categoryCount[choice.category] = (categoryCount[choice.category] || 0) + 1
            }
          })
        } else {
          const choice = quiz.questions
            .flatMap((q) => q.choices)
            .find((c) => c.id === answer)
          if (choice?.category) {
            categoryCount[choice.category] = (categoryCount[choice.category] || 0) + 1
          }
        }
      })

      // Find most common category
      const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0]
      return quiz.results.find((r) => r.category === topCategory) || quiz.results[0]
    }
  }

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Complete quiz
      const finalResult = calculateResult()
      setResult(finalResult)
      setIsComplete(true)
      onComplete?.(answers, finalResult)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers({ ...answers, [questionId]: value })
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setAnswers({})
    setIsComplete(false)
    setResult(null)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: quiz.title,
        text: `I got "${result?.title}" on ${quiz.title}! Try it yourself!`,
        url: window.location.href,
      })
    }
  }

  if (isComplete && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-6">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
          * { font-family: 'DM Sans', sans-serif; }
        `}</style>

        <div className="max-w-2xl w-full">
          {/* Result Card */}
          <div className="bg-white border-4 border-stone-900 p-12 relative text-center">
            {/* Art Deco Corners */}
            <div className="absolute -top-3 -left-3 w-8 h-8 border-t-4 border-l-4 border-amber-600" />
            <div className="absolute -top-3 -right-3 w-8 h-8 border-t-4 border-r-4 border-amber-600" />
            <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-4 border-l-4 border-amber-600" />
            <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-4 border-r-4 border-amber-600" />

            {/* Result Emoji */}
            <div className="text-8xl mb-6 animate-bounce">{result.emoji}</div>

            {/* Result Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
              {result.title}
            </h2>

            {/* Result Description */}
            <p className="text-xl text-stone-600 mb-8 leading-relaxed">
              {result.description}
            </p>

            {/* Divider */}
            <div className="flex items-center justify-center gap-4 my-8">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-stone-400" />
              <div className="w-2 h-2 bg-stone-400 rotate-45" />
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-stone-400" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-stone-900 text-white font-semibold hover:bg-amber-600 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Take Again
              </button>

              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-stone-900 text-stone-900 font-semibold hover:bg-stone-900 hover:text-white transition-all"
              >
                <Share2 className="w-5 h-5" />
                Share Result
              </button>
            </div>
          </div>

          {/* Quiz Info */}
          <div className="mt-8 text-center text-stone-600">
            <p className="text-sm">
              {quiz.title} · {quiz.questions.length} questions
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
      `}</style>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-stone-200 relative">
        <div
          className={`h-full bg-gradient-to-r ${quiz.color} transition-all duration-500 ease-out`}
          style={{ width: `${progress}%` }}
        />
        <div
          className={`absolute top-0 w-4 h-4 bg-gradient-to-br ${quiz.color} border-2 border-white transform -translate-y-1/3 transition-all duration-500`}
          style={{ left: `calc(${progress}% - 8px)` }}
        />
      </div>

      {/* Quiz Header */}
      <div className="px-6 py-6 border-b-2 border-stone-200">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{quiz.emoji}</span>
            <div>
              <h1 className="text-xl font-bold text-stone-900">{quiz.title}</h1>
              <p className="text-sm text-stone-600">
                Question {currentIndex + 1} of {quiz.questions.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 flex items-center justify-center px-6 pb-20">
        <div className="w-full max-w-3xl">
          {/* Question */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-5xl font-bold text-stone-900 mb-4 leading-tight">
              {currentQuestion.question}
            </h2>
            {currentQuestion.description && (
              <p className="text-lg md:text-xl text-stone-600">
                {currentQuestion.description}
              </p>
            )}
          </div>

          {/* Choices */}
          <div className="space-y-3">
            {currentQuestion.choices.map((choice, idx) => {
              const isSelected = currentQuestion.type === 'multiple' 
                ? answers[currentQuestion.id]?.includes(choice.id)
                : answers[currentQuestion.id] === choice.id

              return (
                <button
                  key={choice.id}
                  onClick={() => {
                    if (currentQuestion.type === 'multiple') {
                      const current = answers[currentQuestion.id] || []
                      const updated = current.includes(choice.id)
                        ? current.filter((id: string) => id !== choice.id)
                        : [...current, choice.id]
                      handleAnswer(currentQuestion.id, updated)
                    } else {
                      handleAnswer(currentQuestion.id, choice.id)
                      setTimeout(() => handleNext(), 300)
                    }
                  }}
                  className={`group w-full text-left px-6 py-5 border-2 transition-all ${
                    isSelected
                      ? `bg-gradient-to-r ${quiz.color} border-transparent text-white`
                      : 'bg-white border-stone-900 text-stone-900 hover:border-amber-600'
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-white bg-white/20'
                          : 'border-stone-900 group-hover:border-amber-600'
                      }`}
                    >
                      <span className="font-bold">
                        {currentQuestion.type === 'rating' ? choice.text : String.fromCharCode(65 + idx)}
                      </span>
                    </div>
                    <span className="text-xl font-medium">{choice.text}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur border-t-2 border-stone-900 p-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
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

          <button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
            className={`group flex items-center gap-2 px-8 py-4 font-semibold transition-all ${
              answers[currentQuestion.id]
                ? 'bg-stone-900 text-white hover:bg-amber-600'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            <span>{currentIndex === quiz.questions.length - 1 ? 'See Results' : 'Next'}</span>
            <ArrowRight
              className={`w-5 h-5 ${answers[currentQuestion.id] ? 'group-hover:translate-x-1' : ''} transition-transform`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
