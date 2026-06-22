'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  LayoutTemplate,
  BarChart3,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { authHelpers } from '@/lib/supabase-client'

// Only sections backed by real data are linked here. Demo modules from the
// original scaffold have been removed so every link leads to a working page.
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Forms', href: '/dashboard/forms', icon: FileText },
  { name: 'Templates', href: '/dashboard/templates', icon: LayoutTemplate },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Contacts', href: '/dashboard/contacts', icon: Users },
  { name: 'Deals', href: '/dashboard/deals', icon: TrendingUp },
]

interface SidebarProps {
  /** Whether the mobile slide-over drawer is open. */
  mobileOpen?: boolean
  /** Close handler for the mobile drawer. */
  onClose?: () => void
}

export function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await authHelpers.signOut()
    router.push('/auth/login')
  }

  const navLinkClass = (isActive: boolean) =>
    cn(
      'flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      isActive
        ? 'bg-secondary text-foreground'
        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
    )

  const content = (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border px-6">
        <Link href="/dashboard" className="flex items-center">
          <span className="text-xl font-semibold tracking-tight text-foreground">
            Stoneforms
          </span>
        </Link>
        {/* Close button — mobile drawer only */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav aria-label="Primary" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navigation.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={navLinkClass(isActive)}
            >
              <item.icon className="mr-3 h-[1.1rem] w-[1.1rem] shrink-0" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="space-y-1 border-t border-border p-3">
        <Link
          href="/dashboard/settings"
          aria-current={pathname === '/dashboard/settings' ? 'page' : undefined}
          className={navLinkClass(pathname === '/dashboard/settings')}
        >
          <Settings className="mr-3 h-[1.1rem] w-[1.1rem] shrink-0" />
          Settings
        </Link>

        <Button
          variant="ghost"
          className="w-full justify-start px-3 text-muted-foreground hover:text-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="mr-3 h-[1.1rem] w-[1.1rem] shrink-0" />
          Sign Out
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop: static sidebar */}
      <div className="hidden h-full w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
        {content}
      </div>

      {/* Mobile: slide-over drawer + scrim */}
      <div
        className={cn(
          'fixed inset-0 z-50 md:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        aria-hidden={!mobileOpen}
      >
        {/* Scrim */}
        <div
          onClick={onClose}
          className={cn(
            'absolute inset-0 bg-black/50 transition-opacity duration-200 motion-reduce:transition-none',
            mobileOpen ? 'opacity-100' : 'opacity-0'
          )}
        />
        {/* Drawer */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={cn(
            'absolute inset-y-0 left-0 flex w-64 max-w-[85%] flex-col border-r border-border bg-card shadow-lg transition-transform duration-200 ease-out motion-reduce:transition-none',
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {content}
        </div>
      </div>
    </>
  )
}
