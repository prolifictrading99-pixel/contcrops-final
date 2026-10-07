"use client";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import Link from "next/link";

const fallbackImages: any = {
  "طماطم": "https://images.unsplash.com/photo-1561136594-7f68413baa99?w=400&h=300&fit=crop",
  "بطاطس": "https://images.unsplash.com/photo-1518977676608-bd36c2ca4f33?w=400&h=300&fit=crop",
  "بصل": "https://images.unsplash.com/photo-1508747703725-71977731500b?w=400&h=300&fit=crop",
  "قمح": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
  "بسلة": "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400&h=300&fit=crop",
  "بتنجان": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop",
  "default": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop"
};

function getImage(name: string, url: string){
  // ✅ اسمح بصور supabase
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
      const { data, error } = await supabase.from("crops").select("*").order("created_at", {ascending: false}).limit(40);
      console.log("crops data:", data, "error:", error);
      if(data && data.length > 0){
        setCrops(data);
      } else {
        setCrops([
          { id: "1", name: "طماطم بلدي - البحيرة", price: 12, quantity: 500, city: "البحيرة", farmer_name: "الحاج محمد", image_url: fallbackImages["طماطم"] },
          { id: "2", name: "بطاطس تحمير - المنوفية", price: 15, quantity: 1000, city: "المنوفية", farmer_name: "أحمد سمير", image_url: fallbackImages["بطاطس"] },
          { id: "3", name: "قمح بلدي - الشرقية", price: 14000, quantity: 50, city: "الشرقية", farmer_name: "سيد الفلاح", image_url: fallbackImages["قمح"] },
          { id: "4", name: "بصل أحمر - سوهاج", price: 10, quantity: 20, city: "سوهاج", farmer_name: "محمود", image_url: fallbackImages["بصل"] },
        ]);
      }
      setLoading(false);
    }
    fetchCrops();
  },[]);

  const filtered = crops.filter(c => {
    if(!search) return true;
    return c.name?.toLowerCase().includes(search.toLowerCase()) || c.city?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fdf8]">
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h- flex items-center justify-between">
          <Link href="/" className="font-black text-xl text-green-700 flex items-center gap-2">🌿 ContCrops</Link>
          <div className="flex gap-2">
            <Link href="/farmers" className="px-4 py-2 rounded-full bg-gray-100 text-sm font-bold">المزارعين</Link>
            <Link href="/" className="px-4 py-2 rounded-full bg-green-600 text-white text-sm font-bold">السوق</Link>
          </div>
          <Link href="/dashboard" className="bg-green-600 text-white px-5 py-2 rounded-full text-sm font-black">+ إضافة</Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="relative">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث عن محصول... 🌾" className="w-full bg-white border rounded-full h-12 pr-12 pl-4 text-sm outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
          <span className="absolute right-4 top-3.5 text-gray-400">🔍</span>
        </div>

        {loading? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[1,2,3,4].map(i=> <div key={i} className="bg-white rounded-2xl h-64 animate-pulse border"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {filtered.map((crop:any)=>(
              <div key={crop.id} className="bg-white rounded- border overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 group">
                <Link href={`/crop/${crop.id}`} className="block relative">
                  <img src={getImage(crop.name, crop.image_url)} alt={crop.name} className="w-full h-48 object-cover" onError={(e:any)=> e.target.src = fallbackImages.default} />
                  <span className="absolute top-3 right-3 bg-white/90 px-2.5 py-1 rounded-full text- font-black border">✅ متاح</span>
                  <span className="absolute bottom-3 right-3 bg-black/70 text-white px-2.5 py-1 rounded-full text-">📍 {crop.city}</span>
                </Link>
                <div className="p-4">
                  <h3 className="font-black text- line-clamp-1">{crop.name}</h3>
                  <p className="text- text-gray-500 mt-1">👨‍🌾 {crop.farmer_name} • {crop.quantity} طن</p>
                  <div className="flex items-center justify-between mt-4">
                    <p className="font-black text-green-600 text-lg">{Number(crop.price).toLocaleString()}<span className="text-xs mr-1">ج</span></p>
                    <Link href={`/crop/${crop.id}`} className="bg-black text-white px-4 py-2 rounded-full text- font-black">عرض التفاصيل</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {filtered.length === 0 &&!loading && (
          <div className="text-center py-20"><p className="text-5xl">🌾</p><p className="font-black mt-4">مفيش محاصيل بالاسم ده</p></div>
        )}
      </div>
    </main>
  )
}