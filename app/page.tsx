"use client";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import Link from "next/link";

const fallbackImages: any = {
  "طماطم": "https://images.unsplash.com/photo-1561136594-7f68413baa99?w=400&h=300&fit=crop",
  "بطاطس": "https://images.unsplash.com/photo-1518977676608-bd36c2ca4f33?w=400&h=300&fit=crop",
  "بصل": "https://images.unsplash.com/photo-1508747703725-71977731500b?w=400&h=300&fit=crop",
  "قمح": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
  "default": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop"
};

function getImage(name: string, url: string){
  if(url && url.startsWith("http")) return url;
  for(let key in fallbackImages){
    if(name?.includes(key)) return fallbackImages[key];
  }
  return fallbackImages.default;
}

export default function MarketPage(){
  const [crops, setCrops] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function fetchCrops(){
      setLoading(true);
      const { data } = await supabase.from("crops").select("*").order("created_at", {ascending: false}).limit(40);
      if(data) setCrops(data);
      setLoading(false);
    }
    fetchCrops();
  },[]);

  const filtered = crops.filter(c =>!search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.city?.toLowerCase().includes(search.toLowerCase()));

  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fdf8]">
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h- flex items-center justify-between">
          <Link href="/" className="font-black text-xl text-green-700">🌿 ContCrops</Link>
          <div className="flex gap-2">
            <Link href="/dashboard/add" className="bg-green-600 text-white px-5 py-2 rounded-full text-sm font-black">+ إضافة</Link>
            <Link href="/profile" className="bg-gray-100 px-4 py-2 rounded-full text-sm font-bold">حسابي</Link>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث عن محصول، مدينة..." className="w-full bg-white border rounded-full h-12 pr-12 pl-4 text-sm outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        {loading? <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">{[1,2,3,4].map(i=> <div key={i} className="bg-white rounded-2xl h-64 animate-pulse border"></div>)}</div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {filtered.map((crop:any)=>(
              <div key={crop.id} className="bg-white rounded- border overflow-hidden hover:shadow-lg transition">
                <Link href={`/crop/${crop.id}`}><img src={getImage(crop.name, crop.image_url)} className="w-full h-48 object-cover" alt={crop.name} /></Link>
                <div className="p-4">
                  <h3 className="font-black text-">{crop.name}</h3>
                  <p className="text- text-gray-500 mt-1">{crop.city} • {crop.quantity} طن • {crop.farmer_name}</p>
                  <p className="font-black text-green-600 mt-2">{crop.price} ج.م / للطن</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {filtered.length===0 &&!loading && <p className="text-center mt-20 text-gray-400">مفيش نتائج للبحث ده</p>}
      </div>
    </main>
  )
}