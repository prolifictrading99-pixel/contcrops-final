"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function RegisterPage(){
  const router = useRouter();
  const [form, setForm] = useState({ name:"", phone:"", city:"الجيزة", password:"" });
  const [loading, setLoading] = useState(false);

  const register = async ()=>{
    if(!form.name || !form.phone || !form.password) return alert("كمل كل البيانات");
    setLoading(true);
    const { data: exists } = await supabase.from("profiles").select("phone").eq("phone", form.phone).maybeSingle();
    if(exists){ setLoading(false); return alert("الرقم ده متسجل قبل كده"); }

    const { data, error } = await supabase.from("profiles").insert([{
      name: form.name, phone: form.phone, city: form.city, password: form.password, role:"farmer", verified:true
    }]).select().single();
    
    setLoading(false);
    if(error) return alert(error.message);
    localStorage.setItem("contcrops_user", JSON.stringify(data));
    router.push("/market");
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fdf8] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border rounded-[24px] p-6">
        <h1 className="font-black text-xl text-center">اعمل حساب جديد 🌱</h1>
        
        <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="اسمك - الحاج محمد" className="w-full border rounded-full px-4 py-3 mt-6 text-sm outline-none" />
        <input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} placeholder="01xxxxxxxxx" className="w-full border rounded-full px-4 py-3 mt-3 text-sm outline-none" />
        <input value={form.city} onChange={e=>setForm({...form, city:e.target.value})} placeholder="المدينة - الجيزة" className="w-full border rounded-full px-4 py-3 mt-3 text-sm outline-none" />
        <input value={form.password} onChange={e=>setForm({...form, password:e.target.value})} type="password" placeholder="باسورد" className="w-full border rounded-full px-4 py-3 mt-3 text-sm outline-none" />
        
        <button onClick={register} disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-full font-black text-sm mt-6">
          {loading? "جاري التسجيل..." : "تسجيل حساب"}
        </button>

        <p className="text-xs text-center mt-4 text-gray-500">
          عندك حساب؟ <Link href="/login" className="text-green-600 font-black">سجل دخول</Link>
        </p>
      </div>
    </main>
  )
}
