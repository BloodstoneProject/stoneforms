import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

// GET /api/contacts - List all contacts for authenticated user
export async function GET(request: Request) {
  const supabase = createServerSupabaseClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const tag = searchParams.get('tag') || ''

  let query = supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%,company.ilike.%${search}%`)
  }

  if (tag) {
    query = query.contains('tags', [tag])
  }

  const { data: contacts, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ contacts: contacts || [] })
}

// POST /api/contacts - Create new contact
export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { email, first_name, last_name, phone, company, tags, properties } = body

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  // Get or create workspace for user
  let workspaceId: string
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (workspace) {
    workspaceId = workspace.id
  } else {
    const { data: newWorkspace, error: wsError } = await supabase
      .from('workspaces')
      .insert({ name: 'My Workspace', owner_id: user.id })
      .select('id')
      .single()
    if (wsError || !newWorkspace) {
      return NextResponse.json({ error: 'Failed to create workspace' }, { status: 500 })
    }
    workspaceId = newWorkspace.id
  }

  const { data: contact, error } = await supabase
    .from('contacts')
    .insert({
      workspace_id: workspaceId,
      email,
      first_name: first_name || null,
      last_name: last_name || null,
      phone: phone || null,
      company: company || null,
      tags: tags || [],
      properties: properties || {},
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'A contact with this email already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ contact })
}
