'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { Plus, CheckSquare } from 'lucide-react'

const supabase = createClient()

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadTasks = async () => {
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
        .from('tasks')
        .select('*')
        .eq('company_id', company.id)

      setTasks(data || [])
      setLoading(false)
    }

    loadTasks()
  }, [router])

  const pending = tasks.filter(t => t.status === 'pending').length
  const inProgress = tasks.filter(t => t.status === 'in_progress').length
  const completed = tasks.filter(t => t.status === 'completed').length
  const completionRate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tâches</h1>
          <p className="text-muted-foreground mt-1">Gérez vos tâches</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Créer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-3xl font-bold text-foreground mt-2">{tasks.length}</p>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm text-muted-foreground">En attente</p>
            <p className="text-3xl font-bold text-foreground mt-2">{pending}</p>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm text-muted-foreground">En cours</p>
            <p className="text-3xl font-bold text-foreground mt-2">{inProgress}</p>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm text-muted-foreground">Complétées</p>
            <p className="text-3xl font-bold text-foreground mt-2">{completed}</p>
          </div>
        </Card>
      </div>

      {/* Tasks List */}
      <Card>
        {loading ? (
          <div className="text-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <CheckSquare className="h-12 w-12 text-primary/20 mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune tâche</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map(task => (
              <div key={task.id} className="p-4 border border-border rounded-lg hover:bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{task.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded font-medium whitespace-nowrap ml-4 ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status === 'completed' ? 'Terminé' :
                     task.status === 'in_progress' ? 'En cours' : 'En attente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
