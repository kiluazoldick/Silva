'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { EmployeeList } from '@/components/employees/EmployeeList'
import { EmployeeForm } from '@/components/employees/EmployeeForm'
import { useEmployeeStore } from '@/lib/store/employeeStore'
import { useCompanyStore } from '@/lib/store/companyStore'
import { createClient } from '@/lib/supabase/client'
import { Employee } from '@/types'
import { Plus, Users as UsersIcon } from 'lucide-react'
import { toast } from 'sonner'

const supabase = createClient()

export default function EmployeesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [companyId, setCompanyId] = useState<string | null>(null)
  
  const { employees, loading, fetchEmployees, addEmployee, updateEmployee, deleteEmployee } = useEmployeeStore()
  const { company } = useCompanyStore()
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      // Récupérer l'utilisateur et son entreprise directement
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // Chercher l'entreprise de l'utilisateur
      const { data: userCompany, error } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      if (error || !userCompany) {
        console.log('Pas d\'entreprise trouvée, redirection vers company-setup')
        router.push('/company-setup')
        return
      }

      // Si on a une entreprise, on charge les employés
      setCompanyId(userCompany.id)
      await fetchEmployees(userCompany.id)
    }

    init()
  }, [router, fetchEmployees])

  const handleAdd = () => {
    setSelectedEmployee(null)
    setIsModalOpen(true)
  }

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    const employee = employees.find(e => e.id === id)
    if (employee) {
      setSelectedEmployee(employee)
      setIsDeleteModalOpen(true)
    }
  }

  const handleSubmit = async (data: any) => {
    if (!companyId) return

    setSubmitting(true)
    try {
      const employeeData = {
        ...data,
        company_id: companyId,
        salary: data.salary ? parseFloat(data.salary) : null,
        emergency_contact: data.emergency_contact || null
      }

      if (selectedEmployee) {
        await updateEmployee(selectedEmployee.id, employeeData)
        toast.success('Employé modifié avec succès')
      } else {
        await addEmployee(employeeData)
        toast.success('Employé ajouté avec succès')
      }
      setIsModalOpen(false)
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue')
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) return

    setDeleting(true)
    try {
      await deleteEmployee(selectedEmployee.id)
      toast.success('Employé supprimé avec succès')
      setIsDeleteModalOpen(false)
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression')
    } finally {
      setDeleting(false)
      setSelectedEmployee(null)
    }
  }

  // Afficher un loader pendant le chargement
  if (!companyId && loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employés</h1>
          <p className="text-gray-600">
            Gérez tous les employés de votre entreprise
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un employé
        </Button>
      </div>

      {/* Stats rapides */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total employés</p>
              <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
            </div>
            <UsersIcon className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Actifs</p>
              <p className="text-2xl font-bold text-green-600">
                {employees.filter(e => e.status === 'active').length}
              </p>
            </div>
            <UsersIcon className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En congé</p>
              <p className="text-2xl font-bold text-yellow-600">
                {employees.filter(e => e.status === 'on_leave').length}
              </p>
            </div>
            <UsersIcon className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactifs</p>
              <p className="text-2xl font-bold text-red-600">
                {employees.filter(e => e.status === 'inactive').length}
              </p>
            </div>
            <UsersIcon className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Liste des employés */}
      <Card>
        <EmployeeList
          employees={employees}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </Card>

      {/* Modal Ajout/Modification */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedEmployee ? 'Modifier l\'employé' : 'Ajouter un employé'}
        size="lg"
      >
        <EmployeeForm
          initialData={selectedEmployee ? {
            first_name: selectedEmployee.first_name,
            last_name: selectedEmployee.last_name,
            email: selectedEmployee.email,
            phone: selectedEmployee.phone,
            position: selectedEmployee.position,
            department: selectedEmployee.department,
            hire_date: selectedEmployee.hire_date,
            salary: selectedEmployee.salary?.toString(),
            status: selectedEmployee.status,
            address: selectedEmployee.address,
            emergency_contact: selectedEmployee.emergency_contact
          } : undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={submitting}
        />
      </Modal>

      {/* Modal Confirmation suppression */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Supprimer l'employé"
        message={`Êtes-vous sûr de vouloir supprimer ${selectedEmployee?.first_name} ${selectedEmployee?.last_name} ? Cette action est irréversible.`}
        loading={deleting}
      />
    </div>
  )
}