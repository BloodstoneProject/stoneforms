import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { checkCanCreateForm } from '@/lib/plan-enforcement'

// POST /api/forms/[id]/duplicate - Copy a form and all its fields (as a draft).
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Source form must belong to the user.
  const { data: source } = await supabase
    .from('forms')
    .select('title, description, theme, settings, logic')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!source) {
    return NextResponse.json({ error: 'Form not found' }, { status: 404 })
  }

  const limitCheck = await checkCanCreateForm(user.id)
  if (!limitCheck.allowed) {
    return NextResponse.json({ error: limitCheck.message, upgrade: true }, { status: 403 })
  }

  const { data: form, error } = await supabase
    .from('forms')
    .insert({
      user_id: user.id,
      title: `${source.title} (copy)`,
      description: source.description,
      theme: source.theme,
      settings: source.settings,
      logic: source.logic,
      status: 'draft',
    })
    .select()
    .single()

  if (error || !form) {
    return NextResponse.json({ error: error?.message || 'Failed to duplicate' }, { status: 500 })
  }

  // Copy fields preserving order.
  const { data: fields } = await supabase
    .from('form_fields')
    .select('field_type, label, placeholder, required, options, position, settings')
    .eq('form_id', params.id)
    .order('position', { ascending: true })

  if (fields && fields.length > 0) {
    const rows = fields.map((f) => ({ ...f, form_id: form.id }))
    const { error: fieldsError } = await supabase.from('form_fields').insert(rows)
    if (fieldsError) {
      await supabase.from('forms').delete().eq('id', form.id).eq('user_id', user.id)
      return NextResponse.json({ error: fieldsError.message }, { status: 500 })
    }
  }

  return NextResponse.json({ form })
}
