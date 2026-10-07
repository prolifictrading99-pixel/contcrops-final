"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [crops, setCrops] = useState<any[]>([]);
  const [isMe, setIsMe] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const phone = decodeURIComponent(params.id as string);
      const me = JSON.parse(localStorage.getItem("contcrops_user") || "null");
      if (me?.phone === phone) setIsMe(true);

      const { data: prof } = await supabase.from("profiles").select("*").eq("phone", phone).maybeSingle();
      let finalProfile = prof;
      if (!prof) {
        const { data: firstCrop } = await supabase.from("crops").select("farmer_name,city").eq("farmer_phone", phone).limit(1).maybeSingle();
        finalProfile = {
          name: firstCrop?.farmer_name || "مزارع",
          phone: phone,
          city: firstCrop?.city || "الجيزة",
        };
      }
      setProfile(finalProfile);
      const { data: myCrops } = await supabase.from("crops").select("*").eq("farmer_phone", phone);
      if (myCrops) setCrops(myCrops);
      setLoading(false);
    };
    load();
  }, [params.id]);

  if (loading) return <div className="p-10 text-center">جاري التحميل...</div>;

  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fdf8] pb-24">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white border rounded- p-6 text-center">
          <div className="w-20 h-20 bg-green-600 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-black">
            {profile?.name?.[0]}
          </div>
          <h2 className="font-black text-lg mt-3">{profile?.name}</h2>
          <p className="text-xs text-gray-400 mt-1">{profile?.city} - {profile?.phone}</p>
          <p className="text-xs mt-3">{crops.length} محصول في السوق</p>
          {isMe && <Link href="/settings" className="block bg-black text-white py-2 rounded-full text-xs mt-4">الاعدادات</Link>}
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {crops.map((c:any)=>(
            <Link key={c.id} href={`/crop/${c.id}`} className="bg-white border rounded-2xl overflow-hidden">
              <img src={c.image_url} className="w-full h-28 object-cover" />
              <div className="p-2">
                <p className="font-bold text-xs">{c.name}</p>
                <p className="text-xs text-green-600">{c.price} جنيه</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}