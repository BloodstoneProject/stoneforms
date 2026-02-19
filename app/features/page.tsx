'use client'

import Link from 'next/link'
import { Check, Zap, Users, BarChart3, Lock, Globe, Smartphone, Palette, Code, Boxes, Mail, Calendar, Download, Upload, Settings, Heart } from 'lucide-react'

export default function FeaturesPage() {
  const features = [
    {
      icon: Zap,
      title: 'Easy Form Builder',
      description: 'Create professional forms in minutes with our intuitive drag-and-drop builder. No coding required.',
      benefits: [
        '10+ question types',
        'Conditional logic',
        'Real-time preview',
        'Custom themes',
      ],
    },
    {
      icon: Users,
      title: 'Built-in CRM',
      description: 'Manage all your contacts in one place. Track interactions, add notes, and segment your audience.',
      benefits: [
        'Contact management',
        'Deal pipeline',
        'Activity timeline',
        'Custom fields',
      ],
    },
    {
      icon: BarChart3,
      title: 'Powerful Analytics',
      description: 'Understand your audience with detailed analytics. Track responses, measure conversion, and optimize.',
      benefits: [
        'Response tracking',
        'Completion rates',
        'Drop-off analysis',
        'Export reports',
      ],
    },
    {
      icon: Globe,
      title: 'Share Anywhere',
      description: 'Embed forms on your website or share via link. Works perfectly on any platform.',
      benefits: [
        'Embed code',
        'Direct links',
        'QR codes',
        'Social sharing',
      ],
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Perfect experience on every device. Forms automatically adapt to any screen size.',
      benefits: [
        'Responsive design',
        'Touch-friendly',
        'Fast loading',
        'Offline support',
      ],
    },
    {
      icon: Lock,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security keeps your data safe. 99.9% uptime guaranteed.',
      benefits: [
        'SSL encryption',
        'GDPR compliant',
        'Regular backups',
        'SOC 2 certified',
      ],
    },
    {
      icon: Palette,
      title: 'Custom Branding',
      description: 'Make forms your own with custom colors, fonts, and logos. White-label available.',
      benefits: [
        'Custom colors',
        'Upload logos',
        'Custom fonts',
        'Remove branding',
      ],
    },
    {
      icon: Code,
      title: 'Developer API',
      description: 'Build custom integrations with our powerful API. Full documentation included.',
      benefits: [
        'REST API',
        'Webhooks',
        'SDKs',
        'API keys',
      ],
    },
    {
      icon: Boxes,
      title: 'Integrations',
      description: 'Connect with your favorite tools. Zapier, Slack, Google Sheets, and more.',
      benefits: [
        '1000+ integrations',
        'Native connections',
        'Auto-sync',
        'Two-way sync',
      ],
    },
    {
      icon: Mail,
      title: 'Email Notifications',
      description: 'Get instant alerts when someone submits a form. Customize notification templates.',
      benefits: [
        'Instant alerts',
        'Custom templates',
        'Multiple recipients',
        'Auto-responders',
      ],
    },
    {
      icon: Calendar,
      title: 'Appointment Booking',
      description: 'Let people book meetings directly through your forms. Sync with Google Calendar.',
      benefits: [
        'Calendar sync',
        'Time zones',
        'Reminders',
        'Reschedule options',
      ],
    },
    {
      icon: Upload,
      title: 'File Uploads',
      description: 'Collect files, images, and documents. Support for multiple file types.',
      benefits: [
        'Multiple formats',
        'Large files (1GB)',
        'Secure storage',
        'Virus scanning',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      `}</style>

      {/* Navigation */}
      <nav className="border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-stone-900">Stoneforms</Link>
            <div className="flex items-center gap-6">
              <Link href="/features" className="text-stone-900 font-medium">Features</Link>
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

      {/* Hero */}
      <section className="py-20 px-6 border-b border-stone-100">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-stone-900 mb-6">
            Everything You Need<br />to Collect Better Data
          </h1>
          <p className="text-xl text-stone-600 mb-8 max-w-3xl mx-auto">
            Powerful features designed to help you create professional forms, 
            manage contacts, and grow your business.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, i) => (
              <div key={i}>
                <div className="w-14 h-14 bg-stone-900 text-white rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-stone-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-stone-600 mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.benefits.map((benefit, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-stone-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-stone-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-stone-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-stone-600 mb-8">
            Join thousands of businesses using Stoneforms
          </p>
          <Link 
            href="/auth/signup" 
            className="inline-block px-8 py-4 bg-stone-900 text-white rounded-lg hover:bg-stone-800 text-lg font-semibold"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold text-stone-900 mb-4">Stoneforms</div>
              <p className="text-stone-600 text-sm">Professional form builder</p>
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
