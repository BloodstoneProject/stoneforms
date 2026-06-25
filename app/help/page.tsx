'use client'

import Link from 'next/link'
import { Search, BookOpen, Video, FileText, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { BrandShell, Reveal, Eyebrow, LimeCTA, LIME, grotesk } from '@/components/marketing/brand'

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const categories = [
    {
      name: 'Getting Started',
      icon: BookOpen,
      articles: [
        { title: 'Quick Start Guide', slug: 'quick-start-guide' },
        { title: 'Creating Your First Form', slug: 'creating-first-form' },
        { title: 'Understanding the Dashboard', slug: 'understanding-dashboard' },
        { title: 'Account Setup', slug: 'account-setup' },
        { title: 'Inviting Team Members', slug: 'inviting-team-members' },
      ],
    },
    {
      name: 'Form Builder',
      icon: FileText,
      articles: [
        { title: 'Form Builder Overview', slug: 'form-builder-overview' },
        { title: 'Question Types Explained', slug: 'question-types' },
        { title: 'Using Conditional Logic', slug: 'conditional-logic' },
        { title: 'Customizing Form Design', slug: 'customizing-design' },
        { title: 'Adding File Uploads', slug: 'file-uploads' },
        { title: 'Email Notifications', slug: 'email-notifications' },
        { title: 'Thank You Pages', slug: 'thank-you-pages' },
        { title: 'Form Settings', slug: 'form-settings' },
        { title: 'Testing Your Forms', slug: 'testing-forms' },
        { title: 'Publishing Forms', slug: 'publishing-forms' },
      ],
    },
    {
      name: 'Collecting Responses',
      icon: HelpCircle,
      articles: [
        { title: 'Viewing Responses', slug: 'viewing-responses' },
        { title: 'Filtering and Searching', slug: 'filtering-responses' },
        { title: 'Exporting Data', slug: 'exporting-data' },
        { title: 'Response Notifications', slug: 'response-notifications' },
        { title: 'Managing Spam', slug: 'managing-spam' },
      ],
    },
    {
      name: 'CRM & Contacts',
      icon: BookOpen,
      articles: [
        { title: 'Contact Management', slug: 'contact-management' },
        { title: 'Importing Contacts', slug: 'importing-contacts' },
        { title: 'Using Tags', slug: 'using-tags' },
        { title: 'Contact Fields', slug: 'contact-fields' },
        { title: 'Deal Pipeline', slug: 'deal-pipeline' },
        { title: 'Creating Deals', slug: 'creating-deals' },
        { title: 'Managing Pipeline Stages', slug: 'pipeline-stages' },
      ],
    },
    {
      name: 'Analytics',
      icon: Video,
      articles: [
        { title: 'Understanding Analytics', slug: 'understanding-analytics' },
        { title: 'Conversion Tracking', slug: 'conversion-tracking' },
        { title: 'Drop-off Analysis', slug: 'dropoff-analysis' },
        { title: 'Custom Reports', slug: 'custom-reports' },
        { title: 'Exporting Analytics', slug: 'exporting-analytics' },
      ],
    },
    {
      name: 'Integrations',
      icon: FileText,
      articles: [
        { title: 'Integration Overview', slug: 'integration-overview' },
        { title: 'Zapier Integration', slug: 'zapier-integration' },
        { title: 'Google Sheets', slug: 'google-sheets' },
        { title: 'Slack Integration', slug: 'slack-integration' },
        { title: 'Mailchimp Integration', slug: 'mailchimp-integration' },
        { title: 'Webhooks', slug: 'webhooks' },
        { title: 'API Documentation', slug: 'api-documentation' },
      ],
    },
    {
      name: 'Account & Billing',
      icon: HelpCircle,
      articles: [
        { title: 'Account Settings', slug: 'account-settings' },
        { title: 'Changing Your Plan', slug: 'changing-plan' },
        { title: 'Payment Methods', slug: 'payment-methods' },
        { title: 'Billing FAQs', slug: 'billing-faqs' },
        { title: 'Canceling Your Account', slug: 'canceling-account' },
      ],
    },
    {
      name: 'Security & Privacy',
      icon: BookOpen,
      articles: [
        { title: 'Data Security', slug: 'data-security' },
        { title: 'GDPR Compliance', slug: 'gdpr-compliance' },
        { title: 'Privacy Policy', slug: 'privacy-policy' },
        { title: 'Two-Factor Authentication', slug: 'two-factor-auth' },
      ],
    },
  ]

  const allArticles = categories.flatMap(cat =>
    cat.articles.map(article => ({ ...article, category: cat.name }))
  )

  const filteredArticles = searchTerm
    ? allArticles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

  return (
    <BrandShell>
      {/* Hero */}
      <section className="relative z-10 px-6 pt-40 pb-24 sm:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="flex justify-center">
              <Eyebrow>Help Center</Eyebrow>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1
              className="mt-6 text-5xl font-semibold tracking-tight sm:text-7xl"
              style={grotesk}
            >
              How can we help?
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 text-lg text-white/55">
              Search the help center for answers and guides.
            </p>
          </Reveal>

          {/* Search */}
          <Reveal delay={200}>
            <div className="relative mx-auto mt-10 max-w-2xl">
              <Search
                className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40"
                aria-hidden="true"
              />
              <input
                type="text"
                aria-label="Search the help center"
                placeholder="Search for help..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-white/[0.03] py-3.5 pl-13 pr-5 text-base text-white placeholder:text-white/30 transition-colors focus:border-[#C6F24E] focus:outline-none"
                style={{ paddingLeft: '3.25rem' }}
              />
            </div>
          </Reveal>

          {/* Search Results */}
          {searchTerm && (
            <div className="mx-auto mt-3 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.02] p-2 text-left">
              {filteredArticles.length > 0 ? (
                <div className="rounded-xl border border-white/5 p-2" style={{ backgroundColor: '#131313' }}>
                  {filteredArticles.slice(0, 5).map((article, i) => (
                    <Link
                      key={i}
                      href={`/help/${article.slug}`}
                      className="block rounded-lg p-3 transition-colors hover:bg-white/[0.04]"
                    >
                      <h3 className="font-medium text-white" style={grotesk}>{article.title}</h3>
                      <p className="mt-1 text-sm text-white/40">{article.category}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-white/5 p-8 text-center text-white/40" style={{ backgroundColor: '#131313' }}>
                  No articles found. Try different keywords.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="relative z-10 px-6 pb-28 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2
              className="mb-14 text-center text-3xl font-semibold tracking-tight sm:text-4xl"
              style={grotesk}
            >
              Browse by category.
            </h2>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            {categories.map((category, i) => (
              <Reveal key={i} delay={(i % 2) * 80}>
                <div className="h-full rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-2 transition-colors duration-500 hover:border-white/20">
                  <div
                    className="h-full rounded-[calc(1.75rem-0.5rem)] border border-white/5 p-7 sm:p-8"
                    style={{ backgroundColor: '#131313' }}
                  >
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                        <category.icon className="h-5 w-5" strokeWidth={1.75} style={{ color: LIME }} />
                      </div>
                      <h3 className="text-xl font-semibold tracking-tight text-white" style={grotesk}>
                        {category.name}
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {category.articles.map((article, j) => (
                        <li key={j}>
                          <Link
                            href={`/help/${article.slug}`}
                            className="text-sm text-white/50 transition-colors hover:text-white"
                          >
                            {article.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="relative z-10 px-6 pb-28 sm:px-12">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-2">
              <div
                className="rounded-[calc(1.75rem-0.5rem)] border border-white/5 px-6 py-14 text-center sm:px-12"
                style={{ backgroundColor: '#131313' }}
              >
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl" style={grotesk}>
                  Still need help?
                </h2>
                <p className="mx-auto mt-4 max-w-md text-white/55">
                  Contact the support team. We get back to you within 24 hours.
                </p>
                <div className="mt-8 flex justify-center">
                  <LimeCTA href="/contact">Contact support</LimeCTA>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </BrandShell>
  )
}
