"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function FollowingPageFixed() {
  const [following, setFollowing] = useState<string[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  const defaultPosts = [
    { id: 9991, farmer: "الحاج سعيد", city: "البحيرة", time: "منذ ساعتين", crop: "طماطم بلدي - 2 طن", desc: "جودة عالية، قطف اليوم", price: "8.5", img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800", baseLikes: 12 },
    { id: 9992, farmer: "مزرعة النور", city: "النوبارية", time: "منذ 5 ساعات", crop: "برتقال صيفي - 10 طن", desc: "طازج من المزرعة", price: "6", img: "https://images.unsplash.com/photo-1611080626917-6cfbe1f1d3c5?w=800", baseLikes: 8 },
    { id: 9993, farmer: "أبو خالد", city: "كفر الشيخ", time: "منذ يوم", crop: "بطاطس تحمير - 5 طن", desc: "تحمير ممتاز", price: "12", img: "https://images.unsplash.com/photo-1518977676608-bd36c7ff7f5a?w=800", baseLikes: 5 },
  ];

  useEffect(()=>{
    setMounted(true);
    const followingList = JSON.parse(localStorage.getItem("contcrops_following") || "[]");
    setFollowing(followingList);
    const saved = JSON.parse(localStorage.getItem("contcrops_posts") || "[]");
    const all = [...saved, ...defaultPosts];
    const onlyFollowing = all.filter((p:any) => followingList.includes(p.farmer));
    setPosts(onlyFollowing);
  },[]);

  const unfollow = (name: string) => {
    if(!confirm(`تلغي متابعة ${name}؟`)) return;
    const newList = following.filter(n => n !== name);
    setFollowing(newList);
    localStorage.setItem("contcrops_following", JSON.stringify(newList));
    setPosts(posts.filter(p => p.farmer !== name));
  };

  if (!mounted) {
    return <main dir="rtl" className="min-h-screen bg-[#f5f6f1] flex items-center justify-center"><p className="text-[14px]">جاري التحميل...</p></main>;
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f6f1]">
      <header className="bg-white border-b sticky top-0 z-50 h-[56px] flex items-center">
        <div className="max-w-[1000px] mx-auto w-full px-4 flex items-center justify-between">
          <Link href="/" className="bg-[#f0f1ed] w-8 h-8 rounded-full flex items-center justify-center">←</Link>
          <h1 className="font-black text-[16px]">👥 خلاصة المتابَعين {following.length > 0 && `(${following.length})`}</h1>
          <Link href="/" className="flex items-center gap-2 font-black"><span className="text-[14px]">ContCrops</span><div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">C</div></Link>
        </div>
      </header>

      <div className="max-w-[600px] mx-auto px-3 py-4 space-y-4">
        {following.length === 0 ? (
          <div className="bg-white rounded-[20px] border p-8 text-center">
            <p className="text-[50px]">👥</p>
            <h2 className="font-black text-[18px] mt-3">لسه متابعتش حد</h2>
            <p className="text-[13px] text-gray-500 mt-2 leading-6">لما تتابع مزارعين، منشوراتهم هتظهر هنا في صفحة خاصة بيك.</p>
            <div className="bg-[#f5f6f1] rounded-[12px] p-3 mt-4 text-right">
              <p className="font-bold text-[12px]">إزاي تتابع؟</p>
              <p className="text-[12px] text-gray-600 mt-1">1. ادخل السوق</p>
              <p className="text-[12px] text-gray-600">2. دوس على اسم أي مزارع</p>
              <p className="text-[12px] text-gray-600">3. دوس "+ متابعة"</p>
            </div>
            <Link href="/" className="inline-block mt-6 bg-black text-white px-8 py-3 rounded-full font-bold text-[14px]">روح السوق واكتشف مزارعين 🚀</Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-[16px] border border-black/5 p-4">
              <h2 className="font-black text-[14px]">تتابع {following.length} مزارعين</h2>
              <div className="flex gap-2 mt-3 flex-wrap">
                {following.map(name=>(
                  <div key={name} className="bg-[#f0f1ed] rounded-full px-3 py-1.5 flex items-center gap-2">
                    <Link href={`/farmer/${encodeURIComponent(name)}`} className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#2e7d32] rounded-full flex items-center justify-center text-white text-[10px] font-bold">{name[0]}</div>
                      <span className="text-[12px] font-bold">{name}</span>
                    </Link>
                    <button onClick={()=>unfollow(name)} className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[10px] hover:bg-red-50">✕</button>
                  </div>
                ))}
              </div>
            </div>

            {posts.length === 0 ? (
              <div className="bg-white rounded-[16px] border p-8 text-center">
                <p className="font-bold">اللي متابعهم لسه منزلوش منشورات</p>
                <p className="text-[12px] text-gray-400 mt-1">أول ما ينزلوا حاجة هتظهر هنا</p>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="font-black text-[14px] pr-2">منشورات المتابَعين ({posts.length})</h3>
                {posts.map(post=>(
                  <div key={post.id} className="bg-white rounded-[16px] border border-black/5 overflow-hidden">
                    <div className="bg-[#eef7e8] text-[#2e7d32] text-[11px] px-3 py-1.5 font-bold flex items-center justify-between">
                      <span>👥 تتابع {post.farmer} • {post.time}</span>
                      <button onClick={()=>unfollow(post.farmer)} className="text-[10px] bg-white px-2 py-0.5 rounded-full">إلغاء متابعة</button>
                    </div>
                    <div className="p-3 flex gap-2">
                      <Link href={`/farmer/${encodeURIComponent(post.farmer)}`} className="w-9 h-9 bg-[#2e7d32] rounded-full flex items-center justify-center text-white font-bold text-[12px]">{post.farmer[0]}</Link>
                      <div>
                        <Link href={`/farmer/${encodeURIComponent(post.farmer)}`} className="font-bold text-[13px] hover:underline">{post.farmer}</Link>
                        <div className="text-[11px] text-gray-400">📍 {post.city}</div>
                      </div>
                    </div>
                    <div className="h-[280px] bg-gray-100"><img src={post.img} alt={post.crop} className="w-full h-full object-cover" /></div>
                    <div className="p-3">
                      <h3 className="font-bold text-[14px]">{post.crop}</h3>
                      <p className="text-[12px] text-gray-500 mt-1">{post.desc}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="font-black">{post.price} ج / كجم</span>
                        <Link href={`/farmer/${encodeURIComponent(post.farmer)}`} className="bg-black text-white px-5 py-2 rounded-full text-[12px] font-bold">عرض البروفايل</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
