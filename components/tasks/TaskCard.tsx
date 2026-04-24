'use client'

import { Task, Employee } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Calendar, Flag, User, Edit2, Trash2, GripVertical } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface TaskCardProps {
  task: Task
  employee?: Employee
  onEdit: () => void
  onDelete: () => void
}

const priorityColors = {
  low: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Basse' },
  medium: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Moyenne' },
  high: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Haute' },
  urgent: { bg: 'bg-red-100', text: 'text-red-700', label: 'Urgente' }
}

const priorityIcons = {
  low: Flag,
  medium: Flag,
  high: Flag,
  urgent: Flag
}

export function TaskCard({ task, employee, onEdit, onDelete }: TaskCardProps) {
  const PriorityIcon = priorityIcons[task.priority]
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed'

  return (
    <div className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="default" className={priorityColors[task.priority].bg}>
              <PriorityIcon className={`mr-1 h-3 w-3 ${priorityColors[task.priority].text}`} />
              <span className={priorityColors[task.priority].text}>
                {priorityColors[task.priority].label}
              </span>
            </Badge>
            {task.tags && task.tags.length > 0 && (
              <div className="flex gap-1">
                {task.tags.slice(0, 2).map((tag, i) => (
                  <Badge key={i} variant="default" className="bg-gray-100 text-gray-600">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <h4 className="mb-2 font-semibold text-gray-900">{task.title}</h4>
          
          {task.description && (
            <p className="mb-3 line-clamp-2 text-sm text-gray-600">{task.description}</p>
          )}
          
          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            {employee && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{employee.first_name} {employee.last_name}</span>
              </div>
            )}
            {task.due_date && (
              <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
                <Calendar className="h-3 w-3" />
                <span>
                  Échéance: {format(new Date(task.due_date), 'dd MMM yyyy', { locale: fr })}
                  {isOverdue && ' (En retard)'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-8 w-8 p-0"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}