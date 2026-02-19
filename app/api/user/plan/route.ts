import { createClient } from '@/lib/supabase-client'
import { NextResponse } from 'next/server'
import { PLAN_LIMITS, PlanId } from '@/lib/plan-limits'

// GET /api/user/plan - Get current user's plan and usage
export async function GET() {
  const supabase = createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  const planId = (subscription?.plan_id as PlanId) || 'free'
  const limits = PLAN_LIMITS[planId]

  // Get current usage - forms count
  const { count: formsCount } = await supabase
    .from('forms')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Get this month's responses count
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: userForms } = await supabase
    .from('forms')
    .select('id')
    .eq('user_id', user.id)

  const formIds = userForms?.map(f => f.id) || []

  const { count: responsesCount } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .in('form_id', formIds)
    .gte('submitted_at', startOfMonth.toISOString())

  // Get storage usage (for when file uploads added)
  const { data: submissions } = await supabase
    .from('submissions')
    .select('id')
    .in('form_id', formIds)

  const submissionIds = submissions?.map(s => s.id) || []

  const { data: files } = await supabase
    .from('file_uploads')
    .select('file_size')
    .in('submission_id', submissionIds)

  const totalBytes = files?.reduce((sum, file) => sum + file.file_size, 0) || 0
  const storageMB = Math.round(totalBytes / (1024 * 1024))

  return NextResponse.json({
    plan: {
      id: planId,
      name: limits.name,
      currency: subscription?.currency || 'GBP',
      ...limits
    },
    usage: {
      forms: {
        current: formsCount || 0,
        limit: limits.forms,
        percentage: Math.round(((formsCount || 0) / limits.forms) * 100)
      },
      responses: {
        current: responsesCount || 0,
        limit: limits.responses_per_month,
        percentage: Math.round(((responsesCount || 0) / limits.responses_per_month) * 100)
      },
      storage: {
        current: storageMB,
        limit: limits.storage_mb,
        percentage: Math.round((storageMB / limits.storage_mb) * 100)
      }
    },
    subscription: subscription || null
  })
}
