'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SectorSelector } from './SectorSelector'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Building2, Upload } from 'lucide-react'

const supabase = createClient()

const companySchema = z.object({
  name: z.string().min(2, 'Nom doit contenir au moins 2 caractères'),
  description: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url('URL invalide').optional().or(z.literal('')),
})

type CompanyForm = z.infer<typeof companySchema>

export function CreateCompanyForm() {
  const [sector, setSector] = useState('')
  const [uploading, setUploading] = useState(false)
  const [logoUrl, setLogoUrl] = useState('')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
  })

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    
    // Récupérer l'utilisateur actuel
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      toast.error('Vous devez être connecté')
      setUploading(false)
      return
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    const filePath = `logos/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('company-logos')
      .upload(filePath, file)

    if (uploadError) {
      toast.error('Erreur lors de l\'upload du logo')
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('company-logos')
      .getPublicUrl(filePath)

    setLogoUrl(publicUrl)
    setUploading(false)
    toast.success('Logo téléchargé avec succès')
  }

  const onSubmit = async (data: CompanyForm) => {
    if (!sector) {
      toast.error('Veuillez sélectionner un secteur d\'activité')
      return
    }

    // Récupérer l'utilisateur actuel
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      toast.error('Vous devez être connecté')
      return
    }

    console.log('Création entreprise pour user:', user.id)

    try {
      // Créer l'entreprise
      const { data: company, error } = await supabase
        .from('companies')
        .insert([{
          name: data.name,
          sector: sector,
          description: data.description || '',
          phone: data.phone || '',
          address: data.address || '',
          website: data.website || '',
          logo: logoUrl,
          owner_id: user.id,
        }])
        .select()
        .single()

      if (error) {
        console.error('Erreur Supabase:', error)
        toast.error(`Erreur: ${error.message}`)
        return
      }

      if (company) {
        console.log('Entreprise créée:', company)
        toast.success('Entreprise créée avec succès!')
        
        // Attendre un peu avant de rediriger
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh() // Forcer le rafraîchissement
        }, 1000)
      }
    } catch (error: any) {
      console.error('Erreur complète:', error)
      toast.error(`Erreur: ${error.message || 'Création impossible'}`)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-black">
      {/* Logo Upload */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Logo" className="h-24 w-24 rounded-full object-cover" />
            ) : (
              <Building2 className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-blue-600 p-1.5 text-white hover:bg-blue-700">
            <Upload className="h-4 w-4" />
            <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
          </label>
        </div>
        <p className="mt-2 text-xs text-gray-500">Logo de l'entreprise (optionnel)</p>
      </div>

      {/* Informations Entreprise */}
      <div className="space-y-4">
        <Input
          label="Nom de l'entreprise *"
          placeholder="Ma Super Entreprise"
          {...register('name')}
          error={errors.name?.message}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Secteur d'activité *
          </label>
          <SectorSelector selected={sector} onChange={setSector} />
        </div>

        <Input
          label="Description"
          placeholder="Décrivez votre entreprise..."
          {...register('description')}
          error={errors.description?.message}
        />

        <Input
          label="Téléphone"
          type="tel"
          placeholder="+33 1 23 45 67 89"
          {...register('phone')}
          error={errors.phone?.message}
        />

        <Input
          label="Adresse"
          placeholder="123 Rue Example, Ville, Code Postal"
          {...register('address')}
          error={errors.address?.message}
        />

        <Input
          label="Site web"
          type="url"
          placeholder="https://monentreprise.com"
          {...register('website')}
          error={errors.website?.message}
        />
      </div>

      <Button type="submit" className="w-full" loading={isSubmitting}>
        Créer mon entreprise
      </Button>
    </form>
  )
}