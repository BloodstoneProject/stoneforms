import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Pricing',
  description: 'Free forever for up to 3 forms and 100 responses a month, with every builder feature included. Pro is £15 a month and Business £25 a month.',
  path: '/pricing',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
