"use client"
import { useState, useEffect } from "react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

const CROPS_MOCK = [
  {id:1, name:"طماطم بلدي", farmer:"أحمد المزارع", farmer_id:1, city:"المنصورة", price:"12 جنيه/ك", qty:"5 طن", category:"خضروات", img:"https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600", avatar:"https://i.pravatar.cc/100?img=12", verified:true, likes:24, comments:5, liked:false, showComments:false, commentsList:[{id:1,name:"محمد",text:"الجودة ممتازة",time:"ساعتين"}]},
  {id:2, name:"مانجو عويس", farmer:"محمد الفكهاني", farmer_id:2, city:"الإسماعيلية", price:"35 جنيه/ك", qty:"2 طن", category:"فواكه", img:"https://images.unsplash.com/photo-1553279768-865429fa0078?w=600", avatar:"https://i.pravatar.cc/100?img=15", verified:true, likes:42, comments:8, liked:false, showComments:false, commentsList:[]},
  {id:3, name:"قمح جيزة", farmer:"حسن الحبوب", farmer_id:3, city:"الشرقية", price:"18 جنيه/ك", qty:"10 طن", category:"حبوب", img:"https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600", avatar:"https://i.pravatar.cc/100?img=20", verified:false, likes:18, comments:2, liked:false, showComments:false, commentsList:[]},
  {id:4, name:"برسيم حجازي", farmer:"سعيد الأعلاف", farmer_id:4, city:"الفيوم", price:"4 جنيه/ك", qty:"20 طن", category:"أعلاف", img:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600", avatar:"https://i.pravatar.cc/100?img=33", verified:true, likes:31, comments:4, liked:false, showComments:false, commentsList:[]},
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
  const [newPost, setNewPost] = useState({name:"", city:"", price:"", qty:"", category:"خضروات", desc:""})
  const [messages, setMessages] = useState([
    {id:1, with:COLLEAGUES_MOCK[0], last:"الطماطم وصلت؟", unread:2, chat:[{from:"them",text:"الطماطم وصلت؟"},{from:"me",text:"ايوه في الطريق"}]},
    {id:2, with:COLLEAGUES_MOCK[1], last:"الشتلات جاهزة", unread:0, chat:[{from:"them",text:"الشتلات جاهزة"}]},
  ])
  const [activeChat, setActiveChat] = useState(0)
  const [chatInput, setChatInput] = useState("")
  const [newDiscussionText, setNewDiscussionText] = useState("")
  const [notifications, setNotifications] = useState<any[]>([
    {id:1, type:"like", title:"إعجاب جديد", body:"أحمد المزارع أعجب بمحصولك طماطم بلدي", read:false, time:"منذ 5 دقائق", icon:"❤️"},
    {id:2, type:"comment", title:"تعليق جديد", body:"فاطمة علقت: الجودة ممتازة 👏", read:false, time:"منذ 20 دقيقة", icon:"💬"},
  ])
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifPermission, setNotifPermission] = useState<string>("default")
  const [supabaseConnected, setSupabaseConnected] = useState(false)

  const CATS = ["الكل","خضروات","فواكه","حبوب","أعلاف","بقوليات","نباتات طبية","شتلات","أسمدة"]

  const showToast = (msg:string)=>{ setToast(msg); setTimeout(()=>setToast(""),3000) }

  const requestNotifPermission = async ()=>{
    if(typeof window==="undefined" || !("Notification" in window)) return
    const perm = await Notification.requestPermission()
    setNotifPermission(perm)
    if(perm==="granted"){
      showToast("تم تفعيل الإشعارات 🔔")
      try{ new Notification("ContCrops", {body:"الإشعارات مفعلة الآن ✅"}) }catch{}
    }
  }
  const pushNotification = (n:any)=>{
    const newNotif={id:Date.now(), read:false, time:"الآن", ...n}
    setNotifications(prev=>[newNotif, ...prev])
    showToast(n.body||n.title)
    if(notifPermission==="granted" && typeof window!=="undefined" && "Notification" in window){
      try{ new Notification(n.title, {body:n.body}) }catch{}
    }
    // حفظ في Supabase
    try{
      if(isSupabaseConfigured()){
        supabase.from("notifications").insert({user_id:1, type:n.type, title:n.title, body:n.body, icon:n.icon, read:false}).then(()=>{})
      }
    }catch{}
  }

  // تحميل البيانات من Supabase عند البداية
  useEffect(()=>{
    async function load(){
      try{
        if(!isSupabaseConfigured()){
          console.log("Supabase not configured - using MOCK")
          return
        }
        const { data: cropsData } = await supabase.from("crops").select("*").order("created_at", {ascending:false})
        if(cropsData && cropsData.length>0){
          setCrops(cropsData.map((c:any)=>({...c, liked:false, showComments:false, commentsList:[]})) as any)
          setSupabaseConnected(true)
        }
        const { data: discData } = await supabase.from("discussions").select("*").order("created_at", {ascending:false})
        if(discData && discData.length>0){
          setDiscussions(discData.map((d:any)=>({
            id:d.id,
            farmer: COLLEAGUES_MOCK.find(f=>f.id===d.farmer_id) || COLLEAGUES_MOCK[0],
            text:d.text,
            time:"منذ قليل",
            likes:d.likes||0,
            reposts:d.reposts||0,
            comments:d.comments||0,
            liked:false,
            showComments:false,
            commentsList:[]
          })) as any)
        }
      }catch(e){
        console.log("Supabase load error", e)
      }
    }
    load()
    if(typeof window!=="undefined" && "Notification" in window){
      setNotifPermission(Notification.permission)
    }
  },[])

  const toggleLike = (id:number)=>{
    const crop=crops.find(c=>c.id===id)
    const wasLiked=crop?.liked
    setCrops(prev=> prev.map(c=> c.id===id ? {...c, liked:!c.liked, likes: c.liked? c.likes-1 : c.likes+1} as any : c))
    if(!wasLiked && crop){ pushNotification({type:"like", title:"إعجاب", body:`أعجبت بمحصول ${crop.name} ❤️`, icon:"❤️"}) }
    // تحديث في Supabase
    if(isSupabaseConfigured() && crop){
      supabase.from("crops").update({likes: wasLiked ? crop.likes-1 : crop.likes+1}).eq("id", id).then(()=>{})
    }
  }
  const toggleComments = (id:number)=>{
    setCrops(prev=> prev.map(c=> c.id===id ? {...c, showComments:!c.showComments} as any : c))
  }
  const handleShare = (id:number)=>{
    navigator.clipboard.writeText(`${window.location.origin}/crop/${id}`)
    showToast("تم نسخ رابط المنشور")
  }
  const addComment = async (cropId:number)=>{
    if(!newComment.trim()) return
    const crop=crops.find(c=>c.id===cropId)
    const commentObj={id:Date.now(),name:"أنت",text:newComment,time:"الآن"}
    setCrops(prev=> prev.map(c=> c.id===cropId ? {...c, commentsList:[...c.commentsList, commentObj], comments:c.comments+1} as any : c))
    pushNotification({type:"comment", title:"تعليق", body:`علقت على ${crop?.name||"المحصول"}: ${newComment.slice(0,30)}`, icon:"💬"})
    // حفظ في Supabase
    if(isSupabaseConfigured()){
      await supabase.from("crop_comments").insert({crop_id:cropId, user_name:"أنت", text:newComment})
      await supabase.from("crops").update({comments: (crop?.comments||0)+1}).eq("id", cropId)
    }
    setNewComment("")
  }
  const toggleFollow = (id:number)=>{
    const isFollowing=following.includes(id)
    const col=colleagues.find(c=>c.id===id)
    setFollowing(f=> f.includes(id) ? f.filter(x=>x!==id) : [...f,id])
    if(!isFollowing && col){ pushNotification({type:"follow", title:"متابعة", body:`تابعت ${col.name} 👥`, icon:"👥"}) } else { showToast(isFollowing ? "تم إلغاء المتابعة" : "تمت المتابعة ✓") }
  }

  const handleAddCrop = async ()=>{
    if(!newPost.name.trim()){
      showToast("اكتب اسم المحصول")
      return
    }
    const payload = {
      name:newPost.name||"محصول جديد",
      farmer:"أحمد المزارع",
      farmer_id:1,
      city:newPost.city||"المنصورة",
      price:newPost.price||"10 جنيه/ك",
      qty:newPost.qty||"1 طن",
      category:newPost.category||"خضروات",
      img:"https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600",
      avatar:"https://i.pravatar.cc/100?img=12",
      verified:true,
      likes:0,
      comments:0,
      description:newPost.desc
    }
    // حفظ في Supabase أولاً
    try{
      if(isSupabaseConfigured()){
        const { data, error } = await supabase.from("crops").insert(payload).select().single()
        if(error) throw error
        if(data){
          setCrops(prev=>[ {...data, liked:false, showComments:false, commentsList:[]} as any, ...prev])
          showToast("تم نشر المحصول وحفظه في Supabase ✅")
        }
      } else {
        // fallback local
        setCrops(prev=>[ {id:Date.now(), ...payload, liked:false, showComments:false, commentsList:[]} as any, ...prev])
        showToast("تم نشر المحصول (محلي - Supabase غير متصل) ⚠️")
      }
    }catch(e:any){
      console.error(e)
      setCrops(prev=>[ {id:Date.now(), ...payload, liked:false, showComments:false, commentsList:[]} as any, ...prev])
      showToast("تم النشر محلياً - خطأ في الحفظ: "+(e.message||""))
    }
    setActiveTab("market")
    setNewPost({name:"",city:"",price:"",qty:"",category:"خضروات",desc:""})
    pushNotification({type:"like", title:"محصول جديد", body:`نشرت ${payload.name} في السوق 🌱`, icon:"🌱"})
  }

  const handleAddDiscussion = async ()=>{
    if(!newDiscussionText.trim()) return
    const temp={id:Date.now(), farmer:COLLEAGUES_MOCK[0], text:newDiscussionText, time:"الآن", likes:0, reposts:0, comments:0, liked:false, showComments:false, commentsList:[]}
    setDiscussions(prev=>[temp as any, ...prev])
    const textToSave=newDiscussionText
    setNewDiscussionText("")
    pushNotification({type:"discussion", title:"نقاش جديد", body:`نشرت: ${textToSave.slice(0,40)}...`, icon:"🧵"})
    try{
      if(isSupabaseConfigured()){
        const { data } = await supabase.from("discussions").insert({farmer_id:1, text:textToSave, likes:0, reposts:0, comments:0}).select().single()
        if(data){
          setDiscussions(prev=> prev.map(d=> d.id===temp.id ? {...temp, id:data.id} as any : d))
          showToast("تم نشر المناقشة وحفظها ✅")
        }
      }
    }catch(e){
      showToast("تم النشر محلياً")
    }
  }

  const filteredCrops = crops.filter(c=> (activeCat==="الكل"||c.category===activeCat) && (c.name.includes(search)||c.city.includes(search)||c.farmer.includes(search)) )
  const filteredColleagues = colleagues.filter(c=> c.name.includes(colleagueSearch)||c.city.includes(colleagueSearch))
  const myPosts = crops.filter(c=> c.farmer_id===1)
  const profilePosts = selectedProfile ? crops.filter(c=> c.farmer_id===selectedProfile.id) : myPosts

  if(!isLoggedIn){
    return (
      <div dir="rtl" className="min-h-screen bg-gradient-to-br from-emerald-600 to-emerald-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-[32px] w-full max-w-[440px] p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl mb-3">🌿</div>
            <h1 className="text-2xl font-extrabold">ContCrops</h1>
            <p className="text-slate-500 text-sm mt-1">منصة المحاصيل والمجتمع الزراعي</p>
            {supabaseConnected && <span className="text-[10px] text-emerald-600 font-bold">● متصل بـ Supabase</span>}
          </div>
          <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-full">
            <button onClick={()=>setLoginMode("login")} className={`flex-1 h-10 rounded-full text-sm font-bold ${loginMode==="login"?"bg-slate-900 text-white":"text-slate-600"}`}>دخول</button>
            <button onClick={()=>setLoginMode("register")} className={`flex-1 h-10 rounded-full text-sm font-bold ${loginMode==="register"?"bg-slate-900 text-white":"text-slate-600"}`}>حساب جديد</button>
          </div>
          <div className="space-y-3">
            <input placeholder="رقم الهاتف" className="w-full h-12 px-4 border border-slate-200 rounded-xl text-sm outline-none"/>
            <input placeholder="كلمة المرور" type="password" className="w-full h-12 px-4 border border-slate-200 rounded-xl text-sm outline-none"/>
            {loginMode==="register" && <input placeholder="اسم المزرعة" className="w-full h-12 px-4 border border-slate-200 rounded-xl text-sm outline-none"/>}
            <button onClick={()=>setIsLoggedIn(true)} className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold">دخول</button>
            <button onClick={()=>setIsLoggedIn(true)} className="w-full h-12 bg-emerald-600 text-white rounded-xl font-bold">دخول تجريبي ⚡</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f8fafc] flex">
      <aside className="hidden lg:flex w-[280px] bg-white border-l border-slate-100 flex-col sticky top-0 h-screen">
        <div className="p-5 flex items-center gap-2 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-black text-emerald-500 flex items-center justify-center font-extrabold text-lg">C</div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-[16px]">ContCrops</span>
            <span className="text-[9px] text-slate-500 font-bold mt-0.5">تواصل - تبادل - نمو مستدام</span>
          </div>
          {supabaseConnected && <span className="mr-auto w-2 h-2 bg-emerald-500 rounded-full animate-pulse" title="Supabase متصل"></span>}
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {[
            {id:"market", label:"السوق", icon:"🏪"},
            {id:"community", label:"المجتمع", icon:"👥"},
            {id:"messages", label:"الرسائل", icon:"💬", badge:messages.reduce((a,m)=>a+m.unread,0)},
            {id:"discussions", label:"المناقشات", icon:"🧵"},
            {id:"profile", label:"الملف الشخصي", icon:"👤"},
          ].map(tab=>(
            <button key={tab.id} onClick={()=>{setActiveTab(tab.id); setSelectedProfile(null)}} className={`w-full h-12 flex items-center gap-3 px-4 rounded-xl text-sm font-bold ${activeTab===tab.id && !selectedProfile ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
              <span className="text-lg">{tab.icon}</span>{tab.label}
              {(tab as any).badge>0 && <span className="mr-auto bg-red-500 text-white text-[11px] px-2 py-0.5 rounded-full">{(tab as any).badge}</span>}
            </button>
          ))}
          <button onClick={()=>setActiveTab("add")} className="w-full h-12 flex items-center gap-3 px-4 rounded-xl text-sm font-bold mt-4 bg-emerald-600 text-white">
            <span className="text-lg">➕</span>إضافة منشور
          </button>
        </nav>
        <div className="p-4 border-t border-slate-100 flex items-center gap-3">
          <img src="https://i.pravatar.cc/100?img=12" className="w-9 h-9 rounded-full"/>
          <div>
            <p className="text-sm font-bold">أحمد المزارع</p>
            <p className="text-xs text-slate-500">المنصورة {supabaseConnected ? "● متصل" : "○ غير متصل"}</p>
          </div>
          <button onClick={()=>setIsLoggedIn(false)} className="mr-auto text-xs text-slate-500">خروج</button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-100">
          <div className="max-w-[1200px] mx-auto px-4 h-[64px] flex items-center gap-4">
            <div className="flex-1 max-w-[520px] relative">
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث عن محصول، مدينة، زميل..." className="w-full h-11 pr-11 pl-4 bg-slate-50 border border-slate-200 rounded-full text-sm focus:bg-white focus:border-emerald-400 outline-none"/>
              <span className="absolute right-4 top-3 text-slate-400">🔍</span>
            </div>
            <div className="mr-auto flex items-center gap-2">
              <div className="relative">
                <button id="notif-bell" onClick={()=>setShowNotifications(!showNotifications)} className="relative w-11 h-11 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-lg">
                  🔔
                  {notifications.filter((n:any)=>!n.read).length>0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{notifications.filter((n:any)=>!n.read).length}</span>}
                </button>
                {showNotifications && (
                  <div id="notif-dropdown" className="absolute left-0 top-14 w-[360px] bg-white rounded-[20px] border border-slate-100 shadow-2xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-bold text-sm">الإشعارات</h3>
                      <div className="flex gap-2">
                        <button onClick={()=>setNotifications((prev:any)=>prev.map((n:any)=>({...n, read:true})))} className="text-[11px] text-emerald-600 font-bold">تأكيد الكل</button>
                        <button onClick={()=>setShowNotifications(false)} className="w-6 h-6 bg-slate-50 rounded-full text-xs">✕</button>
                      </div>
                    </div>
                    <div className="max-h-[380px] overflow-y-auto">
                      {notifications.map((notif:any)=>(
                        <div key={notif.id} onClick={()=>setNotifications((prev:any)=>prev.map((n:any)=>n.id===notif.id?{...n, read:true}:n))} className={`p-4 flex gap-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 ${!notif.read ? "bg-emerald-50/50" : ""}`}>
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-lg">{notif.icon||"🔔"}</div>
                          <div className="flex-1"><p className="text-[13px] font-bold">{notif.title}</p><p className="text-[12px] text-slate-600">{notif.body}</p><p className="text-[10px] text-slate-400">{notif.time}</p></div>
                          {!notif.read && <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></span>}
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-slate-50">
                      {notifPermission!=="granted" ? <button onClick={requestNotifPermission} className="w-full h-9 bg-slate-900 text-white rounded-full text-xs font-bold">تفعيل إشعارات المتصفح 🔔</button> : <button onClick={()=>{setNotifications([]); setShowNotifications(false)}} className="w-full h-9 bg-white border rounded-full text-xs font-bold">مسح الكل</button>}
                    </div>
                  </div>
                )}
              </div>
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
                    <h2 className="text-xl font-extrabold">{selectedProfile.name}</h2>
                    <p className="text-sm text-slate-500">{selectedProfile.city}</p>
                  </div>
                </div>
                <button onClick={()=>setSelectedProfile(null)} className="mt-6 h-10 px-5 bg-slate-50 border rounded-full text-sm">← رجوع</button>
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
                        <div><p className="font-bold text-sm">{col.name}</p><p className="text-xs text-slate-500">{col.city}</p></div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button onClick={()=>toggleFollow(col.id)} className={`flex-1 h-9 rounded-full text-xs font-bold ${following.includes(col.id)?"bg-slate-100":"bg-slate-900 text-white"}`}>{following.includes(col.id)?"تتابع":"متابعة"}</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab==="messages" && (
                <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden flex h-[600px] max-w-[1000px] mx-auto">
                  <div className="w-[300px] border-l border-slate-100 flex flex-col">
                    <div className="p-4 border-b border-slate-100 font-bold flex items-center justify-between">
                      <span>الرسائل</span>
                      <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">{messages.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      {messages.map((m:any,i:number)=>(
                        <button key={m.id} onClick={()=>setActiveChat(i)} className={`w-full p-4 flex gap-3 text-right hover:bg-slate-50 border-b border-slate-50 ${activeChat===i?"bg-slate-50":""}`}>
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
                          <div>
                            <p className="font-bold text-sm">{messages[activeChat].with.name}</p>
                            <p className="text-[11px] text-emerald-600">● متصل الآن</p>
                          </div>
                          <button className="mr-auto w-8 h-8 bg-slate-50 rounded-full">📞</button>
                        </div>
                        <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-[#f8fafc]">
                          {messages[activeChat].chat.map((msg:any, idx:number)=>(
                            <div key={idx} className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${msg.from==="me"?"bg-slate-900 text-white mr-auto rounded-br-sm":"bg-white border ml-auto rounded-bl-sm shadow-sm"}`}>{msg.text}</div>
                          ))}
                        </div>
                        <div className="p-3 border-t border-slate-100 flex gap-2 bg-white">
                          <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter" && chatInput.trim()){ const nm=[...messages]; nm[activeChat].chat.push({from:"me",text:chatInput}); nm[activeChat].last=chatInput; setMessages(nm); setChatInput(""); pushNotification({type:"message", title:"رسالة", body:`أرسلت: ${chatInput.slice(0,30)}`, icon:"💬"}); if(isSupabaseConfigured()){ supabase.from("messages").insert({sender_id:1, receiver_id:messages[activeChat].with.id, text:chatInput}).then(()=>{}) } }}} placeholder="اكتب رسالة..." className="flex-1 h-11 px-4 bg-slate-50 border border-slate-100 rounded-full text-sm outline-none focus:bg-white focus:border-emerald-200"/>
                          <button onClick={()=>{ if(!chatInput.trim()) return; const nm=[...messages]; nm[activeChat].chat.push({from:"me",text:chatInput}); nm[activeChat].last=chatInput; setMessages(nm); pushNotification({type:"message", title:"رسالة", body:`أرسلت: ${chatInput.slice(0,30)}`, icon:"💬"}); if(isSupabaseConfigured()){ supabase.from("messages").insert({sender_id:1, receiver_id:messages[activeChat].with.id, text:chatInput}).then(()=>{}) } setChatInput("") }} className="h-11 px-5 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-black">إرسال</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
              {activeTab==="discussions" && (
                <div className="max-w-[640px] mx-auto space-y-4">
                  <div className="bg-white rounded-[24px] border border-slate-100 p-5">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">🧵</div>
                      <div className="flex-1">
                        <textarea value={newDiscussionText} onChange={e=>setNewDiscussionText(e.target.value)} placeholder="شارك تجربتك، اسأل سؤال، أو ناقش موضوع زراعي..." className="w-full min-h-[80px] p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:bg-white focus:border-emerald-200 resize-none"/>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-[11px] text-slate-400">{newDiscussionText.length}/500</span>
                          <button onClick={handleAddDiscussion} disabled={!newDiscussionText.trim()} className="h-9 px-5 bg-slate-900 text-white rounded-full text-sm font-bold disabled:bg-slate-200 disabled:text-slate-400">نشر المناقشة 🧵</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {discussions.map(d=>(
                    <div key={d.id} className="bg-white rounded-[24px] border border-slate-100 p-5">
                      <div className="flex gap-3">
                        <img src={d.farmer.avatar} className="w-10 h-10 rounded-full"/>
                        <div><p className="text-sm font-bold">{d.farmer.name}</p><p className="text-xs text-slate-500">{d.time}</p></div>
                      </div>
                      <p className="mt-3 text-[14px] leading-6">{d.text}</p>
                      <div className="flex gap-4 mt-4 text-sm text-slate-500">
                        <button onClick={()=>{ setDiscussions(prev=> prev.map(x=> x.id===d.id ? {...x, liked:!x.liked, likes: x.liked ? x.likes-1 : x.likes+1} as any : x)) }} className="hover:text-slate-900">❤️ {d.likes}</button>
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
                        <img src="https://i.pravatar.cc/100?img=12" className="w-20 h-20 rounded-full border-4 border-white -mt-12"/>
                        <div><h2 className="text-xl font-extrabold">أحمد المزارع</h2><p className="text-sm text-slate-500">المنصورة {supabaseConnected ? "● Supabase متصل ✅" : "○ غير متصل - MOCK"}</p></div>
                      </div>
                      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                        <div className="bg-slate-50 rounded-2xl p-4"><p className="text-2xl font-extrabold">{myPosts.length}</p><p className="text-xs text-slate-500">محصول</p></div>
                        <div className="bg-slate-50 rounded-2xl p-4"><p className="text-2xl font-extrabold">120</p><p className="text-xs text-slate-500">متابع</p></div>
                        <div className="bg-slate-50 rounded-2xl p-4"><p className="text-2xl font-extrabold">80</p><p className="text-xs text-slate-500">يتابع</p></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab==="add" && (
                <div className="max-w-[720px] mx-auto bg-white rounded-2xl border border-slate-100 p-6">
                  <h2 className="font-bold text-lg mb-2">إضافة منشور جديد</h2>
                  <p className="text-xs text-slate-500 mb-6">{supabaseConnected ? "سيتم حفظه في Supabase ويظهر لكل المستخدمين ✅" : "Supabase غير متصل - سيتم الحفظ محلياً فقط ⚠️"}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <input value={newPost.name} onChange={e=>setNewPost({...newPost,name:e.target.value})} placeholder="اسم المحصول *" className="h-12 px-4 border rounded-xl"/>
                    <select value={newPost.category} onChange={e=>setNewPost({...newPost,category:e.target.value})} className="h-12 px-4 border rounded-xl">{CATS.slice(1).map(c=><option key={c}>{c}</option>)}</select>
                    <input value={newPost.city} onChange={e=>setNewPost({...newPost,city:e.target.value})} placeholder="المدينة" className="h-12 px-4 border rounded-xl"/>
                    <input value={newPost.qty} onChange={e=>setNewPost({...newPost,qty:e.target.value})} placeholder="الكمية" className="h-12 px-4 border rounded-xl"/>
                    <input value={newPost.price} onChange={e=>setNewPost({...newPost,price:e.target.value})} placeholder="السعر" className="h-12 px-4 border rounded-xl col-span-2"/>
                    <textarea value={newPost.desc} onChange={e=>setNewPost({...newPost,desc:e.target.value})} placeholder="وصف المحصول" className="col-span-2 min-h-[84px] p-4 border rounded-xl"/>
                  </div>
                  <button onClick={handleAddCrop} className="w-full mt-6 h-12 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition">نشر وحفظ في Supabase 🌱</button>
                </div>
              )}
            </>
          )}
        </div>
        {toast && <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-full text-sm font-bold z-[90] shadow-lg">{toast}</div>}
      </main>
    </div>
  )
}

function CropCard({crop, onProfileClick, onLike, onComments, onShare, newComment, setNewComment, onAddComment, colleagues}:any){
  const farmer = colleagues?.find((c:any)=>c.id===crop.farmer_id) || {name:crop.farmer, avatar:crop.avatar, id:crop.farmer_id}
  return (
    <div className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition">
      <div className="relative h-48 cursor-pointer"><img src={crop.img} alt={crop.name} className="w-full h-full object-cover"/><div className="absolute top-3 right-3 flex gap-2"><span className="px-2.5 py-1 bg-white/90 rounded-full text-[11px] font-bold">{crop.category}</span>{crop.verified && <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[12px]">✓</span>}</div></div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2 cursor-pointer" onClick={()=>onProfileClick && onProfileClick(farmer)}><img src={crop.avatar} className="w-7 h-7 rounded-full"/><span className="text-[13px] font-bold hover:underline">{crop.farmer}</span><span className="text-[12px] text-slate-400">• {crop.city}</span></div>
        <h3 className="font-bold text-[16px] mb-1">{crop.name}</h3>
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
