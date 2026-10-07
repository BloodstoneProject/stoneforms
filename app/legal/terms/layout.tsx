import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Terms of service',
  description: 'The terms that apply when you use Stoneforms.',
  path: '/legal/terms',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
