'use client'

import { Star } from 'lucide-react'

interface TestimonialCardProps {
  name: string
  role: string
  company?: string
  content: string
  rating?: number
  avatar?: string
  initials?: string
}

export function TestimonialCard({
  name,
  role,
  company,
  content,
  rating = 5,
  avatar,
  initials,
}: TestimonialCardProps) {
  return (
    <div className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star
            key={i}
            className="w-4 h-4 fill-yellow-400 text-yellow-400"
          />
        ))}
      </div>
      
      <p className="text-foreground text-sm leading-relaxed mb-6">
        "{content}"
      </p>
      
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-primary">
              {initials || name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </span>
          )}
        </div>
        
        <div>
          <p className="font-semibold text-foreground text-sm">{name}</p>
          <p className="text-muted-foreground text-xs">
            {role}{company ? ` • ${company}` : ''}
          </p>
        </div>
      </div>
    </div>
  )
}
