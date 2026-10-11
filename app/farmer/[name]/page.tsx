"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const FARMERS = [
  { id: 1, name: "أحمد المزارع", city: "المنصورة", specialty: "خضروات", avatar: "https://i.pravatar.cc/100?img=12", bio: "مزارع خضروات خبرة 15 سنة - المنصورة" },
  { id: 2, name: "فاطمة للشتلات", city: "القليوبية", specialty: "شتلات", avatar: "https://i.pravatar.cc/100?img=26", bio: "مشتل شتلات هجين ومقاومة" },
  { id: 3, name: "محمد الفكهاني", city: "الإسماعيلية", specialty: "فواكه", avatar: "https://i.pravatar.cc/100?img=15", bio: "فواكه طازجة يومياً" },
  { id: 4, name: "مزرعة النور", city: "البحيرة", specialty: "حبوب", avatar: "https://i.pravatar.cc/100?img=45", bio: "حبوب عالية الجودة" },
];

export default function FarmerDetailPage() {
  const params = useParams<{ name?: string }>();
  const decodedName = params?.name ? decodeURIComponent(params.name) : "";
  const farmer = FARMERS.find((item) => item.name === decodedName) || {
    id: "unknown",
    name: decodedName || "مزارع ContCrops",
    city: "مصر",
    specialty: "زراعة",
    avatar: "https://i.pravatar.cc/100?img=12",
    bio: "ملف زراعي مستقل ضمن منصة ContCrops.",
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#f7f8f3] p-4 pb-24 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Link href="/farmers" className="inline-flex h-10 items-center rounded-xl bg-slate-100 px-3 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900">
              العودة
            </Link>
            <div>
              <p className="text-xs font-bold text-emerald-800">ContCrops · الملف</p>
              <h1 className="mt-1 text-xl font-black">{farmer.name}</h1>
            </div>
          </div>
          <Link href="/" className="inline-flex h-10 items-center rounded-xl bg-[#064E3B] px-3 text-xs font-bold text-white hover:bg-emerald-900">
            السوق
          </Link>
        </header>

        <section className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-32 bg-gradient-to-r from-emerald-600 to-lime-500"></div>
          <div className="px-5 pb-5">
            <img src={farmer.avatar} alt={farmer.name} className="-mt-12 h-24 w-24 rounded-full border-4 border-white object-cover shadow-md" />
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">{farmer.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{farmer.city}</p>
              </div>
              <span className="inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">{farmer.specialty}</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">{farmer.bio}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
