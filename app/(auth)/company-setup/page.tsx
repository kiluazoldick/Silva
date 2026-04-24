'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreateCompanyForm } from '@/components/company/CreateCompanyForm'
import { createClient } from '@/lib/supabase/client'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function CompanySetupPage() {
  const [loading, setLoading] = useState(true)
  const [hasCompany, setHasCompany] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUserAndCompany = async () => {
      try {
        // Vérifier l'utilisateur
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }

        // Vérifier si l'utilisateur a déjà une entreprise
        const { data: company, error } = await supabase
          .from('companies')
          .select('id')
          .eq('owner_id', user.id)
          .single()

        if (company) {
          // Rediriger vers dashboard si entreprise existe déjà
          router.push('/dashboard')
        } else {
          // Afficher le formulaire
          setHasCompany(false)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error checking company:', error)
        setLoading(false)
      }
    }

    checkUserAndCompany()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Vérification de votre compte...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Link href="/">
            <h1 className="text-3xl font-bold text-gray-900">Silva</h1>
        </Link>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Configurez votre entreprise
          </h1>
          <p className="text-gray-600">
            Commençons par créer votre espace de travail
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <CreateCompanyForm />
        </div>
      </div>
    </div>
  )
}