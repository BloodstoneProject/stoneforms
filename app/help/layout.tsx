import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Help centre',
  description: 'Guides to building, sharing and analysing forms with Stoneforms.',
  path: '/help',
  noindex: true,
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
