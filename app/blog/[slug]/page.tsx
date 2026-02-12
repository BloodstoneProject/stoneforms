'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react'

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  
  const posts = [
    {
      slug: 'how-to-create-high-converting-forms',
      title: 'How to Create High-Converting Forms in 2024',
      excerpt: 'Learn the proven strategies for creating forms that convert at 80%+ rates.',
      author: 'Sarah Johnson',
      date: '2024-02-10',
      readTime: '8 min read',
      category: 'Best Practices',
      content: `
# How to Create High-Converting Forms in 2024

Forms are the gateway to your business. Whether you are capturing leads, registering users, or collecting feedback, the design and functionality of your forms can make or break your conversion rates.

## 1. Keep It Simple

The number one rule of form design is simplicity. Every additional field you add decreases your conversion rate by an average of 5%. Ask yourself: do you really need this information right now?

**Best Practice:** Start with the minimum required fields. You can always collect more information later once the relationship is established.

## 2. Use Clear Labels

Ambiguous labels confuse users and lead to abandonment. Be crystal clear about what information you are requesting.

Instead of "Name" use "Full Name" or "First Name" and "Last Name" separately.

## 3. Provide Visual Feedback

Users need to know the form is working. Provide immediate visual feedback when they:
- Click on a field (highlight it)
- Enter valid data (show a checkmark)
- Make an error (show a clear error message)
- Submit the form (show a loading state)

## 4. Optimize for Mobile

Over 60% of forms are now completed on mobile devices. Your forms MUST work flawlessly on small screens.

Key mobile optimizations:
- Use appropriate input types (email, tel, number)
- Make buttons large enough to tap (minimum 44x44 pixels)
- Avoid dropdowns when possible
- Use single-column layouts

## 5. Add Progress Indicators

For multi-step forms, always show users where they are in the process. Progress bars reduce abandonment by 28%.

## Conclusion

Creating high-converting forms is both an art and a science. By following these principles and continuously testing, you can dramatically improve your conversion rates.

Ready to build better forms? Try Stoneforms today and see the difference.
      `,
    },
    {
      slug: 'form-builder-comparison-2024',
      title: 'Form Builder Comparison 2024',
      excerpt: 'An honest comparison of the top form builders on the market.',
      author: 'Michael Chen',
      date: '2024-02-08',
      readTime: '12 min read',
      category: 'Comparison',
      content: `
# Form Builder Comparison 2024: Which Tool is Right for You?

The form builder market is crowded. With dozens of options available, how do you choose the right one for your business? We have tested them all.

## The Contenders

We evaluated the top 10 form builders based on:
- Ease of use
- Features
- Pricing
- Customer support
- Integrations

## Stoneforms

**Pros:**
- Intuitive interface
- Built-in CRM
- Affordable pricing
- Great mobile experience

**Cons:**
- Newer platform (but actively developing)

**Best For:** Small to medium businesses looking for an all-in-one solution

## Others We Tested

We also evaluated several other popular platforms. Each has its strengths and weaknesses depending on your specific needs.

## Our Verdict

For most businesses, Stoneforms offers the best balance of features, usability, and price. The built-in CRM is a game-changer.

However, if you need very specific enterprise features, you might want to explore other options as well.
      `,
    },
    {
      slug: 'gdpr-compliance-forms',
      title: 'GDPR Compliance for Forms',
      excerpt: 'A complete guide to making your forms GDPR compliant.',
      author: 'Emma Wilson',
      date: '2024-02-05',
      readTime: '10 min read',
      category: 'Legal',
      content: `
# GDPR Compliance for Forms: Everything You Need to Know

If you collect data from EU citizens, GDPR compliance is not optional. Here is what you need to know.

## What is GDPR?

The General Data Protection Regulation (GDPR) is a comprehensive data privacy law that came into effect in May 2018.

## Key Requirements for Forms

### 1. Consent

You must obtain explicit consent before collecting personal data. This means:
- Clear checkbox (not pre-checked)
- Plain language explanation
- Easy to withdraw consent

### 2. Data Minimization

Only collect data you actually need. Every field must have a legitimate purpose.

### 3. Right to Access

Users must be able to request a copy of their data at any time.

### 4. Right to Deletion

Users can request deletion of their data (the "right to be forgotten").

## How Stoneforms Helps

Stoneforms is built with GDPR compliance in mind:
- Consent checkboxes built-in
- Data export functionality
- Easy data deletion
- EU data centers available

## Conclusion

GDPR compliance might seem complex, but with the right tools it is manageable. Stoneforms makes it easy to stay compliant while still collecting the data you need.
      `,
    },
  ]

  const post = posts.find(p => p.slug === slug) || posts[0]

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
            <div className="flex items-center gap-6">
              <Link href="/features" className="text-stone-600 hover:text-stone-900">Features</Link>
              <Link href="/pricing" className="text-stone-600 hover:text-stone-900">Pricing</Link>
              <Link href="/blog" className="text-stone-900 font-medium">Blog</Link>
              <Link href="/auth/signup" className="px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-8">
          <Link href="/blog" className="flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          
          <div className="mb-4">
            <span className="text-sm font-semibold text-stone-900 uppercase tracking-wider">
              {post.category}
            </span>
          </div>

          <h1 className="text-5xl font-bold text-stone-900 mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-stone-600">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          {post.content.split('\n').map((paragraph, i) => {
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
            if (paragraph.startsWith('- ')) {
              return <li key={i} className="text-stone-700 ml-6">{paragraph.replace('- ', '')}</li>
            }
            if (paragraph.trim()) {
              return <p key={i} className="text-stone-700 leading-relaxed mt-4">{paragraph}</p>
            }
            return null
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl text-white">
          <h3 className="text-2xl font-bold mb-3">Ready to create better forms?</h3>
          <p className="text-stone-300 mb-6">
            Start using Stoneforms today. No credit card required.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-3 bg-white text-stone-900 rounded-lg font-semibold hover:bg-stone-100"
          >
            Get Started Free
          </Link>
        </div>
      </article>
    </div>
  )
}
