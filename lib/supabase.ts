import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  ''

// Valid dummy JWT for build - won't work for real requests but won't crash build
const DUMMY_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDM0NjQzOTIsImV4cCI6MTk1OTA0MDM5Mn0.fake-signature'

const finalUrl = supabaseUrl || 'https://placeholder.supabase.co'
const finalKey = supabaseKey || DUMMY_KEY

const isConfigured = !!supabaseUrl && !!supabaseKey && supabaseUrl.includes('supabase.co')

export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
})

export const isSupabaseConfigured = () => isConfigured
