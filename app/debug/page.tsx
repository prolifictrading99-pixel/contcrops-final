"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Debug(){
  const [info, setInfo] = useState<any>({});

  useEffect(()=>{
    const run = async ()=>{
      const user = JSON.parse(localStorage.getItem("contcrops_user") || "null");
      const { data: crops } = await supabase.from("crops").select("*").limit(5);
      const { data: profiles } = await supabase.from("profiles").select("*").limit(5);
      const { count: cropsCount } = await supabase.from("crops").select("*", {count: "exact", head: true});
      const { count: profilesCount } = await supabase.from("profiles").select("*", {count: "exact", head: true});

      setInfo({ user, crops, profiles, cropsCount, profilesCount });
    };
    run();
  },[]);

  return (
    <main dir="rtl" className="p-4 font-mono text-xs">
      <h1 className="font-black text-lg mb-4">صفحة التشخيص 🔍</h1>
      <pre className="bg-black text-green-400 p-4 rounded-xl overflow-auto">
        {JSON.stringify(info, null, 2)}
      </pre>
      <div className="mt-6 bg-white border p-4 rounded-xl">
        <p><b>المستخدم الحالي:</b> {info.user?.phone} - {info.user?.name}</p>
        <p><b>عدد المحاصيل:</b> {info.cropsCount}</p>
        <p><b>عدد البروفايلات:</b> {info.profilesCount}</p>
        <p className="mt-2 text-red-600">
          {info.crops?.[0]?.farmer_phone? `المحصول مربوط بـ: ${info.crops[0].farmer_phone}` : "❌ المحاصيل مش مربوطة برقم (farmer_phone فاضي!)"}
        </p>
      </div>
    </main>
  )
}