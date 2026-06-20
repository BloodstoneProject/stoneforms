import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

// GET /api/public/forms/[id]
// Public, unauthenticated read of a PUBLISHED form and its fields.
// Relies on RLS policies ("Public can view published forms" / "...fields of
// published forms"), so anonymous respondents can load the form to fill it in.
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()

  const { data: form, error: formError } = await supabase
    .from('forms')
    .select('id, title, description, theme, settings, status')
    .eq('id', params.id)
    .eq('status', 'published')
    .single()

  if (formError || !form) {
    return NextResponse.json({ error: 'Form not available' }, { status: 404 })
  }

  const { data: fields } = await supabase
    .from('form_fields')
    .select('id, field_type, label, placeholder, required, options, position, settings')
    .eq('form_id', params.id)
    .order('position', { ascending: true })

  return NextResponse.json({ form, fields: fields || [] })
}
