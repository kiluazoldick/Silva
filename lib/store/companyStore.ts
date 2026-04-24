import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { Company } from '@/types'

const supabase = createClient()

interface CompanyState {
  company: Company | null
  loading: boolean
  setCompany: (company: Company | null) => void
  fetchCompany: (userId: string) => Promise<void>
  createCompany: (data: Partial<Company>) => Promise<Company | null>
  updateCompany: (id: string, data: Partial<Company>) => Promise<void>
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  company: null,
  loading: false,
  setCompany: (company) => set({ company }),
  
  fetchCompany: async (userId: string) => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('owner_id', userId)
      .single()
    
    if (!error && data) {
      set({ company: data, loading: false })
    } else {
      set({ loading: false })
    }
  },
  
  createCompany: async (data: Partial<Company>) => {
    set({ loading: true })
    const { data: company, error } = await supabase
      .from('companies')
      .insert([data])
      .select()
      .single()
    
    if (error) throw error
    set({ company, loading: false })
    return company
  },
  
  updateCompany: async (id: string, data: Partial<Company>) => {
    const { error } = await supabase
      .from('companies')
      .update(data)
      .eq('id', id)
    
    if (error) throw error
    set({ company: { ...get().company, ...data } as Company })
  }
}))