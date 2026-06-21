import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { checkCanCreateForm } from '@/lib/plan-enforcement'
import { getTemplate } from '@/lib/form-templates'

// POST /api/forms/from-template  { templateId }
// Creates a draft form pre-populated with the template's fields.
export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const template = getTemplate(String(body.templateId || ''))
  if (!template) {
    return NextResponse.json({ error: 'Unknown template' }, { status: 400 })
  }

  const limitCheck = await checkCanCreateForm(user.id)
  if (!limitCheck.allowed) {
    return NextResponse.json({ error: limitCheck.message, upgrade: true }, { status: 403 })
  }

  // Create the form.
  const { data: form, error: formError } = await supabase
    .from('forms')
    .insert({
      user_id: user.id,
      title: template.name,
      description: template.description,
      status: 'draft',
      // Forward the template's quiz config so scored-quiz templates work out of the box.
      settings: template.quiz ? { quiz: template.quiz } : {},
    })
    .select()
    .single()

  if (formError || !form) {
    return NextResponse.json({ error: formError?.message || 'Failed to create form' }, { status: 500 })
  }

  // Create the fields in order.
  const rows = template.fields.map((f, index) => ({
    form_id: form.id,
    field_type: f.field_type,
    label: f.label,
    placeholder: f.placeholder || '',
    required: !!f.required,
    options: f.options || null,
    position: index,
    // Forward per-field scoring so quiz templates tally points correctly.
    settings: f.scoring ? { scoring: f.scoring } : {},
  }))

  const { error: fieldsError } = await supabase.from('form_fields').insert(rows)
  if (fieldsError) {
    // Roll back the form so we don't leave an empty shell.
    await supabase.from('forms').delete().eq('id', form.id).eq('user_id', user.id)
    return NextResponse.json({ error: fieldsError.message }, { status: 500 })
  }

  return NextResponse.json({ form })
}
