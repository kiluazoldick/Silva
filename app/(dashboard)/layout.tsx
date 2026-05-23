'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Clock, 
  BarChart3, 
  Building2,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Employés', href: '/employees', icon: Users },
  { name: 'Tâches', href: '/tasks', icon: CheckSquare },
  { name: 'Présence', href: '/attendance', icon: Clock },
  { name: 'Statistiques', href: '/statistics', icon: BarChart3 },
  { name: 'Entreprise', href: '/company', icon: Building2 },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [company, setCompany] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const checkAuthAndCompany = async () => {
      try {
        console.log('Vérification auth...')
        
        // Récupérer la session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          console.log('Pas de session, redirection login')
          router.push('/login')
          return
        }

        setUser(session.user)
        console.log('Utilisateur connecté:', session.user.id)

        // Récupérer l'entreprise
        const { data: company, error } = await supabase
          .from('companies')
          .select('*')
          .eq('owner_id', session.user.id)
          .maybeSingle() // Utiliser maybeSingle au lieu de single

        console.log('Résultat recherche entreprise:', { company, error })

        if (!company && pathname !== '/company-setup' && pathname !== '/') {
  console.log('Pas d\'entreprise, redirection vers company-setup')
  router.push('/company-setup')
  return
}

        if (company) {
          console.log('Entreprise trouvée:', company.name)
          setCompany(company)
          
          // Si on est sur company-setup et qu'on a une entreprise, rediriger vers dashboard
          if (pathname === '/company-setup') {
            router.push('/dashboard')
          }
        }
      } catch (error) {
        console.error('Erreur dans checkAuthAndCompany:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndCompany()
  }, [router, supabase, pathname])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Afficher le loader pendant la vérification
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  // Si pas d'utilisateur, ne pas afficher le dashboard
  if (!user) {
    return null
  }

  // Si pas d'entreprise et pas sur company-setup, ne pas afficher
  if (!company && pathname !== '/company-setup') {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-background border-r border-border shadow-lg transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-border px-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary"></div>
              <span className="text-xl font-bold gradient-primary bg-clip-text text-transparent">Silva</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-muted rounded transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User info */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3">
              <AvatarGenerator name={user?.email || ''} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.email?.split('@')[0]}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {company?.name || 'Créer une entreprise'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="p-2 hover:bg-muted"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-background">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 hover:bg-muted lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="hidden md:flex flex-1 max-w-xs">
              <SearchBar placeholder="Chercher..." />
            </div>
            
            <div className="flex items-center gap-3 ml-auto">
              <span className="hidden sm:text-xs text-muted-foreground">
                {new Date().toLocaleDateString('fr-FR', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              
              <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
              </button>
              
              <DarkModeToggle />
              
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors">
                <AvatarGenerator name={user?.email || ''} size="sm" />
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
