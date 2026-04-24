'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { format, subDays } from 'date-fns'
import { fr } from 'date-fns/locale'

const supabase = createClient()

interface AttendanceChartProps {
  companyId: string
}

export function AttendanceChart({ companyId }: AttendanceChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      // Récupérer les 7 derniers jours
      const last7Days = [...Array(7)].map((_, i) => {
        const date = subDays(new Date(), 6 - i)
        return format(date, 'yyyy-MM-dd')
      })

      // Récupérer les présences
      const { data: attendances } = await supabase
        .from('attendance')
        .select('date, hours_worked')
        .eq('company_id', companyId)
        .gte('date', last7Days[0])

      const chartData = last7Days.map(date => {
        const dayAttendances = attendances?.filter(a => a.date === date) || []
        const totalHours = dayAttendances.reduce((sum, a) => sum + (a.hours_worked || 0), 0)
        const presentCount = dayAttendances.length

        return {
          date: format(new Date(date), 'EEEE', { locale: fr }),
          heures: Math.round(totalHours * 10) / 10,
          presents: presentCount
        }
      })

      setData(chartData)
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
    <Card title="Activité hebdomadaire">
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
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
  )
}