'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Plus,
  ArrowRight 
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()

  // Redirect to forms page (main dashboard)
  useEffect(() => {
    router.push('/dashboard/forms')
  }, [router])

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto"></div>
        <p className="mt-4 text-stone-600">Loading...</p>
      </div>
    </div>
  )
}
