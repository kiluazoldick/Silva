'use client'

interface AvatarGeneratorProps {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  src?: string
  className?: string
  seed?: string
}

const sizeMap = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-2xl',
}

const colorPalette = [
  'bg-blue-500',
  'bg-cyan-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-orange-500',
]

export function AvatarGenerator({
  name,
  size = 'md',
  src,
  className = '',
  seed,
}: AvatarGeneratorProps) {
  const getInitials = (str: string) => {
    return str
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  const getColorIndex = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash) % colorPalette.length
  }

  const initials = getInitials(name)
  const colorIndex = getColorIndex(seed || name)
  const backgroundColor = colorPalette[colorIndex]

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeMap[size]} rounded-full object-cover ${className}`}
      />
    )
  }

  return (
    <div
      className={`${sizeMap[size]} ${backgroundColor} rounded-full flex items-center justify-center font-semibold text-white ${className}`}
      title={name}
    >
      {initials}
    </div>
  )
}
