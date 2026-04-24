'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Employee } from '@/types'
import { TaskFormData } from '@/types'

const taskSchema = z.object({
  title: z.string().min(3, 'Titre doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  assigned_to: z.string().min(1, 'Sélectionnez un employé'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  due_date: z.string().optional(),
  tags: z.string().optional()
})

type TaskFormValues = z.infer<typeof taskSchema>

interface TaskFormProps {
  employees: Employee[]
  initialData?: Partial<TaskFormValues>
  onSubmit: (data: TaskFormValues) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const priorities = [
  { value: 'low', label: 'Basse' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'high', label: 'Haute' },
  { value: 'urgent', label: 'Urgente' }
]

export function TaskForm({ employees, initialData, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: 'medium',
      ...initialData
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Titre *"
        placeholder="Développer la nouvelle feature"
        {...register('title')}
        error={errors.title?.message}
      />

      <Textarea
        label="Description"
        placeholder="Décrivez la tâche en détail..."
        {...register('description')}
        error={errors.description?.message}
      />

      <Select
        label="Assigné à *"
        options={[
          { value: '', label: 'Sélectionnez un employé' },
          ...employees.map(emp => ({
            value: emp.id,
            label: `${emp.first_name} ${emp.last_name} - ${emp.position}`
          }))
        ]}
        {...register('assigned_to')}
        error={errors.assigned_to?.message}
      />

      <Select
        label="Priorité"
        options={priorities}
        {...register('priority')}
        error={errors.priority?.message}
      />

      <Input
        label="Date d'échéance"
        type="datetime-local"
        {...register('due_date')}
        error={errors.due_date?.message}
      />

      <Input
        label="Tags"
        placeholder="urgent, frontend, bug (séparés par des virgules)"
        {...register('tags')}
        error={errors.tags?.message}
      />

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Annuler
        </Button>
        <Button type="submit" loading={isLoading} className="flex-1">
          {initialData ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  )
}