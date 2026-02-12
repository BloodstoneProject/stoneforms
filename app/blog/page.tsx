'use client'

import Link from 'next/link'
import { Calendar, User, ArrowRight } from 'lucide-react'

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      slug: 'how-to-create-high-converting-forms',
      title: 'How to Create High-Converting Forms in 2024',
      excerpt: 'Learn the proven strategies for creating forms that convert at 80%+ rates. From design to psychology.',
      author: 'Sarah Johnson',
      date: '2024-02-10',
      category: 'Best Practices',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    },
    {
      id: 2,
      slug: 'form-builder-comparison-2024',
      title: 'Form Builder Comparison 2024: Which Tool is Right for You?',
      excerpt: 'An honest comparison of the top form builders on the market. Features, pricing, and real-world use cases.',
      author: 'Michael Chen',
      date: '2024-02-08',
      category: 'Comparison',
      readTime: '12 min read',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    },
    {
      id: 3,
      slug: 'gdpr-compliance-forms',
      title: 'GDPR Compliance for Forms: Everything You Need to Know',
      excerpt: 'A complete guide to making your forms GDPR compliant. Legal requirements and best practices.',
      author: 'Emma Wilson',
      date: '2024-02-05',
      category: 'Legal',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
    },
    {
      id: 4,
      slug: 'mobile-form-optimization',
      title: 'Mobile Form Optimization: 10 Tips to Boost Conversions',
      excerpt: 'Over 60% of forms are now filled on mobile. Here is how to optimize your forms for mobile users.',
      author: 'David Kim',
      date: '2024-02-03',
      category: 'Optimization',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    },
    {
      id: 5,
      slug: 'form-analytics-guide',
      title: 'The Complete Guide to Form Analytics',
      excerpt: 'Understanding form analytics is key to optimization. Learn what metrics matter and how to track them.',
      author: 'Sarah Johnson',
      date: '2024-02-01',
      category: 'Analytics',
      readTime: '9 min read',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    },
    {
      id: 6,
      slug: 'ab-testing-forms',
      title: 'A/B Testing Forms: A Step-by-Step Guide',
      excerpt: 'Learn how to run effective A/B tests on your forms to increase conversion rates.',
      author: 'Michael Chen',
      date: '2024-01-28',
      category: 'Testing',
      readTime: '11 min read',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    },
  ]

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
              <Link href="/templates" className="text-stone-600 hover:text-stone-900">Templates</Link>
              <Link href="/blog" className="text-stone-900 font-medium">Blog</Link>
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
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-stone-900 mb-6">Blog</h1>
          <p className="text-xl text-stone-600">
            Tips, guides, and insights to help you get the most out of your forms
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <div className="aspect-video bg-stone-200 rounded-lg overflow-hidden mb-4">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mb-3">
                  <span className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-stone-700">
                  {post.title}
                </h2>
                <p className="text-stone-600 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-stone-500">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-6 bg-stone-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-stone-900 mb-4">
            Subscribe to our Newsletter
          </h2>
          <p className="text-xl text-stone-600 mb-8">
            Get the latest tips and updates delivered to your inbox
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
            />
            <button className="px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
