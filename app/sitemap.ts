import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'
import { FORM_TEMPLATES } from '@/lib/form-templates'

// Only pages we want indexed. /blog and /help are left out on purpose: their
// articles are placeholder copy and are marked noindex until real ones exist.
// User forms (/f, /p) are left out too; they belong to customers.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths: { path: string; priority: number }[] = [
    { path: '', priority: 1 },
    { path: '/features', priority: 0.9 },
    { path: '/pricing', priority: 0.9 },
    { path: '/templates', priority: 0.8 },
    { path: '/contact', priority: 0.5 },
    { path: '/legal/privacy', priority: 0.2 },
    { path: '/legal/terms', priority: 0.2 },
  ]
  return [
    ...staticPaths.map(({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: 'monthly' as const,
      priority,
    })),
    ...FORM_TEMPLATES.map((t) => ({
      url: `${SITE_URL}/templates/${t.id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
