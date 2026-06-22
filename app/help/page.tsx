'use client'

import Link from 'next/link'
import { Search, BookOpen, Video, FileText, HelpCircle } from 'lucide-react'
import { useState } from 'react'

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold tracking-tight text-foreground">Stoneforms</Link>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link href="/help" className="text-foreground font-medium">Help</Link>
              <Link href="/auth/signup" className="px-5 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6 bg-secondary border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-foreground mb-6">How can we help?</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Search our help center for answers and guides
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-background border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors text-base"
            />
          </div>

          {/* Search Results */}
          {searchTerm && (
            <div className="max-w-2xl mx-auto mt-3 bg-card border border-border rounded-md text-left">
              {filteredArticles.length > 0 ? (
                <div className="p-2">
                  {filteredArticles.slice(0, 5).map((article, i) => (
                    <Link
                      key={i}
                      href={`/help/${article.slug}`}
                      className="block p-3 hover:bg-secondary rounded-md transition-colors"
                    >
                      <h3 className="font-medium text-foreground">{article.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{article.category}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No articles found. Try different keywords.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-12 text-center">
            Browse by Category
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {categories.map((category, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 bg-secondary border border-border rounded-md flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">{category.name}</h3>
                </div>
                <ul className="space-y-3">
                  {category.articles.map((article, j) => (
                    <li key={j}>
                      <Link
                        href={`/help/${article.slug}`}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 px-6 bg-secondary border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-4">
            Still need help?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Contact our support team and we will get back to you within 24 hours
          </p>
          <Link
            href="/contact"
            className="inline-block px-7 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  )
}
