'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { FeatureCard } from '@/components/ui/FeatureCard'
import { TestimonialCard } from '@/components/ui/TestimonialCard'
import { Accordion } from '@/components/ui/Accordion'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'
import { Users, CheckSquare, Clock, BarChart3, Building2, Calendar, ArrowRight, Zap, Shield, Rocket } from 'lucide-react'

const features = [
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Gestion des Employés',
    description: 'Ajoutez, modifiez et suivez tous vos employés avec des profils complets et détaillés'
  },
  {
    icon: <CheckSquare className="w-6 h-6" />,
    title: 'Suivi des Tâches',
    description: 'Assignez des tâches, définissez des priorités et suivez leur progression en temps réel'
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Présence',
    description: 'Système de check-in/out complet pour suivre les horaires et les absences'
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Statistiques',
    description: 'Analyses et rapports détaillés sur votre entreprise et ses performances'
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    title: 'Multi-secteurs',
    description: 'Adaptée à tous les secteurs d\'activité, des PME aux grandes entreprises'
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: 'Planning',
    description: 'Organisez facilement les plannings, congés et jours fériés'
  }
]

const howItWorks = [
  {
    number: '1',
    title: 'Créez votre compte',
    description: 'Inscrivez-vous en quelques secondes et configurer votre entreprise'
  },
  {
    number: '2',
    title: 'Ajoutez vos équipes',
    description: 'Invitez vos employés et assignez-leur des rôles appropriés'
  },
  {
    number: '3',
    title: 'Commencez à gérer',
    description: 'Créez des tâches, suivez la présence et analysez les performances'
  }
]

const testimonials = [
  {
    name: 'Marie Dupont',
    role: 'Directrice RH',
    company: 'TechCorp',
    content: 'Silva a transformé notre façon de gérer les employés. Interface intuitive et support réactif!',
    rating: 5,
    initials: 'MD'
  },
  {
    name: 'Jean Martin',
    role: 'Chef de Projet',
    company: 'BuildInc',
    content: 'Enfin un outil vraiment complet et facile à utiliser pour toute l\'équipe. Excellent rapport qualité-prix.',
    rating: 5,
    initials: 'JM'
  },
  {
    name: 'Sophie Laurent',
    role: 'PDG',
    company: 'Innovation Labs',
    content: 'Les statistiques en temps réel nous aident à prendre de meilleures décisions. Indispensable!',
    rating: 5,
    initials: 'SL'
  }
]

const faqItems = [
  {
    id: 'faq-1',
    title: 'Est-ce que Silva est sécurisé?',
    content: 'Oui, absolument. Nous utilisons le chiffrement SSL/TLS et respectons les normes GDPR. Vos données sont stockées sur des serveurs sécurisés.'
  },
  {
    id: 'faq-2',
    title: 'Puis-je importer mes données existantes?',
    content: 'Oui! Nous supportons l\'import CSV et pouvons vous aider à migrer vos données. Contactez notre support pour plus de détails.'
  },
  {
    id: 'faq-3',
    title: 'Y a-t-il une limite d\'utilisateurs?',
    content: 'Non, vous pouvez ajouter autant d\'utilisateurs que vous le souhaitez. Vous payez uniquement ce que vous utilisez.'
  },
  {
    id: 'faq-4',
    title: 'Quel est le délai de réponse du support?',
    content: 'Notre équipe support répond généralement en moins de 2 heures. Les clients premium bénéficient d\'un support prioritaire 24/7.'
  },
  {
    id: 'faq-5',
    title: 'Puis-je essayer gratuitement?',
    content: 'Oui, nous offrons un essai gratuit de 14 jours sans nécessiter de carte bancaire. Accès complet à toutes les fonctionnalités.'
  },
  {
    id: 'faq-6',
    title: 'Comment annuler mon abonnement?',
    content: 'Vous pouvez annuler à tout moment depuis votre tableau de bord. Aucun engagement à long terme, résiliation instantanée.'
  }
]

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              Silva
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Fonctionnalités
              </a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Comment ça marche
              </a>
              <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Témoignages
              </a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="outline" size="sm">Se connecter</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Commencer</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-primary-subtle opacity-40 blur-3xl -z-10"></div>
        
        <div className="max-w-5xl mx-auto text-center">
          <ScrollAnimation animation="fadeIn" duration={600}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              <Rocket className="w-4 h-4" />
              La gestion d&apos;entreprise, simplifiée
            </div>
          </ScrollAnimation>

          <ScrollAnimation animation="slideUp" delay={100} duration={600}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
              Gérez votre entreprise
              <span className="block gradient-primary bg-clip-text text-transparent"> simplement avec Silva</span>
            </h1>
          </ScrollAnimation>

          <ScrollAnimation animation="slideUp" delay={200} duration={600}>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
              La solution tout-en-un pour gérer vos employés, leurs tâches, suivre la présence et analyser les performances de votre entreprise.
            </p>
          </ScrollAnimation>

          <ScrollAnimation animation="slideUp" delay={300} duration={600}>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Commencer gratuitement <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Se connecter
                </Button>
              </Link>
            </div>
          </ScrollAnimation>

          <ScrollAnimation animation="slideUp" delay={400} duration={600}>
            <p className="text-sm text-muted-foreground">
              Essai gratuit de 14 jours. Aucune carte bancaire requise.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <ScrollAnimation animation="slideUp">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-balance">
                Toutes les fonctionnalités pour réussir
              </h2>
              <p className="text-xl text-muted-foreground">
                Tout ce dont vous avez besoin pour gérer votre entreprise efficacement
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <ScrollAnimation
                key={index}
                animation="slideUp"
                delay={index * 50}
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollAnimation animation="slideUp">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Comment ça marche</h2>
              <p className="text-xl text-muted-foreground">
                Trois étapes simples pour démarrer
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <ScrollAnimation
                key={index}
                animation="slideUp"
                delay={index * 100}
              >
                <div className="relative">
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                    {step.number}
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-12 w-full h-0.5 bg-primary/30"></div>
                  )}
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <ScrollAnimation animation="slideUp">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Ce que nos clients disent</h2>
              <p className="text-xl text-muted-foreground">
                Rejoignez les centaines d&apos;entreprises satisfaites
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <ScrollAnimation
                key={index}
                animation="slideUp"
                delay={index * 100}
              >
                <TestimonialCard {...testimonial} />
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <ScrollAnimation animation="slideUp">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Questions fréquemment posées</h2>
              <p className="text-xl text-muted-foreground">
                Trouvez réponses à vos questions
              </p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation animation="slideUp" delay={100}>
            <Accordion items={faqItems} />
          </ScrollAnimation>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollAnimation animation="slideUp">
            <h2 className="text-4xl font-bold mb-4 text-white text-balance">
              Commencez dès aujourd&apos;hui
            </h2>
            <p className="text-xl text-white/80 mb-8 text-balance">
              Essai gratuit de 14 jours. Aucune carte bancaire requise. Annulation à tout moment.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Créer mon compte
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Me connecter
                </Button>
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4 text-lg">Silva</h3>
              <p className="text-muted-foreground text-sm">
                La gestion d&apos;entreprise simplifiée
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Intégrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">CGU</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Sécurité</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Silva. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
