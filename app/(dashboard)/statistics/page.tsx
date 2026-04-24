'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { 
  Users, 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'
import { format, startOfMonth, endOfMonth, subDays, eachDayOfInterval } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const supabase = createClient()

interface Employee {
  id: string
  first_name: string
  last_name: string
  position: string
  status: string
}

interface AttendanceRecord {
  id: string
  employee_id: string
  date: string
  hours_worked: number
}

interface Task {
  id: string
  status: string
  priority: string
}

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month')
  
  // Stats calculées
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0,
    totalHoursThisMonth: 0,
    avgHoursPerDay: 0,
    topEmployee: { name: '', hours: 0 }
  })

  const [dailyStats, setDailyStats] = useState<any[]>([])
  const [employeeRanking, setEmployeeRanking] = useState<any[]>([])
  const [taskStatusData, setTaskStatusData] = useState<any[]>([])
  const [taskPriorityData, setTaskPriorityData] = useState<any[]>([])

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444']

  // Charger toutes les données
  useEffect(() => {
    loadAllData()
  }, [period])

  const loadAllData = async () => {
    setLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Non authentifié')
        setLoading(false)
        return
      }

      // Récupérer l'entreprise
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      if (!company) {
        setLoading(false)
        return
      }

      // 1. Charger les employés
      const { data: employeesData } = await supabase
        .from('employees')
        .select('id, first_name, last_name, position, status')
        .eq('company_id', company.id)

      setEmployees(employeesData || [])
      
      const totalEmployees = employeesData?.length || 0
      const activeEmployees = employeesData?.filter(e => e.status === 'active').length || 0

      // 2. Charger les tâches
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('id, status, priority')
        .eq('company_id', company.id)

      setTasks(tasksData || [])
      
      const totalTasks = tasksData?.length || 0
      const completedTasks = tasksData?.filter(t => t.status === 'completed').length || 0
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

      // 3. Définir la période pour les présences
      const now = new Date()
      let startDate: Date
      let endDate = now

      switch (period) {
        case 'week':
          startDate = subDays(now, 7)
          break
        case 'month':
          startDate = startOfMonth(now)
          break
        case 'year':
          startDate = subDays(now, 365)
          break
        default:
          startDate = startOfMonth(now)
      }

      const startDateStr = format(startDate, 'yyyy-MM-dd')
      const endDateStr = format(endDate, 'yyyy-MM-dd')

      // 4. Charger les présences (sans company_id car n'existe pas)
      // On charge toutes les présences des employés de l'entreprise
      const employeeIds = employeesData?.map(e => e.id) || []
      
      let allAttendances: AttendanceRecord[] = []
      
      if (employeeIds.length > 0) {
        const { data: attendanceData } = await supabase
          .from('attendance')
          .select('id, employee_id, date, hours_worked')
          .in('employee_id', employeeIds)
          .gte('date', startDateStr)
          .lte('date', endDateStr)

        allAttendances = attendanceData || []
        setAttendances(allAttendances)
      }

      // Calculer les heures totales du mois
      const totalHoursThisMonth = allAttendances.reduce((sum, a) => sum + (a.hours_worked || 0), 0)
      
      // Calculer la moyenne par jour (jours avec présence)
      const uniqueDays = new Set(allAttendances.map(a => a.date)).size
      const avgHoursPerDay = uniqueDays > 0 ? totalHoursThisMonth / uniqueDays : 0

      // Trouver le top employé
      const employeeHours: Record<string, number> = {}
      allAttendances.forEach(a => {
        employeeHours[a.employee_id] = (employeeHours[a.employee_id] || 0) + (a.hours_worked || 0)
      })
      
      let topEmployeeId = ''
      let topHours = 0
      Object.entries(employeeHours).forEach(([id, hours]) => {
        if (hours > topHours) {
          topHours = hours
          topEmployeeId = id
        }
      })
      
      const topEmployee = employeesData?.find(e => e.id === topEmployeeId)
      const topEmployeeName = topEmployee ? `${topEmployee.first_name} ${topEmployee.last_name}` : '-'

      setStats({
        totalEmployees,
        activeEmployees,
        totalTasks,
        completedTasks,
        completionRate,
        totalHoursThisMonth: Math.round(totalHoursThisMonth * 10) / 10,
        avgHoursPerDay: Math.round(avgHoursPerDay * 10) / 10,
        topEmployee: { name: topEmployeeName, hours: Math.round(topHours * 10) / 10 }
      })

      // 5. Générer les stats quotidiennes pour le graphique
      const days = eachDayOfInterval({ start: startDate, end: endDate })
      const dailyData = days.map(day => {
        const dayStr = format(day, 'yyyy-MM-dd')
        const dayAttendances = allAttendances.filter(a => a.date === dayStr)
        const totalHours = dayAttendances.reduce((sum, a) => sum + (a.hours_worked || 0), 0)
        const presentCount = dayAttendances.length
        
        return {
          date: format(day, 'dd/MM'),
          heures: Math.round(totalHours * 10) / 10,
          presents: presentCount
        }
      })
      
      setDailyStats(dailyData)

      // 6. Classement des employés par heures
      const ranking = (employeesData || []).map(emp => ({
        id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
        position: emp.position,
        hours: Math.round((employeeHours[emp.id] || 0) * 10) / 10
      })).sort((a, b) => b.hours - a.hours).slice(0, 5)
      
      setEmployeeRanking(ranking)

      // 7. Stats des tâches par statut
      const statusCount = {
        pending: tasksData?.filter(t => t.status === 'pending').length || 0,
        in_progress: tasksData?.filter(t => t.status === 'in_progress').length || 0,
        completed: tasksData?.filter(t => t.status === 'completed').length || 0,
        cancelled: tasksData?.filter(t => t.status === 'cancelled').length || 0
      }
      
      setTaskStatusData([
        { name: 'À faire', value: statusCount.pending, color: COLORS[0] },
        { name: 'En cours', value: statusCount.in_progress, color: COLORS[1] },
        { name: 'Terminé', value: statusCount.completed, color: COLORS[2] },
        { name: 'Annulé', value: statusCount.cancelled, color: COLORS[3] }
      ])

      // 8. Stats des tâches par priorité
      const priorityCount = {
        low: tasksData?.filter(t => t.priority === 'low').length || 0,
        medium: tasksData?.filter(t => t.priority === 'medium').length || 0,
        high: tasksData?.filter(t => t.priority === 'high').length || 0,
        urgent: tasksData?.filter(t => t.priority === 'urgent').length || 0
      }
      
      setTaskPriorityData([
        { name: 'Basse', value: priorityCount.low, color: '#9ca3af' },
        { name: 'Moyenne', value: priorityCount.medium, color: '#3b82f6' },
        { name: 'Haute', value: priorityCount.high, color: '#f59e0b' },
        { name: 'Urgente', value: priorityCount.urgent, color: '#ef4444' }
      ])

    } catch (error) {
      console.error('Error loading stats:', error)
      toast.error('Erreur lors du chargement des statistiques')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    const csvData = [
      ['Date', 'Heures travaillées', 'Employés présents'],
      ...dailyStats.map(d => [d.date, d.heures, d.presents])
    ]
    
    const csv = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `statistiques_${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Export CSV effectué')
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📈 Statistiques</h1>
          <p className="text-gray-600">Analysez la performance de votre entreprise</p>
        </div>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button variant="outline" onClick={loadAllData} className="gap-2">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Employés</p>
              <p className="text-3xl font-bold">{stats.totalEmployees}</p>
              <p className="text-xs opacity-75">{stats.activeEmployees} actifs</p>
            </div>
            <Users className="h-8 w-8 opacity-75" />
          </div>
        </div>
        
        <div className="rounded-lg bg-gradient-to-br from-green-500 to-green-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Tâches complétées</p>
              <p className="text-3xl font-bold">{stats.completionRate}%</p>
              <p className="text-xs opacity-75">{stats.completedTasks}/{stats.totalTasks}</p>
            </div>
            <CheckSquare className="h-8 w-8 opacity-75" />
          </div>
        </div>
        
        <div className="rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Heures travaillées</p>
              <p className="text-3xl font-bold">{stats.totalHoursThisMonth}h</p>
              <p className="text-xs opacity-75">Moyenne: {stats.avgHoursPerDay}h/jour</p>
            </div>
            <Clock className="h-8 w-8 opacity-75" />
          </div>
        </div>
        
        <div className="rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Top performer</p>
              <p className="text-lg font-bold truncate">{stats.topEmployee.name}</p>
              <p className="text-xs opacity-75">{stats.topEmployee.hours} heures</p>
            </div>
            <TrendingUp className="h-8 w-8 opacity-75" />
          </div>
        </div>
      </div>

      {/* Graphique activité hebdomadaire */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">📊 Activité hebdomadaire</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-600">Heures travaillées</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600">Employés présents</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={dailyStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="heures"
              stroke="#3b82f6"
              name="Heures travaillées"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="presents"
              stroke="#10b981"
              name="Employés présents"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Graphiques tâches */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">📋 Statut des tâches</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {taskStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">🎯 Priorités des tâches</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskPriorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {taskPriorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Classement employés */}
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">🏆 Classement des employés</h3>
        <div className="space-y-3">
          {employeeRanking.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucune donnée disponible</p>
          ) : (
            employeeRanking.map((emp, index) => (
              <div key={emp.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{emp.name}</p>
                    <p className="text-xs text-gray-500">{emp.position}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">{emp.hours}h</p>
                  <p className="text-xs text-gray-500">heures travaillées</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}