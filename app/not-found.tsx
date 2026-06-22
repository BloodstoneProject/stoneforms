import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="text-center max-w-md">
        <p className="text-6xl font-semibold tracking-tight text-foreground">404</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground mt-4">Page not found</h1>
        <p className="text-muted-foreground mt-2">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 px-5 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
