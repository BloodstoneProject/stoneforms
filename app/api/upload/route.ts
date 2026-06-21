import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export const runtime = 'nodejs'

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

// Allowlist of MIME types we accept. Covers images, PDFs, office docs,
// and plain data files. Anything else (executables, scripts, html) is rejected.
const ALLOWED_TYPES = new Set([
  // images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/heic',
  'image/heif',
  'image/bmp',
  'image/tiff',
  // documents
  'application/pdf',
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-powerpoint', // .ppt
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  // text / data
  'text/plain',
  'text/csv',
  'application/csv',
])

// File extensions we explicitly block regardless of reported MIME type.
const BLOCKED_EXTENSIONS = new Set([
  'exe',
  'sh',
  'bat',
  'cmd',
  'com',
  'js',
  'mjs',
  'cjs',
  'jsx',
  'ts',
  'tsx',
  'html',
  'htm',
  'svg', // svg can carry scripts; keep behind extension block even though mime is allowed
  'php',
  'py',
  'rb',
  'pl',
  'jar',
  'app',
  'msi',
  'dll',
  'scr',
  'vbs',
  'ps1',
])

function getExtension(name: string): string {
  const dot = name.lastIndexOf('.')
  if (dot === -1) return ''
  return name.slice(dot + 1).toLowerCase()
}

// Strip anything that isn't a safe filename character. Collapse runs and trim.
function sanitizeName(name: string): string {
  const cleaned = name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^[._-]+/, '')
  return cleaned.slice(0, 120) || 'file'
}

export async function POST(request: Request) {
  try {
    const limit = rateLimit('upload:' + getClientIp(request), 20, 60000)
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many uploads. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      )
    }

    let formData: FormData
    try {
      formData = await request.formData()
    } catch {
      return NextResponse.json(
        { error: 'Invalid form data.' },
        { status: 400 }
      )
    }

    const file = formData.get('file')
    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { error: 'No file provided.' },
        { status: 400 }
      )
    }

    const blob = file as File

    if (blob.size === 0) {
      return NextResponse.json(
        { error: 'File is empty.' },
        { status: 400 }
      )
    }

    if (blob.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 413 }
      )
    }

    const originalName = blob.name || 'file'
    const ext = getExtension(originalName)

    if (BLOCKED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: 'This file type is not allowed.' },
        { status: 415 }
      )
    }

    const contentType = blob.type || 'application/octet-stream'
    // Accept if the MIME type is on the allowlist, OR the extension is a known-safe
    // one even when the browser reports a generic octet-stream type.
    const safeExtensions = new Set([
      'jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif', 'bmp', 'tif', 'tiff',
      'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv',
    ])
    if (!ALLOWED_TYPES.has(contentType) && !safeExtensions.has(ext)) {
      return NextResponse.json(
        { error: 'This file type is not allowed.' },
        { status: 415 }
      )
    }

    const safeName = sanitizeName(originalName)
    const path = `${crypto.randomUUID()}-${safeName}`

    const fileBuffer = Buffer.from(await blob.arrayBuffer())

    const admin = createAdminClient()
    const { error: uploadError } = await admin.storage
      .from('form-uploads')
      .upload(path, fileBuffer, {
        contentType,
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json(
        { error: 'Upload failed. Please try again.' },
        { status: 500 }
      )
    }

    const { data } = admin.storage.from('form-uploads').getPublicUrl(path)

    return NextResponse.json({
      url: data.publicUrl,
      name: originalName,
      size: blob.size,
    })
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong during upload.' },
      { status: 500 }
    )
  }
}
