'use client'

import Link from 'next/link'
import { advancedEmojiThemes } from '@/lib/advanced-emoji-themes'
import { Sparkles, Zap, Star, Heart, Flame, Check } from 'lucide-react'

export default function AdvancedEmojiFormsPage() {
  const features = [
    { icon: Zap, title: 'Particle Trails', desc: 'Emojis leave beautiful trails as they move' },
    { icon: Star, title: 'Reaction Bursts', desc: 'Interactive feedback on every action' },
    { icon: Heart, title: 'Magnetic Effects', desc: 'Emojis react to your mouse movements' },
    { icon: Flame, title: 'Success Confetti', desc: 'Celebration explosions on completion' },
    { icon: Sparkles, title: 'Sound Effects', desc: 'Audio feedback for immersive experience' },
    { icon: Check, title: 'Smart Validation', desc: 'Gentle shake animations on errors' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              Stoneforms
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-3 bg-white text-purple-900 rounded-xl hover:bg-stone-100 font-bold"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        {/* Floating background emojis */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {['✨', '🎉', '💫', '⭐', '🌟'].map((emoji, i) => (
            <div
              key={i}
              className="absolute text-6xl animate-bounce"
              style={{
                left: `${20 + i * 20}%`,
                top: `${10 + (i % 3) * 30}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${3 + i * 0.5}s`,
              }}
            >
              {emoji}
            </div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-bold uppercase text-sm tracking-wider">
              Advanced Emoji Forms PRO
            </span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-bold text-white mb-8 leading-tight drop-shadow-2xl">
            The Most Interactive<br />Forms Ever Created
          </h1>
          
          <p className="text-2xl md:text-3xl text-white/90 mb-12 max-w-4xl mx-auto drop-shadow-lg">
            8 premium themes with particle trails, magnetic effects, reaction bursts, 
            and sound effects that make every form unforgettable
          </p>
          
          <div className="flex items-center justify-center gap-6">
            <a
              href="#themes"
              className="px-10 py-5 bg-white text-purple-900 rounded-2xl hover:bg-stone-100 font-bold text-xl flex items-center gap-3 shadow-2xl transform hover:scale-105 transition-all"
            >
              <Zap className="w-6 h-6" />
              Explore Pro Themes
            </a>
            <Link
              href="/emoji-forms"
              className="px-10 py-5 border-2 border-white text-white rounded-2xl hover:bg-white/10 font-bold text-xl"
            >
              View Basic Themes
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-white/5 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-white text-center mb-16">
            Premium Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/80">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes */}
      <section id="themes" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-bold text-white mb-6">
              Premium Themes
            </h2>
            <p className="text-2xl text-white/80">
              Each theme includes all pro features with unique visuals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advancedEmojiThemes.map((theme) => (
              <Link
                key={theme.id}
                href={`/emoji-pro/${theme.id}`}
                className="group relative"
              >
                <div className={`bg-gradient-to-br ${theme.gradient} rounded-3xl p-8 aspect-[3/4] relative overflow-hidden border-3 border-white/20 hover:border-white/40 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105`}>
                  {/* Animated preview */}
                  <div className="absolute inset-0 pointer-events-none">
                    {theme.emojis.slice(0, 6).map((emoji, idx) => (
                      <div
                        key={idx}
                        className="absolute text-5xl opacity-40 group-hover:opacity-70 transition-all animate-bounce"
                        style={{
                          left: `${15 + (idx % 3) * 30}%`,
                          top: `${10 + Math.floor(idx / 3) * 40}%`,
                          animationDelay: `${idx * 0.2}s`,
                          animationDuration: `${2 + idx * 0.3}s`,
                        }}
                      >
                        {emoji}
                      </div>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex-1">
                      <div className="text-6xl mb-4 drop-shadow-lg">{theme.emojis[0]}</div>
                      <h3 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
                        {theme.name}
                      </h3>
                      <p className="text-white/90 drop-shadow">
                        {theme.description}
                      </p>
                    </div>

                    {/* Pro Badge */}
                    <div className="mt-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                        <Sparkles className="w-4 h-4 text-white" />
                        <span className="text-white text-xs font-bold">PRO</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mt-4 space-y-2">
                      {theme.features.particleTrails && (
                        <div className="flex items-center gap-2 text-white/80 text-xs">
                          <Check className="w-3 h-3" />
                          <span>Particle Trails</span>
                        </div>
                      )}
                      {theme.features.magneticEffect && (
                        <div className="flex items-center gap-2 text-white/80 text-xs">
                          <Check className="w-3 h-3" />
                          <span>Magnetic Effect</span>
                        </div>
                      )}
                      {theme.features.successConfetti && (
                        <div className="flex items-center gap-2 text-white/80 text-xs">
                          <Check className="w-3 h-3" />
                          <span>Confetti Burst</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all rounded-3xl" />
                </div>

                <div className="mt-4 text-center">
                  <span className="text-white/80 group-hover:text-white font-semibold">
                    Try {theme.name} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <Sparkles className="w-20 h-20 text-white mx-auto mb-8" />
          <h2 className="text-6xl font-bold text-white mb-8">
            Create Your First<br />Pro Emoji Form
          </h2>
          <p className="text-2xl text-white/90 mb-12">
            Start with our free plan, upgrade to Pro for advanced features
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-12 py-6 bg-white text-purple-900 rounded-2xl hover:bg-stone-100 font-bold text-2xl shadow-2xl transform hover:scale-105 transition-all"
          >
            Get Started Free
          </Link>
          <p className="text-white/70 mt-6">
            No credit card required • Pro features from £15/month
          </p>
        </div>
      </section>
    </div>
  )
}
