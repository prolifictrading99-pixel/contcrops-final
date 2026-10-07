"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

type Comment = { id: number; name: string; text: string; time: string };

export default function FarmerCompactImages() {
  const params = useParams();
  const farmerId = decodeURIComponent(params.id as string);
  const [posts, setPosts] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [likes, setLikes] = useState<Record<number, {count: number, liked: boolean}>>({});
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [showComments, setShowComments] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [me, setMe] = useState<any>(null);

  const farmersData: any = {
    "الحاج سعيد": { name: "الحاج سعيد", city: "البحيرة", bio: "مزارع طماطم وبطاطس - خبرة 20 سنة", followers: 342, rating: 4.8, verified: true },
    "مزرعة النور": { name: "مزرعة النور", city: "النوبارية", bio: "مزرعة برتقال ومانجو", followers: 520, rating: 4.9, verified: true },
  };
  const farmer = farmersData[farmerId] || { name: farmerId, city: "البحيرة", bio: "مزارع في ContCrops", followers: 0, rating: 4.5, verified: false };

  useEffect(()=>{
    setMounted(true);
    const u = JSON.parse(localStorage.getItem("contcrops_user") || "null") || { name: "hamza" };
    setMe(u);
    setIsFollowing(JSON.parse(localStorage.getItem("contcrops_following") || "[]").includes(farmerId));
    setFollowersCount(farmer.followers + JSON.parse(localStorage.getItem(`contcrops_followers_${farmerId}`) || "0"));
    setLikes(JSON.parse(localStorage.getItem("contcrops_likes") || "{}"));
    setComments(JSON.parse(localStorage.getItem("contcrops_comments") || "{}"));
    setNotifications(JSON.parse(localStorage.getItem("contcrops_notifications") || "[]"));
    const marketPosts = JSON.parse(localStorage.getItem("contcrops_posts") || "[]");
    let all = marketPosts.filter((p:any) => p.farmer === farmerId);
    if (all.length === 0) {
      all = [
        { id: 991, farmer: farmerId, city: "البحيرة", time: "منذ ساعتين", crop: "طماطم بلدي - 2 طن", desc: "جودة عالية، قطف اليوم", price: "8.5", img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800", baseLikes: 12 },
        { id: 992, farmer: farmerId, city: "البحيرة", time: "منذ يوم", crop: "بطاطس تحمير - 5 طن", desc: "تحمير ممتاز", price: "12", img: "https://images.unsplash.com/photo-1518977676608-bd36c7ff7f5a?w=800", baseLikes: 8 },
      ];
    }
    setPosts(all);
  },[farmerId]);

  const saveLikes = (nl:any) => { setLikes(nl); localStorage.setItem("contcrops_likes", JSON.stringify(nl)); };
  const saveComments = (nc:any) => { setComments(nc); localStorage.setItem("contcrops_comments", JSON.stringify(nc)); };
  const addNotif = (type:string, from:string, text:string) => {
    const n = { id: Date.now(), type, from, text, time: "الآن", read: false };
    const nn = [n, ...notifications].slice(0,50);
    setNotifications(nn);
    localStorage.setItem("contcrops_notifications", JSON.stringify(nn));
  };
  const toggleFollow = () => {
    const following = JSON.parse(localStorage.getItem("contcrops_following") || "[]");
    let nf; let ne = JSON.parse(localStorage.getItem(`contcrops_followers_${farmerId}`) || "0");
    if (isFollowing) { nf = following.filter((x:string)=>x!==farmerId); ne=Math.max(0,ne-1); setIsFollowing(false); }
    else { nf = [...following, farmerId]; ne++; setIsFollowing(true); addNotif("follow", farmerId, `تابعت ${farmerId}`); }
    localStorage.setItem("contcrops_following", JSON.stringify(nf));
    localStorage.setItem(`contcrops_followers_${farmerId}`, JSON.stringify(ne));
    setFollowersCount(farmer.followers + ne);
  };
  const toggleLike = (post:any) => {
    const cur = likes[post.id] || { count: post.baseLikes || 0, liked: false };
    const nl = { ...likes };
    if (cur.liked) nl[post.id] = { count: cur.count-1, liked: false };
    else { nl[post.id] = { count: cur.count+1, liked: true }; addNotif("like", post.farmer, `أعجبت بمنشور ${post.farmer}`); }
    saveLikes(nl);
  };
  const addComment = (post:any) => {
    if(!commentText.trim()) return;
    const pc = comments[post.id] || [];
    const newC = { id: Date.now(), name: me?.name || "hamza", text: commentText, time: "الآن" };
    const nc = { ...comments, [post.id]: [...pc, newC] };
    saveComments(nc); setCommentText(""); addNotif("comment", post.farmer, `علقت على منشور ${post.farmer}`);
  };

  if (!mounted) return <main dir="rtl" className="min-h-screen bg-[#f5f6f1] flex items-center justify-center"><p>جاري التحميل...</p></main>;
  const unread = notifications.filter((n:any)=>!n.read).length;

  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f6f1]">
      <header className="bg-white border-b sticky top-0 z-50 h-[56px] flex items-center">
        <div className="max-w-[1000px] mx-auto w-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/profile" className="w-8 h-8 bg-[#2e7d32] rounded-full flex items-center justify-center text-white font-bold text-[12px]">أ</Link>
            <Link href="/notifications" className="w-8 h-8 bg-[#f0f1ed] rounded-full flex items-center justify-center relative">🔔{unread>0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{unread}</span>}</Link>
            <Link href="/market" className="w-8 h-8 bg-[#f0f1ed] rounded-full flex items-center justify-center">🏠</Link>
          </div>
          <Link href="/market" className="flex items-center gap-2 font-black">ContCrops <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">C</div></Link>
        </div>
      </header>

      <div className="max-w-[900px] mx-auto px-3 py-4">
        <Link href="/market" className="inline-flex bg-white border px-4 py-2 rounded-full text-[13px] font-bold mb-4">← رجوع للسوق</Link>

        <div className="bg-white rounded-[16px] border border-black/5 p-4 flex gap-4 items-center">
          <div className="w-16 h-16 bg-[#2e7d32] rounded-full flex items-center justify-center text-white font-black text-[20px] shrink-0">{farmer.name[0]}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2"><h1 className="font-black text-[16px]">{farmer.name}</h1><span className="bg-[#eef7e8] text-[#2e7d32] text-[10px] px-2 py-0.5 rounded-full">📍 {farmer.city}</span></div>
            <p className="text-[12px] text-gray-500 mt-1">{farmer.bio} • {posts.length} منشور • {followersCount} متابع</p>
          </div>
          <button onClick={toggleFollow} className={`px-5 py-2 rounded-full text-[12px] font-bold ${isFollowing ? 'bg-[#f0f1ed]' : 'bg-black text-white'}`}>{isFollowing ? '✓ تتابع' : '+ متابعة'}</button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {posts.map((post:any)=>{
            const likeData = likes[post.id] || { count: post.baseLikes || 0, liked: false };
            const pcs = comments[post.id] || [];
            return (
              <div key={post.id} className="bg-white rounded-[16px] border border-black/5 overflow-hidden hover:shadow-sm transition">
                {/* هيدر صغير */}
                <div className="p-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#2e7d32] rounded-full flex items-center justify-center text-white font-bold text-[11px]">{farmer.name[0]}</div>
                  <div className="flex-1 min-w-0"><p className="font-bold text-[12px] truncate">{post.crop}</p><p className="text-[10px] text-gray-400">{post.time} • {post.city}</p></div>
                  <span className="font-black text-[12px] bg-[#f5f6f1] px-2 py-1 rounded-full">{post.price} ج</span>
                </div>

                {/* صورة صغيرة - 160px بس بدل 350px */}
                <div className="relative h-[160px] bg-[#fbf8ed] overflow-hidden group">
                  <img src={post.img} alt={post.crop} className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-300" />
                </div>

                {/* محتوى مضغوط */}
                <div className="p-3">
                  <p className="text-[11px] text-gray-500 line-clamp-1">{post.desc}</p>
                  <div className="flex items-center gap-1 mt-2.5">
                    <button onClick={()=>toggleLike(post)} className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${likeData.liked ? 'bg-red-50 text-red-500' : 'bg-[#f0f1ed] text-gray-600'}`}>{likeData.liked ? '❤️' : '🤍'} {likeData.count}</button>
                    <button onClick={()=>setShowComments(showComments===post.id ? null : post.id)} className="flex items-center gap-1 text-[11px] font-bold bg-[#f0f1ed] text-gray-600 px-2.5 py-1 rounded-full">💬 {pcs.length}</button>
                    <button className="text-[11px] font-bold bg-[#f0f1ed] text-gray-600 px-2.5 py-1 rounded-full">↗️</button>
                    <Link href={`/farmer/${encodeURIComponent(post.farmer)}`} className="mr-auto text-[10px] bg-black text-white px-3 py-1 rounded-full">عرض</Link>
                  </div>

                  {showComments===post.id && (
                    <div className="mt-3 pt-3 border-t border-black/5 space-y-2">
                      {pcs.map((c:any)=>(
                        <div key={c.id} className="flex gap-1.5"><div className="w-6 h-6 bg-[#2e7d32] rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0">{c.name[0]}</div><div className="bg-[#f5f6f1] rounded-[10px] px-2.5 py-1.5 flex-1"><p className="font-bold text-[10px]">{c.name}</p><p className="text-[11px]">{c.text}</p></div></div>
                      ))}
                      <div className="flex gap-1.5"><input value={commentText} onChange={e=>setCommentText(e.target.value)} onKeyDown={e=>e.key==='Enter' && addComment(post)} placeholder="تعليق..." className="flex-1 bg-[#f0f1ed] rounded-full h-8 px-3 text-[11px] outline-none" /><button onClick={()=>addComment(post)} className="bg-black text-white w-8 h-8 rounded-full text-[12px]">↑</button></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
