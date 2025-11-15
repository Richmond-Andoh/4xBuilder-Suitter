import React, { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  isDark: boolean
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
 if (typeof window === 'undefined') return 'light'
    const stored = localStorage.getItem('suitter_theme')
    // Migrate 'system' to 'light' if found
    if (stored === 'system') {
      localStorage.setItem('suitter_theme', 'light')
      return 'light'
    }
    return (stored === 'light' || stored === 'dark') ? (stored as Theme) : 'light'
  })

  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    setIsDark(theme === 'dark')
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('suitter_theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme }}>
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

