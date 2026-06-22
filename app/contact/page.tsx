'use client'

import Link from 'next/link'
import { Mail, MessageSquare, HelpCircle } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight hover:opacity-70 transition-opacity">Stoneforms</Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <Link href="/features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="/templates" className="hover:text-foreground transition-colors">Templates</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
            <Link href="/auth/signup" className="px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">Get Started</Link>
          </div>
        </div>
      </nav>

      <section className="pt-40 pb-16 px-6 sm:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-3 py-1 border border-border bg-secondary rounded-full text-xs font-medium text-muted-foreground tracking-wide mb-8">Contact</span>
          <h1 className="text-5xl sm:text-6xl font-semibold leading-[1.05] tracking-tight mb-6">
            Get in touch.
          </h1>
          <p className="text-lg text-muted-foreground">
            Have a question? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="pb-28 px-6 sm:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="p-6 bg-card border border-border rounded-lg text-center">
              <Mail className="w-6 h-6 text-foreground mx-auto mb-3" />
              <h3 className="text-sm font-semibold mb-1">Email</h3>
              <a href="mailto:hello@bloodstone.co.uk" className="text-sm text-muted-foreground hover:text-foreground transition-colors">hello@bloodstone.co.uk</a>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg text-center">
              <MessageSquare className="w-6 h-6 text-foreground mx-auto mb-3" />
              <h3 className="text-sm font-semibold mb-1">Chat</h3>
              <p className="text-sm text-muted-foreground">Live chat support</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg text-center">
              <HelpCircle className="w-6 h-6 text-foreground mx-auto mb-3" />
              <h3 className="text-sm font-semibold mb-1">Help</h3>
              <Link href="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Help Center</Link>
            </div>
          </div>

          <form className="space-y-5 p-8 bg-card border border-border rounded-lg">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input type="text" className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea rows={6} className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors resize-none" />
            </div>
            <button type="submit" className="w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
              Send Message
            </button>
          </form>
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
