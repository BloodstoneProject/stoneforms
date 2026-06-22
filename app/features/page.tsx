'use client'

import Link from 'next/link'
import { ArrowRight, MousePointer, Palette, Smartphone, BarChart, Users, Mail, Webhook, Calendar, CreditCard, Workflow, Shield, FileText } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/MarketingNav'

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
    <div className="min-h-screen bg-background text-foreground">
      <MarketingNav active="/features" />

      <section className="pt-40 pb-16 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 border border-border bg-secondary rounded-full text-xs font-medium text-muted-foreground tracking-wide mb-8">Features</span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight mb-6">
            Everything you need. Nothing you don't.
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features that help you create better forms and grow your business.
          </p>
        </div>
      </section>

      <section className="pb-28 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="group p-8 bg-card border border-border rounded-lg hover:bg-secondary transition-colors">
                  <div className="mb-4 inline-flex p-2.5 bg-secondary border border-border rounded-md group-hover:bg-card transition-colors">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="text-xs font-medium text-muted-foreground tracking-wide mb-2 uppercase">{feature.category}</div>
                  <h3 className="text-lg font-semibold tracking-tight mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 sm:px-12 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-8">Ready to start?</h2>
          <Link href="/auth/signup" className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors group">
            Start your free trial<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
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
