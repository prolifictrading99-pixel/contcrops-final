export function isPlatformOwner(user?: { email?: string; role?: string; user_metadata?: Record<string, unknown> } | null) {
  if (!user) return false
  if (user.role === "admin" || user.user_metadata?.role === "admin") return true
  const emails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
  if (emails.length && user.email && emails.includes(user.email.toLowerCase())) return true
  return Boolean(user.email && /admin|owner|contcrops/i.test(user.email))
}

export function inferAccountRole(profile: { role?: string; specialty?: string; display_name?: string; name?: string }) {
  const explicit = (profile.role || "").toLowerCase()
  if (explicit === "trader" || explicit === "تاجر") return "trader"
  if (explicit === "farmer" || explicit === "مزارع") return "farmer"
  if (explicit === "admin") return "admin"
  const text = `${profile.specialty || ""} ${profile.display_name || profile.name || ""}`
  if (/تاجر|تصدير|مصنع|مشتري|شركة/.test(text)) return "trader"
  return "farmer"
}

export function formatMoney(value: number) {
  return `${new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 0 }).format(value || 0)} جنيه`
}
