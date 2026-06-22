'use client'
import { useParams } from 'next/navigation'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, ThumbsUp, ThumbsDown } from 'lucide-react'

export default function HelpArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = (useParams() as any)
  
  // Generic article content - all 50+ articles use this template
  const article = {
    title: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    category: 'Getting Started',
    content: `
# ${slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}

This comprehensive guide will walk you through everything you need to know about this topic.

## Overview

This feature helps you accomplish your goals more efficiently. Whether you are just getting started or looking to optimize your workflow, this guide has you covered.

## Getting Started

Follow these steps to get up and running:

1. **Navigate to the feature** - Find the feature in your dashboard
2. **Configure settings** - Customize it to your needs
3. **Start using it** - Begin implementing the feature in your workflow

## Best Practices

Here are some tips to get the most out of this feature:

- Keep your settings organized
- Review regularly for optimization opportunities
- Use integrations to extend functionality
- Monitor analytics to track performance

## Common Questions

### How do I get started?

Simply navigate to the dashboard and click on the relevant section. The interface will guide you through the setup process.

### Can I customize this?

Yes! We offer extensive customization options to fit your specific needs. Check out the settings panel for all available options.

### Is this available on all plans?

Most features are available across all plans, though some advanced options may require a paid subscription. Check our pricing page for details.

## Advanced Features

For power users, we offer advanced capabilities:

- Custom integrations via API
- Automated workflows
- Bulk operations
- Advanced analytics

## Troubleshooting

If you encounter any issues:

1. Check your settings are configured correctly
2. Ensure you have the necessary permissions
3. Try refreshing the page
4. Contact support if the problem persists

## Next Steps

Now that you understand this feature, you might want to explore:

- Related features and integrations
- Advanced customization options
- Analytics and reporting
- Team collaboration features

## Need More Help?

If you still have questions, our support team is here to help. Contact us through the help center or send an email to support@stoneforms.com.
    `,
    relatedArticles: [
      'Quick Start Guide',
      'Understanding Dashboard',
      'Form Builder Overview',
    ],
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold tracking-tight text-foreground">Stoneforms</Link>
            <Link href="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Help Center</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Main Content */}
          <article className="md:col-span-3">
            <Link href="/help" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Help Center
            </Link>

            <div className="mb-4">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {article.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-8">
              {article.title}
            </h1>

            <div className="max-w-none">
              {article.content.split('\n').map((paragraph, i) => {
                if (paragraph.startsWith('# ')) {
                  return <h2 key={i} className="text-3xl font-semibold tracking-tight text-foreground mt-12 mb-6">{paragraph.replace('# ', '')}</h2>
                }
                if (paragraph.startsWith('## ')) {
                  return <h2 key={i} className="text-2xl font-semibold tracking-tight text-foreground mt-10 mb-4">{paragraph.replace('## ', '')}</h2>
                }
                if (paragraph.startsWith('### ')) {
                  return <h3 key={i} className="text-xl font-semibold tracking-tight text-foreground mt-8 mb-3">{paragraph.replace('### ', '')}</h3>
                }
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return <p key={i} className="font-semibold text-foreground mt-4">{paragraph.replace(/\*\*/g, '')}</p>
                }
                if (paragraph.match(/^\d+\./)) {
                  return <li key={i} className="text-muted-foreground ml-6 mt-2">{paragraph.replace(/^\d+\.\s/, '')}</li>
                }
                if (paragraph.startsWith('- ')) {
                  return <li key={i} className="text-muted-foreground ml-6 mt-2">{paragraph.replace('- ', '')}</li>
                }
                if (paragraph.trim()) {
                  return <p key={i} className="text-muted-foreground leading-relaxed mt-4">{paragraph}</p>
                }
                return null
              })}
            </div>

            {/* Feedback */}
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-foreground font-semibold mb-4">Was this article helpful?</p>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 border border-border bg-card rounded-md hover:bg-secondary transition-colors text-sm">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Yes</span>
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 border border-border bg-card rounded-md hover:bg-secondary transition-colors text-sm">
                  <ThumbsDown className="w-4 h-4" />
                  <span>No</span>
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold tracking-tight text-foreground mb-4">Related Articles</h3>
              <ul className="space-y-3">
                {article.relatedArticles.map((title, i) => (
                  <li key={i}>
                    <Link
                      href={`/help/${title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-primary text-primary-foreground rounded-lg p-6">
              <h3 className="font-semibold tracking-tight text-lg mb-2">Need more help?</h3>
              <p className="text-primary-foreground/70 text-sm mb-4">
                Our support team is here to assist you
              </p>
              <Link
                href="/contact"
                className="block w-full py-2 bg-background text-foreground border border-border rounded-md text-center font-medium text-sm hover:bg-secondary transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
