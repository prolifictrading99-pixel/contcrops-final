"use client"
import { useState, useEffect } from "react"
import { BarChart3, Bell, BookOpen, Bookmark, ClipboardList, CircleUserRound, Heart, Leaf, LogOut, MapPin, MessageCircle, MessageSquare, Package, Search, Settings, Share2, ShieldCheck, Sprout, Store, TrendingUp, UsersRound } from "lucide-react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { CropPriceTicker } from "@/components/CropPriceTicker"
import { StoriesRail } from "@/components/Stories"

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
  const [newPost, setNewPost] = useState({name:"", city:"", price:"", qty:"", category:"فريش", desc:""})
  const [messages, setMessages] = useState([
    {id:1, with:COLLEAGUES_MOCK[0], last:"الطماطم وصلت؟", unread:2, chat:[{from:"them",text:"الطماطم وصلت؟"},{from:"me",text:"ايوه في الطريق"}]},
    {id:2, with:COLLEAGUES_MOCK[1], last:"الشتلات جاهزة", unread:0, chat:[{from:"them",text:"الشتلات جاهزة"}]},
  ])
  const [activeChat, setActiveChat] = useState(0)
  const [chatInput, setChatInput] = useState("")
  const [newDiscussionText, setNewDiscussionText] = useState("")
  const [articles, setArticles] = useState<any[]>(ARTICLES_MOCK)
  const [selectedArticle, setSelectedArticle] = useState<any>(null)
  const [savedArticles, setSavedArticles] = useState<Array<string|number>>([])
  const [articleTopic, setArticleTopic] = useState("الكل")
  const [articleFeed, setArticleFeed] = useState<"for-you"|"latest"|"saved">("for-you")
  const [newArticle, setNewArticle] = useState({title:"",category:"إرشاد زراعي",body:""})
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
  const [notifications, setNotifications] = useState<any[]>([
    {id:1, type:"like", title:"إعجاب جديد", body:"أحمد المزارع أعجب بمحصولك طماطم بلدي", read:false, time:"منذ 5 دقائق", icon:"❤️"},
    {id:2, type:"comment", title:"تعليق جديد", body:"فاطمة علقت: الجودة ممتازة 👏", read:false, time:"منذ 20 دقيقة", icon:"💬"},
  ])
  const [showNotifications, setShowNotifications] = useState(false)
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
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>applySession(session))
    return ()=>{
      active=false
      subscription.unsubscribe()
    }
  },[])

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
  // The default examples are only needed once at initial load.
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setNotifications(Array.isArray(data.notifications)?data.notifications:[])
        setMessages(Array.isArray(data.messages)?data.messages:[])
        setSettingsAlerts(data.settingsAlerts!==false)
      }else{
        setFollowing([])
        setSavedArticles([])
        setNotifications([])
        setMessages([])
        setSettingsAlerts(true)
      }
    }catch(error){
      console.error("Could not load this account's private data",error)
      setFollowing([])
      setSavedArticles([])
      setNotifications([])
      setMessages([])
      setSettingsAlerts(true)
    }
    setAccountDataReady(true)
  },[currentUser?.id])

  useEffect(()=>{
    try{
      const stored=localStorage.getItem("contcrops_local_follows")
      const relationships=stored?JSON.parse(stored):[]
      setLocalFollowRelationships(Array.isArray(relationships)?relationships:[])
      const profiles=Object.keys(localStorage)
        .filter(key=>key.startsWith("contcrops_demo_user:"))
        .map(key=>{
          try{return JSON.parse(localStorage.getItem(key)||"null")}catch(error){
            console.error("Could not load a local colleague profile",error)
            return null
          }
        })
        .filter(Boolean)
      setLocalProfiles(profiles)
    }catch(error){
      console.error("Could not load local colleague relationships",error)
      setLocalFollowRelationships([])
      setLocalProfiles([])
    }finally{
      setLocalFollowsReady(true)
    }
  },[])

  useEffect(()=>{
    if(!localFollowsReady) return
    try{
      localStorage.setItem("contcrops_local_follows",JSON.stringify(localFollowRelationships))
    }catch(error){
      console.error("Could not save local colleague relationships",error)
      showToast("تعذر حفظ الاهتمامات على هذا الجهاز")
    }
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
        const metadata=authUser.data.user.user_metadata||{}
        const ownProfile={
          id:currentUser.id,
          display_name:currentUser.name||metadata.full_name||currentUser.email.split("@")[0],
          city:currentUser.city||"مصر",
          bio:currentUser.bio||"",
          specialty:currentUser.specialty||"عضو في مجتمع ContCrops",
          avatar_url:currentUser.avatar||"",
          cover_url:currentUser.cover||"",
          updated_at:new Date().toISOString(),
        }
        const {data:existingOwnProfile,error:ownProfileError}=await supabase.from("profiles").select("*").eq("id",currentUser.id).maybeSingle()
        if(ownProfileError) throw ownProfileError
        if(!existingOwnProfile){
          const {error:profileError}=await supabase.from("profiles").upsert(ownProfile,{onConflict:"id"})
          if(profileError) throw profileError
        }
        const [profilesResult,followsResult,contentResult]=await Promise.all([
          supabase.from("profiles").select("*").order("updated_at",{ascending:false}),
          supabase.from("user_follows").select("*"),
          supabase.from("platform_content").select("*").order("created_at",{ascending:false}),
        ])
        if(profilesResult.error) throw profilesResult.error
        if(followsResult.error) throw followsResult.error
        if(contentResult.error) throw contentResult.error
        if(!active) return

        const publicProfiles=(profilesResult.data||[]).map((profile:any)=>({
          id:profile.id,
          name:profile.display_name,
          city:profile.city,
          bio:profile.bio,
          specialty:profile.specialty,
          avatar:profile.avatar_url,
          cover:profile.cover_url,
          followers:0,
          following:0,
          online:false,
          isSupabaseProfile:true,
        }))
        const savedOwnProfile=(profilesResult.data||[]).find((profile:any)=>profile.id===currentUser.id)
        if(savedOwnProfile){
          setCurrentUser((user:any)=>user?.id===currentUser.id?{
            ...user,
            name:savedOwnProfile.display_name,
            city:savedOwnProfile.city,
            bio:savedOwnProfile.bio,
            specialty:savedOwnProfile.specialty,
            avatar:savedOwnProfile.avatar_url||user.avatar,
            cover:savedOwnProfile.cover_url||user.cover,
          }:user)
        }
        setColleagues(prev=>{
          const profileIds=new Set(publicProfiles.map(profile=>profile.id))
          return [...publicProfiles,...prev.filter(profile=>!profileIds.has(profile.id))]
        })
        const relationships=followsResult.data||[]
        setFollowRelationships(relationships)
        setFollowing(relationships.filter((item:any)=>item.follower_id===currentUser.id).map((item:any)=>item.following_id))

        const remoteContent=(contentResult.data||[]).map((row:any)=>({
          ...row.payload,
          id:row.payload.id,
          ownerId:row.owner_id,
          supabaseContentId:row.id,
          ownerProfile:publicProfiles.find((profile:any)=>profile.id===row.owner_id),
        }))
        const mergeContent=(existing:any[],incoming:any[])=>[
          ...incoming,
          ...existing.filter(item=>!incoming.some(remote=>remote.id===item.id&&remote.ownerId===item.ownerId)),
        ]
        setArticles(prev=>mergeContent(prev,remoteContent.filter((item:any)=>item.contentType==="article")))
        setCrops(prev=>mergeContent(prev,remoteContent.filter((item:any)=>item.contentType==="crop")))
        setRfqs(prev=>mergeContent(prev,remoteContent.filter((item:any)=>item.contentType==="rfq")))
        setDiscussions(prev=>mergeContent(prev,remoteContent.filter((item:any)=>item.contentType==="discussion")))
        setSupabaseConnected(true)
        setSupabaseContentReady(true)
      }catch(error){
        console.error("Could not load Supabase profiles, follows, and content",error)
        if(active) showToast("تعذر تحميل بيانات Supabase. تحقق من تطبيق migration وإعداد RLS.")
      }finally{
        if(active) setSocialDataReady(true)
      }
    }
    void loadSocialData()
    return ()=>{active=false}
  },[currentUser?.id,currentUser?.provider,isLoggedIn])

  useEffect(()=>{
    if(!sharedContentReady) return
    try{
      const articlesToSave=articles.filter(article=>article.ownerId)
      const cropsToSave=crops.filter(crop=>crop.ownerId)
      const rfqsToSave=rfqs.filter(rfq=>rfq.ownerId)
      const discussionsToSave=discussions.filter(discussion=>discussion.ownerId)
      localStorage.setItem("contcrops_shared_content",JSON.stringify({articles:articlesToSave,crops:cropsToSave,rfqs:rfqsToSave,discussions:discussionsToSave}))
    }catch(error){
      console.error("Could not save ContCrops content",error)
    }
  },[articles,crops,rfqs,discussions,sharedContentReady])

  useEffect(()=>{
    if(!socialDataReady||!supabaseContentReady||!currentUser?.id||currentUser.provider==="demo") return
    const items=[
      ...articles.filter(item=>item.ownerId===currentUser.id).map(payload=>({payload,contentType:"article"})),
      ...crops.filter(item=>item.ownerId===currentUser.id).map(payload=>({payload,contentType:"crop"})),
      ...rfqs.filter(item=>item.ownerId===currentUser.id).map(payload=>({payload,contentType:"rfq"})),
      ...discussions.filter(item=>item.ownerId===currentUser.id).map(payload=>({payload,contentType:"discussion"})),
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
        const {error}=await supabase.from("platform_content").upsert(rows,{onConflict:"id"})
        if(error) throw error
      }catch(error){
        console.error("Could not sync owned ContCrops content to Supabase",error)
        showToast("تعذر مزامنة المنشورات مع Supabase")
      }
    })()
  },[socialDataReady,supabaseContentReady,currentUser?.id,currentUser?.provider,articles,crops,rfqs,discussions])

  useEffect(()=>{
    if(!sharedContentReady||sharedLinkHandled) return
    const params=new URLSearchParams(window.location.search)
    const articleId=params.get("article")
    const rfqId=params.get("rfq")
    if(articleId){
      const article=articles.find(item=>String(item.id)===articleId)
      if(article){setSelectedProfile(null);setSelectedArticle(article);setActiveTab("insights")}
    }else if(rfqId){
      const rfq=rfqs.find(item=>String(item.id)===rfqId)
      if(rfq){setSelectedProfile(null);setSharedRFQId(rfq.id);setActiveTab("rfq")}
    }
    setSharedLinkHandled(true)
  },[sharedContentReady,sharedLinkHandled,articles,rfqs])

  useEffect(()=>{
    if(activeTab!=="rfq"||sharedRFQId===null) return
    const scrollTimer=window.setTimeout(()=>document.getElementById(`rfq-${sharedRFQId}`)?.scrollIntoView({block:"center"}),0)
    return ()=>window.clearTimeout(scrollTimer)
  },[activeTab,sharedRFQId,rfqs])

  useEffect(()=>{
    if(!accountDataReady||!accountStorageKey||accountStorageKey!==String(currentUser?.id||"")) return
    try{
      localStorage.setItem(`contcrops_account:${accountStorageKey}`,JSON.stringify({following,savedArticles,notifications,messages,settingsAlerts}))
    }catch(error){
      console.error("Could not save private account data",error)
    }
  },[accountDataReady,accountStorageKey,currentUser?.id,following,savedArticles,notifications,messages,settingsAlerts])

  const handleGoogleLogin=async()=>{
    setAuthError("")
    if(!isSupabaseConfigured()){
      setAuthError("تسجيل Google يحتاج ربط المشروع بـ Supabase وإعداد Google provider أولًا.")
      return
    }
    setAuthBusy(true)
    try{
      const {error}=await supabase.auth.signInWithOAuth({
        provider:"google",
        options:{redirectTo:`${window.location.origin}/`},
      })
      if(error) throw error
    }catch(error:any){
      setAuthError(error.message||"تعذر بدء تسجيل الدخول باستخدام Google.")
      setAuthBusy(false)
    }
  }

  const handleEmailAuth=async()=>{
    setAuthError("")
    const email=loginEmail.trim().toLowerCase()
    if(!email||!loginPassword){
      setAuthError("أدخل البريد الإلكتروني وكلمة المرور.")
      return
    }
    if(!isSupabaseConfigured()){
      setAuthError("يلزم إعداد Supabase لتسجيل الدخول بحساب آمن. يمكنك استخدام التجربة المنفصلة.")
      return
    }
    setAuthBusy(true)
    try{
      const result=loginMode==="register"
        ? await supabase.auth.signUp({email,password:loginPassword,options:{data:{full_name:farmName.trim()||email.split("@")[0]}}})
        : await supabase.auth.signInWithPassword({email,password:loginPassword})
      if(result.error) throw result.error
      if(loginMode==="register"&&!result.data.session){
        setAuthError("تم إنشاء الحساب. راجع بريدك الإلكتروني لتأكيده، ثم سجّل الدخول.")
        return
      }
      if(result.data.user){
        const user=result.data.user
        const metadata=user.user_metadata||{}
        setCurrentUser({id:user.id,name:metadata.full_name||user.email?.split("@")[0]||"مستخدم ContCrops",email:user.email||"",avatar:metadata.avatar_url||"https://i.pravatar.cc/100?img=12",city:"مصر",provider:"email"})
        setIsLoggedIn(true)
      }
    }catch(error:any){
      setAuthError(error.message||"تعذر تسجيل الدخول. تحقق من الاتصال وحاول مرة أخرى.")
    }finally{
      setAuthBusy(false)
    }
  }

  const handleDemoLogin=()=>{
    const email=loginEmail.trim().toLowerCase()
    if(!email||!email.includes("@")){
      setAuthError("اكتب بريدًا إلكترونيًا لتخصيص حساب التجربة على هذا الجهاز.")
      return
    }
    const demoId=encodeURIComponent(email)
    const demoKey=`contcrops_demo_user:${demoId}`
    let savedDemoUser=null
    try{savedDemoUser=JSON.parse(localStorage.getItem(demoKey)||"null")}catch(error){console.error("Could not restore this local demo profile",error)}
    const demoUser=savedDemoUser||{id:`demo:${demoId}`,name:farmName.trim()||email.split("@")[0],email,avatar:`https://i.pravatar.cc/100?u=${encodeURIComponent(email)}`,city:"مصر",provider:"demo"}
    localStorage.setItem(`contcrops_demo_user:${demoId}`,JSON.stringify(demoUser))
    localStorage.setItem("contcrops_demo_session",demoId)
    setLocalProfiles(prev=>[...prev.filter(profile=>profile.id!==demoUser.id),demoUser])
    setCurrentUser(demoUser)
    setAuthError("")
    setIsLoggedIn(true)
  }

  const handleLogout=async()=>{
    if(currentUser?.provider==="demo"){
      localStorage.removeItem("contcrops_demo_session")
    }else{
      try{
        const {error}=await supabase.auth.signOut()
        if(error) throw error
      }catch(error){
        console.error("Could not sign out",error)
        showToast("تعذر تسجيل الخروج، حاول مرة أخرى")
        return
      }
    }
    setCurrentUser(null)
    setIsLoggedIn(false)
    setAccountDataReady(false)
    setAccountStorageKey("")
    setActiveTab("insights")
  }

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
    if(settingsAlerts) setNotifications(prev=>[newNotif, ...prev])
    showToast(n.body||n.title)
    if(settingsAlerts&&notifPermission==="granted" && typeof window!=="undefined" && "Notification" in window){
      try{ new Notification(n.title, {body:n.body}) }catch{}
    }
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
          const savedDiscussions=discData.map((d:any)=>({
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
          }))
          setDiscussions(prev=>[...savedDiscussions,...prev.filter((discussion:any)=>discussion.ownerId)])
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
    if(!wasLiked && crop){ pushNotification({type:"like", title:"إعجاب", body:`أعجبت بمحصول ${crop.name} ❤️`, icon:"❤️",target:{type:"crop",id:crop.id}}) }
    // تحديث في Supabase
    if(isSupabaseConfigured() && crop){
      supabase.from("crops").update({likes: wasLiked ? crop.likes-1 : crop.likes+1}).eq("id", id).then(()=>{})
    }
  }
  const toggleComments = (id:number)=>{
    setCrops(prev=> prev.map(c=> c.id===id ? {...c, showComments:!c.showComments} as any : c))
  }
  const shareContent=async(title:string,url:string)=>{
    try{
      await navigator.clipboard.writeText(`${title}\n${url}`)
      showToast("تم نسخ رابط المحتوى لمشاركته")
    }catch(error){
      console.error("Could not copy the share link",error)
      showToast("تعذر نسخ الرابط؛ تحقق من صلاحية الحافظة في المتصفح")
    }
  }
  const handleShare = (id:number)=>shareContent(`محصول ContCrops رقم ${id}`,`${window.location.origin}/crop/${id}`)
  const shareArticle=(article:any)=>shareContent(`مقال: ${article.title}`,`${window.location.origin}/?article=${encodeURIComponent(article.id)}`)
  const addArticleComment=(articleId:number)=>{
    const text=articleCommentDraft.trim()
    if(!text) return
    const comment={id:Date.now(),name:currentUser?.name||"مستخدم ContCrops",text,time:"الآن"}
    setArticles(prev=>prev.map(article=>article.id===articleId?{...article,commentsList:[...(article.commentsList||[]),comment]}:article))
    setSelectedArticle((article:any)=>article?.id===articleId?{...article,commentsList:[...(article.commentsList||[]),comment]}:article)
    setArticleCommentDraft("")
    showToast("تمت إضافة تعليقك")
  }
  const toggleSavedArticle=(articleId:string|number)=>{
    const isSaved=savedArticles.some(id=>String(id)===String(articleId))
    setSavedArticles(prev=>isSaved?prev.filter(id=>String(id)!==String(articleId)):[...prev,articleId])
    showToast(isSaved?"تمت إزالة المقال من المحفوظات":"تم حفظ المقال للرجوع إليه")
  }
  const addDiscussionComment=(discussionId:string|number)=>{
    const text=(discussionCommentDrafts[String(discussionId)]||"").trim()
    if(!text) return
    const comment={id:Date.now(),ownerId:currentUser?.id,name:currentUser?.name||"مستخدم ContCrops",text,time:"الآن"}
    setDiscussions(prev=>prev.map(discussion=>discussion.id===discussionId?{
      ...discussion,
      comments:(discussion.comments||0)+1,
      commentsList:[...(discussion.commentsList||[]),comment],
    }:discussion))
    setDiscussionCommentDrafts(prev=>({...prev,[String(discussionId)]:""}))
    showToast("تمت إضافة تعليقك إلى المناقشة")
  }
  const addRFQComment=(rfqId:number)=>{
    const text=(rfqCommentDrafts[rfqId]||"").trim()
    if(!text) return
    setRfqs(prev=>prev.map(rfq=>rfq.id===rfqId?{...rfq,comments:[...(rfq.comments||[]),{id:Date.now(),name:currentUser?.name||"مستخدم ContCrops",text}]}:rfq))
    setRfqCommentDrafts(prev=>({...prev,[rfqId]:""}))
    showToast("تمت إضافة تعليقك على الطلب")
  }
  const openProfileFromContent=(content:any,kind:"article"|"rfq")=>{
    const name=kind==="article"?content.author:content.buyer
    const avatar=content.avatar||content.ownerProfile?.avatar||"https://i.pravatar.cc/100?img=12"
    const profile=colleagues.find(person=>person.id===content.ownerId||person.name===name)||content.ownerProfile||{
      id:content.ownerId||`${kind}:${name}`,
      name,
      city:content.city||content.location||"مصر",
      avatar,
      cover:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
      specialty:kind==="article"?"كاتب ومزارع":"تاجر ومشتري",
      bio:"عضو في مجتمع ContCrops الزراعي.",
    }
    setSelectedProfile(profile)
    setActiveTab("profile")
  }
  const addComment = async (cropId:number)=>{
    if(!newComment.trim()) return
    const crop=crops.find(c=>c.id===cropId)
    const commentObj={id:Date.now(),name:"أنت",text:newComment,time:"الآن"}
    setCrops(prev=> prev.map(c=> c.id===cropId ? {...c, commentsList:[...c.commentsList, commentObj], comments:c.comments+1} as any : c))
    pushNotification({type:"comment", title:"تعليق", body:`علقت على ${crop?.name||"المحصول"}: ${newComment.slice(0,30)}`, icon:"💬",target:{type:"crop",id:cropId}})
    // حفظ في Supabase
    if(isSupabaseConfigured()){
      await supabase.from("crop_comments").insert({crop_id:cropId, user_name:"أنت", text:newComment})
      await supabase.from("crops").update({comments: (crop?.comments||0)+1}).eq("id", cropId)
    }
    setNewComment("")
  }
  const toggleFollow = async (id:string|number)=>{
    if(id===currentUser?.id){showToast("لا يمكنك الاهتمام بحسابك");return}
    const isFollowing=following.includes(id)
    const col=colleagues.find(c=>c.id===id)
    const uuidPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    const useSupabaseRelationship=currentUser?.provider!=="demo"&&uuidPattern.test(String(currentUser?.id))&&uuidPattern.test(String(id))
    if(useSupabaseRelationship){
      try{
        const {error}=isFollowing
          ? await supabase.from("user_follows").delete().eq("follower_id",currentUser.id).eq("following_id",id)
          : await supabase.from("user_follows").insert({follower_id:currentUser.id,following_id:id})
        if(error) throw error
      }catch(error){
        console.error("Could not update colleague interest",error)
        showToast("تعذر تحديث قائمة المهتم بهم")
        return
      }
      setFollowRelationships(prev=>isFollowing
        ? prev.filter(item=>!(item.follower_id===currentUser.id&&item.following_id===id))
        : [...prev,{follower_id:currentUser.id,following_id:id}])
    }else{
      setLocalFollowRelationships(prev=>isFollowing
        ? prev.filter(item=>!(item.follower_id===currentUser.id&&item.following_id===id))
        : [...prev,{follower_id:currentUser.id,following_id:id}])
    }
    setFollowing(prev=>prev.includes(id)?prev.filter(item=>item!==id):[...prev,id])
    if(!isFollowing&&col){pushNotification({type:"follow",title:"اهتمام جديد",body:`أصبحت مهتمًا بـ ${col.name} 👥`,icon:"👥",target:{type:"profile",id:col.id}})}
    else showToast(isFollowing?"تم إلغاء الاهتمام":"أصبحت مهتمًا بهذا الزميل ✓")
  }

  const saveProfileSettings=async()=>{
    if(!profileDraft.name.trim()){
      showToast("أدخل اسمًا لملفك الشخصي")
      return
    }
    const updatedUser={...currentUser,name:profileDraft.name.trim(),city:profileDraft.city.trim()||"مصر",bio:profileDraft.bio.trim(),specialty:profileDraft.specialty.trim(),avatar:profileDraft.avatar.trim()||currentUser.avatar}
    setProfileSaveBusy(true)
    try{
      if(currentUser?.provider==="demo"){
        localStorage.setItem(`contcrops_demo_user:${encodeURIComponent(currentUser.email)}`,JSON.stringify(updatedUser))
      }else{
        const {error}=await supabase.from("profiles").upsert({
          id:currentUser.id,
          display_name:updatedUser.name,
          city:updatedUser.city,
          bio:updatedUser.bio,
          specialty:updatedUser.specialty||"عضو في مجتمع ContCrops",
          avatar_url:updatedUser.avatar||"",
          cover_url:updatedUser.cover||"",
          updated_at:new Date().toISOString(),
        },{onConflict:"id"})
        if(error) throw error
      }
      setCurrentUser(updatedUser)
      if(updatedUser.provider==="demo"){
        setLocalProfiles(prev=>[...prev.filter(profile=>profile.id!==updatedUser.id),updatedUser])
      }
      setColleagues(prev=>prev.map(profile=>profile.id===updatedUser.id?{...profile,...updatedUser}:profile))
      showToast("تم حفظ بيانات الملف الشخصي")
    }catch(error){
      console.error("Could not save profile settings",error)
      showToast("تعذر حفظ الملف. تحقق من اتصال Supabase وسياسات RLS.")
    }finally{
      setProfileSaveBusy(false)
    }
  }

  const handleAddCrop = async ()=>{
    if(!newPost.name.trim()){
      showToast("اكتب اسم المحصول")
      return
    }
    const payload = {
      name:newPost.name||"محصول جديد",
      farmer:currentUser?.name||"مزارع ContCrops",
      farmer_id:currentUser?.id,
      ownerId:currentUser?.id,
      ownerName:currentUser?.name,
      ownerProfile:{id:currentUser?.id,name:currentUser?.name,avatar:currentUser?.avatar,city:currentUser?.city},
      city:newPost.city||"المنصورة",
      price:newPost.price||"10 جنيه/ك",
      qty:newPost.qty||"1 طن",
      category:newPost.category||"فريش",
      marketCategory:newPost.category||"فريش",
      img:"https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600",
      avatar:"https://i.pravatar.cc/100?img=12",
      verified:true,
      likes:0,
      comments:0,
      description:newPost.desc
    }
    const cropId=Date.now()
    setCrops(prev=>[{id:cropId, ...payload, liked:false, showComments:false, commentsList:[]} as any,...prev])
    showToast("تم نشر المحصول، وسيظهر في السوق وملفك الشخصي")
    setActiveTab("market")
    setNewPost({name:"",city:"",price:"",qty:"",category:"فريش",desc:""})
    pushNotification({type:"like", title:"محصول جديد", body:`نشرت ${payload.name} في السوق 🌱`, icon:"🌱",target:{type:"crop",id:cropId}})
  }

  const handleAddDiscussion = async ()=>{
    if(!newDiscussionText.trim()) return
    const temp={id:Date.now(), ownerId:currentUser?.id, farmer:{...COLLEAGUES_MOCK[0],id:currentUser?.id,name:currentUser?.name||"مزارع ContCrops",avatar:currentUser?.avatar||COLLEAGUES_MOCK[0].avatar}, text:newDiscussionText, time:"الآن", likes:0, reposts:0, comments:0, liked:false, showComments:false, commentsList:[]}
    setDiscussions(prev=>[temp as any, ...prev])
    const textToSave=newDiscussionText
    setNewDiscussionText("")
    pushNotification({type:"discussion", title:"نقاش جديد", body:`نشرت: ${textToSave.slice(0,40)}...`, icon:"🧵",target:{type:"discussion",id:temp.id}})
    showToast("تم نشر النقاش في مجتمعك على هذا الجهاز")
  }

  const publishArticle = ()=>{
    const title=newArticle.title.trim()
    const body=newArticle.body.trim()
    if(!title || !body){
      showToast("أضف عنوان المقال ومحتواه أولًا")
      return
    }
    const article={
      id:Date.now(),
      title,
      excerpt:body.slice(0,180),
      ownerId:currentUser?.id,
      ownerProfile:{id:currentUser?.id,name:currentUser?.name,avatar:currentUser?.avatar,city:currentUser?.city},
      author:currentUser?.name||"مزارع ContCrops",
      avatar:currentUser?.avatar||"https://i.pravatar.cc/100?img=12",
      category:newArticle.category,
      date:"الآن",
      readTime:Math.max(1,Math.ceil(body.split(/\s+/).filter(Boolean).length/200)),
      likes:0,
      liked:false,
      commentsList:[],
      image:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1000&auto=format&fit=crop&q=85",
      body:body.split(/\n+/).filter(Boolean),
    }
    setArticles(prev=>[article,...prev])
    setNewArticle({title:"",category:"إرشاد زراعي",body:""})
    setSelectedArticle(null)
    setActiveTab("insights")
    showToast("تم نشر مقالك في مكتبة الخبرات الزراعية 🌱")
  }

  const toggleArticleLike = (articleId:number)=>{
    setArticles(prev=>prev.map(article=>article.id===articleId?{...article,liked:!article.liked,likes:article.likes+(article.liked?-1:1)}:article))
    setSelectedArticle((article:any)=>article?.id===articleId?{...article,liked:!article.liked,likes:article.likes+(article.liked?-1:1)}:article)
  }

  const sendChatMessage=()=>{
    const text=chatInput.trim()
    const activeMessage=messages[activeChat]
    if(!text||!activeMessage) return
    setMessages(prev=>prev.map((conversation,index)=>index===activeChat?{
      ...conversation,
      last:text,
      unread:0,
      chat:[...conversation.chat,{from:"me",text,time:new Date().toISOString()}],
    }:conversation))
    setChatInput("")
    pushNotification({type:"message",title:"تم إرسال الرسالة",body:`إلى ${activeMessage.with.name}: ${text.slice(0,50)}`,icon:"💬",target:{type:"message",id:activeMessage.with.id}})
  }

  const openChatWith=(person:any)=>{
    const existing=messages.findIndex((message:any)=>message.with?.id===person.id)
    if(existing>=0){
      setActiveChat(existing)
      setMessages(prev=>prev.map((message:any,index)=>index===existing?{...message,unread:0}:message))
    }else{
      const newConversation={id:Date.now(),with:person,last:"ابدأ المحادثة",unread:0,chat:[]}
      setMessages(prev=>[newConversation,...prev])
      setActiveChat(0)
    }
    setMobileChatOpen(true)
  }

  const createRFQ = ()=>{
    if(!newRFQ.title.trim() || !newRFQ.quantity.trim()){
      showToast("أضف وصف الطلب والكمية المطلوبة")
      return
    }
    const requestId=Date.now()
    setRfqs(prev=>[{id:requestId,ownerId:currentUser?.id,ownerProfile:{id:currentUser?.id,name:currentUser?.name,avatar:currentUser?.avatar,city:currentUser?.city},avatar:currentUser?.avatar,title:newRFQ.title.trim(),buyer:currentUser?.name||"مستخدم ContCrops",location:newRFQ.location.trim()||"تحدد لاحقًا",quantity:newRFQ.quantity.trim(),deadline:"جديد",category:"طلب شراء",comments:[]},...prev])
    setNewRFQ({title:"",quantity:"",location:""})
    setShowRFQForm(false)
    pushNotification({type:"request",title:"تم نشر طلب الشراء",body:"سيظهر طلبك للتجار والموردين في المنصة.",icon:"📋",target:{type:"rfq",id:requestId}})
    showToast("تم نشر طلب الشراء")
  }

  const offerOnRFQ=(rfq:any)=>{
    if(rfq.ownerId===currentUser?.id){
      showToast("هذا طلب الشراء الذي نشرته")
      return
    }
    const buyer=colleagues.find(person=>person.id===rfq.ownerId)||{
      id:rfq.ownerId||`rfq:${rfq.id}`,
      name:rfq.buyer,
      city:rfq.location,
      avatar:"https://i.pravatar.cc/100?img=33",
    }
    openChatWith(buyer)
    setActiveTab("messages")
    setChatInput(`مرحبًا، لدي عرض مناسب لطلبكم: ${rfq.title}`)
    showToast("اكتب تفاصيل عرضك ثم أرسل الرسالة")
  }

  const marketCategoryForCrop=(crop:any)=>{
    if(MARKET_CATEGORIES.slice(1).includes(crop.marketCategory)) return crop.marketCategory
    if(crop.category==="مجمد"||crop.category==="مجفف"||crop.category==="مستلزمات إنتاج"||crop.category==="مستلزمات زراعية"||crop.category==="نقل ولوجيستيات"||crop.category==="نقل ولوجستيات") return crop.category==="نقل ولوجستيات"?"نقل ولوجيستيات":crop.category
    if(crop.category==="حبوب") return "مجفف"
    if(crop.category==="أسمدة") return "مستلزمات زراعية"
    return "فريش"
  }
  const filteredCrops = crops.filter(c=> (activeCat==="الكل"||marketCategoryForCrop(c)===activeCat) && (c.name.includes(search)||c.city.includes(search)||c.farmer.includes(search)) )
  const priceGroups=new Map<string,any>()
  crops.filter(crop=>pricesCategory==="الكل"||marketCategoryForCrop(crop)===pricesCategory).forEach(crop=>{
    const priceText=String(crop.price||"")
    const match=priceText.match(/[0-9٠-٩]+(?:[.,٫][0-9٠-٩]+)?/)
    const westernNumber=match?.[0].replace(/[٠-٩]/g,digit=>String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))).replace(/[٫,]/g,".")
    const numericPrice=westernNumber?Number(westernNumber):null
    const unit=match?`${priceText.slice(0,match.index||0)}${priceText.slice((match.index||0)+match[0].length)}`.trim():""
    const category=marketCategoryForCrop(crop)
    const key=`${crop.name.trim().toLowerCase()}|${category}|${unit}`
    const existing=priceGroups.get(key)
    if(existing){
      existing.offers.push(crop)
      if(numericPrice!==null&&Number.isFinite(numericPrice)) existing.prices.push(numericPrice)
    }else{
      priceGroups.set(key,{name:crop.name,category,unit,offers:[crop],prices:numericPrice!==null&&Number.isFinite(numericPrice)?[numericPrice]:[]})
    }
  })
  const priceRows=Array.from(priceGroups.values()).map(group=>({
    ...group,
    latest:group.offers[0],
    average:group.prices.length?group.prices.reduce((sum:number,value:number)=>sum+value,0)/group.prices.length:null,
    min:group.prices.length?Math.min(...group.prices):null,
    max:group.prices.length?Math.max(...group.prices):null,
  })).filter(row=>!search||`${row.name} ${row.category} ${row.latest.city}`.includes(search))
  const filteredArticles = articles
    .filter(a=>(articleTopic==="الكل"||a.category===articleTopic)&&(a.title.includes(search)||a.excerpt.includes(search)||a.category.includes(search)||a.author.includes(search)))
    .filter(a=>articleFeed!=="saved"||savedArticles.some(id=>String(id)===String(a.id)))
  const communityProfiles=[...colleagues,...localProfiles,...articles.map(item=>item.ownerProfile),...crops.map(item=>item.ownerProfile),...rfqs.map(item=>item.ownerProfile),...discussions.map(item=>item.farmer),currentUser&&{
    id:currentUser.id,
    name:currentUser.name,
    city:currentUser.city||"مصر",
    bio:currentUser.bio||"",
    specialty:currentUser.specialty||"عضو في مجتمع ContCrops",
    avatar:currentUser.avatar,
    cover:currentUser.cover,
  }].filter((profile,index,profiles)=>profile&&profile.id!=null&&profiles.findIndex(item=>item?.id===profile.id)===index)
  const visibleFollowRelationships=[...followRelationships,...localFollowRelationships]
  const filteredColleagues = communityProfiles
    .filter(c=>c.id!==currentUser?.id)
    .filter(c=>colleagueFilter==="all"||following.includes(c.id))
    .filter(c=>c.name.includes(colleagueSearch)||c.city.includes(colleagueSearch))
  const filteredRfqs = rfqs.filter(rfq=>(rfqCategory==="الكل"||rfq.category===rfqCategory)&&(!search||rfq.title.includes(search)||rfq.buyer.includes(search)||rfq.location.includes(search)))
  const myPosts = crops.filter(c=> c.ownerId===currentUser?.id)
  const myArticles = articles.filter(article=>article.ownerId===currentUser?.id)
  const myRFQs = rfqs.filter(rfq=>rfq.ownerId===currentUser?.id)
  const myDiscussions=discussions.filter(discussion=>discussion.ownerId===currentUser?.id)
  const ownFollowers=visibleFollowRelationships.filter(item=>item.following_id===currentUser?.id).length
  const ownFollowing=visibleFollowRelationships.filter(item=>item.follower_id===currentUser?.id).length
  const profileFollowers=visibleFollowRelationships.filter(item=>item.following_id===(selectedProfile?.id||currentUser?.id)).length
  const profileFollowing=visibleFollowRelationships.filter(item=>item.follower_id===(selectedProfile?.id||currentUser?.id)).length
  const profileRelationshipList=followListMode
    ? visibleFollowRelationships
      .filter(item=>followListMode==="followers"?item.following_id===(selectedProfile?.id||currentUser?.id):item.follower_id===(selectedProfile?.id||currentUser?.id))
      .map(item=>communityProfiles.find(profile=>profile.id===(followListMode==="followers"?item.follower_id:item.following_id)))
      .filter(Boolean)
    : []
  const profileArticles=selectedProfile?articles.filter(article=>article.ownerId===selectedProfile.id||article.author===selectedProfile.name):[]
  const profilePosts=selectedProfile?crops.filter(crop=>crop.ownerId===selectedProfile.id||crop.farmer_id===selectedProfile.id||crop.farmer===selectedProfile.name):myPosts
  const profileRFQs=selectedProfile?rfqs.filter(rfq=>rfq.ownerId===selectedProfile.id||rfq.buyer===selectedProfile.name):[]
  const profileDiscussions=selectedProfile?discussions.filter(discussion=>discussion.ownerId===selectedProfile.id||discussion.farmer?.id===selectedProfile.id||discussion.farmer?.name===selectedProfile.name):myDiscussions
  const unreadNotifications=notifications.filter((notification:any)=>!notification.read).length
  const visibleMessages=messages
    .map((message:any,index:number)=>({...message,index}))
    .filter((message:any)=>message.with?.name?.includes(messageSearch)||message.last?.includes(messageSearch))
    .filter((message:any)=>messageFilter==="all"||message.unread>0)

  const openNotification=(notification:any)=>{
    setNotifications(prev=>prev.map(item=>item.id===notification.id?{...item,read:true}:item))
    setShowNotifications(false)
    const target=notification.target
    if(!target){
      if(notification.type==="follow"){
        const name=notification.body?.match(/بـ (.+?) 👥/)?.[1]
        const profile=communityProfiles.find(person=>person.name===name)
        if(profile){setSelectedProfile(profile);setActiveTab("profile")}
      }else if(notification.type==="message"){
        setActiveTab("messages")
      }else if(notification.type==="discussion"){
        setActiveTab("discussions")
      }else if(notification.type==="request"){
        setActiveTab("rfq")
      }else{
        const crop=crops.find(item=>notification.body?.includes(item.name))
        if(crop) setSearch(crop.name)
        setActiveTab("market")
      }
      return
    }
    if(target.type==="profile"){
      const profile=communityProfiles.find(person=>String(person.id)===String(target.id))
      if(profile){setSelectedProfile(profile);setActiveTab("profile")}
      else setActiveTab("community")
    }else if(target.type==="crop"){
      const crop=crops.find(item=>String(item.id)===String(target.id))
      setSearch(crop?.name||"")
      setActiveTab("market")
    }else if(target.type==="article"){
      const article=articles.find(item=>String(item.id)===String(target.id))
      if(article){setSelectedProfile(null);setSelectedArticle(article)}
      setActiveTab("insights")
    }else if(target.type==="discussion"){
      setDiscussionCommentsOpen(target.id)
      setActiveTab("discussions")
    }else if(target.type==="rfq"){
      const request=rfqs.find(item=>String(item.id)===String(target.id))
      setSearch(request?.title||"")
      setActiveTab("rfq")
    }else if(target.type==="message"){
      const index=messages.findIndex(item=>String(item.with?.id)===String(target.id))
      if(index>=0){setActiveChat(index);setMobileChatOpen(true)}
      setActiveTab("messages")
    }
  }

  if(!authReady){
    return <div dir="rtl" className="auth-shell flex min-h-screen items-center justify-center"><div className="rounded-2xl bg-white px-8 py-6 text-sm font-bold text-emerald-900 shadow">جارٍ التحقق من حسابك…</div></div>
  }

  if(!isLoggedIn){
    return (
      <div dir="rtl" className="auth-shell flex min-h-screen items-center justify-center p-4 sm:p-8">
        <div className="grid w-full max-w-[1120px] overflow-hidden rounded-[32px] bg-white shadow-[0_30px_100px_-40px_rgba(24,61,39,.32)] lg:min-h-[680px] lg:grid-cols-2">
          <section className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
            <div className="mb-9 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-2xl text-white shadow-lg shadow-emerald-900/15">🌿</div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">ContCrops</h1>
                <p className="mt-0.5 text-xs font-medium text-slate-500">منصة المحاصيل والمجتمع الزراعي</p>
              </div>
              {supabaseConnected && <span className="mr-auto rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700">متصل بـ Supabase</span>}
            </div>
            <div className="mb-7">
              <p className="mb-2 text-sm font-bold text-emerald-700">أهلًا بك في مجتمعنا 🌱</p>
              <h2 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">محصولك يستحق <span className="text-emerald-700">سوقًا أفضل</span></h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">تواصل مع المزارعين، اكتشف المحاصيل المتاحة، وابنِ علاقات تجارية تنمو معك.</p>
            </div>
            <div className="mb-5 flex gap-1 rounded-2xl bg-slate-100 p-1.5">
              <button onClick={()=>setLoginMode("login")} className={`h-11 flex-1 rounded-xl text-sm font-bold ${loginMode==="login"?"bg-white text-emerald-800 shadow-sm":"text-slate-500 hover:text-slate-800"}`}>تسجيل الدخول</button>
              <button onClick={()=>setLoginMode("register")} className={`h-11 flex-1 rounded-xl text-sm font-bold ${loginMode==="register"?"bg-white text-emerald-800 shadow-sm":"text-slate-500 hover:text-slate-800"}`}>إنشاء حساب</button>
            </div>
            <div className="space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-600">البريد الإلكتروني</span>
                <input value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} placeholder="name@example.com" type="email" autoComplete="email" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"/>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-600">كلمة المرور</span>
                <input value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} placeholder="أدخل كلمة المرور" type="password" autoComplete={loginMode==="register"?"new-password":"current-password"} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"/>
              </label>
              {loginMode==="register" && <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600">اسم المزرعة أو الحساب</span><input value={farmName} onChange={e=>setFarmName(e.target.value)} placeholder="اسم المزرعة أو النشاط" autoComplete="organization" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"/></label>}
              {authError && <p role="alert" className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">{authError}</p>}
              <button onClick={handleEmailAuth} disabled={authBusy} className="h-12 w-full rounded-xl bg-emerald-800 font-bold text-white shadow-lg shadow-emerald-900/15 hover:-translate-y-0.5 hover:bg-emerald-900 disabled:opacity-60">{authBusy?"جارٍ التحقق…":loginMode==="login"?"دخول إلى المنصة":"إنشاء حساب آمن"}</button>
              <div className="flex items-center gap-3 py-1 text-[11px] font-bold text-slate-400"><span className="h-px flex-1 bg-slate-200"></span>أو باستخدام<span className="h-px flex-1 bg-slate-200"></span></div>
              <button onClick={handleGoogleLogin} disabled={authBusy} className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"><svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5"><path fill="#FFC107" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.9 6.1-15z"/><path fill="#4CAF50" d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.5H5.8v5.3A20 20 0 0 0 24 44z"/><path fill="#1976D2" d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8l6.8-5.3z"/><path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3l5.8-5.8C34.1 5.9 29.5 4 24 4A20 20 0 0 0 5.8 15.1l6.8 5.3C14.2 15.5 18.7 12 24 12z"/></svg> المتابعة باستخدام Google</button>
              <button onClick={handleDemoLogin} className="h-11 w-full rounded-xl border border-emerald-100 bg-emerald-50 font-bold text-emerald-800 hover:bg-emerald-100">دخول تجريبي منفصل بهذا البريد</button>
            </div>
            <p className="mt-5 text-center text-[11px] leading-5 text-slate-400">للدخول الحقيقي، فعّل Email وGoogle من إعدادات المصادقة في مشروع Supabase. الحساب التجريبي منفصل حسب البريد لكنه محفوظ على هذا الجهاز فقط.</p>
          </section>
          <div className="auth-visual relative flex min-h-[340px] flex-col justify-between overflow-hidden p-7 text-white sm:p-10 lg:min-h-0 lg:p-12">
            <div className="flex items-center gap-2 self-start rounded-full border border-white/25 bg-white/10 px-3 py-2 text-xs font-bold backdrop-blur"><span className="h-2 w-2 rounded-full bg-lime-300"></span>سوق زراعي ينمو بثقتك</div>
            <div className="relative z-10 max-w-lg pb-3">
              <p className="mb-3 text-sm font-bold text-lime-200">من أرضك إلى السوق، بخطوة أقرب</p>
              <h3 className="text-3xl font-extrabold leading-tight sm:text-4xl">خلّي الخير يوصل<br/>للي يقدّره.</h3>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/80">اعرض إنتاجك، تابع أسعار المحاصيل، وتعرّف على شبكة من المزارعين والتجار في مكان واحد.</p>
              <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur"><p className="text-lg font-extrabold">سوق</p><p className="mt-1 text-[11px] text-white/70">محاصيل طازجة</p></div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur"><p className="text-lg font-extrabold">مجتمع</p><p className="mt-1 text-[11px] text-white/70">خبرات تتشارك</p></div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur"><p className="text-lg font-extrabold">فرص</p><p className="mt-1 text-[11px] text-white/70">علاقات تنمو</p></div>
              </div>
            </div>
            <p className="relative z-10 text-xs text-white/60">معًا نحو تجارة زراعية أكثر استدامة</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div dir="rtl" className="flex min-h-screen bg-[#f7f8f3]">
      <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 flex-col border-l border-slate-200/80 bg-white lg:flex">
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
            {id:"insights", label:"الإرشاد والتخطيط", icon:<BookOpen size={19}/>},
            {id:"market", label:"سوق المحاصيل", icon:<Store size={19}/>},
            {id:"rfq", label:"طلبات الشراء", icon:<ClipboardList size={19}/>},
            {id:"community", label:"الزملاء", icon:<UsersRound size={19}/>},
            {id:"discussions", label:"النقاشات", icon:<MessageSquare size={19}/>},
            {id:"messages", label:"الرسائل", icon:<MessageCircle size={19}/>, badge:messages.reduce((a,m)=>a+m.unread,0)},
            {id:"prices", label:"لوحة الأسعار", icon:<BarChart3 size={19}/>},
            {id:"profile", label:"الملف الشخصي", icon:<CircleUserRound size={19}/>},
            {id:"settings", label:"الإعدادات", icon:<Settings size={19}/>},
          ].map(tab=>(
            <button key={tab.id} onClick={()=>{setActiveTab(tab.id);if(tab.id==="prices")setSearch("");setSelectedProfile(null);setSelectedArticle(null)}} className={`w-full h-12 flex items-center gap-3 px-4 rounded-xl text-sm font-bold ${activeTab===tab.id && !selectedProfile ? "bg-[#e9f4eb] text-emerald-900" : "text-slate-600 hover:bg-slate-50"}`}>
              <span className="text-emerald-800">{tab.icon}</span>{tab.label}
              {(tab as any).badge>0 && <span className="mr-auto bg-red-500 text-white text-[11px] px-2 py-0.5 rounded-full">{(tab as any).badge}</span>}
            </button>
          ))}
          <div className="my-4 border-t border-slate-100"></div>
          <button onClick={()=>{setActiveTab("write");setSelectedArticle(null)}} className="w-full h-12 flex items-center gap-3 px-4 rounded-xl text-sm font-bold bg-[#1c5135] text-white hover:bg-[#143c27]">
            <span className="text-lg">✎</span>اكتب مقالًا
          </button>
          <button onClick={()=>setActiveTab("add")} className="w-full h-11 mt-2 flex items-center gap-3 px-4 rounded-xl text-sm font-bold text-emerald-800 hover:bg-emerald-50">
            <span className="text-lg">＋</span>أضف محصولًا للسوق
          </button>
        </nav>
        <div className="p-4 border-t border-slate-100 flex items-center gap-3">
          <img src={currentUser?.avatar} alt="" className="h-9 w-9 rounded-full object-cover"/>
          <button onClick={()=>setActiveTab("profile")} className="min-w-0 text-right">
            <p className="truncate text-sm font-bold">{currentUser?.name}</p>
            <p className="truncate text-xs text-slate-500">{currentUser?.email}</p>
          </button>
          <button type="button" onClick={()=>setActiveTab("settings")} aria-label="الإعدادات" title="الإعدادات" className="mr-auto flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-emerald-800"><Settings size={18}/></button>
          <button type="button" onClick={handleLogout} aria-label="تسجيل الخروج" title="تسجيل الخروج" className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-rose-50 hover:text-rose-700"><LogOut size={18}/></button>
        </div>
      </aside>

      <nav aria-label="التنقل الرئيسي" className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-7 border-t border-slate-200 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-8px_24px_rgba(20,45,30,.06)] backdrop-blur lg:hidden">
        {[
          {id:"insights",label:"الإرشاد والتخطيط",icon:<BookOpen size={19}/>},
          {id:"market",label:"السوق",icon:<Store size={19}/>},
          {id:"rfq",label:"الطلبات",icon:<ClipboardList size={19}/>},
          {id:"community",label:"الزملاء",icon:<UsersRound size={19}/>},
          {id:"messages",label:"الرسائل",icon:<MessageCircle size={19}/>},
          {id:"prices",label:"الأسعار",icon:<BarChart3 size={19}/>},
          {id:"profile",label:"حسابي",icon:<CircleUserRound size={19}/>},
        ].map(tab=>(
          <button key={tab.id} type="button" aria-current={activeTab===tab.id?"page":undefined} onClick={()=>{setActiveTab(tab.id);if(tab.id==="prices")setSearch("");setSelectedProfile(null);setSelectedArticle(null)}} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-bold ${activeTab===tab.id&&!selectedProfile?"text-emerald-800":"text-slate-400 hover:text-slate-700"}`}>
            <span className="leading-none" aria-hidden="true">{tab.icon}</span>
            <span className={tab.id==="insights"?"w-12 text-center text-[8px] leading-[9px]":"text-center leading-tight"}>{tab.id==="insights"?<>الإرشاد<br/>والتخطيط</>:tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="min-w-0 flex-1 pb-20 lg:pb-0">
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
          <div className="max-w-[1200px] mx-auto px-4 h-[64px] flex items-center gap-4">
            <div className="flex-1 max-w-[520px] relative">
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={activeTab==="insights"?"ابحث عن مقال أو موضوع...":"ابحث عن محصول، مدينة، زميل..."} className="w-full h-11 pr-11 pl-4 bg-slate-50 border border-slate-200 rounded-full text-sm focus:bg-white focus:border-emerald-400 outline-none"/>
              <span className="absolute right-4 top-3 text-slate-400">🔍</span>
            </div>
            <div className="mr-auto flex items-center gap-2">
              <div className="relative">
                <button id="notif-bell" type="button" aria-label={`الإشعارات${unreadNotifications?`, ${unreadNotifications} غير مقروء`:''}`} aria-expanded={showNotifications} onClick={()=>setShowNotifications(!showNotifications)} className="relative w-11 h-11 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-600">
                  <Bell size={19}/>
                  {notifications.filter((n:any)=>!n.read).length>0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{notifications.filter((n:any)=>!n.read).length}</span>}
                </button>
                {showNotifications && (
                  <div id="notif-dropdown" className="absolute left-0 top-14 z-50 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-[20px] border border-slate-100 bg-white shadow-2xl">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-bold text-sm">الإشعارات</h3>
                      <div className="flex gap-2">
                        {unreadNotifications>0&&<button onClick={()=>setNotifications((prev:any)=>prev.map((n:any)=>({...n, read:true})))} className="text-[11px] text-emerald-600 font-bold">قراءة الكل</button>}
                        <button onClick={()=>setShowNotifications(false)} className="w-6 h-6 bg-slate-50 rounded-full text-xs">✕</button>
                      </div>
                    </div>
                    <div className="max-h-[min(65vh,560px)] overflow-y-auto">
                      {notifications.length===0?<p className="px-5 py-10 text-center text-sm text-slate-500">لا توجد إشعارات جديدة الآن.</p>:notifications.map((notif:any)=>(
                        <button type="button" key={notif.id} onClick={()=>openNotification(notif)} className={`w-full p-4 flex gap-3 text-right hover:bg-slate-50 border-b border-slate-50 ${!notif.read ? "bg-emerald-50/50" : ""}`}>
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-lg">{notif.icon||"🔔"}</div>
                          <div className="flex-1"><p className="text-[13px] font-bold">{notif.title}</p><p className="text-[12px] text-slate-600">{notif.body}</p><p className="text-[10px] text-slate-400">{notif.time}</p></div>
                          {!notif.read && <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></span>}
                        </button>
                      ))}
                    </div>
                    <div className="p-3 bg-slate-50">
                      <div className="flex gap-2">
                        {notifPermission!=="granted"&&<button onClick={requestNotifPermission} className="h-9 flex-1 bg-slate-900 text-white rounded-full text-xs font-bold">تفعيل إشعارات المتصفح 🔔</button>}
                        {notifications.length>0&&<button onClick={()=>{setNotifications([]);setShowNotifications(false)}} className="h-9 flex-1 bg-white border rounded-full text-xs font-bold text-rose-700">مسح الكل</button>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button type="button" onClick={()=>{setActiveTab("settings");setSelectedProfile(null);setShowNotifications(false)}} aria-label="الإعدادات" title="الإعدادات" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"><Settings size={18}/></button>
              <button type="button" onClick={handleLogout} aria-label="تسجيل الخروج" title="تسجيل الخروج" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-rose-50 hover:text-rose-700"><LogOut size={18}/></button>
            </div>
          </div>
          {activeTab==="market" && !selectedProfile && (
            <div className="max-w-[1200px] mx-auto px-4 py-2 flex gap-2 overflow-x-auto border-t border-slate-100">
              {MARKET_CATEGORIES.map(cat=>(
                <button key={cat} onClick={()=>setActiveCat(cat)} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border ${activeCat===cat ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"}`}>{cat}</button>
              ))}
            </div>
          )}
        </header>

        <div className="max-w-[1320px] mx-auto px-4 py-5 sm:px-6">
          {followListMode&&<div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 p-4" onClick={()=>setFollowListMode(null)}>
            <section role="dialog" aria-modal="true" aria-labelledby="follow-list-title" onClick={event=>event.stopPropagation()} className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
              <header className="flex items-center justify-between border-b border-slate-100 p-4"><h2 id="follow-list-title" className="font-extrabold text-slate-900">{followListMode==="followers"?"المهتمون بهذا الملف":"الزملاء المهتم بهم"}</h2><button onClick={()=>setFollowListMode(null)} aria-label="إغلاق" className="h-8 w-8 rounded-full bg-slate-100 text-slate-600">×</button></header>
              <div className="max-h-[60vh] overflow-y-auto p-3">
                {profileRelationshipList.length?profileRelationshipList.map((person:any)=><button key={person.id} onClick={()=>{setFollowListMode(null);setSelectedProfile(person)}} className="flex w-full items-center gap-3 rounded-xl p-3 text-right hover:bg-emerald-50"><img src={person.avatar||"https://i.pravatar.cc/100?img=12"} alt="" className="h-10 w-10 rounded-full object-cover"/><span className="min-w-0"><span className="block truncate text-sm font-bold text-slate-900">{person.name}</span><span className="block truncate text-xs text-slate-500">{person.specialty||person.city}</span></span></button>)
                  :<p className="p-8 text-center text-sm text-slate-500">لا توجد حسابات ضمن هذه القائمة حتى الآن.</p>}
              </div>
            </section>
          </div>}
          {selectedProfile ? (
            <section className="mx-auto max-w-[900px]">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="relative h-40 bg-slate-200 sm:h-52"><img src={selectedProfile.cover||"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"} alt="" className="h-full w-full object-cover"/></div>
                <div className="p-5 sm:p-7">
                  <div className="-mt-12 flex flex-wrap items-end gap-4">
                    <img src={selectedProfile.avatar} alt="" className="h-20 w-20 rounded-full border-4 border-white bg-white object-cover"/>
                    <div className="min-w-0 flex-1 pb-1"><h1 className="truncate text-2xl font-extrabold text-slate-900">{selectedProfile.name}</h1><p className="mt-1 text-sm text-slate-500">{selectedProfile.city||"مصر"} · {selectedProfile.specialty||"عضو في مجتمع ContCrops"}</p></div>
                    {selectedProfile.id!==currentUser?.id&&<button onClick={()=>toggleFollow(selectedProfile.id)} className="mb-1 rounded-full bg-emerald-800 px-4 py-2 text-xs font-bold text-white">{following.includes(selectedProfile.id)?"مهتم":"أبدي اهتمامي"}</button>}
                        <button onClick={()=>{openChatWith(selectedProfile);setSelectedProfile(null);setActiveTab("messages")}} className="mb-1 rounded-full border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-800"><MessageCircle size={15} className="ml-1 inline"/> رسالة</button>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{selectedProfile.bio||"عضو في مجتمع ContCrops الزراعي."}</p>
                  <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                    {[["مقالات",profileArticles.length],["محاصيل",profilePosts.length],["طلبات شراء",profileRFQs.length],["نقاشات",profileDiscussions.length]].map(([label,value])=><div key={label} className="rounded-xl bg-[#f6f8f4] p-3 text-center"><p className="text-xl font-extrabold text-slate-900">{value}</p><p className="mt-1 text-xs font-bold text-slate-500">{label}</p></div>)}
                    <button onClick={()=>setFollowListMode("followers")} className="rounded-xl bg-[#f6f8f4] p-3 text-center hover:bg-emerald-50"><p className="text-xl font-extrabold text-slate-900">{profileFollowers}</p><p className="mt-1 text-xs font-bold text-slate-500">مهتمون به</p></button>
                    <button onClick={()=>setFollowListMode("following")} className="rounded-xl bg-[#f6f8f4] p-3 text-center hover:bg-emerald-50"><p className="text-xl font-extrabold text-slate-900">{profileFollowing}</p><p className="mt-1 text-xs font-bold text-slate-500">مهتم بهم</p></button>
                  </div>
                  <button onClick={()=>setSelectedProfile(null)} className="mt-5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">← رجوع</button>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {profileArticles.map((article:any)=><article key={`profile-article-${article.id}`} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"><div className="flex gap-3"><img src={article.image} alt="" className="h-20 w-24 rounded-xl object-cover"/><div className="min-w-0 flex-1"><p className="text-[11px] font-bold text-emerald-800">{article.category} · {article.date}</p><button onClick={()=>{setSelectedProfile(null);setSelectedArticle(article);setActiveTab("insights")}} className="mt-1 text-right text-base font-extrabold text-slate-900 hover:text-emerald-800">{article.title}</button><div className="mt-3 flex gap-4 text-xs text-slate-500"><button onClick={()=>shareArticle(article)} className="inline-flex items-center gap-1 hover:text-emerald-800"><Share2 size={14}/> مشاركة</button><button onClick={()=>{setSelectedProfile(null);setSelectedArticle(article);setActiveTab("insights");setArticleCommentsOpen(article.id)}} className="inline-flex items-center gap-1 hover:text-emerald-800"><MessageCircle size={14}/> {(article.commentsList||[]).length} تعليق</button></div></div></div></article>)}
                {profilePosts.map((crop:any)=><button key={`profile-crop-${crop.id}`} onClick={()=>{setSelectedProfile(null);setSearch(crop.name);setActiveTab("market")}} className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-right hover:border-emerald-200"><p className="text-xs font-bold text-emerald-800">محصول · {crop.category}</p><h2 className="mt-1 font-extrabold text-slate-900">{crop.name}</h2><p className="mt-1 text-xs text-slate-500">{crop.city} · {crop.price} · {crop.qty}</p><span className="mt-2 block text-xs font-bold text-emerald-800">عرض في السوق ←</span></button>)}
                {profileRFQs.map((rfq:any)=><button key={`profile-rfq-${rfq.id}`} onClick={()=>{setSelectedProfile(null);setSearch(rfq.title);setActiveTab("rfq")}} className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-right hover:border-emerald-200"><p className="text-xs font-bold text-emerald-800">طلب شراء · {rfq.quantity}</p><h2 className="mt-1 font-extrabold text-slate-900">{rfq.title}</h2><p className="mt-1 text-xs text-slate-500">{rfq.location} · {rfq.deadline}</p><span className="mt-2 block text-xs font-bold text-emerald-800">عرض في الطلبات ←</span></button>)}
                {profileDiscussions.map((discussion:any)=><article key={`profile-discussion-${discussion.id}`} className="rounded-2xl border border-slate-200 bg-white p-4 text-right hover:border-emerald-200"><p className="text-xs font-bold text-emerald-800">نقاش مجتمعي · {discussion.time}</p><p className="mt-2 text-sm leading-6 text-slate-700">{discussion.text}</p><div className="mt-3 flex items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500"><button onClick={()=>{setSelectedProfile(null);setActiveTab("discussions");setDiscussionCommentsOpen(discussion.id)}} className="font-bold hover:text-emerald-800">عرض النقاش ←</button><button onClick={()=>setDiscussionCommentsOpen(discussionCommentsOpen===discussion.id?null:discussion.id)} className="inline-flex items-center gap-1 hover:text-emerald-800"><MessageCircle size={14}/>{(discussion.commentsList||[]).length} تعليق</button></div>{discussionCommentsOpen===discussion.id&&<div className="mt-3 space-y-2 border-t border-slate-100 pt-3">{(discussion.commentsList||[]).length?(discussion.commentsList||[]).map((comment:any,index:number)=><p key={comment.id||`${discussion.id}-${index}`} className="rounded-xl bg-slate-50 p-3 text-xs"><b>{comment.name}</b><span className="mr-2 text-slate-600">{comment.text}</span></p>):<p className="text-xs text-slate-500">لا توجد تعليقات بعد، ابدأ النقاش.</p>}<div className="flex gap-2"><input value={discussionCommentDrafts[String(discussion.id)]||""} onChange={event=>setDiscussionCommentDrafts(prev=>({...prev,[String(discussion.id)]:event.target.value}))} placeholder="اكتب تعليقًا..." className="h-9 min-w-0 flex-1 rounded-full border border-slate-200 px-3 text-xs"/><button onClick={()=>addDiscussionComment(discussion.id)} className="rounded-full bg-emerald-800 px-3 text-xs font-bold text-white">إرسال</button></div></div>}</article>)}
                {!profileArticles.length&&!profilePosts.length&&!profileRFQs.length&&!profileDiscussions.length&&<div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">لا توجد منشورات عامة لهذا العضو حتى الآن.</div>}
              </div>
            </section>
          ) : (
            <>
              {activeTab==="insights" && (
                <div className="mx-auto grid max-w-[1180px] gap-10 xl:grid-cols-[minmax(0,700px)_280px]">
                  <section className="min-w-0">
                    {selectedArticle ? (
                      <article className="mx-auto max-w-[700px]">
                        <button onClick={()=>setSelectedArticle(null)} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-800">→ العودة إلى المقالات</button>
                        <img src={selectedArticle.image} alt="" className="mb-7 h-64 w-full rounded-3xl object-cover sm:h-[360px]"/>
                        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">{selectedArticle.category}</span>
                        <h1 className="mt-5 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">{selectedArticle.title}</h1>
                        <p className="mt-4 text-lg leading-8 text-slate-500">{selectedArticle.excerpt}</p>
                        <div className="mt-6 flex flex-wrap items-center gap-3 border-b border-slate-200 pb-5">
                          <img src={selectedArticle.avatar} alt="" className="h-11 w-11 rounded-full object-cover"/>
                          <div className="flex-1"><button onClick={()=>openProfileFromContent(selectedArticle,"article")} className="text-sm font-extrabold text-slate-800 hover:text-emerald-800">{selectedArticle.author}</button><p className="mt-1 text-xs text-slate-500">{selectedArticle.date} · {selectedArticle.readTime} دقائق قراءة</p></div>
                          <button onClick={()=>toggleArticleLike(selectedArticle.id)} className={`rounded-full border px-4 py-2 text-sm font-bold ${selectedArticle.liked?"border-emerald-300 text-emerald-800":"border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-800"}`}>👏 {selectedArticle.likes}</button>
                          <button onClick={()=>toggleSavedArticle(selectedArticle.id)} aria-label={savedArticles.some(id=>String(id)===String(selectedArticle.id))?"إزالة المقال من المحفوظات":"حفظ المقال"} className={`h-10 w-10 rounded-full border ${savedArticles.some(id=>String(id)===String(selectedArticle.id))?"border-emerald-200 bg-emerald-50 text-emerald-800":"border-slate-200 text-slate-500 hover:text-emerald-800"}`}><Bookmark size={17} className={savedArticles.some(id=>String(id)===String(selectedArticle.id))?"fill-current":""}/></button>
                        </div>
                        <div className="article-reading mx-auto max-w-[640px] py-7">
                          {selectedArticle.body.map((paragraph:string,index:number)=><p key={index} className="mb-6 text-[18px] leading-[2.1] text-slate-700">{paragraph}</p>)}
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-slate-200 py-5">
                          <span className="text-sm font-bold text-slate-500">هل وجدت هذا الدليل مفيدًا؟</span>
                          <button onClick={()=>toggleArticleLike(selectedArticle.id)} className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800 hover:bg-emerald-100">{selectedArticle.liked?"✓ شكرًا لتفاعلك":"👏 أقدر هذه القصة"}</button>
                        </div>
                        <div className="flex gap-5 py-4 text-sm text-slate-500">
                          <button onClick={()=>shareArticle(selectedArticle)} className="inline-flex items-center gap-2 hover:text-emerald-800"><Share2 size={17}/> مشاركة المقال</button>
                          <button onClick={()=>setArticleCommentsOpen(articleCommentsOpen===selectedArticle.id?null:selectedArticle.id)} className="inline-flex items-center gap-2 hover:text-emerald-800"><MessageCircle size={17}/> {(selectedArticle.commentsList||[]).length} تعليق</button>
                        </div>
                        {articleCommentsOpen===selectedArticle.id&&<div className="space-y-3 border-t border-slate-100 py-4">{(selectedArticle.commentsList||[]).map((comment:any)=><p key={comment.id} className="rounded-xl bg-slate-50 p-3 text-sm"><b>{comment.name}</b><span className="mr-2 text-slate-600">{comment.text}</span></p>)}<div className="flex gap-2"><input value={articleCommentDraft} onChange={event=>setArticleCommentDraft(event.target.value)} placeholder="اكتب تعليقك على المقال..." className="h-10 min-w-0 flex-1 rounded-full border border-slate-200 px-4 text-sm"/><button onClick={()=>addArticleComment(selectedArticle.id)} className="rounded-full bg-emerald-800 px-4 text-xs font-bold text-white">إرسال</button></div></div>}
                      </article>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-6">
                          <div>
                            <p className="text-sm font-bold text-emerald-800">ContCrops · المعرفة تنمو بالمشاركة</p>
                            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">أفكار وخبرات من أرض الواقع</h1>
                            <p className="mt-2 text-sm leading-6 text-slate-500">قصص عملية يكتبها المزارعون والخبراء لتساعد مجتمعنا الزراعي على النمو.</p>
                          </div>
                          <button onClick={()=>{setSelectedArticle(null);setActiveTab("write")}} className="h-10 rounded-full bg-[#1c5135] px-4 text-sm font-bold text-white hover:bg-[#143c27] xl:hidden">✎ اكتب مقالًا</button>
                        </div>
                        <div className="sticky top-16 z-30 -mx-4 bg-[#f7f8f3]/95 px-4 backdrop-blur sm:-mx-6 sm:px-6">
                          <div className="flex items-center gap-6 overflow-x-auto border-b border-slate-200 py-3 text-sm">
                            {[["for-you","لك"],["latest","الأحدث"],["saved",`المحفوظات (${savedArticles.length})`]].map(([id,label])=><button key={id} onClick={()=>{setArticleFeed(id as "for-you"|"latest"|"saved");setSelectedArticle(null)}} className={`whitespace-nowrap border-b-2 pb-2 font-bold ${articleFeed===id?"border-emerald-700 text-emerald-800":"border-transparent text-slate-400 hover:text-slate-700"}`}>{label}</button>)}
                          </div>
                          <div className="flex gap-2 overflow-x-auto py-4">
                            {["الكل",...Array.from(new Set(articles.map(a=>a.category)))].map(topic=><button key={topic} onClick={()=>setArticleTopic(topic)} className={`whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-bold ${articleTopic===topic?"bg-[#1c5135] text-white":"bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-emerald-300"}`}>{topic}</button>)}
                          </div>
                        </div>
                        <div className="divide-y divide-slate-200">
                          {filteredArticles.length===0 && <div className="py-14 text-center"><p className="font-extrabold text-slate-800">{articleFeed==="saved"?"لا توجد مقالات محفوظة بعد":"لا توجد مقالات مطابقة"}</p><p className="mt-2 text-sm text-slate-500">{articleFeed==="saved"?"احفظ المقالات لتعود إليها وقتما تشاء.":"جرّب موضوعًا أو كلمة بحث أخرى."}</p></div>}
                          {filteredArticles.map((article,index)=>(
                            <article key={article.id} className={`flex gap-4 py-6 sm:gap-6 ${index===0?"flex-col-reverse sm:flex-row":"items-center"}`}>
                              <div className="min-w-0 flex-1">
                                <button onClick={()=>setSelectedArticle(article)} className="block text-right">
                                  <span className="mb-2 block text-[11px] font-bold text-emerald-800">{article.category}</span>
                                  <h2 className={`${index===0?"text-2xl sm:text-[28px]":"text-lg sm:text-xl"} font-extrabold leading-snug text-slate-900 hover:text-emerald-800`}>{article.title}</h2>
                                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{article.excerpt}</p>
                                </button>
                                <div className="mt-4 flex items-center gap-2">
                                  <img src={article.avatar} alt="" className="h-7 w-7 rounded-full object-cover"/>
                                  <button onClick={()=>openProfileFromContent(article,"article")} className="text-xs font-bold text-slate-700 hover:text-emerald-800">{article.author}</button>
                                  <span className="text-xs text-slate-400">· {article.date} · {article.readTime} د قراءة</span>
                                  <button onClick={()=>toggleSavedArticle(article.id)} aria-label={savedArticles.some(id=>String(id)===String(article.id))?"إزالة المقال من المحفوظات":"حفظ المقال"} className={`mr-auto inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs hover:bg-emerald-50 hover:text-emerald-800 ${savedArticles.some(id=>String(id)===String(article.id))?"text-emerald-800":"text-slate-400"}`}><Bookmark size={14} className={savedArticles.some(id=>String(id)===String(article.id))?"fill-current":""}/>{savedArticles.some(id=>String(id)===String(article.id))?"محفوظ":"حفظ"}</button>
                                </div>
                                <div className="mt-3 flex gap-5 border-t border-slate-100 pt-3 text-xs text-slate-500">
                                  <button onClick={()=>shareArticle(article)} className="inline-flex items-center gap-1.5 hover:text-emerald-800"><Share2 size={15}/> مشاركة</button>
                                  <button onClick={()=>setArticleCommentsOpen(articleCommentsOpen===article.id?null:article.id)} className="inline-flex items-center gap-1.5 hover:text-emerald-800"><MessageCircle size={15}/> {(article.commentsList||[]).length} تعليق</button>
                                </div>
                                {articleCommentsOpen===article.id&&<div className="mt-3 space-y-2">{(article.commentsList||[]).map((comment:any)=><p key={comment.id} className="rounded-xl bg-slate-50 p-3 text-xs"><b>{comment.name}</b><span className="mr-2 text-slate-600">{comment.text}</span></p>)}<div className="flex gap-2"><input value={articleCommentDraft} onChange={event=>setArticleCommentDraft(event.target.value)} placeholder="اكتب تعليقًا..." className="h-9 min-w-0 flex-1 rounded-full border border-slate-200 px-3 text-xs"/><button onClick={()=>addArticleComment(article.id)} className="rounded-full bg-emerald-800 px-3 text-xs font-bold text-white">إرسال</button></div></div>}
                              </div>
                              <button onClick={()=>setSelectedArticle(article)} aria-label={`اقرأ ${article.title}`} className={`shrink-0 overflow-hidden rounded-2xl bg-slate-100 ${index===0?"h-48 w-full sm:h-48 sm:w-52":"h-24 w-28 sm:h-28 sm:w-36"}`}>
                                <img src={article.image} alt="" className="h-full w-full object-cover transition duration-300 hover:scale-105"/>
                              </button>
                            </article>
                          ))}
                        </div>
                      </>
                    )}
                  </section>
                  <aside className="hidden xl:block">
                    <div className="sticky top-28 space-y-7">
                      <section className="rounded-2xl border border-emerald-100 bg-[#f0f6ee] p-5">
                        <span className="text-2xl" aria-hidden="true">✍️</span>
                        <h2 className="mt-3 font-extrabold text-slate-900">خبرتك تستحق أن تُروى</h2>
                        <p className="mt-2 text-xs leading-6 text-slate-600">شارك تجربتك أو اكتب دليلًا يساعد مزارعًا آخر في موسمه.</p>
                        <button onClick={()=>{setSelectedArticle(null);setActiveTab("write")}} className="mt-4 h-10 w-full rounded-full bg-[#1c5135] text-sm font-bold text-white hover:bg-[#143c27]">ابدأ الكتابة</button>
                      </section>
                      <section>
                        <h2 className="text-sm font-extrabold text-slate-900">مواضيع تهمّك</h2>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {["إرشاد زراعي","دليل عملي","التصدير","الري","ما بعد الحصاد"].map(topic=><button key={topic} onClick={()=>{setArticleTopic(articles.some(a=>a.category===topic)?topic:"الكل");setArticleFeed("for-you")}} className="rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-600 ring-1 ring-slate-200 hover:text-emerald-800">{topic}</button>)}
                        </div>
                      </section>
                      <section className="border-t border-slate-200 pt-5">
                        <h2 className="text-sm font-extrabold text-slate-900">كتّاب من مجتمعنا</h2>
                        <div className="mt-4 space-y-4">
                          {colleagues.slice(0,3).map(col=><div key={col.id} className="flex items-center gap-2.5"><button onClick={()=>setSelectedProfile(col)} className="shrink-0"><img src={col.avatar} alt="" className="h-9 w-9 rounded-full object-cover"/></button><button onClick={()=>setSelectedProfile(col)} className="min-w-0 flex-1 text-right"><p className="truncate text-xs font-extrabold">{col.name}</p><p className="truncate text-[10px] text-slate-500">{col.specialty} · {col.city}</p></button><button onClick={()=>toggleFollow(col.id)} className="text-[11px] font-bold text-emerald-800">{following.includes(col.id)?"مهتم":"أبدي اهتمامي"}</button></div>)}
                        </div>
                      </section>
                      <p className="text-[10px] leading-5 text-slate-400">ContCrops مساحة للمعرفة الزراعية والتجارة العادلة بين أهل المجال.</p>
                    </div>
                  </aside>
                </div>
              )}
              {activeTab==="write" && (
                <section className="mx-auto max-w-[760px]">
                  <button onClick={()=>setActiveTab("insights")} className="mb-6 text-sm font-bold text-slate-500 hover:text-emerald-800">→ العودة إلى المقالات</button>
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
                    <p className="text-sm font-bold text-emerald-800">مساحة الكتابة · ContCrops</p>
                    <h1 className="mt-2 text-3xl font-extrabold text-slate-900">شارك خبرتك مع مجتمعك</h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500">اكتب تجربة أو إرشادًا عمليًا ليستفيد منه المزارعون والمهتمون بالقطاع.</p>
                    <div className="mt-8 space-y-5">
                      <label className="block"><span className="mb-2 block text-xs font-bold text-slate-600">موضوع المقال</span><select value={newArticle.category} onChange={e=>setNewArticle({...newArticle,category:e.target.value})} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm"><option>إرشاد زراعي</option><option>دليل عملي</option><option>التصدير</option><option>تجربة مزارع</option><option>أسواق ومحاصيل</option></select></label>
                      <label className="block"><span className="mb-2 block text-xs font-bold text-slate-600">عنوان واضح ومفيد</span><input value={newArticle.title} onChange={e=>setNewArticle({...newArticle,title:e.target.value})} maxLength={120} placeholder="مثال: كيف أجهز محصولي للسوق؟" className="h-14 w-full rounded-xl border border-slate-200 px-4 text-lg font-bold outline-none focus:border-emerald-500"/></label>
                      <label className="block"><span className="mb-2 block text-xs font-bold text-slate-600">محتوى المقال</span><textarea value={newArticle.body} onChange={e=>setNewArticle({...newArticle,body:e.target.value})} maxLength={10000} placeholder="اكتب خبرتك بالتفصيل... اترك سطرًا جديدًا بين الفقرات." className="min-h-[300px] w-full resize-y rounded-xl border border-slate-200 p-4 text-base leading-8 outline-none focus:border-emerald-500"/></label>
                      <div className="flex items-center justify-between gap-3"><span className="text-xs text-slate-400">{newArticle.body.length}/10000 حرف</span><button onClick={publishArticle} disabled={!newArticle.title.trim()||!newArticle.body.trim()} className="h-11 rounded-full bg-[#1c5135] px-6 text-sm font-extrabold text-white hover:bg-[#143c27] disabled:cursor-not-allowed disabled:bg-slate-300">نشر المقال</button></div>
                    </div>
                  </div>
                </section>
              )}
              {activeTab==="rfq" && (
                <section className="mx-auto max-w-[900px]">
                  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
                    <div><p className="text-sm font-bold text-emerald-800">فرص وشراكات تجارية</p><h1 className="mt-1 text-3xl font-extrabold text-slate-900">طلبات الشراء</h1><p className="mt-2 text-sm text-slate-500">طلبات مباشرة من تجار ومصانع ومصدرين تبحث عن المنتج المناسب.</p></div>
                    <button onClick={()=>setShowRFQForm(prev=>!prev)} className="h-11 rounded-full bg-[#1c5135] px-5 text-sm font-bold text-white hover:bg-[#143c27]">{showRFQForm?"إغلاق":"＋ أضف طلب شراء"}</button>
                  </div>
                  {showRFQForm && <div className="mt-5 rounded-2xl border border-emerald-100 bg-white p-5"><h2 className="font-extrabold">ما المحصول الذي تبحث عنه؟</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><input value={newRFQ.title} onChange={e=>setNewRFQ({...newRFQ,title:e.target.value})} placeholder="وصف الطلب أو المحصول" className="h-11 rounded-xl border px-4 text-sm sm:col-span-2"/><input value={newRFQ.quantity} onChange={e=>setNewRFQ({...newRFQ,quantity:e.target.value})} placeholder="الكمية المطلوبة" className="h-11 rounded-xl border px-4 text-sm"/><input value={newRFQ.location} onChange={e=>setNewRFQ({...newRFQ,location:e.target.value})} placeholder="مكان التسليم" className="h-11 rounded-xl border px-4 text-sm"/></div><button onClick={createRFQ} className="mt-4 h-10 rounded-full bg-emerald-700 px-5 text-sm font-bold text-white hover:bg-emerald-800">نشر الطلب</button></div>}
                  <div className="sticky top-16 z-30 -mx-4 mt-5 flex gap-2 overflow-x-auto bg-[#f7f8f3]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6" role="group" aria-label="تصفية طلبات الشراء">{["الكل",...Array.from(new Set(rfqs.map(rfq=>rfq.category)))].map(category=><button key={category} onClick={()=>setRfqCategory(category)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${rfqCategory===category?"bg-emerald-800 text-white":"border border-slate-200 bg-white text-slate-600 hover:border-emerald-300"}`}>{category}</button>)}</div>
                  <div className="mt-5 space-y-4">{filteredRfqs.map(rfq=><article id={`rfq-${rfq.id}`} key={rfq.id} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-200 hover:shadow-md sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3"><div><span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-800">{rfq.category}</span><h2 className="mt-3 text-lg font-extrabold text-slate-900">{rfq.title}</h2><button onClick={()=>openProfileFromContent(rfq,"rfq")} className="mt-1 text-sm text-slate-500 hover:text-emerald-800">{rfq.buyer}</button></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${rfq.closed?"bg-slate-100 text-slate-500":"bg-amber-50 text-amber-800"}`}>{rfq.closed?"مغلق":"مفتوح للعروض"}</span></div>
                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500"><span>📦 الكمية: <b className="text-slate-700">{rfq.quantity}</b></span><span>📍 {rfq.location}</span><span>◷ {rfq.deadline}</span>{rfq.ownerId===currentUser?.id?<button onClick={()=>setRfqs(prev=>prev.map(item=>item.id===rfq.id?{...item,closed:!item.closed}:item))} className="mr-auto font-bold text-slate-600 hover:text-slate-900">{rfq.closed?"إعادة فتح الطلب":"إغلاق الطلب"}</button>:<button disabled={rfq.closed} onClick={()=>offerOnRFQ(rfq)} className="mr-auto font-bold text-emerald-800 hover:text-emerald-950 disabled:cursor-not-allowed disabled:text-slate-400">قدّم عرضك ←</button>}</div>
                    <div className="mt-4 flex gap-5 border-t border-slate-100 pt-3 text-xs text-slate-500"><button onClick={()=>shareContent(`طلب شراء: ${rfq.title}`,`${window.location.origin}/?rfq=${encodeURIComponent(rfq.id)}`)} className="inline-flex items-center gap-1.5 hover:text-emerald-800"><Share2 size={15}/> مشاركة</button><button onClick={()=>setRfqCommentsOpen(rfqCommentsOpen===rfq.id?null:rfq.id)} className="inline-flex items-center gap-1.5 hover:text-emerald-800"><MessageCircle size={15}/> {(rfq.comments||[]).length} تعليق</button></div>
                    {rfqCommentsOpen===rfq.id&&<div className="mt-3 space-y-2">{(rfq.comments||[]).map((comment:any)=><p key={comment.id} className="rounded-xl bg-slate-50 p-3 text-xs"><b>{comment.name}</b><span className="mr-2 text-slate-600">{comment.text}</span></p>)}<div className="flex gap-2"><input value={rfqCommentDrafts[rfq.id]||""} onChange={event=>setRfqCommentDrafts(prev=>({...prev,[rfq.id]:event.target.value}))} placeholder="اكتب تعليقًا على الطلب..." className="h-9 min-w-0 flex-1 rounded-full border border-slate-200 px-3 text-xs"/><button onClick={()=>addRFQComment(rfq.id)} className="rounded-full bg-emerald-800 px-3 text-xs font-bold text-white">إرسال</button></div></div>}
                  </article>)}{filteredRfqs.length===0&&<div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">لا توجد طلبات مطابقة لهذا البحث.</div>}</div>
                </section>
              )}
              {activeTab==="prices" && (
                <section className="mx-auto max-w-[1120px] space-y-6">
                  <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-l from-[#153d2a] via-[#1c5135] to-[#2e7650] p-6 text-white shadow-lg sm:p-9">
                    <div className="absolute -left-12 -top-16 h-64 w-64 rounded-full border border-white/10"></div>
                    <div className="relative flex flex-wrap items-end justify-between gap-5">
                      <div><span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-emerald-100"><BarChart3 size={15}/> نبض السوق الزراعي</span><h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">لوحة الأسعار</h1><p className="mt-2 max-w-xl text-sm leading-6 text-white/75">مؤشرات استرشادية من عروض المحاصيل المنشورة على ContCrops، مرتبة حسب نوع السوق والمحصول.</p></div>
                      <button onClick={()=>{setActiveTab("market");setActiveCat("الكل")}} className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-emerald-900 hover:bg-emerald-50"><Store size={16} className="ml-2 inline"/> استكشف السوق</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {[{label:"عروض متاحة",value:crops.length,icon:<Package size={19}/>,note:"منشور في المنصة"},{label:"محاصيل ببيانات سعر",value:priceRows.length,icon:<Leaf size={19}/>,note:"بعد اختيار السوق والبحث"},{label:"مناطق التوريد",value:new Set(crops.map(crop=>crop.city).filter(Boolean)).size,icon:<MapPin size={19}/>,note:"مدينة ومحافظة"}].map(stat=><div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">{stat.icon}</span><span><span className="block text-xs font-bold text-slate-500">{stat.label}</span><span className="mt-1 block text-2xl font-extrabold text-slate-900">{stat.value}</span></span></div><p className="mt-3 text-[11px] text-slate-400">{stat.note}</p></div>)}
                  </div>
                  <div className="sticky top-16 z-30 -mx-4 flex gap-2 overflow-x-auto bg-[#f7f8f3]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6" role="group" aria-label="تصفية لوحة الأسعار">{MARKET_CATEGORIES.map(category=><button key={category} onClick={()=>setPricesCategory(category)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold ${pricesCategory===category?"bg-emerald-800 text-white":"border border-slate-200 bg-white text-slate-600 hover:border-emerald-300"}`}>{category}</button>)}</div>
                  {priceRows.length>0&&<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{priceRows.slice(0,3).map(row=><article key={`${row.name}-${row.category}-${row.unit}`} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-800">{row.category}</span><h2 className="mt-3 text-base font-extrabold text-slate-900">{row.name}</h2></div><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-50 text-lime-800"><TrendingUp size={18}/></span></div><p className="mt-4 text-2xl font-extrabold text-emerald-800">{row.average===null?row.latest.price:`${new Intl.NumberFormat("ar-EG",{maximumFractionDigits:2}).format(row.average)} ${row.unit||""}`}</p><p className="mt-1 text-xs text-slate-500">{row.offers.length>1?`متوسط ${row.offers.length} عروض منشورة`:"سعر العرض المنشور"} · {row.latest.city||"الموقع غير محدد"}</p></article>)}</div>}
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5"><div><h2 className="font-extrabold text-slate-900">أسعار وعروض السوق</h2><p className="mt-1 text-xs text-slate-500">الأسعار المعروضة مأخوذة من منشورات الأعضاء وليست تسعيرة رسمية.</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">{priceRows.length} صنف</span></div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[720px] text-right text-sm">
                        <thead className="bg-[#f8faf7] text-[11px] font-bold text-slate-500"><tr><th className="px-5 py-3">المحصول / الصنف</th><th className="px-5 py-3">السوق</th><th className="px-5 py-3">السعر الاسترشادي</th><th className="px-5 py-3">النطاق المسجل</th><th className="px-5 py-3">العروض</th><th className="px-5 py-3">الموقع</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                          {priceRows.map(row=><tr key={`${row.name}-${row.category}-${row.unit}`} className="hover:bg-emerald-50/40"><td className="px-5 py-4"><button onClick={()=>{setSearch(row.name);setActiveTab("market")}} className="text-right font-extrabold text-slate-900 hover:text-emerald-800">{row.name}</button></td><td className="px-5 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{row.category}</span></td><td className="px-5 py-4 font-extrabold text-emerald-800">{row.average===null?row.latest.price:`${new Intl.NumberFormat("ar-EG",{maximumFractionDigits:2}).format(row.average)} ${row.unit||""}`}</td><td className="px-5 py-4 text-xs text-slate-500">{row.min===null?"—":`${new Intl.NumberFormat("ar-EG",{maximumFractionDigits:2}).format(row.min)} – ${new Intl.NumberFormat("ar-EG",{maximumFractionDigits:2}).format(row.max)} ${row.unit||""}`}</td><td className="px-5 py-4 text-slate-600">{row.offers.length}</td><td className="px-5 py-4 text-xs text-slate-600"><MapPin size={13} className="ml-1 inline text-slate-400"/>{row.latest.city||"غير محدد"}</td></tr>)}
                        </tbody>
                      </table>
                      {priceRows.length===0&&<div className="px-6 py-14 text-center"><Search size={28} className="mx-auto text-slate-300"/><h3 className="mt-3 font-extrabold text-slate-800">لا توجد عروض أسعار مطابقة</h3><p className="mt-1 text-sm text-slate-500">غيّر السوق المختار أو جرّب البحث باسم محصول أو مدينة.</p><button onClick={()=>{setPricesCategory("الكل");setSearch("")}} className="mt-4 rounded-full bg-emerald-800 px-4 py-2 text-xs font-bold text-white">عرض كل الأسواق</button></div>}
                    </div>
                  </div>
                </section>
              )}
              {activeTab==="market" && (
                <div className="space-y-6">
                  <section className="relative overflow-hidden rounded-[28px] bg-[#153d2a] px-6 py-7 text-white shadow-lg shadow-emerald-950/10 sm:px-9 sm:py-9">
                    <div className="absolute inset-0 opacity-25" style={{backgroundImage:"linear-gradient(90deg, #153d2a 0%, transparent 100%), url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80)",backgroundSize:"cover",backgroundPosition:"center"}}></div>
                    <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                      <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-emerald-100"><span className="h-2 w-2 rounded-full bg-lime-300"></span>سوق المزارعين</span>
                        <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">محاصيل طازجة، <span className="text-lime-200">من أهل الأرض</span></h1>
                        <p className="mt-2 max-w-xl text-sm leading-7 text-white/75">اكتشف المنتجات المتاحة وتواصل مباشرة مع أصحابها لعقد صفقات أوضح وأقرب.</p>
                      </div>
                      <button onClick={()=>setActiveTab("add")} className="h-12 shrink-0 rounded-xl bg-lime-300 px-5 font-extrabold text-emerald-950 shadow-md hover:-translate-y-0.5 hover:bg-lime-200">＋ أضف محصولك</button>
                    </div>
                  </section>
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900">معروضات السوق</h2>
                      <p className="mt-1 text-xs text-slate-500">تصفّح أحدث المحاصيل المعروضة للبيع</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-500 ring-1 ring-slate-200">{filteredCrops.length} محصول</span>
                  </div>
                  {filteredCrops.length>0 ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {filteredCrops.map(c=><CropCard key={c.id} crop={c} onProfileClick={setSelectedProfile} onLike={toggleLike} onComments={toggleComments} onShare={handleShare} newComment={newComment} setNewComment={setNewComment} onAddComment={addComment} colleagues={colleagues}/>)}
                    </div>
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                      <span className="text-3xl" aria-hidden="true">🌱</span>
                      <h3 className="mt-3 font-extrabold text-slate-800">لا توجد نتائج مطابقة</h3>
                      <p className="mt-1 text-sm text-slate-500">جرّب تغيير كلمة البحث أو اختيار تصنيف آخر.</p>
                      <button onClick={()=>{setSearch("");setActiveCat("الكل")}} className="mt-4 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100">عرض كل المحاصيل</button>
                    </div>
                  )}
                  <section className="space-y-4 border-t border-slate-200 pt-6">
                    <div className="flex items-end justify-between gap-3"><div><h2 className="text-xl font-extrabold text-slate-900">مقالات وخبرات المزارعين</h2><p className="mt-1 text-xs text-slate-500">المعرفة جزء من السوق؛ اقرأ وشارك الخبرات الزراعية.</p></div><button onClick={()=>setActiveTab("insights")} className="text-xs font-bold text-emerald-800">كل المقالات ←</button></div>
                    <div className="grid gap-4 md:grid-cols-2">{articles.slice(0,2).map(article=><article key={article.id} className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200 hover:shadow-sm"><div className="flex items-center gap-4"><img src={article.image} alt="" className="h-20 w-24 shrink-0 rounded-xl object-cover"/><div className="min-w-0"><span className="text-[10px] font-bold text-emerald-800">{article.category} · {article.readTime} د قراءة</span><button onClick={()=>{setSelectedArticle(article);setActiveTab("insights")}} className="mt-1 block text-right line-clamp-2 text-sm font-extrabold leading-5 text-slate-900 hover:text-emerald-800">{article.title}</button><button onClick={()=>openProfileFromContent(article,"article")} className="mt-1 text-[11px] text-slate-500 hover:text-emerald-800">{article.author}</button></div></div><div className="mt-3 flex gap-5 border-t border-slate-100 pt-3 text-xs text-slate-500"><button onClick={()=>shareArticle(article)} className="inline-flex items-center gap-1.5 hover:text-emerald-800"><Share2 size={15}/> مشاركة</button><button onClick={()=>{setSelectedArticle(article);setArticleCommentsOpen(article.id);setActiveTab("insights")}} className="inline-flex items-center gap-1.5 hover:text-emerald-800"><MessageCircle size={15}/> {(article.commentsList||[]).length} تعليق</button></div></article>)}</div>
                  </section>
                </div>
              )}
              {activeTab==="community" && (
                <section className="mx-auto max-w-[1120px]">
                  <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                    <div><p className="text-sm font-bold text-emerald-800">شبكتك الزراعية</p><h1 className="mt-1 text-3xl font-extrabold text-slate-900">الزملاء</h1><p className="mt-2 text-sm text-slate-500">اكتشف أهل المجال، واطّلع على خبراتهم ومنشوراتهم.</p></div>
                    <div className="flex gap-2">{([["all","كل الزملاء"],["interested","المهتم بهم"]] as const).map(([filter,label])=><button key={filter} onClick={()=>setColleagueFilter(filter)} className={`rounded-full px-4 py-2 text-xs font-bold ${colleagueFilter===filter?"bg-emerald-800 text-white":"bg-white text-slate-600 ring-1 ring-slate-200"}`}>{label}</button>)}</div>
                  </div>
                  {isSupabaseConfigured()&&currentUser?.provider!=="demo"&&!socialDataReady&&<p className="mb-4 text-xs text-slate-500">جارٍ مزامنة ملفات الزملاء والعلاقات...</p>}
                  {isSupabaseConfigured()&&currentUser?.provider!=="demo"&&socialDataReady&&!supabaseContentReady&&<p className="mb-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">تعذر إكمال مزامنة المحتوى. تأكد من تطبيق ملف ترحيل Supabase الجديد.</p>}
                  {filteredColleagues.length?(
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredColleagues.map(col=>{
                        const interestedInCol=visibleFollowRelationships.filter(item=>item.following_id===col.id).length
                        const colInterestedIn=visibleFollowRelationships.filter(item=>item.follower_id===col.id).length
                        return <article key={col.id} className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">
                          <button onClick={()=>setSelectedProfile(col)} className="flex w-full items-center gap-3 text-right">
                            <img src={col.avatar||"https://i.pravatar.cc/100?img=12"} alt="" className="h-12 w-12 rounded-full object-cover"/>
                            <span className="min-w-0"><span className="block truncate text-sm font-extrabold text-slate-900">{col.name}</span><span className="mt-1 block truncate text-xs text-slate-500">{col.city||"مصر"} · {col.specialty||"عضو في المجتمع الزراعي"}</span></span>
                          </button>
                          <p className="mt-3 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">{col.bio||"شارك خبرتك الزراعية وتعرّف على نشاط هذا الزميل."}</p>
                          <div className="mt-3 flex gap-4 text-[11px] text-slate-500">
                            <button onClick={()=>{setSelectedProfile(col);setFollowListMode("followers")}} className="hover:text-emerald-800"><b className="text-slate-800">{interestedInCol}</b> مهتم به</button>
                            <button onClick={()=>{setSelectedProfile(col);setFollowListMode("following")}} className="hover:text-emerald-800"><b className="text-slate-800">{colInterestedIn}</b> مهتم بهم</button>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <button onClick={()=>toggleFollow(col.id)} className={`flex-1 h-9 rounded-full text-xs font-bold ${following.includes(col.id)?"bg-slate-100 text-slate-700":"bg-slate-900 text-white"}`}>{following.includes(col.id)?<><Heart size={14} className="ml-1 inline fill-current"/>مهتم</>:"أبدي اهتمامي"}</button>
                            <button onClick={()=>{openChatWith(col);setActiveTab("messages")}} className="h-9 rounded-full border border-emerald-200 px-4 text-xs font-bold text-emerald-800 hover:bg-emerald-50">رسالة</button>
                          </div>
                        </article>
                      })}
                    </div>
                  ):<div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">{colleagueFilter==="interested"?"لم تبدِ اهتمامك بأي زميل بعد.":"لا توجد نتائج مطابقة للبحث."}</div>}
                </section>
              )}
              {activeTab==="messages" && (
                <section className="mx-auto max-w-[1100px]">
                  <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold text-emerald-800">تواصل مباشر وآمن</p><h1 className="mt-1 text-3xl font-extrabold text-slate-900">رسائلك</h1><p className="mt-2 text-sm text-slate-500">{messages.length} محادثات · {messages.reduce((sum:any,message:any)=>sum+(message.unread||0),0)} غير مقروءة</p></div><button onClick={()=>setActiveTab("community")} className="h-10 rounded-full bg-[#1c5135] px-4 text-sm font-bold text-white hover:bg-[#143c27]">＋ ابدأ محادثة</button></div>
                  <div className="grid h-[min(720px,calc(100dvh-230px))] min-h-[440px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[320px_minmax(0,1fr)]">
                    <aside className={`${mobileChatOpen?"hidden lg:flex":"flex"} min-h-0 flex-col border-l border-slate-200`}>
                      <div className="border-b border-slate-100 p-4">
                        <div className="relative"><input value={messageSearch} onChange={event=>setMessageSearch(event.target.value)} placeholder="ابحث في المحادثات..." className="h-10 w-full rounded-full bg-slate-100 px-4 pr-10 text-xs outline-none focus:ring-2 focus:ring-emerald-100"/><span className="absolute right-4 top-2.5 text-slate-400">⌕</span></div>
                        <div className="mt-3 flex gap-2">{([["all","الكل"],["unread","غير المقروء"]] as const).map(([filter,label])=><button key={filter} onClick={()=>setMessageFilter(filter)} className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${messageFilter===filter?"bg-emerald-800 text-white":"bg-slate-100 text-slate-600"}`}>{label}</button>)}</div>
                      </div>
                      <div className="min-h-0 flex-1 overflow-y-auto">
                        {visibleMessages.length===0?<div className="px-5 py-12 text-center"><span className="text-3xl">💬</span><p className="mt-3 text-sm font-extrabold text-slate-800">{messages.length?"لا توجد محادثات مطابقة":"ابدأ أول محادثة"}</p><p className="mt-1 text-xs text-slate-500">تواصل مع المزارعين وأصحاب المحاصيل.</p></div>:visibleMessages.map((message:any)=><button key={message.id} onClick={()=>{setActiveChat(message.index);setMobileChatOpen(true);setMessages(prev=>prev.map((item:any,index:number)=>index===message.index?{...item,unread:0}:item))}} className={`flex w-full items-center gap-3 border-b border-slate-100 p-4 text-right hover:bg-emerald-50/50 ${activeChat===message.index?"bg-emerald-50/70":""}`}><span className="relative"><img src={message.with.avatar} alt="" className="h-11 w-11 rounded-full object-cover"/><span className={`absolute bottom-0 left-0 h-3 w-3 rounded-full border-2 border-white ${message.with.online?"bg-emerald-500":"bg-slate-300"}`}></span></span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-extrabold text-slate-800">{message.with.name}</span><span className="shrink-0 text-[10px] text-slate-400">{message.time?"الآن":""}</span></span><span className="mt-1 block truncate text-xs text-slate-500">{message.last}</span></span>{message.unread>0&&<span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-700 px-1 text-[10px] font-bold text-white">{message.unread}</span>}</button>)}
                      </div>
                    </aside>
                    <div className={`${mobileChatOpen?"flex":"hidden lg:flex"} min-h-0 min-w-0 flex-col`}>
                      {messages[activeChat]?<>
                        <header className="flex items-center gap-3 border-b border-slate-100 px-4 py-3"><button onClick={()=>setMobileChatOpen(false)} className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 lg:hidden" aria-label="العودة لقائمة المحادثات">→</button><img src={messages[activeChat].with.avatar} alt="" className="h-10 w-10 rounded-full object-cover"/><div className="min-w-0"><p className="truncate text-sm font-extrabold text-slate-900">{messages[activeChat].with.name}</p><p className="mt-0.5 text-[11px] text-slate-500">{messages[activeChat].with.city} · {messages[activeChat].with.online?"متصل الآن":"عضو في مجتمع ContCrops"}</p></div><button onClick={()=>setSelectedProfile(messages[activeChat].with)} className="mr-auto rounded-full px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50">الملف الشخصي</button></header>
                        <div className="flex items-center gap-2 border-b border-slate-100 bg-[#fbfcfa] px-4 py-2 text-[11px] text-slate-500"><span className="text-emerald-700">🔒</span> حافظ على خصوصية بياناتك وتأكد من تفاصيل الصفقة قبل التحويل.</div>
                        <div className="flex-1 space-y-4 overflow-y-auto bg-[#f7f9f6] p-4 sm:p-6">
                          <div className="py-3 text-center text-[10px] font-bold text-slate-400">بداية المحادثة · تواصل تجاري زراعي</div>
                          {messages[activeChat].chat.map((message:any,index:number)=><div key={`${message.time||"msg"}-${index}`} className={`flex ${message.from==="me"?"justify-start":"justify-end"}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[75%] ${message.from==="me"?"rounded-tr-sm bg-emerald-800 text-white":"rounded-tl-sm border border-slate-100 bg-white text-slate-800"}`}>{message.text}<span className={`mt-1 block text-left text-[9px] ${message.from==="me"?"text-emerald-100/70":"text-slate-400"}`}>{message.time?new Date(message.time).toLocaleTimeString("ar-EG",{hour:"2-digit",minute:"2-digit"}):"الآن"}</span></div></div>)}
                          {messages[activeChat].chat.length===0&&<div className="mx-auto mt-10 max-w-xs rounded-2xl border border-slate-200 bg-white p-5 text-center"><p className="text-sm font-extrabold text-slate-800">ابدأ الحديث مع {messages[activeChat].with.name}</p><p className="mt-2 text-xs leading-5 text-slate-500">اسأل عن الكميات أو مواعيد التوريد أو تفاصيل المحصول.</p></div>}
                        </div>
                        <form onSubmit={event=>{event.preventDefault();sendChatMessage()}} className="flex items-center gap-2 border-t border-slate-100 bg-white p-3"><input value={chatInput} onChange={event=>setChatInput(event.target.value)} placeholder="اكتب رسالتك..." className="h-11 min-w-0 flex-1 rounded-full bg-slate-100 px-4 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-emerald-100"/><button type="submit" disabled={!chatInput.trim()} className="h-11 rounded-full bg-emerald-800 px-5 text-sm font-bold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-slate-300">إرسال <span aria-hidden="true">➤</span></button></form>
                      </>:<div className="flex flex-1 flex-col items-center justify-center p-6 text-center"><span className="text-5xl">🌿</span><h2 className="mt-4 text-lg font-extrabold text-slate-800">تواصل، تفاوض، واتفق بثقة</h2><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">اختر محادثة من القائمة أو ابدأ محادثة جديدة مع أحد الزملاء.</p><button onClick={()=>setActiveTab("community")} className="mt-5 rounded-full bg-emerald-800 px-5 py-2.5 text-sm font-bold text-white">استكشف الزملاء</button></div>}
                    </div>
                  </div>
                </section>
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
                    <article key={d.id} className={`bg-white rounded-[24px] border p-5 ${discussionCommentsOpen===d.id?"border-emerald-300 shadow-sm":"border-slate-100"}`}>
                      <div className="flex gap-3">
                        <button onClick={()=>setSelectedProfile(d.farmer)} aria-label={`عرض ملف ${d.farmer.name}`}><img src={d.farmer.avatar} alt="" className="w-10 h-10 rounded-full"/></button>
                        <div><button onClick={()=>setSelectedProfile(d.farmer)} className="text-sm font-bold hover:text-emerald-800">{d.farmer.name}</button><p className="text-xs text-slate-500">{d.time}</p></div>
                      </div>
                      <p className="mt-3 text-[14px] leading-6">{d.text}</p>
                      <div className="flex gap-4 mt-4 text-sm text-slate-500">
                        <button onClick={()=>{ setDiscussions(prev=> prev.map(x=> x.id===d.id ? {...x, liked:!x.liked, likes: x.liked ? x.likes-1 : x.likes+1} as any : x)) }} className="hover:text-slate-900">❤️ {d.likes}</button>
                        <button className="hover:text-slate-900">🔁 {d.reposts}</button>
                        <button onClick={()=>setDiscussionCommentsOpen(discussionCommentsOpen===d.id?null:d.id)} className="inline-flex items-center gap-1 hover:text-emerald-800"><MessageCircle size={15}/>{(d.commentsList||[]).length||d.comments||0} تعليق</button>
                      </div>
                      {discussionCommentsOpen===d.id&&<div className="mt-4 space-y-3 border-t border-slate-100 pt-4">{(d.commentsList||[]).length?(d.commentsList||[]).map((comment:any)=><p key={comment.id} className="rounded-xl bg-slate-50 p-3 text-sm"><b>{comment.name}</b><span className="mr-2 text-slate-600">{comment.text}</span></p>):<p className="text-xs text-slate-500">لا توجد تعليقات بعد، ابدأ النقاش.</p>}<div className="flex gap-2"><input value={discussionCommentDrafts[String(d.id)]||""} onChange={event=>setDiscussionCommentDrafts(prev=>({...prev,[String(d.id)]:event.target.value}))} onKeyDown={event=>{if(event.key==="Enter"){event.preventDefault();addDiscussionComment(d.id)}}} placeholder="اكتب تعليقك على المناقشة..." className="h-10 min-w-0 flex-1 rounded-full border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400"/><button onClick={()=>addDiscussionComment(d.id)} disabled={!(discussionCommentDrafts[String(d.id)]||"").trim()} className="rounded-full bg-emerald-800 px-4 text-xs font-bold text-white disabled:bg-slate-300">إرسال</button></div></div>}
                    </article>
                  ))}
                </div>
              )}
              {activeTab==="settings" && (
                <section className="mx-auto max-w-[760px]">
                  <div className="border-b border-slate-200 pb-5">
                    <p className="text-sm font-bold text-emerald-800">حسابك وتجربتك</p>
                    <h1 className="mt-1 text-3xl font-extrabold text-slate-900">الإعدادات</h1>
                    <p className="mt-2 text-sm text-slate-500">تعديل بيانات ملفك وإدارة تفضيلات الحساب والخصوصية.</p>
                  </div>
                  <div className="mt-5 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="flex items-center gap-4 p-5"><img src={currentUser?.avatar} alt="" className="h-12 w-12 rounded-full object-cover"/><div className="min-w-0 flex-1"><p className="truncate font-extrabold text-slate-900">{currentUser?.name}</p><p className="mt-1 truncate text-sm text-slate-500">{currentUser?.email}</p></div><button onClick={()=>{setActiveTab("profile");setSelectedProfile(null)}} className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">الملف الشخصي</button></div>
                    <div className="space-y-4 p-5">
                      <div className="flex items-center gap-2"><CircleUserRound size={18} className="text-emerald-800"/><h2 className="font-extrabold text-slate-900">تعديل الملف الشخصي</h2></div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="text-xs font-bold text-slate-600">الاسم<input value={profileDraft.name} onChange={event=>setProfileDraft({...profileDraft,name:event.target.value})} maxLength={80} className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal text-slate-900 outline-none focus:border-emerald-500"/></label>
                        <label className="text-xs font-bold text-slate-600">المدينة<input value={profileDraft.city} onChange={event=>setProfileDraft({...profileDraft,city:event.target.value})} maxLength={80} className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal text-slate-900 outline-none focus:border-emerald-500"/></label>
                        <label className="text-xs font-bold text-slate-600 sm:col-span-2">التخصص<input value={profileDraft.specialty} onChange={event=>setProfileDraft({...profileDraft,specialty:event.target.value})} maxLength={100} placeholder="مثل: خضروات، تصدير، إرشاد زراعي" className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal text-slate-900 outline-none focus:border-emerald-500"/></label>
                        <label className="text-xs font-bold text-slate-600 sm:col-span-2">نبذة<textarea value={profileDraft.bio} onChange={event=>setProfileDraft({...profileDraft,bio:event.target.value})} maxLength={400} rows={3} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal leading-6 text-slate-900 outline-none focus:border-emerald-500"/></label>
                        <label className="text-xs font-bold text-slate-600 sm:col-span-2">رابط صورة الملف<input type="url" value={profileDraft.avatar} onChange={event=>setProfileDraft({...profileDraft,avatar:event.target.value})} placeholder="https://..." className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal text-slate-900 outline-none focus:border-emerald-500"/></label>
                      </div>
                      <button onClick={saveProfileSettings} disabled={profileSaveBusy} className="rounded-full bg-emerald-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-60">{profileSaveBusy?"جارٍ الحفظ...":"حفظ التعديلات"}</button>
                    </div>
                    <label className="flex cursor-pointer items-center gap-4 p-5"><span className="flex-1"><span className="block text-sm font-extrabold text-slate-900">تفضيلات الإشعارات</span><span className="mt-1 block text-xs text-slate-500">إظهار الإشعارات داخل المنصة.</span></span><input type="checkbox" checked={settingsAlerts} onChange={event=>setSettingsAlerts(event.target.checked)} className="h-5 w-5 accent-emerald-700"/></label>
                    <div className="space-y-4 p-5">
                      <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-emerald-800"/><h2 className="font-extrabold text-slate-900">الخصوصية والسياسات</h2></div>
                      <p className="text-sm leading-6 text-slate-600">بيانات ملفك ومحتواك المنشور متاحة للزملاء لمساعدتهم على التعرف على نشاطك. بيانات الدخول خاصة بحسابك ولا تُعرض في ملفك العام.</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl bg-slate-50 p-4"><h3 className="text-sm font-extrabold text-slate-800">سياسة الخصوصية</h3><p className="mt-1 text-xs leading-5 text-slate-500">نستخدم بيانات الحساب لتشغيل الملف الشخصي والمحتوى والعلاقات داخل المنصة.</p></div>
                        <div className="rounded-xl bg-slate-50 p-4"><h3 className="text-sm font-extrabold text-slate-800">الاستخدام المسؤول</h3><p className="mt-1 text-xs leading-5 text-slate-500">انشر معلومات زراعية وتجارية دقيقة، واحمِ بياناتك المالية والشخصية أثناء التواصل.</p></div>
                      </div>
                    </div>
                    <button onClick={handleLogout} className="flex w-full items-center gap-3 p-5 text-right text-sm font-extrabold text-rose-700 hover:bg-rose-50"><LogOut size={18}/> تسجيل الخروج من هذا الحساب</button>
                  </div>
                </section>
              )}
              {activeTab==="profile" && (
                <section className="mx-auto max-w-[900px]">
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="relative h-40 bg-[linear-gradient(120deg,#16432e,#5e8c59)] sm:h-52"><div className="absolute inset-0 opacity-20" style={{backgroundImage:"url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80)",backgroundSize:"cover",backgroundPosition:"center"}}></div></div>
                    <div className="px-5 pb-6 sm:px-8">
                      <div className="-mt-10 flex flex-wrap items-end gap-4">
                        <img src={currentUser?.avatar} alt="" className="h-20 w-20 rounded-full border-4 border-white bg-white object-cover shadow-sm"/>
                        <div className="min-w-0 flex-1 pb-1"><h1 className="truncate text-2xl font-extrabold text-slate-900">{currentUser?.name}</h1><p className="mt-1 truncate text-sm text-slate-500">{currentUser?.email} · {currentUser?.city||"مصر"}</p></div>
                        <button onClick={()=>setActiveTab("settings")} className="mb-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"><Settings size={14} className="ml-1 inline"/>تعديل الملف</button>
                        <span className="mb-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">{currentUser?.provider==="demo"?"حساب تجريبي منفصل":"حساب موثّق"}</span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{currentUser?.bio||"أضف نبذة مختصرة عن خبرتك من الإعدادات."}</p>
                      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                        {[{label:"مقالاتي",value:myArticles.length,icon:<BookOpen size={18}/>,action:()=>setProfileContentTab("articles")},{label:"محاصيلي",value:myPosts.length,icon:<Sprout size={18}/>,action:()=>setProfileContentTab("crops")},{label:"طلباتي",value:myRFQs.length,icon:<ClipboardList size={18}/>,action:()=>setProfileContentTab("rfqs")},{label:"نقاشاتي",value:myDiscussions.length,icon:<MessageSquare size={18}/>,action:()=>setProfileContentTab("discussions")},{label:"مهتمون بي",value:ownFollowers,icon:<UsersRound size={18}/>,action:()=>setFollowListMode("followers")},{label:"مهتم بهم",value:ownFollowing,icon:<Heart size={18}/>,action:()=>setFollowListMode("following")}].map(stat=><button key={stat.label} onClick={stat.action} className="rounded-2xl bg-[#f6f8f4] p-3 text-right transition hover:bg-emerald-50"><span className="text-emerald-800">{stat.icon}</span><p className="mt-2 text-2xl font-extrabold text-slate-900">{stat.value}</p><p className="mt-1 text-xs font-bold text-slate-500">{stat.label}</p></button>)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-7 flex gap-5 overflow-x-auto border-b border-slate-200 text-sm">{([["all","كل نشاطي"],["articles","مقالاتي"],["crops","محاصيلي"],["rfqs","طلباتي"],["discussions","نقاشاتي"]] as const).map(([tab,label])=><button key={tab} onClick={()=>setProfileContentTab(tab)} className={`whitespace-nowrap border-b-2 pb-3 font-bold ${profileContentTab===tab?"border-emerald-700 text-emerald-800":"border-transparent text-slate-400"}`}>{label}</button>)}</div>
                  <div className="mt-4 divide-y divide-slate-200">
                    {(profileContentTab==="all"||profileContentTab==="articles")&&myArticles.map(article=><button key={`article-${article.id}`} onClick={()=>{setSelectedArticle(article);setActiveTab("insights")}} className="flex w-full items-center gap-4 py-5 text-right"><img src={article.image} alt="" className="h-20 w-24 rounded-xl object-cover"/><span className="min-w-0 flex-1"><span className="text-[11px] font-bold text-emerald-800">مقال · {article.category}</span><span className="mt-1 block font-extrabold text-slate-900">{article.title}</span><span className="mt-1 block text-xs text-slate-500">{article.date} · {article.readTime} دقائق قراءة</span></span><span className="text-slate-300">←</span></button>)}
                    {(profileContentTab==="all"||profileContentTab==="crops")&&myPosts.map((crop:any)=><button key={`crop-${crop.id}`} onClick={()=>setActiveTab("market")} className="flex w-full items-center gap-4 py-5 text-right"><img src={crop.img} alt="" className="h-20 w-24 rounded-xl object-cover"/><span className="min-w-0 flex-1"><span className="text-[11px] font-bold text-emerald-800">محصول معروض · {crop.category}</span><span className="mt-1 block font-extrabold text-slate-900">{crop.name}</span><span className="mt-1 block text-xs text-slate-500">{crop.price} · {crop.qty} · {crop.city}</span></span><span className="text-slate-300">←</span></button>)}
                    {(profileContentTab==="all"||profileContentTab==="rfqs")&&myRFQs.map((rfq:any)=><button key={`rfq-${rfq.id}`} onClick={()=>setActiveTab("rfq")} className="flex w-full items-center gap-4 py-5 text-right"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-xl">📋</span><span className="min-w-0 flex-1"><span className="text-[11px] font-bold text-emerald-800">طلب شراء · {rfq.quantity}</span><span className="mt-1 block font-extrabold text-slate-900">{rfq.title}</span><span className="mt-1 block text-xs text-slate-500">{rfq.location} · {rfq.deadline}</span></span><span className="text-slate-300">←</span></button>)}
                    {(profileContentTab==="all"||profileContentTab==="discussions")&&myDiscussions.map((discussion:any)=><button key={`discussion-${discussion.id}`} onClick={()=>setActiveTab("discussions")} className="flex w-full items-center gap-4 py-5 text-right"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800"><MessageSquare size={20}/></span><span className="min-w-0 flex-1"><span className="text-[11px] font-bold text-emerald-800">نقاش زراعي</span><span className="mt-1 block font-extrabold text-slate-900">{discussion.text}</span><span className="mt-1 block text-xs text-slate-500">{discussion.time}</span></span><span className="text-slate-300">←</span></button>)}
                    {((profileContentTab==="articles"&&myArticles.length===0)||(profileContentTab==="crops"&&myPosts.length===0)||(profileContentTab==="rfqs"&&myRFQs.length===0)||(profileContentTab==="discussions"&&myDiscussions.length===0)||(profileContentTab==="all"&&myArticles.length+myPosts.length+myRFQs.length+myDiscussions.length===0))&&<div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center"><span className="text-3xl">🌿</span><h2 className="mt-3 font-extrabold text-slate-800">ابدأ بإضافة أول محتوى لحسابك</h2><p className="mt-2 text-sm text-slate-500">مقالاتك ومحاصيلك وطلباتك ونقاشاتك ستظهر هنا وفي أقسام المنصة.</p><div className="mt-4 flex flex-wrap justify-center gap-2"><button onClick={()=>setActiveTab("write")} className="rounded-full bg-emerald-800 px-4 py-2 text-xs font-bold text-white">اكتب مقالًا</button><button onClick={()=>setActiveTab("add")} className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800">أضف محصولًا</button><button onClick={()=>setActiveTab("rfq")} className="rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800">أضف طلب شراء</button></div></div>}
                  </div>
                </section>
              )}
              {activeTab==="add" && (
                <div className="max-w-[720px] mx-auto bg-white rounded-2xl border border-slate-100 p-6">
                  <h2 className="font-bold text-lg mb-2">إضافة منشور جديد</h2>
                  <p className="text-xs text-slate-500 mb-6">{supabaseConnected ? "سيتم حفظه في Supabase ويظهر لكل المستخدمين ✅" : "Supabase غير متصل - سيتم الحفظ محلياً فقط ⚠️"}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <input value={newPost.name} onChange={e=>setNewPost({...newPost,name:e.target.value})} placeholder="اسم المحصول *" className="h-12 px-4 border rounded-xl"/>
                    <select value={newPost.category} onChange={e=>setNewPost({...newPost,category:e.target.value})} className="h-12 px-4 border rounded-xl">{CATS.map(c=><option key={c}>{c}</option>)}</select>
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
    <article className="crop-card overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/10">
      <div className="crop-card-image relative h-56 overflow-hidden bg-emerald-50">
        <img src={crop.img} alt={crop.name} className="h-full w-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/10"></div>
        <div className="absolute right-4 top-4 flex items-center gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-extrabold text-slate-700 shadow-sm">{crop.category}</span>
          {crop.verified && <span title="مزارع موثّق" className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-sm font-extrabold text-white shadow-sm">✓</span>}
        </div>
        <span className="absolute bottom-4 right-4 rounded-full border border-white/25 bg-slate-950/35 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">متاح الآن</span>
      </div>
      <div className="p-5">
        <button type="button" className="mb-3 flex max-w-full items-center gap-2 text-right" onClick={()=>onProfileClick && onProfileClick(farmer)}>
          <img src={farmer.avatar || crop.avatar} alt="" className="h-9 w-9 rounded-full border border-slate-100 object-cover"/>
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-extrabold text-slate-800">{crop.farmer}</span>
            <span className="mt-0.5 block truncate text-[11px] text-slate-500">📍 {crop.city}</span>
          </span>
        </button>
        <h3 className="text-lg font-extrabold text-slate-900">{crop.name}</h3>
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-[#f5f8f3] px-4 py-3">
          <div><p className="text-[10px] font-bold text-slate-500">السعر</p><p className="mt-0.5 text-sm font-extrabold text-emerald-800">{crop.price}</p></div>
          <div className="text-left"><p className="text-[10px] font-bold text-slate-500">الكمية المتاحة</p><p className="mt-0.5 text-sm font-extrabold text-slate-800">{crop.qty}</p></div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <button type="button" aria-label={`إعجاب بمحصول ${crop.name}`} onClick={()=>onLike(crop.id)} className={`${crop.liked?"text-rose-600":"hover:text-rose-600"} flex items-center gap-1.5 rounded-lg px-2 py-1 font-bold`}><span aria-hidden="true">{crop.liked?"♥":"♡"}</span>{crop.likes}</button>
          <button type="button" aria-label={`تعليقات ${crop.name}`} onClick={()=>onComments(crop.id)} className="flex items-center gap-1.5 rounded-lg px-2 py-1 hover:text-emerald-800"><span aria-hidden="true">💬</span>{crop.comments} تعليق</button>
          <button type="button" onClick={()=>onShare(crop.id)} className="flex items-center gap-1.5 rounded-lg px-2 py-1 font-bold hover:text-emerald-800"><span aria-hidden="true">↗</span> مشاركة</button>
        </div>
        {crop.showComments && (
          <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
            {crop.commentsList.map((cc:any,i:number)=><div key={i} className="rounded-xl bg-slate-50 px-3 py-2 text-[13px] leading-5"><b>{cc.name}:</b> {cc.text}</div>)}
            <div className="flex gap-2"><input value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="اكتب تعليقًا..." className="h-10 min-w-0 flex-1 rounded-full bg-slate-50 px-4 text-[13px] outline-none focus:ring-2 focus:ring-emerald-100"/><button onClick={()=>onAddComment(crop.id)} className="h-10 rounded-full bg-emerald-800 px-4 text-xs font-bold text-white hover:bg-emerald-900">إرسال</button></div>
          </div>
        )}
      </div>
    </article>
  )
}
