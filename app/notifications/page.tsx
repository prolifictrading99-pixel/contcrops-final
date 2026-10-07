"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filter, setFilter] = useState("الكل");

  useEffect(()=>{
    const saved = JSON.parse(localStorage.getItem("contcrops_notifications") || "[]");
    if (saved.length === 0) {
      // إشعارات تجريبية أول مرة
      const demo = [
        { id: 1, type: "like", from: "الحاج سعيد", text: "أعجب بمنشورك: طماطم بلدي - 2 طن", time: "منذ 5 دقائق", read: false },
        { id: 2, type: "comment", from: "مزرعة النور", text: "علق على منشورك: السعر كام يا غالي؟", time: "منذ ساعة", read: false },
        { id: 3, type: "follow", from: "أبو خالد", text: "بدأ يتابعك - تابعه عشان تشوف منشوراته", time: "منذ 3 ساعات", read: false },
        { id: 4, type: "like", from: "الحاج سعيد", text: "أعجب بثريدك: نصيحة عن الكالسيوم", time: "أمس", read: true },
      ];
      setNotifications(demo);
      localStorage.setItem("contcrops_notifications", JSON.stringify(demo));
    } else {
      setNotifications(saved);
    }
  },[]);

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem("contcrops_notifications", JSON.stringify(updated));
  };

  const markOneRead = (id: number) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem("contcrops_notifications", JSON.stringify(updated));
  };

  const deleteOne = (id: number) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem("contcrops_notifications", JSON.stringify(updated));
  };

  const clearAll = () => {
    if(confirm("تمسح كل الإشعارات؟")) {
      setNotifications([]);
      localStorage.setItem("contcrops_notifications", JSON.stringify([]));
    }
  };

  const filtered = notifications.filter(n => {
    if (filter === "الكل") return true;
    if (filter === "غير مقروءة") return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    if (type === "like") return "❤️";
    if (type === "comment") return "💬";
    if (type === "follow") return "👥";
    return "🔔";
  };

  const getColor = (type: string) => {
    if (type === "like") return "bg-red-50 border-red-200";
    if (type === "comment") return "bg-blue-50 border-blue-200";
    if (type === "follow") return "bg-green-50 border-green-200";
    return "bg-gray-50";
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f6f1]">
      <header className="bg-white border-b sticky top-0 z-50 h-[56px] flex items-center">
        <div className="max-w-[1000px] mx-auto w-full px-4 flex items-center justify-between">
          <Link href="/market" className="bg-[#f0f1ed] w-8 h-8 rounded-full flex items-center justify-center">←</Link>
          <h1 className="font-black text-[16px]">🔔 الإشعارات {unreadCount>0 && `(${unreadCount} جديدة)`}</h1>
          <Link href="/market" className="flex items-center gap-2 font-black">ContCrops <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">C</div></Link>
        </div>
      </header>

      <div className="max-w-[600px] mx-auto px-3 py-4">
        <div className="bg-white rounded-[16px] border border-black/5 p-3 flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "الكل", value: "الكل" },
              { label: `غير مقروءة (${unreadCount})`, value: "غير مقروءة" },
              { label: "❤️ إعجابات", value: "like" },
              { label: "💬 تعليقات", value: "comment" },
              { label: "👥 متابعات", value: "follow" },
            ].map(cat=>(
              <button key={cat.value} onClick={()=>setFilter(cat.value)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold border ${filter===cat.value ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-black/10'}`}>{cat.label}</button>
            ))}
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={markAllRead} className="text-[11px] bg-[#f0f1ed] px-3 py-1.5 rounded-full font-bold hover:bg-black hover:text-white">✓ قراءة الكل</button>
            <button onClick={clearAll} className="text-[11px] bg-red-50 text-red-600 px-3 py-1.5 rounded-full font-bold hover:bg-red-100">مسح الكل</button>
          </div>
        </div>

        {filtered.length===0 ? (
          <div className="bg-white rounded-[20px] border p-10 text-center mt-4">
            <p className="text-[50px]">🔕</p>
            <h2 className="font-black text-[16px] mt-3">مفيش إشعارات</h2>
            <p className="text-[13px] text-gray-500 mt-2">لما حد يعمل لايك أو كومنت أو يتابعك هتظهر هنا</p>
            <Link href="/market" className="inline-block mt-6 bg-black text-white px-6 py-2.5 rounded-full text-[13px] font-bold">روح السوق</Link>
          </div>
        ) : (
          <div className="space-y-2 mt-4">
            {filtered.map((n:any)=>(
              <div key={n.id} className={`bg-white rounded-[16px] border p-4 flex gap-3 relative ${!n.read ? getColor(n.type) + ' border' : 'border-black/5'} ${!n.read ? 'shadow-sm' : ''}`}>
                {!n.read && <div className="absolute top-4 left-4 w-2 h-2 bg-[#0a84ff] rounded-full"></div>}
                <div className="w-10 h-10 bg-[#f0f1ed] rounded-full flex items-center justify-center text-[18px] shrink-0">{getIcon(n.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/farmer/${encodeURIComponent(n.from)}`} className="font-bold text-[13px] hover:underline">{n.from}</Link>
                    <span className="text-[10px] text-gray-400">· {n.time}</span>
                    {!n.read && <span className="bg-[#0a84ff] text-white text-[9px] px-2 py-0.5 rounded-full">جديد</span>}
                  </div>
                  <p className="text-[13px] text-gray-700 mt-1 leading-5">{n.text}</p>
                  <div className="flex gap-2 mt-3">
                    <Link href={`/farmer/${encodeURIComponent(n.from)}`} className="bg-black text-white px-4 py-1.5 rounded-full text-[11px] font-bold hover:bg-zinc-800">عرض البروفايل</Link>
                    {!n.read && <button onClick={()=>markOneRead(n.id)} className="bg-[#f0f1ed] px-4 py-1.5 rounded-full text-[11px] font-bold hover:bg-gray-200">✓ تمت القراءة</button>}
                    <button onClick={()=>deleteOne(n.id)} className="text-[11px] text-gray-400 hover:text-red-500 px-2">حذف</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-[16px] border border-black/5 p-4 mt-6">
          <h3 className="font-bold text-[13px]">إعدادات الإشعارات</h3>
          <div className="mt-3 space-y-3 text-[12px]">
            <label className="flex items-center justify-between"><span>🔔 إشعارات الإعجابات</span><input type="checkbox" defaultChecked className="w-4 h-4" /></label>
            <label className="flex items-center justify-between"><span>💬 إشعارات التعليقات</span><input type="checkbox" defaultChecked className="w-4 h-4" /></label>
            <label className="flex items-center justify-between"><span>👥 إشعارات المتابعين الجدد</span><input type="checkbox" defaultChecked className="w-4 h-4" /></label>
          </div>
        </div>
      </div>
    </main>
  );
}
