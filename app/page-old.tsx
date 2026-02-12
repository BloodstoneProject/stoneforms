'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Sparkles, 
  Zap, 
  Award, 
  TrendingUp, 
  Calendar,
  Palette,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI Form Generation',
      description: 'Describe what you need, AI creates the perfect form instantly',
      color: '#770a19',
    },
    {
      icon: Zap,
      title: 'Visual Workflows',
      description: 'Automate anything with drag-and-drop workflow builder',
      color: '#142c1c',
    },
    {
      icon: Award,
      title: 'Quiz System',
      description: 'Create quizzes with scoring, certificates, and analytics',
      color: '#3d5948',
    },
    {
      icon: TrendingUp,
      title: 'Built-in CRM',
      description: 'Manage contacts, deals, and pipeline in one place',
      color: '#142c1c',
    },
    {
      icon: Calendar,
      title: 'Appointment Booking',
      description: 'Let customers book time directly through your forms',
      color: '#770a19',
    },
    {
      icon: Palette,
      title: 'White Label',
      description: 'Your brand, your domain, your custom design',
      color: '#3d5948',
    },
  ]

  const stats = [
    { number: '35+', label: 'Features' },
    { number: '12+', label: 'Integrations' },
    { number: '100%', label: 'No-Code' },
    { number: '∞', label: 'Possibilities' },
  ]

  return (
    <div style={{ backgroundColor: '#f4f2ed' }}>
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border-2" style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
            <Sparkles className="w-4 h-4" style={{ color: '#770a19' }} />
            <span className="text-sm font-semibold" style={{ color: '#142c1c' }}>
              AI-Powered Form Builder
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6" style={{ color: '#142c1c' }}>
            Craft Forms That<br />Convert Like Stone
          </h1>

          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto" style={{ color: '#3d5948' }}>
            The only form platform with AI generation, built-in CRM, automation, 
            and appointment booking. Everything you need in one beautiful platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/demo">
              <Button size="lg" className="text-lg px-8 py-6 gap-2 text-white" style={{ backgroundColor: '#142c1c' }}>
                Try Demo
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/dashboard/templates">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 gap-2">
                Browse Templates
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-bold mb-2" style={{ color: '#142c1c' }}>
                  {stat.number}
                </div>
                <div className="text-sm" style={{ color: '#3d5948' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#142c1c' }}>
              Everything You Need
            </h2>
            <p className="text-xl" style={{ color: '#3d5948' }}>
              One platform. Infinite possibilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="p-8 rounded-2xl border-2 hover:shadow-xl transition-all"
                  style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}
                >
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: feature.color }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: '#142c1c' }}>
                    {feature.title}
                  </h3>
                  <p className="text-lg" style={{ color: '#3d5948' }}>
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#142c1c' }}>
            Ready to Build Better Forms?
          </h2>
          <p className="text-xl mb-12" style={{ color: '#3d5948' }}>
            Join thousands of companies using Stoneforms to grow their business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" className="text-lg px-8 py-6 gap-2 text-white" style={{ backgroundColor: '#142c1c' }}>
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                View Demo Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t py-12 px-6" style={{ borderColor: '#e8e4db' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="text-2xl font-bold mb-2" style={{ color: '#142c1c' }}>
                Stoneforms
              </div>
              <p className="text-sm" style={{ color: '#3d5948' }}>
                Craft Forms That Convert Like Stone
              </p>
            </div>
            <div className="flex gap-8">
              <Link href="/demo" className="text-sm hover:underline" style={{ color: '#3d5948' }}>
                Demo
              </Link>
              <Link href="/dashboard" className="text-sm hover:underline" style={{ color: '#3d5948' }}>
                Dashboard
              </Link>
              <Link href="/dashboard/templates" className="text-sm hover:underline" style={{ color: '#3d5948' }}>
                Templates
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
