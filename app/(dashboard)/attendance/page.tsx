'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'
import { 
  Calendar, 
  Clock, 
  Save, 
  Trash2, 
  Users, 
  TrendingUp,
  Search,
  Filter,
  Download,
  ChevronRight,
  CheckCircle,
  XCircle,
  PlusCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { format, startOfMonth, endOfMonth, isToday, isSameDay } from 'date-fns'
import { fr } from 'date-fns/locale'

const supabase = createClient()

interface Employee {
  id: string
  first_name: string
  last_name: string
  position: string
  avatar_url?: string
}

interface AttendanceRecord {
  id: string
  employee_id: string
  date: string
  check_in: string
  check_out: string
  hours_worked: number
  notes: string
}

export default function AttendancePage() {
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [checkIn, setCheckIn] = useState('09:00')
  const [checkOut, setCheckOut] = useState('17:00')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [existingId, setExistingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployeeInfo, setSelectedEmployeeInfo] = useState<Employee | null>(null)
  const [employeeHistory, setEmployeeHistory] = useState<AttendanceRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [monthStats, setMonthStats] = useState({
    totalHours: 0,
    totalDays: 0,
    averageHours: 0,
    totalAbsences: 0
  })

  // Charger les employés
  useEffect(() => {
    const loadEmployees = async () => {
      setLoading(true)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      if (!company) {
        setLoading(false)
        return
      }

      const { data: employeesList } = await supabase
        .from('employees')
        .select('id, first_name, last_name, position')
        .eq('company_id', company.id)
        .order('first_name', { ascending: true })

      setEmployees(employeesList || [])
      setLoading(false)
    }

    loadEmployees()
  }, [])

  // Charger l'historique quand on sélectionne un employé
  useEffect(() => {
    if (selectedEmployee) {
      loadEmployeeHistory(selectedEmployee)
      const emp = employees.find(e => e.id === selectedEmployee)
      setSelectedEmployeeInfo(emp || null)
    } else {
      setEmployeeHistory([])
      setSelectedEmployeeInfo(null)
    }
  }, [selectedEmployee, employees])

  // Vérifier si présence existe déjà
  useEffect(() => {
    const checkExisting = async () => {
      if (!selectedEmployee || !date) return

      const { data } = await supabase
        .from('attendance')
        .select('id, check_in, check_out, notes')
        .eq('employee_id', selectedEmployee)
        .eq('date', date)
        .maybeSingle()

      if (data) {
        setExistingId(data.id)
        setCheckIn(format(new Date(data.check_in), 'HH:mm'))
        setCheckOut(data.check_out ? format(new Date(data.check_out), 'HH:mm') : '17:00')
        setNotes(data.notes || '')
      } else {
        setExistingId(null)
        setCheckIn('09:00')
        setCheckOut('17:00')
        setNotes('')
      }
    }

    checkExisting()
  }, [selectedEmployee, date])

  const loadEmployeeHistory = async (employeeId: string) => {
    const { data: history } = await supabase
      .from('attendance')
      .select('*')
      .eq('employee_id', employeeId)
      .order('date', { ascending: false })

    setEmployeeHistory(history || [])

    // Stats du mois
    const firstDay = format(startOfMonth(new Date()), 'yyyy-MM-dd')
    const lastDay = format(endOfMonth(new Date()), 'yyyy-MM-dd')
    
    const monthRecords = history?.filter(record => 
      record.date >= firstDay && record.date <= lastDay
    ) || []

    // Calculer les jours ouvrés (approx 22 jours par mois)
    const workingDays = 22
    const totalDays = monthRecords.length
    const totalHours = monthRecords.reduce((sum, r) => sum + (r.hours_worked || 0), 0)
    const averageHours = totalDays > 0 ? totalHours / totalDays : 0
    const totalAbsences = Math.max(0, workingDays - totalDays)

    setMonthStats({
      totalHours: Math.round(totalHours * 10) / 10,
      totalDays,
      averageHours: Math.round(averageHours * 10) / 10,
      totalAbsences
    })
  }

  const handleSave = async () => {
    if (!selectedEmployee) {
      toast.error('Sélectionnez un employé')
      return
    }

    setSaving(true)
    
    const checkInDateTime = new Date(`${date}T${checkIn}:00`)
    const checkOutDateTime = new Date(`${date}T${checkOut}:00`)
    const hoursWorked = (checkOutDateTime.getTime() - checkInDateTime.getTime()) / (1000 * 3600)

    if (hoursWorked <= 0) {
      toast.error('L\'heure de départ doit être après l\'heure d\'arrivée')
      setSaving(false)
      return
    }

    try {
      if (existingId) {
        const { error } = await supabase
          .from('attendance')
          .update({
            check_in: checkInDateTime.toISOString(),
            check_out: checkOutDateTime.toISOString(),
            hours_worked: hoursWorked,
            notes: notes
          })
          .eq('id', existingId)

        if (error) throw error
        toast.success('Présence mise à jour')
      } else {
        const { error } = await supabase
          .from('attendance')
          .insert([{
            employee_id: selectedEmployee,
            date: date,
            check_in: checkInDateTime.toISOString(),
            check_out: checkOutDateTime.toISOString(),
            hours_worked: hoursWorked,
            notes: notes
          }])

        if (error) throw error
        toast.success('Présence enregistrée')
      }
      
      await loadEmployeeHistory(selectedEmployee)
      
    } catch (error: any) {
      toast.error(error.message || 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!existingId) return

    setSaving(true)
    const { error } = await supabase
      .from('attendance')
      .delete()
      .eq('id', existingId)

    if (error) {
      toast.error('Erreur lors de la suppression')
    } else {
      toast.success('Présence supprimée')
      setExistingId(null)
      await loadEmployeeHistory(selectedEmployee)
    }
    setSaving(false)
  }

  const filteredEmployees = employees.filter(emp =>
    `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (hours: number) => {
    if (hours >= 8) return 'bg-green-100 text-green-700 border-green-200'
    if (hours >= 6) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    return 'bg-red-100 text-red-700 border-red-200'
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📊 Gestion des présences</h1>
          <p className="text-gray-600">Suivez et gérez les heures de travail de votre équipe</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonne gauche - Liste des employés */}
        <div className="lg:col-span-1">
          <Card>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un employé..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredEmployees.map((emp) => {
                  const isSelected = selectedEmployee === emp.id
                  const todayRecord = employeeHistory.find(r => isToday(new Date(r.date)))
                  const hasTodayRecord = selectedEmployee === emp.id && todayRecord
                  
                  return (
                    <button
                      key={emp.id}
                      onClick={() => setSelectedEmployee(emp.id)}
                      className={`w-full rounded-lg p-3 text-left transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-2 border-blue-500'
                          : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {emp.first_name} {emp.last_name}
                          </p>
                          <p className="text-sm text-gray-500">{emp.position}</p>
                        </div>
                        {hasTodayRecord && (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            <span>Présent</span>
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}

                {filteredEmployees.length === 0 && (
                  <div className="py-8 text-center">
                    <Users className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Aucun employé trouvé</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Colonne droite - Détails et formulaire */}
        <div className="lg:col-span-2 space-y-6">
          {selectedEmployeeInfo ? (
            <>
              {/* En-tête employé */}
              <Card>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                      <span className="text-2xl font-bold text-white">
                        {selectedEmployeeInfo.first_name[0]}{selectedEmployeeInfo.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedEmployeeInfo.first_name} {selectedEmployeeInfo.last_name}
                      </h2>
                      <p className="text-gray-500">{selectedEmployeeInfo.position}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Ce mois-ci</p>
                    <p className="text-2xl font-bold text-blue-600">{monthStats.totalHours}h</p>
                  </div>
                </div>
              </Card>

              {/* Statistiques rapides */}
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-3 text-center">
                  <p className="text-xs text-blue-600">Heures/mois</p>
                  <p className="text-xl font-bold text-blue-700">{monthStats.totalHours}h</p>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-3 text-center">
                  <p className="text-xs text-green-600">Jours présents</p>
                  <p className="text-xl font-bold text-green-700">{monthStats.totalDays}</p>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-3 text-center">
                  <p className="text-xs text-purple-600">Moyenne/jour</p>
                  <p className="text-xl font-bold text-purple-700">{monthStats.averageHours}h</p>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 p-3 text-center">
                  <p className="text-xs text-orange-600">Absences</p>
                  <p className="text-xl font-bold text-orange-700">{monthStats.totalAbsences}</p>
                </div>
              </div>

              {/* Formulaire */}
              <Card>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b pb-3">
                    <PlusCircle className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">
                      {existingId ? 'Modifier une présence' : 'Ajouter une présence'}
                    </h3>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="Date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="mb-2 block text-sm font-medium text-gray-700">Statut</label>
                        <div className={`rounded-lg border px-3 py-2 text-sm ${existingId ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                          {existingId ? '✓ Présence enregistrée' : '⭘ Nouvelle présence'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="Heure d'arrivée"
                      type="time"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                    <Input
                      label="Heure de départ"
                      type="time"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>

                  <Input
                    label="Notes"
                    placeholder="Congé, maladie, télétravail, heure sup..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />

                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleSave} loading={saving} className="flex-1 gap-2">
                      <Save className="h-4 w-4" />
                      {existingId ? 'Mettre à jour' : 'Enregistrer'}
                    </Button>
                    {existingId && (
                      <Button variant="danger" onClick={handleDelete} loading={saving} className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </Button>
                    )}
                  </div>
                </div>
              </Card>

              {/* Historique */}
              <Card>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b pb-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Historique des présences</h3>
                    <span className="ml-auto text-sm text-gray-500">
                      {employeeHistory.length} enregistrements
                    </span>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {employeeHistory.length === 0 ? (
                      <div className="py-8 text-center">
                        <Calendar className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">Aucune présence enregistrée</p>
                      </div>
                    ) : (
                      employeeHistory.map((record) => {
                        const isTodayRecord = isSameDay(new Date(record.date), new Date())
                        return (
                          <div
                            key={record.id}
                            className={`rounded-lg border p-3 transition-all hover:shadow-md ${
                              isTodayRecord ? 'border-blue-200 bg-blue-50' : 'border-gray-100 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`rounded-full p-2 ${getStatusColor(record.hours_worked)}`}>
                                  <Clock className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {format(new Date(record.date), 'EEEE d MMMM yyyy', { locale: fr })}
                                  </p>
                                  <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-500">
                                    <span>Arrivée: {format(new Date(record.check_in), 'HH:mm')}</span>
                                    <span>Départ: {record.check_out ? format(new Date(record.check_out), 'HH:mm') : '-'}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`text-lg font-bold ${record.hours_worked >= 7 ? 'text-green-600' : 'text-orange-600'}`}>
                                  {record.hours_worked}h
                                </p>
                                {record.notes && (
                                  <p className="text-xs text-gray-400">{record.notes}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <Card>
              <div className="py-12 text-center">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">Sélectionnez un employé</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Choisissez un employé dans la liste pour gérer ses présences
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {employees.length === 0 && (
        <Card>
          <div className="py-12 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun employé</h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez par ajouter des employés pour gérer leurs présences
            </p>
            <a href="/employees" className="mt-4 inline-block">
              <Button>Ajouter un employé</Button>
            </a>
          </div>
        </Card>
      )}
    </div>
  )
}