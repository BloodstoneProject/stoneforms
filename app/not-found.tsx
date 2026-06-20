import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f2ed] p-6">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-stone-900">404</p>
        <h1 className="text-2xl font-bold text-stone-900 mt-4">Page not found</h1>
        <p className="text-stone-600 mt-2">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 px-5 py-2.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
