'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Sparkles, Users, Target, Zap } from 'lucide-react'

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    role: '',
    teamSize: '',
    useCase: '',
    goals: [] as string[],
  })

  const steps = [
    { title: 'Welcome', icon: Sparkles },
    { title: 'Your Role', icon: Users },
    { title: 'Use Case', icon: Target },
    { title: 'Goals', icon: Zap },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      window.location.href = '/dashboard'
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Progress */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-stone-200 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="text-xl font-bold text-stone-900">
              Stoneforms
            </Link>
            <Link href="/dashboard" className="text-sm text-stone-600 hover:text-stone-900">
              Skip for now
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {steps.map((step, idx) => (
              <div key={idx} className="flex-1 flex items-center gap-2">
                <div className={`flex-1 h-2 rounded-full ${
                  idx <= currentStep ? 'bg-stone-900' : 'bg-stone-200'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-32 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Step 0: Welcome */}
          {currentStep === 0 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-stone-900 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-stone-900 mb-4">
                Welcome to Stoneforms!
              </h1>
              <p className="text-xl text-stone-600 mb-12">
                Let's personalize your experience. This will only take 2 minutes.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-xl p-6 border border-stone-200">
                  <div className="text-3xl mb-3">📝</div>
                  <h3 className="font-bold text-stone-900 mb-2">Create Forms</h3>
                  <p className="text-sm text-stone-600">Build beautiful forms in minutes</p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-stone-200">
                  <div className="text-3xl mb-3">📊</div>
                  <h3 className="font-bold text-stone-900 mb-2">Collect Data</h3>
                  <p className="text-sm text-stone-600">Get responses instantly</p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-stone-200">
                  <div className="text-3xl mb-3">🚀</div>
                  <h3 className="font-bold text-stone-900 mb-2">Grow Faster</h3>
                  <p className="text-sm text-stone-600">Convert more leads</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Role */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-4xl font-bold text-stone-900 mb-4 text-center">
                What's your role?
              </h2>
              <p className="text-lg text-stone-600 mb-12 text-center">
                This helps us customize your experience
              </p>
              <div className="grid gap-4">
                {[
                  { value: 'marketing', label: 'Marketing', emoji: '📢' },
                  { value: 'sales', label: 'Sales', emoji: '💼' },
                  { value: 'product', label: 'Product Manager', emoji: '🎯' },
                  { value: 'developer', label: 'Developer', emoji: '💻' },
                  { value: 'founder', label: 'Founder/CEO', emoji: '🚀' },
                  { value: 'other', label: 'Other', emoji: '✨' },
                ].map((role) => (
                  <button
                    key={role.value}
                    onClick={() => setFormData({ ...formData, role: role.value })}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${
                      formData.role === role.value
                        ? 'border-stone-900 bg-stone-50'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{role.emoji}</span>
                      <span className="text-lg font-semibold text-stone-900">{role.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Use Case */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-4xl font-bold text-stone-900 mb-4 text-center">
                What will you use Stoneforms for?
              </h2>
              <p className="text-lg text-stone-600 mb-12 text-center">
                Select your primary use case
              </p>
              <div className="grid gap-4">
                {[
                  { value: 'lead-gen', label: 'Lead Generation', desc: 'Capture and qualify leads' },
                  { value: 'feedback', label: 'Customer Feedback', desc: 'Collect user feedback' },
                  { value: 'surveys', label: 'Surveys & Research', desc: 'Run surveys and studies' },
                  { value: 'registrations', label: 'Event Registrations', desc: 'Manage event signups' },
                  { value: 'applications', label: 'Applications', desc: 'Job or program applications' },
                  { value: 'other', label: 'Something else', desc: 'Custom use case' },
                ].map((useCase) => (
                  <button
                    key={useCase.value}
                    onClick={() => setFormData({ ...formData, useCase: useCase.value })}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${
                      formData.useCase === useCase.value
                        ? 'border-stone-900 bg-stone-50'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <h3 className="text-lg font-bold text-stone-900 mb-1">{useCase.label}</h3>
                    <p className="text-sm text-stone-600">{useCase.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Goals */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-4xl font-bold text-stone-900 mb-4 text-center">
                What are your goals?
              </h2>
              <p className="text-lg text-stone-600 mb-12 text-center">
                Select all that apply
              </p>
              <div className="grid gap-4">
                {[
                  { value: 'more-leads', label: 'Get more leads' },
                  { value: 'better-data', label: 'Collect better data' },
                  { value: 'save-time', label: 'Save time on data entry' },
                  { value: 'automate', label: 'Automate workflows' },
                  { value: 'integrate', label: 'Integrate with other tools' },
                  { value: 'analytics', label: 'Better analytics & reporting' },
                ].map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => {
                      const newGoals = formData.goals.includes(goal.value)
                        ? formData.goals.filter(g => g !== goal.value)
                        : [...formData.goals, goal.value]
                      setFormData({ ...formData, goals: newGoals })
                    }}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${
                      formData.goals.includes(goal.value)
                        ? 'border-stone-900 bg-stone-50'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        formData.goals.includes(goal.value)
                          ? 'border-stone-900 bg-stone-900'
                          : 'border-stone-300'
                      }`}>
                        {formData.goals.includes(goal.value) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-lg font-semibold text-stone-900">{goal.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-6 py-3 text-stone-600 hover:text-stone-900 font-medium disabled:opacity-0"
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-4 bg-stone-900 text-white rounded-xl hover:bg-stone-800 font-semibold text-lg"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
