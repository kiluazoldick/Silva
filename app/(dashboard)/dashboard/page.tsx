'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { Users, CheckSquare, Clock, TrendingUp, ArrowRight, Calendar, AlertCircle } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

const supabase = createClient()

interface DashboardData {
  companyName: string
  stats: {
    totalEmployees: number
    activeEmployees: number
    totalTasks: number
    completedTasks: number
    completionRate: number
    presentToday: number
  }
  recentTasks: any[]
  upcomingDeadlines: any[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserName(user.email?.split('@')[0] || '')

      // Récupérer l'entreprise
      const { data: company } = await supabase
        .from('companies')
        .select('*')
        .eq('owner_id', user.id)
        .single()

      if (!company) {
        setLoading(false)
        return
      }

      // Récupérer les employés
      const { data: employees } = await supabase
        .from('employees')
        .select('*')
        .eq('company_id', company.id)

      // Récupérer les tâches
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*, employee:assigned_to(first_name, last_name)')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false })
        .limit(5)

      // Récupérer les présences du jour
      const today = new Date().toISOString().split('T')[0]
      const { count: presentToday } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('date', today)

      // Tâches avec échéances proches
      const upcoming = tasks?.filter(t => 
        t.due_date && 
        t.status !== 'completed' &&
        new Date(t.due_date) > new Date()
      ).slice(0, 5)

      const totalEmployees = employees?.length || 0
      const activeEmployees = employees?.filter(e => e.status === 'active').length || 0
      const totalTasks = tasks?.length || 0
      const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0
      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

      setData({
        companyName: company.name,
        stats: {
          totalEmployees,
          activeEmployees,
          totalTasks,
          completedTasks,
          completionRate: Math.round(completionRate),
          presentToday: presentToday || 0
        },
        recentTasks: tasks || [],
        upcomingDeadlines: upcoming || []
      })
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card>
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Bienvenue sur Silva! 👋
            </h3>
            <p className="text-gray-600 mb-4">
              Commencez par créer votre entreprise
            </p>
            <Link href="/company-setup">
              <Button>Créer mon entreprise</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  const statsCards = [
    {
      title: 'Employés',
      value: data.stats.totalEmployees,
      subValue: `${data.stats.activeEmployees} actifs`,
      icon: Users,
      color: 'bg-blue-500',
      link: '/employees'
    },
    {
      title: 'Tâches complétées',
      value: `${data.stats.completionRate}%`,
      subValue: `${data.stats.completedTasks}/${data.stats.totalTasks} tâches`,
      icon: CheckSquare,
      color: 'bg-green-500',
      link: '/tasks'
    },
    {
      title: 'Présents aujourd\'hui',
      value: data.stats.presentToday,
      subValue: `sur ${data.stats.totalEmployees} employés`,
      icon: Clock,
      color: 'bg-purple-500',
      link: '/attendance'
    },
    {
      title: 'Performance',
      value: `${data.stats.completionRate}%`,
      subValue: 'taux de complétion',
      icon: TrendingUp,
      color: 'bg-orange-500',
      link: '/statistics'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Bienvenue */}
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <h1 className="text-2xl font-bold">
          Bonjour {userName} 👋
        </h1>
        <p className="mt-1 text-blue-100">
          Bienvenue sur {data.companyName}
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Link href={stat.link} key={index}>
              <Card className="cursor-pointer transition-all hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="mt-1 text-sm text-gray-500">{stat.subValue}</p>
                  </div>
                  <div className={`rounded-full ${stat.color} p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-blue-600">
                  <span>Voir détails</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Tâches récentes et échéances */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Tâches récentes">
          <div className="space-y-3">
            {data.recentTasks.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Aucune tâche récente</p>
            ) : (
              data.recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-500">
                      Assigné à {task.employee?.first_name} {task.employee?.last_name}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status === 'completed' ? 'Terminé' :
                     task.status === 'in_progress' ? 'En cours' : 'En attente'}
                  </div>
                </div>
              ))
            )}
            {data.recentTasks.length > 0 && (
              <Link href="/tasks">
                <Button variant="outline" className="w-full mt-2">
                  Voir toutes les tâches
                </Button>
              </Link>
            )}
          </div>
        </Card>

        <Card title="Échéances à venir">
          <div className="space-y-3">
            {data.upcomingDeadlines.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Aucune échéance imminente</p>
            ) : (
              data.upcomingDeadlines.map((task) => (
                <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-500">
                      Due dans {formatDistanceToNow(new Date(task.due_date), { locale: fr, addSuffix: true })}
                    </p>
                  </div>
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Actions rapides</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link href="/employees/new">
            <Button variant="outline" className="w-full">
              + Ajouter un employé
            </Button>
          </Link>
          <Link href="/tasks/new">
            <Button variant="outline" className="w-full">
              + Créer une tâche
            </Button>
          </Link>
          <Link href="/attendance">
            <Button variant="outline" className="w-full">
              ⏱️ Pointer
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}