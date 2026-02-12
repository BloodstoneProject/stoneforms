'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import QuizPlayer from '@/components/quiz/QuizPlayer'
import { quizTemplates } from '@/lib/quiz-templates'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const quiz = quizTemplates.find((q) => q.id === id)

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-6">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
          * { font-family: 'DM Sans', sans-serif; }
        `}</style>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">Quiz Not Found</h1>
          <p className="text-stone-600 mb-8">The quiz you're looking for doesn't exist.</p>
          <Link
            href="/dashboard/quizzes"
            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-semibold hover:bg-amber-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Templates
          </Link>
        </div>
      </div>
    )
  }

  const handleComplete = (answers: Record<string, any>, result: any) => {
    console.log('Quiz completed:', { answers, result })
    // Here you would save to database
  }

  return <QuizPlayer quiz={quiz} onComplete={handleComplete} />
}
