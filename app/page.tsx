"use client"
import { useState, useEffect } from "react"
import { BarChart3, BookOpen, Bookmark, ClipboardList, CircleUserRound, Heart, ImagePlus, Leaf, LogOut, MapPin, MessageCircle, MessageSquare, MoreHorizontal, Package, Search, Settings, Share2, ShieldCheck, Sprout, Store, TrendingUp, UsersRound, X } from "lucide-react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { CropPriceTicker } from "@/components/CropPriceTicker"
import { StoriesRail } from "@/components/Stories"
import { NotificationBell } from "@/components/NotificationBell"
import { filterPeerNotifications, loadPeerNotifications, persistPeerNotification, type ActivityNotification } from "@/lib/notifications"
import { compressPostImage, persistPostImage } from "@/lib/post-images"

const CROPS_MOCK = [
  {id:1, name:"طماطم بلدي", farmer:"أحمد المزارع", farmer_id:1, city:"المنصورة", price:"12 جنيه/ك", qty:"5 طن", category:"خضروات", img:"", avatar:"https://i.pravatar.cc/100?img=12", verified:true, likes:24, comments:5, liked:false, showComments:false, commentsList:[{id:1,name:"محمد",text:"الجودة ممتازة",time:"ساعتين"}]},
  {id:2, name:"مانجو عويس", farmer:"محمد الفكهاني", farmer_id:2, city:"الإسماعيلية", price:"35 جنيه/ك", qty:"2 طن", category:"فواكه", img:"", avatar:"https://i.pravatar.cc/100?img=15", verified:true, likes:42, comments:8, liked:false, showComments:false, commentsList:[]},
  {id:3, name:"قمح جيزة", farmer:"حسن الحبوب", farmer_id:3, city:"الشرقية", price:"18 جنيه/ك", qty:"10 طن", category:"حبوب", img:"", avatar:"https://i.pravatar.cc/100?img=20", verified:false, likes:18, comments:2, liked:false, showComments:false, commentsList:[]},
  {id:4, name:"برسيم حجازي", farmer:"سعيد الأعلاف", farmer_id:4, city:"الفيوم", price:"4 جنيه/ك", qty:"20 طن", category:"أعلاف", img:"", avatar:"https://i.pravatar.cc/100?img=33", verified:true, likes:31, comments:4, liked:false, showComments:false, commentsList:[]},
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

const ARTICLES_MOCK = [
  {id:1,title:"من الحقل إلى السوق: كيف تحافظ على جودة الطماطم بعد الحصاد؟",excerpt:"خطوات الفرز والتبريد والتعبئة التي تحافظ على قيمة المحصول وتقلل الفاقد قبل وصوله إلى المشتري.",author:"م. عمرو السيد",avatar:"https://i.pravatar.cc/100?img=12",category:"دليل عملي",date:"منذ يومين",readTime:6,likes:128,liked:false,image:"https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=1000&auto=format&fit=crop&q=85",body:["تبدأ جودة المحصول قبل الحصاد، من اختيار موعد الجمع في الساعات الأبرد والتعامل الهادئ مع الثمار لتقليل الكدمات. كل خطوة صغيرة بعد الجمع تفرق في العمر التخزيني والسعر النهائي.","بعد الحصاد، فرز الثمار حسب الحجم ودرجة النضج يساعد على توحيد العبوات وتسهيل البيع. استبعد الثمار المصابة مبكرًا حتى لا تنتقل المشكلة إلى باقي المحصول.","حافظ على التهوية الجيدة وتجنب تعريض الطماطم للشمس المباشرة. وعند النقل، ثبّت العبوات واترك مسافة مناسبة لتقليل الضغط والحرارة.","الاتفاق الواضح مع المشتري على درجة النضج والعبوة وموعد التسليم يوفر وقتًا ويقلل الفاقد. سجّل ملاحظات كل شحنة لتطوير طريقة العمل في الموسم القادم."]},
  {id:2,title:"الري الذكي في الصيف: احتفظ بالمياه من غير ما تجهد النبات",excerpt:"علامات بسيطة تساعدك على ضبط مواعيد الري وفهم احتياج التربة خلال موجات الحر.",author:"م. فاطمة حسن",avatar:"https://i.pravatar.cc/100?img=26",category:"إرشاد زراعي",date:"منذ 3 أيام",readTime:4,likes:86,liked:false,image:"https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1000&auto=format&fit=crop&q=85",body:["الري المنتظم لا يعني زيادة كمية المياه. راقب رطوبة التربة على عمق الجذور، واختر توقيتًا مبكرًا في الصباح لتقليل الفقد بالتبخر.","التغطية العضوية حول النباتات تساعد على بقاء الرطوبة وتخفف أثر الحرارة على الجذور. افحص النقاطات والخراطيم باستمرار لتتأكد أن المياه تصل بالتساوي.","احتياجات المحصول تختلف باختلاف نوع التربة ومرحلة النمو، لذلك سجّل مواعيد الري واستجابة النبات وعدّل خطتك تدريجيًا."]},
  {id:3,title:"أول شحنة تصدير؟ قائمة مراجعة من تجهيز المزرعة إلى باب الميناء",excerpt:"تعرف على أهم المستندات ومراحل تجهيز المحصول والتواصل مع المشتري قبل تحميل الشحنة.",author:"ContCrops التحرير",avatar:"https://i.pravatar.cc/100?img=45",category:"التصدير",date:"منذ أسبوع",readTime:8,likes:204,liked:false,image:"https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1000&auto=format&fit=crop&q=85",body:["ابدأ بتأكيد مواصفات المنتج والكمية والجدول الزمني مع المشتري كتابةً. راجع متطلبات بلد الوصول والشهادات المطلوبة قبل بدء التجهيز.","خطط للفرز والتعبئة والتبريد بما يناسب طبيعة المحصول ومدة النقل. احتفظ بعينات وصور من مراحل التجهيز لتسهيل مراجعة الجودة.","قبل التحميل، راجع المستندات وأرقام العبوات وبيانات الشحنة مع شركة النقل. التواصل المبكر مع كل الأطراف يجعل أي تعديل ممكنًا قبل مغادرة الشحنة."]},
]

export default function ContCropsPlatform(){
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [authError, setAuthError] = useState("")
  const [authBusy, setAuthBusy] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [farmName, setFarmName] = useState("")
  const [loginMode, setLoginMode] = useState<"login"|"register">("login")
  const [activeTab, setActiveTab] = useState("insights")
  const [activeCat, setActiveCat] = useState("الكل")
  const [search, setSearch] = useState("")
  const [colleagueSearch, setColleagueSearch] = useState("")
  const [selectedProfile, setSelectedProfile] = useState<any>(null)
  const [crops, setCrops] = useState<any[]>(CROPS_MOCK)
  const [colleagues, setColleagues] = useState<any[]>(COLLEAGUES_MOCK)
  const [localProfiles, setLocalProfiles] = useState<any[]>([])
  const [discussions, setDiscussions] = useState<any[]>(DISCUSSIONS_MOCK)
  const [following, setFollowing] = useState<Array<string|number>>([1,2])
  const [followRelationships, setFollowRelationships] = useState<any[]>([])
  const [localFollowRelationships, setLocalFollowRelationships] = useState<any[]>([])
  const [localFollowsReady, setLocalFollowsReady] = useState(false)
  const [followListMode, setFollowListMode] = useState<"followers"|"following"|null>(null)
  const [toast, setToast] = useState("")
  const [newComment, setNewComment] = useState("")
  const [newPost, setNewPost] = useState({name:"", city:"", price:"", qty:"", category:"فريش", desc:"", image:""})
  const [messages, setMessages] = useState([
    {id:1, with:COLLEAGUES_MOCK[0], last:"الطماطم وصلت؟", unread:2, chat:[{from:"them",text:"الطماطم وصلت؟"},{from:"me",text:"ايوه في الطريق"}]},
    {id:2, with:COLLEAGUES_MOCK[1], last:"الشتلات جاهزة", unread:0, chat:[{from:"them",text:"الشتلات جاهزة"}]},
  ])
  const [activeChat, setActiveChat] = useState(0)
  const [chatInput, setChatInput] = useState("")
  const [newDiscussionText, setNewDiscussionText] = useState("")
  const [newDiscussionImage, setNewDiscussionImage] = useState("")
  const [articles, setArticles] = useState<any[]>(ARTICLES_MOCK)
  const [selectedArticle, setSelectedArticle] = useState<any>(null)
  const [savedArticles, setSavedArticles] = useState<Array<string|number>>([])
  const [articleTopic, setArticleTopic] = useState("الكل")
  const [articleFeed, setArticleFeed] = useState<"for-you"|"latest"|"saved">("for-you")
  const [newArticle, setNewArticle] = useState({title:"",category:"إرشاد زراعي",body:"",image:""})
  const [rfqs, setRfqs] = useState<any[]>([
    {id:1,title:"مطلوب 20 طن مانجو عويس للتصدير",buyer:"شركة الوادي للتصدير",location:"الإسماعيلية",quantity:"20 طن",deadline:"خلال 10 أيام",category:"فواكه"},
    {id:2,title:"توريد طماطم صالحة للتصنيع",buyer:"مصنع النيل للصناعات الغذائية",location:"السادات",quantity:"50 طن",deadline:"خلال أسبوعين",category:"خضروات"},
  ])
  const [newRFQ, setNewRFQ] = useState({title:"",quantity:"",location:""})
  const [showRFQForm, setShowRFQForm] = useState(false)
  const [rfqCategory, setRfqCategory] = useState("الكل")
  const [profileContentTab, setProfileContentTab] = useState<"all"|"articles"|"crops"|"rfqs"|"discussions">("all")
  const [articleCommentsOpen, setArticleCommentsOpen] = useState<number|null>(null)
  const [articleCommentDraft, setArticleCommentDraft] = useState("")
  const [discussionCommentsOpen, setDiscussionCommentsOpen] = useState<string|number|null>(null)
  const [discussionCommentDrafts, setDiscussionCommentDrafts] = useState<Record<string,string>>({})
  const [rfqCommentsOpen, setRfqCommentsOpen] = useState<number|null>(null)
  const [rfqCommentDrafts, setRfqCommentDrafts] = useState<Record<number,string>>({})
  const [sharedRFQId, setSharedRFQId] = useState<number|null>(null)
  const [settingsAlerts, setSettingsAlerts] = useState(true)
  const [profileDraft, setProfileDraft] = useState({name:"",city:"",bio:"",specialty:"",avatar:""})
  const [profileSaveBusy, setProfileSaveBusy] = useState(false)
  const [socialDataReady, setSocialDataReady] = useState(false)
  const [supabaseContentReady, setSupabaseContentReady] = useState(false)
  const [notifications, setNotifications] = useState<ActivityNotification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMobileMore, setShowMobileMore] = useState(false)
  const [mobileChatOpen, setMobileChatOpen] = useState(false)
  const [messageSearch, setMessageSearch] = useState("")
  const [messageFilter, setMessageFilter] = useState<"all"|"unread">("all")
  const [notifPermission, setNotifPermission] = useState<string>("default")
  const [supabaseConnected, setSupabaseConnected] = useState(false)
  const [sharedContentReady, setSharedContentReady] = useState(false)
  const [sharedLinkHandled, setSharedLinkHandled] = useState(false)
  const [accountDataReady, setAccountDataReady] = useState(false)
  const [accountStorageKey, setAccountStorageKey] = useState("")
  const [colleagueFilter, setColleagueFilter] = useState<"all"|"interested">("all")
  const [pricesCategory, setPricesCategory] = useState("الكل")

  const MARKET_CATEGORIES = ["الكل","فريش","مجمد","مجفف","مستلزمات إنتاج","مستلزمات زراعية","نقل ولوجيستيات"]
  const CATS = MARKET_CATEGORIES.slice(1)

  const showToast = (msg:string)=>{ setToast(msg); setTimeout(()=>setToast(""),3000) }

  useEffect(()=>{
    let active=true
    const applySession=(session:any)=>{
      if(!active) return
      if(session?.user){
        localStorage.removeItem("contcrops_demo_session")
        const user=session.user
        const metadata=user.user_metadata||{}
        setCurrentUser({
          id:user.id,
          name:metadata.full_name||metadata.name||user.email?.split("@")[0]||"مستخدم ContCrops",
          email:user.email||"",
          avatar:metadata.avatar_url||metadata.picture||"https://i.pravatar.cc/100?img=12",
          city:metadata.city||"مصر",
          role:"member",
          provider:user.app_metadata?.provider||"email",
        })
        setIsLoggedIn(true)
        setAuthReady(true)
        return
      }
      const demoId=localStorage.getItem("contcrops_demo_session")
      const savedDemo=demoId?localStorage.getItem(`contcrops_demo_user:${demoId}`):null
      if(savedDemo){
        try{
          setCurrentUser(JSON.parse(savedDemo))
          setIsLoggedIn(true)
        }catch(error){
          console.error("Could not restore the local demo profile",error)
          localStorage.removeItem("contcrops_demo_session")
        }
      }else{
        setCurrentUser(null)
        setIsLoggedIn(false)
      }
      setAuthReady(true)
    }
    supabase.auth.getSession().then(({data,error})=>{
      if(error) console.error("Could not restore Supabase session",error)
      applySession(data.session)
    }).catch(error=>{
      console.error("Could not initialize authentication",error)
      if(active) setAuthReady(true)
    })
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_event, session)=>{
  applySession(session)
})
      active=false
      subscription.unsubscribe()
    }
  ,[])
  
  useEffect(()=>{
  try{
    const stored=localStorage.getItem("contcrops_shared_content")
      if(stored){
        const content=JSON.parse(stored)
        if(Array.isArray(content.articles)) setArticles([...content.articles,...ARTICLES_MOCK])
        if(Array.isArray(content.crops)) setCrops([...content.crops,...CROPS_MOCK])
        if(Array.isArray(content.rfqs)) setRfqs([...content.rfqs,...rfqs])
        if(Array.isArray(content.discussions)) setDiscussions([...content.discussions,...DISCUSSIONS_MOCK])
      }
    }catch(error){
      console.error("Could not load saved ContCrops content",error)
    }
    setSharedContentReady(true)
  },[])

  useEffect(()=>{
    if(!currentUser?.id) return
    const key=String(currentUser.id)
    setAccountDataReady(false)
    setAccountStorageKey(key)
    try{
      const saved=localStorage.getItem(`contcrops_account:${key}`)
      if(saved){
        const data=JSON.parse(saved)
        setFollowing(Array.isArray(data.following)?data.following:[])
        setSavedArticles(Array.isArray(data.savedArticles)?data.savedArticles:[])
        setNotifications(filterPeerNotifications(Array.isArray(data.notifications)?data.notifications:[], currentUser.id))
        setMessages(Array.isArray(data.messages)?data.messages:[])
        setSettingsAlerts(data.settingsAlerts!==false)
      }else{
        setFollowing([]); setSavedArticles([]); setNotifications([]); setMessages([]); setSettingsAlerts(true)
      }
    }catch(error){
      console.error("Could not load this account's private data",error)
      setFollowing([]); setSavedArticles([]); setNotifications([]); setMessages([]); setSettingsAlerts(true)
    }
    setAccountDataReady(true)
  },[currentUser?.id])

  useEffect(()=>{
    if(!accountDataReady ||!currentUser?.id) return
    let active=true
    loadPeerNotifications(currentUser.id).then((remote)=>{
      if(!active ||!remote.length) return
      setNotifications(prev=>filterPeerNotifications([...remote,...prev], currentUser.id)
       .filter((item,index,list)=>list.findIndex(entry=>String(entry.id)===String(item.id))===index))
    })
    return ()=>{active=false}
  },[accountDataReady, currentUser?.id])

  useEffect(()=>{
    try{
      const stored=localStorage.getItem("contcrops_local_follows")
      const relationships=stored?JSON.parse(stored):[]
      setLocalFollowRelationships(Array.isArray(relationships)?relationships:[])
      const profiles=Object.keys(localStorage).filter(key=>key.startsWith("contcrops_demo_user:")).map(key=>{
        try{return JSON.parse(localStorage.getItem(key)||"null")}catch{return null}
      }).filter(Boolean)
      setLocalProfiles(profiles)
    }catch(error){
      console.error("Could not load local colleague relationships",error)
      setLocalFollowRelationships([]); setLocalProfiles([])
    }finally{ setLocalFollowsReady(true) }
  },[])

  useEffect(()=>{
    if(!localFollowsReady) return
    try{ localStorage.setItem("contcrops_local_follows",JSON.stringify(localFollowRelationships)) }catch(error){ console.error("Could not save local colleague relationships",error) }
  },[localFollowRelationships,localFollowsReady])

  useEffect(()=>{
    if(currentUser?.provider==="demo"&&localFollowsReady){
      setFollowing(localFollowRelationships.filter(item=>item.follower_id===currentUser.id).map(item=>item.following_id))
    }
  },[currentUser?.id,currentUser?.provider,localFollowRelationships,localFollowsReady])

  useEffect(()=>{
    if(!currentUser?.id) return
    setProfileDraft({
      name:currentUser.name||"",
      city:currentUser.city||"مصر",
      bio:currentUser.bio||"",
      specialty:currentUser.specialty||"",
      avatar:currentUser.avatar||"",
    })
  },[currentUser?.id,currentUser?.name,currentUser?.city,currentUser?.bio,currentUser?.specialty,currentUser?.avatar])

  // ✅✅ الجزء المتصلح بالكامل - كان بيقع في السطر 373 بسبب avatar_url
  useEffect(()=>{
    let active=true
    setSocialDataReady(false)
    setSupabaseContentReady(false)
    if(!currentUser?.id||currentUser.provider==="demo"||!isSupabaseConfigured()){
      setSocialDataReady(true)
      return ()=>{active=false}
    }
    const loadSocialData=async()=>{
      try{
        const authUser=await supabase.auth.getUser()
        if(authUser.error) throw authUser.error
        if(authUser.data.user?.id!==currentUser.id) return

        const ownProfile={
          id:currentUser.id,
          display_name:currentUser.name||currentUser.email?.split("@")[0]||"مستخدم",
          city:currentUser.city||"مصر",
          bio:currentUser.bio||"",
          specialty:currentUser.specialty||"عضو في مجتمع ContCrops",
          updated_at:new Date().toISOString(),
        }

        // حاول تجيب البروفايل - من غير ما يقع لو avatar_url ناقص
        const {data:existingOwnProfile, error:ownErr} = await supabase.from("profiles").select("*").eq("id",currentUser.id).maybeSingle()
        if(ownErr &&!ownErr.message.includes("avatar_url")) throw ownErr

        if(!existingOwnProfile){
          const {error:profileError}=await supabase.from("profiles").upsert(ownProfile as any,{onConflict:"id"})
          if(profileError &&!profileError.message.includes("avatar_url")) throw profileError
        }

        // حمّل profiles مع fallback لو avatar_url مش موجود في الكاش
        let profilesData:any[]|null = null
        const profilesRes = await supabase.from("profiles").select("id,display_name,city,bio,specialty,role,account_status,updated_at,avatar_url,cover_url").order("updated_at",{ascending:false}).limit(200)
        if(profilesRes.error && profilesRes.error.message.includes("avatar_url")){
          console.warn("avatar_url missing in schema cache - fallback without it")
          const fb = await supabase.from("profiles").select("id,display_name,city,bio,specialty,role,account_status,updated_at").order("updated_at",{ascending:false}).limit(200)
          profilesData = fb.data
        } else {
          if(profilesRes.error) throw profilesRes.error
          profilesData = profilesRes.data
        }

        const followsRes = await supabase.from("user_follows").select("*").limit(500)
        const contentRes = await supabase.from("platform_content").select("*").order("created_at",{ascending:false}).limit(200)

        if(!active) return

        const publicProfiles=(profilesData||[]).map((profile:any)=>({
          id:profile.id,
          name:profile.display_name||"مستخدم",
          city:profile.city||"مصر",
          bio:profile.bio||"",
          specialty:profile.specialty||"عضو في مجتمع ContCrops",
          avatar:profile.avatar_url||`https://i.pravatar.cc/100?u=${profile.id}`,
          cover:profile.cover_url||"",
          followers:0, following:0, online:false, isSupabaseProfile:true,
        }))

        const savedOwnProfile=(profilesData||[]).find((p:any)=>p.id===currentUser.id)
        if(savedOwnProfile){
          setCurrentUser((user:any)=>user?.id===currentUser.id?{
          ...user,
            name:savedOwnProfile.display_name||user.name,
            city:savedOwnProfile.city||user.city,
            bio:savedOwnProfile.bio||user.bio,
            specialty:savedOwnProfile.specialty||user.specialty,
            avatar:savedOwnProfile.avatar_url||user.avatar,
            cover:savedOwnProfile.cover_url||user.cover,
          }:user)
        }

        setColleagues(prev=>{
          const ids=new Set(publicProfiles.map((p:any)=>p.id))
          return [...publicProfiles,...prev.filter((p:any)=>!ids.has(p.id))]
        })

        const relationships=followsRes.data||[]
        setFollowRelationships(relationships)
        setFollowing(relationships.filter((i:any)=>i.follower_id===currentUser.id).map((i:any)=>i.following_id))

        const remoteContent=(contentRes.data||[]).map((row:any)=>({
        ...row.payload,
          id:row.payload?.id||row.id,
          ownerId:row.owner_id,
          supabaseContentId:row.id,
          ownerProfile:publicProfiles.find((p:any)=>p.id===row.owner_id),
        }))

        const mergeContent=(existing:any[],incoming:any[])=>[
        ...incoming,
        ...existing.filter(item=>!incoming.some((r:any)=>String(r.id)===String(item.id))),
        ]

        setArticles(prev=>mergeContent(prev,remoteContent.filter((i:any)=>i.contentType==="article"||i.content_type==="article")))
        setCrops(prev=>mergeContent(prev,remoteContent.filter((i:any)=>i.contentType==="crop"||i.content_type==="crop")))
        setRfqs(prev=>mergeContent(prev,remoteContent.filter((i:any)=>i.contentType==="rfq"||i.content_type==="rfq")))
        setDiscussions(prev=>mergeContent(prev,remoteContent.filter((i:any)=>i.contentType==="discussion"||i.content_type==="discussion")))

        setSupabaseConnected(true)
        setSupabaseContentReady(true)

      } catch (error: any) {
        console.error("Could not load Supabase profiles, follows, and content",error)
        console.error("code:", error?.code, "message:", error?.message)
        if(active) showToast("تعذر تحميل بيانات Supabase. تحقق من RLS.")
      } finally {
        if(active) setSocialDataReady(true)
      }
    }
    void loadSocialData()
    return ()=>{active=false}
  },[currentUser?.id,currentUser?.provider,isLoggedIn])

  useEffect(()=>{
    if(!sharedContentReady) return
    try{
      const articlesToSave=articles.filter(a=>a.ownerId)
      const cropsToSave=crops.filter((c:any)=>c.ownerId)
      const rfqsToSave=rfqs.filter(r=>r.ownerId)
      const discussionsToSave=discussions.filter((d:any)=>d.ownerId)
      localStorage.setItem("contcrops_shared_content",JSON.stringify({articles:articlesToSave,crops:cropsToSave,rfqs:rfqsToSave,discussions:discussionsToSave}))
    }catch(e){ console.error("Could not save ContCrops content",e) }
  },[articles,crops,rfqs,discussions,sharedContentReady])

  useEffect(()=>{
    if(!socialDataReady||!supabaseContentReady||!currentUser?.id||currentUser.provider==="demo") return
    const items=[
     ...articles.filter((a:any)=>a.ownerId===currentUser.id).map((payload:any)=>({payload,contentType:"article"})),
     ...crops.filter((c:any)=>c.ownerId===currentUser.id).map((payload:any)=>({payload,contentType:"crop"})),
     ...rfqs.filter((r:any)=>r.ownerId===currentUser.id).map((payload:any)=>({payload,contentType:"rfq"})),
     ...discussions.filter((d:any)=>d.ownerId===currentUser.id).map((payload:any)=>({payload,contentType:"discussion"})),
    ]
    if(!items.length) return
    const rows=items.map(({payload,contentType}:any)=>({
      id:payload.supabaseContentId||`${currentUser.id}:${contentType}:${payload.id}`,
      owner_id:currentUser.id,
      content_type:contentType,
      payload,
      updated_at:new Date().toISOString(),
    }))
    void (async()=>{
      try{
        const {error}=await supabase.from("platform_content").upsert(rows as any,{onConflict:"id"})
        if(error) throw error
      }catch(error){ console.error("Could not sync owned ContCrops content to Supabase",error) }
    })()
  },[socialDataReady,supabaseContentReady,currentUser?.id,currentUser?.provider,articles,crops,rfqs,discussions])

  useEffect(()=>{
    if(!sharedContentReady||sharedLinkHandled) return
    const params=new URLSearchParams(window.location.search)
    const articleId=params.get("article")
    const rfqId=params.get("rfq")
    if(articleId){
      const article=articles.find((a:any)=>String(a.id)===articleId)
      if(article){setSelectedProfile(null);setSelectedArticle(article);setActiveTab("insights")}
    }else if(rfqId){
      const rfq=rfqs.find((r:any)=>String(r.id)===rfqId)
      if(rfq){setSelectedProfile(null);setSharedRFQId(rfq.id);setActiveTab("rfq")}
    }
    setSharedLinkHandled(true)
  },[sharedContentReady,sharedLinkHandled,articles,rfqs])

  useEffect(()=>{
    if(activeTab!=="rfq"||sharedRFQId===null) return
    const t=window.setTimeout(()=>document.getElementById(`rfq-${sharedRFQId}`)?.scrollIntoView({block:"center"}),0)
    return ()=>window.clearTimeout(t)
  },[activeTab,sharedRFQId,rfqs])

  useEffect(()=>{
    if(!accountDataReady||!accountStorageKey||accountStorageKey!==String(currentUser?.id||"")) return
    try{ localStorage.setItem(`contcrops_account:${accountStorageKey}`,JSON.stringify({following,savedArticles,notifications,messages,settingsAlerts})) }catch{}
  },[accountDataReady,accountStorageKey,currentUser?.id,following,savedArticles,notifications,messages,settingsAlerts])

  const handleGoogleLogin=async()=>{
    setAuthError("")
    if(!isSupabaseConfigured()){ setAuthError("تسجيل Google يحتاج ربط المشروع بـ Supabase"); return }
    setAuthBusy(true)
    try{
      const {error}=await supabase.auth.signInWithOAuth({ provider:"google", options:{redirectTo:`${window.location.origin}/`} })
      if(error) throw error
    }catch(error:any){ setAuthError(error.message||"تعذر بدء تسجيل الدخول"); setAuthBusy(false) }
  }

  const handleEmailAuth=async()=>{
    setAuthError("")
    const email=loginEmail.trim().toLowerCase()
    if(!email||!loginPassword){ setAuthError("أدخل البريد وكلمة المرور"); return }
    if(!isSupabaseConfigured()){ setAuthError("يلزم إعداد Supabase"); return }
    setAuthBusy(true)
    try{
      const result=loginMode==="register"
       ? await supabase.auth.signUp({email,password:loginPassword,options:{data:{full_name:farmName.trim()||email.split("@")[0]}}})
        : await supabase.auth.signInWithPassword({email,password:loginPassword})
      if(result.error) throw result.error
      if(loginMode==="register"&&!result.data.session){ setAuthError("تم إنشاء الحساب. راجع بريدك لتأكيده."); return }
    }catch(error:any){ setAuthError(error.message||"تعذر تسجيل الدخول") }finally{ setAuthBusy(false) }
  }

  const handleDemoLogin=()=>{
    const email=loginEmail.trim().toLowerCase()
    if(!email||!email.includes("@")){ setAuthError("اكتب بريدًا لتخصيص حساب التجربة"); return }
    const demoId=encodeURIComponent(email)
    const demoKey=`contcrops_demo_user:${demoId}`
    let saved=null; try{saved=JSON.parse(localStorage.getItem(demoKey)||"null")}catch{}
    const demoUser=saved||{id:`demo:${demoId}`,name:farmName.trim()||email.split("@")[0],email,avatar:`https://i.pravatar.cc/100?u=${encodeURIComponent(email)}`,city:"مصر",provider:"demo"}
    localStorage.setItem(`contcrops_demo_user:${demoId}`,JSON.stringify(demoUser))
    localStorage.setItem("contcrops_demo_session",demoId)
    setLocalProfiles(prev=>[...prev.filter((p:any)=>p.id!==demoUser.id),demoUser])
    setCurrentUser(demoUser); setAuthError(""); setIsLoggedIn(true)
  }

  const handleLogout=async()=>{
    if(currentUser?.provider==="demo"){ localStorage.removeItem("contcrops_demo_session") }
    else{ try{ await supabase.auth.signOut() }catch{ showToast("تعذر تسجيل الخروج"); return } }
    setCurrentUser(null); setIsLoggedIn(false); setAccountDataReady(false); setAccountStorageKey(""); setActiveTab("insights")
  }

  const requestNotifPermission = async ()=>{
    if(typeof window==="undefined" ||!("Notification" in window)) return
    const perm = await Notification.requestPermission()
    setNotifPermission(perm)
    if(perm==="granted"){ showToast("تم تفعيل الإشعارات 🔔") }
  }

  const notifyPeer = (recipientId:any, payload:any)=>{
    if(!recipientId || String(recipientId)===String(currentUser?.id)) return
    void persistPeerNotification({
      recipientId, actorId:currentUser?.id, actorName:currentUser?.name||"مستخدم ContCrops",
      actorAvatar:currentUser?.avatar, type:payload.type, title:payload.title, body:payload.body,
      relatedTitle:payload.relatedTitle||"", relatedType:payload.relatedType||"", relatedId:payload.relatedId,
    })
  }

  useEffect(()=>{
    async function load(){
      try{
        if(!isSupabaseConfigured()) return
        const { data: cropsData } = await supabase.from("crops").select("*").order("created_at", {ascending:false}).limit(100)
        if(cropsData && cropsData.length>0){
          setCrops(cropsData.map((c:any)=>({...c, liked:false, showComments:false, commentsList:[]})) as any)
          setSupabaseConnected(true)
        }
      }catch(e){ console.log("Supabase load error", e) }
    }
    load()
    if(typeof window!=="undefined" && "Notification" in window){ setNotifPermission(Notification.permission) }
  },[])

  const toggleLike = (id:number)=>{
    const crop=crops.find((c:any)=>c.id===id)
    const wasLiked=crop?.liked
    setCrops(prev=> prev.map((c:any)=> c.id===id? {...c, liked:!c.liked, likes: c.liked? c.likes-1 : c.likes+1} : c))
    if(!wasLiked && crop){ notifyPeer(crop.ownerId||crop.farmer_id,{type:"like", title:"إعجاب جديد", body:`أعجب بمحصولك ${crop.name}`, relatedTitle:crop.name, relatedType:"crop", relatedId:crop.id, target:{type:"crop",id:crop.id}}) }
  }

  const toggleComments = (id:number)=>{ setCrops(prev=> prev.map((c:any)=> c.id===id? {...c, showComments:!c.showComments} : c)) }
  const shareContent=async(title:string,url:string)=>{
    try{ await navigator.clipboard.writeText(`${title}\n${url}`); showToast("تم نسخ رابط المحتوى") }catch{ showToast("تعذر نسخ الرابط") }
  }
  const handleShare = (id:number)=>shareContent(`محصول ContCrops رقم ${id}`,`${window.location.origin}/crop/${id}`)
  const shareArticle=(article:any)=>shareContent(`مقال: ${article.title}`,`${window.location.origin}/?article=${encodeURIComponent(article.id)}`)
  const addArticleComment=(articleId:number)=>{
    const text=articleCommentDraft.trim(); if(!text) return
    const comment={id:Date.now(),name:currentUser?.name||"مستخدم ContCrops",text,time:"الآن"}
    setArticles(prev=>prev.map((a:any)=>a.id===articleId?{...a,commentsList:[...(a.commentsList||[]),comment]}:a))
    setSelectedArticle((a:any)=>a?.id===articleId?{...a,commentsList:[...(a.commentsList||[]),comment]}:a)
    setArticleCommentDraft(""); showToast("تمت إضافة تعليقك")
  }
  const toggleSavedArticle=(id:string|number)=>{
    const isSaved=savedArticles.some(i=>String(i)===String(id))
    setSavedArticles(prev=>isSaved?prev.filter(i=>String(i)!==String(id)):[...prev,id])
    showToast(isSaved?"تمت إزالة المقال من المحفوظات":"تم حفظ المقال")
  }
  const addDiscussionComment=(discussionId:string|number)=>{
    const text=(discussionCommentDrafts[String(discussionId)]||"").trim(); if(!text) return
    const comment={id:Date.now(),ownerId:currentUser?.id,name:currentUser?.name||"مستخدم ContCrops",text,time:"الآن"}
    setDiscussions(prev=>prev.map((d:any)=>d.id===discussionId?{...d,comments:(d.comments||0)+1,commentsList:[...(d.commentsList||[]),comment]}:d))
    setDiscussionCommentDrafts(prev=>({...prev,[String(discussionId)]:""})); showToast("تمت إضافة تعليقك")
  }
  const addRFQComment=(rfqId:number)=>{
    const text=(rfqCommentDrafts[rfqId]||"").trim(); if(!text) return
    setRfqs(prev=>prev.map((r:any)=>r.id===rfqId?{...r,comments:[...(r.comments||[]),{id:Date.now(),name:currentUser?.name||"مستخدم ContCrops",text}]}:r))
    setRfqCommentDrafts(prev=>({...prev,[rfqId]:""})); showToast("تمت إضافة تعليقك على الطلب")
  }
  const openProfileFromContent=(content:any,kind:"article"|"rfq")=>{
    const name=kind==="article"?content.author:content.buyer
    const profile=colleagues.find((p:any)=>p.id===content.ownerId||p.name===name)||content.ownerProfile||{
      id:content.ownerId||`${kind}:${name}`, name, city:content.city||content.location||"مصر",
      avatar:content.avatar||content.ownerProfile?.avatar||"https://i.pravatar.cc/100?img=12",
      cover:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
      specialty:kind==="article"?"كاتب ومزارع":"تاجر ومشتري", bio:"عضو في مجتمع ContCrops الزراعي.",
    }
    setSelectedProfile(profile); setActiveTab("profile")
  }
  const addComment = async (cropId:number)=>{
    if(!newComment.trim()) return
    const crop=crops.find((c:any)=>c.id===cropId)
    const commentObj={id:Date.now(),name:"أنت",text:newComment,time:"الآن"}
    setCrops(prev=> prev.map((c:any)=> c.id===cropId? {...c, commentsList:[...c.commentsList, commentObj], comments:c.comments+1} : c))
    setNewComment("")
  }
  const toggleFollow = async (id:string|number)=>{
    if(id===currentUser?.id){showToast("لا يمكنك الاهتمام بحسابك");return}
    const isFollowing=following.includes(id)
    const col=colleagues.find((c:any)=>c.id===id)
    const uuidPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[0-9a-f]{3}-[0-9a-f]{12}$/i
    const useSupabase=currentUser?.provider!=="demo"&&uuidPattern.test(String(currentUser?.id))&&uuidPattern.test(String(id))
    if(useSupabase){
      try{
        const {error}=isFollowing
         ? await supabase.from("user_follows").delete().eq("follower_id",currentUser.id).eq("following_id",id)
          : await supabase.from("user_follows").insert({follower_id:currentUser.id,following_id:id} as any)
        if(error) throw error
      }catch{ showToast("تعذر تحديث قائمة المهتم بهم"); return }
      setFollowRelationships(prev=>isFollowing?prev.filter((i:any)=>!(i.follower_id===currentUser.id&&i.following_id===id)):[...prev,{follower_id:currentUser.id,following_id:id}])
    }else{
      setLocalFollowRelationships(prev=>isFollowing?prev.filter((i:any)=>!(i.follower_id===currentUser.id&&i.following_id===id)):[...prev,{follower_id:currentUser.id,following_id:id}])
    }
    setFollowing(prev=>prev.includes(id)?prev.filter(item=>item!==id):[...prev,id])
    if(!isFollowing) showToast("أصبحت مهتمًا بهذا الزميل ✓"); else showToast("تم إلغاء الاهتمام")
  }

  const saveProfileSettings=async()=>{
    if(!profileDraft.name.trim()){ showToast("أدخل اسمًا لملفك الشخصي"); return }
    const updatedUser={...currentUser,name:profileDraft.name.trim(),city:profileDraft.city.trim()||"مصر",bio:profileDraft.bio.trim(),specialty:profileDraft.specialty.trim(),avatar:profileDraft.avatar.trim()||currentUser.avatar}
    setProfileSaveBusy(true)
    try{
      if(currentUser?.provider==="demo"){
        localStorage.setItem(`contcrops_demo_user:${encodeURIComponent(currentUser.email)}`,JSON.stringify(updatedUser))
      }else{
        const {error}=await supabase.from("profiles").upsert({
          id:currentUser.id, display_name:updatedUser.name, city:updatedUser.city, bio:updatedUser.bio,
          specialty:updatedUser.specialty||"عضو في مجتمع ContCrops", updated_at:new Date().toISOString(),
        } as any,{onConflict:"id"})
        if(error) throw error
      }
      setCurrentUser(updatedUser); showToast("تم حفظ بيانات الملف الشخصي")
    }catch{ showToast("تعذر حفظ الملف. تحقق من اتصال Supabase وسياسات RLS.") }finally{ setProfileSaveBusy(false) }
  }

  const handleAddCrop = async ()=>{
    if(!newPost.name.trim()){ showToast("اكتب اسم المحصول"); return }
    let image = ""
    try{ image=await persistPostImage(newPost.image,currentUser?.id||"local",currentUser?.provider!=="demo"&&isSupabaseConfigured()) }catch{ showToast("تعذر رفع الصورة"); return }
    const payload = {
      name:newPost.name||"محصول جديد", farmer:currentUser?.name||"مزارع ContCrops", farmer_id:currentUser?.id, ownerId:currentUser?.id,
      ownerName:currentUser?.name, ownerProfile:{id:currentUser?.id,name:currentUser?.name,avatar:currentUser?.avatar,city:currentUser?.city},
      city:newPost.city||"المنصورة", price:newPost.price||"10 جنيه/ك", qty:newPost.qty||"1 طن", category:newPost.category||"فريش",
      marketCategory:newPost.category||"فريش", img:image||undefined, avatar:"https://i.pravatar.cc/100?img=12", verified:true, likes:0, comments:0, description:newPost.desc, created_at:new Date().toISOString(),
    }
    const cropId=Date.now()
    setCrops(prev=>[{id:cropId,...payload, liked:false, showComments:false, commentsList:[]} as any,...prev])
    showToast("تم نشر المحصول"); setActiveTab("market"); setNewPost({name:"",city:"",price:"",qty:"",category:"فريش",desc:"",image:""})
  }

  const handleAddDiscussion = async ()=>{
    if(!newDiscussionText.trim()) return
    let image = ""
    try{ image=await persistPostImage(newDiscussionImage,currentUser?.id||"local",currentUser?.provider!=="demo"&&isSupabaseConfigured()) }catch{ showToast("تعذر رفع الصورة"); return }
    const temp={id:Date.now(), ownerId:currentUser?.id, farmer:{...COLLEAGUES_MOCK[0],id:currentUser?.id,name:currentUser?.name||"مزارع ContCrops",avatar:currentUser?.avatar||COLLEAGUES_MOCK[0].avatar}, text:newDiscussionText, image, time:"الآن", likes:0, reposts:0, comments:0, liked:false, showComments:false, commentsList:[]}
    setDiscussions(prev=>[temp as any,...prev]); setNewDiscussionText(""); setNewDiscussionImage(""); showToast("تم نشر النقاش")
  }

  const publishArticle = async ()=>{
    const title=newArticle.title.trim(); const body=newArticle.body.trim()
    if(!title ||!body){ showToast("أضف عنوان المقال ومحتواه"); return }
    let image = ""; try{ image=await persistPostImage(newArticle.image,currentUser?.id||"local",currentUser?.provider!=="demo"&&isSupabaseConfigured()) }catch{ showToast("تعذر رفع الصورة"); return }
    const article={ id:Date.now(), title, excerpt:body.slice(0,180), ownerId:currentUser?.id, ownerProfile:{id:currentUser?.id,name:currentUser?.name,avatar:currentUser?.avatar,city:currentUser?.city}, author:currentUser?.name||"مزارع ContCrops", avatar:currentUser?.avatar||"https://i.pravatar.cc/100?img=12", category:newArticle.category, date:"الآن", readTime:Math.max(1,Math.ceil(body.split(/\s+/).filter(Boolean).length/200)), likes:0, liked:false, commentsList:[], image, body:body.split(/\n+/).filter(Boolean), }
    setArticles(prev=>[article,...prev]); setNewArticle({title:"",category:"إرشاد زراعي",body:"",image:""}); setSelectedArticle(null); setActiveTab("insights"); showToast("تم نشر مقالك 🌱")
  }

  const toggleArticleLike = (articleId:number)=>{
    setArticles(prev=>prev.map((a:any)=>a.id===articleId?{...a,liked:!a.liked,likes:a.likes+(a.liked?-1:1)}:a))
    setSelectedArticle((a:any)=>a?.id===articleId?{...a,liked:!a.liked,likes:a.likes+(a.liked?-1:1)}:a)
  }

  const sendChatMessage=()=>{
    const text=chatInput.trim(); const activeMessage=messages[activeChat]; if(!text||!activeMessage) return
    setMessages(prev=>prev.map((c:any,index)=>index===activeChat?{...c,last:text,unread:0,chat:[...c.chat,{from:"me",text,time:new Date().toISOString()}]}:c))
    setChatInput("")
  }

  const openChatWith=(person:any)=>{
    const existing=messages.findIndex((m:any)=>m.with?.id===person.id)
    if(existing>=0){ setActiveChat(existing); setMessages(prev=>prev.map((m:any,i)=>i===existing?{...m,unread:0}:m)) }
    else{ const newC={id:Date.now(),with:person,last:"ابدأ المحادثة",unread:0,chat:[]}; setMessages(prev=>[newC,...prev]); setActiveChat(0) }
    setMobileChatOpen(true)
  }

  const createRFQ = ()=>{
    if(!newRFQ.title.trim() ||!newRFQ.quantity.trim()){ showToast("أضف وصف الطلب والكمية"); return }
    const requestId=Date.now(); const rfqTitle=newRFQ.title.trim()
    setRfqs(prev=>[{id:requestId,ownerId:currentUser?.id,ownerProfile:{id:currentUser?.id,name:currentUser?.name,avatar:currentUser?.avatar,city:currentUser?.city},avatar:currentUser?.avatar,title:rfqTitle,buyer:currentUser?.name||"مستخدم ContCrops",location:newRFQ.location.trim()||"تحدد لاحقًا",quantity:newRFQ.quantity.trim(),deadline:"جديد",category:"طلب شراء",comments:[]},...prev])
    setNewRFQ({title:"",quantity:"",location:""}); setShowRFQForm(false); showToast("تم نشر طلب الشراء")
  }

  const offerOnRFQ=(rfq:any)=>{
    if(rfq.ownerId===currentUser?.id){ showToast("هذا طلبك"); return }
    const buyer=colleagues.find((p:any)=>p.id===rfq.ownerId)||{ id:rfq.ownerId||`rfq:${rfq.id}`, name:rfq.buyer, city:rfq.location, avatar:"https://i.pravatar.cc/100?img=33" }
    openChatWith(buyer); setActiveTab("messages"); setChatInput(`مرحبًا، لدي عرض مناسب لطلبكم: ${rfq.title}`)
  }

  const marketCategoryForCrop=(crop:any)=>{
    if(MARKET_CATEGORIES.slice(1).includes(crop.marketCategory)) return crop.marketCategory
    if(crop.category==="مجمد"||crop.category==="مجفف"||crop.category==="مستلزمات إنتاج"||crop.category==="مستلزمات زراعية"||crop.category==="نقل ولوجيستيات"||crop.category==="نقل ولوجستيات") return crop.category==="نقل ولوجستيات"?"نقل ولوجيستيات":crop.category
    if(crop.category==="حبوب") return "مجفف"
    if(crop.category==="أسمدة") return "مستلزمات زراعية"
    return "فريش"
  }

  const filteredCrops = crops.filter((c:any)=> (activeCat==="الكل"||marketCategoryForCrop(c)===activeCat) && (c.name.includes(search)||c.city.includes(search)||c.farmer.includes(search)) )
  const priceGroups=new Map<string,any>()
  crops.filter((c:any)=>pricesCategory==="الكل"||marketCategoryForCrop(c)===pricesCategory).forEach((crop:any)=>{
    const priceText=String(crop.price||""); const match=priceText.match(/[0-9٠-٩]+(?:[.,٫][0-9٠-٩]+)?/)
    const westernNumber=match?.[0].replace(/[٠-٩]/g,(d:string)=>String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).replace(/[٫,]/g,".")
    const numericPrice=westernNumber?Number(westernNumber):null; const unit=match?`${priceText.slice(0,match.index||0)}${priceText.slice((match.index||0)+match[0].length)}`.trim():""
    const category=marketCategoryForCrop(crop); const key=`${crop.name.trim().toLowerCase()}|${category}|${unit}`; const existing=priceGroups.get(key)
    if(existing){ existing.offers.push(crop); if(numericPrice!==null&&Number.isFinite(numericPrice)) existing.prices.push(numericPrice) }
    else{ priceGroups.set(key,{name:crop.name,category,unit,offers:[crop],prices:numericPrice!==null&&Number.isFinite(numericPrice)?[numericPrice]:[]}) }
  })
  const priceRows=Array.from(priceGroups.values()).map((group:any)=>({...group, latest:group.offers[0], average:group.prices.length?group.prices.reduce((s:number,v:number)=>s+v,0)/group.prices.length:null, min:group.prices.length?Math.min(...group.prices):null, max:group.prices.length?Math.max(...group.prices):null, })).filter((row:any)=>!search||`${row.name} ${row.category} ${row.latest.city}`.includes(search))
  const filteredArticles = articles.filter((a:any)=>(articleTopic==="الكل"||a.category===articleTopic)&&(a.title.includes(search)||a.excerpt.includes(search)||a.category.includes(search)||a.author.includes(search))).filter((a:any)=>articleFeed!=="saved"||savedArticles.some(id=>String(id)===String(a.id)))
  const communityProfiles=[...colleagues,...localProfiles,...articles.map((a:any)=>a.ownerProfile),...crops.map((c:any)=>c.ownerProfile),...rfqs.map((r:any)=>r.ownerProfile),...discussions.map((d:any)=>d.farmer),currentUser&&{ id:currentUser.id, name:currentUser.name, city:currentUser.city||"مصر", bio:currentUser.bio||"", specialty:currentUser.specialty||"عضو في مجتمع ContCrops", avatar:currentUser.avatar, cover:currentUser.cover, }].filter((p:any,index,arr)=>p&&p.id!=null&&arr.findIndex((i:any)=>i?.id===p.id)===index)
  const visibleFollowRelationships=[...followRelationships,...localFollowRelationships]
  const filteredColleagues = communityProfiles.filter((c:any)=>c.id!==currentUser?.id).filter((c:any)=>colleagueFilter==="all"||following.includes(c.id)).filter((c:any)=>c.name.includes(colleagueSearch)||c.city.includes(colleagueSearch))
  const filteredRfqs = rfqs.filter((r:any)=>(rfqCategory==="الكل"||r.category===rfqCategory)&&(!search||r.title.includes(search)||r.buyer.includes(search)||r.location.includes(search)))
  const myPosts = crops.filter((c:any)=> c.ownerId===currentUser?.id)
  const myArticles = articles.filter((a:any)=>a.ownerId===currentUser?.id)
  const myRFQs = rfqs.filter((r:any)=>r.ownerId===currentUser?.id)
  const myDiscussions=discussions.filter((d:any)=>d.ownerId===currentUser?.id)
  const ownFollowers=visibleFollowRelationships.filter((i:any)=>i.following_id===currentUser?.id).length
  const ownFollowing=visibleFollowRelationships.filter((i:any)=>i.follower_id===currentUser?.id).length
  const profileFollowers=visibleFollowRelationships.filter((i:any)=>i.following_id===(selectedProfile?.id||currentUser?.id)).length
  const profileFollowing=visibleFollowRelationships.filter((i:any)=>i.follower_id===(selectedProfile?.id||currentUser?.id)).length
  const profileRelationshipList=followListMode?visibleFollowRelationships.filter((i:any)=>followListMode==="followers"?i.following_id===(selectedProfile?.id||currentUser?.id):i.follower_id===(selectedProfile?.id||currentUser?.id)).map((i:any)=>communityProfiles.find((p:any)=>p.id===(followListMode==="followers"?i.follower_id:i.following_id))).filter(Boolean):[]
  const profileArticles=selectedProfile?articles.filter((a:any)=>a.ownerId===selectedProfile.id||a.author===selectedProfile.name):[]
  const profilePosts=selectedProfile?crops.filter((c:any)=>c.ownerId===selectedProfile.id||c.farmer_id===selectedProfile.id||c.farmer===selectedProfile.name):myPosts
  const profileRFQs=selectedProfile?rfqs.filter((r:any)=>r.ownerId===selectedProfile.id||r.buyer===selectedProfile.name):[]
  const profileDiscussions=selectedProfile?discussions.filter((d:any)=>d.ownerId===selectedProfile.id||d.farmer?.id===selectedProfile.id||d.farmer?.name===selectedProfile.name):myDiscussions
  const unreadNotifications=notifications.filter((n:any)=>!n.read).length
  const visibleMessages=messages.map((m:any,i:number)=>({...m,index:i})).filter((m:any)=>m.with?.name?.includes(messageSearch)||m.last?.includes(messageSearch)).filter((m:any)=>messageFilter==="all"||m.unread>0)

  const openNotification=(notification:any)=>{
    setNotifications(prev=>prev.map((i:any)=>i.id===notification.id?{...i,read:true}:i))
    setShowNotifications(false)
    const target=notification.target
    if(!target){ setActiveTab("market"); return }
    if(target.type==="profile"){ const p=communityProfiles.find((x:any)=>String(x.id)===String(target.id)); if(p){setSelectedProfile(p);setActiveTab("profile")} }
    else if(target.type==="crop"){ const c=crops.find((x:any)=>String(x.id)===String(target.id)); setSearch(c?.name||""); setActiveTab("market") }
    else if(target.type==="article"){ const a=articles.find((x:any)=>String(x.id)===String(target.id)); if(a){setSelectedProfile(null);setSelectedArticle(a)} setActiveTab("insights") }
    else if(target.type==="discussion"){ setDiscussionCommentsOpen(target.id); setActiveTab("discussions") }
    else if(target.type==="rfq"){ const r=rfqs.find((x:any)=>String(x.id)===String(target.id)); setSearch(r?.title||""); setActiveTab("rfq") }
    else if(target.type==="message"){ const idx=messages.findIndex((x:any)=>String(x.with?.id)===String(target.id)); if(idx>=0){setActiveChat(idx);setMobileChatOpen(true)} setActiveTab("messages") }
  }

  if(!authReady){ return <div dir="rtl" className="flex min-h-screen items-center justify-center"><div className="rounded-2xl bg-white px-8 py-6 text-sm font-bold text-emerald-900 shadow">جارٍ التحقق من حسابك…</div></div> }

  if(!isLoggedIn){
    return (
      <div dir="rtl" className="flex min-h-screen items-center justify-center p-4 sm:p-8">
        <div className="grid w-full max-w- overflow-hidden rounded- bg-white shadow-[0_30px_100px_-40px_rgba(24,61,39,.32)] lg:min-h- lg:grid-cols-2">
          <section className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
            <div className="mb-9 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-2xl text-white shadow-lg">🌿</div>
              <div><h1 className="text-xl font-extrabold">ContCrops</h1><p className="mt-0.5 text-xs text-slate-500">منصة المحاصيل والمجتمع الزراعي</p></div>
              {supabaseConnected && <span className="mr-auto rounded-full bg-emerald-50 px-3 py-1 text- font-bold text-emerald-700">متصل بـ Supabase</span>}
            </div>
            <div className="mb-7">
              <p className="mb-2 text-sm font-bold text-emerald-700">أهلًا بك في مجتمعنا 🌱</p>
              <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">محصولك يستحق <span className="text-emerald-700">سوقًا أفضل</span></h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">تواصل مع المزارعين، اكتشف المحاصيل المتاحة، وابنِ علاقات تجارية تنمو معك.</p>
            </div>
            <div className="mb-5 flex gap-1 rounded-2xl bg-slate-100 p-1.5">
              <button onClick={()=>setLoginMode("login")} className={`h-11 flex-1 rounded-xl text-sm font-bold ${loginMode==="login"?"bg-white text-emerald-800 shadow-sm":"text-slate-500"}`}>تسجيل الدخول</button>
              <button onClick={()=>setLoginMode("register")} className={`h-11 flex-1 rounded-xl text-sm font-bold ${loginMode==="register"?"bg-white text-emerald-800 shadow-sm":"text-slate-500"}`}>إنشاء حساب</button>
            </div>
            <div className="space-y-3">
              <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600">البريد الإلكتروني</span><input value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} placeholder="name@example.com" type="email" className="h-12 w-full rounded-xl border bg-slate-50 px-4 text-sm"/></label>
              <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600">كلمة المرور</span><input value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} placeholder="أدخل كلمة المرور" type="password" className="h-12 w-full rounded-xl border bg-slate-50 px-4 text-sm"/></label>
              {loginMode==="register" && <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600">اسم المزرعة</span><input value={farmName} onChange={e=>setFarmName(e.target.value)} placeholder="اسم المزرعة" className="h-12 w-full rounded-xl border bg-slate-50 px-4 text-sm"/></label>}
              {authError && <p className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{authError}</p>}
              <button onClick={handleEmailAuth} disabled={authBusy} className="h-12 w-full rounded-xl bg-emerald-800 font-bold text-white disabled:opacity-60">{authBusy?"جارٍ التحقق…":loginMode==="login"?"دخول إلى المنصة":"إنشاء حساب آمن"}</button>
              <div className="flex items-center gap-3 py-1 text- font-bold text-slate-400"><span className="h-px flex-1 bg-slate-200"></span>أو<span className="h-px flex-1 bg-slate-200"></span></div>
              <button onClick={handleGoogleLogin} disabled={authBusy} className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border bg-white text-sm font-bold">المتابعة باستخدام Google</button>
              <button onClick={handleDemoLogin} className="h-11 w-full rounded-xl border border-emerald-100 bg-emerald-50 font-bold text-emerald-800">دخول تجريبي بهذا البريد</button>
            </div>
          </section>
          <div className="flex min-h- flex-col justify-between bg-emerald-900 p-7 text-white sm:p-10 lg:p-12">
            <div className="self-start rounded-full border border-white/25 bg-white/10 px-3 py-2 text-xs font-bold">سوق زراعي ينمو بثقتك</div>
            <div><h3 className="text-3xl font-extrabold sm:text-4xl">خلّي الخير يوصل<br/>للي يقدّره.</h3><p className="mt-4 max-w-md text-sm leading-7 text-white/80">اعرض إنتاجك، تابع أسعار المحاصيل، وتعرّف على شبكة من المزارعين والتجار.</p></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div dir="rtl" className="flex min-h-screen bg-[#f7f8f3]">
      <aside className="sticky top-0 hidden h-screen w- shrink-0 flex-col border-l bg-white lg:flex">
        <div className="p-5 flex items-center gap-2 border-b">
          <div className="w-9 h-9 rounded-xl bg-black text-emerald-500 flex items-center justify-center font-extrabold">C</div>
          <div className="flex flex-col leading-none"><span className="font-extrabold">ContCrops</span><span className="text- text-slate-500 font-bold mt-0.5">تواصل - تبادل - نمو مستدام</span></div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {[
            {id:"insights", label:"الإرشاد والتخطيط", icon:<BookOpen size={19}/>},
            {id:"market", label:"سوق المحاصيل", icon:<Store size={19}/>},
            {id:"rfq", label:"طلبات الشراء", icon:<ClipboardList size={19}/>},
            {id:"community", label:"الزملاء", icon:<UsersRound size={19}/>},
            {id:"discussions", label:"النقاشات", icon:<MessageSquare size={19}/>},
            {id:"messages", label:"الرسائل", icon:<MessageCircle size={19}/>, badge:messages.reduce((a:any,m:any)=>a+m.unread,0)},
            {id:"prices", label:"لوحة الأسعار", icon:<BarChart3 size={19}/>},
            {id:"dashboard", label:"لوحة التحكم", icon:<ClipboardList size={19}/>},
            {id:"profile", label:"الملف الشخصي", icon:<CircleUserRound size={19}/>},
            {id:"settings", label:"الإعدادات", icon:<Settings size={19}/>},
          ].map((tab:any)=>(
            <button key={tab.id} onClick={()=>{if(tab.id==="dashboard"){window.location.href="/admin";return}setActiveTab(tab.id);setSelectedProfile(null);setSelectedArticle(null)}} className={`w-full h-12 flex items-center gap-3 px-4 rounded-xl text-sm font-bold ${activeTab===tab.id &&!selectedProfile? "bg-[#e9f4eb] text-emerald-900" : "text-slate-600 hover:bg-slate-50"}`}>
              <span className="text-emerald-800">{tab.icon}</span>{tab.label}
              {tab.badge>0 && <span className="mr-auto bg-red-500 text-white text- px-2 py-0.5 rounded-full">{tab.badge}</span>}
            </button>
          ))}
          <button onClick={()=>{setActiveTab("write");setSelectedArticle(null)}} className="w-full h-12 flex items-center gap-3 px-4 rounded-xl text-sm font-bold bg-[#1c5135] text-white mt-2">✎ اكتب مقالًا</button>
          <button onClick={()=>setActiveTab("add")} className="w-full h-11 mt-2 flex items-center gap-3 px-4 rounded-xl text-sm font-bold text-emerald-800 hover:bg-emerald-50">＋ أضف محصولًا للسوق</button>
        </nav>
        <div className="p-4 border-t flex items-center gap-3">
          <img src={currentUser?.avatar} alt="" className="h-9 w-9 rounded-full"/>
          <button onClick={()=>setActiveTab("profile")} className="min-w-0 text-right"><p className="truncate text-sm font-bold">{currentUser?.name}</p><p className="truncate text-xs text-slate-500">{currentUser?.email}</p></button>
          <button onClick={handleLogout} className="mr-auto"><LogOut size={18}/></button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 pb- lg:pb-0">
        <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
          <div className="mx-auto flex h- max-w- items-center gap-2 px-3 sm:px-4">
            <div className="relative min-w-0 max-w- flex-1">
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={activeTab==="insights"?"ابحث عن مقال...":"ابحث عن محصول، مدينة، زميل..."} className="w-full h-11 pr-11 pl-4 bg-slate-50 border rounded-full text-sm"/>
            </div>
            <div className="mr-auto flex items-center gap-2">
              <NotificationBell notifications={notifications} open={showNotifications} onToggle={()=>setShowNotifications(o=>!o)} onClose={()=>setShowNotifications(false)} onOpen={openNotification} onMarkAllRead={()=>setNotifications(prev=>prev.map(i=>({...i,read:true})))} onClear={()=>{setNotifications([]);setShowNotifications(false)}} notifPermission={notifPermission} onRequestPermission={requestNotifPermission} />
            </div>
          </div>
          {activeTab==="market" &&!selectedProfile && (
            <div className="max-w- mx-auto px-4 py-2 flex gap-2 overflow-x-auto border-t">
              {MARKET_CATEGORIES.map(cat=><button key={cat} onClick={()=>setActiveCat(cat)} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm border ${activeCat===cat? "bg-slate-900 text-white" : "bg-white text-slate-600"}`}>{cat}</button>)}
            </div>
          )}
        </header>

        <div className="max-w- mx-auto px-4 py-5 sm:px-6">
          <CropPriceTicker onSelect={crop=>{setSearch(crop);setActiveCat("الكل");setActiveTab("market");setSelectedProfile(null);setSelectedArticle(null)}}/>
          {activeTab==="market" && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 mt-6">
              {crops.filter((c:any)=> (activeCat==="الكل"||marketCategoryForCrop(c)===activeCat) && (c.name.includes(search)||c.city.includes(search))).map((c:any)=><article key={c.id} className="overflow-hidden rounded- border bg-white p-5"><h3 className="font-extrabold">{c.name}</h3><p className="text-xs text-slate-500 mt-1">{c.city} · {c.price}</p></article>)}
            </div>
          )}
          {activeTab==="insights" &&!selectedArticle && (
            <div className="mt-6">
              <StoriesRail/>
              <div className="divide-y mt-6">
                {filteredArticles.map((a:any)=><article key={a.id} className="py-6 flex gap-4"><div className="flex-1"><button onClick={()=>setSelectedArticle(a)} className="text-right"><h2 className="font-extrabold">{a.title}</h2><p className="text-sm text-slate-500 mt-2 line-clamp-2">{a.excerpt}</p></button></div><button onClick={()=>setSelectedArticle(a)}><img src={a.image} alt="" className="h-24 w-28 rounded-2xl object-cover"/></button></article>)}
              </div>
            </div>
          )}
          {selectedArticle && (
            <article className="mx-auto max-w- mt-6"><button onClick={()=>setSelectedArticle(null)} className="mb-5 text-sm font-bold">→ العودة</button><img src={selectedArticle.image} alt="" className="mb-7 h-64 w-full rounded-3xl object-cover"/><h1 className="text-3xl font-extrabold">{selectedArticle.title}</h1><p className="mt-4 text-slate-500">{selectedArticle.excerpt}</p><div className="mt-7">{selectedArticle.body.map((p:string,i:number)=><p key={i} className="mb-6 text- leading-8">{p}</p>)}</div></article>
          )}
          {toast && <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-full text-sm font-bold z-[90]">{toast}</div>}
        </div>
      </main>
    </div>
  )
}