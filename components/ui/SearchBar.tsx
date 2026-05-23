'use client'

import { Search, X } from 'lucide-react'
import { useState, useCallback } from 'react'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  onClear?: () => void
  className?: string
}

export function SearchBar({
  placeholder = 'Rechercher...',
  onSearch,
  onClear,
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setQuery(value)
      onSearch?.(value)
    },
    [onSearch]
  )

  const handleClear = () => {
    setQuery('')
    onClear?.()
  }

  return (
    <div
      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
        isFocused
          ? 'border-primary bg-background shadow-md'
          : 'border-border bg-input hover:bg-muted'
      } ${className}`}
    >
      <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm"
      />
      
      {query && (
        <button
          onClick={handleClear}
          className="p-1 hover:bg-muted rounded transition-colors flex-shrink-0"
          aria-label="Effacer la recherche"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
    </div>
  )
}
