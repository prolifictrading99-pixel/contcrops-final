"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardList, FilePlus2, Leaf, UsersRound, Warehouse } from "lucide-react";
import { supabase, isPlaceholderMode } from "@/lib/supabase";

type Contract = {
  id: string | number;
  supplier: string;
  crop: string;
  quantity: number | string;
  price: number | string;
  delivery_date: string;
  terms: string;
  status: "active" | "review" | "cancelled" | string;
  created_at?: string;
};

const LOCAL_CONTRACTS_KEY = "contcrops_contracts";

function readLocalContracts(): Contract[] {
  try {
    if (typeof window === 'undefined') return [];
    const contracts = JSON.parse(localStorage.getItem(LOCAL_CONTRACTS_KEY) || "[]");
    return Array.isArray(contracts)? contracts : [];
  } catch {
    return [];
  }
}

export default function DashboardPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loadMessage, setLoadMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    const loadContracts = async () => {
      // لو Supabase متظبط - استخدمه
      if (!isPlaceholderMode()) {
        const { data, error } = await supabase
         .from("contracts")
         .select("id,supplier,crop,quantity,price,delivery_date,terms,status,created_at")
         .order("created_at", { ascending: false })
         .limit(100);

        if (!error && mounted) {
          setContracts(data || []);
          setLoadMessage(""); // شيل رسالة الخطأ لو نجح
          return;
        }
        if (error) {
          console.error("Could not load contracts", error);
          if (mounted) setLoadMessage("تعذر تحميل بعض بيانات الإدارة من Supabase. تأكد من تطبيق ترحيل 20261011 ومن صلاحيات المالك.");
        }
      } else {
        if (mounted) setLoadMessage("وضع محلي - Supabase غير مُكوّن. يتم عرض العقود المحفوظة على هذا الجهاز.");
      }

      if (mounted) setContracts(readLocalContracts());
    };

    void loadContracts();
    return () => { mounted = false; };
  }, []);

  const stats = [
    { label: "إجمالي العقود", value: contracts.length, icon: <ClipboardList size={18}/>, color: "text-[#064E3B]" },
    { label: "عقود مفعلة", value: contracts.filter((c) => c.status === "active").length, icon: <Leaf size={18}/>, color: "text-emerald-700" },
    { label: "قيد المراجعة", value: contracts.filter((c) => c.status === "review").length, icon: <Warehouse size={18}/>, color: "text-amber-600" },
    { label: "ملغية", value: contracts.filter((c) => c.status === "cancelled").length, icon: <ClipboardList size={18}/>, color: "text-rose-600" },
  ];

  const quickLinks = [
    { href: "/dashboard/contract", label: "كتابة عقد", detail: "إنشاء وحفظ عقد جديد", icon: <FilePlus2 size={19}/> },
    { href: "/dashboard/contracts", label: "نماذج عقود", detail: "بيع وتوريد وإيجار مع معاينة وطباعة", icon: <ClipboardList size={19}/> },
    { href: "#contracts", label: "عرض العقود", detail: "مراجعة أحدث العقود", icon: <ClipboardList size={19}/> },
    { href: "/", label: "المحاصيل", detail: "استكشاف سوق المحاصيل", icon: <Leaf size={19}/> },
    { href: "/admin/colleagues", label: "الزملاء", detail: "ملفات الزملاء المسجلة على المنصة", icon: <UsersRound size={19}/> },
    { href: "/dashboard/statements?type=produce", label: "استلام / تسليم", detail: "إنشاء بيان حركة محصول أو منتج", icon: <Warehouse size={19}/> },
    { href: "/dashboard/statements?type=cash", label: "بيان نقدية", detail: "إنشاء سند قبض أو صرف", icon: <FilePlus2 size={19}/> },
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 p-4 pb-20 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <div>
            <p className="text-xs font-bold text-emerald-800">ContCrops · إدارة التعاملات</p>
            <h1 className="mt-1 text-xl font-black text-slate-900">لوحة التحكم</h1>
          </div>
          <Link href="/" className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-100 px-3 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900">العودة للمنصة <ArrowLeft size={15}/></Link>
        </header>

        {loadMessage && <p role="status" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">{loadMessage}</p>}

        <section aria-label="إحصائيات العقود" className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-2"><p className="text-xs font-bold text-slate-500">{stat.label}</p><span className={stat.color}>{stat.icon}</span></div>
            <p className={`mt-3 text-2xl font-black ${stat.color}`}>{stat.value}</p>
          </article>)}
        </section>

        <section className="mt-6">
          <h2 className="mb-3 text-sm font-extrabold text-slate-800">الوصول السريع</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {quickLinks.map((link) => <Link key={link.href} href={link.href} className="flex min-h-24 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-300 hover:bg-emerald-50/50">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">{link.icon}</span>
              <span className="min-w-0"><span className="block text-sm font-extrabold text-slate-800">{link.label}</span><span className="mt-1 block text- leading-5 text-slate-500">{link.detail}</span></span>
            </Link>)}
          </div>
        </section>

        <section id="contracts" className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-4">
            <div><h2 className="text-sm font-extrabold text-slate-900">أحدث العقود</h2><p className="mt-1 text- text-slate-500">{contracts.length} عقد محفوظ</p></div>
            <Link href="/dashboard/contract" className="rounded-lg bg-[#064E3B] px-3 py-2 text-xs font-bold text-white hover:bg-emerald-900">كتابة عقد</Link>
          </div>
          {contracts.length? <div className="divide-y divide-slate-100">
            {contracts.slice(0, 8).map((contract) => <article key={contract.id} className="grid gap-2 px-4 py-3 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
              <div><p className="text-xs font-bold text-slate-800">{contract.crop} · {contract.supplier}</p><p className="mt-1 text- text-slate-500">{contract.quantity} · {contract.delivery_date || "موعد غير محدد"}</p></div>
              <p className="text-xs font-bold text-emerald-800">{Number(contract.price).toLocaleString("ar-EG")} جنيه</p>
              <span className="w-fit rounded-full bg-amber-50 px-2.5 py-1 text- font-bold text-amber-700">{contract.status === "active"? "مفعل" : contract.status === "cancelled"? "ملغي" : "قيد المراجعة"}</span>
            </article>)}
          </div> : <p className="px-4 py-10 text-center text-xs text-slate-500">لا توجد عقود بعد. ابدأ بإنشاء عقد جديد.</p>}
        </section>
      </div>
    </main>
  );
}