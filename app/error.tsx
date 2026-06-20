'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f2ed] p-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-stone-900">Something went wrong</h1>
        <p className="text-stone-600 mt-2">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium"
          >
            Try again
          </button>
          <a
            href="/dashboard"
            className="px-5 py-2.5 border border-stone-300 rounded-lg hover:bg-white font-medium text-stone-700"
          >
            Go to dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
