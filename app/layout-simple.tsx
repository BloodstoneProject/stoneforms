import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stoneforms - AI-Powered Form Builder',
  description: 'Create forms with AI, automate workflows, and manage contacts all in one platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
