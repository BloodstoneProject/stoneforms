import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Form templates',
  description: 'Ready-made contact, lead generation, feedback, quiz and survey templates. Pick one, edit it and publish it in minutes.',
  path: '/templates',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
