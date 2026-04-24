'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { SectorSelector } from '@/components/company/SectorSelector'
import { createClient } from '@/lib/supabase/client'
import { useCompanyStore } from '@/lib/store/companyStore'
import { Building2, Upload, Save, Trash2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmModal } from '@/components/ui/ConfirmModal'

const supabase = createClient()

export default function CompanyPage() {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    description: '',
    phone: '',
    address: '',
    website: '',
    logo: ''
  })
  const [originalData, setOriginalData] = useState<any>(null)
  const [hasChanges, setHasChanges] = useState(false)
  
  const { company, fetchCompany, updateCompany } = useCompanyStore()
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      await fetchCompany(user.id)
    }

    init()
  }, [router, fetchCompany])

  useEffect(() => {
    if (company) {
      const data = {
        name: company.name || '',
        sector: company.sector || '',
        description: company.description || '',
        phone: company.phone || '',
        address: company.address || '',
        website: company.website || '',
        logo: company.logo || ''
      }
      setFormData(data)
      setOriginalData(data)
    }
  }, [company])

  const handleChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    setHasChanges(JSON.stringify(newData) !== JSON.stringify(originalData))
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setUploading(true)
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

    handleChange('logo', publicUrl)
    setUploading(false)
    toast.success('Logo téléchargé avec succès')
  }

  const handleSubmit = async () => {
    if (!company) return

    setLoading(true)
    try {
      await updateCompany(company.id, formData)
      toast.success('Entreprise mise à jour avec succès')
      setOriginalData(formData)
      setHasChanges(false)
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCompany = async () => {
    if (!company) return

    setLoading(true)
    try {
      // Supprimer d'abord les données liées
      await supabase.from('tasks').delete().eq('company_id', company.id)
      await supabase.from('attendance').delete().eq('company_id', company.id)
      await supabase.from('employees').delete().eq('company_id', company.id)
      await supabase.from('companies').delete().eq('id', company.id)
      
      toast.success('Entreprise supprimée')
      router.push('/company-setup')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression')
    } finally {
      setLoading(false)
      setIsDeleteModalOpen(false)
    }
  }

  if (!company) {
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
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mon entreprise</h1>
        <p className="text-gray-600">
          Gérez les informations de votre entreprise
        </p>
      </div>

      {/* Logo */}
      <Card>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="relative">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-100">
              {formData.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={formData.logo} alt="Logo" className="h-32 w-32 rounded-full object-cover" />
              ) : (
                <Building2 className="h-16 w-16 text-gray-400" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700">
              <Upload className="h-4 w-4" />
              <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
            </label>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-900">Logo de l'entreprise</h3>
            <p className="text-sm text-gray-500">
              JPG, PNG ou GIF. Max 2MB.
            </p>
          </div>
        </div>
      </Card>

      {/* Informations */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Informations générales</h3>
          
          <Input
            label="Nom de l'entreprise *"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Ma Super Entreprise"
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Secteur d'activité *
            </label>
            <SectorSelector selected={formData.sector} onChange={(sector) => handleChange('sector', sector)} />
          </div>

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Décrivez votre entreprise..."
            rows={3}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Téléphone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+33 1 23 45 67 89"
            />
            <Input
              label="Site web"
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://monentreprise.com"
            />
          </div>

          <Input
            label="Adresse"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="123 Rue Example, Ville, Code Postal"
          />
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button
          variant="danger"
          onClick={() => setIsDeleteModalOpen(true)}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Supprimer l'entreprise
        </Button>
        
        <Button
          onClick={handleSubmit}
          loading={loading}
          disabled={!hasChanges}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Enregistrer les modifications
        </Button>
      </div>

      {/* Zone de danger */}
      <Card className="border-red-200 bg-red-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900">Zone de danger</h4>
            <p className="text-sm text-red-700">
              La suppression de l'entreprise est irréversible. Toutes les données 
              (employés, tâches, présences) seront définitivement supprimées.
            </p>
          </div>
        </div>
      </Card>

      {/* Modal confirmation suppression */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCompany}
        title="Supprimer l'entreprise"
        message={`Êtes-vous sûr de vouloir supprimer "${company.name}" ? Toutes les données associées seront perdues. Cette action est irréversible.`}
        loading={loading}
      />
    </div>
  )
}