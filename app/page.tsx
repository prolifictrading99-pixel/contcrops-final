"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

const CROPS_MOCK = [
  {id:1, name:"طماطم بلدي", farmer:"أحمد المزارع", farmer_id:1, city:"المنصورة", price:"12 جنيه/ك", qty:"5 طن", category:"فريش", img:"https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600", avatar:"https://i.pravatar.cc/100?img=12", verified:true, likes:24, comments:5, liked:false, showComments:false, commentsList:[{id:1,name:"محمد",text:"الجودة ممتازة",time:"ساعتين"}]},
  {id:2, name:"مانجو عويس", farmer:"محمد الفكهاني", farmer_id:2, city:"الإسماعيلية", price:"35 جنيه/ك", qty:"2 طن", category:"فريش", img:"https://images.unsplash.com/photo-1553279768-865429fa0078?w=600", avatar:"https://i.pravatar.cc/100?img=15", verified:true, likes:42, comments:8, liked:false, showComments:false, commentsList:[]},
  {id:3, name:"قمح مجفف", farmer:"حسن الحبوب", farmer_id:3, city:"الشرقية", price:"18 جنيه/ك", qty:"10 طن", category:"مجفف", img:"https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600", avatar:"https://i.pravatar.cc/100?img=20", verified:false, likes:18, comments:2, liked:false, showComments:false, commentsList:[]},
  {id:4, name:"خدمة نقل مبرد", farmer:"سعيد للنقل", farmer_id:4, city:"الفيوم", price:"4 جنيه/ك", qty:"20 طن", category:"نقل ولوجيستك", img:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600", avatar:"https://i.pravatar.cc/100?img=33", verified:true, likes:31, comments:4, liked:false, showComments:false, commentsList:[]},
]

const COLLEAGUES_MOCK = [
  {id:1, name:"أحمد المزارع", city:"المنصورة", crops:24, followers:120, following:80, rating:4.9, online:true, avatar:"https://i.pravatar.cc/100?img=12", specialty:"خضروات", bio:"مزارع خضروات خبرة 15 سنة - المنصورة", cover:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"},
  {id:2, name:"فاطمة للشتلات", city:"القليوبية", crops:18, followers:95, following:60, rating:4.8, online:true, avatar:"https://i.pravatar.cc/100?img=26", specialty:"شتلات", bio:"مشتل شتلات هجين ومقاومة", cover:"https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800"},
  {id:3, name:"محمد الفكهاني", city:"الإسماعيلية", crops:32, followers:210, following:90, rating:5.0, online:false, avatar:"https://i.pravatar.cc/100?img=15", specialty:"فواكه", bio:"فواكه طازجة يوميا", cover:"https://images.unsplash.com/photo-1553279768-865429fa0078?w=800"},
  {id:4, name:"مزرعة النور", city:"البحيرة", crops:12, followers:60, following:30, rating:4.7, online:true, avatar:"https://i.pravatar.cc/100?img=45", specialty:"حبوب", bio:"حبوب عالية الجودة", cover:"https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800"},
]

const DISCUSSIONS_MOCK = [
  {id:1, farmer:COLLEAGUES_MOCK[0], text:"موسم البياض الدقيقي بدأ بدري السنة دي بسبب الرطوبة، حد عنده حل مجرب؟", time:"منذ 3 ساعات", likes:34, reposts:6, comments:12, liked:false, showComments:false, commentsList:[{name:"حسن",text:"رش كبريت ميكروني"}]},
  {id:2, farmer:COLLEAGUES_MOCK[1], text:"شتلات الطماطم الهجين الجديدة وصلت، انتاجية اعلى 30% ومقاومة للذبول", time:"منذ 5 ساعات", likes:28, reposts:4, comments:8, liked:false, showComments:false, commentsList:[]},
]

export default function ContCropsPlatform(){
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginMode, setLoginMode] = useState<"login"|"register">("login")
  const [activeTab, setActiveTab] = useState("market")
  const [activeCat, setActiveCat] = useState("الكل")
  const [search, setSearch] = useState("")
  const [colleagueSearch, setColleagueSearch] = useState("")
  const [selectedProfile, setSelectedProfile] = useState<any>(null)
  const [crops, setCrops] = useState(CROPS_MOCK)
  const [colleagues, setColleagues] = useState(COLLEAGUES_MOCK)
  const [discussions, setDiscussions] = useState(DISCUSSIONS_MOCK)
  const [following, setFollowing] = useState<number[]>([1,2])
  const [toast, setToast] = useState("")
  const [newComment, setNewComment] = useState("")
  const [newPost, setNewPost] = useState({name:"", city:"", price:"", qty:"", category:"فريش", desc:""})
  const [messages, setMessages] = useState([
    {id:1, with:COLLEAGUES_MOCK[0], last:"الطماطم وصلت؟", unread:2, chat:[{from:"them",text:"الطماطم وصلت؟"},{from:"me",text:"ايوه في الطريق"}]},
    {id:2, with:COLLEAGUES_MOCK[1], last:"الشتلات جاهزة", unread:0, chat:[{from:"them",text:"الشتلات جاهزة"}]},
  ])
  const [activeChat, setActiveChat] = useState(0)
  const [chatInput, setChatInput] = useState("")
  const [supabaseConnected, setSupabaseConnected] = useState(false)

  useEffect(()=>{
    async function loadFromSupabase(){
      try{
        const hasEnv = process.env.NEXT_PUBLIC_SUPABASE_URL
        if(!hasEnv) return
        const { data: cropsData } = await supabase.from("crops").select("*").order("created_at", {ascending:false})
        if(cropsData && cropsData.length>0){
          setCrops(cropsData.map((c:any)=>({...c, liked:false, showComments:false, commentsList:[]})) as any)
          setSupabaseConnected(true)
        }
        const { data: colleaguesData } = await supabase.from("colleagues").select("*")
        if(colleaguesData && colleaguesData.length>0){
          setColleagues(colleaguesData as any)
          setSupabaseConnected(true)
        }
      }catch(e){ console.log("Supabase", e) }
    }
    loadFromSupabase()
  },[])

  useEffect(()=>{
    const params = new URLSearchParams(window.location.search)
    const chatId = params.get("chat")
    if(chatId){
      const fid = Number(chatId)
      const existing = messages.findIndex(m=>m.with.id===fid)
      if(existing===-1){
        const farmerData = colleagues.find(c=>c.id===fid) || COLLEAGUES_MOCK.find(c=>c.id===fid) || COLLEAGUES_MOCK[0]
        const newMsg = {id:Date.now(), with:farmerData, last:"مرحبا 👋", unread:0, chat:[{from:"me",text:`مرحبا ${farmerData.name} بخصوص ${crops.find(c=>c.farmer_id===fid)?.name||"المحصول"} ⚡` }]}
        setMessages(prev=>[newMsg,...prev])
        setActiveChat(0)
      } else {
        setActiveChat(existing)
      }
      setActiveTab("messages")
      showToast("تم فتح المحادثة 💬")
      window.history.replaceState({}, "", "/")
    }
  },[colleagues])

  const CATS = ["الكل","فريش","مجمد","مجفف","محطات فرز وتعبئة","مستلزمات زراعة","مستلزمات انتاج","نقل ولوجيستك"]
  const showToast = (msg:string)=>{ setToast(msg); setTimeout(()=>setToast(""),2500) }

  const toggleLike = async (id:number)=>{
    setCrops(prev=> prev.map(c=> c.id===id? {...c, liked:!c.liked, likes: c.liked? (c as any).likes-1 : (c as any).likes+1} : c))
  }
  const toggleComments = (id:number)=>{ setCrops(prev=> prev.map(c=> c.id===id? {...c, showComments:!(c as any).showComments} : c)) }
  const handleShare = (id:number)=>{ navigator.clipboard.writeText(`${window.location.origin}/crop/${id}`); showToast("تم نسخ رابط المنشور") }
  const addComment = (cropId:number)=>{
    if(!newComment.trim()) return
    const comment = {id:Date.now(),name:"أنت",text:newComment,time:"الآن"}
    setCrops(prev=> prev.map(c=> c.id===cropId? {...c, commentsList:[...(c as any).commentsList,comment], comments:(c as any).comments+1} : c))
    setNewComment("")
  }
  const toggleFollow = (id:number)=>{
    setFollowing(f=> f.includes(id)? f.filter(x=>x!==id) : [...f,id])
    showToast(following.includes(id)? "تم إلغاء المتابعة" : "تمت المتابعة ✓")
  }
  const openChatWith = (col:any)=>{
    const existing = messages.findIndex(m=>m.with.id===col.id)
    if(existing===-1){
      const newMsg={id:Date.now(), with:col, last:`مرحبا ${col.name} 👋`, unread:0, chat:[{from:"me", text:`مرحبا ${col.name}، حابب أتواصل معاك بخصوص ${col.specialty||"المحاصيل"}`}]}
      setMessages(prev=>[newMsg,...prev])
      setActiveChat(0)
    } else {
      setActiveChat(existing)
    }
    setActiveTab("messages")
    showToast(`تم فتح محادثة مع ${col.name} 💬`)
  }

  const filteredCrops = crops.filter(c=> (activeCat==="الكل"||c.category===activeCat) && (c.name.includes(search)||c.city.includes(search)||c.farmer.includes(search)) )
  const filteredColleagues = colleagues.filter(c=> c.name.includes(colleagueSearch)||c.city.includes(colleagueSearch))
  const myPosts = crops.filter(c=> c.farmer_id===1)
  const profilePosts = selectedProfile? crops.filter(c=> c.farmer_id===selectedProfile.id) : myPosts

  if(!isLoggedIn){
    return (
      <div dir="rtl" className="min-h-screen bg-gradient-to-br from-emerald-600 to-emerald-900 flex items-center justify-center p-4">
        <div className="bg-white rounded- w-full max-w- p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl mb-3">🌿</div>
            <h1 className="text-2xl font-extrabold">ContCrops</h1>
            <p className="text-slate-500 text-sm mt-1">منصة المحاصيل والمجتمع الزراعي</p>
          </div>
          <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-full">
            <button onClick={()=>setLoginMode("login")} className={`flex-1 h-10 rounded-full text-sm font-bold ${loginMode==="login"?"bg-slate-900 text-white":"text-slate-600"}`}>دخول</button>
            <button onClick={()=>setLoginMode("register")} className={`flex-1 h-10 rounded-full text-sm font-bold ${loginMode==="register"?"bg-slate-900 text-white":"text-slate-600"}`}>حساب جديد</button>
          </div>
          <div className="space-y-3">
            <input placeholder="رقم الهاتف أو البريد" className="w-full h-12 px-4 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-400"/>
            <input placeholder="كلمة المرور" type="password" className="w-full h-12 px-4 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-400"/>
            {loginMode==="register" && <input placeholder="اسم المزرعة" className="w-full h-12 px-4 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-400"/>}
            <button onClick={()=>setIsLoggedIn(true)} className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800">دخول</button>
            <button onClick={()=>setIsLoggedIn(true)} className="w-full h-12 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700">دخول تجريبي ⚡</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f8fafc] flex">
      <aside className="hidden lg:flex w- bg-white border-l border-slate-100 flex-col sticky top-0 h-screen">
        <div className="p-5 flex items-center gap-2 border-b">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">🌿</div>
          <span className="font-extrabold text-xl">ContCrops</span>
          {supabaseConnected && <span className="mr-auto w-2 h-2 bg-emerald-500 rounded-full animate-pulse" title="Supabase connected"></span>}
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {[
            {id:"market", label:"السوق", icon:"🏪"},
            {id:"community", label:"المجتمع", icon:"👥"},
            {id:"messages", label:"الرسائل", icon:"💬", badge:messages.reduce((a,m)=>a+m.unread,0)},
            {id:"discussions", label:"المناقشات", icon:"🧵"},
            {id:"prices", label:"الأسعار", icon:"📈"},
            {id:"profile", label:"الملف الشخصي", icon:"👤"},
          ].map(tab=>(
            <button key={tab.id} onClick={()=>{setActiveTab(tab.id); setSelectedProfile(null)}} className={`w-full h-12 flex items-center gap-3 px-4 rounded-xl text-sm font-bold transition ${activeTab===tab.id &&!selectedProfile? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
              <span className="text-lg">{tab.icon}</span>{tab.label}
              {tab.badge>0 && <span className="mr-auto bg-red-500 text-white text- px-2 py-0.5 rounded-full">{tab.badge}</span>}
            </button>
          ))}
          <button onClick={()=>setActiveTab("add")} className="w-full h-12 flex items-center gap-3 px-4 rounded-xl text-sm font-bold mt-4 bg-emerald-600 text-white hover:bg-emerald-700">
            <span className="text-lg">➕</span>إضافة منشور
          </button>
        </nav>
        <div className="p-4 border-t flex items-center gap-3">
          <button onClick={()=>{setActiveTab("profile"); setSelectedProfile(null)}} className="flex items-center gap-3 flex-1 hover:bg-slate-50 rounded-xl p-1 -m-1 text-right">
            <img src="https://i.pravatar.cc/100?img=12" className="w-9 h-9 rounded-full"/>
            <div>
              <p className="text-sm font-bold">أحمد المزارع</p>
              <p className="text-xs text-slate-500">المنصورة</p>
            </div>
          </button>
          <button onClick={()=>{ if(confirm("هل تريد تسجيل الخروج؟")) setIsLoggedIn(false) }} className="text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-full transition">خروج</button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-100">
          <div className="max-w- mx-auto px-4 h- flex items-center gap-4">
            <div className="lg:hidden font-extrabold">ContCrops</div>
            <div className="flex-1 max-w- relative">
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث عن محصول، مدينة، زميل..." className="w-full h-11 pr-11 pl-4 bg-slate-50 border border-slate-200 rounded-full text-sm focus:bg-white focus:border-emerald-400 outline-none"/>
              <span className="absolute right-4 top-3 text-slate-400">🔍</span>
            </div>
          </div>
          {activeTab==="market" &&!selectedProfile && (
            <div className="max-w- mx-auto px-4 py-2 flex gap-2 overflow-x-auto border-t">
              {CATS.map(cat=>(
                <button key={cat} onClick={()=>setActiveCat(cat)} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition ${activeCat===cat? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>{cat}</button>
              ))}
            </div>
          )}
        </header>

        <div className="max-w- mx-auto p-4 lg:p-6">
          {selectedProfile? (
            <div className="bg-white rounded- border border-slate-100 overflow-hidden">
              <div className="h-40 bg-slate-200 relative"><img src={selectedProfile.cover||"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"} className="w-full h-full object-cover"/><button onClick={()=>setSelectedProfile(null)} className="absolute top-4 right-4 h-9 px-4 bg-white rounded-full text-sm font-bold shadow-sm">← رجوع</button></div>
              <div className="p-6">
                <div className="flex gap-4">
                  <img src={selectedProfile.avatar} className="w-20 h-20 rounded-full border-4 border-white -mt-12"/>
                  <div className="flex-1">
                    <h2 className="text-xl font-extrabold">{selectedProfile.name}</h2>
                    <p className="text-sm text-slate-500">{selectedProfile.city} • {selectedProfile.specialty||selectedProfile.bio}</p>
                    <div className="flex gap-4 mt-2 text-sm"><span><b>{selectedProfile.crops||12}</b> محصول</span><span><b>{selectedProfile.followers||60}</b> متابع</span><span>⭐ {selectedProfile.rating||4.9}</span></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>toggleFollow(selectedProfile.id)} className={`h-10 px-6 rounded-full text-sm font-bold transition ${following.includes(selectedProfile.id)?"bg-white border border-slate-200":"bg-slate-900 text-white hover:bg-slate-800"}`}>{following.includes(selectedProfile.id)?"إلغاء":"متابعة"}</button>
                    <button onClick={()=>openChatWith(selectedProfile)} className="h-10 px-6 bg-emerald-600 text-white rounded-full text-sm font-bold hover:bg-emerald-700 transition">مراسلة 💬</button>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {profilePosts.map(crop=> <CropCard key={crop.id} crop={crop} onProfileClick={setSelectedProfile} onLike={toggleLike} onComments={toggleComments} onShare={handleShare} newComment={newComment} setNewComment={setNewComment} onAddComment={addComment} colleagues={colleagues} />)}
              </div>
            </div>
          ) : (
            <>
              {activeTab==="market" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredCrops.map(crop=> <CropCard key={crop.id} crop={crop} onProfileClick={setSelectedProfile} onLike={toggleLike} onComments={toggleComments} onShare={handleShare} newComment={newComment} setNewComment={setNewComment} onAddComment={addComment} colleagues={colleagues} />)}
                </div>
              )}
              {activeTab==="community" && (
                <div>
                  <div className="mb-4 flex gap-3">
                    <input value={colleagueSearch} onChange={e=>setColleagueSearch(e.target.value)} placeholder="ابحث عن زميل..." className="flex-1 max-w- h-11 px-4 bg-white border border-slate-200 rounded-full text-sm outline-none focus:border-emerald-400"/>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredColleagues.map(col=>(
                      <div key={col.id} className="bg-white rounded- border border-slate-100 p-4 flex gap-3 hover:shadow-sm transition">
                        <img src={col.avatar} className="w-14 h-14 rounded-full"/>
                        <div className="flex-1">
                          <p className="font-bold text-sm cursor-pointer hover:underline" onClick={()=>setSelectedProfile(col)}>{col.name}</p>
                          <p className="text-xs text-slate-500">{col.city} • {col.specialty||col.bio?.slice(0,20)}</p>
                          <div className="flex gap-2 mt-3">
                            <button onClick={()=>toggleFollow(col.id)} className={`h-8 px-4 rounded-full text-xs font-bold transition ${following.includes(col.id)?"bg-white border border-slate-200":"bg-slate-900 text-white hover:bg-slate-800"}`}>{following.includes(col.id)?"إلغاء":"متابعة"}</button>
                            <button onClick={()=>openChatWith(col)} className="h-8 px-4 bg-emerald-600 text-white rounded-full text-xs font-bold hover:bg-emerald-700 transition">مراسلة 💬</button>
                          </div>
                        </div>
                        {col.online && <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab==="messages" && (
                <div className="bg-white rounded- border border-slate-100 overflow-hidden flex h-">
                  <div className="w- border-l border-slate-100 overflow-y-auto">
                    {messages.map((m,i)=>(
                      <button key={m.id} onClick={()=>setActiveChat(i)} className={`w-full p-4 flex gap-3 text-right border-b border-slate-50 hover:bg-slate-50 transition ${activeChat===i?"bg-slate-50":""}`}>
                        <img src={m.with.avatar} className="w-10 h-10 rounded-full"/>
                        <div className="flex-1 min-w-0 text-right">
                          <p className="text-sm font-bold truncate">{m.with.name}</p>
                          <p className="text-xs text-slate-500 truncate">{m.last}</p>
                        </div>
                        {m.unread>0 && <span className="w-5 h-5 bg-emerald-600 text-white text- rounded-full flex items-center justify-center">{m.unread}</span>}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1 flex flex-col">
                    {messages[activeChat]? (
                      <>
                        <div className="h-16 border-b border-slate-100 flex items-center gap-3 px-4">
                          <img src={messages[activeChat].with.avatar} className="w-9 h-9 rounded-full"/>
                          <p className="font-bold text-sm">{messages[activeChat].with.name}</p>
                          <span className="text-xs text-slate-500">• {messages[activeChat].with.city}</span>
                        </div>
                        <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-[#f8fafc]">
                          {messages[activeChat].chat.map((c:any,idx:number)=>(
                            <div key={idx} className={`flex ${c.from==="me"?"justify-end":"justify-start"}`}>
                              <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text- ${c.from==="me"?"bg-slate-900 text-white rounded-br-sm":"bg-white border border-slate-100 rounded-bl-sm"}`}>{c.text}</div>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 border-t border-slate-100 flex gap-2">
                          <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{
                            if(e.key==="Enter" && chatInput.trim()){
                              const newChat = [...messages[activeChat].chat, {from:"me", text:chatInput}]
                              setMessages(prev=> prev.map((m,i)=> i===activeChat? {...m, chat:newChat, last:chatInput}:m))
                              setChatInput("")
                            }
                          }} placeholder="اكتب رسالة..." className="flex-1 h-11 px-4 bg-slate-50 border border-slate-100 rounded-full text-sm outline-none focus:bg-white focus:border-emerald-300"/>
                          <button onClick={()=>{
                            if(!chatInput.trim()) return
                            const newChat = [...messages[activeChat].chat, {from:"me", text:chatInput}]
                            setMessages(prev=> prev.map((m,i)=> i===activeChat? {...m, chat:newChat, last:chatInput}:m))
                            setChatInput("")
                          }} className="h-11 px-6 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition">إرسال</button>
                        </div>
                      </>
                    ) : <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">اختر محادثة</div>}
                  </div>
                </div>
              )}
              {activeTab==="discussions" && (
                <div className="max-w- mx-auto space-y-4">
                  {discussions.map(d=>(
                    <div key={d.id} className="bg-white rounded- border border-slate-100 p-5">
                      <div className="flex gap-3">
                        <img src={d.farmer.avatar} className="w-10 h-10 rounded-full"/>
                        <div><p className="text-sm font-bold">{d.farmer.name}</p><p className="text-xs text-slate-500">{d.time}</p></div>
                      </div>
                      <p className="mt-3 text- leading-7">{d.text}</p>
                      <div className="flex gap-4 mt-4 text-sm text-slate-500"><button>❤️ {d.likes}</button><button>🔁 {d.reposts}</button><button>💬 {d.comments}</button></div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab==="prices" && (
                <div className="bg-white rounded- border border-slate-100 p-6">
                  <h2 className="font-bold text-lg mb-4">أسعار اليوم</h2>
                  <div className="space-y-3">
                    {crops.slice(0,6).map(c=>(
                      <div key={c.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl"><span className="text-sm font-bold">{c.name} - {c.city}</span><span className="text-sm font-bold text-emerald-700">{c.price}</span></div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab==="profile" && (
                <div className="bg-white rounded- border border-slate-100 overflow-hidden max-w- mx-auto">
                  <div className="h-40 bg-slate-200 relative"><img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800" className="w-full h-full object-cover"/></div>
                  <div className="p-6">
                    <div className="flex gap-4">
                      <img src="https://i.pravatar.cc/100?img=12" className="w-20 h-20 rounded-full border-4 border-white -mt-12"/>
                      <div><h2 className="text-xl font-extrabold">أحمد المزارع</h2><p className="text-sm text-slate-500">المنصورة • خضروات {supabaseConnected?"• 🟢 Supabase":""}</p></div>
                      <button className="mr-auto h-10 px-5 bg-white border border-slate-200 rounded-full text-sm font-bold hover:bg-slate-50">تعديل</button>
                    </div>
                  </div>
                  <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {myPosts.map(crop=> <CropCard key={crop.id} crop={crop} onProfileClick={setSelectedProfile} onLike={toggleLike} onComments={toggleComments} onShare={handleShare} newComment={newComment} setNewComment={setNewComment} onAddComment={addComment} colleagues={colleagues} />)}
                  </div>
                </div>
              )}
              {activeTab==="add" && (
                <div className="max-w- mx-auto bg-white rounded-2xl border border-slate-100 p-6">
                  <h2 className="font-bold text-lg mb-6">إضافة منشور جديد</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <input value={newPost.name} onChange={e=>setNewPost({...newPost,name:e.target.value})} placeholder="اسم المحصول" className="h-12 px-4 border border-slate-200 rounded-xl outline-none focus:border-emerald-400"/>
                    <select value={newPost.category} onChange={e=>setNewPost({...newPost,category:e.target.value})} className="h-12 px-4 border border-slate-200 rounded-xl outline-none">{CATS.slice(1).map(c=><option key={c}>{c}</option>)}</select>
                    <input value={newPost.city} onChange={e=>setNewPost({...newPost,city:e.target.value})} placeholder="المدينة" className="h-12 px-4 border border-slate-200 rounded-xl outline-none focus:border-emerald-400"/>
                    <input value={newPost.qty} onChange={e=>setNewPost({...newPost,qty:e.target.value})} placeholder="الكمية" className="h-12 px-4 border border-slate-200 rounded-xl outline-none focus:border-emerald-400"/>
                    <input value={newPost.price} onChange={e=>setNewPost({...newPost,price:e.target.value})} placeholder="السعر" className="h-12 px-4 border border-slate-200 rounded-xl col-span-2 outline-none focus:border-emerald-400"/>
                    <textarea value={newPost.desc} onChange={e=>setNewPost({...newPost,desc:e.target.value})} placeholder="وصف المحصول" className="col-span-2 min-h- p-4 border border-slate-200 rounded-xl outline-none focus:border-emerald-400"/>
                  </div>
                  <button onClick={async ()=>{
                    const payload = {name:newPost.name||"محصول جديد", farmer:"أحمد المزارع", farmer_id:1, city:newPost.city||"المنصورة", price:newPost.price||"10 ج", qty:newPost.qty||"1 طن", category:newPost.category, img:"https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600", avatar:"https://i.pravatar.cc/100?img=12", verified:true, likes:0, comments:0, description:newPost.desc}
                    try{
                      const {data} = await supabase.from("crops").insert(payload).select().single()
                      if(data) setCrops(prev=>[{...data, liked:false, showComments:false, commentsList:[]},...prev] as any)
                      else setCrops(prev=>[{id:Date.now(),...payload, liked:false, showComments:false, commentsList:[]},...prev] as any)
                    }catch{ setCrops(prev=>[{id:Date.now(),...payload, liked:false, showComments:false, commentsList:[]},...prev] as any) }
                    setActiveTab("market"); showToast("تم نشر المحصول 🟢"); setNewPost({name:"",city:"",price:"",qty:"",category:"فريش",desc:""})
                  }} className="w-full mt-6 h-12 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700">نشر</button>
                </div>
              )}
            </>
          )}
        </div>
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-100 flex justify-around py-2 z-50">
          <button onClick={()=>{setActiveTab("market"); setSelectedProfile(null)}} className={`flex flex-col items-center text- ${activeTab==="market"?"text-emerald-600":"text-slate-400"}`}>🏪<span>السوق</span></button>
          <button onClick={()=>{setActiveTab("community"); setSelectedProfile(null)}} className={`flex flex-col items-center text- ${activeTab==="community"?"text-emerald-600":"text-slate-400"}`}>👥<span>المجتمع</span></button>
          <button onClick={()=>setActiveTab("add")} className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl -mt-4 shadow-lg">+</button>
          <button onClick={()=>{setActiveTab("messages"); setSelectedProfile(null)}} className={`flex flex-col items-center text- ${activeTab==="messages"?"text-emerald-600":"text-slate-400"}`}>💬<span>رسائل</span></button>
          <button onClick={()=>{setActiveTab("profile"); setSelectedProfile(null)}} className={`flex flex-col items-center text- ${activeTab==="profile"?"text-emerald-600":"text-slate-400"}`}>👤<span>حسابي</span></button>
        </div>
        {toast && <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-full text-sm font-bold z-[90] shadow-lg">{toast}</div>}
      </main>
    </div>
  )
}

function CropCard({crop, onProfileClick, onLike, onComments, onShare, newComment, setNewComment, onAddComment, colleagues}:any){
  const farmer = colleagues?.find((c:any)=>c.id===crop.farmer_id) || {name:crop.farmer, avatar:crop.avatar, id:crop.farmer_id}
  return (
    <div className="bg-white rounded- overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition">
      <Link href={`/crop/${crop.id}`}><div className="relative h-48 cursor-pointer"><img src={crop.img} alt={crop.name} className="w-full h-full object-cover"/><div className="absolute top-3 right-3 flex gap-2"><span className="px-2.5 py-1 bg-white/90 rounded-full text- font-bold">{crop.category}</span>{crop.verified && <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-">✓</span>}</div></div></Link>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2 cursor-pointer hover:opacity-80 transition" onClick={()=>onProfileClick && onProfileClick(farmer)}><img src={crop.avatar} className="w-7 h-7 rounded-full"/><span className="text- font-bold hover:underline">{crop.farmer}</span><span className="text- text-slate-400">• {crop.city}</span></div>
        <Link href={`/crop/${crop.id}`}><h3 className="font-bold text- mb-1 hover:underline cursor-pointer">{crop.name}</h3></Link>
        <div className="flex justify-between items-center mt-3"><span className="text-sm font-bold text-emerald-700">{crop.price}</span><span className="text- bg-slate-50 px-2.5 py-1 rounded-full">{crop.qty}</span></div>
        <div className="flex gap-4 mt-4 pt-3 border-t border-slate-100 text-sm text-slate-600">
          <button onClick={()=>onLike(crop.id)} className={`${crop.liked?"text-red-500":""} font-bold hover:opacity-80`}>❤️ {crop.likes}</button>
          <button onClick={()=>onComments(crop.id)} className="hover:opacity-80">💬 {crop.comments}</button>
          <button onClick={()=>onShare(crop.id)} className="hover:opacity-80">↗️ مشاركة</button>
        </div>
        {crop.showComments && (
          <div className="mt-3 border-t border-slate-100 pt-3 space-y-2">
            {crop.commentsList.map((cc:any,i:number)=><div key={i} className="text-"><b>{cc.name}:</b> {cc.text}</div>)}
            <div className="flex gap-2"><input value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="اكتب تعليق..." className="flex-1 h-9 px-3 bg-slate-50 rounded-full text- outline-none focus:bg-white focus:border focus:border-emerald-200"/><button onClick={()=>onAddComment(crop.id)} className="h-9 px-4 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800">إرسال</button></div>
          </div>
        )}
      </div>
    </div>
  )
}