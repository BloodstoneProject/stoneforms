import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

// GET /api/forms/[formId]/fields - Get all fields for a form
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // First verify user owns this form
  const { data: form } = await supabase
    .from('forms')
    .select('id')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!form) {
    return NextResponse.json({ error: 'Form not found' }, { status: 404 })
  }

  // Get fields
  const { data: fields, error } = await supabase
    .from('form_fields')
    .select('*')
    .eq('form_id', params.id)
    .order('position', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ fields: fields || [] })
}

// POST /api/forms/[formId]/fields - Add new field
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()
  
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

  // Determine insertion position.
  // - When `position` is a valid number, insert AT that index: shift every
  //   existing row at/after it down by one, then place the new row there.
  // - Otherwise (default, backward-compatible) append after the current max.
  let insertPosition: number
  const requestedPosition =
    typeof body.position === 'number' && Number.isFinite(body.position) && body.position >= 0
      ? Math.floor(body.position)
      : null

  if (requestedPosition !== null) {
    // Pull existing rows at/after the requested index and bump them down so the
    // new field can occupy `requestedPosition` without colliding.
    const { data: toShift } = await supabase
      .from('form_fields')
      .select('id, position')
      .eq('form_id', params.id)
      .gte('position', requestedPosition)
      .order('position', { ascending: false })

    if (toShift && toShift.length > 0) {
      for (const row of toShift) {
        await supabase
          .from('form_fields')
          .update({ position: row.position + 1 })
          .eq('id', row.id)
          .eq('form_id', params.id)
      }
    }
    insertPosition = requestedPosition
  } else {
    // Get max position for this form, append after it.
    const { data: maxField } = await supabase
      .from('form_fields')
      .select('position')
      .eq('form_id', params.id)
      .order('position', { ascending: false })
      .limit(1)
      .single()

    insertPosition = maxField ? maxField.position + 1 : 0
  }

  // Create field
  const { data: field, error } = await supabase
    .from('form_fields')
    .insert({
      form_id: params.id,
      field_type: body.field_type || 'short_text',
      label: body.label || 'New Question',
      placeholder: body.placeholder || '',
      required: body.required || false,
      options: body.options || null,
      position: insertPosition,
      settings: body.settings || {}
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ field })
}
