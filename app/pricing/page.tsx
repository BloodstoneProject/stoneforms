'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'

export default function PricingPage() {
  const plans = [
    { name: 'Free', price: '£0', period: 'forever', description: 'Perfect for getting started', features: ['1 active form', '100 responses/month', 'Basic analytics', 'Email support'], cta: 'Get Started', highlighted: false },
    { name: 'Professional', price: '£15', period: 'per month', description: 'For growing businesses', features: ['Unlimited forms', '10,000 responses/month', 'Advanced analytics', 'Remove branding', 'Priority support', 'Custom domains'], cta: 'Start Free Trial', highlighted: true },
    { name: 'Business', price: '£25', period: 'per month', description: 'For teams and enterprises', features: ['Everything in Pro', 'Unlimited responses', 'API access', 'SSO & SAML', 'Dedicated support', 'SLA guarantee'], cta: 'Contact Sales', highlighted: false }
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
          <div className="inline-block px-4 py-1.5 bg-[#8e1c1c]/10 rounded-full text-xs font-light text-[#8e1c1c] tracking-wide mb-8">PRICING</div>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-light leading-[1.1] tracking-tight mb-6">
            Simple, transparent<br /><span className="font-normal">pricing.</span>
          </h1>
          <p className="text-xl sm:text-2xl font-light text-[#0a0a0a]/60 max-w-3xl mx-auto">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </div>
      </section>

      <section className="pb-32 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div key={i} className={\`relative p-10 bg-white/40 backdrop-blur-sm border rounded-3xl transition-all duration-300 \${plan.highlighted ? 'border-[#8e1c1c] scale-105' : 'border-[#0a0a0a]/5'}\`}>
                {plan.highlighted && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#8e1c1c] text-white text-xs font-light rounded-full">Most Popular</div>}
                <div className="mb-8">
                  <h3 className="text-2xl font-light mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-light">{plan.price}</span>
                    <span className="text-sm font-light text-[#0a0a0a]/60">{plan.period}</span>
                  </div>
                  <p className="text-sm font-light text-[#0a0a0a]/60">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm font-light">
                      <Check className="w-5 h-5 text-[#8e1c1c] flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup" className={\`block w-full text-center py-3 rounded-full text-sm font-light transition-all duration-300 \${plan.highlighted ? 'bg-[#0a0a0a] text-[#fafaf9] hover:bg-[#8e1c1c]' : 'border border-[#0a0a0a]/10 hover:border-[#0a0a0a]/20'}\`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
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
