'use client'

import { ReactNode } from 'react'

interface FeatureCardProps {
  icon?: ReactNode
  title: string
  description: string
  gradient?: boolean
  className?: string
}

export function FeatureCard({
  icon,
  title,
  description,
  gradient = false,
  className = '',
}: FeatureCardProps) {
  return (
    <div
      className={`p-6 rounded-xl border border-border transition-all duration-300 hover:shadow-lg hover:border-primary ${
        gradient ? 'gradient-primary-subtle' : 'bg-card'
      } ${className}`}
    >
      {icon && (
        <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      <h3 className="font-semibold text-lg text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}
