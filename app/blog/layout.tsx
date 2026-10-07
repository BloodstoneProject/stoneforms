import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Blog',
  description: 'Notes on building better forms.',
  path: '/blog',
  noindex: true,
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
