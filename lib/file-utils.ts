// File upload utilities

export const FILE_SIZE_LIMITS = {
  free: 10 * 1024 * 1024, // 10 MB
  pro: 1024 * 1024 * 1024, // 1 GB
  business: 10 * 1024 * 1024 * 1024, // 10 GB
}

export const ALLOWED_FILE_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
  ],
  all: ['*'],
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

export function isImageFile(filename: string): boolean {
  const ext = getFileExtension(filename).toLowerCase()
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)
}

export function validateFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  if (allowedTypes.includes('*')) return true
  return allowedTypes.includes(file.type)
}

export function generateFileStoragePath(
  formId: string,
  submissionId: string,
  fieldId: string,
  filename: string
): string {
  const timestamp = Date.now()
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
  return `${formId}/${submissionId}/${fieldId}/${timestamp}_${sanitizedFilename}`
}
