'use client'

import { use, useState, useEffect, useRef } from 'react'
import { getEmojiTheme } from '@/lib/emoji-themes'
import { ArrowRight, Check } from 'lucide-react'

interface EmojiParticle {
  id: number
  emoji: string
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rotation: number
  rotationSpeed: number
  opacity: number
}

export default function EmojiFormPage({ params }: { params: Promise<{ theme: string }> }) {
  const { theme: themeId } = use(params)
  const theme = getEmojiTheme(themeId)
  
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [particles, setParticles] = useState<EmojiParticle[]>([])
  const canvasRef = useRef<HTMLDivElement>(null)

  const questions = [
    { id: 'q1', type: 'email', label: 'What is your email address?', required: true },
    { id: 'q2', type: 'short_text', label: 'What is your name?', required: true },
    { id: 'q3', type: 'multiple_choice', label: 'How did you hear about us?', required: false, choices: [
      { id: 'a', text: 'Social Media' },
      { id: 'b', text: 'Friend Referral' },
      { id: 'c', text: 'Google Search' },
      { id: 'd', text: 'Advertisement' },
    ]},
    { id: 'q4', type: 'long_text', label: 'Any additional comments?', required: false },
  ]

  // Initialize particles
  useEffect(() => {
    const speedMultiplier = theme.speed === 'slow' ? 0.3 : theme.speed === 'fast' ? 1 : 0.6
    
    const newParticles: EmojiParticle[] = Array.from({ length: theme.particleCount }, (_, i) => ({
      id: i,
      emoji: theme.emojis[Math.floor(Math.random() * theme.emojis.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * speedMultiplier,
      vy: (Math.random() - 0.5) * speedMultiplier,
      size: 20 + Math.random() * 30,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      opacity: 0.3 + Math.random() * 0.4,
    }))
    
    setParticles(newParticles)
  }, [theme])

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prevParticles =>
        prevParticles.map(p => {
          let newX = p.x + p.vx
          let newY = p.y + p.vy
          let newVx = p.vx
          let newVy = p.vy

          // Bounce off edges
          if (newX <= 0 || newX >= 100) {
            newVx = -newVx
            newX = Math.max(0, Math.min(100, newX))
          }
          if (newY <= 0 || newY >= 100) {
            newVy = -newVy
            newY = Math.max(0, Math.min(100, newY))
          }

          return {
            ...p,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: (p.rotation + p.rotationSpeed) % 360,
          }
        })
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

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
      <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} relative overflow-hidden`}>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
          * { font-family: 'DM Sans', sans-serif; }
        `}</style>

        {/* Success Emoji Rain */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-6xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {theme.emojis[Math.floor(Math.random() * theme.emojis.length)]}
            </div>
          ))}
        </div>

        <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
          <div className="max-w-2xl w-full text-center">
            <div className="text-8xl mb-8 animate-bounce">
              {theme.emojis[0]}
            </div>
            <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">
              Thank You!
            </h1>
            <p className="text-2xl text-white/90 mb-8 drop-shadow">
              Your response has been recorded
            </p>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <p className="text-white/80">
                We will get back to you soon!
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} relative overflow-hidden`}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Floating Emojis */}
      <div ref={canvasRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute transition-all duration-100"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              fontSize: `${particle.size}px`,
              opacity: particle.opacity,
              transform: `rotate(${particle.rotation}deg)`,
            }}
          >
            {particle.emoji}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-black/20 z-50">
        <div
          className="h-full bg-white/80 backdrop-blur-sm transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="min-h-screen flex items-center justify-center p-6 pt-16 relative z-10">
        <div className="max-w-3xl w-full">
          {/* Theme Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <span className="text-2xl">{theme.emojis[0]}</span>
              <span className="text-white font-medium">{theme.name} Form</span>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12 mb-6">
            {/* Question Number */}
            <div className="text-sm font-medium text-stone-500 mb-4 flex items-center gap-2">
              <span className="text-2xl">{theme.emojis[currentStep % theme.emojis.length]}</span>
              Question {currentStep + 1} of {questions.length}
            </div>

            {/* Question */}
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-8">
              {currentQuestion.label}
              {currentQuestion.required && (
                <span className="text-red-600 ml-2">*</span>
              )}
            </h2>

            {/* Input */}
            <div className="mb-8">
              {(currentQuestion.type === 'short_text' || currentQuestion.type === 'email') && (
                <input
                  type={currentQuestion.type === 'email' ? 'email' : 'text'}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                  placeholder="Type your answer here..."
                  className="w-full px-6 py-5 text-xl border-2 border-stone-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/50 focus:border-stone-900 transition-all bg-white"
                  autoFocus
                />
              )}

              {currentQuestion.type === 'long_text' && (
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                  placeholder="Type your answer here..."
                  rows={6}
                  className="w-full px-6 py-5 text-xl border-2 border-stone-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/50 focus:border-stone-900 transition-all resize-none bg-white"
                  autoFocus
                />
              )}

              {currentQuestion.type === 'multiple_choice' && currentQuestion.choices && (
                <div className="space-y-3">
                  {currentQuestion.choices.map((choice, idx) => (
                    <button
                      key={choice.id}
                      onClick={() => setAnswers({ ...answers, [currentQuestion.id]: choice.text })}
                      className={`w-full text-left px-6 py-5 text-lg border-2 rounded-2xl transition-all ${
                        answers[currentQuestion.id] === choice.text
                          ? 'border-stone-900 bg-stone-50 shadow-lg scale-105'
                          : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50 bg-white'
                      }`}
                    >
                      <span className="text-3xl mr-4">{theme.emojis[idx % theme.emojis.length]}</span>
                      {choice.text}
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
                className="flex items-center gap-2 px-8 py-4 bg-stone-900 text-white rounded-2xl hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                {currentStep === questions.length - 1 ? (
                  <>Submit <Check className="w-5 h-5" /></>
                ) : (
                  <>Next <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-white/70 text-sm drop-shadow">
              Powered by <span className="font-semibold text-white">Stoneforms</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
