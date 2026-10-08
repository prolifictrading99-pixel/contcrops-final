import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
// Supabase الجديد بيستخدم sb_publishable_ والمشروع القديم بيستخدم anon key - ندعم الاتنين
const supabaseKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  ''

const isConfigured = !!supabaseUrl && !!supabaseKey

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
)

export const isSupabaseConfigured = () => isConfigured

// Helper للـ debug
if (typeof window !== 'undefined') {
  console.log('Supabase configured:', isConfigured, 'URL:', supabaseUrl ? '✅' : '❌', 'Key:', supabaseKey ? supabaseKey.slice(0,20)+'...' : '❌')
}
