'use client'

import { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'

interface FieldOptionsEditorProps {
  options: string[]
  onChange: (options: string[]) => void
  fieldType: 'multiple_choice' | 'checkboxes' | 'dropdown' | 'picture_choice'
  // Picture-choice image map { [optionLabel]: imageUrl }, persisted in settings.images.
  images?: Record<string, string>
  onImagesChange?: (images: Record<string, string>) => void
  // Per-option quiz scoring map { [optionLabel]: points }. When provided the
  // editor shows a points input per option. Persisted in settings.scoring.
  scoring?: Record<string, number>
  onScoringChange?: (scoring: Record<string, number>) => void
}

export default function FieldOptionsEditor({
  options, onChange, fieldType, images, onImagesChange, scoring, onScoringChange,
}: FieldOptionsEditorProps) {
  const [newOption, setNewOption] = useState('')
  const isPicture = fieldType === 'picture_choice'
  const showScoring = !!onScoringChange

  // Rename a key inside a label-keyed map (images / scoring) when an option label changes.
  const renameKey = <T,>(map: Record<string, T> | undefined, from: string, to: string): Record<string, T> => {
    const next: Record<string, T> = { ...(map || {}) }
    if (from in next) {
      const val = next[from]
      delete next[from]
      if (to) next[to] = val
    }
    return next
  }

  const addOption = () => {
    if (!newOption.trim()) return
    onChange([...options, newOption.trim()])
    setNewOption('')
  }

  const updateOption = (index: number, value: string) => {
    const prev = options[index]
    const updated = [...options]
    updated[index] = value
    onChange(updated)
    // Keep image/scoring maps keyed by the (new) label.
    if (onImagesChange && prev !== value) onImagesChange(renameKey(images, prev, value))
    if (onScoringChange && prev !== value) onScoringChange(renameKey(scoring, prev, value) as Record<string, number>)
  }

  const setImage = (label: string, url: string) => {
    if (!onImagesChange) return
    const next = { ...(images || {}) }
    if (url) next[label] = url
    else delete next[label]
    onImagesChange(next)
  }

  const setScore = (label: string, raw: string) => {
    if (!onScoringChange) return
    const next = { ...(scoring || {}) }
    if (raw === '') delete next[label]
    else next[label] = Number(raw)
    onScoringChange(next)
  }

  const deleteOption = (index: number) => {
    const label = options[index]
    onChange(options.filter((_, i) => i !== index))
    if (onImagesChange && label in (images || {})) {
      const next = { ...(images || {}) }; delete next[label]; onImagesChange(next)
    }
    if (onScoringChange && label in (scoring || {})) {
      const next = { ...(scoring || {}) }; delete next[label]; onScoringChange(next)
    }
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
      case 'picture_choice': return 'Options (Picture Choice)'
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
          <div key={index} className="space-y-1.5 group">
            <div className="flex items-center gap-2">
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
                {fieldType === 'picture_choice' && (
                  <span className="text-stone-400 text-sm">🖼️</span>
                )}
              </div>

              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                placeholder={`Option ${index + 1}`}
              />

              {showScoring && (
                <input
                  type="number"
                  value={scoring?.[option] ?? ''}
                  onChange={(e) => setScore(option, e.target.value)}
                  className="w-20 px-2 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-900 text-sm"
                  placeholder="pts"
                  title="Points awarded when this option is chosen"
                />
              )}

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

            {/* Picture-choice image URL */}
            {isPicture && (
              <div className="flex items-center gap-2 pl-10">
                <input
                  type="url"
                  value={images?.[option] || ''}
                  onChange={(e) => setImage(option, e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-stone-200 rounded text-sm focus:outline-none focus:border-stone-900"
                  placeholder="Image URL (https://…)"
                />
                {images?.[option] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={images[option]} alt={option} className="w-9 h-9 object-cover rounded border border-stone-200" />
                )}
              </div>
            )}
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
