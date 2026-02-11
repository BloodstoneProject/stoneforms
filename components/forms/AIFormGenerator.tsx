'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Sparkles,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Wand2
} from 'lucide-react'

interface AIFormGeneratorProps {
  onFormGenerated: (questions: any[]) => void
}

export function AIFormGenerator({ onFormGenerated }: AIFormGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [description, setDescription] = useState('')
  const [formType, setFormType] = useState<'form' | 'quiz' | 'survey'>('form')
  const [questionCount, setQuestionCount] = useState(5)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([])

  const handleGenerate = async () => {
    setIsGenerating(true)
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock generated questions based on description
    const mockQuestions = generateMockQuestions(description, formType, questionCount)
    
    setGeneratedQuestions(mockQuestions)
    setIsGenerating(false)
  }

  const handleUseQuestions = () => {
    onFormGenerated(generatedQuestions)
    setIsOpen(false)
    setDescription('')
    setGeneratedQuestions([])
  }

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="gap-2 text-white"
        style={{ backgroundColor: '#770a19' }}
      >
        <Sparkles className="w-4 h-4" />
        AI Generate Form
      </Button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto" style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2" style={{ color: '#142c1c' }}>
                  <Wand2 className="w-6 h-6" style={{ color: '#770a19' }} />
                  AI Form Generator
                </CardTitle>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm" style={{ color: '#3d5948' }}>
                Describe what you want, and AI will create the perfect form for you
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {!generatedQuestions.length ? (
                <>
                  {/* Input Form */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>What do you want to create?</Label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="E.g., A customer satisfaction survey for a SaaS product, or an employee onboarding quiz..."
                        rows={4}
                        className="w-full rounded-md border p-3"
                        style={{ borderColor: '#e8e4db' }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Form Type</Label>
                        <select
                          value={formType}
                          onChange={(e) => setFormType(e.target.value as any)}
                          className="w-full rounded-md border p-3"
                          style={{ borderColor: '#e8e4db' }}
                        >
                          <option value="form">Standard Form</option>
                          <option value="quiz">Quiz (with scoring)</option>
                          <option value="survey">Survey (with analytics)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label>Number of Questions</Label>
                        <Input
                          type="number"
                          min="3"
                          max="20"
                          value={questionCount}
                          onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Examples */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium" style={{ color: '#142c1c' }}>
                      Try these examples:
                    </p>
                    <div className="grid gap-2">
                      {[
                        'Customer feedback survey for an e-commerce store',
                        'Product knowledge quiz for sales training',
                        'Event registration form with payment',
                        'Lead qualification questionnaire',
                        'Employee satisfaction survey',
                      ].map((example) => (
                        <button
                          key={example}
                          onClick={() => setDescription(example)}
                          className="text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors text-sm"
                          style={{ borderColor: '#e8e4db', color: '#3d5948' }}
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerate}
                    disabled={!description || isGenerating}
                    className="w-full text-white"
                    style={{ backgroundColor: '#142c1c' }}
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating with AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Form
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  {/* Generated Questions Preview */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-4 rounded-lg" style={{ backgroundColor: '#e8f5e9' }}>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <p className="text-sm text-green-800">
                        Generated {generatedQuestions.length} questions based on your description
                      </p>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {generatedQuestions.map((question, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg border"
                          style={{ borderColor: '#e8e4db' }}
                        >
                          <div className="flex items-start gap-3">
                            <span 
                              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                              style={{ backgroundColor: '#142c1c' }}
                            >
                              {index + 1}
                            </span>
                            <div className="flex-1">
                              <p className="font-medium mb-1" style={{ color: '#142c1c' }}>
                                {question.label}
                              </p>
                              <p className="text-sm" style={{ color: '#3d5948' }}>
                                Type: {question.type.replace('_', ' ')}
                                {question.required && ' • Required'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setGeneratedQuestions([])}
                      className="flex-1"
                    >
                      Regenerate
                    </Button>
                    <Button
                      onClick={handleUseQuestions}
                      className="flex-1 text-white gap-2"
                      style={{ backgroundColor: '#142c1c' }}
                    >
                      Use These Questions
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

// Mock AI generation function
function generateMockQuestions(description: string, type: 'form' | 'quiz' | 'survey', count: number) {
  const questions: any[] = []
  
  // Generate questions based on keywords in description
  const isCustomer = description.toLowerCase().includes('customer')
  const isEmployee = description.toLowerCase().includes('employee')
  const isProduct = description.toLowerCase().includes('product')
  const isEvent = description.toLowerCase().includes('event')
  
  if (isCustomer) {
    questions.push(
      { id: '1', type: 'short_text', label: 'What is your name?', required: true, order: 0 },
      { id: '2', type: 'email', label: 'What is your email address?', required: true, order: 1 },
      { id: '3', type: 'rating', label: 'How would you rate your overall experience?', required: true, order: 2 },
      { id: '4', type: 'multiple_choice', label: 'How did you hear about us?', required: false, order: 3, choices: [
        { id: '1', label: 'Social Media', value: 'social' },
        { id: '2', label: 'Search Engine', value: 'search' },
        { id: '3', label: 'Friend', value: 'referral' },
      ]},
      { id: '5', type: 'long_text', label: 'What could we improve?', required: false, order: 4 },
    )
  } else if (isEmployee) {
    questions.push(
      { id: '1', type: 'short_text', label: 'Employee Name', required: true, order: 0 },
      { id: '2', type: 'email', label: 'Work Email', required: true, order: 1 },
      { id: '3', type: 'multiple_choice', label: 'Department', required: true, order: 2, choices: [
        { id: '1', label: 'Sales', value: 'sales' },
        { id: '2', label: 'Marketing', value: 'marketing' },
        { id: '3', label: 'Engineering', value: 'engineering' },
      ]},
      { id: '4', type: 'rating', label: 'How satisfied are you with your role?', required: true, order: 3 },
      { id: '5', type: 'yes_no', label: 'Would you recommend working here?', required: true, order: 4 },
    )
  } else if (isProduct) {
    questions.push(
      { id: '1', type: 'multiple_choice', label: 'Which product are you interested in?', required: true, order: 0, choices: [
        { id: '1', label: 'Starter Plan', value: 'starter' },
        { id: '2', label: 'Professional', value: 'pro' },
        { id: '3', label: 'Enterprise', value: 'enterprise' },
      ]},
      { id: '2', type: 'short_text', label: 'Company Name', required: true, order: 1 },
      { id: '3', type: 'number', label: 'Team Size', required: true, order: 2 },
      { id: '4', type: 'long_text', label: 'What are your main use cases?', required: false, order: 3 },
      { id: '5', type: 'email', label: 'Email for Demo', required: true, order: 4 },
    )
  } else {
    // Generic form
    questions.push(
      { id: '1', type: 'short_text', label: 'Full Name', required: true, order: 0 },
      { id: '2', type: 'email', label: 'Email Address', required: true, order: 1 },
      { id: '3', type: 'multiple_choice', label: 'How can we help you?', required: true, order: 2, choices: [
        { id: '1', label: 'General Inquiry', value: 'general' },
        { id: '2', label: 'Support', value: 'support' },
        { id: '3', label: 'Sales', value: 'sales' },
      ]},
      { id: '4', type: 'long_text', label: 'Message', required: true, order: 3 },
      { id: '5', type: 'yes_no', label: 'Can we contact you about this?', required: false, order: 4 },
    )
  }
  
  return questions.slice(0, count)
}
