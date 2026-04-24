import { createBrowserClient } from '@supabase/ssr'

// Export nommé pour createClient
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// Export par défaut pour compatibilité
const supabase = createClient()
export default supabase