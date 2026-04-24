import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

// Remplacer Inter par une police système
export const metadata: Metadata = {
  title: 'Silva - Gestion d\'Entreprise',
  description: 'Application complète de gestion d\'entreprise',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}