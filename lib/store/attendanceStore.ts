import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { Attendance, AttendanceStats } from '@/types'
import { format } from 'date-fns'

const supabase = createClient()

interface AttendanceState {
  attendances: Attendance[]
  currentAttendance: Attendance | null
  loading: boolean
  stats: AttendanceStats | null
  fetchAttendances: (employeeId: string, startDate?: string, endDate?: string) => Promise<void>
  checkIn: (employeeId: string, location?: { latitude: number; longitude: number }) => Promise<Attendance | null>
  checkOut: (attendanceId: string, location?: { latitude: number; longitude: number }) => Promise<void>
  getTodayAttendance: (employeeId: string) => Promise<Attendance | null>
  getStats: (employeeId: string, period?: 'week' | 'month' | 'year') => Promise<AttendanceStats>
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  attendances: [],
  currentAttendance: null,
  loading: false,
  stats: null,

  fetchAttendances: async (employeeId: string, startDate?: string, endDate?: string) => {
    set({ loading: true })
    let query = supabase
      .from('attendance')
      .select('*')
      .eq('employee_id', employeeId)
      .order('date', { ascending: false })

    if (startDate) {
      query = query.gte('date', startDate)
    }
    if (endDate) {
      query = query.lte('date', endDate)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching attendances:', error)
      set({ loading: false })
      return
    }

    set({ attendances: data || [], loading: false })
  },

  checkIn: async (employeeId: string, location?: { latitude: number; longitude: number }) => {
    const now = new Date()
    const today = format(now, 'yyyy-MM-dd')

    const attendanceData = {
      employee_id: employeeId,
      check_in: now.toISOString(),
      date: today,
      location_in: location || null
    }

    const { data, error } = await supabase
      .from('attendance')
      .insert([attendanceData])
      .select()
      .single()

    if (error) throw error

    set((state) => ({
      attendances: [data, ...state.attendances],
      currentAttendance: data
    }))

    return data
  },

  checkOut: async (attendanceId: string, location?: { latitude: number; longitude: number }) => {
    const now = new Date()
    
    const { data, error } = await supabase
      .from('attendance')
      .update({
        check_out: now.toISOString(),
        location_out: location || null
      })
      .eq('id', attendanceId)
      .select()
      .single()

    if (error) throw error

    set((state) => ({
      attendances: state.attendances.map(a => 
        a.id === attendanceId ? data : a
      ),
      currentAttendance: null
    }))
  },

  getTodayAttendance: async (employeeId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('date', today)
      .maybeSingle()

    if (error) {
      console.error('Error fetching today attendance:', error)
      return null
    }

    set({ currentAttendance: data })
    return data
  },

  getStats: async (employeeId: string, period: 'week' | 'month' | 'year' = 'month') => {
    const now = new Date()
    let startDate: Date
    
    switch (period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7))
        break
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1))
        break
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1))
        break
    }

    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('employee_id', employeeId)
      .gte('date', format(startDate, 'yyyy-MM-dd'))
      .lte('date', format(new Date(), 'yyyy-MM-dd'))

    if (error) throw error

    const totalHours = data.reduce((sum, a) => sum + (a.hours_worked || 0), 0)
    const daysPresent = data.length
    const averageHours = daysPresent > 0 ? totalHours / daysPresent : 0
    
    // Calcul du taux de ponctualité (check-in avant 9h)
    const onTimeCount = data.filter(a => {
      const checkInTime = new Date(a.check_in)
      const nineAM = new Date(a.check_in)
      nineAM.setHours(9, 0, 0)
      return checkInTime <= nineAM
    }).length
    
    const onTimePercentage = daysPresent > 0 ? (onTimeCount / daysPresent) * 100 : 0

    const stats = {
      total_hours: Math.round(totalHours * 10) / 10,
      days_present: daysPresent,
      average_hours: Math.round(averageHours * 10) / 10,
      on_time_percentage: Math.round(onTimePercentage)
    }

    set({ stats })
    return stats
  }
}))