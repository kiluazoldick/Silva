'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const handleCallback = async () => {
      console.log('Callback called with code:', searchParams.get('code'))
      
      // Récupérer la session
      const { data: { session }, error } = await supabase.auth.getSession()
      
      console.log('Session:', session)
      console.log('Error:', error)

      if (error) {
        console.error('Session error:', error)
        router.push('/login')
        return
      }

      if (!session) {
        console.log('No session found')
        router.push('/login')
        return
      }

      // Vérifier si l'utilisateur a une entreprise
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', session.user.id)
        .single()

      console.log('Company:', company)

      if (company) {
        router.push('/dashboard')
      } else {
        router.push('/company-setup')
      }
    }

    handleCallback()
  }, [router, supabase, searchParams])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="text-gray-600">Connexion en cours...</p>
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}