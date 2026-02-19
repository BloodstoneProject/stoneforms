'use client'

import { useState, useCallback } from 'react'
import { Upload, X, File, Image as ImageIcon, FileText, Loader } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase-client'
import { formatFileSize, isImageFile, validateFileSize, generateFileStoragePath } from '@/lib/file-utils'

interface FileUploadFieldProps {
  fieldId: string
  formId: string
  submissionId: string
  required: boolean
  maxFiles?: number
  maxSizeBytes?: number
  allowedTypes?: string[]
  onChange: (files: UploadedFile[]) => void
  value?: UploadedFile[]
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  url: string
  path: string
}

export default function FileUploadField({
  fieldId,
  formId,
  submissionId,
  required,
  maxFiles = 5,
  maxSizeBytes = 10 * 1024 * 1024, // 10 MB default
  allowedTypes = ['*'],
  onChange,
  value = []
}: FileUploadFieldProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')

  const supabase = createClient()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError('')
    
    // Check max files
    if (value.length + acceptedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      return
    }

    setUploading(true)
    const uploadedFiles: UploadedFile[] = []

    try {
      for (const file of acceptedFiles) {
        // Validate file size
        if (!validateFileSize(file, maxSizeBytes)) {
          setError(`${file.name} exceeds maximum size of ${formatFileSize(maxSizeBytes)}`)
          continue
        }

        // Generate storage path
        const storagePath = generateFileStoragePath(formId, submissionId, fieldId, file.name)

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from('form-files')
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          setError(`Failed to upload ${file.name}`)
          continue
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('form-files')
          .getPublicUrl(storagePath)

        uploadedFiles.push({
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          url: publicUrl,
          path: storagePath
        })

        // Update progress
        setUploadProgress((uploadedFiles.length / acceptedFiles.length) * 100)
      }

      // Update parent with all files
      onChange([...value, ...uploadedFiles])
    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload files')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [value, maxFiles, maxSizeBytes, formId, submissionId, fieldId, onChange, supabase])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    disabled: uploading || value.length >= maxFiles
  })

  const removeFile = async (file: UploadedFile) => {
    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from('form-files')
      .remove([file.path])

    if (deleteError) {
      console.error('Delete error:', deleteError)
    }

    // Update parent
    onChange(value.filter(f => f.id !== file.id))
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {value.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-stone-900 bg-stone-50' 
              : 'border-stone-300 hover:border-stone-400'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          
          <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-stone-900' : 'text-stone-400'}`} />
          
          {uploading ? (
            <div>
              <Loader className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-stone-600">Uploading... {Math.round(uploadProgress)}%</p>
            </div>
          ) : (
            <div>
              <p className="text-stone-900 font-medium mb-1">
                {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
              </p>
              <p className="text-sm text-stone-600">or click to browse</p>
              <p className="text-xs text-stone-500 mt-2">
                Maximum {maxFiles} files · {formatFileSize(maxSizeBytes)} per file
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Uploaded Files */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg group"
            >
              {/* File Icon */}
              <div className="flex-shrink-0">
                {isImageFile(file.name) ? (
                  <div className="w-12 h-12 rounded overflow-hidden bg-stone-200">
                    <img 
                      src={file.url} 
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded bg-stone-200 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-stone-600" />
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-stone-600">
                  {formatFileSize(file.size)}
                </p>
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeFile(file)}
                className="flex-shrink-0 p-2 text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Required Indicator */}
      {required && value.length === 0 && (
        <p className="text-xs text-red-600">* At least one file is required</p>
      )}
    </div>
  )
}
