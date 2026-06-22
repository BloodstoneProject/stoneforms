'use client'

import Link from 'next/link'
import { User, CreditCard, Wallet } from 'lucide-react'

export default function SettingsPage() {
  const settingsSections = [
    {
      icon: User,
      title: 'Account',
      description: 'Your email and password',
      href: '/dashboard/settings/account',
    },
    {
      icon: CreditCard,
      title: 'Billing',
      description: 'Subscription, plan, and usage',
      href: '/dashboard/settings/billing',
    },
    {
      icon: Wallet,
      title: 'Payments',
      description: 'Connect Stripe to collect payments on your forms',
      href: '/dashboard/settings/payments',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {settingsSections.map((section, i) => (
            <Link
              key={i}
              href={section.href}
              className="card-surface p-6 hover:bg-muted/30 transition-colors duration-150 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center group-hover:bg-primary transition-colors duration-150">
                  <section.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-150" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2">
                    {section.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {section.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
