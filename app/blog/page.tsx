'use client'

import Link from 'next/link'
import { Calendar, User, ArrowUpRight } from 'lucide-react'
import { BrandShell, Reveal, Eyebrow, LIME, grotesk } from '@/components/marketing/brand'

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
    <BrandShell>
      {/* Hero */}
      <section className="relative z-10 px-6 pt-40 pb-24 sm:px-12">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>The Field Notes</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1
              className="mt-6 text-5xl font-semibold tracking-tight sm:text-7xl"
              style={grotesk}
            >
              Blog.
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 max-w-xl text-lg text-white/55">
              Tips, guides, and blunt takes to help you build forms people actually finish.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="relative z-10 px-6 pb-28 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={(i % 3) * 80}>
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <div className="flex h-full flex-col rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-2 transition-colors duration-500 hover:border-white/20">
                    <div className="overflow-hidden rounded-[calc(1.75rem-0.5rem)] border border-white/5">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-center justify-between">
                          <span
                            className="text-[10px] font-medium uppercase tracking-[0.22em]"
                            style={{ color: LIME }}
                          >
                            {post.category}
                          </span>
                          <span className="text-[11px] text-white/35">{post.readTime}</span>
                        </div>
                        <h2
                          className="mt-4 text-lg font-semibold leading-snug tracking-tight text-white transition-colors group-hover:text-white"
                          style={grotesk}
                        >
                          {post.title}
                        </h2>
                        <p className="mt-3 line-clamp-2 text-sm text-white/50">
                          {post.excerpt}
                        </p>
                        <div className="mt-6 flex items-center gap-4 border-t border-white/10 pt-4 text-xs text-white/40">
                          <span className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" strokeWidth={1.75} />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
                            {new Date(post.date).toLocaleDateString()}
                          </span>
                          <ArrowUpRight
                            className="ml-auto h-4 w-4 text-white/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#C6F24E]"
                            strokeWidth={2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative z-10 px-6 pb-28 sm:px-12">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-2">
              <div
                className="rounded-[calc(1.75rem-0.5rem)] border border-white/5 px-6 py-14 text-center sm:px-12"
                style={{ backgroundColor: '#131313' }}
              >
                <h2
                  className="text-3xl font-semibold tracking-tight sm:text-4xl"
                  style={grotesk}
                >
                  Subscribe to the newsletter.
                </h2>
                <p className="mx-auto mt-4 max-w-md text-white/55">
                  The latest tips and updates, delivered to your inbox. No fluff.
                </p>
                <form className="mx-auto mt-8 flex max-w-md gap-3">
                  <input
                    type="email"
                    aria-label="Email address"
                    placeholder="you@work.com"
                    className="flex-1 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-white placeholder:text-white/30 transition-colors focus:border-[#C6F24E] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-full px-6 py-2.5 text-sm font-semibold text-black transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-95"
                    style={{ backgroundColor: LIME }}
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </BrandShell>
  )
}
