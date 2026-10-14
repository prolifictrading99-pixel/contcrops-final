// lib/supabase.ts - النسخة النهائية لـ ContCrops

import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// هل المتغيرات ناقصة؟ (عشان Vercel Build ما يقعش)
export const isPlaceholderMode = () => {
  return !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')
}

// للتوافق مع الملفات القديمة زي /admin/colleagues
export const isSupabaseConfigured = () => !isPlaceholderMode()
export const isConfigured = () => !isPlaceholderMode()

const isPlaceholder = isPlaceholderMode()

// 1. العميل العادي - للمنصة العامة (anon key)
export const supabase: SupabaseClient = isPlaceholder
  ? createClient('https://placeholder.supabase.co', 'placeholder-key')
  : createClient(supabaseUrl, supabaseAnonKey)

// 2. عميل الأدمن - للوحة التحكم فقط (service_role key) 🔑
export const supabaseAdmin: SupabaseClient = (() => {
  if (isPlaceholder || !supabaseServiceRoleKey) {
    if (typeof window === 'undefined') {
      console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY ناقص - لوحة التحكم مش هتشتغل')
    }
    return supabase
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
})()

export default supabase