"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

const CROPS_MOCK = [
  {id:1, name:"طماطم بلدي", farmer:"أحمد المزارع", farmer_id:1, city:"المنصورة", price:"12 جنيه/ك", qty:"5 طن", category:"فريش", img:"https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600", avatar:"https://i.pravatar.cc/100?img=12", verified:true, likes:24, comments:5, desc:"طماطم بلدي طازجة من مزارع المنصورة، جودة عالية، بدون مبيدات. متاحة للتوصيل خلال 24 ساعة. الكمية 5 طن قابلة للزيادة."},
  {id:2, name:"مانجو عويس", farmer:"محمد الفكهاني", farmer_id:2, city:"الإسماعيلية", price:"35 جنيه/ك", qty:"2 طن", category:"فريش", img:"https://images.unsplash.com/photo-1553279768-865429fa0078?w=600", avatar:"https://i.pravatar.cc/100?img=15", verified:true, likes:42, comments:8, desc:"مانجو عويس إسماعيلية درجة أولى، طعم سكري، حجم كبير."},
  {id:3, name:"قمح مجفف", farmer:"حسن الحبوب", farmer_id:3, city:"الشرقية", price:"18 جنيه/ك", qty:"10 طن", category:"مجفف", img:"https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600", avatar:"https://i.pravatar.cc/100?img=20", verified:false, likes:18, comments:2, desc:"قمح مجفف على الشمس، نسبة رطوبة أقل من 12%."},
  {id:4, name:"خدمة نقل مبرد", farmer:"سعيد للنقل", farmer_id:4, city:"الفيوم", price:"4 جنيه/ك", qty:"20 طن", category:"نقل ولوجيستك", img:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600", avatar:"https://i.pravatar.cc/100?img=33", verified:true, likes:31, comments:4, desc:"خدمة نقل مبرد من الفيوم لجميع المحافظات، شاحنات مجهزة تبريد -18."},
]

const COLLEAGUES_MOCK = [
  {id:1, name:"أحمد المزارع", city:"المنصورة", crops:24, followers:120, following:80, rating:4.9, avatar:"https://i.pravatar.cc/100?img=12", specialty:"فريش", bio:"مزارع خضروات خبرة 15 سنة", cover:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"},
  {id:2, name:"محمد الفكهاني", city:"الإسماعيلية", crops:32, followers:210, rating:5.0, avatar:"https://i.pravatar.cc/100?img=15", specialty:"فريش", bio:"فواكه طازجة يوميا", cover:"https://images.unsplash.com/photo-1553279768-865429fa0078?w=800"},
  {id:3, name:"حسن الحبوب", city:"الشرقية", crops:12, followers:60, rating:4.7, avatar:"https://i.pravatar.cc/100?img=20", specialty:"مجفف", bio:"حبوب عالية الجودة", cover:"https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800"},
  {id:4, name:"سعيد للنقل", city:"الفيوم", crops:8, followers:45, rating:4.8, avatar:"https://i.pravatar.cc/100?img=33", specialty:"نقل ولوجيستك", bio:"خدمات نقل مبرد", cover:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"},
]

export default function CropDetailPage(){
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)
  const [cropData, setCropData] = useState(CROPS_MOCK.find(c=>c.id===id) || CROPS_MOCK[0])
  const [status, setStatus] = useState("MOCK")
  const farmer = COLLEAGUES_MOCK.find(f=>f.id===cropData.farmer_id) || COLLEAGUES_MOCK[0]
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(cropData.likes)
  const [toast, setToast] = useState("")
  const [newComment, setNewComment] = useState("")
  const [commentsList, setCommentsList] = useState([
    {id:1, name:"محمد", avatar:"https://i.pravatar.cc/100?img=8", text:"الجودة ممتازة، تعاملت معاه قبل كده", time:"منذ ساعتين"},
    {id:2, name:"فاطمة", avatar:"https://i.pravatar.cc/100?img=26", text:"لسه متاح؟", time:"منذ 3 ساعات"},
  ])

  useEffect(()=>{
    async function load(){
      if(!isSupabaseConfigured()){ setStatus("MOCK - بدون .env"); return }
      try{
        const { data } = await supabase.from("crops").select("*").eq("id", id).single()
        if(data){ setCropData(data as any); setLikes((data as any).likes||0); setStatus("مربوط ✅ Supabase") }
        else setStatus("MOCK - مش في DB")
      }catch{ setStatus("MOCK") }
    }
    load()
  },[id])

  const showToast = (msg:string)=>{ setToast(msg); setTimeout(()=>setToast(""),2500) }
  const handleContact = (e?:any)=>{
    if(e){ e.preventDefault(); e.stopPropagation(); }
    try{
      localStorage.setItem("contcrops_logged_in","true")
      localStorage.setItem("contcrops_chat_with", JSON.stringify(farmer))
      localStorage.setItem("contcrops_chat_crop", JSON.stringify(cropData))
    }catch{}
    router.push("/?chat="+farmer.id)
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-4 h-[64px] flex items-center gap-4">
          <Link href="/" className="h-9 px-4 bg-white border rounded-full text-sm font-bold flex items-center hover:bg-slate-50">← رجوع للسوق</Link>
          <button type="button" onClick={()=>router.push("/")} className="flex items-center gap-2 font-extrabold text-lg hover:opacity-80"><div className="w-8 h-8 rounded-lg bg-black text-emerald-500 flex items-center justify-center font-extrabold text-sm">C</div><div className="flex flex-col leading-none text-right"><span className="text-[15px]">ContCrops</span><span className="text-[8px] text-slate-500 font-bold">تواصل - تبادل - نمو مستدام</span></div></button><div className="hidden"><div className="flex items-center gap-2 font-extrabold text-lg">ContCrops <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full border">{status}</span></div>
          <div className="mr-auto flex gap-2">
            <button type="button" onClick={(e)=>{e.preventDefault(); e.stopPropagation(); navigator.clipboard.writeText(window.location.href); showToast("تم نسخ الرابط")}} className="h-9 px-4 bg-slate-50 border rounded-full text-sm">↗️ مشاركة</button>
            <button type="button" onClick={(e)=>{e.preventDefault(); e.stopPropagation(); setLiked(!liked); setLikes(liked?likes-1:likes+1)}} className={`h-9 px-4 rounded-full text-sm font-bold ${liked?"bg-red-50 text-red-500 border border-red-200":"bg-slate-900 text-white"}`}>❤️ {likes}</button>
          </div>
        </div>
      </header>
      <main className="max-w-[1200px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-5">
          <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm">
            <div className="relative h-[200px] bg-slate-50 flex items-center justify-center">
              <img src={cropData.img} className="w-auto h-full max-h-[180px] max-w-[320px] object-contain rounded-xl shadow-sm bg-white p-1"/>
              <div className="absolute top-4 right-4 flex gap-2">
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur rounded-full text-xs font-bold shadow-sm border">{cropData.category}</span>
                {cropData.verified && <span className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs">✓</span>}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div><h1 className="text-2xl font-extrabold">{cropData.name}</h1><p className="text-sm text-slate-500 mt-1">📍 {cropData.city} • {cropData.qty} • منذ ساعتين</p></div>
                <div className="text-left"><p className="text-2xl font-extrabold text-emerald-700">{cropData.price}</p><p className="text-xs text-slate-500">سعر الكيلو</p></div>
              </div>
              <div className="mt-6 p-4 bg-slate-50 rounded-2xl border"><h3 className="font-bold text-sm mb-2">الوصف</h3><p className="text-[14px] leading-7 text-slate-700">{(cropData as any).desc||(cropData as any).description}</p>
                <div className="grid grid-cols-3 gap-3 mt-4"><div className="bg-white rounded-xl p-3 border text-center"><p className="text-xs text-slate-500">الكمية</p><p className="font-bold text-sm mt-1">{cropData.qty}</p></div><div className="bg-white rounded-xl p-3 border text-center"><p className="text-xs text-slate-500">الفئة</p><p className="font-bold text-sm mt-1">{cropData.category}</p></div><div className="bg-white rounded-xl p-3 border text-center"><p className="text-xs text-slate-500">المدينة</p><p className="font-bold text-sm mt-1">{cropData.city}</p></div></div>
              </div>
              <div className="flex gap-3 mt-6"><button type="button" onClick={handleContact} className="flex-1 h-12 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800">تواصل مع المزارع 💬</button><button type="button" onClick={(e)=>{e.preventDefault(); e.stopPropagation(); showToast("تمت الإضافة للمفضلة")}} className="h-12 px-6 bg-white border rounded-full font-bold">♡ حفظ</button></div>
            </div>
          </div>
          <div className="bg-white rounded-[24px] border p-6 shadow-sm"><h3 className="font-bold mb-4">التعليقات ({commentsList.length})</h3><div className="flex gap-3 mb-5"><img src="https://i.pravatar.cc/100?img=12" className="w-9 h-9 rounded-full"/><div className="flex-1 flex gap-2"><input value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="اكتب تعليق..." className="flex-1 h-11 px-4 bg-slate-50 border rounded-full text-sm"/><button type="button" onClick={(e)=>{e.preventDefault(); e.stopPropagation(); if(newComment.trim()){setCommentsList([{id:Date.now(), name:"أنت", avatar:"https://i.pravatar.cc/100?img=12", text:newComment, time:"الآن"}, ...commentsList]); setNewComment("")}}} className="h-11 px-5 bg-slate-900 text-white rounded-full text-sm font-bold">إرسال</button></div></div><div className="space-y-4">{commentsList.map(c=>(<div key={c.id} className="flex gap-3"><img src={c.avatar} className="w-8 h-8 rounded-full"/><div className="flex-1 bg-slate-50 rounded-2xl rounded-br-sm px-4 py-2.5 border"><p className="text-[13px] font-bold">{c.name} <span className="text-[11px] font-normal text-slate-500">• {c.time}</span></p><p className="text-[13px] mt-1">{c.text}</p></div></div>))}</div></div>
        </div>
        <div className="space-y-5"><div className="bg-white rounded-[24px] border overflow-hidden shadow-sm"><div className="h-24 bg-slate-200 relative"><img src={farmer.cover} className="w-full h-full object-cover"/></div><div className="p-5"><div className="flex gap-3"><Link href="/"><img src={farmer.avatar} className="w-14 h-14 rounded-full border-2 border-white -mt-10"/></Link><div className="flex-1 -mt-1"><Link href="/" className="font-extrabold hover:underline">{farmer.name}</Link><p className="text-xs text-slate-500">{farmer.city} • {farmer.specialty}</p></div><span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[11px]">✓</span></div><p className="text-[13px] text-slate-600 mt-3">{farmer.bio}</p><div className="flex gap-4 mt-4 text-[13px]"><span><b>{farmer.crops}</b> محصول</span><span><b>{farmer.followers}</b> متابع</span><span>⭐ {farmer.rating}</span></div><div className="flex gap-2 mt-5"><button type="button" onClick={handleContact} className="flex-1 h-10 bg-slate-900 text-white rounded-full text-sm font-bold">مراسلة 💬</button><Link href="/" className="flex-1 h-10 bg-white border rounded-full text-sm font-bold flex items-center justify-center">عرض البروفايل</Link></div></div></div></div>
      </main>
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-full text-sm font-bold z-[90]">{toast}</div>}
    </div>
  )
}
