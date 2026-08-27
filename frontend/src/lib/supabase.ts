import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const memoria = new Map<string, string>()

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: (chave) => memoria.get(chave) ?? null,
      setItem: (chave, valor) => {
        memoria.set(chave, valor)
      },
      removeItem: (chave) => {
        memoria.delete(chave)
      },
    },
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
