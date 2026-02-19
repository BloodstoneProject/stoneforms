'use client'

import Link from 'next/link'
import { ArrowRight, Check, Zap, Users, BarChart3, Lock, Globe, Smartphone } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Navigation */}
      <nav className="border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-stone-900">Stoneforms</div>
            <div className="flex items-center gap-6 ml-8">
              <Link href="/dashboard/magazines" className="text-stone-600 hover:text-stone-900">Magazines</Link>
              <Link href="/emoji-forms" className="text-stone-600 hover:text-stone-900">Emoji Forms</Link>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/features" className="text-stone-600 hover:text-stone-900">Features</Link>
              <Link href="/pricing" className="text-stone-600 hover:text-stone-900">Pricing</Link>
              <Link href="/templates" className="text-stone-600 hover:text-stone-900">Templates</Link>
              <Link href="/auth/login" className="text-stone-600 hover:text-stone-900">Sign In</Link>
              <Link href="/auth/signup" className="px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-stone-900 mb-6 leading-tight">
            Create Beautiful Forms<br />That Convert
          </h1>
          <p className="text-xl text-stone-600 mb-8 max-w-3xl mx-auto">
            Build professional forms, collect responses, and grow your business. 
            No coding required. Start free, upgrade when you grow.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link 
              href="/auth/signup" 
              className="flex items-center gap-2 px-8 py-4 bg-stone-900 text-white rounded-lg hover:bg-stone-800 text-lg font-semibold"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/templates" 
              className="px-8 py-4 border-2 border-stone-900 text-stone-900 rounded-lg hover:bg-stone-50 text-lg font-semibold"
            >
              Browse Templates
            </Link>
          </div>
          <p className="text-stone-500 mt-4">Free forever. No credit card required.</p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 px-6 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-stone-900 mb-2">10,000+</div>
              <div className="text-stone-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-stone-900 mb-2">1M+</div>
              <div className="text-stone-600">Forms Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-stone-900 mb-2">50M+</div>
              <div className="text-stone-600">Responses Collected</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-stone-900 mb-2">99.9%</div>
              <div className="text-stone-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-900 mb-4">Everything You Need</h2>
            <p className="text-xl text-stone-600">Powerful features to help you collect better data</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Easy Form Builder',
                description: 'Drag and drop interface. Create professional forms in minutes, not hours.',
              },
              {
                icon: Users,
                title: 'Built-in CRM',
                description: 'Manage contacts, track deals, and grow your pipeline all in one place.',
              },
              {
                icon: BarChart3,
                title: 'Powerful Analytics',
                description: 'Track responses, measure conversion rates, and optimize performance.',
              },
              {
                icon: Globe,
                title: 'Share Anywhere',
                description: 'Embed forms on your website or share via link. Works everywhere.',
              },
              {
                icon: Smartphone,
                title: 'Mobile Optimized',
                description: 'Perfect experience on every device. Desktop, tablet, and mobile.',
              },
              {
                icon: Lock,
                title: 'Secure & Reliable',
                description: 'Enterprise-grade security. Your data is encrypted and protected.',
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white border border-stone-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-stone-900 text-white rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">{feature.title}</h3>
                <p className="text-stone-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-6 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-stone-600">Choose the plan that fits your needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Free',
                price: '£0',
                features: ['1 active form', '100 responses/month', 'Basic features'],
              },
              {
                name: 'Professional',
                price: '£15',
                features: ['Unlimited forms', '10,000 responses/month', 'All features', 'Remove branding'],
                popular: true,
              },
              {
                name: 'Business',
                price: '£25',
                features: ['Everything in Pro', 'Unlimited responses', 'API access', 'Priority support'],
              },
            ].map((plan, i) => (
              <div 
                key={i} 
                className={`bg-white rounded-lg p-8 ${plan.popular ? 'border-2 border-stone-900 shadow-xl' : 'border border-stone-200'}`}
              >
                {plan.popular && (
                  <div className="text-xs font-semibold text-stone-900 mb-4 uppercase tracking-wide">Most Popular</div>
                )}
                <h3 className="text-2xl font-bold text-stone-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-stone-900">{plan.price}</span>
                  <span className="text-stone-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-stone-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/auth/signup" 
                  className={`block w-full py-3 text-center rounded-lg font-semibold ${
                    plan.popular 
                      ? 'bg-stone-900 text-white hover:bg-stone-800' 
                      : 'border-2 border-stone-900 text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/pricing" className="text-stone-900 font-semibold hover:underline">
              See full pricing details →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-stone-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-stone-600 mb-8">
            Join thousands of businesses using Stoneforms to collect better data
          </p>
          <Link 
            href="/auth/signup" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-stone-900 text-white rounded-lg hover:bg-stone-800 text-lg font-semibold"
          >
            Start Your Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-stone-500 mt-4">No credit card required. Free forever.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold text-stone-900 mb-4">Stoneforms</div>
              <p className="text-stone-600 text-sm">
                Professional form builder for modern businesses
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="text-stone-600 hover:text-stone-900">Features</Link></li>
                <li><Link href="/pricing" className="text-stone-600 hover:text-stone-900">Pricing</Link></li>
                <li><Link href="/templates" className="text-stone-600 hover:text-stone-900">Templates</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-stone-600 hover:text-stone-900">About</Link></li>
                <li><Link href="/blog" className="text-stone-600 hover:text-stone-900">Blog</Link></li>
                <li><Link href="/contact" className="text-stone-600 hover:text-stone-900">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="text-stone-600 hover:text-stone-900">Privacy</Link></li>
                <li><Link href="/terms" className="text-stone-600 hover:text-stone-900">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-200 mt-12 pt-8 text-center text-stone-600 text-sm">
            © 2024 Stoneforms. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
