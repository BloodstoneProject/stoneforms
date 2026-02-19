// Plan limits and feature flags for Free, Pro, and Business tiers

export const PLAN_LIMITS = {
  free: {
    name: 'Free',
    price_gbp: 0,
    price_usd: 0,
    forms: 3,
    responses_per_month: 100,
    storage_mb: 10,
    features: {
      file_uploads: false,
      email_notifications: false,
      advanced_analytics: false,
      remove_branding: false,
      custom_domains: false,
      team_collaboration: false,
      webhooks: false,
      api_access: false,
      priority_support: false,
    }
  },
  pro: {
    name: 'Pro',
    price_gbp: 15,
    price_usd: 19, // ~$19 USD
    forms: 999999, // Unlimited
    responses_per_month: 10000,
    storage_mb: 1024, // 1 GB
    features: {
      file_uploads: true,
      email_notifications: true,
      advanced_analytics: true,
      remove_branding: true,
      custom_domains: false,
      team_collaboration: false,
      webhooks: false,
      api_access: false,
      priority_support: false,
    }
  },
  business: {
    name: 'Business',
    price_gbp: 25,
    price_usd: 31, // ~$31 USD
    forms: 999999, // Unlimited
    responses_per_month: 999999, // Unlimited
    storage_mb: 10240, // 10 GB
    features: {
      file_uploads: true,
      email_notifications: true,
      advanced_analytics: true,
      remove_branding: true,
      custom_domains: true,
      team_collaboration: true,
      webhooks: true,
      api_access: true,
      priority_support: true,
    }
  }
} as const

export type PlanId = keyof typeof PLAN_LIMITS
export type PlanFeature = keyof typeof PLAN_LIMITS.free.features

export function getPlanLimit(plan: PlanId, limit: 'forms' | 'responses_per_month' | 'storage_mb'): number {
  return PLAN_LIMITS[plan]?.[limit] || 0
}

export function hasPlanFeature(plan: PlanId, feature: PlanFeature): boolean {
  return PLAN_LIMITS[plan]?.features?.[feature] || false
}

export function getPlanPrice(plan: PlanId, currency: 'GBP' | 'USD' = 'GBP'): number {
  const key = currency === 'GBP' ? 'price_gbp' : 'price_usd'
  return PLAN_LIMITS[plan]?.[key] || 0
}

export function getCurrencySymbol(currency: 'GBP' | 'USD' = 'GBP'): string {
  return currency === 'GBP' ? '£' : '$'
}

export function getUpgradeMessage(plan: PlanId, limitType: string): string {
  if (plan === 'business') return ''
  
  const nextPlan = plan === 'free' ? 'Pro' : 'Business'
  
  const messages: Record<string, string> = {
    forms: `Upgrade to ${nextPlan} for unlimited forms`,
    responses: `Upgrade to ${nextPlan} for more responses`,
    storage: `Upgrade to ${nextPlan} for more storage`,
    file_uploads: `Upgrade to ${nextPlan} to enable file uploads`,
    email_notifications: `Upgrade to ${nextPlan} to get email notifications`,
    advanced_analytics: `Upgrade to ${nextPlan} for advanced analytics`,
    custom_domains: `Upgrade to Business for custom domains`,
    team_collaboration: `Upgrade to Business for team collaboration`,
    webhooks: `Upgrade to Business to use webhooks`,
  }
  
  return messages[limitType] || `Upgrade to ${nextPlan} for this feature`
}
