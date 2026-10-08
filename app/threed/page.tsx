"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ThreedRealPosts() {
  const [me, setMe] = useState<any>(null);
  const [text, setText] = useState("");
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editText, setEditText] = useState("");
  const [showMenu, setShowMenu] = useState<number | null>(null);

  const defaultPosts = [
    { id: 9991, name: "الحاج سعيد", badge: "نصيحة زراعية", time: "منذ 3 ساعات", content: "نصيحة اليوم: رش الكالسيوم للطماطم في الصباح الباكر يمنع عفن الطرف الزهري 🍅 جربته الأسبوع اللي فات والنتيجة فرق 90% - الرش يكون 2سم / لتر قبل الشمس.", likes: 87, isMine: false },
    { id: 9992, name: "مزرعة النور", badge: "سؤال", time: "منذ 5 ساعات", content: "يا جماعة حد جرب صنف مانجو كيت في البحيرة؟", likes: 12, isMine: false },
  ];

  const [posts, setPosts] = useState<any[]>(defaultPosts);

  // تحميل المنشورات المحفوظة أول ما الصفحة تفتح
  useEffect(()=>{
    const u = JSON.parse(localStorage.getItem("contcrops_user") || "null");
    setMe(u || { name: "hamza" });

    const saved = JSON.parse(localStorage.getItem("contcrops_threed") || "[]");
    if (saved.length > 0) {
      setPosts([...saved, ...defaultPosts]);
    }
  },[]);

  const saveToStorage = (allPosts: any[]) => {
    const myPosts = allPosts.filter(p => p.isMine);
    localStorage.setItem("contcrops_threed", JSON.stringify(myPosts));
    setPosts(allPosts);
  };

  const publish = ()=>{
    if(!text.trim()) return;
    
    const newPost = { 
      id: Date.now(), 
      name: me?.name || "hamza", 
      badge: "منشور", 
      time: "الآن", 
      content: text, 
      likes: 0, 
      isMine: true 
    };
    
    const newAll = [newPost, ...posts];
    saveToStorage(newAll);
    setText("");
  };

  const deletePost = (id: number) => {
    if(confirm("تحذف المنشور؟")) {
      const newAll = posts.filter(p => p.id !== id);
      saveToStorage(newAll);
      setShowMenu(null);
    }
  };

  const startEdit = (post: any) => {
    setEditingPost(post);
    setEditText(post.content);
    setShowMenu(null);
  };

  const saveEdit = () => {
    const newAll = posts.map(p => p.id === editingPost.id ? { ...p, content: editText } : p);
    saveToStorage(newAll);
    setEditingPost(null);
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f6f1]">
      <header className="bg-white border-b sticky top-0 z-50 h-[56px] flex items-center">
        <div className="max-w-[1450px] mx-auto w-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/profile" className="w-8 h-8 bg-[#2e7d32] rounded-full flex items-center justify-center text-white font-bold text-[12px]">أ</Link>
            <Link href="/messages" className="w-8 h-8 bg-[#f0f1ed] rounded-full flex items-center justify-center relative">✉️<span className="absolute -top-1 -right-1 bg-[#0a84ff] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">3</span></Link>
            <Link href="/" className="w-8 h-8 bg-[#f0f1ed] rounded-full flex items-center justify-center">🏠</Link>
          </div>
          <Link href="/" className="flex items-center gap-2 font-black">ContCrops <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">C</div></Link>
        </div>
      </header>

      <div className="max-w-[1450px] mx-auto px-3 py-4 grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-3 order-2 lg:order-3">
          <aside className="space-y-3 lg:sticky lg:top-[72px] h-fit">
            <div className="bg-white rounded-[16px] border border-black/5 p-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2e7d32] rounded-full flex items-center justify-center text-white font-bold">أ</div>
              <div><p className="font-black text-[13px]">hamza</p><p className="text-[11px] text-gray-400">مزارع - البحيرة</p></div>
            </div>
            <div className="bg-white rounded-[16px] border border-black/5 p-2">
              <Link href="/" className="flex px-4 py-3 text-gray-500 text-[13px] hover:bg-gray-50 rounded-[12px]">🧺 السوق</Link>
              <Link href="/threed" className="flex bg-black text-white rounded-[12px] px-4 py-3 font-bold text-[13px]">💬 ثريد</Link>
              <Link href="/messages" className="flex px-4 py-3 text-gray-500 text-[13px] hover:bg-gray-50 rounded-[12px]">✉️ الرسائل</Link>
              <Link href="/profile" className="flex px-4 py-3 text-gray-500 text-[13px] hover:bg-gray-50 rounded-[12px]">👤 الملف الشخصي</Link>
            </div>
          </aside>
        </div>

        <section className="col-span-12 lg:col-span-6 order-1 lg:order-2 space-y-3">
          <div className="bg-white rounded-[16px] border border-black/5 p-4">
            <h1 className="font-black text-[16px] flex items-center gap-2">💬 ثريد المزارعين</h1>
            <p className="text-[12px] text-gray-400 mt-1">نقاشات يومية، نصائح زراعية، وأسعار لحظية - منشوراتك هتتحفظ دلوقتي</p>
          </div>

          <div className="bg-white rounded-[16px] border border-black/5 p-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-[#2e7d32] rounded-full flex items-center justify-center text-white font-bold shrink-0">أ</div>
              <div className="flex-1">
                <textarea value={text} onChange={e=>setText(e.target.value)} maxLength={280} placeholder="شارك نصيحة، سؤال، أو تجربة زراعية.." className="w-full bg-[#f5f6f1] rounded-[16px] min-h-[80px] p-4 text-[13px] outline-none resize-none border border-black/5 focus:border-black" />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[11px] text-gray-400">{text.length}/280</span>
                  <button onClick={publish} disabled={!text.trim()} className={`px-6 py-2 rounded-full font-bold text-[13px] ${text.trim() ? 'bg-black text-white hover:bg-zinc-800' : 'bg-gray-300 text-white cursor-not-allowed'}`}>نشر في الثريد 🚀</button>
                </div>
              </div>
            </div>
          </div>

          {posts.map(p=>(
            <div key={p.id} className="bg-white rounded-[16px] border border-black/5 p-4 relative">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-[#2e7d32] rounded-full flex items-center justify-center text-white font-bold text-[14px]">{p.name[0]}</div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[13px]">{p.name}</span>
                      <span className="bg-[#eef7e8] text-[#2e7d32] text-[10px] px-2 py-0.5 rounded-full">{p.badge}</span>
                      <span className="text-[11px] text-gray-400">· {p.time}</span>
                      {p.isMine && <span className="bg-black text-white text-[9px] px-2 py-0.5 rounded-full">منشورك - محفوظ ✅</span>}
                    </div>
                  </div>
                </div>
                {p.isMine && (
                  <div className="relative">
                    <button onClick={()=>setShowMenu(showMenu===p.id ? null : p.id)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">⋮</button>
                    {showMenu===p.id && (
                      <div className="absolute left-0 top-9 bg-white border border-black/10 rounded-[12px] shadow-xl w-[150px] overflow-hidden z-20">
                        <button onClick={()=>startEdit(p)} className="w-full text-right px-4 py-2.5 text-[13px] hover:bg-gray-50">✏️ تعديل</button>
                        <button onClick={()=>deletePost(p.id)} className="w-full text-right px-4 py-2.5 text-[13px] hover:bg-red-50 text-red-600">🗑️ حذف</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-[13px] leading-6 mt-3 whitespace-pre-wrap">{p.content}</p>
              <div className="flex gap-4 mt-3 text-[12px] text-gray-400">
                <span>❤️ {p.likes}</span>
                <span>💬 رد</span>
              </div>
            </div>
          ))}
        </section>

        <aside className="col-span-12 lg:col-span-3 order-3 lg:order-1 lg:sticky lg:top-[72px] h-fit space-y-3">
          <h3 className="font-black text-[13px]">إعلانات ممولة</h3>
          <div className="bg-white rounded-[16px] border p-3"><div className="bg-[#7ab74f] rounded-[12px] p-3 text-white font-black text-[12px]">أكترا® حماية فائقة</div></div>
          <button onClick={()=>{localStorage.removeItem("contcrops_threed"); setPosts(defaultPosts);}} className="w-full text-[11px] text-red-400">مسح كل منشوراتي في الثريد (للتجربة)</button>
        </aside>
      </div>

      {editingPost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[400px] p-5">
            <h2 className="font-black text-[16px] mb-4">تعديل المنشور</h2>
            <textarea value={editText} onChange={e=>setEditText(e.target.value)} className="w-full bg-[#f5f6f1] rounded-[12px] min-h-[100px] p-4 text-[13px] outline-none border" />
            <div className="flex gap-2 mt-4">
              <button onClick={()=>setEditingPost(null)} className="flex-1 bg-[#f0f1ed] rounded-full py-3 text-[13px] font-bold">إلغاء</button>
              <button onClick={saveEdit} className="flex-1 bg-black text-white rounded-full py-3 text-[13px] font-bold">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
