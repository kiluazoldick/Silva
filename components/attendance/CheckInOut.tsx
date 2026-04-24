'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAttendanceStore } from '@/lib/store/attendanceStore'
import { useAuthStore } from '@/lib/store/authStore'
import { useEmployeeStore } from '@/lib/store/employeeStore'
import { createClient } from '@/lib/supabase/client'
import { Clock, LogIn, LogOut, MapPin, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const supabase = createClient()

export function CheckInOut() {
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [employeeId, setEmployeeId] = useState<string | null>(null)
  
  const { currentAttendance, checkIn, checkOut, getTodayAttendance } = useAttendanceStore()
  const { employees, fetchEmployees } = useEmployeeStore()
  const { user } = useAuthStore()

  useEffect(() => {
    const init = async () => {
      if (!user) return

      // Récupérer l'employé correspondant à l'utilisateur
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      if (company) {
        await fetchEmployees(company.id)
        
        // Chercher l'employé avec le même email que l'utilisateur
        const employee = employees.find(e => e.email === user.email)
        if (employee) {
          setEmployeeId(employee.id)
          await getTodayAttendance(employee.id)
        }
      }
    }

    init()
  }, [user, employees, fetchEmployees, getTodayAttendance])

  const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Géolocalisation non supportée'))
      }
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
  }

  const handleCheckIn = async () => {
    if (!employeeId) {
      toast.error('Vous n\'êtes pas enregistré comme employé')
      return
    }

    setLoading(true)
    try {
      let locationData = null
      try {
        const position = await getCurrentLocation()
        locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        toast.success('Localisation enregistrée')
      } catch (error) {
        console.log('Location not available')
      }

      await checkIn(employeeId, locationData)
      toast.success('Check-in effectué avec succès!')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du check-in')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckOut = async () => {
    if (!currentAttendance) {
      toast.error('Aucun check-in trouvé')
      return
    }

    setLoading(true)
    try {
      let locationData = null
      try {
        const position = await getCurrentLocation()
        locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        toast.success('Localisation enregistrée')
      } catch (error) {
        console.log('Location not available')
      }

      await checkOut(currentAttendance.id, locationData)
      toast.success('Check-out effectué avec succès!')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du check-out')
    } finally {
      setLoading(false)
    }
  }

  if (!employeeId) {
    return (
      <Card>
        <div className="text-center py-8">
          <XCircle className="mx-auto h-12 w-12 text-yellow-500 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Compte non lié
          </h3>
          <p className="text-gray-600">
            Votre compte utilisateur n'est pas encore associé à un employé.
            Veuillez contacter l'administrateur.
          </p>
        </div>
      </Card>
    )
  }

  const hasCheckedIn = currentAttendance && !currentAttendance.check_out
  const hasCheckedOut = currentAttendance && currentAttendance.check_out

  return (
    <Card>
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className={`rounded-full p-4 ${hasCheckedOut ? 'bg-green-100' : hasCheckedIn ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Clock className={`h-8 w-8 ${hasCheckedOut ? 'text-green-600' : hasCheckedIn ? 'text-blue-600' : 'text-gray-600'}`} />
          </div>
        </div>

        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          {hasCheckedOut 
            ? 'Journée terminée' 
            : hasCheckedIn 
              ? 'En service' 
              : 'Prêt à commencer'}
        </h3>

        {currentAttendance && (
          <div className="mb-6 space-y-2 text-sm text-gray-600">
            <p>Check-in: {format(new Date(currentAttendance.check_in), 'HH:mm', { locale: fr })}</p>
            {currentAttendance.check_out && (
              <p>Check-out: {format(new Date(currentAttendance.check_out), 'HH:mm', { locale: fr })}</p>
            )}
            {currentAttendance.hours_worked && (
              <p className="font-semibold text-blue-600">
                Heures travaillées: {currentAttendance.hours_worked}h
              </p>
            )}
          </div>
        )}

        {!hasCheckedOut && (
          <Button
            onClick={hasCheckedIn ? handleCheckOut : handleCheckIn}
            loading={loading}
            size="lg"
            className="gap-2"
          >
            {hasCheckedIn ? (
              <>
                <LogOut className="h-5 w-5" />
                Check-out
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Check-in
              </>
            )}
          </Button>
        )}

        {location && (
          <div className="mt-4 flex items-center justify-center gap-1 text-xs text-gray-500">
            <MapPin className="h-3 w-3" />
            <span>Localisation enregistrée</span>
          </div>
        )}
      </div>
    </Card>
  )
}