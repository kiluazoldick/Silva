import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { Task } from '@/types'

const supabase = createClient()

interface TaskState {
  tasks: Task[]
  loading: boolean
  fetchTasks: (companyId: string) => Promise<void>
  addTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'completed_at'>) => Promise<Task | null>
  updateTask: (id: string, task: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  updateTaskStatus: (id: string, status: Task['status']) => Promise<void>
  getTasksByStatus: (status: Task['status']) => Task[]
  getTasksByEmployee: (employeeId: string) => Task[]
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,

  fetchTasks: async (companyId: string) => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('company_id', companyId)
      .order('due_date', { ascending: true, nullsLast: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tasks:', error)
      set({ loading: false })
      return
    }

    set({ tasks: data || [], loading: false })
  },

  addTask: async (task) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single()

    if (error) throw error

    set((state) => ({
      tasks: [data, ...state.tasks]
    }))

    return data
  },

  updateTask: async (id, task) => {
    const updateData = { ...task }
    
    // Si le statut devient completed, ajouter la date de complétion
    if (task.status === 'completed' && !task.completed_at) {
      updateData.completed_at = new Date().toISOString()
    }
    
    const { error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)

    if (error) throw error

    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updateData } : task
      )
    }))
  },

  deleteTask: async (id) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) throw error

    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id)
    }))
  },

  updateTaskStatus: async (id, status) => {
    const updateData: Partial<Task> = { status }
    
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    } else if (status !== 'completed') {
      updateData.completed_at = null
    }
    
    const { error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)

    if (error) throw error

    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updateData } : task
      )
    }))
  },

  getTasksByStatus: (status) => {
    return get().tasks.filter((task) => task.status === status)
  },

  getTasksByEmployee: (employeeId) => {
    return get().tasks.filter((task) => task.assigned_to === employeeId)
  }
}))