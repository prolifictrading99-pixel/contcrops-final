"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MarketIsolated() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [me, setMe] = useState<any>(null);
  const [filter, setFilter] = useState("الكل");
  const [following, setFollowing] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const defaultPosts = [
    { id: 1001, farmer: "الحاج سعيد", city: "البحيرة", time: "منذ ساعتين", crop: "طماطم بلدي - 2 طن", desc: "جودة عالية", price: "8.5", img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800", isMine: false, baseLikes: 12 },
    { id: 1002, farmer: "مزرعة النور", city: "النوبارية", time: "منذ 5 ساعات", crop: "برتقال صيفي - 10 طن", desc: "طازج", price: "6", img: "https://images.unsplash.com/photo-1611080626917-6cfbe1f1d3c5?w=800", isMine: false, baseLikes: 8 },
  ];

  const [posts, setPosts] = useState<any[]>([]);

  useEffect(()=>{
    setMounted(true);
    const current = localStorage.getItem("contcrops_current_user");
    
    if (!current) {
      router.push("/login");
      return;
    }
    
    setCurrentUser(current);
    
    // اقرأ بيانات الحساب ده بس - منفصلة تماماً
    const userData = JSON.parse(localStorage.getItem(`contcrops_user_${current}`) || "null") || { name: current, city: "البحيرة" };
    const myPosts = JSON.parse(localStorage.getItem(`contcrops_posts_${current}`) || "[]");
    const myFollowing = JSON.parse(localStorage.getItem(`contcrops_following_${current}`) || "[]");
    
    setMe(userData);
    setFollowing(myFollowing);
    
    // ادمج منشوراتك + الثابتة (الثابتة للكل، منشوراتك خاصة بيك)
    const merged = [...myPosts, ...defaultPosts];
    const sorted = [...merged].sort((a:any,b:any)=>{
      const aScore = (a.isMine ? 2 : 0) + (myFollowing.includes(a.farmer) ? 1 : 0);
      const bScore = (b.isMine ? 2 : 0) + (myFollowing.includes(b.farmer) ? 1 : 0);
      return bScore - aScore;
    });
    setPosts(sorted);
  },[]);

  const switchAccount = () => {
    if(confirm(`تبديل الحساب؟ هتخرج من حساب ${currentUser} وتدخل بحساب تاني`)) {
      localStorage.removeItem("contcrops_current_user");
      router.push("/login");
    }
  };

  const logout = () => {
    if(confirm(`تسجيل خروج من حساب ${currentUser}؟`)) {
      localStorage.removeItem("contcrops_current_user");
      router.push("/login");
    }
  };

  if (!mounted) return <main dir="rtl" className="min-h-screen bg-[#f5f6f1] flex items-center justify-center"><p>جاري التحميل...</p></main>;

  if (!currentUser) return null;

  const filtered = posts.filter(p=> {
    if (filter==="الكل") return true;
    if (filter==="منشوراتي") return p.isMine;
    if (filter==="متابَعون") return following.includes(p.farmer) || p.isMine;
    return true;
  });

  const myPostsCount = posts.filter(p=>p.isMine).length;

  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f6f1] pb-[80px] lg:pb-0">
      <header className="bg-white border-b sticky top-0 z-50 h-[56px] flex items-center">
        <div className="max-w-[1450px] mx-auto w-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/profile" className="w-8 h-8 bg-[#2e7d32] rounded-full flex items-center justify-center text-white font-bold text-[11px]">{currentUser[0]}</Link>
            <Link href="/threed" className="w-8 h-8 bg-[#f0f1ed] rounded-full flex items-center justify-center">💬</Link>
            <Link href="/market" className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">🏠</Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-[#eef7e8] text-[#2e7d32] px-3 py-1 rounded-full font-bold hidden md:block">🔒 حساب: {currentUser}</span>
            <Link href="/market" className="font-black text-[14px]">ContCrops</Link>
          </div>
        </div>
      </header>

      <div className="max-w-[1450px] mx-auto px-3 py-4 grid grid-cols-12 gap-4">
        <aside className="hidden lg:block col-span-3 space-y-3 sticky top-[72px] h-fit">
          <div className="bg-white rounded-[14px] border p-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#2e7d32] rounded-full flex items-center justify-center text-white font-bold">{currentUser[0]}</div>
              <div className="flex-1">
                <p className="font-bold text-[13px]">{currentUser}</p>
                <p className="text-[11px] text-green-600">🔒 حساب منفصل</p>
                <p className="text-[10px] text-gray-400">{myPostsCount} منشور خاص بيك</p>
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              <button onClick={switchAccount} className="w-full bg-[#f0f1ed] py-2 rounded-full text-[11px] font-bold hover:bg-black hover:text-white">🔄 تبديل حساب</button>
              <button onClick={logout} className="w-full bg-[#ffebee] text-red-600 py-2 rounded-full text-[11px] font-bold">🚪 خروج</button>
            </div>
          </div>

          <div className="bg-white rounded-[14px] border p-2">
            <Link href="/market" className="flex bg-black text-white rounded-[10px] px-3 py-2.5 font-bold text-[12px]">🧺 السوق</Link>
            <Link href="/profile" className="flex px-3 py-2.5 text-[12px] hover:bg-gray-50 rounded-[10px]">👤 بروفايلي ({myPostsCount})</Link>
            <Link href="/add-crop" className="flex px-3 py-2.5 text-[12px] hover:bg-gray-50 rounded-[10px]">+ منشور جديد</Link>
          </div>

          <div className="bg-[#fff8e1] border border-[#ffe082] rounded-[12px] p-3 text-[11px]">
            <p className="font-bold">🔒 حسابك منفصل</p>
            <p className="mt-1 text-gray-600">انت داخل بحساب <b>{currentUser}</b>. منشوراتك وتعليقاتك ومتابعاتك خاصة بيك ومش بتظهر في حساب تاني.</p>
          </div>
        </aside>

        <section className="col-span-12 lg:col-span-6 space-y-3">
          <div className="bg-[#eef7e8] border border-green-200 rounded-[12px] p-3 flex items-center justify-between">
            <p className="text-[12px]"><span className="font-bold">🔒 انت داخل بحساب: {currentUser}</span> - {myPostsCount} منشور خاص بيك</p>
            <button onClick={switchAccount} className="text-[11px] bg-white px-3 py-1 rounded-full border font-bold">تبديل</button>
          </div>

          <div className="bg-white rounded-[14px] border p-2 flex gap-1.5 overflow-x-auto">
            <button onClick={()=>setFilter("الكل")} className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border ${filter==="الكل" ? 'bg-black text-white border-black' : 'bg-white text-gray-600'}`}>الكل ({posts.length})</button>
            <button onClick={()=>setFilter("منشوراتي")} className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border ${filter==="منشوراتي" ? 'bg-[#2e7d32] text-white border-[#2e7d32]' : 'bg-white text-gray-600'}`}>📦 منشوراتي ({myPostsCount})</button>
            <button onClick={()=>setFilter("متابَعون")} className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border ${filter==="متابَعون" ? 'bg-black text-white' : 'bg-white text-gray-600'}`}>👥 تتابعهم</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map(post=>(
              <div key={post.id} className={`bg-white rounded-[14px] border overflow-hidden ${post.isMine ? 'border-green-300 ring-1 ring-green-100' : 'border-black/5'}`}>
                {post.isMine && <div className="bg-[#eef7e8] text-[#2e7d32] text-[10px] px-2.5 py-1 font-bold">✅ منشورك الخاص - حساب {currentUser}</div>}
                <div className="p-2.5 flex items-center gap-2">
                  <div className="w-7 h-7 bg-[#2e7d32] rounded-full flex items-center justify-center text-white font-bold text-[10px]">{post.farmer[0]}</div>
                  <div className="flex-1 min-w-0"><p className="font-bold text-[11px] truncate">{post.farmer} {post.isMine && "(أنت)"}</p><p className="text-[9px] text-gray-400">{post.time}</p></div>
                  <span className="text-[11px] font-black">{post.price} ج</span>
                </div>
                <div className="h-[130px] bg-gray-100"><img src={post.img} className="w-full h-full object-cover" alt="" /></div>
                <div className="p-2.5"><h3 className="font-bold text-[11px] truncate">{post.crop}</h3><p className="text-[10px] text-gray-500 truncate">{post.desc}</p></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="grid grid-cols-4 h-[64px]">
          <Link href="/market" className="flex flex-col items-center justify-center gap-1 bg-black/5"><span className="text-[18px]">🧺</span><span className="text-[10px] font-bold">{currentUser}</span></Link>
          <Link href="/threed" className="flex flex-col items-center justify-center gap-1"><span className="text-[18px]">💬</span><span className="text-[10px] font-bold">ثريد</span></Link>
          <Link href="/messages" className="flex flex-col items-center justify-center gap-1"><span className="text-[18px]">✉️</span><span className="text-[10px] font-bold">الرسائل</span></Link>
          <Link href="/profile" className="flex flex-col items-center justify-center gap-1"><div className="w-6 h-6 bg-[#2e7d32] rounded-full flex items-center justify-center text-white text-[10px] font-bold">{currentUser[0]}</div><span className="text-[10px] font-bold">حسابي</span></Link>
        </div>
      </nav>
    </main>
  );
}
