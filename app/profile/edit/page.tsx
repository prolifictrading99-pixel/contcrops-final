"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Link from "next/link";


export default function MyProfilePage(){
  const [profile, setProfile] = useState<any>(null);
  const [myCrops, setMyCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function load(){
      // هات بروفايل افتراضي (اول واحد) - بعدين هنربطه بالـ Auth
      const { data: prof } = await supabase.from("profiles").select("*").limit(1).single();
      if(prof){
        setProfile(prof);
        const { data: crops } = await supabase.from("crops").select("*").eq("farmer_phone", prof.phone).order("created_at", {ascending: false});
        setMyCrops(crops || []);
      } else {
        // بيانات تجريبية لو مفيش بروفايل
        setProfile({
          name: "الحاج محمد - مزارع",
          phone: "01012345678",
          city: "البحيرة",
          role: "farmer",
          bio: "مزارع خبرة 20 سنة في زراعة الطماطم والبطاطس. جودة عالية وتوصيل للعبور.",
          verified: true,
          rating: 4.8,
          total_sales: 120,
          joined_at: "2023-01-15"
        });
        setMyCrops([
          { id: "1", name: "طماطم بلدي", price: 12, quantity: 500, image_url: "https://images.unsplash.com/photo-1561136594-7f68413baa99?w=400" },
          { id: "2", name: "بطاطس تحمير", price: 15, quantity: 1000, image_url: "https://images.unsplash.com/photo-1518977676608-bd36c2ca4f33?w=400" },
        ]);
      }
      setLoading(false);
    }
    load();
  },[]);

  if(loading) return <div className="min-h-screen flex items-center justify-center bg-[#f8fdf8]">🌿 جاري تحميل البروفايل...</div>;

  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fdf8] pb-24">
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="font-black text-lg">حسابي 👤</h1>
          <Link href="/profile/edit" className="text-xs font-bold bg-black text-white px-4 py-2 rounded-full">تعديل ✏️</Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto">
        {/* كارت البروفايل الرئيسي */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6">
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-green-700 font-black text-2xl border-4 border-white/30">{profile.name?.[0]}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-black text-xl">{profile.name}</h2>
                {profile.verified && <span className="bg-white/20 backdrop-blur border border-white/30 px-2 py-0.5 rounded-full text-[10px]">✓ موثق</span>}
              </div>
              <div className="text-sm opacity-90 mt-1">📍 {profile.city} • {profile.role === 'farmer' ? 'مزارع' : 'تاجر'}</div>
              <div className="flex gap-2 mt-3">
                <div className="bg-white/20 backdrop-blur rounded-full px-3 py-1 text-xs">⭐ {profile.rating || "4.8"} تقييم</div>
                <div className="bg-white/20 backdrop-blur rounded-full px-3 py-1 text-xs">🛒 {profile.total_sales || myCrops.length} عملية بيع</div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 opacity-90 bg-black/10 rounded-xl p-3">{profile.bio}</p>
        </div>

        {/* احصائيات */}
        <div className="grid grid-cols-3 gap-3 px-4 -mt-6">
          <div className="bg-white rounded-2xl border p-4 text-center shadow-sm">
            <div className="text-2xl">📦</div><div className="font-black text-lg mt-1">{myCrops.length}</div><div className="text-[11px] text-gray-400">محاصيل</div>
          </div>
          <div className="bg-white rounded-2xl border p-4 text-center shadow-sm">
            <div className="text-2xl">💰</div><div className="font-black text-lg mt-1">45K</div><div className="text-[11px] text-gray-400">مبيعات</div>
          </div>
          <div className="bg-white rounded-2xl border p-4 text-center shadow-sm">
            <div className="text-2xl">👁️</div><div className="font-black text-lg mt-1">1.2k</div><div className="text-[11px] text-gray-400">مشاهدة</div>
          </div>
        </div>

        {/* محاصيلي */}
        <div className="px-4 mt-6">
          <div className="flex justify-between items-center">
            <h3 className="font-black">محاصيلي 🌾</h3>
            <Link href="/dashboard/add" className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-full font-bold">+ إضافة محصول</Link>
          </div>
          
          <div className="mt-3 space-y-3">
            {myCrops.map(c=>(
              <Link key={c.id} href={`/crop/${c.id}`} className="flex gap-3 bg-white border rounded-2xl p-3 hover:shadow-md transition">
                <img src={c.image_url} className="w-20 h-20 rounded-xl object-cover" alt={c.name} />
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{c.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{c.quantity} طن • {c.city || profile.city}</p>
                  <p className="font-black text-green-600 mt-2">{c.price} ج</p>
                </div>
                <div className="text-gray-300 self-center">‹</div>
              </Link>
            ))}
            {myCrops.length===0 && <div className="text-center py-10 text-sm text-gray-400">لسه مضفتش محاصيل</div>}
          </div>
        </div>

        {/* اعدادات */}
        <div className="px-4 mt-8 space-y-2">
          <h3 className="font-black mb-3">الإعدادات ⚙️</h3>
          <button className="w-full bg-white border rounded-2xl p-4 flex justify-between items-center text-sm font-bold"><span>🔔 الإشعارات</span><span className="text-gray-300">‹</span></button>
          <button className="w-full bg-white border rounded-2xl p-4 flex justify-between items-center text-sm font-bold"><span>🔒 الخصوصية</span><span className="text-gray-300">‹</span></button>
          <button className="w-full bg-white border rounded-2xl p-4 flex justify-between items-center text-sm font-bold text-red-500"><span>🚪 تسجيل خروج</span><span className="text-gray-300">‹</span></button>
        </div>
      </div>
    </main>
  )
}
