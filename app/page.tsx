'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Shield, Globe, Smartphone, Lock } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/MarketingNav'

export default function PremiumHomepage() {
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
    <div className="min-h-screen bg-background text-foreground">
      <MarketingNav />

      <section className="relative pt-40 pb-24 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 opacity-0 animate-[fadeUp_0.7s_ease-out_0.1s_forwards]">
            <span className="inline-block px-3 py-1 border border-border bg-secondary rounded-full text-xs font-medium text-muted-foreground tracking-wide">
              Now available
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight mb-6 opacity-0 animate-[fadeUp_0.7s_ease-out_0.2s_forwards]">
            Forms that feel
            <br />
            effortless.
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 animate-[fadeUp_0.7s_ease-out_0.3s_forwards]">
            The most intuitive form builder. Designed for perfection, engineered for performance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 opacity-0 animate-[fadeUp_0.7s_ease-out_0.4s_forwards]">
            <Link
              href="/auth/signup"
              className="group px-6 py-3 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              Start free trial
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/templates"
              className="px-6 py-3 border border-border bg-card rounded-md text-sm font-medium hover:bg-secondary transition-colors"
            >
              Explore templates
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mt-6 opacity-0 animate-[fadeUp_0.7s_ease-out_0.5s_forwards]">
            No credit card required · Free forever plan
          </p>
        </div>

        <div className="mt-28 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-8 bg-card border border-border rounded-lg text-center"
            >
              <div className="text-3xl font-semibold tracking-tight mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 sm:px-12 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-3">
              Everything you need.
            </h2>
            <p className="text-lg text-muted-foreground">
              Nothing you don't.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="group p-8 bg-card border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="mb-5 inline-flex p-2.5 bg-secondary border border-border rounded-md group-hover:bg-card transition-colors">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 sm:px-12 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-6">
            Ready to transform your forms?
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Join thousands of businesses using Stoneforms to collect better data, faster.
          </p>

          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors group"
          >
            Start your free trial
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <p className="text-xs text-muted-foreground mt-6">
            No credit card required · Cancel anytime
          </p>
        </div>
      </section>

      <footer className="border-t border-border py-16 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div>
              <h4 className="text-sm font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/templates" className="hover:text-foreground transition-colors">Templates</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Resources</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="/api" className="hover:text-foreground transition-colors">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/legal/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="/legal/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link href="/help" className="hover:text-foreground transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>© 2024 Stoneforms. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <Link href="https://twitter.com" className="hover:text-foreground transition-colors">Twitter</Link>
              <Link href="https://github.com" className="hover:text-foreground transition-colors">GitHub</Link>
              <Link href="https://linkedin.com" className="hover:text-foreground transition-colors">LinkedIn</Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  )
}
