import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

// Si no hay credenciales, la app corre en modo DEMO con datos locales.
export const HAS_SUPABASE = Boolean(url && anon)

export const supabase = HAS_SUPABASE ? createClient(url, anon) : null
