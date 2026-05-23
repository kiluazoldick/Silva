'use client'

import { ReactNode } from 'react'

interface GlassmorphismFormProps {
  children: ReactNode
  onSubmit?: (e: React.FormEvent) => void
  title?: string
  description?: string
  className?: string
}

export function GlassmorphismForm({
  children,
  onSubmit,
  title,
  description,
  className = '',
}: GlassmorphismFormProps) {
  return (
    <div
      className={`glass p-8 rounded-xl shadow-lg ${className}`}
    >
      {title && (
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {title}
        </h2>
      )}
      
      {description && (
        <p className="text-muted-foreground text-sm mb-6">
          {description}
        </p>
      )}
      
      <form onSubmit={onSubmit} className="space-y-5">
        {children}
      </form>
    </div>
  )
}
