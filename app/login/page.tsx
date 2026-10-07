"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginIsolated() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", city: "البحيرة" });
  const [isLogin, setIsLogin] = useState(true);
  const [existingAccounts, setExistingAccounts] = useState<string[]>([]);

  useEffect(()=>{
    setMounted(true);
    // شوف الحسابات الموجودة قبل كده
    const accounts = JSON.parse(localStorage.getItem("contcrops_all_accounts") || "[]");
    setExistingAccounts(accounts);
    
    // لو فيه يوزر حالي مسجل دخول، روح السوق
    const current = localStorage.getItem("contcrops_current_user");
    if (current) {
      router.push("/market");
    }
  },[]);

  const handleSubmit = (e:any) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("اكتب اسمك");
      return;
    }
    
    const username = form.name.trim();
    
    // 1. احفظ اليوزر الحالي منفصل
    localStorage.setItem("contcrops_current_user", username);
    
    // 2. احفظ بياناته الخاصة
    const userData = {
      name: username,
      phone: form.phone || "01000000000",
      city: form.city,
      bio: `مزارع من ${form.city}`,
      farmType: "محاصيل متنوعة",
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(`contcrops_user_${username}`, JSON.stringify(userData));
    
    // 3. ضيفه لقائمة كل الحسابات
    const allAccounts = JSON.parse(localStorage.getItem("contcrops_all_accounts") || "[]");
    if (!allAccounts.includes(username)) {
      localStorage.setItem("contcrops_all_accounts", JSON.stringify([...allAccounts, username]));
    }
    
    // 4. لو حساب جديد، اعمله بيانات فاضية منفصلة
    if (!localStorage.getItem(`contcrops_posts_${username}`)) {
      localStorage.setItem(`contcrops_posts_${username}`, JSON.stringify([]));
      localStorage.setItem(`contcrops_following_${username}`, JSON.stringify([]));
      localStorage.setItem(`contcrops_my_comments_${username}`, JSON.stringify([]));
      localStorage.setItem(`contcrops_my_shares_${username}`, JSON.stringify([]));
      localStorage.setItem(`contcrops_threed_${username}`, JSON.stringify([]));
      localStorage.setItem(`contcrops_notifications_${username}`, JSON.stringify([
        { id: Date.now(), type: "welcome", from: "ContCrops", text: `أهلاً بيك يا ${username} 👋 حسابك الجديد جاهز ومنفصل عن أي حساب تاني`, time: "الآن", read: false }
      ]));
    }
    
    router.push("/market");
  };

  const switchToAccount = (accountName: string) => {
    localStorage.setItem("contcrops_current_user", accountName);
    router.push("/market");
  };

  const deleteAccount = (accountName: string) => {
    if(!confirm(`تمسح حساب ${accountName} وكل بياناته نهائياً؟`)) return;
    
    // امسح كل بياناته المنفصلة
    localStorage.removeItem(`contcrops_user_${accountName}`);
    localStorage.removeItem(`contcrops_posts_${accountName}`);
    localStorage.removeItem(`contcrops_following_${accountName}`);
    localStorage.removeItem(`contcrops_my_comments_${accountName}`);
    localStorage.removeItem(`contcrops_my_shares_${accountName}`);
    localStorage.removeItem(`contcrops_threed_${accountName}`);
    localStorage.removeItem(`contcrops_notifications_${accountName}`);
    localStorage.removeItem(`contcrops_likes_${accountName}`);
    
    const allAccounts = JSON.parse(localStorage.getItem("contcrops_all_accounts") || "[]");
    localStorage.setItem("contcrops_all_accounts", JSON.stringify(allAccounts.filter((a:string)=>a!==accountName)));
    
    if (localStorage.getItem("contcrops_current_user") === accountName) {
      localStorage.removeItem("contcrops_current_user");
    }
    
    setExistingAccounts(allAccounts.filter((a:string)=>a!==accountName));
  };

  if (!mounted) return <main dir="rtl" className="min-h-screen bg-[#f5f6f1] flex items-center justify-center"><p>جاري التحميل...</p></main>;

  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f6f1] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-black rounded-[16px] mx-auto flex items-center justify-center text-white font-black text-[24px]">C</div>
          <h1 className="font-black text-[24px] mt-4">ContCrops</h1>
          <p className="text-[13px] text-gray-500 mt-1">كل حساب منفصل تماماً 🔒</p>
        </div>

        {existingAccounts.length > 0 && (
          <div className="bg-white rounded-[16px] border p-4 mb-4">
            <h3 className="font-bold text-[13px] mb-3">👥 حسابات موجودة على الجهاز:</h3>
            <div className="space-y-2">
              {existingAccounts.map(acc=>(
                <div key={acc} className="flex items-center justify-between bg-[#f5f6f1] rounded-[10px] p-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#2e7d32] rounded-full flex items-center justify-center text-white font-bold text-[12px]">{acc[0]}</div>
                    <span className="font-bold text-[13px]">{acc}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={()=>switchToAccount(acc)} className="bg-black text-white px-3 py-1 rounded-full text-[11px] font-bold">دخول</button>
                    <button onClick={()=>deleteAccount(acc)} className="bg-red-50 text-red-500 px-2 py-1 rounded-full text-[11px]">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-2">كل حساب ليه منشوراته وتعليقاته ومتابعاته لوحده - مش مرتبطين ببعض</p>
          </div>
        )}

        <div className="bg-white rounded-[20px] border border-black/5 p-6">
          <div className="flex bg-[#f0f1ed] rounded-full p-1 mb-6">
            <button onClick={()=>setIsLogin(true)} className={`flex-1 py-2 rounded-full text-[13px] font-bold transition ${isLogin ? 'bg-black text-white' : 'text-gray-500'}`}>دخول بحساب موجود</button>
            <button onClick={()=>setIsLogin(false)} className={`flex-1 py-2 rounded-full text-[13px] font-bold transition ${!isLogin ? 'bg-black text-white' : 'text-gray-500'}`}>حساب جديد منفصل</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-gray-600">اسم المستخدم * (هو اللي بيفصل الحسابات)</label>
              <input 
                value={form.name} 
                onChange={e=>setForm({...form, name: e.target.value})}
                placeholder="مثال: أحمد، hamza، الحاج سعيد"
                className="w-full mt-1.5 bg-[#f5f6f1] border border-black/5 rounded-[12px] h-12 px-4 text-[14px] outline-none focus:border-black focus:bg-white transition"
                required
              />
              <p className="text-[10px] text-gray-400 mt-1">كل اسم = حساب منفصل ببيانات منفصلة تماماً</p>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="text-[11px] font-bold text-gray-600">رقم الموبايل</label>
                  <input value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} placeholder="01xxxxxxxxx" className="w-full mt-1.5 bg-[#f5f6f1] border rounded-[12px] h-12 px-4 text-[14px] outline-none" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-600">المحافظة</label>
                  <select value={form.city} onChange={e=>setForm({...form, city: e.target.value})} className="w-full mt-1.5 bg-[#f5f6f1] border rounded-[12px] h-12 px-4 text-[14px]">
                    <option>البحيرة</option><option>كفر الشيخ</option><option>النوبارية</option><option>المنوفية</option>
                  </select>
                </div>
              </>
            )}

            <button type="submit" className="w-full bg-black text-white rounded-full py-3.5 font-black text-[15px] hover:bg-zinc-800 transition mt-2">
              {isLogin ? "دخول للحساب 🔓" : "إنشاء حساب منفصل جديد 🔒"}
            </button>
          </form>

          <div className="mt-4 bg-[#eef7e8] border border-green-200 rounded-[12px] p-3 text-[11px]">
            <p className="font-bold text-[#2e7d32]">✅ إزاي الحسابات منفصلة؟</p>
            <p className="mt-1 text-gray-600 leading-4">لما تدخل باسم <b>أحمد</b> هتشوف منشورات أحمد بس. لما تدخل باسم <b>محمد</b> هتشوف منشورات محمد بس. كل حساب ليه <code>contcrops_posts_الاسم</code> لوحده - مش بيشوفوا بعض.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
