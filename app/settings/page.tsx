"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ name: "", city: "", phone: "", bio: "", farmType: "" });
  const [saved, setSaved] = useState(false);

  useEffect(()=>{
    setMounted(true);
    const u = JSON.parse(localStorage.getItem("contcrops_user") || "null") || { name: "hamza", city: "البحيرة", phone: "01000000000", bio: "مزارع شاب - متخصص طماطم", farmType: "طماطم، بطاطس" };
    setForm(u);
  },[]);

  const save = () => {
    localStorage.setItem("contcrops_user", JSON.stringify(form));
    setSaved(true);
    setTimeout(()=>setSaved(false), 2000);
  };

  const logout = () => {
    if (confirm("متأكد عايز تسجل خروج؟ كل بياناتك المحفوظة في المتصفح هتفضل موجودة بس هتسجل خروج من الحساب.")) {
      localStorage.removeItem("contcrops_user");
      // متتمسحش المنشورات والمتابعات - بس اليوزر
      router.push("/login");
    }
  };

  const logoutAll = () => {
    if (confirm("⚠️ تحذير: ده هيمسح كل حاجة: منشوراتك، متابعاتك، لايكاتك، كومنتاتك، رسايلك. متأكد؟")) {
      localStorage.clear();
      router.push("/login");
    }
  };

  if (!mounted) return <main dir="rtl" className="min-h-screen bg-[#f5f6f1] flex items-center justify-center"><p>جاري التحميل...</p></main>;

  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f6f1]">
      <header className="bg-white border-b sticky top-0 z-50 h-[56px] flex items-center">
        <div className="max-w-[600px] mx-auto w-full px-4 flex items-center justify-between">
          <Link href="/profile" className="bg-[#f0f1ed] w-8 h-8 rounded-full flex items-center justify-center">←</Link>
          <h1 className="font-black text-[16px]">⚙️ الإعدادات</h1>
          <Link href="/" className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-[12px]">C</Link>
        </div>
      </header>

      <div className="max-w-[600px] mx-auto px-3 py-4 space-y-4">
        {/* بروفايل */}
        <div className="bg-white rounded-[16px] border border-black/5 p-5">
          <h2 className="font-black text-[14px] mb-4">👤 الملف الشخصي</h2>
          
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 bg-[#2e7d32] rounded-full flex items-center justify-center text-white font-black text-[28px]">{form.name[0] || "أ"}</div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-gray-500">الاسم *</label>
              <input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full mt-1 bg-[#f5f6f1] border border-black/5 rounded-[12px] h-11 px-4 text-[13px] outline-none focus:border-black" placeholder="اسمك" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-500">المدينة</label>
                <select value={form.city} onChange={e=>setForm({...form, city: e.target.value})} className="w-full mt-1 bg-[#f5f6f1] border rounded-[12px] h-11 px-3 text-[13px]">
                  <option>البحيرة</option>
                  <option>كفر الشيخ</option>
                  <option>النوبارية</option>
                  <option>المنوفية</option>
                  <option>الدقهلية</option>
                  <option>الشرقية</option>
                  <option>الغربية</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-500">رقم الموبايل</label>
                <input value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} className="w-full mt-1 bg-[#f5f6f1] border rounded-[12px] h-11 px-4 text-[13px] outline-none" placeholder="01xxxxxxxxx" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-500">نوع المحاصيل</label>
              <input value={form.farmType} onChange={e=>setForm({...form, farmType: e.target.value})} className="w-full mt-1 bg-[#f5f6f1] border rounded-[12px] h-11 px-4 text-[13px] outline-none" placeholder="مثال: طماطم، بطاطس، برتقال" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-500">نبذة عنك</label>
              <textarea value={form.bio} onChange={e=>setForm({...form, bio: e.target.value})} className="w-full mt-1 bg-[#f5f6f1] border rounded-[12px] min-h-[80px] p-3 text-[13px] outline-none resize-none" placeholder="اكتب نبذة عن مزرعتك..." />
            </div>
          </div>

          <button onClick={save} className="w-full mt-5 bg-black text-white rounded-full py-3 font-bold text-[14px] hover:bg-zinc-800">
            {saved ? "✅ تم الحفظ" : "💾 حفظ التغييرات"}
          </button>
        </div>

        {/* إشعارات */}
        <div className="bg-white rounded-[16px] border border-black/5 p-5">
          <h2 className="font-black text-[14px] mb-4">🔔 الإشعارات</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between py-2 border-b border-black/5"><span className="text-[13px]">إشعارات الإعجابات ❤️</span><input type="checkbox" defaultChecked className="w-4 h-4 accent-black" /></label>
            <label className="flex items-center justify-between py-2 border-b border-black/5"><span className="text-[13px]">إشعارات التعليقات 💬</span><input type="checkbox" defaultChecked className="w-4 h-4 accent-black" /></label>
            <label className="flex items-center justify-between py-2 border-b border-black/5"><span className="text-[13px]">إشعارات المتابعين الجدد 👥</span><input type="checkbox" defaultChecked className="w-4 h-4 accent-black" /></label>
            <label className="flex items-center justify-between py-2"><span className="text-[13px]">إشعارات الرسائل ✉️</span><input type="checkbox" defaultChecked className="w-4 h-4 accent-black" /></label>
          </div>
        </div>

        {/* الأمان */}
        <div className="bg-white rounded-[16px] border border-black/5 p-5">
          <h2 className="font-black text-[14px] mb-4">🔒 الحساب</h2>
          <div className="space-y-2">
            <Link href="/profile" className="flex items-center justify-between p-3 bg-[#f5f6f1] rounded-[12px] hover:bg-[#f0f1ed]">
              <span className="text-[13px] font-bold">👤 عرض الملف الشخصي</span><span>←</span>
            </Link>
            <button onClick={logout} className="w-full flex items-center justify-between p-3 bg-[#fff8e1] rounded-[12px] hover:bg-[#ffecb3] text-right">
              <span className="text-[13px] font-bold">🚪 تسجيل خروج</span><span>←</span>
            </button>
            <button onClick={logoutAll} className="w-full flex items-center justify-between p-3 bg-[#ffebee] rounded-[12px] hover:bg-[#ffcdd2] text-right text-red-700">
              <span className="text-[13px] font-bold">🗑️ مسح كل البيانات وتسجيل خروج</span><span>←</span>
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-4 leading-4">• تسجيل الخروج العادي بيحذف اسمك بس وبيسيب منشوراتك ومتابعاتك<br/>• مسح كل البيانات بيمسح كل حاجة من المتصفح (لايكات، كومنتات، رسائل، منشورات)</p>
        </div>

        <div className="text-center py-4">
          <p className="text-[11px] text-gray-400">ContCrops v1.0 • صنع بكل حب للمزارعين المصريين 🌾</p>
        </div>
      </div>
    </main>
  );
}
