'use client'

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useCallback,
} from 'react'

// Hand-written canvas confetti / particle system. No physics libs — just a
// single <canvas>, requestAnimationFrame, and a small particle pool. Designed
// for the Stoneforms "form-as-a-game" player: milestone bursts, tiny localized
// pops at a tap point, and an interactive tap-to-pop celebration overlay.
//
// Perf: one canvas, one rAF loop, hard cap on live particles, particles are
// culled when off-screen / faded, and the loop sleeps (cancels rAF) whenever the
// pool empties. Respects prefers-reduced-motion (renders nothing, all fires are
// no-ops) so we never animate for users who opted out.

export interface ConfettiHandle {
  // Fire a burst at a viewport point (clientX/clientY). Omit point for centre.
  fire: (opts?: { x?: number; y?: number; count?: number; power?: number; colors?: string[] }) => void
  // A small, tasteful localized pop — used on reaction tap + button advance.
  pop: (x: number, y: number, colors?: string[]) => void
  // The big finale (completion / reward screen).
  finale: (colors?: string[]) => void
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  vr: number
  size: number
  color: string
  life: number // 1 -> 0
  decay: number
  shape: 0 | 1 // 0 = rect, 1 = circle
  wobble: number
  wobbleSpeed: number
  gravity: number
}

interface ConfettiProps {
  // When true, the canvas captures pointer events so taps emit a burst
  // (tap-to-pop during a milestone celebration). When false (default) the canvas
  // is pointer-events: none and never intercepts clicks meant for buttons.
  interactive?: boolean
  // Default palette (theme colors). Individual fires can override.
  colors?: string[]
  // z-index for the overlay. Defaults above content but below modals.
  zIndex?: number
}

