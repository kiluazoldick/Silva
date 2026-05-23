'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { Plus, Users as UsersIcon, CheckCircle2, AlertCircle, Clock } from 'lucide-react'

const supabase = createClient()

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadEmployees = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: company } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!company) {
        router.push('/company-setup')
        return
      }

      const { data } = await supabase
        .from('employees')
        .select('*')
        .eq('company_id', company.id)

      setEmployees(data || [])
      setLoading(false)
    }

    loadEmployees()
  }, [router])

  const activeCount = employees.filter(e => e.status === 'active').length
  const onLeaveCount = employees.filter(e => e.status === 'on_leave').length
  const inactiveCount = employees.filter(e => e.status === 'inactive').length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employés</h1>
          <p className="text-muted-foreground mt-1">Gérez votre équipe</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-3xl font-bold text-foreground mt-2">{employees.length}</p>
            </div>
            <UsersIcon className="h-8 w-8 text-primary opacity-20" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Actifs</p>
              <p className="text-3xl font-bold text-foreground mt-2">{activeCount}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-primary opacity-20" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">En congé</p>
              <p className="text-3xl font-bold text-foreground mt-2">{onLeaveCount}</p>
            </div>
            <Clock className="h-8 w-8 text-primary opacity-20" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Inactifs</p>
              <p className="text-3xl font-bold text-foreground mt-2">{inactiveCount}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-primary opacity-20" />
          </div>
        </Card>
      </div>

      {/* Employee List */}
      <Card>
        {loading ? (
          <div className="text-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-12">
            <UsersIcon className="h-12 w-12 text-primary/20 mx-auto mb-4" />
            <p className="text-muted-foreground">Aucun employé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Nom</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Poste</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Statut</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id} className="border-b border-border hover:bg-muted/30">
                    <td className="py-3 px-4">{emp.first_name} {emp.last_name}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{emp.email}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{emp.position}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        emp.status === 'active' ? 'bg-green-100 text-green-800' :
                        emp.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {emp.status === 'active' ? 'Actif' : emp.status === 'on_leave' ? 'Congé' : 'Inactif'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
