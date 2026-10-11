import Link from "next/link";

const FARMERS = [
  { id: 1, name: "أحمد المزارع", city: "المنصورة", specialty: "خضروات", avatar: "https://i.pravatar.cc/100?img=12" },
  { id: 2, name: "فاطمة للشتلات", city: "القليوبية", specialty: "شتلات", avatar: "https://i.pravatar.cc/100?img=26" },
  { id: 3, name: "محمد الفكهاني", city: "الإسماعيلية", specialty: "فواكه", avatar: "https://i.pravatar.cc/100?img=15" },
  { id: 4, name: "مزرعة النور", city: "البحيرة", specialty: "حبوب", avatar: "https://i.pravatar.cc/100?img=45" },
];

export default function FarmersPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f7f8f3] p-4 pb-24 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div>
            <p className="text-xs font-bold text-emerald-800">ContCrops · المجتمع</p>
            <h1 className="mt-1 text-xl font-black">المزارعون</h1>
          </div>
          <Link href="/" className="inline-flex h-10 items-center rounded-xl bg-slate-100 px-3 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900">
            العودة إلى السوق
          </Link>
        </header>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {FARMERS.map((farmer) => (
            <Link key={farmer.id} href={`/farmer/${encodeURIComponent(farmer.name)}`} className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-300 hover:shadow-md">
              <div className="flex items-center gap-3">
                <img src={farmer.avatar} alt={farmer.name} className="h-14 w-14 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-slate-900">{farmer.name}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{farmer.city}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2">
                <span className="text-[11px] font-bold text-emerald-900">{farmer.specialty}</span>
                <span className="text-[10px] font-bold text-emerald-700">عرض الملف</span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
