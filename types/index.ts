export interface Company {
  id: string
  name: string
  sector: string
  logo?: string
  description?: string
  address?: string
  phone?: string
  website?: string
  owner_id: string
  created_at: string
  updated_at: string
}

export interface Employee {
  id: string
  company_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  position: string
  department?: string
  hire_date: string
  salary?: number
  status: 'active' | 'inactive' | 'on_leave'
  avatar_url?: string
  address?: string
  emergency_contact?: {
    name: string
    phone: string
    relationship: string
  }
  created_at: string
  updated_at: string
}

export type EmployeeFormData = Omit<Employee, 'id' | 'created_at' | 'updated_at' | 'company_id'>

export interface Task {
  id: string
  company_id: string
  assigned_to: string
  created_by: string
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date?: string
  completed_at?: string
  tags?: string[]
  attachments?: any
  created_at: string
  updated_at: string
}

export interface TaskFormData {
  title: string
  description?: string
  assigned_to: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date?: string
  tags?: string[]
}

export interface Attendance {
  id: string
  employee_id: string
  check_in: string
  check_out?: string
  date: string
  hours_worked?: number
  location_in?: {
    latitude: number
    longitude: number
    address?: string
  }
  location_out?: {
    latitude: number
    longitude: number
    address?: string
  }
  notes?: string
  created_at: string
}

export interface AttendanceStats {
  total_hours: number
  days_present: number
  average_hours: number
  on_time_percentage: number
}

export type Sector = 
  | 'technology'
  | 'healthcare'
  | 'finance'
  | 'education'
  | 'retail'
  | 'manufacturing'
  | 'construction'
  | 'transport'
  | 'other'