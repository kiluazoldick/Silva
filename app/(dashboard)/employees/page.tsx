'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { Employee } from '@/types'
import { Plus, Users as UsersIcon, CheckCircle2, AlertCircle, Clock } from 'lucide-react'

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
      } else {
        await addEmployee(employeeData)
      }
      setIsModalOpen(false)
    } catch (error: any) {
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) return

    setDeleting(true)
    try {
      await deleteEmployee(selectedEmployee.id)
      setIsDeleteModalOpen(false)
    } catch (error: any) {
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

  const activeCount = employees.filter(e => e.status === 'active').length
  const onLeaveCount = employees.filter(e => e.status === 'on_leave').length
  const inactiveCount = employees.filter(e => e.status === 'inactive').length

  return (
    <div className="space-y-8">
      {/* Header */}
      
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Employés</h1>
            <p className="text-muted-foreground mt-1">
              Gérez tous les employés de votre entreprise
            </p>
          </div>
          <Button onClick={handleAdd} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Ajouter un employé
          </Button>
        </div>
      

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
            title="Total employés"
            value={employees.length}
            icon={<UsersIcon className="w-6 h-6" />}
            color="primary"
            description="Tous les membres de l'équipe"
          />
        
        
            title="Actifs"
            value={activeCount}
            icon={<CheckCircle2 className="w-6 h-6" />}
            color="success"
            description="Employés actifs en ce moment"
            trend="up"
            trendValue={`${Math.round((activeCount / Math.max(employees.length, 1)) * 100)}%`}
          />
        
        
            title="En congé"
            value={onLeaveCount}
            icon={<Clock className="w-6 h-6" />}
            color="warning"
            description="Employés en congé"
          />
        
        
            title="Inactifs"
            value={inactiveCount}
            icon={<AlertCircle className="w-6 h-6" />}
            color="error"
            description="Employés inactifs"
          />
        
      </div>

      {/* Employee List */}
      
        <Card className="border-primary/10">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">Liste des employés</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {employees.length} employé{employees.length !== 1 ? 's' : ''} enregistré{employees.length !== 1 ? 's' : ''}
            </p>
          </div>
            employees={employees}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </Card>
      

      {/* Modal Ajout/Modification */}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedEmployee ? 'Modifier l\'employé' : 'Ajouter un employé'}
        size="lg"
      >
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
