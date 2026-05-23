'use client'

interface ProgressBarProps {
  value: number
  max?: number
  showLabel?: boolean
  animated?: boolean
  color?: 'primary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
}

const colorMap = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
}

const sizeMap = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  animated = false,
  color = 'primary',
  size = 'md',
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className="w-full">
      <div
        className={`w-full bg-muted rounded-full overflow-hidden ${sizeMap[size]}`}
      >
        <div
          className={`${colorMap[color]} ${sizeMap[size]} transition-all duration-500 rounded-full ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-muted-foreground mt-2 text-right">
          {Math.round(percentage)}%
        </p>
      )}
    </div>
  )
}
