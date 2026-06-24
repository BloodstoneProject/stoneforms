import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { ThemeProvider, themeNoFlashScript } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
// Marketing display face ("Electric & sharp" brand). App chrome keeps Inter;
// only the public marketing pages opt into Space Grotesk via var(--font-grotesk).
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Stoneforms — Typeform-grade forms, without the Typeform tax',
  description:
    'The form builder that gives you everything — logic, recall, variables, AI generation, 25+ field types — unlocked. Build beautiful forms free.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Sets .dark before first paint to avoid a theme flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeNoFlashScript }} />
      </head>
      <body className={`${inter.className} ${spaceGrotesk.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
