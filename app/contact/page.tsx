'use client'

import Link from 'next/link'
import { Mail, MessageSquare, HelpCircle } from 'lucide-react'

export default function ContactPage() {
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
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 bg-[#8e1c1c]/10 rounded-full text-xs font-light text-[#8e1c1c] tracking-wide mb-8">CONTACT</div>
          <h1 className="text-6xl sm:text-7xl font-light leading-[1.1] tracking-tight mb-6">
            Get in<br /><span className="font-normal">touch.</span>
          </h1>
          <p className="text-xl font-light text-[#0a0a0a]/60">
            Have a question? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="pb-32 px-6 sm:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-8 bg-white/40 backdrop-blur-sm border border-[#0a0a0a]/5 rounded-3xl text-center">
              <Mail className="w-8 h-8 text-[#8e1c1c] mx-auto mb-4" />
              <h3 className="text-lg font-light mb-2">Email</h3>
              <a href="mailto:hello@stoneforms.com" className="text-sm font-light text-[#0a0a0a]/60 hover:text-[#8e1c1c] transition-colors">hello@stoneforms.com</a>
            </div>
            <div className="p-8 bg-white/40 backdrop-blur-sm border border-[#0a0a0a]/5 rounded-3xl text-center">
              <MessageSquare className="w-8 h-8 text-[#8e1c1c] mx-auto mb-4" />
              <h3 className="text-lg font-light mb-2">Chat</h3>
              <p className="text-sm font-light text-[#0a0a0a]/60">Live chat support</p>
            </div>
            <div className="p-8 bg-white/40 backdrop-blur-sm border border-[#0a0a0a]/5 rounded-3xl text-center">
              <HelpCircle className="w-8 h-8 text-[#8e1c1c] mx-auto mb-4" />
              <h3 className="text-lg font-light mb-2">Help</h3>
              <Link href="/help" className="text-sm font-light text-[#0a0a0a]/60 hover:text-[#8e1c1c] transition-colors">Help Center</Link>
            </div>
          </div>

          <form className="space-y-6 p-10 bg-white/40 backdrop-blur-sm border border-[#0a0a0a]/5 rounded-3xl">
            <div>
              <label className="block text-sm font-light mb-2">Name</label>
              <input type="text" className="w-full px-4 py-3 bg-white/60 border border-[#0a0a0a]/10 rounded-2xl text-sm font-light focus:outline-none focus:border-[#8e1c1c] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-light mb-2">Email</label>
              <input type="email" className="w-full px-4 py-3 bg-white/60 border border-[#0a0a0a]/10 rounded-2xl text-sm font-light focus:outline-none focus:border-[#8e1c1c] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-light mb-2">Message</label>
              <textarea rows={6} className="w-full px-4 py-3 bg-white/60 border border-[#0a0a0a]/10 rounded-2xl text-sm font-light focus:outline-none focus:border-[#8e1c1c] transition-colors resize-none" />
            </div>
            <button type="submit" className="w-full py-3 bg-[#0a0a0a] text-[#fafaf9] rounded-full text-sm font-light hover:bg-[#8e1c1c] transition-all duration-300">
              Send Message
            </button>
          </form>
        </div>
      </section>

      <footer className="border-t border-[#0a0a0a]/5 py-16 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto text-center text-sm font-light text-[#0a0a0a]/40">
          © 2024 Stoneforms. All rights reserved.
        </div>
      </footer>

      <style jsx global>{\`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');*{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;}\`}</style>
    </div>
  )
}
