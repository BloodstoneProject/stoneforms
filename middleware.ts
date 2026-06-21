import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSubdomain } from '@/lib/subdomain'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // --- FEATURE 3: Branded subdomain serving (inert until *.stoneforms.app DNS) ---
  // If the request arrives on a branded subdomain like `acme.stoneforms.app`,
  // rewrite the site root / form path to the existing public form page at
  // `/f/{slug}`. The forms engine resolves a non-UUID `[id]` param as a slug
  // (that is the contract). For apex / localhost / preview hosts getSubdomain
  // returns null and we fall through to the normal app behaviour below.
  const host = request.headers.get('host')
  const slug = getSubdomain(host)
  if (slug) {
    // Never touch framework internals, static assets, or API requests.
    const isInternal =
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname === '/favicon.ico' ||
      /\.[a-zA-Z0-9]+$/.test(pathname)

    if (isInternal) {
      return NextResponse.next()
    }

    // Already a form path on the subdomain - leave it alone.
    if (pathname.startsWith('/f/')) {
      return NextResponse.next()
    }

    // Map the site root (and any other path) on a branded host to that form's
    // public page via a rewrite (not a redirect, so the URL stays branded).
    const url = request.nextUrl.clone()
    url.pathname = `/f/${slug}`
    return NextResponse.rewrite(url)
  }

  // --- Normal apex-domain behaviour (auth + onboarding) ---
  // Only the dashboard, auth and onboarding routes need a session lookup.
  // Skip the Supabase getUser() round-trip on marketing + public form pages
  // (e.g. /f/[id]) so respondent-facing loads stay fast.
  const needsAuth =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/onboarding')
  if (!needsAuth) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect dashboard routes - redirect to login if not authenticated
  if (pathname.startsWith('/dashboard') && !user) {
    const loginUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Protect the onboarding route too - it requires an authenticated user.
  if (pathname.startsWith('/onboarding') && !user) {
    const loginUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // FEATURE 2: First-run onboarding gate.
  // Authenticated users who have not completed onboarding are sent to
  // /onboarding when they hit the dashboard. Once user_metadata.onboarded is
  // truthy they pass straight through. We never redirect away from /onboarding
  // itself, so there is no loop and skipping stays possible.
  if (user && pathname.startsWith('/dashboard')) {
    const onboarded = user.user_metadata?.onboarded === true
    if (!onboarded) {
      const onboardingUrl = new URL('/onboarding', request.url)
      return NextResponse.redirect(onboardingUrl)
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith('/auth/') && user) {
    if (pathname !== '/auth/callback') {
      const dashboardUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
  }

  return response
}

export const config = {
  // Run on everything except framework internals, API routes and static
  // assets. This keeps normal apex behaviour intact while letting the
  // subdomain rewrite (Feature 3) run on the site root for branded hosts.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.[a-zA-Z0-9]+$).*)',
  ],
}
