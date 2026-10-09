"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock3, X } from "lucide-react";

export type Story = {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  image: string;
  title: string;
  badge: string;
  time: string;
};

export const SAMPLE_STORIES: Story[] = [
  { id: "story-tomato", userId: "1", name: "أحمد المزارع", avatar: "https://i.pravatar.cc/100?img=12", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=900&auto=format&fit=crop&q=85", title: "حصاد الطماطم بدأ اليوم من أرضنا", badge: "طماطم · 12 جنيه/كجم", time: "منذ 20 دقيقة" },
  { id: "story-seedlings", userId: "2", name: "فاطمة للشتلات", avatar: "https://i.pravatar.cc/100?img=26", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&auto=format&fit=crop&q=85", title: "شتلات الموسم الجديد جاهزة للزراعة", badge: "شتلات · متاح الآن", time: "منذ ساعة" },
  { id: "story-mango", userId: "3", name: "محمد الفكهاني", avatar: "https://i.pravatar.cc/100?img=15", image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=900&auto=format&fit=crop&q=85", title: "مانجو عويس بجودة تصديرية", badge: "مانجو · 35 جنيه/كجم", time: "منذ ساعتين" },
  { id: "story-wheat", userId: "4", name: "مزرعة النور", avatar: "https://i.pravatar.cc/100?img=45", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=900&auto=format&fit=crop&q=85", title: "متابعة نمو القمح في الحقول", badge: "قمح · الشرقية", time: "منذ 3 ساعات" },
  { id: "story-farm", userId: "5", name: "مزارع الوادي", avatar: "https://i.pravatar.cc/100?img=33", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&auto=format&fit=crop&q=85", title: "صباح الخير من قلب المزرعة", badge: "يوميات المزرعة", time: "منذ 4 ساعات" },
  { id: "story-export", userId: "6", name: "تصدير المحاصيل", avatar: "https://i.pravatar.cc/100?img=45", image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900&auto=format&fit=crop&q=85", title: "تجهيز شحنة البرتقال للتصدير", badge: "تصدير · برتقال", time: "منذ 5 ساعات" },
];

function StoryViewer({ stories, initialIndex, onClose }: { stories: Story[]; initialIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(initialIndex);
  const story = stories[index];
  const profileHref = `/profile/${encodeURIComponent(story.userId)}`;

  return (
    <div role="dialog" aria-modal="true" aria-label="عارض القصص" onClick={onClose} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-3 sm:p-6">
      <div onClick={event => event.stopPropagation()} className="relative h-[min(88dvh,760px)] w-full max-w-[430px] overflow-hidden rounded-[28px] bg-slate-900 text-white shadow-2xl">
        <img src={story.image} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-black/75" />
        <div className="absolute inset-x-3 top-3 flex gap-1" aria-label={`القصة ${index + 1} من ${stories.length}`}>
          {stories.map((item, segment) => <span key={item.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/40"><span className={`block h-full rounded-full ${segment <= index ? "bg-white" : "bg-transparent"}`} /></span>)}
        </div>
        <header className="absolute inset-x-4 top-8 flex items-center gap-3">
          <Link href={profileHref} aria-label={`الانتقال إلى ملف ${story.name}`} onClick={onClose} className="flex min-w-0 items-center gap-3 rounded-full pr-1 hover:bg-white/10">
            <img src={story.avatar} alt="" className="h-10 w-10 rounded-full border-2 border-white object-cover" />
            <span className="min-w-0"><span className="block truncate text-sm font-extrabold">{story.name}</span><span className="mt-0.5 flex items-center gap-1 text-[11px] text-white/75"><Clock3 size={12}/>{story.time}</span></span>
          </Link>
          <button onClick={onClose} aria-label="إغلاق القصص" className="mr-auto flex h-10 w-10 items-center justify-center rounded-full bg-black/30"><X size={20}/></button>
        </header>
        <button aria-label="القصة السابقة" onClick={() => setIndex(current => (current - 1 + stories.length) % stories.length)} className="absolute inset-y-24 right-0 w-1/4 sm:w-1/5" />
        <button aria-label="القصة التالية" onClick={() => setIndex(current => (current + 1) % stories.length)} className="absolute inset-y-24 left-0 w-1/4 sm:w-1/5" />
        <div className="absolute inset-x-5 bottom-6">
          <span className="inline-flex rounded-full border border-white/25 bg-emerald-950/60 px-3 py-1.5 text-xs font-bold text-emerald-50">{story.badge}</span>
          <p className="mt-3 text-xl font-extrabold leading-relaxed drop-shadow sm:text-2xl">{story.title}</p>
          <Link href={profileHref} onClick={onClose} className="mt-5 inline-flex min-h-11 items-center rounded-full bg-white px-5 py-2 text-sm font-extrabold text-emerald-950">زيارة الملف الشخصي</Link>
        </div>
        <button aria-label="السابق" onClick={() => setIndex(current => (current - 1 + stories.length) % stories.length)} className="absolute inset-y-1/2 right-2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 sm:flex"><ChevronRight size={20}/></button>
        <button aria-label="التالي" onClick={() => setIndex(current => (current + 1) % stories.length)} className="absolute inset-y-1/2 left-2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 sm:flex"><ChevronLeft size={20}/></button>
      </div>
    </div>
  );
}

export function StoriesRail({ stories = SAMPLE_STORIES }: { stories?: Story[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return (
    <>
      <section aria-label="قصص الزملاء" className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div><h2 className="text-sm font-extrabold text-slate-900">قصص من المزرعة</h2><p className="mt-0.5 text-[11px] text-slate-500">لقطات سريعة من الزملاء والأسواق</p></div>
          <Link href="/stories" className="text-xs font-bold text-emerald-800 hover:underline">كل القصص ←</Link>
        </div>
        <div className="scrollbar-none flex gap-4 overflow-x-auto pb-1" dir="rtl">
          {stories.map((story, index) => <button key={story.id} onClick={() => setActiveIndex(index)} className="flex w-[68px] shrink-0 flex-col items-center gap-1.5 rounded-xl p-1 text-center">
            <span className="rounded-full bg-gradient-to-br from-amber-400 via-rose-500 to-emerald-700 p-[2px]"><img src={story.avatar} alt="" className="h-14 w-14 rounded-full border-2 border-white object-cover"/></span>
            <span className="w-full truncate text-[11px] font-bold text-slate-700">{story.name}</span>
          </button>)}
        </div>
      </section>
      {activeIndex!==null&&<StoryViewer stories={stories} initialIndex={activeIndex} onClose={()=>setActiveIndex(null)}/>}
    </>
  );
}

export function StoryCard({ story }: { story: Story }) {
  return (
    <Link href={`/profile/${encodeURIComponent(story.userId)}`} className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-200 shadow-sm">
      <img src={story.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"/>
      <span className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/75"/>
      <span className="absolute inset-x-3 top-3 flex min-w-0 items-center gap-2">
        <img src={story.avatar} alt="" className="h-9 w-9 rounded-full border-2 border-white object-cover"/>
        <span className="truncate text-xs font-extrabold text-white drop-shadow">{story.name}</span>
      </span>
      <span className="absolute inset-x-3 bottom-3">
        <span className="inline-flex rounded-full bg-emerald-950/75 px-2.5 py-1 text-[10px] font-bold text-emerald-50">{story.badge}</span>
        <span className="mt-2 block line-clamp-2 text-sm font-extrabold leading-5 text-white drop-shadow">{story.title}</span>
      </span>
    </Link>
  );
}
