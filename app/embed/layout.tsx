import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Embedded form',
  description: 'A form built with Stoneforms.',
  path: '/embed',
  noindex: true,
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
