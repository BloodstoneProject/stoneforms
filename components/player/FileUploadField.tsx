'use client'

import { useRef, useState } from 'react'
import { Upload, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'

interface FileUploadFieldProps {
  value?: string
  onChange: (url: string) => void
  theme: {
    primaryColor: string
    textColor: string
  }
  placeholder?: string
}

export function FileUploadField({
  value,
  onChange,
  theme,
  placeholder,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  async function handleFile(file: File) {
    setError(null)
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setError(data?.error || 'Upload failed. Please try again.')
        return
      }

      setFileName(data.name || file.name)
      onChange(data.url)
    } catch {
      setError('Upload failed. Please check your connection and try again.')
    } finally {
      setUploading(false)
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // Reset so selecting the same file again re-triggers change.
    e.target.value = ''
  }

  const hasUploaded = Boolean(value) && !uploading

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        onChange={onInputChange}
        className="hidden"
        disabled={uploading}
      />

      {hasUploaded ? (
        <div
          className="flex flex-col items-center justify-center w-full p-12 border-2 rounded-xl"
          style={{
            borderColor: theme.primaryColor,
            backgroundColor: `${theme.primaryColor}10`,
          }}
        >
          <CheckCircle2
            className="w-12 h-12 mb-4 text-green-500"
          />
          <p
            className="text-lg font-medium break-all text-center"
            style={{ color: theme.textColor }}
          >
            {fileName || 'File uploaded'}
          </p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-3 text-sm font-medium underline-offset-2 hover:underline"
            style={{ color: theme.primaryColor }}
          >
            Replace file
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => !uploading && inputRef.current?.click()}
          disabled={uploading}
          className="flex flex-col items-center justify-center w-full p-12 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition-colors disabled:cursor-wait"
          style={{ borderColor: '#e8e4db' }}
        >
          {uploading ? (
            <>
              <Loader2
                className="w-16 h-16 mb-4 animate-spin"
                style={{ color: theme.primaryColor }}
              />
              <p
                className="text-lg font-medium"
                style={{ color: theme.textColor }}
              >
                Uploading…
              </p>
            </>
          ) : (
            <>
              <Upload
                className="w-16 h-16 mb-4"
                style={{ color: theme.primaryColor }}
              />
              <p
                className="text-lg font-medium"
                style={{ color: theme.textColor }}
              >
                {placeholder || 'Click to upload'}
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: theme.textColor, opacity: 0.6 }}
              >
                Max file size: 10MB
              </p>
            </>
          )}
        </button>
      )}

      {error && (
        <div role="alert" className="flex items-center gap-2 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" aria-hidden="true" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  )
}
