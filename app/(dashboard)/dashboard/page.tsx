'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { Users, CheckSquare, Clock, TrendingUp, ArrowRight, Calendar, AlertCircle, Zap, Target } from 'lucide-react'
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
      <div className="min-h-screen flex items-center justify-center p-4">
        
          <Card className="max-w-md w-full border-primary/20 bg-gradient-primary-subtle">
            <div className="text-center py-12">
              <div className="inline-flex p-4 rounded-full bg-primary/20 mb-6">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Bienvenue sur Silva! 👋
              </h3>
              <p className="text-muted-foreground mb-8">
                Commencez par créer votre entreprise pour accéder à toutes les fonctionnalités
              </p>
              <Link href="/company-setup" className="w-full block">
                <Button className="w-full">
                  Créer mon entreprise
                </Button>
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
    <div className="space-y-8">
      {/* Welcome Banner */}
      
        <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">
              Bonjour {userName} 👋
            </h1>
            <p className="text-white/80 text-lg">
              Bienvenue sur <strong>{data.companyName}</strong>
            </p>
          </div>
        </div>
      

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            
              <Link href={stat.link}>
                <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/30 h-full group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="mt-3 text-4xl font-bold text-foreground">{stat.value}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{stat.subValue}</p>
                    </div>
                    <div className={`rounded-lg ${stat.color} p-3 text-white group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-primary gap-1 pt-4 border-t border-border group-hover:gap-2 transition-all">
                    <span>Voir détails</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </Card>
              </Link>
            
          )
        })}
      </div>

      {/* Tasks & Deadlines */}
      <div className="grid gap-6 lg:grid-cols-2">
        
          <Card className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Tâches récentes</h3>
              <Link href="/tasks" className="text-primary hover:text-primary/80 text-sm font-medium">
                Voir plus →
              </Link>
            </div>
            
            <div className="flex-1 space-y-2">
              {data.recentTasks.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  <p className="text-sm">Aucune tâche récente</p>
                </div>
              ) : (
                data.recentTasks.map((task, index) => (
                  <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group">
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      readOnly
                      className="mt-1 rounded cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {task.employee?.first_name} {task.employee?.last_name}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                      task.status === 'completed' ? 'bg-success/10 text-success' :
                      task.status === 'in_progress' ? 'bg-primary/10 text-primary' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {task.status === 'completed' ? 'Terminé' :
                       task.status === 'in_progress' ? 'En cours' : 'En attente'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        

        
          <Card className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Échéances à venir
              </h3>
            </div>
            
            <div className="flex-1 space-y-2">
              {data.upcomingDeadlines.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  <p className="text-sm">Aucune échéance imminente</p>
                </div>
              ) : (
                data.upcomingDeadlines.map((task) => (
                  <div key={task.id} className="p-3 rounded-lg border border-border hover:border-primary/30 transition-colors bg-card">
                    <p className="font-medium text-sm text-foreground">{task.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Échéance {formatDistanceToNow(new Date(task.due_date), { locale: fr, addSuffix: true })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        
      </div>

      {/* Quick Actions */}
      
        <Card>
          <h3 className="mb-6 text-lg font-semibold text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Actions rapides
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link href="/employees/new" className="block">
              <Button variant="outline" className="w-full">
                <Users className="w-4 h-4 mr-2" />
                Ajouter un employé
              </Button>
            </Link>
            <Link href="/tasks/new" className="block">
              <Button variant="outline" className="w-full">
                <CheckSquare className="w-4 h-4 mr-2" />
                Créer une tâche
              </Button>
            </Link>
            <Link href="/attendance" className="block">
              <Button variant="outline" className="w-full">
                <Clock className="w-4 h-4 mr-2" />
                Pointer la présence
              </Button>
            </Link>
          </div>
        </Card>
      
    </div>
  )
}
