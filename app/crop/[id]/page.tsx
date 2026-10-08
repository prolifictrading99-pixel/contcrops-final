"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import LikeButton from "@/components/LikeButton";
import CommentSection from "@/components/CommentSection";
import ShareButton from "@/components/ShareButton";

export default function CropDetailsPage(){
  const params = useParams();
  const [crop, setCrop] = useState<any>(null);

  useEffect(()=>{
    supabase.from("crops").select("*").eq("id", params.id).single().then(r=> setCrop(r.data));
  },[params.id]);

  if(!crop) return <div className="p-10 text-center">جاري التحميل...</div>;

  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fdf8] pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border-b p-3 flex justify-between">
          <Link href="/" className="text-xs bg-gray-100 px-3 py-1 rounded-full">← السوق</Link>
          <h1 className="font-black text-sm">{crop.name}</h1>
          <div className="w-12"></div>
        </div>
        <img src={crop.image_url} className="w-full h-64 object-cover" />
        <div className="p-4 space-y-3">
          <div className="bg-white border rounded-2xl p-4">
            <h2 className="font-black">{crop.name}</h2>
            <p className="text-green-600 font-black mt-1">{crop.price} جنيه</p>
            <div className="flex gap-2 mt-3">
              <LikeButton cropId={crop.id} ownerPhone={crop.farmer_phone} />
              <ShareButton cropId={crop.id} ownerPhone={crop.farmer_phone} />
            </div>
          </div>
          <CommentSection cropId={crop.id} ownerPhone={crop.farmer_phone} />
        </div>
      </div>
    </main>
  )
}