"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function MessagesWithProfile() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [me, setMe] = useState<any>(null);
  const [search, setSearch] = useState("");

  useEffect(()=>{
    const u = JSON.parse(localStorage.getItem("contcrops_user") || "null") || { name: "hamza" };
    setMe(u);

    const defaultConvs = [
      { id: 1, name: "الحاج سعيد", last: "سأل عن الطماطم - 20 كيلو", city: "البحيرة", unread: 2, time: "منذ دقيقتين" },
      { id: 2, name: "مزرعة النور", last: "متاح عندنا برتقال صيفي", city: "النوبارية", unread: 0, time: "منذ ساعة" },
      { id: 3, name: "أبو خالد", last: "تمام يا غالي بكرا هعدي عليك", city: "كفر الشيخ", unread: 1, time: "أمس" },
    ];

    const savedConvs = JSON.parse(localStorage.getItem("contcrops_conversations") || "null");
    const convsToUse = savedConvs || defaultConvs;
    setConversations(convsToUse);
    
    const first = convsToUse[0];
    setSelected(first);

    if (first) {
      const savedMsgs = JSON.parse(localStorage.getItem(`contcrops_chat_${first.id}`) || "null");
      if (savedMsgs) {
        setMessages(savedMsgs);
      } else {
        setMessages([
          { from: "them", text: "السلام عليكم، الطماطم اللي عندك لسه متاحة؟", time: "10:30 ص" },
          { from: "me", text: "وعليكم السلام، ايوه متاحة 2 طن", time: "10:32 ص" },
        ]);
      }
    }
  },[]);

  const selectConv = (conv: any) => {
    setSelected(conv);
    const saved = JSON.parse(localStorage.getItem(`contcrops_chat_${conv.id}`) || "null");
    if (saved) {
      setMessages(saved);
    } else {
      setMessages([{ from: "them", text: `أهلاً ${me?.name || "يا غالي"}`, time: "الآن" }]);
    }
    const updated = conversations.map(c => c.id === conv.id ? { ...c, unread: 0 } : c);
    setConversations(updated);
    localStorage.setItem("contcrops_conversations", JSON.stringify(updated));
  };

  const saveMessages = (convId: number, msgs: any[]) => {
    localStorage.setItem(`contcrops_chat_${convId}`, JSON.stringify(msgs));
    setMessages(msgs);
    const lastText = msgs[msgs.length - 1]?.text || "";
    const updatedConvs = conversations.map(c => c.id === convId ? { ...c, last: lastText, time: "الآن" } : c);
    const sorted = [updatedConvs.find(c=>c.id===convId), ...updatedConvs.filter(c=>c.id!==convId)].filter(Boolean) as any[];
    setConversations(sorted);
    localStorage.setItem("contcrops_conversations", JSON.stringify(sorted));
  };

  const send = ()=>{
    if(!newMsg.trim() || !selected) return;
    const newMessages = [...messages, { from: "me", text: newMsg, time: "الآن" }];
    saveMessages(selected.id, newMessages);
    setNewMsg("");
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f6f1]">
      <header className="bg-white border-b sticky top-0 z-50 h-[56px] flex items-center">
        <div className="max-w-[1450px] mx-auto w-full px-4 flex items-center justify-between" dir="rtl">
          <div className="flex items-center gap-2">
            <Link href="/profile" className="w-8 h-8 bg-[#2e7d32] rounded-full flex items-center justify-center text-white font-bold text-[12px]">أ</Link>
            <Link href="/messages" className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">✉️</Link>
            <Link href="/market" className="w-8 h-8 bg-[#f0f1ed] rounded-full flex items-center justify-center">🏠</Link>
          </div>
          <Link href="/market" className="flex items-center gap-2 font-black">ContCrops <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">C</div></Link>
        </div>
      </header>

      <div className="max-w-[1450px] mx-auto px-3 py-4 grid grid-cols-12 gap-4">
        <aside className="col-span-12 lg:col-span-3 order-2 lg:order-3 space-y-3 lg:sticky lg:top-[72px] h-fit hidden lg:block">
          <div className="bg-white rounded-[16px] border border-black/5 p-3 flex items-center gap-3">
            <Link href="/profile" className="w-10 h-10 bg-[#2e7d32] rounded-full flex items-center justify-center text-white font-bold hover:ring-2">أ</Link>
            <div><p className="font-black text-[13px]">{me?.name || "hamza"}</p><p className="text-[11px] text-gray-400">مزارع - البحيرة</p></div>
          </div>
          <div className="bg-white rounded-[16px] border border-black/5 p-2">
            <Link href="/market" className="flex px-4 py-3 text-gray-500 text-[13px] hover:bg-gray-50 rounded-[12px]">🧺 السوق</Link>
            <Link href="/following" className="flex px-4 py-3 text-gray-500 text-[13px] hover:bg-gray-50 rounded-[12px]">👥 خلاصة المتابَعين</Link>
            <Link href="/threed" className="flex px-4 py-3 text-gray-500 text-[13px] hover:bg-gray-50 rounded-[12px]">💬 ثريد</Link>
            <Link href="/messages" className="flex bg-black text-white rounded-[12px] px-4 py-3 font-bold text-[13px]">✉️ الرسائل</Link>
            <Link href="/profile" className="flex px-4 py-3 text-gray-500 text-[13px] hover:bg-gray-50 rounded-[12px]">👤 الملف الشخصي</Link>
          </div>
        </aside>

        <section className="col-span-12 lg:col-span-9 order-1 flex gap-4 h-[calc(100vh-80px)]">
          {/* قائمة المحادثات */}
          <div className="w-full lg:w-[340px] bg-white rounded-[16px] border border-black/5 flex flex-col overflow-hidden">
            <div className="p-3 border-b">
              <h1 className="font-black text-[16px]">الرسائل 💬</h1>
              <p className="text-[11px] text-gray-400 mt-1">دوس على الصورة أو الاسم عشان تدخل بروفايله</p>
              <div className="relative mt-3">
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث..." className="w-full bg-[#f0f1ed] rounded-full h-9 pr-9 pl-4 text-[12px] outline-none" />
                <span className="absolute right-3 top-[7px]">🔍</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.filter(c=>c.name.includes(search)).map(c=>(
                <div key={c.id} className={`p-3 flex gap-3 border-b border-black/5 hover:bg-gray-50 group ${selected?.id===c.id ? 'bg-[#f0f1ed]' : ''}`}>
                  {/* الصورة - لينك للبروفايل */}
                  <Link href={`/farmer/${encodeURIComponent(c.name)}`} onClick={(e)=>e.stopPropagation()} className="w-11 h-11 bg-[#2e7d32] rounded-full flex items-center justify-center text-white font-bold shrink-0 hover:ring-2 hover:ring-green-400 transition">
                    {c.name[0]}
                  </Link>
                  {/* باقي المحادثة - تدوس عليها تفتح الشات */}
                  <div onClick={()=>selectConv(c)} className="flex-1 min-w-0 cursor-pointer">
                    <div className="flex justify-between">
                      <Link href={`/farmer/${encodeURIComponent(c.name)}`} onClick={(e)=>e.stopPropagation()} className="font-bold text-[13px] truncate hover:underline hover:text-[#2e7d32]">
                        {c.name}
                      </Link>
                      <span className="text-[10px] text-gray-400">{c.time}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate">{c.last}</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-2">📍 {c.city} <span className="bg-[#f0f1ed] px-2 py-0.5 rounded-full text-[9px] hover:bg-black hover:text-white">عرض البروفايل ←</span></p>
                  </div>
                  {c.unread>0 && <span className="bg-[#0a84ff] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center shrink-0">{c.unread}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* الشات */}
          <div className="hidden lg:flex flex-1 bg-white rounded-[16px] border border-black/5 flex-col overflow-hidden">
            {selected ? (
              <>
                <div className="p-3 border-b flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                    {/* هيدر الشات - الصورة والاسم لينك للبروفايل */}
                    <Link href={`/farmer/${encodeURIComponent(selected.name)}`} className="w-9 h-9 bg-[#2e7d32] rounded-full flex items-center justify-center text-white font-bold hover:ring-2 transition">
                      {selected.name[0]}
                    </Link>
                    <div>
                      <Link href={`/farmer/${encodeURIComponent(selected.name)}`} className="font-bold text-[13px] hover:underline hover:text-[#2e7d32]">
                        {selected.name}
                      </Link>
                      <p className="text-[11px] text-green-600 flex items-center gap-2">● متصل الآن <Link href={`/farmer/${encodeURIComponent(selected.name)}`} className="bg-[#f0f1ed] px-2 py-0.5 rounded-full text-[9px] text-black hover:bg-black hover:text-white">عرض البروفايل</Link></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/farmer/${encodeURIComponent(selected.name)}`} className="bg-black text-white px-4 py-1.5 rounded-full text-[11px] font-bold hover:bg-zinc-800">بروفايل</Link>
                    <Link href="/market" className="text-[12px] text-gray-500 hover:text-black">✕</Link>
                  </div>
                </div>
                <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-[#fbfaf6]">
                  {messages.map((m,i)=>(
                    <div key={i} className={`flex ${m.from==='me' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[70%] rounded-[16px] px-4 py-2 text-[13px] ${m.from==='me' ? 'bg-black text-white rounded-br-[4px]' : 'bg-white border border-black/5 rounded-bl-[4px]'}`}>
                        <p>{m.text}</p>
                        <span className={`text-[10px] mt-1 block ${m.from==='me' ? 'text-white/60' : 'text-gray-400'}`}>{m.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t flex gap-2">
                  <input value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>e.key==='Enter' && send()} placeholder={`راسل ${selected.name}...`} className="flex-1 bg-[#f0f1ed] rounded-full h-10 px-4 text-[13px] outline-none" />
                  <button onClick={send} className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">↑</button>
                </div>
              </>
            ) : <div className="flex-1 flex items-center justify-center text-gray-400 text-[13px]">اختر محادثة - دوس على الصورة أو الاسم عشان تدخل البروفايل</div>}
          </div>
        </section>
      </div>
    </main>
  );
}