const DEFAULT_COLORS = ['#2563eb', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899']
const MAX_PARTICLES = 320

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const Confetti = forwardRef<ConfettiHandle, ConfettiProps>(function Confetti(
  { interactive = false, colors, zIndex = 60 },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number | null>(null)
  const dprRef = useRef(1)
  const reducedRef = useRef(false)
  const paletteRef = useRef<string[]>(colors && colors.length ? colors : DEFAULT_COLORS)

  // Keep palette ref in sync without re-running the heavy effect.
  useEffect(() => {
    paletteRef.current = colors && colors.length ? colors : DEFAULT_COLORS
  }, [colors])

  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    dprRef.current = dpr
    canvas.width = Math.floor(window.innerWidth * dpr)
    canvas.height = Math.floor(window.innerHeight * dpr)
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
  }, [])

  const ensureLoop = useCallback(() => {
    if (rafRef.current != null) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = dprRef.current

    let last = performance.now()
    const step = (now: number) => {
      const dt = Math.min((now - last) / 16.6667, 2.5) // frames, clamped
      last = now
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const ps = particlesRef.current
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i]
        p.vy += p.gravity * dt
        p.vx *= 0.99
        p.wobble += p.wobbleSpeed * dt
        p.x += (p.vx + Math.sin(p.wobble) * 0.6) * dt
        p.y += p.vy * dt
        p.rot += p.vr * dt
        p.life -= p.decay * dt
        if (p.life <= 0 || p.y > window.innerHeight + 40) {
          ps.splice(i, 1)
          continue
        }
        const alpha = Math.max(0, Math.min(1, p.life))
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.translate(p.x * dpr, p.y * dpr)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        const s = p.size * dpr
        if (p.shape === 1) {
          ctx.beginPath()
          ctx.arc(0, 0, s / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillRect(-s / 2, -s / 3, s, s * 0.66)
        }
        ctx.restore()
      }
      if (ps.length > 0) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        rafRef.current = null
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
    rafRef.current = requestAnimationFrame(step)
  }, [])

  const spawn = useCallback(
    (
      x: number,
      y: number,
      count: number,
      power: number,
      palette: string[],
      spread = Math.PI * 2,
      baseAngle = -Math.PI / 2
    ) => {
      if (reducedRef.current) return
      const ps = particlesRef.current
      const room = MAX_PARTICLES - ps.length
      if (room <= 0) return
      const n = Math.min(count, room)
      for (let i = 0; i < n; i++) {
        const angle = baseAngle + (Math.random() - 0.5) * spread
        const speed = power * (0.4 + Math.random() * 0.8)
        ps.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - power * 0.25,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.4,
          size: 6 + Math.random() * 7,
          color: palette[(Math.random() * palette.length) | 0],
          life: 1,
          decay: 0.006 + Math.random() * 0.006,
          shape: Math.random() > 0.45 ? 1 : 0,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.05 + Math.random() * 0.08,
          gravity: 0.12 + Math.random() * 0.05,
        })
      }
      ensureLoop()
    },
    [ensureLoop]
  )

  useImperativeHandle(
    ref,
    (): ConfettiHandle => ({
      fire: (opts = {}) => {
        if (reducedRef.current) return
        const x = opts.x ?? window.innerWidth / 2
        const y = opts.y ?? window.innerHeight * 0.38
        const palette = opts.colors && opts.colors.length ? opts.colors : paletteRef.current
        spawn(x, y, opts.count ?? 90, opts.power ?? 10, palette, Math.PI * 2)
      },
      pop: (x, y, popColors) => {
        if (reducedRef.current) return
        const palette = popColors && popColors.length ? popColors : paletteRef.current
        // Tight upward fan — a satisfying little burst.
        spawn(x, y, 16, 7, palette, Math.PI * 0.9, -Math.PI / 2)
      },
      finale: (finaleColors) => {
        if (reducedRef.current) return
        const palette = finaleColors && finaleColors.length ? finaleColors : paletteRef.current
        const w = window.innerWidth
        const h = window.innerHeight
        // Two side cannons + a centre burst, staggered for a richer feel.
        spawn(w * 0.12, h * 0.6, 60, 13, palette, Math.PI * 0.5, -Math.PI / 3)
        spawn(w * 0.88, h * 0.6, 60, 13, palette, Math.PI * 0.5, (-Math.PI * 2) / 3)
        spawn(w * 0.5, h * 0.45, 80, 12, palette, Math.PI * 2)
        setTimeout(() => spawn(w * 0.3, h * 0.4, 50, 11, palette, Math.PI * 2), 220)
        setTimeout(() => spawn(w * 0.7, h * 0.4, 50, 11, palette, Math.PI * 2), 360)
      },
    }),
    [spawn]
  )

  useEffect(() => {
    reducedRef.current = prefersReducedMotion()
    sizeCanvas()
    let resizeRaf: number | null = null
    const onResize = () => {
      if (resizeRaf != null) cancelAnimationFrame(resizeRaf)
      resizeRaf = requestAnimationFrame(sizeCanvas)
    }
    window.addEventListener('resize', onResize)
    const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
    const onMq = (e: MediaQueryListEvent) => {
      reducedRef.current = e.matches
      if (e.matches) particlesRef.current = []
    }
    mq?.addEventListener?.('change', onMq)
    return () => {
      window.removeEventListener('resize', onResize)
      mq?.removeEventListener?.('change', onMq)
      if (resizeRaf != null) cancelAnimationFrame(resizeRaf)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      particlesRef.current = []
    }
  }, [sizeCanvas])

  // Tap-to-pop: only when interactive. Emits a burst at the pointer and never
  // swallows the gesture for anything else (the canvas only mounts as interactive
  // during a celebration overlay).
  const onPointer = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!interactive || reducedRef.current) return
      spawn(e.clientX, e.clientY, 24, 9, paletteRef.current, Math.PI * 2)
    },
    [interactive, spawn]
  )

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      onPointerDown={interactive ? onPointer : undefined}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex,
        pointerEvents: interactive ? 'auto' : 'none',
      }}
    />
  )
})
