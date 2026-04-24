'use client'

import { useState } from 'react'
import { Employee } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Mail,
  Phone,
  Calendar,
  UserCheck,
  UserX
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface EmployeeListProps {
  employees: Employee[]
  onEdit: (employee: Employee) => void
  onDelete: (id: string) => void
  loading?: boolean
}

const statusColors = {
  active: 'success',
  on_leave: 'warning',
  inactive: 'danger'
} as const

const statusLabels = {
  active: 'Actif',
  on_leave: 'En congé',
  inactive: 'Inactif'
}

export function EmployeeList({ employees, onEdit, onDelete, loading }: EmployeeListProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [positionFilter, setPositionFilter] = useState('all')

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = 
      employee.first_name.toLowerCase().includes(search.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(search.toLowerCase()) ||
      employee.email.toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter
    const matchesPosition = positionFilter === 'all' || employee.position === positionFilter
    
    return matchesSearch && matchesStatus && matchesPosition
  })

  const positions = ['all', ...new Set(employees.map(e => e.position))]

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher un employé..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          options={[
            { value: 'all', label: 'Tous les statuts' },
            { value: 'active', label: 'Actifs' },
            { value: 'on_leave', label: 'En congé' },
            { value: 'inactive', label: 'Inactifs' },
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-40"
        />
        <Select
          options={[
            { value: 'all', label: 'Tous les postes' },
            ...positions.filter(p => p !== 'all').map(p => ({ value: p, label: p }))
          ]}
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="w-40"
        />
      </div>

      {/* Liste */}
      <div className="grid gap-4">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              {/* Info employé */}
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <span className="text-lg font-semibold text-blue-600">
                      {employee.first_name[0]}{employee.last_name[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {employee.first_name} {employee.last_name}
                      </h3>
                      <Badge variant={statusColors[employee.status]}>
                        {statusLabels[employee.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{employee.position}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span>{employee.email}</span>
                      </div>
                      {employee.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{employee.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Embauché le {new Date(employee.hire_date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(employee)}
                  className="gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Modifier
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(employee.id)}
                  className="gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filteredEmployees.length === 0 && (
          <div className="py-12 text-center">
            <UserX className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun employé</h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez par ajouter votre premier employé
            </p>
          </div>
        )}
      </div>
    </div>
  )
}