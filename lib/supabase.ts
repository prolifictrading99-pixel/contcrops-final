// supabase.ts - ContCrops - إعداد احترافي
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// قراءة متغيرات البيئة
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // للسيرفر فقط - لا تستخدمه في الكلاينت

// قيم وهمية للبيلد فقط - لا تستخدم في الإنتاج
const PLACEHOLDER_URL = 'https://placeholder.supabase.co'
const PLACEHOLDER_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder-key-for-build-only'

// تحقق احترافي من الإعداد
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder'))

if (!isConfigured) {
  if (typeof window === 'undefined') {
    // سيرفر - تحذير في البيلد
    console.warn('⚠️ [Supabase] متغيرات البيئة غير موجودة - تأكد من إعداد Vercel Env Variables')
    console.warn('   المطلوب: NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY')
  } else {
    // كلاينت - تحذير في المتصفح
    console.warn('⚠️ [Supabase] غير مهيأ - بعض الخدمات قد لا تعمل')
  }
}

// القيم النهائية مع fallback آمن للبيلد
const finalUrl = supabaseUrl || PLACEHOLDER_URL
const finalKey = supabaseAnonKey || PLACEHOLDER_KEY

// إنشاء العميل الأساسي (للاستخدام في الكلاينت)
export const supabase: SupabaseClient = createClient(finalUrl, finalKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  // إعدادات إضافية للاستقرار
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'contcrops-web',
    },
  },
})

// عميل السيرفر (للاستخدام في API Routes و Server Components فقط)
// يستخدم Service Role Key - صلاحيات أعلى
export const supabaseAdmin: SupabaseClient | null = (() => {
  if (typeof window !== 'undefined') {
    // لا تنشئ admin client في المتصفح أبداً
    return null
  }
  if (!supabaseUrl || !supabaseServiceKey) {
    return null
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
})()

// دوال مساعدة احترافية

/**
 * هل Supabase مهيأ بشكل صحيح؟
 */
export const isSupabaseConfigured = (): boolean => {
  return isConfigured
}

/**
 * هل نحن في وضع البيلد الوهمي؟
 */
export const isPlaceholderMode = (): boolean => {
  return finalUrl.includes('placeholder') || finalKey.includes('placeholder')
}

/**
 * احصل على معلومات الاتصال (للت debugging)
 */
export const getSupabaseStatus = () => {
  return {
    configured: isConfigured,
    placeholder: isPlaceholderMode(),
    url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'غير موجود',
    hasAnonKey: !!supabaseAnonKey,
    hasServiceKey: !!supabaseServiceKey,
    environment: process.env.NODE_ENV,
  }
}

// تصدير افتراضي أيضاً
export default supabase
