"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Banknote,
  ClipboardList,
  Leaf,
  Store,
  Truck,
  UsersRound,
  Warehouse,
} from "lucide-react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
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
    return Array.isArray(value)? value : []
  } catch {
    return []
  }
}

function statusLabel(status?: string) {
  if (status === "active") return "نشط"
  if (status === "cancelled" || status === "suspended") return "موقوف"
  if (status === "pending" || status === "review") return "قيد المراجعة"
  return "مسجل"
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
        setMessage("Supabase غير متصل؛ تعرض البيانات المحفوظة على هذا الجهاز.")
        setLoading(false)
        return
      }

      try {
        const { data: { user } } = await supabase.auth.getUser()
        const { data: ownProfile } = user
         ? await supabase.from("profiles").select("id,role,display_name").eq("id", user.id).maybeSingle()
          : { data: null }

        const ownerAccess = isPlatformOwner({
          email: user?.email,
          role: ownProfile?.role,
          user_metadata: user?.user_metadata,
        })
        if (mounted) setOwner(ownerAccess ||!user)

        const [profilesRes, contractsRes, statementsRes, contentRes] = await Promise.all([
          supabase.from("profiles").select("id,display_name,city,specialty,role,account_status,updated_at").order("updated_at", { ascending: false }).limit(200),
          supabase.from("contracts").select("id,supplier,crop,quantity,price,status,kind,delivery_date,created_at").order("created_at", { ascending: false }).limit(200),
          supabase.from("platform_statements").select("id,statement_type,cash_type,serial,party,item,amount,quantity,status,created_at").order("created_at", { ascending: false }).limit(200),
          supabase.from("platform_content").select("content_type"),
        ])

        if (!mounted) return
        if (profilesRes.error) console.error("profiles error:", profilesRes.error)
        if (contractsRes.error) console.error("contracts error:", contractsRes.error)
        if (statementsRes.error) console.error("statements error:", statementsRes.error)

        if (profilesRes.error || contractsRes.error || statementsRes.error) {
          setMessage("تعذر تحميل بعض بيانات الادارة. تاكد من RLS والاعمدة في Supabase.")
        }

        setProfiles((profilesRes.data || []) as ProfileRow[])
        setContracts(((contractsRes.data || []) as ContractRow[]).length? (contractsRes.data as ContractRow[]) : localContracts)
        setStatements(((statementsRes.data || []) as StatementRow[]).length? (statementsRes.data as StatementRow[]) : localStatements)

        const counts = { crops: 0, rfqs: 0, discussions: 0, articles: 0 }
        for (const row of contentRes.data || []) {
          if (row.content_type === "crop") counts.crops += 1
          if (row.content_type === "rfq") counts.rfqs += 1
          if (row.content_type === "discussion") counts.discussions += 1
          if (row.content_type === "article") counts.articles += 1
        }
        setContentCounts(counts)
      } catch (e) {
        console.error("Admin load failed:", e)
        setContracts(localContracts)
        setStatements(localStatements)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    void load()
    return () => { mounted = false }
  }, [])

  const farmers = profiles.filter((p) => inferAccountRole(p) === "farmer").length
  const traders = profiles.filter((p) => inferAccountRole(p) === "trader").length
  const saleContracts = contracts.filter((c) => (c.kind || "sale") === "sale")
  const purchaseContracts = contracts.filter((c) => c.kind === "purchase")
  const produceStatements = statements.filter((r) => r.statement_type === "produce")
  const cashStatements = statements.filter((r) => r.statement_type === "cash")
  const cashIn = cashStatements.filter((r) => r.cash_type!== "payment").reduce((s, r) => s + Number(r.amount || 0), 0)
  const cashOut = cashStatements.filter((r) => r.cash_type === "payment").reduce((s, r) => s + Number(r.amount || 0), 0)
  const contractValue = contracts.reduce((s, r) => s + Number(r.price || 0) * Number(r.quantity || 1), 0)
  const activeAccounts = profiles.filter((p) => (p.account_status || "active") === "active").length
  const pendingAccounts = profiles.filter((p) => p.account_status === "pending").length
  const suspendedAccounts = profiles.filter((p) => p.account_status === "suspended").length

  const stats = [
    { label: "المزارعون", value: farmers || profiles.length, icon: <Leaf size={18} />, note: "حسابات زراعية" },
    { label: "التجار", value: traders, icon: <Store size={18} />, note: "مشترون ومصدرون" },
    { label: "عقود البيع", value: saleContracts.length, icon: <ClipboardList size={18} />, note: formatMoney(saleContracts.reduce((s, r) => s + Number(r.price || 0), 0)) },
    { label: "عقود الشراء", value: purchaseContracts.length, icon: <Truck size={18} />, note: `${purchaseContracts.length} عقد توريد` },
    { label: "بيانات التسليم", value: produceStatements.length, icon: <Warehouse size={18} />, note: "استلام / تسليم" },
    { label: "صافي النقدية", value: formatMoney(cashIn - cashOut), icon: <Banknote size={18} />, note: `قبض ${formatMoney(cashIn)}` },
  ]

  const updateAccountStatus = async (id: string, account_status: string) => {
    setBusyId(id)
    setProfiles((curr) => curr.map((p) => p.id === id? {...p, account_status } : p))
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from("profiles").update({ account_status }).eq("id", id)
      if (error) setMessage("تعذر تحديث حالة الحساب.")
    }
    setBusyId("")
  }

  const recentActivity = useMemo(() => {
    const contractItems = contracts.slice(0, 6).map((c) => ({
      id: `c-${c.id}`,
      title: c.crop,
      detail: `${c.supplier} - ${statusLabel(c.status)}`,
      stamp: c.created_at,
      kind: (c.kind || "sale") === "purchase"? "عقد شراء" : "عقد بيع",
    }))
    const statementItems = statements.slice(0, 6).map((r) => ({
      id: `s-${r.id}`,
      title: r.item || r.party || r.serial || "بيان",
      detail: r.statement_type === "cash"? formatMoney(Number(r.amount || 0)) : `${r.quantity || "-"}`,
      stamp: r.created_at,
      kind: r.statement_type === "cash"? (r.cash_type === "payment"? "سند صرف" : "سند قبض") : "تسليم / استلام",
    }))
    return [...contractItems,...statementItems].sort((a, b) => String(b.stamp || "").localeCompare(String(a.stamp || ""))).slice(0, 8)
  }, [contracts, statements])

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 p-3 pb-24 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <div>
            <p className="text-xs font-bold text-emerald-800">ContCrops - ادارة المنصة</p>
            <h1 className="mt-1 text-xl font-black">لوحة الادارة الرئيسية</h1>
            <p className="mt-1 text- leading-5 text-slate-500">احصاءات الحسابات والعقود وبيانات الحركة والنقدية مربوطة بقاعدة Supabase.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard" className="inline-flex h-11 items-center rounded-xl bg-emerald-50 px-3 text-xs font-bold text-emerald-900">عقودك وبياناتك</Link>
            <Link href="/" className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-100 px-3 text-xs font-bold text-slate-700">المنصة <ArrowLeft size={15} /></Link>
          </div>
        </header>

        {message && <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">{message}</p>}
        {!owner &&!loading && <p className="mt-4 rounded-xl border border-emerald-100 bg-white p-3 text-xs leading-5 text-slate-600">تعرض البيانات المتاحة لحسابك. لصلاحيات المالك الكاملة اضبط <b>role = admin</b> في جدول profiles.</p>}

        <section className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-6">
          {stats.map((stat) => (
            <article key={stat.label} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text- font-bold text-slate-500">{stat.label}</p>
                <span className="text-emerald-800">{stat.icon}</span>
              </div>
              <p className="mt-3 break-words text-xl font-black text-slate-900 sm:text-2xl">{loading? "..." : stat.value}</p>
              <p className="mt-1 truncate text- text-slate-400">{stat.note}</p>
            </article>
          ))}
        </section>

        <section className="mt-4 grid gap-3 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold text-slate-500">الحسابات النشطة</p><p className="mt-2 text-2xl font-black text-emerald-800">{activeAccounts}</p></article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold text-slate-500">قيد المراجعة</p><p className="mt-2 text-2xl font-black text-amber-600">{pendingAccounts}</p></article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold text-slate-500">موقوفون</p><p className="mt-2 text-2xl font-black text-rose-600">{suspendedAccounts}</p></article>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-4">
            <h2 className="text-sm font-extrabold">النشاط العام للمنصة</h2>
            <p className="mt-1 text- text-slate-500">محاصيل {contentCounts.crops} - طلبات شراء {contentCounts.rfqs} - مقالات {contentCounts.articles} - نقاشات {contentCounts.discussions}</p>
          </div>
          <div className="divide-y divide-slate-100">
            {recentActivity.length? recentActivity.map((item) => (
              <article key={item.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div className="min-w-0"><p className="truncate text-xs font-bold text-slate-800">{item.title}</p><p className="mt-1 text- text-slate-500">{item.detail}</p></div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text- font-bold text-emerald-800">{item.kind}</span>
              </article>
            )) : <p className="px-4 py-8 text-center text-xs text-slate-500">{loading? "جار التحميل..." : "لا يوجد نشاط مسجل بعد."}</p>}
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
            <div><h2 className="text-sm font-extrabold">العقود</h2><p className="mt-1 text- text-slate-500">بيع وشراء مع الحالة والقيمة</p></div>
            <Link href="/dashboard/contract" className="inline-flex h-11 items-center rounded-lg bg-[#064E3B] px-3 text-xs font-bold text-white">كتابة عقد</Link>
          </div>
          <ResponsiveDataList
            empty="لا توجد عقود محفوظة."
            rows={contracts.slice(0, 12)}
            columns={[
              { key: "crop", label: "المحصول / العقد", render: (row: any) => <span className="font-extrabold">{row.crop}<span className="mt-1 block text- font-normal text-slate-500">{row.supplier}</span></span> },
              { key: "kind", label: "النوع", render: (row: any) => (row.kind || "sale") === "purchase"? "شراء" : "بيع" },
              { key: "quantity", label: "الكمية" },
              { key: "price", label: "القيمة", render: (row: any) => formatMoney(Number(row.price || 0)) },
              { key: "status", label: "الحالة", render: (row: any) => <span className="rounded-full bg-amber-50 px-2 py-1 text- text-amber-800">{statusLabel(row.status)}</span> },
            ]}
          />
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-4">
            <h2 className="text-sm font-extrabold">طلبات التسليم والاستلام والنقدية</h2>
          </div>
          <ResponsiveDataList
            empty="لا توجد بيانات حركة بعد."
            rows={statements.slice(0, 12)}
            columns={[
              { key: "serial", label: "المستند", render: (row: any) => row.serial || row.id },
              { key: "statement_type", label: "النوع", render: (row: any) => row.statement_type === "cash"? (row.cash_type === "payment"? "صرف" : "قبض") : "تسليم / استلام" },
              { key: "party", label: "الطرف", render: (row: any) => row.party || "-" },
              { key: "item", label: "البند", render: (row: any) => row.item || "نقدية" },
              { key: "amount", label: "الكمية / المبلغ", render: (row: any) => row.statement_type === "cash"? formatMoney(Number(row.amount || 0)) : String(row.quantity || "-") },
            ]}
          />
        </section>
      </div>
    </main>
  )
}