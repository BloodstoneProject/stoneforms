'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

interface SignatureFieldProps {
  value?: string
  onChange: (value: string) => void
  theme: { primaryColor: string; textColor: string }
}

// Native <canvas> signature pad. Value is a PNG data URL string.
export function SignatureField({ value, onChange, theme }: SignatureFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const drawing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)
  const [hasInk, setHasInk] = useState(!!value)

  // Size the backing store to the displayed size (accounting for DPR) once mounted.
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ratio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    const rect = canvas.getBoundingClientRect()
    // Preserve any existing drawing across a resize by snapshotting.
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = Math.max(1, Math.round(rect.width * ratio))
    canvas.height = Math.max(1, Math.round(rect.height * ratio))
    ctx.scale(ratio, ratio)
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = theme.textColor || '#142c1c'
  }, [theme.textColor])

  useEffect(() => {
    setupCanvas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pointFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handleDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.setPointerCapture(e.pointerId)
    drawing.current = true
    last.current = pointFromEvent(e)
  }

  const handleMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || !last.current) return
    const p = pointFromEvent(e)
    ctx.beginPath()
    ctx.moveTo(last.current.x, last.current.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    last.current = p
    if (!hasInk) setHasInk(true)
  }

  const commit = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    onChange(canvas.toDataURL('image/png'))
  }

  const handleUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return
    drawing.current = false
    last.current = null
    try { canvasRef.current?.releasePointerCapture(e.pointerId) } catch {}
    commit()
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasInk(false)
    onChange('')
  }

  return (
    <div className="space-y-3">
      <div
        className="relative rounded-xl border-2 overflow-hidden"
        style={{ borderColor: `${theme.textColor}22`, backgroundColor: '#ffffff' }}
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Signature pad. Draw your signature here."
          className="w-full block touch-none"
          style={{ height: 200, cursor: 'crosshair' }}
          onPointerDown={handleDown}
          onPointerMove={handleMove}
          onPointerUp={handleUp}
          onPointerLeave={handleUp}
          onPointerCancel={handleUp}
        />
        {!hasInk && (
          <span
            className="absolute inset-0 flex items-center justify-center pointer-events-none text-base opacity-40"
            style={{ color: theme.textColor }}
          >
            Sign here
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={clear}
        className="text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors hover:opacity-80"
        style={{ borderColor: `${theme.textColor}33`, color: theme.textColor }}
      >
        Clear
      </button>
    </div>
  )
}
