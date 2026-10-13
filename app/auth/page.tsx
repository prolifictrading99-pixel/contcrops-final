"use client";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function AuthPage(){
  const [isLogin,setIsLogin]=useState(true);
  const [form,setForm]=useState({email:"",password:"",name:"",role:"trader",city:"البحيرة",phone:""});
  const [loading,setLoading]=useState(false);

  async function handleSubmit(e:any){
    e.preventDefault(); setLoading(true);
    try {
      if(isLogin){
        const {error} = await supabase.auth.signInWithPassword({email:form.email,password:form.password});
        if(error) throw error;
        window.location.href="/";
      }else{
        const {data,error} = await supabase.auth.signUp({email:form.email,password:form.password});
        if(error) throw error;

        if (data.user) {
          // جرب profiles الأول، لو مش موجود جرب colleagues
          const profileData = {
            id: data.user.id,
            display_name: form.name,
            name: form.name,
            city: form.city,
            specialty: form.role,
            phone: form.phone,
            role: form.role,
          };

          let { error: profileError } = await supabase.from("profiles").upsert(profileData);
          if (profileError) {
            // لو profiles مش موجود، جرب colleagues
            console.log("profiles failed, trying colleagues", profileError.message);
            const { error: colleagueError } = await supabase.from("colleagues").insert({
              id: undefined, // bigserial auto
              name: form.name,
              city: form.city,
              specialty: form.role,
              phone: form.phone,
            });
            if (colleagueError) throw colleagueError;
          }
        }
        alert("تم إنشاء الحساب! سجل دخول الآن ✅");
        setIsLogin(true);
      }
    } catch (err:any) {
      alert(err.message);
    }
    setLoading(false);
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fdf8] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded- border shadow-lg p-8">
        <h1 className="font-black text-2xl text-center">🌿 ContCrops</h1>
        <h2 className="text-center font-bold mt-2">{isLogin?"تسجيل الدخول":"إنشاء حساب جديد"}</h2>
        <p className="text-center text-xs text-gray-400 mt-1">تاجر - مهندس - محطة تصدير - شركة</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          {!isLogin && <input required placeholder="الاسم الكامل" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border p-3 rounded-xl text-sm"/>}
          <input required type="email" placeholder="الإيميل" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full border p-3 rounded-xl text-sm"/>
          <input required type="password" placeholder="كلمة السر" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="w-full border p-3 rounded-xl text-sm"/>

          {!isLogin && (
            <>
              <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="w-full border p-3 rounded-xl text-sm">
                <option value="trader">تاجر 🏪</option>
                <option value="engineer">مهندس زراعي 👨‍🔬</option>
                <option value="exporter">محطة تصدير 🚢</option>
                <option value="company">شركة / مصنع 🏭</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input required placeholder="المدينة" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} className="border p-3 rounded-xl text-sm"/>
                <input required placeholder="الهاتف" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="border p-3 rounded-xl text-sm"/>
              </div>
            </>
          )}
          <button disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700">{loading?"جاري..." : isLogin?"دخول":"إنشاء حساب"}</button>
        </form>
        <button onClick={()=>setIsLogin(!isLogin)} className="w-full text-center text-sm text-green-600 font-bold mt-4">{isLogin?"معندكش حساب؟ سجل جديد":"عندك حساب؟ سجل دخول"}</button>
        <a href="/" className="block text-center text-xs text-gray-400 mt-3">← الرجوع للسوق</a>
      </div>
    </main>
  )
}