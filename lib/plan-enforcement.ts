// Plan enforcement utilities to check limits before actions

import { createClient } from '@/lib/supabase-client'
import { PLAN_LIMITS, PlanId } from './plan-limits'

interface LimitCheck {
  allowed: boolean
  current: number
  limit: number
  plan: PlanId
  message?: string
}

export async function getUserPlan(userId: string): Promise<PlanId> {
  const supabase = createClient()
  
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan_id')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()
  
  return (subscription?.plan_id as PlanId) || 'free'
}

export async function checkCanCreateForm(userId: string): Promise<LimitCheck> {
  const supabase = createClient()
  
  // Get user's plan
  const plan = await getUserPlan(userId)
  const limit = PLAN_LIMITS[plan].forms
  
  // Count current forms
  const { count } = await supabase
    .from('forms')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
  
  const current = count || 0
  const allowed = current < limit
  
  return {
    allowed,
    current,
    limit,
    plan,
    message: allowed ? undefined : `You've reached your limit of ${limit} forms on the ${plan} plan`
  }
}

export async function checkCanAcceptResponse(formId: string): Promise<LimitCheck> {
  const supabase = createClient()
  
  // Get form owner
  const { data: form } = await supabase
    .from('forms')
    .select('user_id')
    .eq('id', formId)
    .single()
  
  if (!form) {
    return { allowed: false, current: 0, limit: 0, plan: 'free', message: 'Form not found' }
  }
  
  // Get plan
  const plan = await getUserPlan(form.user_id)
  const limit = PLAN_LIMITS[plan].responses_per_month
  
  // Count this month's responses for all user's forms
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  
  const { data: allForms } = await supabase
    .from('forms')
    .select('id')
    .eq('user_id', form.user_id)
  
  const formIds = allForms?.map(f => f.id) || []
  
  const { count } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .in('form_id', formIds)
    .gte('submitted_at', startOfMonth.toISOString())
  
  const current = count || 0
  const allowed = current < limit
  
  return {
    allowed,
    current,
    limit,
    plan,
    message: allowed ? undefined : `Response limit reached (${limit}/month on ${plan} plan)`
  }
}

export async function checkStorageLimit(userId: string, additionalMB: number = 0): Promise<LimitCheck> {
  const supabase = createClient()
  
  // Get plan
  const plan = await getUserPlan(userId)
  const limit = PLAN_LIMITS[plan].storage_mb
  
  // Get all forms for user
  const { data: forms } = await supabase
    .from('forms')
    .select('id')
    .eq('user_id', userId)
  
  const formIds = forms?.map(f => f.id) || []
  
  // Get all submissions for those forms
  const { data: submissions } = await supabase
    .from('submissions')
    .select('id')
    .in('form_id', formIds)
  
  const submissionIds = submissions?.map(s => s.id) || []
  
  // Sum file sizes
  const { data: files } = await supabase
    .from('file_uploads')
    .select('file_size')
    .in('submission_id', submissionIds)
  
  const totalBytes = files?.reduce((sum, file) => sum + file.file_size, 0) || 0
  const currentMB = Math.round(totalBytes / (1024 * 1024))
  const allowed = (currentMB + additionalMB) < limit
  
  return {
    allowed,
    current: currentMB,
    limit,
    plan,
    message: allowed ? undefined : `Storage limit reached (${limit}MB on ${plan} plan)`
  }
}

export async function hasFeatureAccess(userId: string, feature: string): Promise<boolean> {
  const plan = await getUserPlan(userId)
  return PLAN_LIMITS[plan].features[feature as keyof typeof PLAN_LIMITS.free.features] || false
}
