'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FORM_TEMPLATES } from '@/lib/form-templates'
import { TEMPLATE_CATEGORIES, CATEGORY_BLURBS } from '@/lib/template-categories'

const FILTERS = ['All', ...TEMPLATE_CATEGORIES] as const

export default function TemplatesPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')

  const shown = filter === 'All' ? FORM_TEMPLATES : FORM_TEMPLATES.filter((t) => t.category === filter)

  const sections = TEMPLATE_CATEGORIES
    .map((cat) => ({ cat, items: shown.filter((t) => t.category === cat) }))
    .filter((s) => s.items.length > 0)

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#0a0a0a]">
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-[#fafaf9]/80 border-b border-[#0a0a0a]/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-5 flex items-center justify-between">
          <Link href="/" className="text-2xl font-light tracking-tight hover:opacity-70 transition-opacity">Stoneforms</Link>
          <div className="hidden md:flex items-center gap-10 text-sm font-light">
            <Link href="/features" className="hover:opacity-70 transition-opacity">Features</Link>
            <Link href="/templates" className="hover:opacity-70 transition-opacity">Templates</Link>
            <Link href="/pricing" className="hover:opacity-70 transition-opacity">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-light hover:opacity-70 transition-opacity">Sign in</Link>
            <Link href="/auth/signup" className="px-6 py-2.5 bg-[#0a0a0a] text-[#fafaf9] rounded-full text-sm font-light hover:bg-[#8e1c1c] transition-all duration-300">Get Started</Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-12 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 bg-[#8e1c1c]/10 rounded-full text-xs font-light text-[#8e1c1c] tracking-wide mb-8">TEMPLATES</div>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-light leading-[1.1] tracking-tight mb-6">
            Start faster with<br /><span className="font-normal">templates.</span>
          </h1>
          <p className="text-xl sm:text-2xl font-light text-[#0a0a0a]/60 max-w-3xl mx-auto">
            Professionally designed forms, surveys and quizzes. Customize and launch in minutes.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="px-6 sm:px-12 mb-12">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-2.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-light transition-all duration-300 ${
                filter === f
                  ? 'bg-[#0a0a0a] text-[#fafaf9]'
                  : 'bg-white/50 border border-[#0a0a0a]/10 text-[#0a0a0a]/70 hover:bg-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <section className="pb-32 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto space-y-20">
          {sections.map((section) => (
            <div key={section.cat}>
              <div className="mb-8 max-w-3xl">
                <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-2">{section.cat}</h2>
                <p className="text-base font-light text-[#0a0a0a]/50">{CATEGORY_BLURBS[section.cat]}</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((t) => (
                  <Link
                    key={t.id}
                    href={`/templates/${t.id}`}
                    className="group block p-8 bg-white/40 backdrop-blur-sm border border-[#0a0a0a]/5 rounded-3xl hover:bg-white/80 hover:scale-[1.02] transition-all duration-500"
                  >
                    <div className="text-5xl mb-4">{t.icon}</div>
                    <div className="text-xs font-light text-[#8e1c1c] tracking-wide mb-2 uppercase">
                      {t.quiz ? 'Scored quiz' : `${t.fields.length} fields`}
                    </div>
                    <h3 className="text-2xl font-light mb-2">{t.name}</h3>
                    <p className="text-sm font-light text-[#0a0a0a]/60">{t.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-32 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-light tracking-tight mb-8">Start with a template</h2>
          <Link href="/auth/signup" className="inline-flex items-center gap-3 px-10 py-5 bg-[#0a0a0a] text-[#fafaf9] rounded-full text-lg font-light hover:bg-[#8e1c1c] transition-all duration-300 group">
            Get started free<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#0a0a0a]/5 py-16 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto text-center text-sm font-light text-[#0a0a0a]/40">
          © 2024 Stoneforms. All rights reserved.
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>
    </div>
  )
}
