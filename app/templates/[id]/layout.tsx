import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTemplate } from '@/lib/form-templates'
import { pageMetadata } from '@/lib/seo'

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const template = getTemplate(params.id)
  if (!template) return { title: 'Template not found', robots: { index: false } }
  const meta = pageMetadata({
    title: `${template.name} template | Stoneforms`,
    description: template.description,
    path: `/templates/${template.id}`,
  })
  // The root "%s | Stoneforms" template does not reach this nested segment
  // (the /templates layout title resets it), so the suffix is written here.
  return {
    ...meta,
    title: { absolute: `${template.name} template | Stoneforms` },
    // The root opengraph-image is not inherited by this dynamic segment.
    openGraph: { ...meta.openGraph, images: [{ url: '/opengraph-image', width: 1200, height: 630 }] },
  }
}

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  // An unknown template id is a real 404, not a 200 "not found" page.
  if (!getTemplate(params.id)) notFound()
  return children
}
