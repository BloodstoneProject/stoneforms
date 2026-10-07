import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Sign in',
  description: 'Sign in to Stoneforms or create a free account.',
  path: '/auth',
  noindex: true,
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
