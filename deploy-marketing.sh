#!/bin/bash

echo "🎨 DEPLOYING ALL PREMIUM MARKETING PAGES"
echo "========================================"

# 1. FEATURES PAGE
echo "📄 Creating Features page..."
cat > app/features/page.tsx << 'FEATURESPAGE'
'use client'

import Link from 'next/link'
import { ArrowRight, MousePointer, Palette, Smartphone, BarChart, Users, Mail, Webhook, Calendar, CreditCard, Workflow, Shield, FileText } from 'lucide-react'

export default function FeaturesPage() {
  const features = [
    { icon: MousePointer, category: 'Builder', title: 'Drag & Drop', description: 'Create forms in minutes with our intuitive builder.' },
    { icon: Palette, category: 'Design', title: 'Beautiful Themes', description: 'Customize every detail to match your brand perfectly.' },
    { icon: Smartphone, category: 'Responsive', title: 'Mobile-First', description: 'Perfect on any device. Automatic optimization.' },
    { icon: BarChart, category: 'Analytics', title: 'Real-Time Insights', description: 'Track responses and measure conversion rates.' },
    { icon: Users, category: 'CRM', title: 'Built-In CRM', description: 'Manage contacts and track deals in one place.' },
    { icon: Mail, category: 'Email', title: 'Email Automation', description: 'Send automatic responses and follow-ups.' },
    { icon: Webhook, category: 'Integrations', title: 'Connect Everything', description: 'Integrate with 1000+ apps via Zapier.' },
    { icon: Calendar, category: 'Appointments', title: 'Booking', description: 'Let customers book appointments directly.' },
    { icon: CreditCard, category: 'Payments', title: 'Accept Payments', description: 'Collect payments with Stripe integration.' },
    { icon: Workflow, category: 'Automation', title: 'Workflows', description: 'Create powerful automated workflows.' },
    { icon: Shield, category: 'Security', title: 'Enterprise Security', description: 'Bank-grade encryption, GDPR compliant.' },
    { icon: FileText, category: 'Templates', title: '100+ Templates', description: 'Start fast with pre-built templates.' },
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
          <div className="inline-block px-4 py-1.5 bg-[#8e1c1c]/10 rounded-full text-xs font-light text-[#8e1c1c] tracking-wide mb-8">FEATURES</div>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-light leading-[1.1] tracking-tight mb-6">
            Everything you need.<br /><span className="font-normal">Nothing you don't.</span>
          </h1>
          <p className="text-xl sm:text-2xl font-light text-[#0a0a0a]/60 max-w-3xl mx-auto">
            Powerful features that help you create better forms and grow your business.
          </p>
        </div>
      </section>

      <section className="pb-32 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="group p-10 bg-white/40 backdrop-blur-sm border border-[#0a0a0a]/5 rounded-3xl hover:bg-white/80 hover:scale-105 transition-all duration-500">
                  <div className="mb-4 inline-flex p-3 bg-[#8e1c1c]/10 rounded-2xl group-hover:bg-[#8e1c1c]/20 transition-colors">
                    <Icon className="w-6 h-6 text-[#8e1c1c]" />
                  </div>
                  <div className="text-xs font-light text-[#8e1c1c] tracking-wide mb-2 uppercase">{feature.category}</div>
                  <h3 className="text-2xl font-light mb-3">{feature.title}</h3>
                  <p className="text-base font-light text-[#0a0a0a]/60">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-32 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-light tracking-tight mb-8">Ready to start?</h2>
          <Link href="/auth/signup" className="inline-flex items-center gap-3 px-10 py-5 bg-[#0a0a0a] text-[#fafaf9] rounded-full text-lg font-light hover:bg-[#8e1c1c] transition-all duration-300 group">
            Start your free trial<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#0a0a0a]/5 py-16 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto text-center text-sm font-light text-[#0a0a0a]/40">
          © 2024 Stoneforms. All rights reserved.
        </div>
      </footer>

      <style jsx global>{\`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');*{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;-webkit-font-smoothing:antialiased;}\`}</style>
    </div>
  )
}
FEATURESPAGE

# 2. PRICING PAGE
echo "💰 Creating Pricing page..."
cat > app/pricing/page.tsx << 'PRICINGPAGE'
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
PRICINGPAGE

# 3. TEMPLATES PAGE
echo "📋 Creating Templates page..."
cat > app/templates/page.tsx << 'TEMPLATESPAGE'
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
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-light leading-[1.1] tracking-tight mb-6">
            Start faster with<br /><span className="font-normal">templates.</span>
          </h1>
          <p className="text-xl sm:text-2xl font-light text-[#0a0a0a]/60 max-w-3xl mx-auto">
            100+ professionally designed templates. Customize and launch in minutes.
          </p>
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
        <div className="max-w-7xl mx-auto text-center text-sm font-light text-[#0a0a0a]/40">
          © 2024 Stoneforms. All rights reserved.
        </div>
      </footer>

      <style jsx global>{\`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');*{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;}\`}</style>
    </div>
  )
}
TEMPLATESPAGE

# 4. CONTACT PAGE
echo "📧 Creating Contact page..."
cat > app/contact/page.tsx << 'CONTACTPAGE'
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
CONTACTPAGE

echo ""
echo "✅ All 4 marketing pages created!"
echo ""
echo "📦 Committing and pushing..."

git add .
git commit -m "Premium redesign: Features, Pricing, Templates, Contact pages"
git push

echo ""
echo "🎉 DONE! Pages will be live in ~2 minutes at:"
echo "  • https://stoneforms.vercel.app/features"
echo "  • https://stoneforms.vercel.app/pricing"
echo "  • https://stoneforms.vercel.app/templates"
echo "  • https://stoneforms.vercel.app/contact"
