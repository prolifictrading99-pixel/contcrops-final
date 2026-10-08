"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ShareButton({ cropId, ownerPhone }: { cropId:string, ownerPhone:string }){
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const share = async()=>{
    const me = JSON.parse(localStorage.getItem("contcrops_user") || "null");
    if(!me){ window.location.href="/login"; return; }

    await supabase.from("shares").insert({user_phone: me.phone, crop_id: cropId});
    setCount(c=>c+1);

    // نسخ اللينك
    const url = `${window.location.origin}/crop/${cropId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);

    if(me.phone !== ownerPhone){
      await supabase.from("notifications").insert({
        to_phone: ownerPhone,
        from_phone: me.phone,
        from_name: me.name,
        type: 'share',
        crop_id: cropId,
        message: `${me.name} شارك محصولك`
      });
    }
  };

  return (
    <button onClick={share} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border bg-white text-gray-500">
      <span>🔗</span> {copied ? 'تم النسخ!' : `مشاركة ${count>0?count:''}`}
    </button>
  )
}
