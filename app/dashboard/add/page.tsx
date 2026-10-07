"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function Dashboard(){
  const [crops, setCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{ fetchCrops(); },[]);
  const fetchCrops = async ()=>{
    const { data } = await supabase.from("crops").select("*").order("created_at",{ascending:false});
    if(data) setCrops(data);
    setLoading(false);
  };
  const deleteCrop = async (id:string)=>{
    if(!confirm("متأكد تحذف المحصول؟")) return;
    await supabase.from("crops").delete().eq("id",id);
    setCrops(crops.filter(c=>c.id!==id));
  };

  if(loading) return <div className="p-10 text-center">جاري التحميل...</div>;
  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fdf8] p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-black text-xl">لوحة التحكم</h1>
          <Link href="/dashboard/add" className="bg-black text-white px-5 py-2 rounded-full text-xs font-black">+ إضافة محصول</Link>
        </div>
        <div className="bg-white border rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 p-3 text-[11px] font-black text-gray-500">
            <div className="col-span-2">الصورة</div><div className="col-span-3">الاسم</div><div className="col-span-2">المزارع</div><div className="col-span-2">السعر</div><div className="col-span-3">إجراء</div>
          </div>
          {crops.map(crop=>(
            <div key={crop.id} className="grid grid-cols-12 p-3 border-t items-center text-xs">
              <div className="col-span-2"><img src={crop.image_url} className="w-12 h-12 rounded-xl object-cover" /></div>
              <div className="col-span-3 font-bold truncate">{crop.name}</div>
              <div className="col-span-2 text-gray-500 truncate">{crop.farmer_name || "مزارع"}</div>
              <div className="col-span-2 font-black text-green-600">{crop.price} ج</div>
              <div className="col-span-3 flex gap-1">
                <Link href={`/crop/${crop.id}`} className="bg-gray-100 px-3 py-1 rounded-full">عرض</Link>
                <button onClick={()=>deleteCrop(crop.id)} className="bg-red-50 text-red-600 px-3 py-1 rounded-full">حذف</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
