'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Check,
  Plus,
  Palette,
  Share2,
  Plug,
  Sparkles,
  Lock,
} from 'lucide-react'
import { hasPlanFeature, type PlanId } from '@/lib/plan-limits'

interface GettingStartedProps {
  /** Whether the user has created at least one form. */
  hasForm: boolean
  /** Whether at least one form is published. */
  hasPublished: boolean
  /** Whether at least one response has come in. */
  hasResponse: boolean
  /** Current plan id, used for plan-gated upgrade hints. */
  plan: PlanId
  /** Create-a-form handler (POSTs /api/forms then routes to the builder). */
  onCreateForm: () => void
  creating: boolean
}

export function GettingStarted({
  hasForm,
  hasPublished,
  hasResponse,
  plan,
  onCreateForm,
  creating,
}: GettingStartedProps) {
  const steps = [
    {
      id: 'create',
      title: 'Create your first form',
      description: 'Start from scratch or a template. It takes a minute.',
      icon: <Plus className="w-5 h-5" />,
      done: hasForm,
      action: hasForm ? (
        <Link
          href="/dashboard/forms"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-700 hover:text-stone-900"
        >
          View forms <ArrowRight className="w-4 h-4" />
        </Link>
      ) : (
        <button
          onClick={onCreateForm}
          disabled={creating}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 text-white text-sm rounded-lg hover:bg-stone-800 disabled:opacity-50"
        >
          {creating ? 'Creating…' : 'Create form'}
        </button>
      ),
    },
    {
      id: 'design',
      title: 'Customize the design',
      description: 'Match your brand with themes, colors and fonts.',
      icon: <Palette className="w-5 h-5" />,
      done: hasForm,
      action: (
        <Link
          href="/dashboard/forms"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-700 hover:text-stone-900"
        >
          Open builder <ArrowRight className="w-4 h-4" />
        </Link>
      ),
    },
    {
      id: 'share',
      title: 'Publish & share it',
      description: 'Publish your form and send the link to start collecting.',
      icon: <Share2 className="w-5 h-5" />,
      done: hasPublished,
      action: (
        <Link
          href="/dashboard/forms"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-700 hover:text-stone-900"
        >
          Go to forms <ArrowRight className="w-4 h-4" />
        </Link>
      ),
    },
    {
      id: 'integrate',
      title: 'Connect an integration',
      description: 'Send responses to Google Sheets and other tools.',
      icon: <Plug className="w-5 h-5" />,
      done: false,
      action: (
        <Link
          href="/dashboard/forms"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-700 hover:text-stone-900"
        >
          Set up <ArrowRight className="w-4 h-4" />
        </Link>
      ),
    },
  ]

  const completed = steps.filter((s) => s.done).length

  return (
    <div className="space-y-6">
      {/* Hero / empty-state header */}
      <div className="relative overflow-hidden bg-white rounded-2xl border border-stone-200 p-8">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-stone-100 rounded-full opacity-60" />
        <div className="relative">
          <div className="w-12 h-12 bg-stone-900 text-white rounded-xl flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900">
            {hasForm ? "Let's get your form live" : 'Welcome to Stoneforms'}
          </h2>
          <p className="text-stone-600 mt-1 max-w-lg">
            {hasResponse
              ? 'Nice work, responses are coming in. Finish setting things up below.'
              : 'A few quick steps to go from zero to collecting responses.'}
          </p>
          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1 max-w-xs h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-stone-900 transition-all duration-500"
                style={{ width: `${(completed / steps.length) * 100}%` }}
              />
            </div>
            <span className="text-sm text-stone-500 font-medium">
              {completed}/{steps.length} done
            </span>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100">
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex items-center gap-4 px-6 py-4"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                step.done
                  ? 'bg-green-100 text-green-600'
                  : 'bg-stone-100 text-stone-500'
              }`}
            >
              {step.done ? <Check className="w-5 h-5" /> : step.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={`font-medium ${
                  step.done ? 'text-stone-400 line-through' : 'text-stone-900'
                }`}
              >
                {step.title}
              </p>
              <p className="text-sm text-stone-500">{step.description}</p>
            </div>
            <div className="shrink-0">{step.action}</div>
          </div>
        ))}
      </div>

      {/* Plan-gated features (upgrade hints, read-only) */}
      {plan === 'free' && (
        <div className="bg-stone-900 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">Unlock more with Pro</h3>
              <p className="text-stone-300 text-sm mt-1 mb-4">
                Remove Stoneforms branding, get a custom shareable link, file
                uploads, email notifications and advanced analytics.
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                <Locked label="Remove branding" available={hasPlanFeature(plan, 'remove_branding')} />
                <Locked label="Custom link" available={hasPlanFeature(plan, 'custom_domains')} />
                <Locked label="File uploads" available={hasPlanFeature(plan, 'file_uploads')} />
                <Locked label="Email notifications" available={hasPlanFeature(plan, 'email_notifications')} />
              </div>
              <Link
                href="/dashboard/settings/billing"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-stone-900 text-sm font-medium rounded-lg hover:bg-stone-100"
              >
                Upgrade <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Locked({ label, available }: { label: string; available: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        available ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-stone-300'
      }`}
    >
      {available ? <Check className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
      {label}
    </span>
  )
}
