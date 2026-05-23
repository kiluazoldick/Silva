'use client'

import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatWidgetProps {
  title: string
  value: string | number
  unit?: string
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string | number
  description?: string
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
}

const colorMap = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
}

export function StatWidget({
  title,
  value,
  unit,
  icon,
  trend,
  trendValue,
  description,
  color = 'primary',
}: StatWidgetProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
        </div>
        {icon && (
          <div className={`rounded-lg p-3 ${colorMap[color]}`}>
            {icon}
          </div>
        )}
      </div>

      {description && (
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
      )}

      {trendValue && (
        <div className={`flex items-center gap-1 text-xs font-medium ${
          trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-muted-foreground'
        }`}>
          {trend === 'up' ? (
            <TrendingUp className="w-3 h-3" />
          ) : trend === 'down' ? (
            <TrendingDown className="w-3 h-3" />
          ) : null}
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  )
}
