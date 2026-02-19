'use client'

import { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'

interface FieldOptionsEditorProps {
  options: string[]
  onChange: (options: string[]) => void
  fieldType: 'multiple_choice' | 'checkboxes' | 'dropdown'
}

export default function FieldOptionsEditor({ options, onChange, fieldType }: FieldOptionsEditorProps) {
  const [newOption, setNewOption] = useState('')

  const addOption = () => {
    if (!newOption.trim()) return
    onChange([...options, newOption.trim()])
    setNewOption('')
  }

  const updateOption = (index: number, value: string) => {
    const updated = [...options]
    updated[index] = value
    onChange(updated)
  }

  const deleteOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index))
  }

  const moveOption = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= options.length) return

    const updated = [...options]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp
    onChange(updated)
  }

  const getFieldTypeLabel = () => {
    switch (fieldType) {
      case 'multiple_choice': return 'Options (Radio Buttons)'
      case 'checkboxes': return 'Options (Checkboxes)'
      case 'dropdown': return 'Options (Dropdown)'
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-stone-900">
        {getFieldTypeLabel()}
      </label>

      {/* Existing Options */}
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2 group">
            <button
              type="button"
              className="cursor-move text-stone-400 hover:text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <GripVertical className="w-4 h-4" />
            </button>

            {/* Preview Icon */}
            <div className="flex items-center justify-center w-8 h-8">
              {fieldType === 'multiple_choice' && (
                <div className="w-4 h-4 rounded-full border-2 border-stone-400" />
              )}
              {fieldType === 'checkboxes' && (
                <div className="w-4 h-4 rounded border-2 border-stone-400" />
              )}
              {fieldType === 'dropdown' && (
                <span className="text-stone-400 text-sm">{index + 1}.</span>
              )}
            </div>

            <input
              type="text"
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-900"
              placeholder={`Option ${index + 1}`}
            />

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => moveOption(index, 'up')}
                disabled={index === 0}
                className="p-2 text-stone-600 hover:text-stone-900 disabled:opacity-30"
                title="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveOption(index, 'down')}
                disabled={index === options.length - 1}
                className="p-2 text-stone-600 hover:text-stone-900 disabled:opacity-30"
                title="Move down"
              >
                ↓
              </button>
            </div>

            <button
              type="button"
              onClick={() => deleteOption(index)}
              className="p-2 text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add New Option */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addOption()}
          placeholder="Add new option..."
          className="flex-1 px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-900"
        />
        <button
          type="button"
          onClick={addOption}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded hover:bg-stone-800"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Quick Add Common Options */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-stone-600">Quick add:</span>
        {['Yes', 'No', 'Maybe', 'Not sure', 'N/A', 'Other'].map((quick) => (
          <button
            key={quick}
            type="button"
            onClick={() => {
              if (!options.includes(quick)) {
                onChange([...options, quick])
              }
            }}
            className="text-xs px-2 py-1 border border-stone-300 rounded hover:bg-stone-50"
          >
            + {quick}
          </button>
        ))}
      </div>

      <p className="text-xs text-stone-600">
        💡 Tip: Drag options to reorder, or use arrow buttons
      </p>
    </div>
  )
}
