'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/MarketingNav'

export default function PricingPage() {
  const plans = [
    { name: 'Free', price: '£0', period: 'forever', description: 'Perfect for getting started', features: ['1 active form', '100 responses/month', 'Basic analytics', 'Email support'], cta: 'Get Started', highlighted: false },
    { name: 'Professional', price: '£15', period: 'per month', description: 'For growing businesses', features: ['Unlimited forms', '10,000 responses/month', 'Advanced analytics', 'Remove branding', 'Priority support', 'Custom domains'], cta: 'Start Free Trial', highlighted: true },
    { name: 'Business', price: '£25', period: 'per month', description: 'For teams and enterprises', features: ['Everything in Pro', 'Unlimited responses', 'API access', 'SSO & SAML', 'Dedicated support', 'SLA guarantee'], cta: 'Contact Sales', highlighted: false }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingNav active="/pricing" />

      <section className="pt-40 pb-16 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 border border-border bg-secondary rounded-full text-xs font-medium text-muted-foreground tracking-wide mb-8">Pricing</span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight mb-6">
            Simple, transparent pricing.
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </div>
      </section>

      <section className="pb-28 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan, i) => (
              <div key={i} className={`relative p-8 bg-card rounded-lg border transition-colors ${plan.highlighted ? 'border-foreground' : 'border-border'}`}>
                {plan.highlighted && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">Most Popular</div>}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold tracking-tight mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-foreground flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup" className={`block w-full text-center py-2.5 rounded-md text-sm font-medium transition-colors ${plan.highlighted ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-border bg-card hover:bg-secondary'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
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
