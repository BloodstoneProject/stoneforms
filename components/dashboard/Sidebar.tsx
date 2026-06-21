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

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await authHelpers.signOut()
    router.push('/auth/login')
  }

  const navLinkClass = (isActive: boolean) =>
    cn(
      'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
      isActive
        ? 'bg-secondary text-foreground'
        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
    )

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/dashboard" className="flex items-center">
          <span className="text-xl font-semibold tracking-tight text-foreground">
            Stoneforms
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navigation.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={navLinkClass(isActive)}
            >
              <item.icon className="mr-3 h-[1.1rem] w-[1.1rem]" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="space-y-1 border-t border-border p-3">
        <Link
          href="/dashboard/settings"
          className={navLinkClass(pathname === '/dashboard/settings')}
        >
          <Settings className="mr-3 h-[1.1rem] w-[1.1rem]" />
          Settings
        </Link>

        <Button
          variant="ghost"
          className="w-full justify-start px-3 text-muted-foreground hover:text-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="mr-3 h-[1.1rem] w-[1.1rem]" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
