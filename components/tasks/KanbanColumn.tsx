'use client'

import { Task, Employee } from '@/types'
import { TaskCard } from './TaskCard'
import { cn } from '@/lib/utils/cn'

interface KanbanColumnProps {
  title: string
  status: Task['status']
  tasks: Task[]
  employees: Employee[]
  onTaskEdit: (task: Task) => void
  onTaskDelete: (id: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, status: Task['status']) => void
}

const columnColors = {
  pending: 'border-gray-200 bg-gray-50',
  in_progress: 'border-blue-200 bg-blue-50',
  completed: 'border-green-200 bg-green-50',
  cancelled: 'border-red-200 bg-red-50'
}

const columnTitles = {
  pending: 'À faire',
  in_progress: 'En cours',
  completed: 'Terminé',
  cancelled: 'Annulé'
}

export function KanbanColumn({
  title,
  status,
  tasks,
  employees,
  onTaskEdit,
  onTaskDelete,
  onDragOver,
  onDrop
}: KanbanColumnProps) {
  const getEmployee = (employeeId: string) => {
    return employees.find(e => e.id === employeeId)
  }

  return (
    <div
      className={cn(
        'flex h-full max-h-[calc(100vh-200px)] flex-col rounded-lg border-2 p-4',
        columnColors[status]
      )}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{columnTitles[status]}</h3>
        <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-gray-600">
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('taskId', task.id)
              e.dataTransfer.effectAllowed = 'move'
            }}
          >
            <TaskCard
              task={task}
              employee={getEmployee(task.assigned_to)}
              onEdit={() => onTaskEdit(task)}
              onDelete={() => onTaskDelete(task.id)}
            />
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white">
            <p className="text-sm text-gray-500">Aucune tâche</p>
          </div>
        )}
      </div>
    </div>
  )
}