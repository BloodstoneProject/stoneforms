'use client'

import * as React from 'react'

type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'stoneforms-theme'

interface ThemeContextValue {
  /** The user's stored preference: 'light' | 'dark' | 'system'. */
  theme: Theme
  /** The actually-applied theme after resolving 'system'. */
  resolvedTheme: ResolvedTheme
  /** Set the preference (persists to localStorage). */
  setTheme: (theme: Theme) => void
  /** Convenience flip between light and dark based on what's currently shown. */
  toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
  root.style.colorScheme = resolved
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Read the stored preference synchronously on first client render.
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system'
    return (localStorage.getItem(STORAGE_KEY) as Theme) || 'system'
  })

  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>(() => {
    if (typeof window === 'undefined') return 'light'
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme) || 'system'
    return stored === 'system' ? getSystemTheme() : stored
  })

  // Apply whenever preference changes.
  React.useEffect(() => {
    const resolved = theme === 'system' ? getSystemTheme() : theme
    setResolvedTheme(resolved)
    applyTheme(resolved)
  }, [theme])

  // Track OS changes while on 'system'.
  React.useEffect(() => {
    if (theme !== 'system') return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      const resolved = getSystemTheme()
      setResolvedTheme(resolved)
      applyTheme(resolved)
    }
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [theme])

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore (private mode etc.) */
    }
  }, [])

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}

/**
 * Inline, render-blocking script that sets the .dark class BEFORE first paint
 * to prevent a flash of the wrong theme. Injected in app/layout.tsx <head>.
 */
export const themeNoFlashScript = `
(function () {
  try {
    var k = 'stoneforms-theme';
    var s = localStorage.getItem(k);
    var sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var r = (!s || s === 'system') ? sys : s;
    var el = document.documentElement;
    el.classList.toggle('dark', r === 'dark');
    el.style.colorScheme = r;
  } catch (e) {}
})();
`
