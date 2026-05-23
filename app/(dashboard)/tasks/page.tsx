'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { TaskForm } from '@/components/tasks/TaskForm'
import { createClient } from '@/lib/supabase/client'
import { Task } from '@/types'
import { Plus, CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react'

const supabase = createClient()

export default function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [companyId, setCompanyId] = useState<string | null>(null)
  
  const { tasks, loading, fetchTasks, addTask, updateTask, deleteTask, updateTaskStatus } = useTaskStore()
  const { employees, fetchEmployees } = useEmployeeStore()
  const { company } = useCompanyStore()
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const { data: userCompany } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      if (!userCompany) {
        router.push('/company-setup')
        return
      }

      setCompanyId(userCompany.id)
      await Promise.all([
        fetchTasks(userCompany.id),
        fetchEmployees(userCompany.id)
      ])
    }

    init()
  }, [router, fetchTasks, fetchEmployees])

  const handleAdd = () => {
    setSelectedTask(null)
    setIsModalOpen(true)
  }

  const handleEdit = (task: Task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (task) {
      setSelectedTask(task)
      setIsDeleteModalOpen(true)
    }
  }

  const handleDragDrop = async (e: React.DragEvent, newStatus: Task['status']) => {
    const taskId = e.dataTransfer.getData('taskId')
    const task = tasks.find(t => t.id === taskId)
    
    if (task && task.status !== newStatus) {
      try {
        await updateTaskStatus(taskId, newStatus)
      } catch (error) {
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleSubmit = async (data: any) => {
    if (!companyId) return

    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const taskData = {
        ...data,
        company_id: companyId,
        created_by: user?.id,
        status: 'pending' as const,
        tags: data.tags ? data.tags.split(',').map((t: string) => t.trim()) : []
      }

      if (selectedTask) {
        await updateTask(selectedTask.id, taskData)
      } else {
        await addTask(taskData)
      }
      setIsModalOpen(false)
    } catch (error: any) {
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedTask) return

    setDeleting(true)
    try {
      await deleteTask(selectedTask.id)
      setIsDeleteModalOpen(false)
    } catch (error: any) {
    } finally {
      setDeleting(false)
      setSelectedTask(null)
    }
  }

  if (loading || !companyId) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  const tasksByStatus = {
    pending: tasks.filter(t => t.status === 'pending'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed'),
    cancelled: tasks.filter(t => t.status === 'cancelled')
  }

  const completionRate = tasks.length > 0 
    ? Math.round((tasksByStatus.completed.length / tasks.length) * 100)
    : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tâches</h1>
            <p className="text-muted-foreground mt-1">
              Gérez toutes les tâches de votre équipe
            </p>
          </div>
          <Button onClick={handleAdd} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Nouvelle tâche
          </Button>
        </div>
      

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
            title="À faire"
            value={tasksByStatus.pending.length}
            icon={<Clock className="w-6 h-6" />}
            color="primary"
            description="Tâches en attente"
          />
        
        
            title="En cours"
            value={tasksByStatus.in_progress.length}
            icon={<AlertCircle className="w-6 h-6" />}
            color="warning"
            description="Tâches en cours d'exécution"
          />
        
        
            title="Terminées"
            value={tasksByStatus.completed.length}
            icon={<CheckCircle2 className="w-6 h-6" />}
            color="success"
            description="Tâches complétées"
            trend="up"
            trendValue={`${completionRate}%`}
          />
        
        
            title="Taux complétion"
            value={`${completionRate}%`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="success"
            description="Progression globale"
          />
        
      </div>

      {/* Kanban Board */}
      
        <div className="grid gap-4 overflow-x-auto lg:grid-cols-4">
            title="À faire"
            status="pending"
            tasks={tasksByStatus.pending}
            employees={employees}
            onTaskEdit={handleEdit}
            onTaskDelete={handleDelete}
            onDragOver={handleDragOver}
            onDrop={handleDragDrop}
          />
            title="En cours"
            status="in_progress"
            tasks={tasksByStatus.in_progress}
            employees={employees}
            onTaskEdit={handleEdit}
            onTaskDelete={handleDelete}
            onDragOver={handleDragOver}
            onDrop={handleDragDrop}
          />
            title="Terminé"
            status="completed"
            tasks={tasksByStatus.completed}
            employees={employees}
            onTaskEdit={handleEdit}
            onTaskDelete={handleDelete}
            onDragOver={handleDragOver}
            onDrop={handleDragDrop}
          />
            title="Annulé"
            status="cancelled"
            tasks={tasksByStatus.cancelled}
            employees={employees}
            onTaskEdit={handleEdit}
            onTaskDelete={handleDelete}
            onDragOver={handleDragOver}
            onDrop={handleDragDrop}
          />
        </div>
      

      {/* Modal Ajout/Modification */}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTask ? 'Modifier la tâche' : 'Créer une tâche'}
        size="lg"
      >
        <TaskForm
          employees={employees}
          initialData={selectedTask ? {
            title: selectedTask.title,
            description: selectedTask.description || '',
            assigned_to: selectedTask.assigned_to,
            priority: selectedTask.priority,
            due_date: selectedTask.due_date,
            tags: selectedTask.tags?.join(', ')
          } : undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={submitting}
        />
      </Modal>

      {/* Modal Confirmation suppression */}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Supprimer la tâche"
        message={`Êtes-vous sûr de vouloir supprimer la tâche "${selectedTask?.title}" ? Cette action est irréversible.`}
        loading={deleting}
      />
    </div>
  )
}
