import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { Employee } from '@/types'

const supabase = createClient()

interface EmployeeState {
  employees: Employee[]
  loading: boolean
  fetchEmployees: (companyId: string) => Promise<void>
  addEmployee: (employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => Promise<Employee | null>
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<void>
  deleteEmployee: (id: string) => Promise<void>
  getEmployeeById: (id: string) => Employee | undefined
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  loading: false,

  fetchEmployees: async (companyId: string) => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching employees:', error)
      set({ loading: false })
      return
    }

    set({ employees: data || [], loading: false })
  },

  addEmployee: async (employee) => {
    const { data, error } = await supabase
      .from('employees')
      .insert([employee])
      .select()
      .single()

    if (error) throw error

    set((state) => ({
      employees: [data, ...state.employees]
    }))

    return data
  },

  updateEmployee: async (id, employee) => {
    const { error } = await supabase
      .from('employees')
      .update(employee)
      .eq('id', id)

    if (error) throw error

    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === id ? { ...emp, ...employee } : emp
      )
    }))
  },

  deleteEmployee: async (id) => {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id)

    if (error) throw error

    set((state) => ({
      employees: state.employees.filter((emp) => emp.id !== id)
    }))
  },

  getEmployeeById: (id) => {
    return get().employees.find((emp) => emp.id === id)
  }
}))