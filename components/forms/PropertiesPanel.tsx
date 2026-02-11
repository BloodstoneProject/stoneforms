'use client'

import { Question } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Settings, AlertCircle } from 'lucide-react'

interface PropertiesPanelProps {
  question?: Question
  onUpdateQuestion: (id: string, updates: Partial<Question>) => void
}

export function PropertiesPanel({ question, onUpdateQuestion }: PropertiesPanelProps) {
  if (!question) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5" style={{ color: '#3d5948' }} />
          <h3 className="font-semibold" style={{ color: '#142c1c' }}>
            Properties
          </h3>
        </div>
        <p className="text-sm" style={{ color: '#3d5948' }}>
          Select a question to view its properties
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-5 h-5" style={{ color: '#3d5948' }} />
          <h3 className="font-semibold" style={{ color: '#142c1c' }}>
            Question Settings
          </h3>
        </div>
        <p className="text-xs" style={{ color: '#3d5948' }}>
          Configure how this question appears and behaves
        </p>
      </div>

      {/* Question Label */}
      <div className="space-y-2">
        <Label style={{ color: '#142c1c' }}>Question Text</Label>
        <Input
          value={question.label}
          onChange={(e) => onUpdateQuestion(question.id, { label: e.target.value })}
          placeholder="Enter your question..."
          style={{ borderColor: '#e8e4db' }}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label style={{ color: '#142c1c' }}>Description (optional)</Label>
        <textarea
          value={question.description || ''}
          onChange={(e) => onUpdateQuestion(question.id, { description: e.target.value })}
          placeholder="Add helpful context or instructions..."
          rows={3}
          className="w-full rounded-md border p-3 text-sm"
          style={{ borderColor: '#e8e4db' }}
        />
      </div>

      {/* Placeholder */}
      {['short_text', 'long_text', 'email', 'number'].includes(question.type) && (
        <div className="space-y-2">
          <Label style={{ color: '#142c1c' }}>Placeholder Text</Label>
          <Input
            value={question.placeholder || ''}
            onChange={(e) => onUpdateQuestion(question.id, { placeholder: e.target.value })}
            placeholder="e.g., Enter your answer here..."
            style={{ borderColor: '#e8e4db' }}
          />
        </div>
      )}

      {/* Required Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#f4f2ed' }}>
        <div className="flex-1">
          <Label className="text-sm font-medium" style={{ color: '#142c1c' }}>
            Required
          </Label>
          <p className="text-xs mt-1" style={{ color: '#3d5948' }}>
            Respondents must answer this question
          </p>
        </div>
        <Switch
          checked={question.required}
          onCheckedChange={(checked) => onUpdateQuestion(question.id, { required: checked })}
        />
      </div>

      {/* Validation for Number Type */}
      {question.type === 'number' && (
        <div className="space-y-4 p-4 rounded-lg border" style={{ borderColor: '#e8e4db' }}>
          <h4 className="text-sm font-medium" style={{ color: '#142c1c' }}>
            Number Validation
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs" style={{ color: '#3d5948' }}>Minimum</Label>
              <Input
                type="number"
                placeholder="Min"
                value={question.validation?.min || ''}
                onChange={(e) => onUpdateQuestion(question.id, {
                  validation: { ...question.validation, min: Number(e.target.value) }
                })}
                style={{ borderColor: '#e8e4db' }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs" style={{ color: '#3d5948' }}>Maximum</Label>
              <Input
                type="number"
                placeholder="Max"
                value={question.validation?.max || ''}
                onChange={(e) => onUpdateQuestion(question.id, {
                  validation: { ...question.validation, max: Number(e.target.value) }
                })}
                style={{ borderColor: '#e8e4db' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Validation for Text Type */}
      {['short_text', 'long_text'].includes(question.type) && (
        <div className="space-y-4 p-4 rounded-lg border" style={{ borderColor: '#e8e4db' }}>
          <h4 className="text-sm font-medium" style={{ color: '#142c1c' }}>
            Text Validation
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs" style={{ color: '#3d5948' }}>Min Length</Label>
              <Input
                type="number"
                placeholder="0"
                value={question.validation?.min || ''}
                onChange={(e) => onUpdateQuestion(question.id, {
                  validation: { ...question.validation, min: Number(e.target.value) }
                })}
                style={{ borderColor: '#e8e4db' }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs" style={{ color: '#3d5948' }}>Max Length</Label>
              <Input
                type="number"
                placeholder="∞"
                value={question.validation?.max || ''}
                onChange={(e) => onUpdateQuestion(question.id, {
                  validation: { ...question.validation, max: Number(e.target.value) }
                })}
                style={{ borderColor: '#e8e4db' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Logic (Coming Soon) */}
      <div className="p-4 rounded-lg border-2 border-dashed" style={{ borderColor: '#e8e4db' }}>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#3d5948' }} />
          <div>
            <h4 className="text-sm font-medium mb-1" style={{ color: '#142c1c' }}>
              Conditional Logic
            </h4>
            <p className="text-xs mb-3" style={{ color: '#3d5948' }}>
              Show or hide questions based on answers
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              disabled
              className="text-xs"
            >
              Add Logic Rule (Coming Soon)
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Question */}
      <div className="pt-4 border-t" style={{ borderColor: '#e8e4db' }}>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-red-600 border-red-200 hover:bg-red-50"
          onClick={() => {
            if (confirm('Delete this question?')) {
              // This will be handled by the parent component
              console.log('Delete question:', question.id)
            }
          }}
        >
          Delete Question
        </Button>
      </div>
    </div>
  )
}
