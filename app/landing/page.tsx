'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Users, CheckSquare, Clock, BarChart3, Building2, Calendar } from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Gestion des Employés',
    description: 'Ajoutez, modifiez et suivez tous vos employés en un seul endroit'
  },
  {
    icon: CheckSquare,
    title: 'Suivi des Tâches',
    description: 'Assignez des tâches et suivez leur progression en temps réel'
  },
  {
    icon: Clock,
    title: 'Présence',
    description: 'Système de check-in/out pour suivre les horaires'
  },
  {
    icon: BarChart3,
    title: 'Statistiques',
    description: 'Analyses et rapports détaillés sur votre entreprise'
  },
  {
    icon: Building2,
    title: 'Multi-secteurs',
    description: 'Adapté à tous les secteurs d\'activité'
  },
  {
    icon: Calendar,
    title: 'Planning',
    description: 'Organisez les plannings et les congés'
  }
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl">
            Gérez votre entreprise
            <span className="text-blue-600"> simplement avec Silva</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            La solution tout-en-un pour gérer vos employés, leurs tâches, 
            suivre la présence et analyser les performances de votre entreprise.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg">Commencer gratuitement</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">Se connecter</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Toutes les fonctionnalités pour réussir
          </h2>
          <p className="text-xl text-gray-600">
            Tout ce dont vous avez besoin pour gérer votre entreprise efficacement
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <feature.icon className="mb-4 h-12 w-12 text-blue-600" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2026 Silva. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}