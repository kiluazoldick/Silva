'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Users, CheckSquare, Clock, BarChart3, Building2, Calendar, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Gestion des Employés',
    description: 'Ajoutez et suivez tous vos employés'
  },
  {
    icon: CheckSquare,
    title: 'Suivi des Tâches',
    description: 'Assignez des tâches et suivez leur progression'
  },
  {
    icon: Clock,
    title: 'Présence',
    description: 'Système de check-in/out complet'
  },
  {
    icon: BarChart3,
    title: 'Statistiques',
    description: 'Analyses et rapports détaillés'
  },
  {
    icon: Building2,
    title: 'Multi-secteurs',
    description: 'Adapté à tous les secteurs'
  },
  {
    icon: Calendar,
    title: 'Planning',
    description: 'Organisez facilement les plannings'
  }
]

const faq = [
  {
    q: 'Est-ce que Silva est sécurisé?',
    a: 'Oui, nous utilisons le chiffrement SSL/TLS et respectons les normes GDPR.'
  },
  {
    q: 'Puis-je importer mes données?',
    a: 'Oui, nous supportons l\'import CSV. Contactez notre support pour détails.'
  },
  {
    q: 'Y a-t-il une limite d\'utilisateurs?',
    a: 'Non, vous pouvez ajouter autant d\'utilisateurs que vous le souhaitez.'
  },
  {
    q: 'Puis-je essayer gratuitement?',
    a: 'Oui, 14 jours gratuit sans carte bancaire. Accès complet.'
  },
  {
    q: 'Comment annuler?',
    a: 'Vous pouvez annuler à tout moment. Aucun engagement à long terme.'
  }
]

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-cyan-600">
            Silva
          </Link>
          <div className="hidden md:flex gap-8 text-sm">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Fonctionnalités</a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900">FAQ</a>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm">Se connecter</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Commencer</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Gérez votre entreprise simplement
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            La solution tout-en-un pour gérer vos employés, leurs tâches, suivre la présence et analyser les performances.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Commencer gratuitement
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Se connecter
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            Essai gratuit de 14 jours. Aucune carte bancaire requise.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Les fonctionnalités dont vous avez besoin
            </h2>
            <p className="text-lg text-gray-600">
              Tout pour gérer votre entreprise efficacement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 hover:border-cyan-300 transition-colors">
                  <Icon className="w-8 h-8 text-cyan-600 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Créez un compte', desc: 'Inscrivez-vous en quelques secondes' },
              { step: '2', title: 'Ajoutez votre équipe', desc: 'Invitez vos employés simplement' },
              { step: '3', title: 'Commencez à gérer', desc: 'Créez des tâches et suivez tout' }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-600 text-white rounded-full font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
          </div>

          <div className="space-y-4">
            {faq.map((item, i) => (
              <details key={i} className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer group">
                <summary className="font-semibold text-gray-900 flex justify-between items-center">
                  {item.q}
                  <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-600 text-sm mt-4">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Commencez maintenant
          </h2>
          <p className="text-lg text-cyan-100 mb-8">
            14 jours gratuit. Aucune carte bancaire. Annulation à tout moment.
          </p>
          <Link href="/register">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Créer mon compte
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Silva</h3>
              <p className="text-gray-600 text-sm">La gestion d&apos;entreprise simplifiée</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-gray-900">Tarifs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">À propos</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Confidentialité</a></li>
                <li><a href="#" className="hover:text-gray-900">CGU</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2026 Silva. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
