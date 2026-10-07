import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Privacy policy',
  description: 'How Stoneforms collects, uses and protects personal data.',
  path: '/legal/privacy',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
