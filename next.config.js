/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  async headers() {
    // Allow ONLY the public form (/f/*) and chrome-less embed (/embed/*) routes
    // to be framed cross-origin so the embed.js iframe + plain iframe snippets
    // work on any customer site. We intentionally do NOT loosen framing for
    // /dashboard, /auth, or anything else — those keep the framework defaults.
    const frameable = [
      // Modern, granular control; `*` lets any site frame these pages.
      { key: 'Content-Security-Policy', value: 'frame-ancestors *' },
      // Explicitly clear the legacy header so no upstream default forces DENY.
      { key: 'X-Frame-Options', value: 'ALLOWALL' },
    ]
    return [
      { source: '/f/:path*', headers: frameable },
      { source: '/embed/:path*', headers: frameable },
    ]
  },
}

module.exports = nextConfig
