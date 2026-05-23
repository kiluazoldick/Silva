'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Calendar, CheckCircle2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Task {
  id: string
  title: string
  status: 'pending' | 'in_progress' | 'completed'
  assigned_to?: { first_name: string; last_name: string } | null
  due_date?: string
}

interface TaskListWidgetProps {
  title?: string
  tasks: Task[]
  emptyMessage?: string
  viewAllLink?: string
}

const statusConfig = {
  completed: {
    badge: 'bg-success/10 text-success',
    label: 'Terminé',
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  in_progress: {
    badge: 'bg-primary/10 text-primary',
    label: 'En cours',
  },
  pending: {
    badge: 'bg-muted text-muted-foreground',
    label: 'En attente',
  },
}

export function TaskListWidget({
  title = 'Tâches récentes',
  tasks,
  emptyMessage = 'Aucune tâche',
  viewAllLink = '/tasks',
}: TaskListWidgetProps) {
  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>

      <div className="flex-1 space-y-3">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <p className="text-sm">{emptyMessage}</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
            >
              <input
                type="checkbox"
                checked={task.status === 'completed'}
                readOnly
                className="mt-1 rounded cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium text-sm ${
                    task.status === 'completed'
                      ? 'line-through text-muted-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {task.title}
                </p>
                {task.assigned_to && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {task.assigned_to.first_name} {task.assigned_to.last_name}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {task.due_date && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDistanceToNow(new Date(task.due_date), { locale: fr })}</span>
                  </div>
                )}
                <Badge className={statusConfig[task.status].badge}>
                  {statusConfig[task.status].label}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>

      {tasks.length > 0 && (
        <Link href={viewAllLink} className="mt-4 w-full block">
          <Button variant="outline" className="w-full">
            Voir toutes les tâches
          </Button>
        </Link>
      )}
    </Card>
  )
}
