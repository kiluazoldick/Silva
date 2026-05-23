import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Silva - Gestion d\'Entreprise',
  description: 'Application complète de gestion d\'entreprise',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="bg-background text-foreground">
      <body className="font-sans antialiased transition-colors">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
