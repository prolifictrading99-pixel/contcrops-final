"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function AuthPage(){
  const [isLogin,setIsLogin]=useState(true);
  const [form,setForm]=useState({email:"",password:"",name:"",role:"trader",city:"البحيرة",phone:""});
  const [loading,setLoading]=useState(false);

  async function handleSubmit(e:any){
    e.preventDefault(); setLoading(true);
    if(isLogin){
      const {error} = await supabase.auth.signInWithPassword({email:form.email,password:form.password});
      if(error) alert(error.message); else window.location.href="/profile";
    }else{
      const {data,error} = await supabase.auth.signUp({email:form.email,password:form.password});
      if(error) alert(error.message);
      else {
        await supabase.from("users_profiles").insert([{
          user_id: data.user?.id,
          email: form.email,
          name: form.name,
          role: form.role,
          city: form.city,
          phone: form.phone,
          company_name: form.name,
          specialty: form.role,
          verified: false,
          rating: 5
        }]);
        alert("تم إنشاء الحساب! سجل دخول الآن");
        setIsLogin(true);
      }
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
          <button disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold">{loading?"جاري..." : isLogin?"دخول":"إنشاء حساب"}</button>
        </form>
        <button onClick={()=>setIsLogin(!isLogin)} className="w-full text-center text-sm text-green-600 font-bold mt-4">{isLogin?"معندكش حساب؟ سجل جديد":"عندك حساب؟ سجل دخول"}</button>
        <a href="/" className="block text-center text-xs text-gray-400 mt-3">← الرجوع للسوق</a>
      </div>
    </main>
  )
}