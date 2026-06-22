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
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight hover:opacity-70 transition-opacity">Stoneforms</Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <Link href="/features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="/templates" className="text-foreground transition-colors">Templates</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
            <Link href="/auth/signup" className="px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">Get Started</Link>
          </div>
        </div>
      </nav>

      <section className="pt-40 pb-10 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 border border-border bg-secondary rounded-full text-xs font-medium text-muted-foreground tracking-wide mb-8">Templates</span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight mb-6">
            Start faster with templates.
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Professionally designed forms, surveys and quizzes. Customize and launch in minutes.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="px-6 sm:px-12 mb-12">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <section className="pb-28 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto space-y-16">
          {sections.map((section) => (
            <div key={section.cat}>
              <div className="mb-6 max-w-3xl">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">{section.cat}</h2>
                <p className="text-sm text-muted-foreground">{CATEGORY_BLURBS[section.cat]}</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.items.map((t) => (
                  <Link
                    key={t.id}
                    href={`/templates/${t.id}`}
                    className="group block p-6 bg-card border border-border rounded-lg hover:bg-secondary transition-colors"
                  >
                    <div className="text-4xl mb-4">{t.icon}</div>
                    <div className="text-xs font-medium text-muted-foreground tracking-wide mb-2 uppercase">
                      {t.quiz ? 'Scored quiz' : `${t.fields.length} fields`}
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight mb-2">{t.name}</h3>
                    <p className="text-sm text-muted-foreground">{t.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 sm:px-12 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-8">Start with a template</h2>
          <Link href="/auth/signup" className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors group">
            Get started free<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-16 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          © 2024 Stoneforms. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
