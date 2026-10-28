import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

/** Lazily creates the Supabase client from env. Only called in live mode. */
export function getSupabaseClient(): SupabaseClient {
  if (client) return client
  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    throw new Error('Live mode requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example).')
  }
  client = createClient(url, anonKey)
  return client
}
