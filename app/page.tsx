"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

// MOCK DATA - هتتبدل بـ Supabase بعدين
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

  // تفعيل المراسلة من صفحة التفاصيل
  useEffect(()=>{
    const params = new URLSearchParams(window.location.search)
    const chatId = params.get("chat")
    if(chatId){
      const fid = Number(chatId)
      // لو المحادثة مش موجودة، أنشئها
      const existing = messages.findIndex(m=>m.with.id===fid)
      if(existing===-1){
        const farmerData = COLLEAGUES_MOCK.find(c=>c.id===fid) || COLLEAGUES_MOCK[0]
        const newMsg = {id:Date.now(), with:farmerData, last:"مرحبا 👋", unread:0, chat:[{from:"me",text:`مرحبا ${farmerData.name} بخصوص ${CROPS_MOCK.find(c=>c.farmer_id===fid)?.name||"المحصول"}` }]}
        setMessages(prev=>[newMsg, ...prev])
        setActiveChat(0)
      } else {
        setActiveChat(existing)
      }
      setActiveTab("messages")
      showToast("تم فتح المحادثة")
      // نظف الـ URL
      window.history.replaceState({}, "", "/")
    }
    // من localStorage كمان
    const stored = localStorage.getItem("contcrops_chat_with")
    if(stored && !params.get("chat")){
      try{
        const farmerData = JSON.parse(stored)
        const fid = farmerData.id
        const existing = messages.findIndex(m=>m.with.id===fid)
        if(existing===-1){
          const newMsg = {id:Date.now(), with:farmerData, last:"مرحبا 👋", unread:0, chat:[{from:"me",text:`مرحبا ${farmerData.name}`}]}
          setMessages(prev=>[newMsg, ...prev])
        }
        localStorage.removeItem("contcrops_chat_with")
      }catch{}
    }
  },[])

  const CATS = ["الكل","فريش","مجمد","مجفف","محطات فرز وتعبئة","مستلزمات زراعة","مستلزمات انتاج","نقل ولوجيستك"]

  const showToast = (msg:string)=>{ setToast(msg); setTimeout(()=>setToast(""),2500) }

  const toggleLike = (id:number)=>{
    setCrops(crops.map(c=> c.id===id ? {...c, liked:!c.liked, likes: c.liked? c.likes-1 : c.likes+1} : c))
  }
  const toggleComments = (id:number)=>{
    setCrops(crops.map(c=> c.id===id ? {...c, showComments:!c.showComments} : c))
  }
  const handleShare = (id:number)=>{
    navigator.clipboard.writeText(`https://contcrops.com/crop/${id}`)
    showToast("تم نسخ رابط المنشور")
  }
  const addComment = (cropId:number)=>{
    if(!newComment.trim()) return
    setCrops(crops.map(c=> c.id===cropId ? {...c, commentsList:[...c.commentsList,{id:Date.now(),name:"أنت",text:newComment,time:"الآن"}], comments:c.comments+1} : c))
    setNewComment("")
  }
  const toggleFollow = (id:number)=>{
    setFollowing(f=> f.includes(id) ? f.filter(x=>x!==id) : [...f,id])
    showToast(following.includes(id) ? "تم إلغاء المتابعة" : "تمت المتابعة")
  }

  const filteredCrops = crops.filter(c=> (activeCat==="الكل"||c.category===activeCat) && (c.name.includes(search)||c.city.includes(search)||c.farmer.includes(search)) )
  const filteredColleagues = colleagues.filter(c=> c.name.includes(colleagueSearch)||c.city.includes(colleagueSearch))
  const myPosts = crops.filter(c=> c.farmer_id===1)
  const profilePosts = selectedProfile ? crops.filter(c=> c.farmer_id===selectedProfile.id) : myPosts

  // LOGIN PAGE
  if(!isLoggedIn){
    return (
      <div dir="rtl" className="min-h-screen bg-gradient-to-br from-emerald-600 to-emerald-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-[32px] w-full max-w-[440px] p-8 shadow-2xl">
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
            <input placeholder="رقم الهاتف أو البريد" className="w-full h-12 px-4 border border-slate-200 rounded-xl text-sm"/>
            <input placeholder="كلمة المرور" type="password" className="w-full h-12 px-4 border border-slate-200 rounded-xl text-sm"/>
            {loginMode==="register" && <input placeholder="اسم المزرعة" className="w-full h-12 px-4 border border-slate-200 rounded-xl text-sm"/>}
            <button onClick={()=>setIsLoggedIn(true)} className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold">دخول</button>
            <button onClick={()=>setIsLoggedIn(true)} className="w-full h-12 bg-emerald-600 text-white rounded-xl font-bold">دخول تجريبي ⚡</button>
            <p className="text-center text-xs text-slate-500 pt-2">بتسجيلك توافق على شروط الاستخدام</p>
          </div>
        </div>
      </div>
    )
  }

  // MAIN PLATFORM
  return (
    <div dir="rtl" className="min-h-screen bg-[#f8fafc] flex">
      {/* SIDEBAR RIGHT - 7 TABS */}
      <aside className="hidden lg:flex w-[280px] bg-white border-l border-slate-100 flex-col sticky top-0 h-screen">
        <div className="p-5 flex items-center gap-2 border-b">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">🌿</div>
          <span className="font-extrabold text-xl">ContCrops</span>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {[
            {id:"market", label:"السوق", icon:"🏪"},
            {id:"community", label:"المجتمع", icon:"👥"},
            {id:"messages", label:"الرسائل", icon:"💬", badge:3},
            {id:"discussions", label:"المناقشات", icon:"🧵"},
            {id:"prices", label:"الأسعار", icon:"📈"},
            {id:"profile", label:"الملف الشخصي", icon:"👤"},
          ].map(tab=>(
            <button key={tab.id} onClick={()=>{setActiveTab(tab.id); setSelectedProfile(null)}} className={`w-full h-12 flex items-center gap-3 px-4 rounded-xl text-sm font-bold ${activeTab===tab.id && !selectedProfile ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
              <span className="text-lg">{tab.icon}</span>{tab.label}
              {tab.badge && <span className="mr-auto bg-red-500 text-white text-[11px] px-2 py-0.5 rounded-full">{tab.badge}</span>}
            </button>
          ))}
          <button onClick={()=>setActiveTab("add")} className={`w-full h-12 flex items-center gap-3 px-4 rounded-xl text-sm font-bold mt-4 ${activeTab==="add" ? "bg-emerald-600 text-white" : "bg-emerald-600 text-white"}`}>
            <span className="text-lg">➕</span>إضافة منشور
          </button>
        </nav>
        <div className="p-4 border-t flex items-center gap-3">
          <img src="https://i.pravatar.cc/100?img=12" className="w-9 h-9 rounded-full"/>
          <div className="flex-1">
            <p className="text-sm font-bold">أحمد المزارع</p>
            <p className="text-xs text-slate-500">المنصورة</p>
          </div>
          <button onClick={()=>setIsLoggedIn(false)} className="text-xs text-slate-500">خروج</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        {/* TOP SEARCH */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-100">
          <div className="max-w-[1200px] mx-auto px-4 h-[64px] flex items-center gap-4">
            <div className="lg:hidden font-extrabold">ContCrops</div>
            <div className="flex-1 max-w-[520px] relative">
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث عن محصول، مدينة، زميل..." className="w-full h-11 pr-11 pl-4 bg-slate-50 border border-slate-200 rounded-full text-sm focus:bg-white focus:border-emerald-400 outline-none"/>
              <span className="absolute right-4 top-3 text-slate-400">🔍</span>
            </div>
          </div>
          {activeTab==="market" && !selectedProfile && (
            <div className="max-w-[1200px] mx-auto px-4 py-2 flex gap-2 overflow-x-auto scrollbar-none border-t">
              {CATS.map(cat=>(
                <button key={cat} onClick={()=>setActiveCat(cat)} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border ${activeCat===cat ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"}`}>{cat}</button>
              ))}
            </div>
          )}
        </header>

        <div className="max-w-[1200px] mx-auto p-4 lg:p-6">
          {/* COLLEAGUE PROFILE VIEW */}
          {selectedProfile && (
            <div>
              <button onClick={()=>setSelectedProfile(null)} className="mb-4 h-9 px-4 bg-white border rounded-full text-sm">← رجوع</button>
              <div className="bg-white rounded-[24px] border overflow-hidden mb-6">
                <div className="h-32 bg-slate-200 relative"><img src={selectedProfile.cover} className="w-full h-full object-cover"/><div className="absolute inset-0 bg-black/20"/></div>
                <div className="p-5">
                  <div className="flex gap-4">
                    <img src={selectedProfile.avatar} className="w-20 h-20 rounded-full border-4 border-white -mt-12"/>
                    <div className="flex-1">
                      <h2 className="text-xl font-extrabold flex items-center gap-2">{selectedProfile.name} <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[10px]">✓</span></h2>
                      <p className="text-sm text-slate-500">{selectedProfile.city} • {selectedProfile.specialty}</p>
                      <p className="text-sm mt-2">{selectedProfile.bio}</p>
                      <div className="flex gap-6 mt-4 text-sm">
                        <span><b>{selectedProfile.crops}</b> محصول</span>
                        <span><b>{selectedProfile.followers}</b> متابع</span>
                        <span><b>{selectedProfile.following}</b> يتابع</span>
                        <span>⭐ {selectedProfile.rating}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>toggleFollow(selectedProfile.id)} className={`h-10 px-5 rounded-full text-sm font-bold ${following.includes(selectedProfile.id)?"bg-slate-100":"bg-slate-900 text-white"}`}>{following.includes(selectedProfile.id)?"إلغاء متابعة":"متابعة"}</button>
                      <button onClick={()=>setActiveTab("messages")} className="h-10 px-5 bg-white border rounded-full text-sm font-bold">مراسلة</button>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="font-bold mb-4">منشورات {selectedProfile.name} - زي السوق بالظبط</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {profilePosts.map(crop=> <CropCard key={crop.id} crop={crop} onProfileClick={setSelectedProfile} onLike={toggleLike} onComments={toggleComments} onShare={handleShare} newComment={newComment} setNewComment={setNewComment} onAddComment={addComment} />)}
              </div>
            </div>
          )}

          {!selectedProfile && activeTab==="market" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCrops.map(crop=> <CropCard key={crop.id} crop={crop} onProfileClick={setSelectedProfile} onLike={toggleLike} onComments={toggleComments} onShare={handleShare} newComment={newComment} setNewComment={setNewComment} onAddComment={addComment} colleagues={colleagues} />)}
            </div>
          )}

          {!selectedProfile && activeTab==="community" && (
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
              <div className="space-y-5">
                <div className="bg-white rounded-2xl border p-4">
                  <h3 className="font-bold mb-3">بحث عن زملاء</h3>
                  <div className="relative"><input value={colleagueSearch} onChange={e=>setColleagueSearch(e.target.value)} placeholder="اسم زميل أو مدينة..." className="w-full h-11 pr-10 pl-3 bg-slate-50 border rounded-full text-sm"/><span className="absolute right-3 top-3">🔍</span></div>
                </div>
                <div className="bg-white rounded-2xl border p-4">
                  <h3 className="font-bold mb-3">أتابعهم ({following.length})</h3>
                  <div className="space-y-3">
                    {colleagues.filter(c=>following.includes(c.id)).map(col=>(
                      <div key={col.id} className="flex gap-3 items-center">
                        <img src={col.avatar} className="w-10 h-10 rounded-full cursor-pointer" onClick={()=>setSelectedProfile(col)}/>
                        <div className="flex-1 cursor-pointer" onClick={()=>setSelectedProfile(col)}><p className="text-sm font-bold">{col.name}</p><p className="text-xs text-slate-500">{col.city}</p></div>
                        <button onClick={()=>toggleFollow(col.id)} className="text-xs px-3 py-1 bg-slate-100 rounded-full">إلغاء</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border p-4">
                  <h3 className="font-bold mb-3">اقتراح زملاء</h3>
                  <div className="space-y-3">
                    {filteredColleagues.filter(c=>!following.includes(c.id)).slice(0,5).map(col=>(
                      <div key={col.id} className="flex gap-3 items-center">
                        <img src={col.avatar} className="w-10 h-10 rounded-full cursor-pointer" onClick={()=>setSelectedProfile(col)}/>
                        <div className="flex-1 cursor-pointer" onClick={()=>setSelectedProfile(col)}><p className="text-sm font-bold">{col.name}</p><p className="text-xs text-slate-500">{col.city} • {col.specialty}</p></div>
                        <button onClick={()=>toggleFollow(col.id)} className="h-8 px-4 bg-slate-900 text-white rounded-full text-xs font-bold">متابعة</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border p-4">
                <h3 className="font-bold mb-4">كل الزملاء - اضغط على الاسم للدخول لبروفايله</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredColleagues.map(col=>(
                    <div key={col.id} className="border rounded-2xl p-4 flex gap-3 hover:shadow-md cursor-pointer" onClick={()=>setSelectedProfile(col)}>
                      <img src={col.avatar} className="w-14 h-14 rounded-full"/>
                      <div className="flex-1"><p className="font-bold">{col.name}</p><p className="text-xs text-slate-500">{col.city} • {col.specialty}</p><p className="text-xs mt-1">{col.crops} محصول • ⭐ {col.rating}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!selectedProfile && activeTab==="messages" && (
            <div className="bg-white rounded-2xl border overflow-hidden flex h-[600px]">
              <div className="w-[320px] border-l">
                <div className="p-4 border-b font-bold">الرسائل</div>
                {messages.map((m,idx)=>(
                  <button key={m.id} onClick={()=>setActiveChat(idx)} className={`w-full p-3 flex gap-3 text-right hover:bg-slate-50 ${activeChat===idx?"bg-slate-50":""}`}>
                    <img src={m.with.avatar} className="w-10 h-10 rounded-full"/>
                    <div className="flex-1 min-w-0"><p className="text-sm font-bold truncate">{m.with.name}</p><p className="text-xs text-slate-500 truncate">{m.last}</p></div>
                    {m.unread>0 && <span className="w-5 h-5 bg-emerald-600 text-white text-[11px] rounded-full flex items-center justify-center">{m.unread}</span>}
                  </button>
                ))}
              </div>
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b flex gap-3 items-center"><img src={messages[activeChat]?.with.avatar} className="w-9 h-9 rounded-full"/><span className="font-bold text-sm">{messages[activeChat]?.with.name}</span></div>
                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                  {messages[activeChat]?.chat.map((ch,i)=>(
                    <div key={i} className={`max-w-[75%] p-3 rounded-2xl text-sm ${ch.from==="me"?"bg-slate-900 text-white mr-auto rounded-bl-sm":"bg-slate-100 ml-auto rounded-br-sm"}`}>{ch.text}</div>
                  ))}
                </div>
                <div className="p-3 border-t flex gap-2"><input value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="اكتب رسالة..." className="flex-1 h-11 px-4 bg-slate-50 rounded-full text-sm"/><button onClick={()=>{if(chatInput){const copy=[...messages]; copy[activeChat].chat.push({from:"me",text:chatInput}); setMessages(copy); setChatInput("")}}} className="h-11 px-5 bg-slate-900 text-white rounded-full text-sm font-bold">إرسال</button></div>
              </div>
            </div>
          )}

          {!selectedProfile && activeTab==="discussions" && (
            <div className="max-w-[720px] mx-auto space-y-5">
              <div className="bg-white rounded-2xl border p-4 flex gap-3"><img src="https://i.pravatar.cc/100?img=12" className="w-10 h-10 rounded-full"/><input placeholder="ابدأ مناقشة جديدة..." className="flex-1 bg-slate-50 rounded-full px-4 h-11 text-sm"/><button className="h-11 px-5 bg-slate-900 text-white rounded-full text-sm font-bold">نشر</button></div>
              {discussions.map(d=>(
                <div key={d.id} className="bg-white rounded-2xl border p-4">
                  <div className="flex gap-3"><img src={d.farmer.avatar} className="w-10 h-10 rounded-full cursor-pointer" onClick={()=>setSelectedProfile(d.farmer)}/><div><p className="font-bold text-sm cursor-pointer" onClick={()=>setSelectedProfile(d.farmer)}>{d.farmer.name}</p><p className="text-xs text-slate-500">{d.time}</p></div></div>
                  <p className="mt-3 text-[15px] leading-7">{d.text}</p>
                  <div className="flex gap-6 mt-4 text-sm text-slate-500">
                    <button onClick={()=>{setDiscussions(discussions.map(x=> x.id===d.id ? {...x, liked:!x.liked, likes: x.liked?x.likes-1:x.likes+1}:x))}} className={d.liked?"text-red-500":""}>❤️ {d.likes}</button>
                    <button onClick={()=>setDiscussions(discussions.map(x=> x.id===d.id ? {...x, showComments:!x.showComments}:x))}>💬 {d.comments}</button>
                    <button onClick={()=>handleShare(d.id)}>↗️ مشاركة</button>
                  </div>
                  {d.showComments && <div className="mt-4 border-t pt-3 space-y-2">{d.commentsList.map((cc:any,i:number)=><div key={i} className="text-sm"><b>{cc.name}:</b> {cc.text}</div>)}<div className="flex gap-2"><input value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="اكتب تعليق..." className="flex-1 h-9 px-3 bg-slate-50 rounded-full text-sm"/><button onClick={()=>{if(newComment){setDiscussions(discussions.map(x=> x.id===d.id ? {...x, commentsList:[...x.commentsList,{name:"أنت",text:newComment}], comments:x.comments+1}:x)); setNewComment("")}}} className="h-9 px-4 bg-slate-900 text-white rounded-full text-xs">إرسال</button></div></div>}
                </div>
              ))}
            </div>
          )}

          {!selectedProfile && activeTab==="prices" && (
            <div className="bg-white rounded-2xl border p-6">
              <h2 className="font-bold text-lg mb-4">أسعار اليوم</h2>
              <div className="grid grid-cols-3 gap-3 text-sm font-bold text-slate-500 border-b pb-2"><span>المحصول</span><span>السعر</span><span>التغير</span></div>
              {[{name:"طماطم",price:"12 ج",change:"+2%"},{name:"بطاطس",price:"9 ج",change:"-1%"},{name:"مانجو",price:"35 ج",change:"+5%"}].map(r=>(
                <div key={r.name} className="grid grid-cols-3 py-3 border-b text-sm"><span>{r.name}</span><span>{r.price}</span><span className={r.change.startsWith("+")?"text-emerald-600":"text-red-500"}>{r.change}</span></div>
              ))}
            </div>
          )}

          {!selectedProfile && activeTab==="profile" && (
            <div>
              <div className="bg-white rounded-[24px] border overflow-hidden mb-6">
                <div className="h-32 bg-gradient-to-br from-emerald-600 to-emerald-800"/>
                <div className="p-5 flex gap-4">
                  <img src="https://i.pravatar.cc/100?img=12" className="w-20 h-20 rounded-full border-4 border-white -mt-12"/>
                  <div className="flex-1"><h2 className="text-xl font-extrabold">أحمد المزارع</h2><p className="text-sm text-slate-500">المنصورة • خضروات</p><div className="flex gap-6 mt-3 text-sm"><span><b>{myPosts.length}</b> منشور</span><span><b>120</b> متابع</span><span><b>80</b> يتابع</span></div></div>
                  <button className="h-10 px-5 bg-white border rounded-full text-sm font-bold">تعديل</button>
                </div>
              </div>
              <h3 className="font-bold mb-4">منشوراتي - نفس شكل السوق بالظبط</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {myPosts.map(crop=> <CropCard key={crop.id} crop={crop} onProfileClick={setSelectedProfile} onLike={toggleLike} onComments={toggleComments} onShare={handleShare} newComment={newComment} setNewComment={setNewComment} onAddComment={addComment} colleagues={colleagues} />)}
              </div>
            </div>
          )}

          {!selectedProfile && activeTab==="add" && (
            <div className="max-w-[720px] mx-auto bg-white rounded-2xl border p-6">
              <h2 className="font-bold text-lg mb-6">إضافة منشور جديد</h2>
              <div className="grid grid-cols-2 gap-4">
                <input value={newPost.name} onChange={e=>setNewPost({...newPost,name:e.target.value})} placeholder="اسم المحصول" className="h-12 px-4 border rounded-xl"/>
                <select value={newPost.category} onChange={e=>setNewPost({...newPost,category:e.target.value})} className="h-12 px-4 border rounded-xl">{CATS.slice(1).map(c=><option key={c}>{c}</option>)}</select>
                <input value={newPost.city} onChange={e=>setNewPost({...newPost,city:e.target.value})} placeholder="المدينة" className="h-12 px-4 border rounded-xl"/>
                <input value={newPost.qty} onChange={e=>setNewPost({...newPost,qty:e.target.value})} placeholder="الكمية" className="h-12 px-4 border rounded-xl"/>
                <input value={newPost.price} onChange={e=>setNewPost({...newPost,price:e.target.value})} placeholder="السعر" className="h-12 px-4 border rounded-xl col-span-2"/>
                <textarea value={newPost.desc} onChange={e=>setNewPost({...newPost,desc:e.target.value})} placeholder="وصف المحصول" className="col-span-2 min-h-[84px] p-4 border rounded-xl"/>
              </div>
              <div className="mt-4 border-2 border-dashed rounded-xl h-32 flex items-center justify-center text-slate-400">+ رفع صورة</div>
              <button onClick={()=>{const newCrop={id:Date.now(), name:newPost.name||"محصول جديد", farmer:"أحمد المزارع", farmer_id:1, city:newPost.city||"المنصورة", price:newPost.price||"10 ج", qty:newPost.qty||"1 طن", category:newPost.category, img:"https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600", avatar:"https://i.pravatar.cc/100?img=12", verified:true, likes:0, comments:0, liked:false, showComments:false, commentsList:[]}; setCrops([newCrop,...crops]); setActiveTab("market"); showToast("تم نشر المحصول"); setNewPost({name:"",city:"",price:"",qty:"",category:"فريش",desc:""})}} className="w-full mt-6 h-12 bg-emerald-600 text-white rounded-xl font-bold">نشر</button>
            </div>
          )}
        </div>

        {/* BOTTOM NAV MOBILE */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t flex justify-around py-2 z-50">
          <button onClick={()=>setActiveTab("market")} className={`flex flex-col items-center text-[11px] ${activeTab==="market"?"text-emerald-600":""}`}>🏪<span>السوق</span></button>
          <button onClick={()=>setActiveTab("community")} className={`flex flex-col items-center text-[11px] ${activeTab==="community"?"text-emerald-600":""}`}>👥<span>المجتمع</span></button>
          <button onClick={()=>setActiveTab("add")} className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl -mt-4">+</button>
          <button onClick={()=>setActiveTab("discussions")} className={`flex flex-col items-center text-[11px] ${activeTab==="discussions"?"text-emerald-600":""}`}>🧵<span>نقاش</span></button>
          <button onClick={()=>setActiveTab("profile")} className={`flex flex-col items-center text-[11px] ${activeTab==="profile"?"text-emerald-600":""}`}>👤<span>حسابي</span></button>
        </div>

        {toast && <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-full text-sm font-bold z-[90]">{toast}</div>}
      </main>
    </div>
  )
}

function CropCard({crop, onProfileClick, onLike, onComments, onShare, newComment, setNewComment, onAddComment, colleagues}:any){
  const farmer = colleagues?.find((c:any)=>c.id===crop.farmer_id) || {name:crop.farmer, avatar:crop.avatar, id:crop.farmer_id}
  return (
    <div className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition">
      <Link href={`/crop/${crop.id}`}><div className="relative h-48 cursor-pointer"><img src={crop.img} alt={crop.name} className="w-full h-full object-cover"/><div className="absolute top-3 right-3 flex gap-2"><span className="px-2.5 py-1 bg-white/90 rounded-full text-[11px] font-bold">{crop.category}</span>{crop.verified && <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[12px]">✓</span>}</div></div></Link>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2 cursor-pointer" onClick={()=>onProfileClick && onProfileClick(farmer)}><img src={crop.avatar} className="w-7 h-7 rounded-full"/><span className="text-[13px] font-bold hover:underline">{crop.farmer}</span><span className="text-[12px] text-slate-400">• {crop.city}</span></div>
        <Link href={`/crop/${crop.id}`}><h3 className="font-bold text-[16px] mb-1 hover:underline cursor-pointer">{crop.name}</h3></Link>
        <div className="flex justify-between items-center mt-3"><span className="text-sm font-bold text-emerald-700">{crop.price}</span><span className="text-[12px] bg-slate-50 px-2.5 py-1 rounded-full">{crop.qty}</span></div>
        <div className="flex gap-4 mt-4 pt-3 border-t text-sm text-slate-600">
          <button onClick={()=>onLike(crop.id)} className={`${crop.liked?"text-red-500":""} font-bold`}>❤️ {crop.likes}</button>
          <button onClick={()=>onComments(crop.id)}>💬 {crop.comments}</button>
          <button onClick={()=>onShare(crop.id)}>↗️ مشاركة</button>
        </div>
        {crop.showComments && (
          <div className="mt-3 border-t pt-3 space-y-2">
            {crop.commentsList.map((cc:any,i:number)=><div key={i} className="text-[13px]"><b>{cc.name}:</b> {cc.text}</div>)}
            <div className="flex gap-2"><input value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="اكتب تعليق..." className="flex-1 h-9 px-3 bg-slate-50 rounded-full text-[13px]"/><button onClick={()=>onAddComment(crop.id)} className="h-9 px-4 bg-slate-900 text-white rounded-full text-xs font-bold">إرسال</button></div>
          </div>
        )}
      </div>
    </div>
  )
}
