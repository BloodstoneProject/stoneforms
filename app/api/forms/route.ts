import { createClient } from '@/lib/supabase-client'
import { NextResponse } from 'next/server'
import { checkCanCreateForm } from '@/lib/plan-enforcement'

// GET /api/forms - List all forms for authenticated user
export async function GET() {
  const supabase = createClient()
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get user's forms
  const { data: forms, error } = await supabase
    .from('forms')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ forms })
}

// POST /api/forms - Create new form
export async function POST(request: Request) {
  const supabase = createClient()
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check plan limits
  const limitCheck = await checkCanCreateForm(user.id)
  
  if (!limitCheck.allowed) {
    return NextResponse.json({ 
      error: limitCheck.message,
      limit: limitCheck.limit,
      current: limitCheck.current,
      plan: limitCheck.plan,
      upgrade: true
    }, { status: 403 })
  }

  const body = await request.json()
  const { title, description } = body

  // Create form
  const { data: form, error } = await supabase
    .from('forms')
    .insert({
      user_id: user.id,
      title: title || 'Untitled Form',
      description: description || '',
      status: 'draft',
      settings: {}
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ form })
}
