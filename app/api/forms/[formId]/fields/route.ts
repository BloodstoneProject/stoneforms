import { createClient } from '@/lib/supabase-client'
import { NextResponse } from 'next/server'

// GET /api/forms/[formId]/fields - Get all fields for a form
export async function GET(
  request: Request,
  { params }: { params: { formId: string } }
) {
  const supabase = createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // First verify user owns this form
  const { data: form } = await supabase
    .from('forms')
    .select('id')
    .eq('id', params.formId)
    .eq('user_id', user.id)
    .single()

  if (!form) {
    return NextResponse.json({ error: 'Form not found' }, { status: 404 })
  }

  // Get fields
  const { data: fields, error } = await supabase
    .from('form_fields')
    .select('*')
    .eq('form_id', params.formId)
    .order('position', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ fields: fields || [] })
}

// POST /api/forms/[formId]/fields - Add new field
export async function POST(
  request: Request,
  { params }: { params: { formId: string } }
) {
  const supabase = createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify user owns this form
  const { data: form } = await supabase
    .from('forms')
    .select('id')
    .eq('id', params.formId)
    .eq('user_id', user.id)
    .single()

  if (!form) {
    return NextResponse.json({ error: 'Form not found' }, { status: 404 })
  }

  const body = await request.json()

  // Get max position for this form
  const { data: maxField } = await supabase
    .from('form_fields')
    .select('position')
    .eq('form_id', params.formId)
    .order('position', { ascending: false })
    .limit(1)
    .single()

  const nextPosition = maxField ? maxField.position + 1 : 0

  // Create field
  const { data: field, error } = await supabase
    .from('form_fields')
    .insert({
      form_id: params.formId,
      field_type: body.field_type || 'short_text',
      label: body.label || 'New Question',
      placeholder: body.placeholder || '',
      required: body.required || false,
      options: body.options || null,
      position: nextPosition,
      settings: body.settings || {}
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ field })
}
