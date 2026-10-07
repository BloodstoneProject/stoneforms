import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Features',
  description: 'Conditional logic, answer recall, variables, scoring, 25+ field types, embeds and per-form analytics. Every builder feature is on the Free plan.',
  path: '/features',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
