"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddCropIsolated() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ crop: "", desc: "", price: "", city: "البحيرة", img: "" });

  useEffect(()=>{
    setMounted(true);
    const current = localStorage.getItem("contcrops_current_user");
    if (!current) {
      router.push("/login");
      return;
    }
    setCurrentUser(current);
  },[]);

  const handleSubmit = (e:any) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!form.crop || !form.price) {
      alert("اكتب اسم المحصول والسعر");
      return;
    }

    const newPost = {
      id: Date.now(),
      farmer: currentUser, // اسمك انت
      city: form.city,
      time: "الآن",
      crop: form.crop,
      desc: form.desc || "محصول طازج",
      price: form.price,
      img: form.img || `https://images.unsplash.com/photo-${1592924357228 + Math.floor(Math.random()*100)}?w=800`,
      isMine: true,
      baseLikes: 0
    };

    // احفظ في حسابك انت بس - منفصل تماماً
    const myPosts = JSON.parse(localStorage.getItem(`contcrops_posts_${currentUser}`) || "[]");
    localStorage.setItem(`contcrops_posts_${currentUser}`, JSON.stringify([newPost, ...myPosts]));

    alert(`✅ منشور "${form.crop}" اتحفظ في حساب ${currentUser} بس - مش هيظهر في حساب تاني`);
    router.push("/market");
  };

  if (!mounted) return <main dir="rtl" className="min-h-screen bg-[#f5f6f1] flex items-center justify-center"><p>جاري التحميل...</p></main>;

  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f6f1] p-4">
      <div className="max-w-[500px] mx-auto">
        <Link href="/market" className="inline-flex bg-white border px-4 py-2 rounded-full text-[13px] font-bold mb-4">← رجوع للسوق</Link>
        
        <div className="bg-white rounded-[20px] border p-6">
          <div className="bg-[#eef7e8] border border-green-200 rounded-[12px] p-3 mb-4">
            <p className="text-[12px] font-bold text-[#2e7d32]">🔒 هتنشر باسم: {currentUser}</p>
            <p className="text-[11px] text-gray-600 mt-1">المنشور ده هيظهر في حسابك انت بس ({currentUser}) ومش هيظهر في حساب تاني</p>
          </div>

          <h1 className="font-black text-[18px]">+ منشور جديد</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="text-[11px] font-bold">اسم المحصول *</label>
              <input value={form.crop} onChange={e=>setForm({...form, crop: e.target.value})} placeholder="مثال: طماطم بلدي - 2 طن" className="w-full mt-1 bg-[#f5f6f1] border rounded-[12px] h-11 px-4 text-[13px] outline-none focus:border-black" required />
            </div>
            <div>
              <label className="text-[11px] font-bold">الوصف</label>
              <textarea value={form.desc} onChange={e=>setForm({...form, desc: e.target.value})} placeholder="جودة عالية، قطف اليوم..." className="w-full mt-1 bg-[#f5f6f1] border rounded-[12px] p-3 text-[13px] min-h-[70px] outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold">السعر *</label>
                <input value={form.price} onChange={e=>setForm({...form, price: e.target.value})} placeholder="8.5" className="w-full mt-1 bg-[#f5f6f1] border rounded-[12px] h-11 px-4 text-[13px] outline-none" required />
              </div>
              <div>
                <label className="text-[11px] font-bold">المدينة</label>
                <select value={form.city} onChange={e=>setForm({...form, city: e.target.value})} className="w-full mt-1 bg-[#f5f6f1] border rounded-[12px] h-11 px-3 text-[13px]">
                  <option>البحيرة</option><option>كفر الشيخ</option><option>النوبارية</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold">رابط الصورة (اختياري)</label>
              <input value={form.img} onChange={e=>setForm({...form, img: e.target.value})} placeholder="https://..." className="w-full mt-1 bg-[#f5f6f1] border rounded-[12px] h-11 px-4 text-[13px] outline-none" />
            </div>
            <button type="submit" className="w-full bg-black text-white rounded-full py-3.5 font-black text-[14px]">نشر باسم {currentUser} 🚀</button>
          </form>
        </div>
      </div>
    </main>
  );
}
