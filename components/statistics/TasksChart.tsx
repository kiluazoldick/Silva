'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const supabase = createClient()

interface TasksChartProps {
  companyId: string
}

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444']

export function TasksChart({ companyId }: TasksChartProps) {
  const [taskStats, setTaskStats] = useState<any[]>([])
  const [priorityStats, setPriorityStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: tasks } = await supabase
        .from('tasks')
        .select('status, priority')
        .eq('company_id', companyId)

      if (tasks) {
        // Statistiques par statut
        const statusCount = {
          pending: tasks.filter(t => t.status === 'pending').length,
          in_progress: tasks.filter(t => t.status === 'in_progress').length,
          completed: tasks.filter(t => t.status === 'completed').length,
          cancelled: tasks.filter(t => t.status === 'cancelled').length
        }

        setTaskStats([
          { name: 'À faire', value: statusCount.pending, color: COLORS[0] },
          { name: 'En cours', value: statusCount.in_progress, color: COLORS[1] },
          { name: 'Terminé', value: statusCount.completed, color: COLORS[2] },
          { name: 'Annulé', value: statusCount.cancelled, color: COLORS[3] }
        ])

        // Statistiques par priorité
        const priorityCount = {
          low: tasks.filter(t => t.priority === 'low').length,
          medium: tasks.filter(t => t.priority === 'medium').length,
          high: tasks.filter(t => t.priority === 'high').length,
          urgent: tasks.filter(t => t.priority === 'urgent').length
        }

        setPriorityStats([
          { name: 'Basse', value: priorityCount.low, color: '#9ca3af' },
          { name: 'Moyenne', value: priorityCount.medium, color: '#3b82f6' },
          { name: 'Haute', value: priorityCount.high, color: '#f59e0b' },
          { name: 'Urgente', value: priorityCount.urgent, color: '#ef4444' }
        ])
      }
      setLoading(false)
    }

    fetchData()
  }, [companyId])

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card><div className="h-64 animate-pulse rounded bg-gray-100" /></Card>
        <Card><div className="h-64 animate-pulse rounded bg-gray-100" /></Card>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card title="Statut des tâches">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={taskStats}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {taskStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Priorités des tâches">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={priorityStats}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {priorityStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}