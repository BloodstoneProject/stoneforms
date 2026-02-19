'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Shield, Globe, Smartphone, Lock } from 'lucide-react'

export default function PremiumHomepage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const stats = [
    { value: '10,000+', label: 'Active Users' },
    { value: '1M+', label: 'Forms Created' },
    { value: '50M+', label: 'Responses' },
    { value: '99.9%', label: 'Uptime' },
  ]

  const features = [
    { icon: Sparkles, title: 'Effortless Builder', desc: 'Create stunning forms in minutes' },
    { icon: Shield, title: 'Enterprise Security', desc: 'Bank-grade encryption & compliance' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Instant responses, zero lag' },
    { icon: Globe, title: 'Works Everywhere', desc: 'Perfect on any device, any browser' },
    { icon: Smartphone, title: 'Mobile First', desc: 'Designed for the mobile generation' },
    { icon: Lock, title: 'Privacy Focused', desc: 'Your data, your control, always' },
  ]

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#0a0a0a] overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(142,28,28,0.03), transparent 80%)`,
        }}
      />

      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-[#fafaf9]/80 border-b border-[#0a0a0a]/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-5 flex items-center justify-between">
          <Link href="/" className="text-2xl font-light tracking-tight hover:opacity-70 transition-opacity">
            Stoneforms
          </Link>
          
          <div className="hidden md:flex items-center gap-10 text-sm font-light">
            <Link href="/features" className="hover:opacity-70 transition-opacity">Features</Link>
            <Link href="/templates" className="hover:opacity-70 transition-opacity">Templates</Link>
            <Link href="/pricing" className="hover:opacity-70 transition-opacity">Pricing</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/auth/login"
              className="text-sm font-light hover:opacity-70 transition-opacity"
            >
              Sign in
            </Link>
            <Link 
              href="/auth/signup"
              className="px-6 py-2.5 bg-[#0a0a0a] text-[#fafaf9] rounded-full text-sm font-light hover:bg-[#8e1c1c] transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-24 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <div 
            className="mb-8 opacity-0 animate-[fadeUp_0.8s_ease-out_0.2s_forwards]"
            style={{ animationFillMode: 'forwards' }}
          >
            <div className="inline-block px-4 py-1.5 bg-[#8e1c1c]/10 rounded-full text-xs font-light text-[#8e1c1c] tracking-wide mb-8">
              NOW AVAILABLE
            </div>
          </div>

          <h1 
            className="text-6xl sm:text-7xl lg:text-8xl font-light leading-[1.1] tracking-tight mb-6 opacity-0 animate-[fadeUp_0.8s_ease-out_0.4s_forwards]"
            style={{ animationFillMode: 'forwards' }}
          >
            Forms that feel
            <br />
            <span className="font-normal">effortless.</span>
          </h1>

          <p 
            className="text-xl sm:text-2xl font-light text-[#0a0a0a]/60 max-w-3xl mx-auto mb-12 opacity-0 animate-[fadeUp_0.8s_ease-out_0.6s_forwards]"
            style={{ animationFillMode: 'forwards' }}
          >
            The most intuitive form builder. Designed for perfection.
            <br />Engineered for performance.
          </p>

          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-[fadeUp_0.8s_ease-out_0.8s_forwards]"
            style={{ animationFillMode: 'forwards' }}
          >
            <Link
              href="/auth/signup"
              className="group px-8 py-4 bg-[#0a0a0a] text-[#fafaf9] rounded-full text-base font-light hover:bg-[#8e1c1c] transition-all duration-300 flex items-center gap-2"
            >
              Start free trial
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/templates"
              className="px-8 py-4 border border-[#0a0a0a]/10 rounded-full text-base font-light hover:border-[#0a0a0a]/20 transition-all duration-300"
            >
              Explore templates
            </Link>
          </div>

          <p className="text-xs font-light text-[#0a0a0a]/40 mt-6 opacity-0 animate-[fadeUp_0.8s_ease-out_1s_forwards]" style={{ animationFillMode: 'forwards' }}>
            No credit card required · Free forever plan
          </p>
        </div>

        <div className="mt-32 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="relative p-8 bg-white/40 backdrop-blur-sm border border-[#0a0a0a]/5 rounded-3xl hover:bg-white/60 hover:scale-105 transition-all duration-500 opacity-0 animate-[fadeUp_0.8s_ease-out_forwards]"
              style={{ 
                animationDelay: `${1.2 + i * 0.1}s`,
                animationFillMode: 'forwards',
                transform: `translateY(${scrollY * 0.05}px)`
              }}
            >
              <div className="text-4xl font-light tracking-tight mb-2">{stat.value}</div>
              <div className="text-sm font-light text-[#0a0a0a]/50">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-32 px-6 sm:px-12 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl sm:text-6xl font-light tracking-tight text-center mb-4">
            Everything you need.
          </h2>
          <p className="text-xl font-light text-[#0a0a0a]/60 text-center mb-20">
            Nothing you don't.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="group relative p-10 bg-white/40 backdrop-blur-sm border border-[#0a0a0a]/5 rounded-3xl hover:bg-white/80 hover:scale-105 transition-all duration-500 cursor-pointer"
                  style={{
                    transform: `translateY(${Math.sin((scrollY + i * 100) * 0.003) * 10}px)`,
                  }}
                >
                  <div className="mb-6 inline-flex p-4 bg-[#8e1c1c]/10 rounded-2xl group-hover:bg-[#8e1c1c]/20 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-[#8e1c1c]" />
                  </div>
                  <h3 className="text-2xl font-light mb-3">{feature.title}</h3>
                  <p className="text-base font-light text-[#0a0a0a]/60">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-32 px-6 sm:px-12 relative">
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8e1c1c]/5 to-transparent rounded-[4rem] -z-10" />
          
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight mb-8">
            Ready to transform
            <br />
            <span className="font-normal">your forms?</span>
          </h2>
          
          <p className="text-xl font-light text-[#0a0a0a]/60 mb-12 max-w-2xl mx-auto">
            Join thousands of businesses using Stoneforms
            to collect better data, faster.
          </p>

          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#0a0a0a] text-[#fafaf9] rounded-full text-lg font-light hover:bg-[#8e1c1c] transition-all duration-300 group"
          >
            Start your free trial
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="text-sm font-light text-[#0a0a0a]/40 mt-6">
            No credit card required · Cancel anytime
          </p>
        </div>
      </section>

      <footer className="border-t border-[#0a0a0a]/5 py-16 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div>
              <h4 className="text-sm font-light mb-4">Product</h4>
              <ul className="space-y-3 text-sm font-light text-[#0a0a0a]/60">
                <li><Link href="/features" className="hover:opacity-70 transition-opacity">Features</Link></li>
                <li><Link href="/pricing" className="hover:opacity-70 transition-opacity">Pricing</Link></li>
                <li><Link href="/templates" className="hover:opacity-70 transition-opacity">Templates</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-light mb-4">Company</h4>
              <ul className="space-y-3 text-sm font-light text-[#0a0a0a]/60">
                <li><Link href="/about" className="hover:opacity-70 transition-opacity">About</Link></li>
                <li><Link href="/blog" className="hover:opacity-70 transition-opacity">Blog</Link></li>
                <li><Link href="/contact" className="hover:opacity-70 transition-opacity">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-light mb-4">Resources</h4>
              <ul className="space-y-3 text-sm font-light text-[#0a0a0a]/60">
                <li><Link href="/docs" className="hover:opacity-70 transition-opacity">Documentation</Link></li>
                <li><Link href="/help" className="hover:opacity-70 transition-opacity">Help Center</Link></li>
                <li><Link href="/api" className="hover:opacity-70 transition-opacity">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-light mb-4">Legal</h4>
              <ul className="space-y-3 text-sm font-light text-[#0a0a0a]/60">
                <li><Link href="/privacy" className="hover:opacity-70 transition-opacity">Privacy</Link></li>
                <li><Link href="/terms" className="hover:opacity-70 transition-opacity">Terms</Link></li>
                <li><Link href="/security" className="hover:opacity-70 transition-opacity">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#0a0a0a]/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-light text-[#0a0a0a]/40">
            <div>© 2024 Stoneforms. All rights reserved.</div>
            <div className="flex items-center gap-8">
              <Link href="https://twitter.com" className="hover:opacity-70 transition-opacity">Twitter</Link>
              <Link href="https://github.com" className="hover:opacity-70 transition-opacity">GitHub</Link>
              <Link href="https://linkedin.com" className="hover:opacity-70 transition-opacity">LinkedIn</Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');

        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  )
}
