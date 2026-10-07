"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function FarmersPage(){
  const [farmers, setFarmers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(()=>{
    const load = async()=>{
      // هات المزارعين من المحاصيل
      const { data: crops } = await supabase.from("crops").select("farmer_name, farmer_phone, city, image_url");
      if(crops){
        const map = new Map();
        crops.forEach((c:any)=>{
          if(!map.has(c.farmer_phone)){
            map.set(c.farmer_phone, { name: c.farmer_name, phone: c.farmer_phone, city: c.city, cropsCount: 1, image: c.image_url });
          } else {
            const f = map.get(c.farmer_phone);
            f.cropsCount += 1;
            map.set(c.farmer_phone, f);
          }
        });
        setFarmers(Array.from(map.values()));
      }
      setLoading(false);

      const me = JSON.parse(localStorage.getItem("contcrops_user") || "null");
      if(me?.phone){
        const { count } = await supabase.from("notifications").select("*", {count:"exact", head:true}).eq("to_phone", me.phone).eq("is_read", false);
        setNotifCount(count||0);
      }
    };
    load();
  },[]);

  const goToProfile = ()=>{
    const me = JSON.parse(localStorage.getItem("contcrops_user") || "null");
    if(!me?.phone){ window.location.href="/login"; return; }
    if(me.role === 'admin') window.location.href="/dashboard";
    else window.location.href=`/users/${me.phone}`;
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fdf8] pb-24">
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto p-3 flex justify-between items-center">
          <h1 className="font-black text-green-600">المجتمع 🧑‍🌾</h1>
          <Link href="/market" className="text-xs bg-gray-100 px-3 py-1.5 rounded-full">السوق 🛒</Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-3">
        {loading ? <p className="text-center text-xs text-gray-400 mt-10">جاري تحميل المزارعين...</p> : (
          <div className="grid grid-cols-1 gap-3">
            {farmers.map((f:any)=>(
              <Link key={f.phone} href={`/users/${f.phone}`} className="bg-white border rounded-2xl p-3 flex items-center gap-3 hover:shadow">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-black">{f.name?.[0]}</div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{f.name}</p>
                  <p className="text-[11px] text-gray-400">📍 {f.city} • {f.cropsCount} محصول • {f.phone}</p>
                </div>
                <span className="text-xs bg-black text-white px-3 py-1 rounded-full">عرض</span>
              </Link>
            ))}
          </div>
        )}
        {!loading && farmers.length===0 && <p className="text-center text-xs text-gray-400 mt-10">مفيش مزارعين لسه</p>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="max-w-6xl mx-auto flex justify-around py-2">
          <Link href="/market" className="flex flex-col items-center text-gray-400">
            <span className="text-lg">🛒</span><span className="text-[10px]">السوق</span>
          </Link>
          <Link href="/farmers" className="flex flex-col items-center text-green-600">
            <span className="text-lg">🧑‍🌾</span><span className="text-[10px] font-bold">المجتمع</span>
          </Link>
          <Link href="/prices" className="flex flex-col items-center text-gray-400">
            <span className="text-lg">📊</span><span className="text-[10px]">الاسعار</span>
          </Link>
          <Link href="/notifications" className="flex flex-col items-center text-gray-400 relative">
            <span className="text-lg">🔔</span><span className="text-[10px]">الاشعارات</span>
            {notifCount>0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{notifCount}</span>}
          </Link>
          <button onClick={goToProfile} className="flex flex-col items-center text-gray-400">
            <span className="text-lg">👤</span><span className="text-[10px]">حسابي</span>
          </button>
        </div>
      </div>
    </main>
  )
}
