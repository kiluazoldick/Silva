'use client'

import { cn } from '@/lib/utils/cn'

interface AvatarProps {
  children: React.ReactNode
  className?: string
}

export function Avatar({ children, className }: AvatarProps) {
  return (
    <div className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}>
      {children}
    </div>
  )
}

export function AvatarFallback({ children, className }: AvatarProps) {
  return (
    <div className={cn('flex h-full w-full items-center justify-center bg-gray-100 text-sm font-medium text-gray-600', className)}>
      {children}
    </div>
  )
}