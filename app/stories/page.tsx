"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BookOpen, CirclePlay } from "lucide-react";
import { SAMPLE_STORIES, StoryCard } from "@/components/Stories";

export default function StoriesPage() {
  const [filter, setFilter] = useState("الكل");
  const categories = ["الكل", ...Array.from(new Set(SAMPLE_STORIES.map(story => story.badge.split(" · ")[0])))];
  const stories = SAMPLE_STORIES.filter(story => filter === "الكل" || story.badge.startsWith(filter));

  return <main dir="rtl" className="min-h-screen bg-[#f7f8f3] px-4 pb-12 pt-5 sm:px-6 sm:pt-8">
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex items-center gap-3">
        <Link href="/" aria-label="العودة إلى المنصة" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700"><ArrowRight size={18}/></Link>
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-900 text-emerald-50"><CirclePlay size={22}/></span>
        <div><p className="text-xs font-bold text-emerald-800">ContCrops · من أرض الواقع</p><h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">قصص الزملاء</h1></div>
      </header>
      <section className="mb-6 rounded-3xl bg-gradient-to-l from-[#064E3B] to-[#1c5135] p-5 text-white sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold text-emerald-100">لحظات وخبرات قصيرة</p><h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">من الحقول والأسواق مباشرة</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">تابع حصاد الزملاء، عروضهم وتجاربهم. اختر أي قصة لفتح الملف العام لصاحبها.</p></div><span className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold"><BookOpen size={15}/>{stories.length} قصص</span></div>
      </section>
      <div className="scrollbar-none mb-5 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="تصفية القصص">
        {categories.map(category=><button key={category} onClick={()=>setFilter(category)} className={`min-h-10 shrink-0 rounded-full px-4 text-xs font-bold ${filter===category?"bg-emerald-900 text-white":"border border-slate-200 bg-white text-slate-600"}`}>{category}</button>)}
      </div>
      {stories.length ? <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">{stories.map(story=><StoryCard key={story.id} story={story}/>)}</div> : <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">لا توجد قصص في هذا التصنيف.</p>}
    </div>
  </main>;
}
