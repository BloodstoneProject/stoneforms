import { createClient } from '@/lib/supabase-client'
import { NextResponse } from 'next/server'

// DELETE /api/forms/[id]/responses/[responseId] - Delete single response
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; responseId: string } }
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
    .from('submissions')
    .delete()
    .eq('id', params.responseId)
    .eq('form_id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
