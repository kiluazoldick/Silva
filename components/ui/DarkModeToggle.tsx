'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Check system preference and localStorage
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const stored = localStorage.getItem('theme')
    
    if (stored === 'dark' || (!stored && prefersDark)) {
      setIsDark(true)
      document.documentElement.style.colorScheme = 'dark'
    } else {
      setIsDark(false)
      document.documentElement.style.colorScheme = 'light'
    }
  }, [])

  const toggleDarkMode = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light')
    
    if (newIsDark) {
      document.documentElement.style.colorScheme = 'dark'
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.style.colorScheme = 'light'
      document.documentElement.classList.remove('dark')
    }
  }

  if (!isMounted) return null

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg transition-colors hover:bg-muted"
      aria-label={isDark ? 'Passer au mode clair' : 'Passer au mode sombre'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700" />
      )}
    </button>
  )
}
