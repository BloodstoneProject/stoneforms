'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function TemplatesPage() {
  const templates = [
    { name: 'Contact Form', category: 'General', responses: '10k+', image: '📝' },
    { name: 'Lead Generation', category: 'Marketing', responses: '25k+', image: '🎯' },
    { name: 'Event Registration', category: 'Events', responses: '15k+', image: '🎫' },
    { name: 'Job Application', category: 'HR', responses: '8k+', image: '💼' },
    { name: 'Customer Feedback', category: 'Support', responses: '20k+', image: '⭐' },
    { name: 'Order Form', category: 'E-commerce', responses: '12k+', image: '🛒' },
    { name: 'Survey', category: 'Research', responses: '18k+', image: '📊' },
    { name: 'Newsletter Signup', category: 'Marketing', responses: '30k+', image: '📧' },
    { name: 'Booking Form', category: 'Services', responses: '9k+', image: '📅' },
  ]

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

      <section className="pt-32 pb-20 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 bg-[#8e1c1c]/10 rounded-full text-xs font-light text-[#8e1c1c] tracking-wide mb-8">TEMPLATES</div>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-light leading-[1.1] tracking-tight mb-6">Start faster with<br /><span className="font-normal">templates.</span></h1>
          <p className="text-xl sm:text-2xl font-light text-[#0a0a0a]/60 max-w-3xl mx-auto">100+ professionally designed templates. Customize and launch in minutes.</p>
        </div>
      </section>

      <section className="pb-32 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, i) => (
              <Link key={i} href="/auth/signup" className="group block p-8 bg-white/40 backdrop-blur-sm border border-[#0a0a0a]/5 rounded-3xl hover:bg-white/80 hover:scale-105 transition-all duration-500">
                <div className="text-5xl mb-4">{template.image}</div>
                <div className="text-xs font-light text-[#8e1c1c] tracking-wide mb-2 uppercase">{template.category}</div>
                <h3 className="text-2xl font-light mb-2">{template.name}</h3>
                <div className="text-sm font-light text-[#0a0a0a]/60">{template.responses} responses</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-light tracking-tight mb-8">Start with a template</h2>
          <Link href="/auth/signup" className="inline-flex items-center gap-3 px-10 py-5 bg-[#0a0a0a] text-[#fafaf9] rounded-full text-lg font-light hover:bg-[#8e1c1c] transition-all duration-300 group">
            Browse all templates<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#0a0a0a]/5 py-16 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto text-center text-sm font-light text-[#0a0a0a]/40">© 2024 Stoneforms. All rights reserved.</div>
      </footer>

      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');*{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;}`}</style>
    </div>
  )
}
