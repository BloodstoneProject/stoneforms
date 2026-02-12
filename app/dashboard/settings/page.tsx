'use client'

import Link from 'next/link'
import { User, CreditCard, Bell, Shield, Users, Palette } from 'lucide-react'

export default function SettingsPage() {
  const settingsSections = [
    {
      icon: User,
      title: 'Account',
      description: 'Manage your account details and preferences',
      href: '/dashboard/settings/account',
    },
    {
      icon: CreditCard,
      title: 'Billing',
      description: 'Subscription, payment methods, and invoices',
      href: '/dashboard/settings/billing',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Email and in-app notification preferences',
      href: '/dashboard/settings/notifications',
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Password, two-factor authentication, and sessions',
      href: '/dashboard/settings/security',
    },
    {
      icon: Users,
      title: 'Team',
      description: 'Manage team members and permissions',
      href: '/dashboard/team',
    },
    {
      icon: Palette,
      title: 'White Label',
      description: 'Custom branding and domain settings',
      href: '/dashboard/settings/white-label',
    },
  ]

  return (
    <div className="min-h-screen bg-stone-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-stone-900">Settings</h1>
          <p className="text-stone-600 mt-1">Manage your account and preferences</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {settingsSections.map((section, i) => (
            <Link
              key={i}
              href={section.href}
              className="bg-white border border-stone-200 rounded-lg p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center group-hover:bg-stone-900 transition-colors">
                  <section.icon className="w-6 h-6 text-stone-600 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-stone-700">
                    {section.title}
                  </h3>
                  <p className="text-stone-600 text-sm">
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
