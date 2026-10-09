"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowRight, MapPin, Sprout } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const DEFAULT_COVER = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&auto=format&fit=crop&q=85";

export default function PublicPeerProfilePage() {
  const params = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = decodeURIComponent(params.userId);

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      try {
        let resolvedProfile: any = null;
        for (const key of Object.keys(localStorage)) {
          if (!key.startsWith("contcrops_demo_user:")) continue;
          try {
            const candidate = JSON.parse(localStorage.getItem(key) || "null");
            if (String(candidate?.id) === userId) { resolvedProfile = candidate; break; }
          } catch (error) {
            console.error("Could not read a local public profile", error);
          }
        }
        const shared = JSON.parse(localStorage.getItem("contcrops_shared_content") || "{}");
        const localContent = ["articles", "crops", "rfqs", "discussions"].flatMap(type =>
          (Array.isArray(shared[type]) ? shared[type] : [])
            .filter((item: any) => String(item.ownerId) === userId)
            .map((item: any) => ({ ...item, contentType: type })),
        );
        if (isSupabaseConfigured()) {
          const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
          if (error) throw error;
          if (data) resolvedProfile = {
            id: data.id,
            name: data.display_name,
            city: data.city,
            bio: data.bio,
            specialty: data.specialty,
            avatar: data.avatar_url,
            cover: data.cover_url,
          };
          const { data: remoteRows, error: contentError } = await supabase.from("platform_content").select("content_type,payload").eq("owner_id", userId).order("created_at", { ascending: false });
          if (contentError) throw contentError;
          if (remoteRows) localContent.push(...remoteRows.map((row: any) => ({ ...row.payload, contentType: row.content_type })));
        }
        if (mounted) {
          setProfile(resolvedProfile || { id: userId, name: "زميل في ContCrops", city: "مصر", specialty: "عضو في المجتمع الزراعي", avatar: "https://i.pravatar.cc/160?img=12", bio: "تعرف على النشاط والمنشورات العامة لهذا العضو." });
          setContent(localContent);
        }
      } catch (error) {
        console.error("Could not load the public colleague profile", error);
        if (mounted) setProfile({ id: userId, name: "زميل في ContCrops", city: "مصر", specialty: "عضو في المجتمع الزراعي", avatar: "https://i.pravatar.cc/160?img=12", bio: "تعذر تحميل بعض تفاصيل الملف الشخصي." });
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void loadProfile();
    return () => { mounted = false; };
  }, [userId]);

  if (loading) return <main dir="rtl" className="flex min-h-screen items-center justify-center bg-[#f7f8f3] text-sm font-bold text-emerald-900">جارٍ تحميل الملف الشخصي…</main>;
  if (!profile) return null;

  return <main dir="rtl" className="min-h-screen bg-[#f7f8f3] px-3 pb-10 pt-4 sm:px-6 sm:pt-8">
    <div className="mx-auto max-w-4xl">
      <Link href="/" className="mb-4 inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700"><ArrowRight size={15}/> العودة إلى ContCrops</Link>
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="relative aspect-[3/1] min-h-[150px] max-h-[300px] overflow-hidden bg-[#064E3B]">
          <img src={profile.cover || DEFAULT_COVER} alt="" className="absolute inset-0 h-full w-full object-cover object-center"/>
          <div className="absolute inset-0 bg-gradient-to-t from-[#064E3B]/90 via-[#064E3B]/25 to-black/10"/>
          <div className="absolute inset-x-5 bottom-4 flex items-end gap-3 text-white sm:inset-x-8 sm:bottom-6">
            <img src={profile.avatar || "https://i.pravatar.cc/160?img=12"} alt="" className="h-16 w-16 rounded-full border-4 border-[#F0FDF4] object-cover shadow-md sm:h-20 sm:w-20"/>
            <div className="min-w-0 pb-1"><h1 className="truncate text-xl font-extrabold sm:text-3xl">{profile.name}</h1><p className="mt-1 flex items-center gap-1 text-xs text-emerald-50 sm:text-sm"><MapPin size={14}/>{profile.city || "مصر"} · {profile.specialty || "عضو في المجتمع الزراعي"}</p></div>
          </div>
        </div>
        <div className="p-5 sm:p-8">
          <p className="max-w-3xl text-sm leading-7 text-slate-600">{profile.bio || "شارك خبرتك الزراعية وتعرّف على نشاط هذا الزميل."}</p>
          <div className="mt-5 flex items-center gap-2 text-xs font-bold text-emerald-900"><Sprout size={16}/>{content.length} منشورات عامة</div>
        </div>
      </section>
      <section className="mt-6">
        <h2 className="mb-3 text-lg font-extrabold text-slate-900">النشاط والمنشورات</h2>
        {content.length === 0 ? <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">لا توجد منشورات عامة متاحة لهذا العضو حتى الآن.</p> :
          <div className="grid gap-3 sm:grid-cols-2">{content.map((item, index) => <article key={`${item.contentType}-${item.id || index}`} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] font-bold text-emerald-800">{item.contentType === "articles" ? "مقال" : item.contentType === "crops" ? "عرض محصول" : item.contentType === "rfqs" ? "طلب شراء" : "نقاش زراعي"}</p>
            <h3 className="mt-2 font-extrabold text-slate-900">{item.title || item.name || item.text || "منشور زراعي"}</h3>
            {(item.excerpt || item.description || item.city) && <p className="mt-2 line-clamp-3 text-xs leading-6 text-slate-500">{item.excerpt || item.description || item.city}</p>}
            {item.price && <p className="mt-3 text-sm font-extrabold text-emerald-800">{item.price} · {item.qty || ""}</p>}
          </article>)}</div>}
      </section>
    </div>
  </main>;
}
