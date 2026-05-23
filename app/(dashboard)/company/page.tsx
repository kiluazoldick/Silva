'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { createClient } from '@/lib/supabase/client'
import { Building2, Save } from 'lucide-react'

const supabase = createClient()

export default function CompanyPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [company, setCompany] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    description: '',
    phone: '',
    address: '',
    website: ''
  })
  const router = useRouter()

  useEffect(() => {
    const loadCompany = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setCompany(data)
        setFormData(data)
      }
      setLoading(false)
    }

    loadCompany()
  }, [router])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!company) return
    setSaving(true)
    
    const { error } = await supabase
      .from('companies')
      .update(formData)
      .eq('id', company.id)

    setSaving(false)
    if (!error) {
      setCompany({ ...company, ...formData })
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Building2 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Entreprise</h1>
          <p className="text-muted-foreground mt-1">Gérez les informations de votre entreprise</p>
        </div>
      </div>

      {/* Company Info */}
      <Card className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Nom</label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Nom de votre entreprise"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Secteur</label>
          <Input
            value={formData.sector}
            onChange={(e) => handleChange('sector', e.target.value)}
            placeholder="ex: Technologie, Commerce, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Description de votre entreprise"
            rows={4}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Téléphone</label>
            <Input
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+33 1 23 45 67 89"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Site web</label>
            <Input
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Adresse</label>
          <Textarea
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Adresse complète"
            rows={3}
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
