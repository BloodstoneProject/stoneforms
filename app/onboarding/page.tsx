'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Check,
  Loader2,
  Sparkles,
  Target,
  MessageSquare,
  HelpCircle,
  Mail,
} from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { USE_CASES, starterTitleFor, type UseCase } from '@/lib/onboarding'

const USE_CASE_ICONS: Record<UseCase, React.ReactNode> = {
  lead_gen: <Target className="w-5 h-5" />,
  surveys: <MessageSquare className="w-5 h-5" />,
  quizzes: <HelpCircle className="w-5 h-5" />,
  contact_forms: <Mail className="w-5 h-5" />,
}

const TOTAL_STEPS = 3

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [checking, setChecking] = useState(true)
  const [firstName, setFirstName] = useState('')
  const [step, setStep] = useState(1)
  const [useCase, setUseCase] = useState<UseCase | null>(null)
  const [working, setWorking] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!active) return
      if (!user) {
        router.replace('/auth/login')
        return
      }
      // Already onboarded? Skip straight to the dashboard.
      if (user.user_metadata?.onboarded === true) {
        router.replace('/dashboard')
        return
      }
      setFirstName(user.user_metadata?.full_name?.split(' ')[0] || '')
      setChecking(false)
    })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist onboarding completion + the chosen use case into user_metadata.
  async function persistOnboarded(): Promise<boolean> {
    const { error: updErr } = await supabase.auth.updateUser({
      data: { onboarded: true, use_case: useCase || undefined },
    })
    if (updErr) {
      setError(updErr.message || 'Something went wrong. Please try again.')
      return false
    }
    return true
  }

  // Step 3 primary CTA: finish onboarding and create a starter form, routing
  // into the existing builder.
  async function createFirstForm() {
    setWorking(true)
    setError('')
    const ok = await persistOnboarded()
    if (!ok) {
      setWorking(false)
      return
    }
    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: starterTitleFor(useCase) }),
      })
      const data = await res.json()
      if (res.ok && data.form) {
        window.location.href = `/dashboard/forms/${data.form.id}`
        return
      }
      // Form couldn't be created (e.g. plan limit) - still send them in.
      window.location.href = '/dashboard'
    } catch {
      window.location.href = '/dashboard'
    }
  }

  // Secondary CTA / skip: mark complete and go to the dashboard.
  async function finishToDashboard() {
    setWorking(true)
    setError('')
    const ok = await persistOnboarded()
    if (!ok) {
      setWorking(false)
      return
    }
    window.location.href = '/dashboard'
  }

  if (checking) {
    return (
      <Shell>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-7 h-7 animate-spin text-muted-foreground" />
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
          const n = i + 1
          const done = n < step
          const active = n === step
          return (
            <div key={n} className="flex items-center gap-2 flex-1">
              <div
                className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                  done || active ? 'bg-primary' : 'bg-muted'
                }`}
              />
            </div>
          )
        })}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* STEP 1 — Welcome */}
      {step === 1 && (
        <div className="animate-fade">
          <div className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center mb-6">
            <Sparkles className="w-7 h-7 text-foreground" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
            {firstName ? `Welcome, ${firstName}.` : 'Welcome to Stoneforms.'}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg">
            Stoneforms lets you build beautiful forms, surveys and quizzes in
            minutes, then collect and manage every response with a light CRM
            built in. Let's get your first form live.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium transition-colors"
            >
              Get started <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={finishToDashboard}
              disabled={working}
              className="px-5 py-2.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              {working ? 'Skipping…' : 'Skip for now'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 — Use case */}
      {step === 2 && (
        <div className="animate-fade">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-3">
            What will you use it for?
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            This helps us tailor your starting point. You can change direction
            any time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {USE_CASES.map((uc) => {
              const selected = useCase === uc.id
              return (
                <button
                  key={uc.id}
                  onClick={() => setUseCase(uc.id)}
                  className={`text-left p-5 rounded-lg border transition-all duration-200 ${
                    selected
                      ? 'border-primary bg-muted ring-1 ring-primary'
                      : 'border-border bg-card hover:border-foreground/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-10 h-10 rounded-md flex items-center justify-center mb-3 ${
                        selected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {USE_CASE_ICONS[uc.id]}
                    </div>
                    {selected && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="font-medium text-foreground">{uc.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {uc.description}
                  </p>
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setStep(3)}
              disabled={!useCase}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium transition-colors disabled:opacity-40 disabled:hover:bg-primary"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — Create first form */}
      {step === 3 && (
        <div className="animate-fade">
          <div className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center mb-6">
            <Check className="w-7 h-7 text-foreground" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
            You're all set.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg">
            We'll create a starter{' '}
            <span className="text-foreground">{starterTitleFor(useCase).toLowerCase()}</span>{' '}
            and drop you straight into the builder. Add your questions, style it,
            and publish when you're ready.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={createFirstForm}
              disabled={working}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium transition-colors disabled:opacity-50"
            >
              {working ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating…
                </>
              ) : (
                <>
                  Create my first form <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <button
              onClick={finishToDashboard}
              disabled={working}
              className="px-5 py-2.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              Go to dashboard
            </button>
          </div>
        </div>
      )}
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <span className="text-2xl font-semibold tracking-tight text-foreground">
            Stoneforms
          </span>
        </div>
        <div className="card-surface rounded-lg p-8 sm:p-12">
          {children}
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        @keyframes onboardFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade {
          animation: onboardFade 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}
