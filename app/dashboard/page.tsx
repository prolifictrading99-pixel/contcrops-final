"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function DashboardPage(){
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ users:0, crops:0, farmers:0 });
  const [crops, setCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const u = JSON.parse(localStorage.getItem("contcrops_user") || "null");
    
    if(!u){
      router.push("/login");
      return;
    }
    // حماية: لو مش أدمن رجعه بروفايله
    if(u.role !== 'admin'){
      router.push(`/users/${u.phone}`);
      return;
    }
    
    setUser(u);

    const loadData = async ()=>{
      const { count: usersCount } = await supabase.from("profiles").select("*", {count:"exact", head:true});
      const { count: cropsCount } = await supabase.from("crops").select("*", {count:"exact", head:true});
      const { data: allCrops } = await supabase.from("crops").select("*").order("created_at", {ascending:false}).limit(20);
      
      const uniqueFarmers = new Set(allCrops?.map((c:any)=>c.farmer_phone)).size;

      setStats({ users: usersCount||0, crops: cropsCount||0, farmers: uniqueFarmers });
      if(allCrops) setCrops(allCrops);
      setLoading(false);
    };
    loadData();
  },[]);

  const deleteCrop = async (id:any)=>{
    if(!confirm("متأكد عايز تمسح المحصول ده؟")) return;
    await supabase.from("crops").delete().eq("id", id);
    setCrops(crops.filter(c=>c.id !== id));
  };

  const handleLogout = ()=>{
    localStorage.removeItem("contcrops_user");
    router.push("/login");
  };

  if(loading) return <div className="p-10 text-center">جاري تحميل لوحة الإدارة...</div>;

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 pb-20">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white border rounded-2xl p-4 flex justify-between items-center">
          <div>
            <h1 className="font-black text-base">لوحة الإدارة 🛡️</h1>
            <p className="text-xs text-gray-400">مرحباً {user?.name} - {user?.phone} (أدمن)</p>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="text-xs bg-gray-100 px-3 py-2 rounded-full">السوق</Link>
            <button onClick={handleLogout} className="text-xs bg-red-50 text-red-600 border border-red-100 px-3 py-2 rounded-full">خروج</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white border rounded-2xl p-4 text-center">
            <p className="text-2xl font-black">{stats.users}</p>
            <p className="text-[11px] text-gray-400">إجمالي المستخدمين</p>
          </div>
          <div className="bg-white border rounded-2xl p-4 text-center">
            <p className="text-2xl font-black text-green-600">{stats.crops}</p>
            <p className="text-[11px] text-gray-400">إجمالي المحاصيل</p>
          </div>
          <div className="bg-white border rounded-2xl p-4 text-center">
            <p className="text-2xl font-black">{stats.farmers}</p>
            <p className="text-[11px] text-gray-400">عدد المزارعين</p>
          </div>
        </div>

        {/* Latest Crops */}
        <div className="bg-white border rounded-2xl mt-4 p-4">
          <h2 className="font-black text-sm mb-3">آخر المحاصيل في السوق (التحكم)</h2>
          <div className="space-y-2">
            {crops.map((c:any)=>(
              <div key={c.id} className="flex items-center justify-between border rounded-full px-3 py-2">
                <div className="flex items-center gap-2">
                  <img src={c.image_url} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-bold">{c.name} - {c.price}ج</p>
                    <p className="text-[10px] text-gray-400">{c.farmer_name} • {c.farmer_phone} • {c.city}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Link href={`/crop/${c.id}`} className="text-[10px] bg-black text-white px-3 py-1 rounded-full">عرض</Link>
                  <button onClick={()=>deleteCrop(c.id)} className="text-[10px] bg-red-50 text-red-600 border px-3 py-1 rounded-full">مسح</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3 mt-4 text-[11px]">
          <p className="font-bold">ملاحظة:</p>
          <p>أي حساب role بتاعه مش admin لو دخل /dashboard هيتحول تلقائياً لـ /users/رقمه - يعني لوحة الإدارة للأدمن بس.</p>
        </div>
      </div>
    </main>
  )
}
