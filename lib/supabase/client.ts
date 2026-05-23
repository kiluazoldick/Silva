import { createBrowserClient } from '@supabase/ssr'

// Export nommé pour createClient
export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    // Fallback pour développement sans env vars
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    )
  }

  return createBrowserClient(url, key)
}

// Export par défaut pour compatibilité
const supabase = createClient()
export default supabase
