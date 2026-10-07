'use client'

import Link from 'next/link'
import { User, ArrowUpRight } from 'lucide-react'
import { BrandShell, Reveal, Eyebrow, LIME, grotesk } from '@/components/marketing/brand'

export default function BlogPage() {
  // Only posts that have a body in app/blog/[slug]/page.tsx. The earlier list
  // carried invented author names, invented dates and a "comparison" with no
  // data behind it; all removed 7 Oct 2026.
  const posts = [
    {
      id: 1,
      slug: 'how-to-create-high-converting-forms',
      title: 'How to Create High-Converting Forms',
      excerpt: 'Practical design choices that help more people finish your forms.',
      author: 'Stoneforms',
      category: 'Best Practices',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    },
    {
      id: 3,
      slug: 'gdpr-compliance-forms',
      title: 'GDPR and Forms: The Basics',
      excerpt: 'What GDPR asks of a form that collects personal data, in plain English.',
      author: 'Stoneforms',
      category: 'Legal',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
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

    </BrandShell>
  )
}
