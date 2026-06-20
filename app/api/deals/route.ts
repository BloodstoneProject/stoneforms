import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

// GET /api/deals - List all deals
export async function GET() {
  const supabase = createServerSupabaseClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: deals, error } = await supabase
    .from('deals')
    .select(`
      *,
      contact:contacts(id, first_name, last_name, email, company)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ deals: deals || [] })
}

// POST /api/deals - Create new deal
export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, contact_id, value, currency, stage, probability, expected_close_date, notes } = body

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }

  // Get or lazily create the user's workspace (a default pipeline is created
  // automatically by the create_default_pipeline trigger on workspace insert).
  let workspace: { id: string } | null = null
  const { data: existing } = await supabase
    .from('workspaces')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle()

  if (existing) {
    workspace = existing
  } else {
    const { data: created, error: wsError } = await supabase
      .from('workspaces')
      .insert({ name: 'My Workspace', owner_id: user.id })
      .select('id')
      .single()
    if (wsError || !created) {
      return NextResponse.json({ error: 'Failed to create workspace' }, { status: 500 })
    }
    workspace = created
  }

  // Get default pipeline
  const { data: pipeline } = await supabase
    .from('pipelines')
    .select('id')
    .eq('workspace_id', workspace.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  const { data: deal, error } = await supabase
    .from('deals')
    .insert({
      workspace_id: workspace.id,
      pipeline_id: pipeline?.id || null,
      contact_id: contact_id || null,
      title,
      value: value || 0,
      currency: currency || 'GBP',
      stage: stage || 'lead',
      probability: probability || 10,
      expected_close_date: expected_close_date || null,
      notes: notes || null,
      status: 'open',
    })
    .select(`
      *,
      contact:contacts(id, first_name, last_name, email, company)
    `)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ deal })
}
