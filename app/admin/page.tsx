"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Banknote,
  ClipboardList,
  Leaf,
  ShieldCheck,
  Store,
  Truck,
  UsersRound,
  Warehouse,
} from "lucide-react"
import { isSupabaseConfigured, supabase } from "@/lib/supabase"
import { formatMoney, inferAccountRole, isPlatformOwner } from "@/lib/admin"
import { ResponsiveDataList } from "@/components/ResponsiveDataList"

type ProfileRow = {
  id: string
  display_name: string
  city: string
  specialty: string
  role?: string
  account_status?: string
  updated_at?: string
  avatar_url?: string
}

type ContractRow = {
  id: string
  supplier: string
  crop: string
  quantity: number | string
  price: number | string
  status: string
  kind?: string
  delivery_date?: string
  created_at?: string
}

type StatementRow = {
  id: string
  statement_type: string
  cash_type?: string | null
  serial?: string
  party?: string
  item?: string
  amount?: number | string
  quantity?: number | string
  status?: string
  created_at?: string
}

const LOCAL_CONTRACTS_KEY = "contcrops_contracts"
const LOCAL_STATEMENTS_KEY = "contcrops_statements"

function readLocal<T>(key: string): T[] {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]")
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function statusLabel(status?: string) {
  if (status === "active") return "نشط"
  if (status === "cancelled" || status === "suspended") return "موقوف"
  if (status === "pending" || status === "review") return "قيد المراجعة"
  return "مسجّل"
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [owner, setOwner] = useState(false)
  const [profiles, setProfiles] = useState<ProfileRow[]>([])
  const [contracts, setContracts] = useState<ContractRow[]>([])
  const [statements, setStatements] = useState<StatementRow[]>([])
  const [contentCounts, setContentCounts] = useState({ crops: 0, rfqs: 0, discussions: 0, articles: 0 })
  const [busyId, setBusyId] = useState("")

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const localContracts = readLocal<ContractRow>(LOCAL_CONTRACTS_KEY)
      const localStatements = readLocal<StatementRow>(LOCAL_STATEMENTS_KEY)
      if (!isSupabaseConfigured()) {
        if (!mounted) return
        setContracts(localContracts)
        setStatements(localStatements)
        setMessage("Supabase غير متصل؛ تُعرض البيانات المحفوظة على هذا الجهاز.")
        setLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      const { data: ownProfile } = user
        ? await supabase.from("profiles").select("id,role,display_name").eq("id", user.id).maybeSingle()
        : { data: null }
      const ownerAccess = isPlatformOwner({
        email: user?.email,
        role: ownProfile?.role,
        user_metadata: user?.user_metadata,
      })
      if (mounted) setOwner(ownerAccess || !user)

      const [profilesRes, contractsRes, statementsRes, contentRes] = await Promise.all([
        supabase.from("profiles").select("id,display_name,city,specialty,role,account_status,updated_at,avatar_url").order("updated_at", { ascending: false }).limit(200),
        supabase.from("contracts").select("id,supplier,crop,quantity,price,status,kind,delivery_date,created_at").order("created_at", { ascending: false }).limit(200),
        supabase.from("platform_statements").select("id,statement_type,cash_type,serial,party,item,amount,quantity,status,created_at").order("created_at", { ascending: false }).limit(200),
        supabase.from("platform_content").select("content_type"),
      ])

      if (!mounted) return
      if (profilesRes.error || contractsRes.error || statementsRes.error) {
        setMessage("تعذر تحميل بعض بيانات الإدارة من Supabase. تأكد من تطبيق ترحيل 20261011 ومن صلاحيات المالك.")
      }
      setProfiles((profilesRes.data || []) as ProfileRow[])
      setContracts(((contractsRes.data || []) as ContractRow[]).length ? (contractsRes.data as ContractRow[]) : localContracts)
      setStatements(((statementsRes.data || []) as StatementRow[]).length ? (statementsRes.data as StatementRow[]) : localStatements)
      const counts = { crops: 0, rfqs: 0, discussions: 0, articles: 0 }
      for (const row of contentRes.data || []) {
        if (row.content_type === "crop") counts.crops += 1
        if (row.content_type === "rfq") counts.rfqs += 1
        if (row.content_type === "discussion") counts.discussions += 1
        if (row.content_type === "article") counts.articles += 1
      }
      setContentCounts(counts)
      setLoading(false)
    }
    void load()
    return () => { mounted = false }
  }, [])

  const farmers = profiles.filter((profile) => inferAccountRole(profile) === "farmer").length
  const traders = profiles.filter((profile) => inferAccountRole(profile) === "trader").length
  const saleContracts = contracts.filter((contract) => (contract.kind || "sale") === "sale")
  const purchaseContracts = contracts.filter((contract) => contract.kind === "purchase")
  const produceStatements = statements.filter((row) => row.statement_type === "produce")
  const cashStatements = statements.filter((row) => row.statement_type === "cash")
  const cashIn = cashStatements.filter((row) => row.cash_type !== "payment").reduce((sum, row) => sum + Number(row.amount || 0), 0)
  const cashOut = cashStatements.filter((row) => row.cash_type === "payment").reduce((sum, row) => sum + Number(row.amount || 0), 0)
  const contractValue = contracts.reduce((sum, row) => sum + Number(row.price || 0) * Number(row.quantity || 1), 0)
  const activeAccounts = profiles.filter((profile) => (profile.account_status || "active") === "active").length
  const pendingAccounts = profiles.filter((profile) => profile.account_status === "pending").length
  const suspendedAccounts = profiles.filter((profile) => profile.account_status === "suspended").length

  const stats = [
    { label: "المزارعون", value: farmers || profiles.length, icon: <Leaf size={18} />, note: "حسابات زراعية" },
    { label: "التجار", value: traders, icon: <Store size={18} />, note: "مشترون ومصدرون" },
    { label: "عقود البيع", value: saleContracts.length, icon: <ClipboardList size={18} />, note: formatMoney(saleContracts.reduce((sum, row) => sum + Number(row.price || 0), 0)) },
    { label: "عقود الشراء", value: purchaseContracts.length, icon: <Truck size={18} />, note: `${purchaseContracts.length} عقد توريد` },
    { label: "بيانات التسليم", value: produceStatements.length, icon: <Warehouse size={18} />, note: "استلام / تسليم" },
    { label: "صافي النقدية", value: formatMoney(cashIn - cashOut), icon: <Banknote size={18} />, note: `قبض ${formatMoney(cashIn)}` },
  ]

  const updateAccountStatus = async (id: string, account_status: string) => {
    setBusyId(id)
    setProfiles((current) => current.map((profile) => profile.id === id ? { ...profile, account_status } : profile))
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from("profiles").update({ account_status }).eq("id", id)
      if (error) setMessage("تعذر تحديث حالة الحساب. تحقق من صلاحية المالك في Supabase.")
    }
    setBusyId("")
  }

  const recentActivity = useMemo(() => {
    const contractItems = contracts.slice(0, 6).map((contract) => ({
      id: `c-${contract.id}`,
      title: contract.crop,
      detail: `${contract.supplier} · ${statusLabel(contract.status)}`,
      stamp: contract.created_at,
      kind: (contract.kind || "sale") === "purchase" ? "عقد شراء" : "عقد بيع",
    }))
    const statementItems = statements.slice(0, 6).map((row) => ({
      id: `s-${row.id}`,
      title: row.item || row.party || row.serial || "بيان",
      detail: row.statement_type === "cash" ? formatMoney(Number(row.amount || 0)) : `${row.quantity || "—"}`,
      stamp: row.created_at,
      kind: row.statement_type === "cash" ? (row.cash_type === "payment" ? "سند صرف" : "سند قبض") : "تسليم / استلام",
    }))
    return [...contractItems, ...statementItems].sort((a, b) => String(b.stamp || "").localeCompare(String(a.stamp || ""))).slice(0, 8)
  }, [contracts, statements])

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 p-3 pb-24 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <div>
            <p className="text-xs font-bold text-emerald-800">ContCrops · إدارة المنصة</p>
            <h1 className="mt-1 text-xl font-black">لوحة الإدارة الرئيسية</h1>
            <p className="mt-1 text-[11px] leading-5 text-slate-500">إحصاءات الحسابات والعقود وبيانات الحركة والنقدية مربوطة بقاعدة Supabase.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard" className="inline-flex h-11 items-center rounded-xl bg-emerald-50 px-3 text-xs font-bold text-emerald-900">عقودك وبياناتك</Link>
            <Link href="/" className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-100 px-3 text-xs font-bold text-slate-700">المنصة <ArrowLeft size={15} /></Link>
          </div>
        </header>

        {message && <p role="status" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">{message}</p>}
        {!owner && !loading && <p className="mt-4 rounded-xl border border-emerald-100 bg-white p-3 text-xs leading-5 text-slate-600">تُعرض البيانات المتاحة لحسابك. لصلاحيات المالك الكاملة اضبط <b>role = admin</b> في جدول profiles أو أضف بريدك إلى NEXT_PUBLIC_ADMIN_EMAILS.</p>}

        <section className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-6">
          {stats.map((stat) => (
            <article key={stat.label} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-bold text-slate-500">{stat.label}</p>
                <span className="text-emerald-800">{stat.icon}</span>
              </div>
              <p className="mt-3 break-words text-xl font-black text-slate-900 sm:text-2xl">{loading ? "…" : stat.value}</p>
              <p className="mt-1 truncate text-[10px] text-slate-400">{stat.note}</p>
            </article>
          ))}
        </section>

        <section className="mt-4 grid gap-3 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold text-slate-500">الحسابات النشطة</p><p className="mt-2 text-2xl font-black text-emerald-800">{activeAccounts}</p></article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold text-slate-500">قيد المراجعة</p><p className="mt-2 text-2xl font-black text-amber-600">{pendingAccounts}</p></article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold text-slate-500">موقوفون</p><p className="mt-2 text-2xl font-black text-rose-600">{suspendedAccounts}</p></article>
        </section>

        <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { href: "/admin/colleagues", label: "إدارة الزملاء", detail: `${profiles.length} ملف`, icon: <UsersRound size={18} /> },
            { href: "/dashboard/contracts", label: "نماذج العقود", detail: `${contracts.length} عقد · ${formatMoney(contractValue)}`, icon: <ClipboardList size={18} /> },
            { href: "/dashboard/statements?type=produce", label: "الاستلام والتسليم", detail: `${produceStatements.length} بيان حركة`, icon: <Warehouse size={18} /> },
            { href: "/dashboard/statements?type=cash", label: "النقدية", detail: `${cashStatements.length} سند`, icon: <Banknote size={18} /> },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="flex min-h-24 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 hover:border-emerald-300 hover:bg-emerald-50/50">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">{link.icon}</span>
              <span className="min-w-0"><span className="block text-sm font-extrabold">{link.label}</span><span className="mt-1 block text-[11px] text-slate-500">{link.detail}</span></span>
            </Link>
          ))}
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-4">
            <h2 className="text-sm font-extrabold">النشاط العام للمنصة</h2>
            <p className="mt-1 text-[11px] text-slate-500">محاصيل {contentCounts.crops} · طلبات شراء {contentCounts.rfqs} · مقالات {contentCounts.articles} · نقاشات {contentCounts.discussions}</p>
          </div>
          <div className="divide-y divide-slate-100">
            {recentActivity.length ? recentActivity.map((item) => (
              <article key={item.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div className="min-w-0"><p className="truncate text-xs font-bold text-slate-800">{item.title}</p><p className="mt-1 text-[10px] text-slate-500">{item.detail}</p></div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-800">{item.kind}</span>
              </article>
            )) : <p className="px-4 py-8 text-center text-xs text-slate-500">{loading ? "جارٍ التحميل..." : "لا يوجد نشاط مسجّل بعد."}</p>}
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
            <div><h2 className="text-sm font-extrabold">العقود</h2><p className="mt-1 text-[11px] text-slate-500">بيع وشراء مع الحالة والقيمة</p></div>
            <Link href="/dashboard/contract" className="inline-flex h-11 items-center rounded-lg bg-[#064E3B] px-3 text-xs font-bold text-white">كتابة عقد</Link>
          </div>
          <ResponsiveDataList
            empty="لا توجد عقود محفوظة."
            rows={contracts.slice(0, 12)}
            columns={[
              { key: "crop", label: "المحصول / العقد", render: (row) => <span className="font-extrabold">{row.crop}<span className="mt-1 block text-[10px] font-normal text-slate-500">{row.supplier}</span></span> },
              { key: "kind", label: "النوع", render: (row) => (row.kind || "sale") === "purchase" ? "شراء" : "بيع" },
              { key: "quantity", label: "الكمية" },
              { key: "price", label: "القيمة", render: (row) => formatMoney(Number(row.price || 0)) },
              { key: "status", label: "الحالة", render: (row) => <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] text-amber-800">{statusLabel(row.status)}</span> },
            ]}
          />
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-4">
            <h2 className="text-sm font-extrabold">طلبات التسليم والاستلام والنقدية</h2>
          </div>
          <ResponsiveDataList
            empty="لا توجد بيانات حركة بعد. أنشئ بيانًا من الاستلام/التسليم أو سند النقدية."
            rows={statements.slice(0, 12)}
            columns={[
              { key: "serial", label: "المستند", render: (row) => row.serial || row.id },
              { key: "statement_type", label: "النوع", render: (row) => row.statement_type === "cash" ? (row.cash_type === "payment" ? "صرف" : "قبض") : "تسليم / استلام" },
              { key: "party", label: "الطرف", render: (row) => row.party || "—" },
              { key: "item", label: "البند", render: (row) => row.item || "نقدية" },
              { key: "amount", label: "الكمية / المبلغ", render: (row) => row.statement_type === "cash" ? formatMoney(Number(row.amount || 0)) : String(row.quantity || "—") },
            ]}
          />
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2 border-b border-slate-100 p-4">
            <ShieldCheck size={16} className="text-emerald-800" />
            <div><h2 className="text-sm font-extrabold">إدارة حالات الحسابات</h2><p className="mt-1 text-[11px] text-slate-500">تفعيل أو إيقاف ملفات الأعضاء</p></div>
          </div>
          <ResponsiveDataList
            empty="لا توجد ملفات في جدول profiles."
            rows={profiles.slice(0, 20)}
            columns={[
              { key: "display_name", label: "العضو", render: (row) => <span className="font-extrabold">{row.display_name}<span className="mt-1 block text-[10px] font-normal text-slate-500">{row.city} · {inferAccountRole(row) === "trader" ? "تاجر" : "مزارع"}</span></span> },
              { key: "specialty", label: "التخصص" },
              { key: "account_status", label: "الحالة", render: (row) => statusLabel(row.account_status) },
              {
                key: "actions",
                label: "إجراء",
                render: (row) => (
                  <div className="flex flex-wrap justify-end gap-2">
                    {(["active", "pending", "suspended"] as const).map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={busyId === row.id || row.account_status === status}
                        onClick={() => updateAccountStatus(row.id, status)}
                        className={`min-h-10 rounded-full px-3 text-[10px] font-bold ${row.account_status === status ? "bg-emerald-800 text-white" : "bg-slate-100 text-slate-600"}`}
                      >
                        {statusLabel(status)}
                      </button>
                    ))}
                  </div>
                ),
              },
            ]}
          />
        </section>
      </div>
    </main>
  )
}
