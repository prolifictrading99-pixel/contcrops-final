"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PricesPage(){
  const [crops, setCrops] = useState<any[]>([]);

  useEffect(()=>{
    const load = async()=>{
      const { data } = await supabase.from("crops").select("name,price,city,created_at").order("created_at", {ascending:false}).limit(50);
      if(data) setCrops(data);
    };
    load();
  },[]);

  const avg = (name:string)=>{
    const list = crops.filter(c=>c.name?.includes(name)).map(c=>Number(c.price));
    if(!list.length) return "-";
    return (list.reduce((a,b)=>a+b,0)/list.length).toFixed(0);
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fdf8] pb-24">
      <div className="bg-white border-b p-3 max-w-5xl mx-auto flex justify-between">
        <Link href="/" className="text-xs bg-gray-100 px-3 py-1.5 rounded-full">← السوق</Link>
        <h1 className="font-black text-sm">الأسعار اليوم 📊</h1>
        <div className="w-12"></div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-400">طماطم بلدي</p>
            <p className="font-black text-green-600">{avg("طماطم")} جنيه / طن</p>
          </div>
          <div className="bg-white border rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-400">بسلة</p>
            <p className="font-black text-green-600">{avg("بسلة")} جنيه / طن</p>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-3">
          <h3 className="font-black text-xs mb-2">آخر الأسعار في السوق</h3>
          {crops.map((c,i)=>(
            <div key={i} className="flex justify-between text-xs py-2 border-b last:border-0">
              <span>{c.name} - {c.city}</span>
              <span className="font-bold">{c.price} ج</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}