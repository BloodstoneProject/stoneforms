'use client'

import Link from 'next/link'
import { Check, X } from 'lucide-react'

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '£0',
      period: 'forever',
      description: 'Perfect for trying out Stoneforms',
      features: [
        { text: '1 active form', included: true },
        { text: '100 responses per month', included: true },
        { text: 'Basic question types', included: true },
        { text: 'Email notifications', included: true },
        { text: 'Stoneforms branding', included: true },
        { text: 'Custom branding', included: false },
        { text: 'File uploads', included: false },
        { text: 'Advanced analytics', included: false },
        { text: 'API access', included: false },
        { text: 'Priority support', included: false },
      ],
      cta: 'Get Started Free',
      href: '/auth/signup?plan=free',
      popular: false,
    },
    {
      name: 'Professional',
      price: '£15',
      period: 'per month',
      description: 'For professionals and small teams',
      features: [
        { text: 'Unlimited forms', included: true },
        { text: '10,000 responses per month', included: true },
        { text: 'All question types', included: true },
        { text: 'File uploads (100MB)', included: true },
        { text: 'Remove Stoneforms branding', included: true },
        { text: 'Custom thank you pages', included: true },
        { text: 'Email integrations', included: true },
        { text: 'Basic analytics', included: true },
        { text: 'Export data (CSV)', included: true },
        { text: 'Email support', included: true },
      ],
      cta: 'Start 14-day Trial',
      href: '/auth/signup?plan=professional',
      popular: true,
    },
    {
      name: 'Business',
      price: '£25',
      period: 'per month',
      description: 'For growing businesses and teams',
      features: [
        { text: 'Everything in Professional', included: true },
        { text: 'Unlimited responses', included: true },
        { text: 'File uploads (1GB)', included: true },
        { text: 'Custom branding', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'CRM integration', included: true },
        { text: 'API access', included: true },
        { text: 'Team collaboration (5 users)', included: true },
        { text: 'Priority support', included: true },
        { text: 'White label option', included: true },
      ],
      cta: 'Start 14-day Trial',
      href: '/auth/signup?plan=business',
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b-2 border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Link href="/" className="text-2xl font-bold text-stone-900">
            Stoneforms
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-stone-900 mb-6">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-stone-600 max-w-3xl mx-auto mb-4">
          Choose the plan that fits your needs. Start free, upgrade when you grow.
        </p>
        <p className="text-stone-500">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white border-2 rounded-lg p-8 ${
                plan.popular
                  ? 'border-amber-600 shadow-2xl scale-105'
                  : 'border-stone-200 shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-amber-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-stone-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-stone-900">
                    {plan.price}
                  </span>
                  <span className="text-stone-600 ml-2">/{plan.period}</span>
                </div>
                <p className="text-stone-600">{plan.description}</p>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-stone-300 flex-shrink-0 mt-0.5" />
                    )}
                    <span
                      className={
                        feature.included
                          ? 'text-stone-900'
                          : 'text-stone-400 line-through'
                      }
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                href={plan.href}
                className={`block w-full py-4 text-center font-semibold rounded-lg transition-all ${
                  plan.popular
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-stone-900 text-white hover:bg-stone-800'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Can I change plans later?',
                a: 'Yes! You can upgrade or downgrade at any time. Changes take effect immediately.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, debit cards, and PayPal.',
              },
              {
                q: 'Is there a setup fee?',
                a: 'No setup fees. Ever. Just pay the monthly price.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Absolutely. Cancel anytime with one click. No questions asked.',
              },
              {
                q: 'Do you offer refunds?',
                a: 'Yes, we offer a 30-day money-back guarantee on all paid plans.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 border border-stone-200">
                <h3 className="font-bold text-stone-900 mb-2">{faq.q}</h3>
                <p className="text-stone-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <p className="text-stone-600 mb-4">
            Need a custom plan for your organization?
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 border-2 border-stone-900 text-stone-900 font-semibold rounded-lg hover:bg-stone-900 hover:text-white transition-all"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </div>
  )
}
