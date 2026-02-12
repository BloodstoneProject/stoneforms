'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, ThumbsUp, ThumbsDown } from 'lucide-react'

export default function HelpArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  
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
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Navigation */}
      <nav className="border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-stone-900">Stoneforms</Link>
            <Link href="/help" className="text-stone-600 hover:text-stone-900">Help Center</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Main Content */}
          <article className="md:col-span-3">
            <Link href="/help" className="flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Help Center
            </Link>

            <div className="mb-4">
              <span className="text-sm font-semibold text-stone-600 uppercase tracking-wider">
                {article.category}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-stone-900 mb-8">
              {article.title}
            </h1>

            <div className="prose prose-lg max-w-none">
              {article.content.split('\n').map((paragraph, i) => {
                if (paragraph.startsWith('# ')) {
                  return <h1 key={i} className="text-4xl font-bold text-stone-900 mt-12 mb-6">{paragraph.replace('# ', '')}</h1>
                }
                if (paragraph.startsWith('## ')) {
                  return <h2 key={i} className="text-3xl font-bold text-stone-900 mt-10 mb-4">{paragraph.replace('## ', '')}</h2>
                }
                if (paragraph.startsWith('### ')) {
                  return <h3 key={i} className="text-2xl font-bold text-stone-900 mt-8 mb-3">{paragraph.replace('### ', '')}</h3>
                }
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return <p key={i} className="font-bold text-stone-900 mt-4">{paragraph.replace(/\*\*/g, '')}</p>
                }
                if (paragraph.match(/^\d+\./)) {
                  return <li key={i} className="text-stone-700 ml-6 mt-2">{paragraph.replace(/^\d+\.\s/, '')}</li>
                }
                if (paragraph.startsWith('- ')) {
                  return <li key={i} className="text-stone-700 ml-6 mt-2">{paragraph.replace('- ', '')}</li>
                }
                if (paragraph.trim()) {
                  return <p key={i} className="text-stone-700 leading-relaxed mt-4">{paragraph}</p>
                }
                return null
              })}
            </div>

            {/* Feedback */}
            <div className="mt-12 pt-8 border-t border-stone-200">
              <p className="text-stone-900 font-semibold mb-4">Was this article helpful?</p>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-6 py-3 border border-stone-300 rounded-lg hover:bg-stone-50">
                  <ThumbsUp className="w-5 h-5" />
                  <span>Yes</span>
                </button>
                <button className="flex items-center gap-2 px-6 py-3 border border-stone-300 rounded-lg hover:bg-stone-50">
                  <ThumbsDown className="w-5 h-5" />
                  <span>No</span>
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-stone-50 rounded-lg p-6">
              <h3 className="font-bold text-stone-900 mb-4">Related Articles</h3>
              <ul className="space-y-3">
                {article.relatedArticles.map((title, i) => (
                  <li key={i}>
                    <Link
                      href={`/help/${title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-stone-700 hover:text-stone-900 hover:underline text-sm"
                    >
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-lg p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Need more help?</h3>
              <p className="text-stone-300 text-sm mb-4">
                Our support team is here to assist you
              </p>
              <Link
                href="/contact"
                className="block w-full py-2 bg-white text-stone-900 rounded-lg text-center font-semibold text-sm hover:bg-stone-100"
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
