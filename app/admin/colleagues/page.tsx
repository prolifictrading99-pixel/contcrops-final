"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Search, UsersRound } from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type Colleague = {
  id: string;
  display_name: string;
  city: string;
  bio: string;
  specialty: string;
  avatar_url: string;
  updated_at: string;
};

export default function ColleaguesPage() {
  const [colleagues, setColleagues] = useState<Colleague[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadColleagues = async () => {
      if (!isSupabaseConfigured()) {
        setError("اتصل بـ Supabase لعرض ملفات الزملاء المسجلة.");
        setLoading(false);
        return;
      }
      const { data, error: queryError } = await supabase
        .from("profiles")
        .select("id,display_name,city,bio,specialty,avatar_url,updated_at")
        .order("updated_at", { ascending: false });
      if (!active) return;
      if (queryError) setError("تعذر تحميل الزملاء من Supabase.");
      else setColleagues((data || []) as Colleague[]);
      setLoading(false);
    };
    void loadColleagues();
    return () => { active = false; };
  }, []);

  const visibleColleagues = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("ar");
    if (!term) return colleagues;
    return colleagues.filter((colleague) =>
      [colleague.display_name, colleague.city, colleague.specialty]
        .some((value) => value?.toLocaleLowerCase("ar").includes(term)),
    );
  }, [colleagues, search]);

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 p-4 pb-20 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800"><UsersRound size={20}/></span><div><p className="text-xs font-bold text-emerald-800">ContCrops · إدارة التعاملات</p><h1 className="mt-1 text-xl font-black">الزملاء</h1></div></div>
          <Link href="/admin" className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-100 px-3 text-xs font-bold text-slate-700 hover:bg-emerald-50"><ArrowRight size={15}/> لوحة التحكم</Link>
        </header>
        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <label className="relative block max-w-lg"><Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث بالاسم أو المنطقة أو التخصص" className="h-11 w-full rounded-xl border border-slate-200 bg-white pr-9 pl-3 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10"/></label>
          <p className="mt-3 text-[11px] text-slate-500">{loading ? "جارٍ تحميل الملفات..." : `${visibleColleagues.length} زميل مسجل`}</p>
        </section>
        {error && <p role="alert" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">{error}</p>}
        {loading ? <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-500">جارٍ تحميل الزملاء من المنصة...</div>
          : !error && visibleColleagues.length === 0 ? <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-500">لا توجد ملفات مطابقة للبحث.</div>
            : <section aria-label="الزملاء المسجلون" className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {visibleColleagues.map((colleague) => <article key={colleague.id} className="flex min-w-0 gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-emerald-50 text-center text-lg font-black leading-[56px] text-emerald-800">{(colleague.display_name || "ز").trim().slice(0, 1)}{colleague.avatar_url && <img src={colleague.avatar_url} alt={`صورة ${colleague.display_name}`} className="absolute inset-0 h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }}/>}</div>
                <div className="min-w-0 flex-1"><h2 className="truncate text-sm font-extrabold text-slate-900">{colleague.display_name || "زميل بالمنصة"}</h2><p className="mt-1 truncate text-xs text-emerald-800">{colleague.specialty || "عضو في مجتمع ContCrops"}</p><p className="mt-2 flex items-center gap-1 text-[11px] text-slate-500"><MapPin size={13}/>{colleague.city || "المنطقة غير محددة"}</p>{colleague.bio && <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">{colleague.bio}</p>}<Link href={`/profile/${colleague.id}`} className="mt-3 inline-flex text-xs font-bold text-emerald-800 hover:text-emerald-950">عرض الملف</Link></div>
              </article>)}
            </section>}
      </div>
    </main>
  );
}