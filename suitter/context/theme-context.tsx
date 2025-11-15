'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load saved theme preference
    const saved = localStorage.getItem('suitter_theme') as Theme | null
    if (saved) {
      setThemeState(saved)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const applyTheme = () => {
      // Determine if dark mode is active
      const prefersDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

      setIsDark(prefersDark)
      
      // Apply theme to document
      if (prefersDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    applyTheme()

    // Listen for system theme changes if theme is set to 'system'
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => applyTheme()
      
      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
      } 
      // Fallback for older browsers
      else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange)
        return () => mediaQuery.removeListener(handleChange)
      }
    }
  }, [theme, mounted])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('suitter_theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
