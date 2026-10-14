// lib/supabase.ts - النسخة الصحيحة لـ ContCrops + لوحة التحكم

import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// هل المتغيرات ناقصة؟ (عشان Vercel Build ما يقعش)
export const isPlaceholderMode = () => {
  return !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')
}

const isPlaceholder = isPlaceholderMode()

// 1. العميل العادي - للمنصة العامة (بيستخدم anon key)
export const supabase: SupabaseClient = isPlaceholder
  ? createClient('https://placeholder.supabase.co', 'placeholder-key')
  : createClient(supabaseUrl, supabaseAnonKey)

// 2. عميل الأدمن - للوحة التحكم فقط (بيستخدم service_role key) 🔑
// ده اللي هيحل رسالة "تعذر تحميل بعض بيانات الإدارة"
export const supabaseAdmin: SupabaseClient = (() => {
  if (isPlaceholder || !supabaseServiceRoleKey) {
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY ناقص - لوحة التحكم مش هتشتغل')
    return supabase // fallback مؤقت
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
})()

// للتوافق مع الكود القديم
export default supabase