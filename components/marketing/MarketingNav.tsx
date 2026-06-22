'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

type NavLink = { href: string; label: string }

const DEFAULT_LINKS: NavLink[] = [
  { href: '/features', label: 'Features' },
  { href: '/templates', label: 'Templates' },
  { href: '/pricing', label: 'Pricing' },
]

export function MarketingNav({
  active,
  links = DEFAULT_LINKS,
  fixed = true,
}: {
  active?: string
  links?: NavLink[]
  fixed?: boolean
}) {
  const [open, setOpen] = useState(false)

  const shellClass = fixed
    ? 'fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border'
    : 'sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border'

  return (
    <nav className={shellClass}>
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-tight hover:opacity-70 transition-opacity">
          Stoneforms
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                active === link.href
                  ? 'text-foreground transition-colors'
                  : 'hover:text-foreground transition-colors'
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="marketing-mobile-menu"
          className="md:hidden inline-flex items-center justify-center w-10 h-10 -mr-2 rounded-md text-foreground hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div
          id="marketing-mobile-menu"
          className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl"
        >
          <div className="px-6 py-4 flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`py-2.5 text-sm transition-colors ${
                  active === link.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 pt-3 border-t border-border flex flex-col gap-2">
              <Link
                href="/auth/login"
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setOpen(false)}
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium text-center hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
