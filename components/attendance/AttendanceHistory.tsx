'use client'

import { useEffect, useState } from 'react'
import { useAttendanceStore } from '@/lib/store/attendanceStore'
import { useEmployeeStore } from '@/lib/store/employeeStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Calendar, Clock, MapPin, TrendingUp, Users } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils/cn'

interface AttendanceHistoryProps {
  employeeId?: string
}

export function AttendanceHistory({ employeeId }: AttendanceHistoryProps) {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [selectedEmployee, setSelectedEmployee] = useState(employeeId || '')
  
  const { attendances, fetchAttendances, stats, getStats, loading } = useAttendanceStore()
  const { employees } = useEmployeeStore()

  useEffect(() => {
    if (selectedEmployee) {
      fetchAttendances(selectedEmployee)
      getStats(selectedEmployee, period)
    }
  }, [selectedEmployee, period, fetchAttendances, getStats])

  const getPeriodDates = () => {
    const now = new Date()
    switch (period) {
      case 'week':
        return '7 derniers jours'
      case 'month':
        return '30 derniers jours'
      case 'year':
        return '12 derniers mois'
    }
  }

  const statsCards = [
    {
      label: 'Heures totales',
      value: `${stats?.total_hours || 0}h`,
      icon: Clock,
      color: 'bg-blue-500'
    },
    {
      label: 'Jours présents',
      value: stats?.days_present || 0,
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      label: 'Moyenne/jour',
      value: `${stats?.average_hours || 0}h`,
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      label: 'Ponctualité',
      value: `${stats?.on_time_percentage || 0}%`,
      icon: Users,
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <Select
            options={[
              { value: 'week', label: 'Cette semaine' },
              { value: 'month', label: 'Ce mois' },
              { value: 'year', label: 'Cette année' }
            ]}
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="w-40"
          />
        </div>
        <p className="text-sm text-gray-500">
          {getPeriodDates()}
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`rounded-full ${stat.color} p-3`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Historique */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Historique des présences</h3>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
          ) : attendances.length === 0 ? (
            <div className="py-12 text-center">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">Aucune donnée de présence</p>
            </div>
          ) : (
            <div className="space-y-3">
              {attendances.map((attendance) => (
                <div
                  key={attendance.id}
                  className="flex flex-col gap-3 rounded-lg border border-gray-100 p-4 hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {format(new Date(attendance.date), 'EEEE d MMMM yyyy', { locale: fr })}
                      </p>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        <span>Check-in: {format(new Date(attendance.check_in), 'HH:mm')}</span>
                        {attendance.check_out && (
                          <span>Check-out: {format(new Date(attendance.check_out), 'HH:mm')}</span>
                        )}
                        {attendance.hours_worked && (
                          <span className="font-medium text-blue-600">
                            {attendance.hours_worked}h travaillées
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {(attendance.location_in || attendance.location_out) && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="h-3 w-3" />
                      <span>Localisé</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}