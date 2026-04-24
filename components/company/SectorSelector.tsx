'use client'

import { useState } from 'react'
import { 
  Cpu, 
  Heart, 
  Landmark, 
  GraduationCap, 
  ShoppingBag, 
  Factory, 
  Building2, 
  Truck 
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const sectors = [
  { id: 'technology', name: 'Technologie', icon: Cpu, color: 'bg-blue-500' },
  { id: 'healthcare', name: 'Santé', icon: Heart, color: 'bg-red-500' },
  { id: 'finance', name: 'Finance', icon: Landmark, color: 'bg-green-500' },
  { id: 'education', name: 'Éducation', icon: GraduationCap, color: 'bg-purple-500' },
  { id: 'retail', name: 'Commerce', icon: ShoppingBag, color: 'bg-orange-500' },
  { id: 'manufacturing', name: 'Industrie', icon: Factory, color: 'bg-gray-500' },
  { id: 'construction', name: 'Construction', icon: Building2, color: 'bg-yellow-500' },
  { id: 'transport', name: 'Transport', icon: Truck, color: 'bg-indigo-500' },
]

interface SectorSelectorProps {
  selected: string
  onChange: (sector: string) => void
}

export function SectorSelector({ selected, onChange }: SectorSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {sectors.map((sector) => {
        const Icon = sector.icon
        const isSelected = selected === sector.id
        
        return (
          <button
            key={sector.id}
            onClick={() => onChange(sector.id)}
            className={cn(
              'group relative flex flex-col items-center gap-3 rounded-xl p-4 transition-all duration-200',
              'border-2 hover:shadow-lg',
              isSelected
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-blue-200'
            )}
          >
            <div className={cn(
              'rounded-full p-3 transition-all duration-200',
              sector.color,
              isSelected ? 'scale-110' : 'opacity-80 group-hover:scale-105'
            )}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <span className={cn(
              'text-sm font-medium',
              isSelected ? 'text-blue-700' : 'text-gray-700'
            )}>
              {sector.name}
            </span>
            {isSelected && (
              <div className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-blue-500">
                <div className="flex h-full w-full items-center justify-center text-xs text-white">✓</div>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}