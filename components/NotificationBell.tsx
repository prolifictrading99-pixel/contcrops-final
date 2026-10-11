"use client"

import { Bell } from "lucide-react"
import { ActivityNotification, NOTIFICATION_META, formatRelativeTimeAr } from "@/lib/notifications"

type Props = {
  notifications: ActivityNotification[]
  open: boolean
  onToggle: () => void
  onClose: () => void
  onOpen: (notification: ActivityNotification) => void
  onMarkAllRead: () => void
  onClear: () => void
  notifPermission: string
  onRequestPermission: () => void
}

export function NotificationBell({
  notifications,
  open,
  onToggle,
  onClose,
  onOpen,
  onMarkAllRead,
  onClear,
  notifPermission,
  onRequestPermission,
}: Props) {
  const unread = notifications.filter((item) => !item.read).length

  return (
    <div className="relative">
      <button
        id="notif-bell"
        type="button"
        aria-label={`الإشعارات${unread ? `، ${unread} غير مقروء` : ""}`}
        aria-expanded={open}
        onClick={onToggle}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
      >
        <Bell size={19} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <div
          id="notif-dropdown"
          className="absolute left-0 top-14 z-50 w-[min(24rem,calc(100vw-1.25rem))] overflow-hidden rounded-[22px] border border-slate-100 bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 p-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">نشاط الزملاء</h3>
              <p className="mt-0.5 text-[11px] text-slate-500">تفاعلات الآخرين على محاصيلك وعقودك ومنشوراتك</p>
            </div>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button type="button" onClick={onMarkAllRead} className="min-h-9 rounded-full px-2 text-[11px] font-bold text-emerald-700">
                  قراءة الكل
                </button>
              )}
              <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-xs" aria-label="إغلاق">
                ✕
              </button>
            </div>
          </div>
          <div className="max-h-[min(70vh,32rem)] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <p className="text-3xl">🔕</p>
                <p className="mt-3 text-sm font-extrabold text-slate-800">لا توجد إشعارات من الزملاء</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">ستظهر هنا إعجابات وتعليقات وعروض وطلبات التواصل من المستخدمين الآخرين فقط.</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const meta = NOTIFICATION_META[notif.type] || { label: "نشاط", icon: "🔔", tone: "bg-slate-100 text-slate-700" }
                const initial = (notif.actorName || "ز").trim().slice(0, 1)
                return (
                  <button
                    type="button"
                    key={notif.id}
                    onClick={() => onOpen(notif)}
                    className={`flex min-h-[4.5rem] w-full gap-3 border-b border-slate-50 p-3.5 text-right hover:bg-slate-50 ${!notif.read ? "bg-emerald-50/40" : ""}`}
                  >
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-emerald-50 text-center text-sm font-black leading-[44px] text-emerald-800">
                      {initial}
                      {notif.actorAvatar ? (
                        <img src={notif.actorAvatar} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none" }} />
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-[13px] font-extrabold text-slate-900">{notif.actorName}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${meta.tone}`}>{meta.icon} {meta.label}</span>
                        {!notif.read && <span className="rounded-full bg-[#0a84ff] px-2 py-0.5 text-[9px] font-bold text-white">جديد</span>}
                      </span>
                      <span className="mt-1 block text-[12px] leading-5 text-slate-600">{notif.body || notif.title}</span>
                      {notif.relatedTitle ? (
                        <span className="mt-1 inline-flex max-w-full items-center rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-700">
                          {notif.relatedType === "contract" ? "عقد" : notif.relatedType === "rfq" ? "طلب شراء" : "محصول"}: {notif.relatedTitle}
                        </span>
                      ) : null}
                      <span className="mt-1 block text-[10px] text-slate-400">{formatRelativeTimeAr(notif.createdAt || notif.time)}</span>
                    </span>
                    {!notif.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />}
                  </button>
                )
              })
            )}
          </div>
          <div className="flex gap-2 bg-slate-50 p-3">
            {notifPermission !== "granted" && (
              <button type="button" onClick={onRequestPermission} className="h-11 flex-1 rounded-full bg-slate-900 text-xs font-bold text-white">
                تفعيل إشعارات المتصفح
              </button>
            )}
            {notifications.length > 0 && (
              <button type="button" onClick={onClear} className="h-11 flex-1 rounded-full border border-rose-100 bg-white text-xs font-bold text-rose-700">
                مسح الكل
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
