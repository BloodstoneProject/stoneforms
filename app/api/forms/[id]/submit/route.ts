import { createClient } from '@/lib/supabase-client'
import { NextResponse } from 'next/server'
import { checkCanAcceptResponse } from '@/lib/plan-enforcement'

// POST /api/forms/[id]/submit - Submit form response
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  
  try {
    const body = await request.json()
    const { responses } = body

    // Get form to verify it exists and is published
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('id, status')
      .eq('id', params.id)
      .single()

    if (formError || !form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    if (form.status !== 'published') {
      return NextResponse.json({ error: 'Form is not published' }, { status: 400 })
    }

    // Check plan limits BEFORE accepting response
    const limitCheck = await checkCanAcceptResponse(params.id)
    
    if (!limitCheck.allowed) {
      return NextResponse.json({ 
        error: 'This form has reached its response limit for this month. Please contact the form owner.',
        plan: limitCheck.plan,
        limit: limitCheck.limit
      }, { status: 403 })
    }

    // Get form fields to validate
    const { data: fields } = await supabase
      .from('form_fields')
      .select('*')
      .eq('form_id', params.id)

    // Validate required fields
    const requiredFields = fields?.filter(f => f.required) || []
    for (const field of requiredFields) {
      if (!responses[field.id] || responses[field.id].trim() === '') {
        return NextResponse.json({ 
          error: `${field.label} is required` 
        }, { status: 400 })
      }
    }

    // Create submission
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .insert({
        form_id: params.id,
        response_data: responses,
        submitted_at: new Date().toISOString()
      })
      .select()
      .single()

    if (submissionError) {
      console.error('Submission error:', submissionError)
      return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      submission_id: submission.id 
    })
  } catch (error) {
    console.error('Submit error:', error)
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 })
  }
}
