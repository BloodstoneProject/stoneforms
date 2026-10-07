import HomePage from '@/components/marketing/HomePage'
import { pageMetadata, SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION } from '@/lib/seo'

export const metadata = {
  ...pageMetadata({
    title: 'Stoneforms: Typeform-grade forms, without the Typeform tax',
    description: DEFAULT_DESCRIPTION,
    path: '/',
  }),
  // The home title is the brand line itself; skip the "| Stoneforms" template.
  title: { absolute: 'Stoneforms: Typeform-grade forms, without the Typeform tax' },
}

// Only facts the product can stand behind: it is a web app, it is free to
// start. No ratings, review counts or user numbers.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP', description: 'Free plan' },
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage />
    </>
  )
}
