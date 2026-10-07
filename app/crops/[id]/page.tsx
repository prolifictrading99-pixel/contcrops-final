"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function CropDetailsPage(){
  const params = useParams();
  const [crop, setCrop] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const load = async ()=>{
      const { data } = await supabase.from("crops").select("*").eq("id", params.id).single();
      setCrop(data);
      setLoading(false);
    };
    load();
  },[params.id]);

  if(loading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  if(!crop) return <div className="min-h-screen flex items-center justify-center">المحصول مش موجود</div>;

  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fdf8] pb-10">
      <div className="max-w-2xl mx-auto p-4">
        {/* صورة المحصول - بدون أي Link */}
        <div className="bg-white rounded-[24px] overflow-hidden border">
          <img src={crop.image_url} alt={crop.name} className="w-full h-[320px] object-cover" />
          <div className="p-4">
            <h1 className="font-black text-lg">{crop.name}</h1>
            <p className="text-sm text-gray-500 mt-2 leading-6">{crop.description || "ممتاز - محصول عالي الجودة من مزارع موثقة"}</p>
            <p className="font-black text-xl text-green-600 mt-3">{crop.price} جنيه / للطن</p>
            <p className="text-xs text-gray-400 mt-1">{crop.quantity} طن متوفر • {crop.city}</p>
          </div>
        </div>

        {/* كارت المزارع - ده بس اللي عليه Link */}
        <div className="bg-white border rounded-[20px] p-4 mt-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-black text-lg">
            {(crop.farmer_name || "ا")[0]}
          </div>
          <div className="flex-1">
            <Link href={`/users/${crop.farmer_phone || crop.phone || "01012345678"}`} className="font-black text-sm hover:underline">
              {crop.farmer_name || "الحاج محمد"}
            </Link>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
              <span>مزارع موثق</span><span>•</span><span>⭐ 4.9</span><span>•</span><span>📍 {crop.city || "الجيزة"}</span>
            </div>
          </div>
          <Link href={`/users/${crop.farmer_phone || crop.phone}`} className="bg-gray-100 border px-4 py-2 rounded-full text-xs font-bold hover:bg-gray-200">
            الملف
          </Link>
        </div>

        {/* مميزات */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-white border rounded-2xl p-3 text-center"><div className="text-xl">🚚</div><p className="text-[11px] font-bold mt-1">توصيل مجاني</p></div>
          <div className="bg-white border rounded-2xl p-3 text-center"><div className="text-xl">💰</div><p className="text-[11px] font-bold mt-1">دفع آمن</p></div>
          <div className="bg-white border rounded-2xl p-3 text-center"><div className="text-xl">🌱</div><p className="text-[11px] font-bold mt-1">جودة عالية</p></div>
        </div>

        <a href={`https://wa.me/${crop.farmer_phone}`} target="_blank" className="block w-full bg-black text-white text-center py-4 rounded-full font-black mt-6">تواصل واتساب 💬</a>
      </div>
    </main>
  )
}
