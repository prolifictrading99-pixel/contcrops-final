"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function CommentSection({ cropId, ownerPhone }: { cropId:string, ownerPhone:string }){
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [me, setMe] = useState<any>(null);

  useEffect(()=>{
    setMe(JSON.parse(localStorage.getItem("contcrops_user") || "null"));
    supabase.from("comments").select("*").eq("crop_id", cropId).order("created_at", {ascending:false}).then(r=> { if(r.data) setComments(r.data) });
  },[cropId]);

  const send = async()=>{
    if(!text.trim()) return;
    if(!me){ window.location.href="/login"; return; }
    const { data } = await supabase.from("comments").insert({
      user_phone: me.phone,
      user_name: me.name,
      crop_id: cropId,
      content: text
    }).select().single();
    if(data) setComments([data, ...comments]);
    setText("");

    if(me.phone !== ownerPhone){
      await supabase.from("notifications").insert({
        to_phone: ownerPhone,
        from_phone: me.phone,
        from_name: me.name,
        type: 'comment',
        crop_id: cropId,
        message: `${me.name} علق: ${text.slice(0,30)}`
      });
    }
  };

  return (
    <div className="bg-white border rounded-2xl p-3 mt-3">
      <h3 className="font-black text-xs mb-2">التعليقات ({comments.length}) 💬</h3>
      <div className="flex gap-2 mb-3">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="اكتب تعليق..." className="flex-1 border rounded-full px-3 py-2 text-xs outline-none focus:border-green-500" />
        <button onClick={send} className="bg-green-600 text-white px-4 py-2 rounded-full text-xs font-bold">نشر</button>
      </div>
      <div className="space-y-2 max-h-60 overflow-auto">
        {comments.map(c=>(
          <div key={c.id} className="bg-gray-50 rounded-xl p-2 flex gap-2">
            <Link href={`/users/${c.user_phone}`} className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0">{c.user_name?.[0]}</Link>
            <div>
              <p className="text-[11px] font-bold">{c.user_name} <span className="text-gray-400 font-normal">• {new Date(c.created_at).toLocaleDateString('ar-EG')}</span></p>
              <p className="text-xs mt-0.5">{c.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
