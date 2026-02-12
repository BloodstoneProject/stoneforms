'use client'

import { use, useState, useEffect, useRef } from 'react'
import { getAdvancedEmojiTheme } from '@/lib/advanced-emoji-themes'
import { ArrowRight, Check, Sparkles } from 'lucide-react'

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
  trail: Array<{x: number, y: number, opacity: number}>
}

interface ConfettiPiece {
  id: number
  emoji: string
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
}

export default function AdvancedEmojiFormPage({ params }: { params: Promise<{ theme: string }> }) {
  const { theme: themeId } = use(params)
  const theme = getAdvancedEmojiTheme(themeId)
  
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [particles, setParticles] = useState<EmojiParticle[]>([])
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [showReaction, setShowReaction] = useState(false)
  const [reactionEmoji, setReactionEmoji] = useState('')
  const [shake, setShake] = useState(false)
  
  const canvasRef = useRef<HTMLDivElement>(null)

  const questions = [
    { id: 'q1', type: 'email', label: 'What is your email address?', required: true },
    { id: 'q2', type: 'short_text', label: 'What is your name?', required: true },
    { id: 'q3', type: 'multiple_choice', label: 'What brings you here today?', required: false, choices: [
      { id: 'a', text: 'Looking for a solution' },
      { id: 'b', text: 'Just browsing' },
      { id: 'c', text: 'Recommendation from friend' },
      { id: 'd', text: 'Saw your ad' },
    ]},
    { id: 'q4', type: 'long_text', label: 'Tell us more about yourself!', required: false },
  ]

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100

  // Track mouse for magnetic effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (theme.features.magneticEffect) {
        setMousePos({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [theme.features.magneticEffect])

  // Initialize particles with trails
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
      trail: [],
    }))
    
    setParticles(newParticles)
  }, [theme])

  // Animate particles with trails and magnetic effect
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prevParticles =>
        prevParticles.map(p => {
          let newX = p.x + p.vx
          let newY = p.y + p.vy
          let newVx = p.vx
          let newVy = p.vy

          // Magnetic effect towards mouse
          if (theme.features.magneticEffect) {
            const dx = mousePos.x - p.x
            const dy = mousePos.y - p.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < 30) {
              newVx += dx * 0.001
              newVy += dy * 0.001
            }
          }

          // Bounce off edges
          if (newX <= 0 || newX >= 100) {
            newVx = -newVx
            newX = Math.max(0, Math.min(100, newX))
          }
          if (newY <= 0 || newY >= 100) {
            newVy = -newVy
            newY = Math.max(0, Math.min(100, newY))
          }

          // Update trail
          const newTrail = theme.features.particleTrails
            ? [...p.trail, { x: p.x, y: p.y, opacity: 0.3 }].slice(-5)
            : []

          return {
            ...p,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: (p.rotation + p.rotationSpeed) % 360,
            trail: newTrail.map((t, i) => ({
              ...t,
              opacity: (i / newTrail.length) * 0.3,
            })),
          }
        })
      )
    }, 50)

    return () => clearInterval(interval)
  }, [mousePos, theme.features])

  // Success confetti
  const triggerConfetti = () => {
    if (!theme.features.successConfetti) return
    
    const newConfetti: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      emoji: theme.emojis[Math.floor(Math.random() * theme.emojis.length)],
      x: 50 + (Math.random() - 0.5) * 20,
      y: 50,
      vx: (Math.random() - 0.5) * 3,
      vy: -Math.random() * 5 - 5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    }))
    
    setConfetti(newConfetti)
    
    // Animate confetti
    const interval = setInterval(() => {
      setConfetti(prev => {
        const updated = prev.map(c => ({
          ...c,
          x: c.x + c.vx,
          y: c.y + c.vy,
          vy: c.vy + 0.3, // Gravity
          rotation: c.rotation + c.rotationSpeed,
        }))
        
        // Remove confetti that's off screen
        return updated.filter(c => c.y < 120)
      })
    }, 30)
    
    setTimeout(() => {
      clearInterval(interval)
      setConfetti([])
    }, 3000)
  }

  const showReactionBurst = (emoji: string) => {
    if (!theme.features.reactionBurst) return
    setReactionEmoji(emoji)
    setShowReaction(true)
    setTimeout(() => setShowReaction(false), 1000)
  }

  const handleNext = () => {
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      if (theme.features.shakeOnError) {
        setShake(true)
        setTimeout(() => setShake(false), 500)
      }
      showReactionBurst(theme.errorEmoji)
      return
    }

    showReactionBurst(theme.successEmoji)
    
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300)
    } else {
      setTimeout(() => {
        setIsSubmitted(true)
        triggerConfetti()
      }, 300)
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
          
          @keyframes float-up {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
          }
          
          .confetti-piece {
            animation: float-up 3s ease-out forwards;
          }
        `}</style>

        {/* Confetti */}
        {confetti.map(c => (
          <div
            key={c.id}
            className="absolute text-4xl confetti-piece pointer-events-none"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              transform: `rotate(${c.rotation}deg)`,
            }}
          >
            {c.emoji}
          </div>
        ))}

        <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
          <div className="max-w-2xl w-full text-center">
            <div className="text-9xl mb-8 animate-bounce">
              {theme.successEmoji}
            </div>
            <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-2xl">
              Amazing!
            </h1>
            <p className="text-3xl text-white/90 mb-12 drop-shadow-lg">
              Thank you for your response
            </p>
            <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-12 border-2 border-white/30 shadow-2xl">
              <Sparkles className="w-16 h-16 text-white mx-auto mb-4" />
              <p className="text-white/90 text-xl">
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
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        .shake {
          animation: shake 0.3s ease-in-out;
        }
        
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(255,255,255,0.5)); }
          50% { filter: drop-shadow(0 0 20px rgba(255,255,255,0.9)); }
        }
        
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Floating Emojis with Trails */}
      <div ref={canvasRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(particle => (
          <div key={particle.id}>
            {/* Trail */}
            {particle.trail.map((t, i) => (
              <div
                key={i}
                className="absolute transition-all duration-100"
                style={{
                  left: `${t.x}%`,
                  top: `${t.y}%`,
                  fontSize: `${particle.size * 0.7}px`,
                  opacity: t.opacity,
                  transform: `rotate(${particle.rotation}deg)`,
                }}
              >
                {particle.emoji}
              </div>
            ))}
            
            {/* Main particle */}
            <div
              className={`absolute transition-all duration-100 ${theme.features.pulseAnimation ? 'pulse-glow' : ''}`}
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
          </div>
        ))}
      </div>

      {/* Reaction Burst */}
      {showReaction && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="text-9xl animate-ping">
            {reactionEmoji}
          </div>
        </div>
      )}

      {/* Progress Bar with Emojis */}
      <div className="fixed top-0 left-0 right-0 h-3 bg-black/20 z-50">
        <div
          className="h-full bg-white/80 backdrop-blur-sm transition-all duration-500 relative"
          style={{ width: `${progress}%` }}
        >
          {theme.features.progressEmojis && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 text-2xl">
              {theme.emojis[currentStep % theme.emojis.length]}
            </div>
          )}
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center p-6 pt-20 relative z-10">
        <div className="max-w-3xl w-full">
          {/* Theme Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-xl">
              <span className="text-3xl">{theme.emojis[0]}</span>
              <span className="text-white font-bold text-lg">{theme.name}</span>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Question Card */}
          <div className={`bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/50 p-8 md:p-12 mb-6 ${shake ? 'shake' : ''}`}>
            {/* Question Number */}
            <div className="text-sm font-medium text-stone-500 mb-6 flex items-center gap-3">
              <span className="text-4xl">{theme.emojis[currentStep % theme.emojis.length]}</span>
              <span>Question {currentStep + 1} of {questions.length}</span>
            </div>

            {/* Question */}
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-8 leading-tight">
              {currentQuestion.label}
              {currentQuestion.required && (
                <span className="text-red-600 ml-2">*</span>
              )}
            </h2>

            {/* Input */}
            <div className="mb-10">
              {(currentQuestion.type === 'short_text' || currentQuestion.type === 'email') && (
                <input
                  type={currentQuestion.type === 'email' ? 'email' : 'text'}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                  placeholder="Type your answer here..."
                  className="w-full px-6 py-6 text-xl border-3 border-stone-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/50 focus:border-stone-900 transition-all bg-white shadow-inner"
                  autoFocus
                />
              )}

              {currentQuestion.type === 'long_text' && (
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                  placeholder="Type your answer here..."
                  rows={6}
                  className="w-full px-6 py-6 text-xl border-3 border-stone-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/50 focus:border-stone-900 transition-all resize-none bg-white shadow-inner"
                  autoFocus
                />
              )}

              {currentQuestion.type === 'multiple_choice' && currentQuestion.choices && (
                <div className="space-y-4">
                  {currentQuestion.choices.map((choice, idx) => (
                    <button
                      key={choice.id}
                      onClick={() => {
                        setAnswers({ ...answers, [currentQuestion.id]: choice.text })
                        showReactionBurst(theme.emojis[idx])
                      }}
                      className={`w-full text-left px-8 py-6 text-lg border-3 rounded-2xl transition-all shadow-lg hover:shadow-2xl ${
                        answers[currentQuestion.id] === choice.text
                          ? 'border-stone-900 bg-gradient-to-r from-stone-50 to-stone-100 scale-105 shadow-2xl'
                          : 'border-stone-300 hover:border-stone-500 hover:bg-stone-50 bg-white'
                      }`}
                    >
                      <span className="text-4xl mr-4">{theme.emojis[idx % theme.emojis.length]}</span>
                      <span className="font-medium">{choice.text}</span>
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
                className="px-8 py-4 text-stone-600 hover:text-stone-900 font-semibold disabled:opacity-0 disabled:cursor-not-allowed transition-all text-lg"
              >
                ← Back
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-2xl hover:from-stone-800 hover:to-stone-700 font-bold transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg"
              >
                {currentStep === questions.length - 1 ? (
                  <>Complete <Check className="w-6 h-6" /></>
                ) : (
                  <>Continue <ArrowRight className="w-6 h-6" /></>
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-white/80 text-sm drop-shadow-lg flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Powered by <span className="font-bold text-white">Stoneforms Pro</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
