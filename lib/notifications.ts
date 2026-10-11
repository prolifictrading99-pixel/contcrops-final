import { isSupabaseConfigured, supabase } from "@/lib/supabase"

export type NotificationType =
  | "like"
  | "comment"
  | "follow"
  | "crop"
  | "contact"
  | "contract"
  | "rfq"
  | "discussion"
  | "message"
  | "share"

export type ActivityNotification = {
  id: string | number
  type: NotificationType | string
  actorId?: string | number | null
  actorName: string
  actorAvatar?: string
  title: string
  body: string
  relatedTitle?: string
  relatedType?: string
  relatedId?: string | number
  createdAt: string
  read: boolean
  target?: { type: string; id: string | number }
  self?: boolean
  icon?: string
  time?: string
}

export const NOTIFICATION_META: Record<string, { label: string; icon: string; tone: string }> = {
  like: { label: "إعجاب", icon: "♥", tone: "bg-rose-50 text-rose-700" },
  comment: { label: "تعليق", icon: "💬", tone: "bg-sky-50 text-sky-800" },
  follow: { label: "اهتمام", icon: "👥", tone: "bg-emerald-50 text-emerald-800" },
  crop: { label: "عرض جديد", icon: "🌱", tone: "bg-lime-50 text-lime-800" },
  contact: { label: "طلب تواصل", icon: "📞", tone: "bg-amber-50 text-amber-800" },
  contract: { label: "عقد", icon: "📄", tone: "bg-teal-50 text-teal-800" },
  rfq: { label: "عرض على طلب", icon: "📋", tone: "bg-orange-50 text-orange-800" },
  discussion: { label: "نقاش", icon: "🧵", tone: "bg-violet-50 text-violet-800" },
  message: { label: "رسالة", icon: "✉️", tone: "bg-slate-100 text-slate-700" },
  share: { label: "مشاركة", icon: "↗", tone: "bg-indigo-50 text-indigo-800" },
}

export function formatRelativeTimeAr(value?: string) {
  if (!value) return "الآن"
  if (/^منذ |الآن$/.test(value)) return value
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const diff = Date.now() - date.getTime()
  const minutes = Math.max(0, Math.floor(diff / 60000))
  if (minutes < 1) return "الآن"
  if (minutes < 60) return `منذ ${minutes} ${minutes === 1 ? "دقيقة" : minutes === 2 ? "دقيقتين" : "دقائق"}`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `منذ ${hours} ${hours === 1 ? "ساعة" : hours === 2 ? "ساعتين" : "ساعات"}`
  const days = Math.floor(hours / 24)
  if (days === 1) return "أمس"
  if (days < 7) return `منذ ${days} أيام`
  return date.toLocaleDateString("ar-EG", { day: "numeric", month: "short" })
}

export function isSelfNotification(notification: ActivityNotification, currentUserId?: string | number | null) {
  if (notification.self) return true
  if (currentUserId == null || currentUserId === "") return false
  return notification.actorId != null && String(notification.actorId) === String(currentUserId)
}

export function normalizeNotification(raw: any, currentUserId?: string | number | null): ActivityNotification | null {
  if (!raw) return null
  const createdAt = raw.createdAt || raw.created_at || new Date().toISOString()
  const notification: ActivityNotification = {
    id: raw.id ?? createdAt,
    type: raw.type || "message",
    actorId: raw.actorId ?? raw.actor_id ?? null,
    actorName: raw.actorName || raw.actor_name || raw.from || "زميل في ContCrops",
    actorAvatar: raw.actorAvatar || raw.actor_avatar || "",
    title: raw.title || "نشاط جديد",
    body: raw.body || raw.message || "",
    relatedTitle: raw.relatedTitle || raw.related_title || "",
    relatedType: raw.relatedType || raw.related_type || "",
    relatedId: raw.relatedId ?? raw.related_id,
    createdAt,
    read: Boolean(raw.read),
    target: raw.target,
    self: Boolean(raw.self),
    icon: raw.icon,
    time: raw.time,
  }
  if (isSelfNotification(notification, currentUserId)) return null
  return notification
}

export function filterPeerNotifications(list: any[], currentUserId?: string | number | null) {
  return (Array.isArray(list) ? list : [])
    .map((item) => normalizeNotification(item, currentUserId))
    .filter((item): item is ActivityNotification => Boolean(item))
}

export async function persistPeerNotification(input: {
  recipientId?: string | number | null
  actorId?: string | number | null
  actorName: string
  actorAvatar?: string
  type: NotificationType | string
  title: string
  body: string
  relatedTitle?: string
  relatedType?: string
  relatedId?: string | number
}) {
  if (!input.recipientId || String(input.recipientId) === String(input.actorId || "")) return
  if (!isSupabaseConfigured()) return
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (!uuid.test(String(input.recipientId))) return
  try {
    await supabase.from("activity_notifications").insert({
      recipient_id: input.recipientId,
      actor_id: uuid.test(String(input.actorId || "")) ? input.actorId : null,
      actor_name: input.actorName,
      actor_avatar: input.actorAvatar || "",
      type: input.type,
      title: input.title,
      body: input.body,
      related_title: input.relatedTitle || "",
      related_type: input.relatedType || "",
      related_id: input.relatedId != null ? String(input.relatedId) : "",
      read: false,
    })
  } catch (error) {
    console.error("Could not persist peer notification", error)
  }
}

export async function loadPeerNotifications(userId?: string | number | null) {
  if (!userId || !isSupabaseConfigured()) return [] as ActivityNotification[]
  const { data, error } = await supabase
    .from("activity_notifications")
    .select("*")
    .eq("recipient_id", userId)
    .neq("actor_id", userId)
    .order("created_at", { ascending: false })
    .limit(40)
  if (error) {
    console.error("Could not load notifications", error)
    return []
  }
  return filterPeerNotifications(data || [], userId)
}
