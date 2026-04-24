'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { Users, CheckSquare, Clock, TrendingUp, DollarSign, Calendar } from 'lucide-react'

const supabase = createClient()

interface KPIData {
  totalEmployees: number
  activeEmployees: number
  totalTasks: number
  completedTasks: number
  completionRate: number
  presentToday: number
  totalHoursThisMonth: number
}

interface KPIDashboardProps {
  companyId: string
}

export function KPIDashboard({ companyId }: KPIDashboardProps) {
  const [kpi, setKpi] = useState<KPIData>({
    totalEmployees: 0,
    activeEmployees: 0,
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0,
    presentToday: 0,
    totalHoursThisMonth: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchKPIs = async () => {
      // Récupérer les employés
      const { data: employees } = await supabase
        .from('employees')
        .select('status')
        .eq('company_id', companyId)

      // Récupérer les tâches
      const { data: tasks } = await supabase
        .from('tasks')
        .select('status')
        .eq('company_id', companyId)

      // Récupérer les présences du jour
      const today = new Date().toISOString().split('T')[0]
      const { data: attendance } = await supabase
        .from('attendance')
        .select('id')
        .eq('date', today)

      // Récupérer les heures du mois
      const firstDayOfMonth = new Date()
      firstDayOfMonth.setDate(1)
      const { data: monthlyAttendance } = await supabase
        .from('attendance')
        .select('hours_worked')
        .eq('company_id', companyId)
        .gte('date', firstDayOfMonth.toISOString().split('T')[0])

      const totalEmployees = employees?.length || 0
      const activeEmployees = employees?.filter(e => e.status === 'active').length || 0
      const totalTasks = tasks?.length || 0
      const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0
      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
      const totalHoursThisMonth = monthlyAttendance?.reduce((sum, a) => sum + (a.hours_worked || 0), 0) || 0

      setKpi({
        totalEmployees,
        activeEmployees,
        totalTasks,
        completedTasks,
        completionRate: Math.round(completionRate),
        presentToday: attendance?.length || 0,
        totalHoursThisMonth: Math.round(totalHoursThisMonth)
      })
      setLoading(false)
    }

    fetchKPIs()
  }, [companyId])

  const kpiCards = [
    {
      label: 'Employés',
      value: kpi.totalEmployees,
      subValue: `${kpi.activeEmployees} actifs`,
      icon: Users,
      color: 'bg-blue-500',
      trend: '+12%',
      trendUp: true
    },
    {
      label: 'Tâches complétées',
      value: `${kpi.completionRate}%`,
      subValue: `${kpi.completedTasks}/${kpi.totalTasks} tâches`,
      icon: CheckSquare,
      color: 'bg-green-500',
      trend: `${kpi.completionRate}%`,
      trendUp: kpi.completionRate > 50
    },
    {
      label: 'Présents aujourd\'hui',
      value: kpi.presentToday,
      subValue: `sur ${kpi.totalEmployees} employés`,
      icon: Clock,
      color: 'bg-purple-500',
      trend: `${Math.round((kpi.presentToday / kpi.totalEmployees) * 100)}%`,
      trendUp: true
    },
    {
      label: 'Heures travaillées',
      value: `${kpi.totalHoursThisMonth}h`,
      subValue: 'ce mois-ci',
      icon: TrendingUp,
      color: 'bg-orange-500',
      trend: '+8%',
      trendUp: true
    }
  ]

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <div className="h-24 animate-pulse rounded bg-gray-100" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {kpiCards.map((kpi, index) => {
        const Icon = kpi.icon
        return (
          <Card key={index} className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{kpi.value}</p>
                <p className="mt-1 text-sm text-gray-500">{kpi.subValue}</p>
              </div>
              <div className={`rounded-full ${kpi.color} p-3`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
            {kpi.trend && (
              <div className="absolute bottom-3 right-3">
                <span className={`text-xs font-medium ${kpi.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.trend}
                </span>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}