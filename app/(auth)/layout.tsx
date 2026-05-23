'use client'

import { useEffect, useState } from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-background grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex flex-col items-center justify-center p-8 relative overflow-hidden bg-gradient-primary">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-white text-center max-w-md">
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <h2 className="text-4xl font-bold mb-4">Bienvenue</h2>
          <p className="text-lg text-white/80 leading-relaxed">
            Gérez votre entreprise simplement avec Silva. Une solution complète pour vos employés, tâches et statistiques.
          </p>

          <div className="mt-12 space-y-4">
            {[
              { icon: '✓', text: 'Gestion complète des employés' },
              { icon: '✓', text: 'Suivi des tâches en temps réel' },
              { icon: '✓', text: 'Statistiques détaillées' }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 justify-start">
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-white/90">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">{mounted && children}</div>
      </div>
    </div>
  )
}
