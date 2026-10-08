"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

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
  const [mounted, setMounted] = useState(false)
  const [loginMode, setLoginMode] = useState<"login"|"register">("login")
  const [loginPhone, setLoginPhone] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginFarmName, setLoginFarmName] = useState("")
  const [loginError, setLoginError] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)
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
    setMounted(true)
    const saved = localStorage.getItem("contcrops_logged_in")
    const savedUser = localStorage.getItem("contcrops_user")
    if(saved==="true" && savedUser){
      try{ const u=JSON.parse(savedUser); setCurrentUser(u); setIsLoggedIn(true) }catch{}
    }
  },[])

  useEffect(()=>{
    if(mounted){
      localStorage.setItem("contcrops_logged_in", String(isLoggedIn))
      if(currentUser) localStorage.setItem("contcrops_user", JSON.stringify(currentUser))
    }
  },[isLoggedIn, mounted, currentUser])

  useEffect(()=>{
    async function loadFromSupabase(){
      try{
        if(!isSupabaseConfigured()) return
        const { data: cropsData } = await supabase.from("crops").select("*").order("created_at", {ascending:false})
        if(cropsData && cropsData.length>0){
          setCrops(cropsData.map((c:any)=>({...c, liked:false, showComments:false, commentsList:[]})) as any)
          setSupabaseConnected(true)
        }
      }catch{}
    }
    loadFromSupabase()
  },[])

  useEffect(()=>{
    const params = new URLSearchParams(window.location.search)
    const chatId = params.get("chat")
    if(chatId){
      const fid = Number(chatId)
      const farmerData = colleagues.find(c=>c.id===fid) || COLLEAGUES_MOCK.find(c=>c.id===fid) || COLLEAGUES_MOCK[0]
      const existing = messages.findIndex(m=>m.with.id===fid)
      if(existing===-1){
        const newMsg = {id:Date.now(), with:farmerData, last:"مرحبا 👋", unread:0, chat:[{from:"me",text:`مرحبا ${farmerData.name} بخصوص ${crops.find(c=>c.farmer_id===fid)?.name||"المحصول"} ⚡` }]}
        setMessages(prev=>[newMsg,...prev])
        setActiveChat(0)
      } else setActiveChat(existing)
      setActiveTab("messages")
      showToast("تم فتح المحادثة 💬")
      window.history.replaceState({}, "", "/")
    }
  },[colleagues])

  const CATS = ["الكل","فريش","مجمد","مجفف","محطات فرز وتعبئة","مستلزمات زراعة","مستلزمات انتاج","نقل ولوجيستك"]
  const showToast = (msg:string)=>{ setToast(msg); setTimeout(()=>setToast(""),2500) }
  const toggleLike = (id:number)=>{ setCrops(prev=> prev.map(c=> c.id===id? {...c, liked:!c.liked, likes: c.liked? (c as any).likes-1 : (c as any).likes+1} : c)) }
  const toggleComments = (id:number)=>{ setCrops(prev=> prev.map(c=> c.id===id? {...c, showComments:!(c as any).showComments} : c)) }
  const handleShare = (id:number)=>{ navigator.clipboard.writeText(`${window.location.origin}/crop/${id}`); showToast("تم نسخ رابط المنشور") }
  const addComment = (cropId:number)=>{
    if(!newComment.trim()) return
    setCrops(prev=> prev.map(c=> c.id===cropId? {...c, commentsList:[...(c as any).commentsList,{id:Date.now(),name:currentUser?.name||"أنت",text:newComment,time:"الآن"}], comments:(c as any).comments+1} : c))
    setNewComment("")
  }
  const toggleFollow = (id:number)=>{
    setFollowing(f=> f.includes(id)? f.filter(x=>x!==id) : [...f,id])
    showToast(following.includes(id)? "تم إلغاء المتابعة" : "تمت المتابعة ✓")
  }
  const openChatWith = (col:any)=>{
    const existing = messages.findIndex(m=>m.with.id===col.id)
    if(existing===-1){
      const newMsg={id:Date.now(), with:col, last:`مرحبا ${col.name} 👋`, unread:0, chat:[{from:"me", text:`مرحبا ${col.name}، حابب أتواصل معاك`}]}
      setMessages(prev=>[newMsg,...prev])
      setActiveChat(0)
    } else setActiveChat(existing)
    setActiveTab("messages")
    showToast(`تم فتح محادثة مع ${col.name} 💬`)
  }

  const filteredCrops = crops.filter(c=> (activeCat==="الكل"||c.category===activeCat) && (c.name.includes(search)||c.city.includes(search)||c.farmer.includes(search)) )
  const filteredColleagues = colleagues.filter(c=> c.name.includes(colleagueSearch)||c.city.includes(colleagueSearch))
  const myPosts = crops.filter(c=> c.farmer_id===currentUser?.id || c.farmer===currentUser?.name)
  const profilePosts = selectedProfile? crops.filter(c=> c.farmer_id===selectedProfile.id) : myPosts

  const handleAuth = () => {
    setLoginError("")
    if(!loginPhone.trim() || !loginPassword.trim()){
      setLoginError("اكمل البيانات")
      return
    }
    if(loginMode==="register"){
      if(!loginFarmName.trim()){
        setLoginError("اكتب اسم المزرعة")
        return
      }
      const users = JSON.parse(localStorage.getItem("contcrops_users")||"[]")
      if(users.find((u:any)=>u.phone===loginPhone)){
        setLoginError("الحساب موجود، اعمل دخول")
        return
      }
      const newUser = {
        id: Date.now(),
        phone: loginPhone.trim(),
        password: loginPassword.trim(),
        name: loginFarmName.trim(),
        city: "المنصورة",
        avatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random()*70)}`,
        specialty: "فريش",
      }
      users.push(newUser)
      localStorage.setItem("contcrops_users", JSON.stringify(users))
      localStorage.setItem("contcrops_user", JSON.stringify(newUser))
      setCurrentUser(newUser)
      setIsLoggedIn(true)
      localStorage.setItem("contcrops_logged_in","true")
    } else {
      const users = JSON.parse(localStorage.getItem("contcrops_users")||"[]")
      const found = users.find((u:any)=>u.phone===loginPhone && u.password===loginPassword)
      if(found){
        localStorage.setItem("contcrops_user", JSON.stringify(found))
        setCurrentUser(found)
        setIsLoggedIn(true)
        localStorage.setItem("contcrops_logged_in","true")
      } else {
        const tempName = loginFarmName.trim() || (loginPhone.includes("@") ? loginPhone.split("@")[0] : loginPhone.trim()) || "مستخدم جديد"
        const tempUser = {
          id: Date.now(),
          phone: loginPhone.trim(),
          name: tempName,
          city: "المنصورة",
          avatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random()*70)}`,
          specialty: "فريش",
        }
        localStorage.setItem("contcrops_user", JSON.stringify(tempUser))
        setCurrentUser(tempUser)
        setIsLoggedIn(true)
        localStorage.setItem("contcrops_logged_in","true")
      }
    }
  }

  if(!mounted){
    return (
      <div dir="rtl" className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if(!isLoggedIn){
    return (
      <div dir="rtl" suppressHydrationWarning className="min-h-screen bg-gradient-to-br from-emerald-600 to-emerald-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-[32px] w-full max-w-[440px] p-8 shadow-2xl">
          <div className="text-center mb-8">
            <button type="button" onClick={()=>{setActiveTab("market"); setSelectedProfile(null)}} className="mx-auto">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-black text-emerald-500 flex items-center justify-center text-2xl font-extrabold mb-3">C</div>
            </button>
            <h1 className="text-2xl font-extrabold">ContCrops</h1>
            <p className="text-slate-500 text-[11px] mt-1 font-bold tracking-wide">تواصل - تبادل - نمو مستدام</p>
          </div>
          <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-full">
            <button onClick={()=>{setLoginMode("login"); setLoginError("")}} className={`flex-1 h-10 rounded-full text-sm font-bold ${loginMode==="login"?"bg-slate-900 text-white":"text-slate-600"}`}>دخول</button>
            <button onClick={()=>{setLoginMode("register"); setLoginError("")}} className={`flex-1 h-10 rounded-full text-sm font-bold ${loginMode==="register"?"bg-slate-900 text-white":"text-slate-600"}`}>حساب جديد</button>
          </div>
          <div className="space-y-3">
            <input value={loginPhone} onChange={e=>setLoginPhone(e.target.value)} placeholder="رقم الهاتف أو البريد" className="w-full h-12 px-4 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-400"/>
            <input value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} placeholder="كلمة المرور" type="password" className="w-full h-12 px-4 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-400"/>
            {loginMode==="register" && <input value={loginFarmName} onChange={e=>setLoginFarmName(e.target.value)} placeholder="اسم المزرعة" className="w-full h-12 px-4 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-400"/>}
            {loginError && <p className="text-red-500 text-xs font-bold text-center">{loginError}</p>}
            <button onClick={handleAuth} className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition">{loginMode==="register"?"إنشاء حساب":"دخول"}</button>
            <button onClick={()=>{ const demo={id:999, name:"أحمد المزارع", city:"المنصورة", avatar:"https://i.pravatar.cc/100?img=12", specialty:"خضروات"}; localStorage.setItem("contcrops_user", JSON.stringify(demo)); setCurrentUser(demo); localStorage.setItem("contcrops_logged_in","true"); setIsLoggedIn(true)}} className="w-full h-12 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition">دخول تجريبي ⚡</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div dir="rtl" suppressHydrationWarning className="min-h-screen bg-[#f8fafc] flex">
      <aside className="hidden lg:flex w-[280px] bg-white border-l border-slate-100 flex-col sticky top-0 h-screen">
        <button type="button" onClick={()=>{setActiveTab("market"); setSelectedProfile(null)}} className="p-5 flex items-center gap-2 border-b border-slate-100 w-full text-right hover:bg-slate-50 transition">
          <div className="w-9 h-9 rounded-xl bg-black text-emerald-500 flex items-center justify-center font-extrabold text-lg">C</div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-[16px]">ContCrops</span>
            <span className="text-[9px] text-slate-500 font-bold mt-0.5">تواصل - تبادل - نمو مستدام</span>
          </div>
          {supabaseConnected && <span className="mr-auto w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>}
        </button>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {[
            {id:"market", label:"السوق", icon:"🏪"},
            {id:"community", label:"المجتمع", icon:"👥"},
            {id:"messages", label:"الرسائل", icon:"💬", badge:messages.reduce((a,m)=>a+m.unread,0)},
            {id:"discussions", label:"المناقشات", icon:"🧵"},
            {id:"prices", label:"الأسعار", icon:"📈"},
            {id:"profile", label:"الملف الشخصي", icon:"👤"},
          ].map(tab=>(
            <button key={tab.id} onClick={()=>{setActiveTab(tab.id); setSelectedProfile(null)}} className={`w-full h-12 flex items-center gap-3 px-4 rounded-xl text-sm font-bold ${activeTab===tab.id && !selectedProfile ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
              <span className="text-lg">{tab.icon}</span>{tab.label}
              {tab.badge>0 && <span className="mr-auto bg-red-500 text-white text-[11px] px-2 py-0.5 rounded-full">{tab.badge}</span>}
            </button>
          ))}
          <button onClick={()=>setActiveTab("add")} className="w-full h-12 flex items-center gap-3 px-4 rounded-xl text-sm font-bold mt-4 bg-emerald-600 text-white">
            <span className="text-lg">➕</span>إضافة منشور
          </button>
        </nav>
        <div className="p-4 border-t border-slate-100 flex items-center gap-3">
          <button onClick={()=>{setActiveTab("profile"); setSelectedProfile(null)}} className="flex items-center gap-3 flex-1 text-right hover:bg-slate-50 rounded-xl p-1 -m-1">
            <img src={currentUser?.avatar||"https://i.pravatar.cc/100?img=12"} className="w-9 h-9 rounded-full"/>
            <div>
              <p className="text-sm font-bold">{currentUser?.name||"مستخدم"}</p>
              <p className="text-xs text-slate-500">{currentUser?.city||"المنصورة"}</p>
            </div>
          </button>
          <button onClick={()=>{if(confirm("تسجيل خروج؟")){ localStorage.removeItem("contcrops_logged_in"); localStorage.removeItem("contcrops_user"); setIsLoggedIn(false); setCurrentUser(null); setLoginPhone(""); setLoginPassword(""); setLoginFarmName("") }}} className="text-xs text-slate-500 hover:text-red-500">خروج</button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-100">
          <div className="max-w-[1200px] mx-auto px-4 h-[64px] flex items-center gap-4">
            <button type="button" onClick={()=>{setActiveTab("market"); setSelectedProfile(null)}} className="lg:hidden flex items-center gap-2 font-extrabold"><div className="w-8 h-8 rounded-lg bg-black text-emerald-500 flex items-center justify-center font-extrabold text-sm">C</div><div className="flex flex-col leading-none text-right"><span className="text-[14px]">ContCrops</span><span className="text-[8px] text-slate-500 font-bold">تواصل - تبادل - نمو مستدام</span></div></button>
            <div className="flex-1 max-w-[520px] relative">
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث عن محصول، مدينة، زميل..." className="w-full h-11 pr-11 pl-4 bg-slate-50 border border-slate-200 rounded-full text-sm focus:bg-white focus:border-emerald-400 outline-none"/>
              <span className="absolute right-4 top-3 text-slate-400">🔍</span>
            </div>
          </div>
          {activeTab==="market" && !selectedProfile && (
            <div className="max-w-[1200px] mx-auto px-4 py-2 flex gap-2 overflow-x-auto border-t border-slate-100">
              {CATS.map(cat=>(
                <button key={cat} onClick={()=>setActiveCat(cat)} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border ${activeCat===cat ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"}`}>{cat}</button>
              ))}
            </div>
          )}
        </header>

        <div className="max-w-[1200px] mx-auto p-4">
          {selectedProfile ? (
            <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden">
              <div className="h-40 bg-slate-200 relative"><img src={selectedProfile.cover} className="w-full h-full object-cover"/></div>
              <div className="p-6">
                <div className="flex gap-4">
                  <img src={selectedProfile.avatar} className="w-20 h-20 rounded-full border-4 border-white -mt-12"/>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-extrabold">{selectedProfile.name}</h2>
                      <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[10px]">✓</span>
                    </div>
                    <p className="text-sm text-slate-500">{selectedProfile.city} • {selectedProfile.specialty}</p>
                    <p className="text-sm mt-2">{selectedProfile.bio}</p>
                    <div className="flex gap-4 mt-3 text-sm">
                      <span><b>{selectedProfile.crops}</b> محصول</span>
                      <span><b>{selectedProfile.followers}</b> متابع</span>
                      <span>⭐ {selectedProfile.rating}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>toggleFollow(selectedProfile.id)} className={`h-10 px-5 rounded-full text-sm font-bold ${following.includes(selectedProfile.id)?"bg-slate-100":"bg-slate-900 text-white"}`}>{following.includes(selectedProfile.id)?"تتابع":"متابعة"}</button>
                    <button onClick={()=>openChatWith(selectedProfile)} className="h-10 px-5 bg-white border rounded-full text-sm font-bold">مراسلة</button>
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="font-bold mb-4">محاصيل {selectedProfile.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profilePosts.map(c=><CropCard key={c.id} crop={c} onProfileClick={setSelectedProfile} onLike={toggleLike} onComments={toggleComments} onShare={handleShare} newComment={newComment} setNewComment={setNewComment} onAddComment={addComment} colleagues={colleagues}/>)}
                  </div>
                </div>
                <button onClick={()=>setSelectedProfile(null)} className="mt-6 h-10 px-5 bg-slate-50 border rounded-full text-sm">← رجوع للسوق</button>
              </div>
            </div>
          ) : (
            <>
              {activeTab==="market" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCrops.map(c=><CropCard key={c.id} crop={c} onProfileClick={setSelectedProfile} onLike={toggleLike} onComments={toggleComments} onShare={handleShare} newComment={newComment} setNewComment={setNewComment} onAddComment={addComment} colleagues={colleagues}/>)}
                </div>
              )}
              {activeTab==="community" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredColleagues.map(col=>(
                    <div key={col.id} className="bg-white rounded-[24px] border border-slate-100 p-5">
                      <div className="flex gap-3">
                        <img src={col.avatar} className="w-12 h-12 rounded-full"/>
                        <div className="flex-1">
                          <p className="font-bold text-sm">{col.name}</p>
                          <p className="text-xs text-slate-500">{col.city} • {col.specialty}</p>
                          <p className="text-xs mt-1">{col.bio}</p>
                        </div>
                        {col.online && <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button onClick={()=>toggleFollow(col.id)} className={`flex-1 h-9 rounded-full text-xs font-bold ${following.includes(col.id)?"bg-slate-100":"bg-slate-900 text-white"}`}>{following.includes(col.id)?"تتابع":"متابعة"}</button>
                        <button onClick={()=>openChatWith(col)} className="flex-1 h-9 bg-white border rounded-full text-xs font-bold">مراسلة</button>
                        <button onClick={()=>setSelectedProfile(col)} className="h-9 px-3 bg-slate-50 rounded-full text-xs">بروفايل</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab==="messages" && (
                <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden flex h-[600px]">
                  <div className="w-[300px] border-l border-slate-100 flex flex-col">
                    <div className="p-4 border-b border-slate-100 font-bold">الرسائل</div>
                    <div className="flex-1 overflow-y-auto">
                      {messages.map((m,i)=>(
                        <button key={m.id} onClick={()=>setActiveChat(i)} className={`w-full p-4 flex gap-3 text-right hover:bg-slate-50 ${activeChat===i?"bg-slate-50":""}`}>
                          <img src={m.with.avatar} className="w-10 h-10 rounded-full"/>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{m.with.name}</p>
                            <p className="text-xs text-slate-500 truncate">{m.last}</p>
                          </div>
                          {m.unread>0 && <span className="w-5 h-5 bg-emerald-600 text-white rounded-full text-[10px] flex items-center justify-center">{m.unread}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    {messages[activeChat] && (
                      <>
                        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                          <img src={messages[activeChat].with.avatar} className="w-9 h-9 rounded-full"/>
                          <p className="font-bold text-sm">{messages[activeChat].with.name}</p>
                        </div>
                        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                          {messages[activeChat].chat.map((msg:any, idx:number)=>(
                            <div key={idx} className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${msg.from==="me"?"bg-slate-900 text-white mr-auto rounded-br-sm":"bg-slate-100 ml-auto rounded-bl-sm"}`}>{msg.text}</div>
                          ))}
                        </div>
                        <div className="p-3 border-t border-slate-100 flex gap-2">
                          <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){ const nm=[...messages]; nm[activeChat].chat.push({from:"me",text:chatInput}); nm[activeChat].last=chatInput; setMessages(nm); setChatInput("") }}} placeholder="اكتب رسالة..." className="flex-1 h-11 px-4 bg-slate-50 rounded-full text-sm outline-none"/>
                          <button onClick={()=>{ if(!chatInput.trim()) return; const nm=[...messages]; nm[activeChat].chat.push({from:"me",text:chatInput}); nm[activeChat].last=chatInput; setMessages(nm); setChatInput("") }} className="h-11 px-5 bg-slate-900 text-white rounded-full text-sm font-bold">إرسال</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
              {activeTab==="discussions" && (
                <div className="max-w-[640px] mx-auto space-y-4">
                  {discussions.map(d=>(
                    <div key={d.id} className="bg-white rounded-[24px] border border-slate-100 p-5">
                      <div className="flex gap-3">
                        <img src={d.farmer.avatar} className="w-10 h-10 rounded-full"/>
                        <div>
                          <p className="text-sm font-bold">{d.farmer.name}</p>
                          <p className="text-xs text-slate-500">{d.time}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-[14px] leading-6">{d.text}</p>
                      <div className="flex gap-4 mt-4 text-sm text-slate-500">
                        <button className="hover:text-slate-900">❤️ {d.likes}</button>
                        <button className="hover:text-slate-900">🔁 {d.reposts}</button>
                        <button className="hover:text-slate-900">💬 {d.comments}</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab==="profile" && (
                <div className="max-w-[800px] mx-auto">
                  <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden">
                    <div className="h-40 bg-gradient-to-br from-emerald-600 to-emerald-800"></div>
                    <div className="p-6">
                      <div className="flex gap-4">
                        <img src={currentUser?.avatar||"https://i.pravatar.cc/100?img=12"} className="w-20 h-20 rounded-full border-4 border-white -mt-12"/>
                        <div>
                          <h2 className="text-xl font-extrabold">{currentUser?.name}</h2>
                          <p className="text-sm text-slate-500">{currentUser?.city} • {currentUser?.specialty||"مزارع"}</p>
                        </div>
                      </div>
                      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                        <div className="bg-slate-50 rounded-2xl p-4"><p className="text-2xl font-extrabold">{myPosts.length}</p><p className="text-xs text-slate-500">محصول</p></div>
                        <div className="bg-slate-50 rounded-2xl p-4"><p className="text-2xl font-extrabold">120</p><p className="text-xs text-slate-500">متابع</p></div>
                        <div className="bg-slate-50 rounded-2xl p-4"><p className="text-2xl font-extrabold">80</p><p className="text-xs text-slate-500">يتابع</p></div>
                      </div>
                      <h3 className="font-bold mt-8 mb-4">محاصيلي</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {myPosts.map(c=><CropCard key={c.id} crop={c} onProfileClick={setSelectedProfile} onLike={toggleLike} onComments={toggleComments} onShare={handleShare} newComment={newComment} setNewComment={setNewComment} onAddComment={addComment} colleagues={colleagues}/>)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab==="prices" && (
                <div className="space-y-4">
                  {/* Header */}
                  <div className="bg-white rounded-[24px] border border-slate-100 p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-extrabold flex items-center gap-2">📈 أسعار السوق اليوم</h2>
                        <p className="text-xs text-slate-500 mt-1">آخر تحديث: اليوم • {new Date().toLocaleDateString('ar-EG')} • سوق العبور والمنصورة</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">● السوق مفتوح</span>
                        <span className="px-3 py-1.5 bg-slate-50 rounded-full text-xs font-bold border">مصدر: تجار الجملة</span>
                      </div>
                    </div>

                    {/* Summary cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                      <div className="bg-slate-50 rounded-2xl p-4 border">
                        <p className="text-[11px] text-slate-500 font-bold">متوسط السوق</p>
                        <p className="text-xl font-extrabold mt-1">18.5 جنيه/ك</p>
                        <p className="text-[11px] text-emerald-600 mt-1">↑ +2.3% عن الأمس</p>
                      </div>
                      <div className="bg-white rounded-2xl p-4 border">
                        <p className="text-[11px] text-slate-500 font-bold">أعلى ارتفاع اليوم</p>
                        <p className="text-[14px] font-extrabold mt-1">🍅 طماطم بلدي - المنصورة</p>
                        <p className="text-[11px] text-red-600 mt-1">↑ +15% - نقص المعروض</p>
                      </div>
                      <div className="bg-white rounded-2xl p-4 border">
                        <p className="text-[11px] text-slate-500 font-bold">أفضل فرصة شراء</p>
                        <p className="text-[14px] font-extrabold mt-1">🥭 مانجو عويس</p>
                        <p className="text-[11px] text-emerald-600 mt-1">↓ -5% موسم الذروة</p>
                      </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-2 mt-6">
                      <select value={activeCat} onChange={e=>setActiveCat(e.target.value)} className="h-10 px-4 bg-white border border-slate-200 rounded-full text-xs font-bold">
                        {CATS.map(c=><option key={c} value={c}>{c}</option>)}
                      </select>
                      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث محصول أو مدينة..." className="h-10 px-4 bg-slate-50 border border-slate-200 rounded-full text-xs w-[200px] outline-none focus:bg-white"/>
                      <span className="h-10 px-4 bg-slate-900 text-white rounded-full text-xs font-bold flex items-center">إجمالي {filteredCrops.length} صنف</span>
                    </div>
                  </div>

                  {/* Professional Table */}
                  <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100 text-[11px] text-slate-500 font-bold">
                          <tr>
                            <th className="text-right p-4">المحصول</th>
                            <th className="text-right p-4">المدينة</th>
                            <th className="text-right p-4">الفئة</th>
                            <th className="text-left p-4">السعر الحالي</th>
                            <th className="text-center p-4">التغير</th>
                            <th className="text-center p-4">الكمية</th>
                            <th className="text-center p-4">الحالة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCrops.map((c,i)=>{
                            const changes = [12, -5, 3, 0, 8, -2, 15, -7];
                            const change = changes[i % changes.length];
                            const trend = change>0 ? "up" : change<0 ? "down" : "stable";
                            const isHighDemand = c.category==="فريش";
                            return (
                              <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/70 transition">
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <img src={c.img} className="w-10 h-10 rounded-xl object-cover"/>
                                    <div>
                                      <p className="font-bold text-[13px]">{c.name}</p>
                                      <p className="text-[11px] text-slate-500">{c.farmer}</p>
                                    </div>
                                    {c.verified && <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[10px]">✓</span>}
                                  </div>
                                </td>
                                <td className="p-4 text-[12px]">📍 {c.city}</td>
                                <td className="p-4"><span className="px-2.5 py-1 bg-white border rounded-full text-[11px] font-bold">{c.category}</span></td>
                                <td className="p-4 text-left"><span className="font-extrabold text-emerald-700">{c.price}</span></td>
                                <td className="p-4 text-center">
                                  {trend==="up" ? <span className="px-2 py-1 bg-red-50 text-red-600 rounded-full text-[11px] font-bold">↗️ +{change}%</span>
                                   : trend==="down" ? <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-bold">↘️ {change}%</span>
                                   : <span className="px-2 py-1 bg-slate-100 rounded-full text-[11px]">— 0%</span>}
                                </td>
                                <td className="p-4 text-center"><span className="px-2.5 py-1 bg-slate-50 rounded-full text-[11px]">{c.qty}</span></td>
                                <td className="p-4 text-center">
                                  {isHighDemand ? <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-[11px] font-bold">طلب عالي</span>
                                   : <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[11px] font-bold">متوفر</span>}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                    {filteredCrops.length===0 && (
                      <div className="p-12 text-center text-sm text-slate-500">لا يوجد نتائج للفلتر الحالي</div>
                    )}
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-[11px]">
                      <span className="text-slate-500">💡 الأسعار استرشادية من سوق الجملة - يتم التحديث كل 3 ساعات - التفاوض مباشر مع المزارع</span>
                      <div className="flex gap-2">
                        <button onClick={()=>{navigator.clipboard.writeText(window.location.href); showToast("تم نسخ رابط الأسعار")}} className="h-8 px-4 bg-white border rounded-full font-bold">مشاركة الأسعار ↗️</button>
                        <button onClick={()=>setActiveTab("market")} className="h-8 px-4 bg-slate-900 text-white rounded-full font-bold">اذهب للسوق 🏪</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab==="add" && (
                <div className="max-w-[720px] mx-auto bg-white rounded-2xl border border-slate-100 p-6">
                  <h2 className="font-bold text-lg mb-6">إضافة منشور جديد - {currentUser?.name}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <input value={newPost.name} onChange={e=>setNewPost({...newPost,name:e.target.value})} placeholder="اسم المحصول" className="h-12 px-4 border rounded-xl"/>
                    <select value={newPost.category} onChange={e=>setNewPost({...newPost,category:e.target.value})} className="h-12 px-4 border rounded-xl">{CATS.slice(1).map(c=><option key={c}>{c}</option>)}</select>
                    <input value={newPost.city} onChange={e=>setNewPost({...newPost,city:e.target.value})} placeholder="المدينة" className="h-12 px-4 border rounded-xl"/>
                    <input value={newPost.qty} onChange={e=>setNewPost({...newPost,qty:e.target.value})} placeholder="الكمية" className="h-12 px-4 border rounded-xl"/>
                    <input value={newPost.price} onChange={e=>setNewPost({...newPost,price:e.target.value})} placeholder="السعر" className="h-12 px-4 border rounded-xl col-span-2"/>
                    <textarea value={newPost.desc} onChange={e=>setNewPost({...newPost,desc:e.target.value})} placeholder="وصف المحصول" className="col-span-2 min-h-[84px] p-4 border rounded-xl"/>
                  </div>
                  <div className="mt-4 border-2 border-dashed rounded-xl h-32 flex items-center justify-center text-slate-400">+ رفع صورة</div>
                  <button onClick={async ()=>{
                    const payload = {name:newPost.name||"محصول جديد", farmer:currentUser?.name||"مزارع جديد", farmer_id:currentUser?.id||Date.now(), city:newPost.city||currentUser?.city||"المنصورة", price:newPost.price||"10 ج", qty:newPost.qty||"1 طن", category:newPost.category, img:"https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600", avatar:currentUser?.avatar||"https://i.pravatar.cc/100?img=12", verified:true, likes:0, comments:0, description:newPost.desc}
                    try{
                      const {data} = await supabase.from("crops").insert(payload).select().single()
                      if(data) setCrops([{...data, liked:false, showComments:false, commentsList:[]}, ...crops] as any)
                      else setCrops([{id:Date.now(), ...payload, liked:false, showComments:false, commentsList:[]}, ...crops] as any)
                    }catch{ setCrops([{id:Date.now(), ...payload, liked:false, showComments:false, commentsList:[]}, ...crops] as any) }
                    setActiveTab("market"); showToast("تم نشر المحصول 🟢"); setNewPost({name:"",city:"",price:"",qty:"",category:"فريش",desc:""})
                  }} className="w-full mt-6 h-12 bg-emerald-600 text-white rounded-xl font-bold">نشر في Supabase</button>
                </div>
              )}
            </>
          )}
        </div>
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
          <button type="button" onClick={()=>onLike(crop.id)} className={`${crop.liked?"text-red-500":""} font-bold`}>❤️ {crop.likes}</button>
          <button type="button" onClick={()=>onComments(crop.id)}>💬 {crop.comments}</button>
          <button type="button" onClick={()=>onShare(crop.id)}>↗️ مشاركة</button>
        </div>
        {crop.showComments && (
          <div className="mt-3 border-t pt-3 space-y-2">
            {crop.commentsList.map((cc:any,i:number)=><div key={i} className="text-[13px]"><b>{cc.name}:</b> {cc.text}</div>)}
            <div className="flex gap-2"><input value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="اكتب تعليق..." className="flex-1 h-9 px-3 bg-slate-50 rounded-full text-[13px]"/><button type="button" onClick={()=>onAddComment(crop.id)} className="h-9 px-4 bg-slate-900 text-white rounded-full text-xs font-bold">إرسال</button></div>
          </div>
        )}
      </div>
    </div>
  )
}
