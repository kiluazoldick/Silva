'use client'

import { ReactNode, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface AccordionItem {
  id: string
  title: string
  content: ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
}

export function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems)
    
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      if (!allowMultiple) {
        newOpenItems.clear()
      }
      newOpenItems.add(id)
    }
    
    setOpenItems(newOpenItems)
  }

  return (
    <div className="space-y-2 border border-border rounded-lg overflow-hidden">
      {items.map((item, index) => (
        <div key={item.id} className={index > 0 ? 'border-t border-border' : ''}>
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted transition-colors text-left"
          >
            <span className="font-medium text-foreground">{item.title}</span>
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
                openItems.has(item.id) ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          {openItems.has(item.id) && (
            <div className="px-6 py-4 bg-card text-card-foreground border-t border-border">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
