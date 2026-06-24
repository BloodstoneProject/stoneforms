'use client'

export interface MatrixRow {
  id: string
  label: string
}
export interface MatrixColumn {
  id: string
  label: string
}
export interface MatrixSettings {
  rows?: MatrixRow[]
  columns?: MatrixColumn[]
  allowMultiple?: boolean
}

// value = { [rowId]: columnId } (single) or { [rowId]: columnId[] } (allowMultiple).
export type MatrixValue = Record<string, string | string[]>

interface MatrixFieldProps {
  value?: MatrixValue
  onChange: (value: MatrixValue) => void
  settings?: MatrixSettings
  theme: { primaryColor: string; textColor: string }
}

// A labelled grid: rows are statements, columns are choices. Radio inputs per row
// (single select) or checkboxes (allowMultiple). Keyboard + ARIA accessible.
export function MatrixField({ value, onChange, settings, theme }: MatrixFieldProps) {
  const rows = Array.isArray(settings?.rows) ? settings!.rows : []
  const columns = Array.isArray(settings?.columns) ? settings!.columns : []
  const multiple = settings?.allowMultiple === true
  const v = value || {}

  if (rows.length === 0 || columns.length === 0) {
    return (
      <p className="text-sm opacity-60" style={{ color: theme.textColor }}>
        This grid has no rows or columns configured yet.
      </p>
    )
  }

  const isChecked = (rowId: string, colId: string): boolean => {
    const cell = v[rowId]
    if (multiple) return Array.isArray(cell) && cell.includes(colId)
    return cell === colId
  }

  const toggle = (rowId: string, colId: string) => {
    if (multiple) {
      const cur = Array.isArray(v[rowId]) ? (v[rowId] as string[]) : []
      const next = cur.includes(colId) ? cur.filter((c) => c !== colId) : [...cur, colId]
      const out = { ...v }
      if (next.length) out[rowId] = next
      else delete out[rowId]
      onChange(out)
    } else {
      onChange({ ...v, [rowId]: colId })
    }
  }

  return (
    <div
      className="overflow-x-auto"
      role="group"
      aria-label="Selection grid"
    >
      <table className="w-full border-collapse text-left">
        <thead>
          <tr>
            <th className="p-2 align-bottom" />
            {columns.map((col) => (
              <th
                key={col.id}
                scope="col"
                className="p-2 text-sm font-medium text-center"
                style={{ color: theme.textColor }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              role={multiple ? 'group' : 'radiogroup'}
              aria-label={row.label}
              className="border-t"
              style={{ borderColor: `${theme.textColor}1a` }}
            >
              <th
                scope="row"
                className="p-2 text-sm font-medium align-middle"
                style={{ color: theme.textColor }}
              >
                {row.label}
              </th>
              {columns.map((col) => {
                const checked = isChecked(row.id, col.id)
                return (
                  <td key={col.id} className="p-2 text-center align-middle">
                    <input
                      type={multiple ? 'checkbox' : 'radio'}
                      name={`matrix-${row.id}`}
                      checked={checked}
                      onChange={() => toggle(row.id, col.id)}
                      aria-label={`${row.label}: ${col.label}`}
                      className="w-5 h-5 cursor-pointer"
                      style={{ accentColor: theme.primaryColor }}
                    />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
