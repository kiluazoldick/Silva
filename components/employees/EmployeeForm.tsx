'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { EmployeeFormData } from '@/types'

const employeeSchema = z.object({
  first_name: z.string().min(2, 'Prénom doit contenir au moins 2 caractères'),
  last_name: z.string().min(2, 'Nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  position: z.string().min(2, 'Poste requis'),
  department: z.string().optional(),
  hire_date: z.string().min(1, 'Date d\'embauche requise'),
  salary: z.string().optional(),
  status: z.enum(['active', 'inactive', 'on_leave']),
  address: z.string().optional(),
  emergency_contact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    relationship: z.string().optional()
  }).optional()
})

type EmployeeFormValues = z.infer<typeof employeeSchema>

interface EmployeeFormProps {
  initialData?: Partial<EmployeeFormValues>
  onSubmit: (data: EmployeeFormValues) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const positions = [
  { value: 'directeur', label: 'Directeur Général' },
  { value: 'manager', label: 'Manager' },
  { value: 'dev', label: 'Développeur' },
  { value: 'designer', label: 'Designer' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Commercial' },
  { value: 'hr', label: 'RH' },
  { value: 'finance', label: 'Finance' },
  { value: 'admin', label: 'Administratif' },
]

const departments = [
  { value: 'direction', label: 'Direction' },
  { value: 'it', label: 'IT' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Ventes' },
  { value: 'hr', label: 'RH' },
  { value: 'finance', label: 'Finance' },
]

export function EmployeeForm({ initialData, onSubmit, onCancel, isLoading }: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      status: 'active',
      ...initialData
    }
  })

  useEffect(() => {
    if (initialData) {
      reset(initialData)
    }
  }, [initialData, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Prénom *"
          placeholder="Jean"
          {...register('first_name')}
          error={errors.first_name?.message}
        />
        <Input
          label="Nom *"
          placeholder="Dupont"
          {...register('last_name')}
          error={errors.last_name?.message}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Email *"
          type="email"
          placeholder="jean.dupont@email.com"
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          label="Téléphone"
          type="tel"
          placeholder="+33 6 12 34 56 78"
          {...register('phone')}
          error={errors.phone?.message}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Poste *"
          options={positions}
          {...register('position')}
          error={errors.position?.message}
        />
        <Select
          label="Département"
          options={departments}
          {...register('department')}
          error={errors.department?.message}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Date d'embauche *"
          type="date"
          {...register('hire_date')}
          error={errors.hire_date?.message}
        />
        <Input
          label="Salaire (annuel)"
          type="number"
          placeholder="45000"
          {...register('salary')}
          error={errors.salary?.message}
        />
      </div>

      <Select
        label="Statut"
        options={[
          { value: 'active', label: 'Actif' },
          { value: 'on_leave', label: 'En congé' },
          { value: 'inactive', label: 'Inactif' },
        ]}
        {...register('status')}
        error={errors.status?.message}
      />

      <Input
        label="Adresse"
        placeholder="123 Rue Example, Ville"
        {...register('address')}
        error={errors.address?.message}
      />

      <div className="border-t pt-4">
        <h4 className="mb-3 text-sm font-medium text-gray-900">Contact d'urgence</h4>
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            placeholder="Nom complet"
            {...register('emergency_contact.name')}
          />
          <Input
            placeholder="Téléphone"
            {...register('emergency_contact.phone')}
          />
          <Input
            placeholder="Relation"
            {...register('emergency_contact.relationship')}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Annuler
        </Button>
        <Button type="submit" loading={isLoading} className="flex-1">
          {initialData ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </form>
  )
}