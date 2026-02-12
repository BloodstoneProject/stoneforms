'use client'

import Link from 'next/link'
import { ArrowRight, Users, Brain, Target, Award, Star, Smile } from 'lucide-react'
import { quizTemplates } from '@/lib/quiz-templates'

const categoryIcons = {
  personality: Users,
  trivia: Brain,
  recommendation: Target,
  assessment: Award,
  satisfaction: Star,
  fun: Smile,
}

export default function QuizTemplatesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Header */}
      <div className="border-b-4 border-stone-900 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-stone-900">
                Quiz Templates
              </h1>
              <p className="text-lg text-stone-600 mt-2">
                Ready-to-use quiz templates. Pick one and start engaging your audience!
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-8 text-sm">
            <div>
              <span className="text-2xl font-bold text-stone-900">{quizTemplates.length}</span>
              <span className="text-stone-600 ml-2">Templates</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-stone-900">6</span>
              <span className="text-stone-600 ml-2">Categories</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-stone-900">100%</span>
              <span className="text-stone-600 ml-2">Customizable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizTemplates.map((quiz, idx) => {
            const Icon = categoryIcons[quiz.category]
            return (
              <Link
                key={quiz.id}
                href={`/quiz/${quiz.id}`}
                className="group relative bg-white border-4 border-stone-900 overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                {/* Art Deco Corners */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Color Header */}
                <div className={`h-2 bg-gradient-to-r ${quiz.color}`} />

                {/* Content */}
                <div className="p-8">
                  {/* Emoji Badge */}
                  <div className="text-6xl mb-4">{quiz.emoji}</div>

                  {/* Category Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 border border-stone-300 mb-4">
                    <Icon className="w-4 h-4 text-stone-600" />
                    <span className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
                      {quiz.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-stone-900 mb-3 group-hover:text-amber-600 transition-colors">
                    {quiz.title}
                  </h3>

                  {/* Description */}
                  <p className="text-stone-600 mb-6 line-clamp-2">
                    {quiz.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-stone-500">
                    <span>{quiz.questions.length} questions</span>
                    <span className="flex items-center gap-1 font-semibold text-stone-900 group-hover:text-amber-600 transition-colors">
                      Try it
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 border-4 border-amber-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </Link>
            )
          })}
        </div>

        {/* Custom Quiz CTA */}
        <div className="mt-16 bg-white border-4 border-stone-900 p-12 text-center relative">
          <div className="absolute -top-3 -left-3 w-8 h-8 border-t-4 border-l-4 border-amber-600" />
          <div className="absolute -top-3 -right-3 w-8 h-8 border-t-4 border-r-4 border-amber-600" />
          <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-4 border-l-4 border-amber-600" />
          <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-4 border-r-4 border-amber-600" />

          <h2 className="text-3xl font-bold text-stone-900 mb-4">
            Need a Custom Quiz?
          </h2>
          <p className="text-lg text-stone-600 mb-8 max-w-2xl mx-auto">
            All templates are fully customizable. Edit questions, change colors, or build from scratch with our quiz builder.
          </p>
          <Link
            href="/dashboard/quizzes/new"
            className="inline-flex items-center gap-2 px-8 py-4 bg-stone-900 text-white font-semibold hover:bg-amber-600 transition-colors"
          >
            Create Custom Quiz
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="border-t-4 border-stone-900 bg-stone-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-stone-400 mb-4">
            Join 10,000+ businesses using Stoneforms quizzes
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 text-white font-semibold hover:bg-amber-500 transition-colors"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
