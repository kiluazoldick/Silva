'use client'

import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Building2, Users, CheckSquare, BarChart3, CheckCircle } from 'lucide-react'

export const onboardingSteps = [
  {
    id: 'company',
    title: 'Créez votre entreprise',
    description: 'Configurer les informations de base de votre entreprise',
    icon: <Building2 className="w-6 h-6" />,
    content: (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Nom de l&apos;entreprise
          </label>
          <Input
            type="text"
            placeholder="Ex: TechCorp SA"
            className="rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Secteur d&apos;activité
          </label>
          <select className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option>Sélectionner un secteur</option>
            <option>Technologie</option>
            <option>Commerce</option>
            <option>Services</option>
            <option>Fabrication</option>
            <option>Autre</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Nombre d&apos;employés
          </label>
          <Input
            type="number"
            placeholder="Estimé"
            className="rounded-lg"
          />
        </div>
      </div>
    ),
  },
  {
    id: 'team',
    title: 'Invitez votre équipe',
    description: 'Ajoutez les membres de votre équipe pour commencer',
    icon: <Users className="w-6 h-6" />,
    content: (
      <div className="space-y-4">
        <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm text-foreground">
            💡 Conseil: Commencez par ajouter votre manager ou superviseur pour mieux organiser votre équipe.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email du premier membre
          </label>
          <Input
            type="email"
            placeholder="membre@entreprise.com"
            className="rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Nom et prénom
          </label>
          <Input
            type="text"
            placeholder="Jean Dupont"
            className="rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Rôle
          </label>
          <select className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option>Manager</option>
            <option>Employé</option>
            <option>Superviseur</option>
            <option>RH</option>
          </select>
        </div>
      </div>
    ),
  },
  {
    id: 'tasks',
    title: 'Créez votre première tâche',
    description: 'Organisez le travail avec un système de tâches efficace',
    icon: <CheckSquare className="w-6 h-6" />,
    content: (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Titre de la tâche
          </label>
          <Input
            type="text"
            placeholder="Ex: Réviser les rapports Q1"
            className="rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            placeholder="Décrivez la tâche en détail..."
            className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Assigné à
            </label>
            <select className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Sélectionner</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Priorité
            </label>
            <select className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Normal</option>
              <option>Haute</option>
              <option>Basse</option>
            </select>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'complete',
    title: 'Vous êtes prêt!',
    description: 'Commencez à gérer votre entreprise',
    icon: <BarChart3 className="w-6 h-6" />,
    content: (
      <div className="text-center py-8">
        <div className="inline-flex p-6 rounded-full bg-primary/10 mb-6">
          <CheckCircle className="w-12 h-12 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Bienvenue dans Silva!
        </h3>
        <p className="text-muted-foreground text-lg mb-6">
          Vous êtes maintenant prêt à commencer. Explorez toutes les fonctionnalités et gérez votre entreprise efficacement.
        </p>
        <div className="grid grid-cols-2 gap-4 mt-8">
          {[
            { icon: '📊', label: 'Tableaux de bord' },
            { icon: '👥', label: 'Équipe' },
            { icon: '✓', label: 'Tâches' },
            { icon: '📈', label: 'Statistiques' },
          ].map((feature) => (
            <div key={feature.label} className="p-4 rounded-lg bg-card border border-border">
              <div className="text-2xl mb-2">{feature.icon}</div>
              <p className="text-sm font-medium text-foreground">{feature.label}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
]
