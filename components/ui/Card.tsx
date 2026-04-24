import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
}

export const Card = ({ children, className, title }: CardProps) => {
  return (
    <div className={cn('rounded-xl bg-white p-6 shadow-sm', className)}>
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      )}
      {children}
    </div>
  )
}