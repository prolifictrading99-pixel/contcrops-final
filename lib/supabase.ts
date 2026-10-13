import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  ''

const DUMMY_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.[STRIPPED 115 bytes].fake-signature'

const finalUrl = supabaseUrl || 'https://placeholder.supabase.co'
const finalKey = supabaseKey || DUMMY_KEY

const isConfigured = !!supabaseUrl && !!supabaseKey && supabaseUrl.includes('supabase.co')

export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
})

export const isSupabaseConfigured = () => isConfigured