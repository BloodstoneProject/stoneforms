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
          <Settings className="w-5 h-5 text-muted-foreground" />
          <h3 className="heading-tight text-foreground">
            Properties
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
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
          <Settings className="w-5 h-5 text-muted-foreground" />
          <h3 className="heading-tight text-foreground">
            Question Settings
          </h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Configure how this question appears and behaves
        </p>
      </div>

      {/* Question Label */}
      <div className="space-y-2">
        <Label className="text-foreground">Question Text</Label>
        <Input
          value={question.label}
          onChange={(e) => onUpdateQuestion(question.id, { label: e.target.value })}
          placeholder="Enter your question..."
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label className="text-foreground">Description (optional)</Label>
        <textarea
          value={question.description || ''}
          onChange={(e) => onUpdateQuestion(question.id, { description: e.target.value })}
          placeholder="Add helpful context or instructions..."
          rows={3}
          className="w-full rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground p-3 text-sm focus:outline-none focus:border-foreground"
        />
      </div>

      {/* Placeholder */}
      {['short_text', 'long_text', 'email', 'number'].includes(question.type) && (
        <div className="space-y-2">
          <Label className="text-foreground">Placeholder Text</Label>
          <Input
            value={question.placeholder || ''}
            onChange={(e) => onUpdateQuestion(question.id, { placeholder: e.target.value })}
            placeholder="e.g., Enter your answer here..."
          />
        </div>
      )}

      {/* Required Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
        <div className="flex-1">
          <Label className="text-sm font-medium text-foreground">
            Required
          </Label>
          <p className="text-xs mt-1 text-muted-foreground">
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
        <div className="space-y-4 p-4 rounded-lg border border-border">
          <h4 className="text-sm font-medium text-foreground">
            Number Validation
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Minimum</Label>
              <Input
                type="number"
                placeholder="Min"
                value={question.validation?.min || ''}
                onChange={(e) => onUpdateQuestion(question.id, {
                  validation: { ...question.validation, min: Number(e.target.value) }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Maximum</Label>
              <Input
                type="number"
                placeholder="Max"
                value={question.validation?.max || ''}
                onChange={(e) => onUpdateQuestion(question.id, {
                  validation: { ...question.validation, max: Number(e.target.value) }
                })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Validation for Text Type */}
      {['short_text', 'long_text'].includes(question.type) && (
        <div className="space-y-4 p-4 rounded-lg border border-border">
          <h4 className="text-sm font-medium text-foreground">
            Text Validation
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Min Length</Label>
              <Input
                type="number"
                placeholder="0"
                value={question.validation?.min || ''}
                onChange={(e) => onUpdateQuestion(question.id, {
                  validation: { ...question.validation, min: Number(e.target.value) }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Max Length</Label>
              <Input
                type="number"
                placeholder="∞"
                value={question.validation?.max || ''}
                onChange={(e) => onUpdateQuestion(question.id, {
                  validation: { ...question.validation, max: Number(e.target.value) }
                })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Logic (Coming Soon) */}
      <div className="p-4 rounded-lg border-2 border-dashed border-border">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
          <div>
            <h4 className="text-sm font-medium mb-1 text-foreground">
              Conditional Logic
            </h4>
            <p className="text-xs mb-3 text-muted-foreground">
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
      <div className="pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-destructive border-border hover:bg-secondary"
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
