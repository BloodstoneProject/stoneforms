import { createClient } from '@/lib/supabase-client'
import { NextResponse } from 'next/server'

// PATCH /api/forms/[formId]/fields/[fieldId] - Update field
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; fieldId: string } }
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
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!form) {
    return NextResponse.json({ error: 'Form not found' }, { status: 404 })
  }

  const body = await request.json()

  const { data: field, error } = await supabase
    .from('form_fields')
    .update(body)
    .eq('id', params.fieldId)
    .eq('form_id', params.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ field })
}

// DELETE /api/forms/[formId]/fields/[fieldId] - Delete field
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; fieldId: string } }
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
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!form) {
    return NextResponse.json({ error: 'Form not found' }, { status: 404 })
  }

  const { error } = await supabase
    .from('form_fields')
    .delete()
    .eq('id', params.fieldId)
    .eq('form_id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
