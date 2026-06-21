// Stoneforms theme system — the design layer that makes forms feel premium and
// customizable (colors, font, button shape, background). Stored on forms.theme.

export type ButtonStyle = 'rounded' | 'pill' | 'sharp'
export type BackgroundStyle = 'solid' | 'gradient'

export interface ThemeColors {
  primary: string
  background: string
  text: string
  button: string
  buttonText: string
}

export interface FormTheme {
  id: string
  name: string
  colors: ThemeColors
  font: string
  buttonStyle: ButtonStyle
  backgroundStyle: BackgroundStyle
  backgroundGradient?: [string, string]
}

// Curated Google Fonts. `stack` is the CSS fallback.
export const THEME_FONTS: { label: string; family: string; stack: string }[] = [
  { label: 'Inter', family: 'Inter', stack: "'Inter', system-ui, sans-serif" },
  { label: 'Poppins', family: 'Poppins', stack: "'Poppins', system-ui, sans-serif" },
  { label: 'DM Sans', family: 'DM Sans', stack: "'DM Sans', system-ui, sans-serif" },
  { label: 'Space Grotesk', family: 'Space Grotesk', stack: "'Space Grotesk', system-ui, sans-serif" },
  { label: 'Sora', family: 'Sora', stack: "'Sora', system-ui, sans-serif" },
  { label: 'Fraunces', family: 'Fraunces', stack: "'Fraunces', Georgia, serif" },
  { label: 'Playfair Display', family: 'Playfair Display', stack: "'Playfair Display', Georgia, serif" },
  { label: 'Lora', family: 'Lora', stack: "'Lora', Georgia, serif" },
]

export const DEFAULT_THEME: FormTheme = {
  id: 'clean',
  name: 'Clean',
  colors: { primary: '#2563eb', background: '#ffffff', text: '#0f172a', button: '#2563eb', buttonText: '#ffffff' },
  font: 'Inter',
  buttonStyle: 'rounded',
  backgroundStyle: 'solid',
}

export const PRESET_THEMES: FormTheme[] = [
  DEFAULT_THEME,
  {
    id: 'midnight', name: 'Midnight',
    colors: { primary: '#818cf8', background: '#0f172a', text: '#e2e8f0', button: '#6366f1', buttonText: '#ffffff' },
    font: 'Space Grotesk', buttonStyle: 'rounded', backgroundStyle: 'gradient', backgroundGradient: ['#0f172a', '#1e1b4b'],
  },
  {
    id: 'sunset', name: 'Sunset',
    colors: { primary: '#db2777', background: '#fff1f2', text: '#831843', button: '#e11d48', buttonText: '#ffffff' },
    font: 'Poppins', buttonStyle: 'pill', backgroundStyle: 'gradient', backgroundGradient: ['#ffe4e6', '#fae8ff'],
  },
  {
    id: 'forest', name: 'Forest',
    colors: { primary: '#047857', background: '#f0fdf4', text: '#064e3b', button: '#059669', buttonText: '#ffffff' },
    font: 'DM Sans', buttonStyle: 'rounded', backgroundStyle: 'solid',
  },
  {
    id: 'editorial', name: 'Editorial',
    colors: { primary: '#7c2d12', background: '#faf7f2', text: '#1c1917', button: '#9a3412', buttonText: '#ffffff' },
    font: 'Fraunces', buttonStyle: 'sharp', backgroundStyle: 'solid',
  },
  {
    id: 'mono', name: 'Mono',
    colors: { primary: '#111827', background: '#ffffff', text: '#111827', button: '#111827', buttonText: '#ffffff' },
    font: 'Space Grotesk', buttonStyle: 'sharp', backgroundStyle: 'solid',
  },
  {
    id: 'ocean', name: 'Ocean',
    colors: { primary: '#0891b2', background: '#ecfeff', text: '#164e63', button: '#0e7490', buttonText: '#ffffff' },
    font: 'Sora', buttonStyle: 'rounded', backgroundStyle: 'gradient', backgroundGradient: ['#cffafe', '#dbeafe'],
  },
  {
    id: 'bubblegum', name: 'Bubblegum',
    colors: { primary: '#9333ea', background: '#fdf4ff', text: '#581c87', button: '#a855f7', buttonText: '#ffffff' },
    font: 'Poppins', buttonStyle: 'pill', backgroundStyle: 'gradient', backgroundGradient: ['#fae8ff', '#ede9fe'],
  },
]

export function normalizeTheme(raw: any): FormTheme {
  if (!raw || typeof raw !== 'object') return DEFAULT_THEME
  const colors = raw.colors || {}
  return {
    id: raw.id || 'custom',
    name: raw.name || 'Custom',
    colors: {
      primary: colors.primary || DEFAULT_THEME.colors.primary,
      background: colors.background || DEFAULT_THEME.colors.background,
      text: colors.text || DEFAULT_THEME.colors.text,
      button: colors.button || colors.primary || DEFAULT_THEME.colors.button,
      buttonText: colors.buttonText || DEFAULT_THEME.colors.buttonText,
    },
    font: raw.font || raw.fonts?.body || DEFAULT_THEME.font,
    buttonStyle: raw.buttonStyle || DEFAULT_THEME.buttonStyle,
    backgroundStyle: raw.backgroundStyle || DEFAULT_THEME.backgroundStyle,
    backgroundGradient: raw.backgroundGradient,
  }
}

export function fontStack(font: string): string {
  return THEME_FONTS.find((f) => f.family === font)?.stack || `'${font}', system-ui, sans-serif`
}

// Google Fonts stylesheet URL for the chosen font (weights for headings + body).
export function googleFontHref(font: string): string {
  const fam = font.replace(/ /g, '+')
  return `https://fonts.googleapis.com/css2?family=${fam}:wght@400;500;600;700&display=swap`
}

export function buttonRadius(style: ButtonStyle): string {
  if (style === 'pill') return '9999px'
  if (style === 'sharp') return '4px'
  return '12px'
}

export function backgroundCss(theme: FormTheme): string {
  if (theme.backgroundStyle === 'gradient' && theme.backgroundGradient) {
    return `linear-gradient(160deg, ${theme.backgroundGradient[0]}, ${theme.backgroundGradient[1]})`
  }
  return theme.colors.background
}
