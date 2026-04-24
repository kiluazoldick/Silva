'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Avatar, AvatarFallback } from '@/components/ui/Avatar'
import { Trophy, TrendingUp } from 'lucide-react'

const supabase = createClient()

interface EmployeePerformanceProps {
  companyId: string
}

export function EmployeePerformance({ companyId }: EmployeePerformanceProps) {
  const [topEmployees, setTopEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      // Récupérer les employés et leurs tâches complétées
      const { data: employees } = await supabase
        .from('employees')
        .select('id, first_name, last_name, position')
        .eq('company_id', companyId)

      if (!employees) return

      const { data: tasks } = await supabase
        .from('tasks')
        .select('assigned_to, status')
        .eq('company_id', companyId)

      const performance = employees.map(emp => {
        const employeeTasks = tasks?.filter(t => t.assigned_to === emp.id) || []
        const completed = employeeTasks.filter(t => t.status === 'completed').length
        const total = employeeTasks.length
        const completionRate = total > 0 ? (completed / total) * 100 : 0

        return {
          id: emp.id,
          name: `${emp.first_name} ${emp.last_name}`,
          position: emp.position,
          completed,
          total,
          rate: Math.round(completionRate)
        }
      })

      // Trier par taux de complétion
      const sorted = performance.sort((a, b) => b.rate - a.rate).slice(0, 5)
      setTopEmployees(sorted)
      setLoading(false)
    }

    fetchData()
  }, [companyId])

  if (loading) {
    return (
      <Card>
        <div className="h-80 animate-pulse rounded bg-gray-100" />
      </Card>
    )
  }

  return (
    <Card title="Top Performers">
      <div className="space-y-6">
        {/* Top 5 graphique */}
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topEmployees} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} unit="%" />
            <YAxis type="category" dataKey="name" width={100} />
            <Tooltip />
            <Bar dataKey="rate" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Liste des tops */}
        <div className="space-y-3">
          {topEmployees.map((emp, index) => (
            <div key={emp.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                  {index === 0 && <Trophy className="h-4 w-4 text-yellow-600" />}
                  {index === 1 && <Trophy className="h-4 w-4 text-gray-400" />}
                  {index === 2 && <Trophy className="h-4 w-4 text-amber-600" />}
                  {index > 2 && <span className="text-sm font-medium text-gray-600">{index + 1}</span>}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{emp.name}</p>
                  <p className="text-xs text-gray-500">{emp.position}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">{emp.rate}%</p>
                <p className="text-xs text-gray-500">
                  {emp.completed}/{emp.total} tâches
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}