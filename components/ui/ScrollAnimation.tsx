'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

interface ScrollAnimationProps {
  children: ReactNode
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideInLeft' | 'slideInRight'
  delay?: number
  duration?: number
  threshold?: number
}

export function ScrollAnimation({
  children,
  animation = 'slideUp',
  delay = 0,
  duration = 500,
  threshold = 0.1,
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [threshold])

  const animationClass = isVisible ? `animate-${animation}` : 'opacity-0'

  return (
    <div
      ref={ref}
      className={animationClass}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        animationFillMode: 'forwards',
      }}
    >
      {children}
    </div>
  )
}
