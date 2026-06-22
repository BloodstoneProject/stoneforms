'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Something went wrong</h1>
        <p className="text-muted-foreground mt-2">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium transition-colors"
          >
            Try again
          </button>
          <a
            href="/dashboard"
            className="px-5 py-2.5 border border-border rounded-md hover:bg-secondary font-medium text-foreground transition-colors"
          >
            Go to dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
