"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LikeButton({ cropId, ownerPhone }: { cropId: string, ownerPhone: string }){
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [me, setMe] = useState<any>(null);

  useEffect(()=>{
    const u = JSON.parse(localStorage.getItem("contcrops_user") || "null");
    setMe(u);
    if(!u) return;
    supabase.from("likes").select("*", {count:"exact"}).eq("crop_id", cropId).then(r=> setCount(r.count||0));
    supabase.from("likes").select("*").eq("crop_id", cropId).eq("user_phone", u.phone).maybeSingle().then(r=> setLiked(!!r.data));
  },[cropId]);

  const toggle = async()=>{
    if(!me){ window.location.href="/login"; return; }
    if(liked){
      await supabase.from("likes").delete().eq("crop_id", cropId).eq("user_phone", me.phone);
      setLiked(false); setCount(c=>c-1);
    } else {
      await supabase.from("likes").insert({user_phone: me.phone, crop_id: cropId});
      setLiked(true); setCount(c=>c+1);
      // إشعار لصاحب المحصول
      if(me.phone !== ownerPhone){
        await supabase.from("notifications").insert({
          to_phone: ownerPhone,
          from_phone: me.phone,
          from_name: me.name,
          type: 'like',
          crop_id: cropId,
          message: `${me.name} عمل لايك لمحصولك`
        });
      }
    }
  };

  return (
    <button onClick={toggle} className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border ${liked ? 'bg-red-50 text-red-600 border-red-100' : 'bg-white text-gray-500'}`}>
      <span>{liked ? '❤️' : '🤍'}</span> {count}
    </button>
  )
}
