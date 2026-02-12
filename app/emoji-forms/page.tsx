'use client'

import Link from 'next/link'
import { emojiThemes } from '@/lib/emoji-themes'
import { Sparkles, ArrowRight } from 'lucide-react'

export default function EmojiFormsGalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-stone-900">
              Stoneforms
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-amber-500" />
            <span className="text-sm font-bold text-amber-600 uppercase tracking-wider">
              NEW: Emoji Forms
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-stone-900 mb-6">
            Forms That<br />Come Alive ✨
          </h1>
          <p className="text-xl md:text-2xl text-stone-600 mb-8">
            Choose from 12 beautiful emoji themes. Each form features animated floating emojis that create an unforgettable experience.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="#themes"
              className="px-8 py-4 bg-stone-900 text-white rounded-xl hover:bg-stone-800 font-semibold text-lg flex items-center gap-2"
            >
              Explore Themes
              <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              href="/dashboard/forms/new?type=emoji"
              className="px-8 py-4 border-2 border-stone-900 text-stone-900 rounded-xl hover:bg-stone-50 font-semibold text-lg"
            >
              Create Emoji Form
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                emoji: '🎨',
                title: '12 Unique Themes',
                description: 'From celebration to business, find the perfect mood for your form',
              },
              {
                emoji: '✨',
                title: 'Animated Particles',
                description: 'Floating emojis that react and move beautifully across the screen',
              },
              {
                emoji: '📱',
                title: 'Mobile Optimized',
                description: 'Stunning animations that work perfectly on all devices',
              },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="text-6xl mb-4">{feature.emoji}</div>
                <h3 className="text-2xl font-bold text-stone-900 mb-3">{feature.title}</h3>
                <p className="text-stone-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes Gallery */}
      <section id="themes" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-stone-900 mb-4">
              Choose Your Theme
            </h2>
            <p className="text-xl text-stone-600">
              Each theme has unique emojis, colors, and animations
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {emojiThemes.map((theme) => (
              <Link
                key={theme.id}
                href={`/emoji-form/${theme.id}`}
                className="group"
              >
                <div className={`bg-gradient-to-br ${theme.gradient} rounded-2xl p-8 aspect-[3/4] relative overflow-hidden border-2 border-transparent hover:border-white hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl`}>
                  {/* Floating emojis preview */}
                  <div className="absolute inset-0 pointer-events-none">
                    {theme.emojis.slice(0, 5).map((emoji, idx) => (
                      <div
                        key={idx}
                        className="absolute text-4xl opacity-30 group-hover:opacity-60 transition-opacity"
                        style={{
                          left: `${20 + idx * 15}%`,
                          top: `${10 + idx * 15}%`,
                          transform: `rotate(${idx * 30}deg)`,
                        }}
                      >
                        {emoji}
                      </div>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex-1">
                      <div className="text-5xl mb-4">{theme.emojis[0]}</div>
                      <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                        {theme.name}
                      </h3>
                      <p className="text-white/90 text-sm drop-shadow">
                        {theme.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-white/80 text-sm">
                      <span>{theme.particleCount} particles</span>
                      <span className="capitalize">{theme.speed} speed</span>
                    </div>
                  </div>

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all" />
                </div>

                <div className="mt-4 text-center">
                  <span className="inline-flex items-center gap-2 text-stone-700 group-hover:text-stone-900 font-medium">
                    Try {theme.name}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-stone-900 to-stone-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Ready to Create Magic?
          </h2>
          <p className="text-xl text-stone-300 mb-8">
            Start building emoji forms that your users will love
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-10 py-5 bg-white text-stone-900 rounded-xl hover:bg-stone-100 font-bold text-lg"
          >
            Get Started Free
          </Link>
          <p className="text-stone-400 mt-4 text-sm">
            No credit card required • Free forever plan available
          </p>
        </div>
      </section>
    </div>
  )
}
