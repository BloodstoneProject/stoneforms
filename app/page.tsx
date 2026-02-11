'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Users, TrendingUp } from 'lucide-react'

// Emoji particles configuration
const EMOJIS = ['✨', '⚡', '🎯', '📊', '💎', '🚀', '⭐', '💫', '🎨', '🔥']

interface Particle {
  id: number
  emoji: string
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

export default function LandingPage() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize particles
  useEffect(() => {
    const initialParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      x: Math.random() * window.innerWidth,
      y: Math.random() * 600,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: 20 + Math.random() * 20,
      opacity: 0.3 + Math.random() * 0.4,
    }))
    setParticles(initialParticles)
  }, [])

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(p => {
          const dx = mousePos.x - p.x
          const dy = mousePos.y - p.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          // Attraction force (gentle pull towards mouse)
          const force = Math.min(100 / (distance + 1), 2)
          const attractionX = (dx / distance) * force * 0.1
          const attractionY = (dy / distance) * force * 0.1

          let newX = p.x + p.vx + attractionX
          let newY = p.y + p.vy + attractionY
          let newVx = p.vx + attractionX * 0.1
          let newVy = p.vy + attractionY * 0.1

          // Bounce off edges
          if (newX < 0 || newX > window.innerWidth) {
            newVx = -newVx * 0.8
            newX = Math.max(0, Math.min(window.innerWidth, newX))
          }
          if (newY < 0 || newY > 600) {
            newVy = -newVy * 0.8
            newY = Math.max(0, Math.min(600, newY))
          }

          // Damping
          newVx *= 0.98
          newVy *= 0.98

          return {
            ...p,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
          }
        })
      )
    }, 1000 / 60) // 60 FPS

    return () => clearInterval(interval)
  }, [mousePos])

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 font-sans">
      {/* DM Sans Font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        
        * {
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      {/* Hero Section with Interactive Emojis */}
      <div className="relative h-screen overflow-hidden">
        {/* Concrete Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Animated Emoji Particles */}
        <div className="absolute inset-0 pointer-events-none" ref={containerRef}>
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute transition-transform duration-100"
              style={{
                left: `${p.x}px`,
                top: `${p.y}px`,
                fontSize: `${p.size}px`,
                opacity: p.opacity,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {p.emoji}
            </div>
          ))}
        </div>

        {/* Art Deco Border Pattern */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-60" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
          {/* Art Deco Logo/Badge */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 blur-2xl opacity-20" />
            <div className="relative px-8 py-4 border-2 border-stone-800 bg-white/90 backdrop-blur">
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-amber-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-amber-600" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-amber-600" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-amber-600" />
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-stone-900">
                STONEFORMS
              </h1>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-2xl md:text-4xl font-medium text-stone-800 mb-4 max-w-3xl leading-tight">
            Craft Forms That Convert
            <br />
            <span className="text-stone-600">Like Stone</span>
          </p>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-stone-600 mb-12 max-w-2xl">
            The premium form builder with AI generation, interactive quizzes,
            and built-in CRM. Art Deco elegance meets modern conversion.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link
              href="/dashboard"
              className="group relative px-8 py-4 bg-stone-900 text-white font-semibold overflow-hidden transition-all hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-400 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-2">
                Start Building
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              href="#features"
              className="px-8 py-4 border-2 border-stone-900 text-stone-900 font-semibold hover:bg-stone-900 hover:text-white transition-all"
            >
              Explore Features
            </Link>
          </div>

          {/* Stats - Art Deco Style */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl">
            {[
              { value: '50K+', label: 'Forms Created' },
              { value: '99.9%', label: 'Uptime' },
              { value: '5M+', label: 'Responses' },
            ].map((stat, i) => (
              <div key={i} className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900 transform rotate-1" />
                <div className="relative bg-white p-4 border-2 border-stone-800">
                  <div className="text-3xl font-bold text-stone-900">{stat.value}</div>
                  <div className="text-sm text-stone-600 mt-1">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-stone-800 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-stone-800 rounded-full" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 px-6 bg-stone-900 relative overflow-hidden">
        {/* Art Deco Pattern Background */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-2 border-2 border-amber-600 bg-amber-600/10 mb-6">
              <span className="text-amber-400 font-semibold tracking-wide uppercase">Premium Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need to Convert
            </h2>
            <p className="text-xl text-stone-400 max-w-2xl mx-auto">
              Built for creators, marketers, and businesses who demand excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'AI Form Generation',
                description: 'Describe your form, AI builds it instantly. Like magic.',
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                icon: Zap,
                title: 'Typeform-Style Flow',
                description: 'Smooth, engaging one-question-at-a-time experience.',
                gradient: 'from-amber-500 to-orange-500',
              },
              {
                icon: Users,
                title: 'Rich CRM',
                description: 'Detailed contact management with exportable data.',
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                icon: TrendingUp,
                title: 'Quiz Templates',
                description: '6+ ready-to-use templates. Start converting instantly.',
                gradient: 'from-green-500 to-emerald-500',
              },
            ].map((feature, i) => (
              <div key={i} className="group relative">
                {/* Art Deco Frame */}
                <div className="absolute -inset-0.5 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
                
                <div className="relative bg-stone-800 p-8 border-2 border-stone-700 h-full hover:border-amber-600 transition-all">
                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-6`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-stone-400">{feature.description}</p>

                  {/* Art Deco Corner Accents */}
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Login Section */}
      <div className="py-24 px-6 bg-gradient-to-br from-stone-100 to-stone-200 relative">
        {/* Concrete Texture */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-md mx-auto relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-stone-900 mb-2">Ready to Get Started?</h2>
            <p className="text-stone-600">Sign in to your account or create a new one</p>
          </div>

          <div className="bg-white border-4 border-stone-900 p-8 relative">
            {/* Art Deco Corners */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-amber-600" />
            <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-amber-600" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-amber-600" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-amber-600" />

            <div className="space-y-4">
              <Link
                href="/auth/login"
                className="block w-full py-4 bg-stone-900 text-white text-center font-semibold hover:bg-stone-800 transition-colors"
              >
                Sign In
              </Link>
              
              <Link
                href="/auth/signup"
                className="block w-full py-4 border-2 border-stone-900 text-stone-900 text-center font-semibold hover:bg-stone-900 hover:text-white transition-all"
              >
                Create Account
              </Link>

              <div className="text-center pt-4">
                <Link href="/demo" className="text-sm text-stone-600 hover:text-amber-600 transition-colors">
                  Try the demo →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 border-t-4 border-amber-600 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-stone-400 mb-4">© 2026 Stoneforms. Crafted with precision.</p>
          <div className="flex justify-center gap-6 text-sm text-stone-500">
            <a href="#" className="hover:text-amber-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
