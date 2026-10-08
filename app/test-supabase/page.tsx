"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestSupabasePage(){
  const [logs, setLogs] = useState<string[]>([]);
  const [ok, setOk] = useState<Record<string, boolean>>({});
  const add = (msg:string)=> setLogs(l=>[...l, msg]);

  useEffect(()=>{
    (async()=>{
      add("🔍 بيختبر الاتصال بـ Supabase...");
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if(!url || !key){ add("❌ .env.local مش موجود!"); setOk(o=>({...o, env:false})); return; }
      add(`✅ ENV موجود: ${url.slice(0,35)}...`); setOk(o=>({...o, env:true}));

      const { data: crops, error: e1 } = await supabase.from("crops").select("id").limit(5);
      if(e1){ add(`❌ جدول crops: ${e1.message}`); } else { add(`✅ جدول crops شغال - فيه ${crops?.length ?? 0} محصول`); setOk(o=>({...o, crops:true})); }

      const { data: prof, error: e2 } = await supabase.from("profiles").select("id").limit(5);
      if(e2){ add(`❌ جدول profiles: ${e2.message}`); } else { add(`✅ جدول profiles شغال - فيه ${prof?.length ?? 0} مزارع`); setOk(o=>({...o, profiles:true})); }

      const { data: posts, error: e3 } = await supabase.from("posts").select("id").limit(5);
      if(e3){ add(`❌ جدول posts: ${e3.message}`); } else { add(`✅ جدول posts شغال - فيه ${posts?.length ?? 0} بوست`); setOk(o=>({...o, posts:true})); }

      const { data: buckets, error: e4 } = await supabase.storage.listBuckets();
      if(e4){ add(`❌ Storage: ${e4.message}`); }
      else {
        const has = buckets?.some(b=>b.name==="crop-images");
        if(has){ add(`✅ Storage bucket "crop-images" موجود وشغال`); setOk(o=>({...o, storage:true})); }
        else { add(`❌ Storage bucket "crop-images" مش موجود`); add(`الباكتات اللي عندك: ${buckets.map(b=>b.name).join(", ")}`); }
      }
      add("---");
    })();
  },[]);

  const allOk = ok.env && ok.crops && ok.profiles && ok.posts && ok.storage;

  return (
    <main dir="rtl" className="min-h-screen bg-black text-white p-6 font-mono">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-black mb-2">🧪 اختبار Supabase - crop-images</h1>
        <div className="bg-[#111] border border-[#222] rounded-2xl p-4 mt-4">
          {logs.map((l,i)=><div key={i} className="py-1 text-[13px]">{l}</div>)}
        </div>
        {logs.length > 4 && (
          <div className={`mt-6 rounded-2xl p-5 text-center font-black ${allOk ? "bg-green-600" : "bg-orange-600"}`}>
            {allOk ? "✅ المنصة مربوطة ب Supabase بشكل سليم 100% - جاهزة" : "قربنا - شوف اللوج فوق"}
          </div>
        )}
      </div>
    </main>
  )
}
