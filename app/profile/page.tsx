"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileIsolated() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [me, setMe] = useState<any>(null);
  const [tab, setTab] = useState<"market" | "comments" | "following">("market");
  const [marketPosts, setMarketPosts] = useState<any[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [myComments, setMyComments] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(()=>{
    setMounted(true);
    const current = localStorage.getItem("contcrops_current_user");
    if (!current) {
      router.push("/login");
      return;
    }
    setCurrentUser(current);

    // اقرأ بيانات الحساب ده بس
    const userData = JSON.parse(localStorage.getItem(`contcrops_user_${current}`) || "null") || { name: current, city: "البحيرة" };
    const myPosts = JSON.parse(localStorage.getItem(`contcrops_posts_${current}`) || "[]");
    const myFollowing = JSON.parse(localStorage.getItem(`contcrops_following_${current}`) || "[]");
    const comments = JSON.parse(localStorage.getItem(`contcrops_my_comments_${current}`) || "[]");

    setMe(userData);
    setMarketPosts(myPosts); // منشوراتك انت بس - منفصلة
    setFollowing(myFollowing);
    setMyComments(comments);
  },[]);

  const switchAccount = () => {
    localStorage.removeItem("contcrops_current_user");
    router.push("/login");
  };

  const deleteMyPost = (id: number) => {
    if(!confirm("تمسح المنشور ده من حسابك؟")) return;
    if(!currentUser) return;
    const updated = marketPosts.filter(p=>p.id!==id);
    localStorage.setItem(`contcrops_posts_${currentUser}`, JSON.stringify(updated));
    setMarketPosts(updated);
  };

  if (!mounted) return <main dir="rtl" className="min-h-screen bg-[#f5f6f1] flex items-center justify-center"><p>جاري التحميل...</p></main>;
  if (!currentUser) return null;

  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f6f1] pb-[80px]">
      <header className="bg-white border-b sticky top-0 z-50 h-[56px] flex items-center">
        <div className="max-w-[800px] mx-auto w-full px-4 flex items-center justify-between">
          <Link href="/market" className="bg-[#f0f1ed] w-8 h-8 rounded-full flex items-center justify-center">←</Link>
          <h1 className="font-black text-[15px]">بروفايل {currentUser} - منفصل 🔒</h1>
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">C</div>
        </div>
      </header>

      <div className="max-w-[800px] mx-auto px-3 py-4">
        <div className="bg-white rounded-[20px] border p-6 text-center">
          <div className="w-20 h-20 bg-[#2e7d32] rounded-full mx-auto flex items-center justify-center text-white font-black text-[24px]">{currentUser[0]}</div>
          <h1 className="font-black text-[18px] mt-3">{currentUser}</h1>
          <p className="text-[12px] bg-[#eef7e8] text-[#2e7d32] inline-block px-3 py-1 rounded-full mt-2">🔒 حساب منفصل - {marketPosts.length} منشور خاص بيك</p>
          
          <div className="grid grid-cols-3 gap-2 mt-5 max-w-[300px] mx-auto">
            <div className="bg-[#f5f6f1] rounded-[12px] p-2"><p className="font-black text-[16px]">{marketPosts.length}</p><p className="text-[10px] text-gray-500">منشوراتي</p></div>
            <div className="bg-[#eef7e8] rounded-[12px] p-2"><p className="font-black text-[16px] text-[#2e7d32]">{myComments.length}</p><p className="text-[10px] text-gray-500">تعليقاتي</p></div>
            <div className="bg-[#fff7e6] rounded-[12px] p-2"><p className="font-black text-[16px]">{following.length}</p><p className="text-[10px] text-gray-500">أتابع</p></div>
          </div>

          <div className="flex gap-2 justify-center mt-4">
            <button onClick={switchAccount} className="bg-[#f0f1ed] px-5 py-2 rounded-full text-[12px] font-bold">🔄 تبديل حساب</button>
            <Link href="/settings" className="bg-black text-white px-5 py-2 rounded-full text-[12px] font-bold">⚙️ إعدادات</Link>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border p-1.5 flex gap-1 mt-4">
          <button onClick={()=>setTab("market")} className={`flex-1 py-2 rounded-full text-[13px] font-bold ${tab==="market" ? "bg-black text-white" : "text-gray-500"}`}>🧺 منشورات {currentUser} ({marketPosts.length})</button>
          <button onClick={()=>setTab("comments")} className={`flex-1 py-2 rounded-full text-[13px] font-bold ${tab==="comments" ? "bg-[#2e7d32] text-white" : "text-gray-500"}`}>💬 تعليقاتك ({myComments.length})</button>
          <button onClick={()=>setTab("following")} className={`flex-1 py-2 rounded-full text-[13px] font-bold ${tab==="following" ? "bg-black text-white" : "text-gray-500"}`}>👥 تتابع</button>
        </div>

        {tab==="market" && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {marketPosts.length===0 ? (
              <div className="col-span-2 bg-white rounded-[16px] border p-8 text-center">
                <p className="text-[40px]">📦</p>
                <p className="font-bold mt-2">حساب {currentUser} لسه معملش منشورات</p>
                <p className="text-[12px] text-gray-400 mt-1">منشوراتك هنا خاصة بيك - مش بتظهر في حساب تاني</p>
                <Link href="/add-crop" className="inline-block mt-4 bg-black text-white px-6 py-2.5 rounded-full text-[13px] font-bold">+ أول منشور ليك</Link>
              </div>
            ) : marketPosts.map((post:any)=>(
              <div key={post.id} className="bg-white rounded-[14px] border border-green-200 overflow-hidden">
                <div className="bg-[#eef7e8] text-[#2e7d32] text-[10px] px-2.5 py-1 font-bold flex justify-between">
                  <span>✅ منشورك الخاص</span>
                  <button onClick={()=>deleteMyPost(post.id)} className="text-red-500 hover:text-red-700">🗑️ مسح</button>
                </div>
                <div className="h-[130px] bg-gray-100"><img src={post.img} className="w-full h-full object-cover" alt="" /></div>
                <div className="p-2.5">
                  <h3 className="font-bold text-[12px]">{post.crop}</h3>
                  <p className="font-black text-[12px] mt-1">{post.price} ج / كجم</p>
                  <p className="text-[10px] text-gray-400 mt-1">نشرته بحساب {currentUser}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==="comments" && (
          <div className="mt-4 space-y-2">
            {myComments.length===0 ? (
              <div className="bg-white rounded-[16px] border p-8 text-center"><p className="font-bold">لسه معملتش تعليقات بحساب {currentUser}</p><Link href="/market" className="inline-block mt-4 bg-black text-white px-6 py-2.5 rounded-full text-[13px] font-bold">روح علق</Link></div>
            ) : myComments.map((c:any)=>(
              <div key={c.id} className="bg-white rounded-[16px] border p-4">
                <p className="text-[11px] text-gray-500">علقت على {c.postCrop} - بحساب {currentUser}</p>
                <p className="text-[13px] mt-2 bg-[#f5f6f1] rounded-[10px] p-3">"{c.text}"</p>
              </div>
            ))}
          </div>
        )}

        {tab==="following" && (
          <div className="mt-4">
            {following.length===0 ? <div className="bg-white rounded-[16px] border p-8 text-center"><p>مفيش متابعات في حساب {currentUser}</p></div> :
            following.map((name:string)=><div key={name} className="bg-white rounded-[12px] border p-3 mb-2 flex justify-between"><span className="font-bold text-[13px]">{name}</span><span className="text-[11px] text-gray-400">تتابعه بحساب {currentUser}</span></div>)}
          </div>
        )}
      </div>
    </main>
  );
}
