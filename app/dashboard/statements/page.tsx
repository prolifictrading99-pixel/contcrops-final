"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Download, FileText, Leaf } from "lucide-react";

type StatementType = "produce" | "cash";
type StatementForm = {
  serial: string; date: string; party: string; counterparty: string; item: string;
  variety: string; quantity: string; unit: string; condition: string; location: string;
  amount: string; method: string; reason: string; reference: string; notes: string;
};

const initialForm: StatementForm = {
  serial: "", date: "", party: "", counterparty: "", item: "", variety: "", quantity: "",
  unit: "طن", condition: "جيد", location: "", amount: "", method: "نقداً", reason: "", reference: "", notes: "",
};

function InputField({ label, value, onChange, type = "text", required = false }: {
  label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean;
}) {
  return <label className="block min-w-0"><span className="mb-1.5 block text-xs font-bold text-slate-700">{label}{required && <span className="text-rose-600"> *</span>}</span><input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10"/></label>;
}

export default function StatementsPage() {
  const [type, setType] = useState<StatementType>("produce");
  const [cashType, setCashType] = useState<"receipt" | "payment">("receipt");
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("type") === "cash") setType("cash");
    setForm((current) => ({
      ...current,
      serial: `CC-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      date: new Date().toISOString().slice(0, 10),
    }));
  }, []);

  const update = (key: keyof StatementForm, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const printStatement = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); window.print(); };
  const title = type === "produce" ? "بيان استلام / تسليم محصول أو منتج زراعي" : cashType === "receipt" ? "سند قبض نقدية" : "سند صرف نقدية";
  const formattedDate = form.date ? new Intl.DateTimeFormat("ar-EG", { dateStyle: "long" }).format(new Date(`${form.date}T12:00:00`)) : "—";
  const valueLine = (label: string, value: string) => <div className="flex gap-2 border-b border-[#dbe9df] py-2 text-xs leading-5"><b className="shrink-0 text-[#064E3B]">{label}</b><span className="break-words text-slate-800">{value || "غير محدد"}</span></div>;

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 p-4 pb-20 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <header className="statement-no-print flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800"><FileText size={20}/></span><div><p className="text-xs font-bold text-emerald-800">ContCrops · النماذج</p><h1 className="mt-1 text-xl font-black">البيانات والسندات</h1></div></div>
          <div className="flex items-center gap-2"><Link href="/admin" className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-100 px-3 text-xs font-bold text-slate-700 hover:bg-emerald-50"><ArrowRight size={15}/> لوحة التحكم</Link><button type="submit" form="statement-form" className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#064E3B] px-4 text-xs font-bold text-white hover:bg-emerald-900"><Download size={15}/> طباعة / PDF</button></div>
        </header>
        <div className="mt-4 grid gap-5 xl:grid-cols-[minmax(330px,0.82fr)_minmax(520px,1.18fr)]">
          <section className="statement-no-print overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 p-4"><h2 className="text-sm font-extrabold">بيانات النموذج</h2><div className="mt-3 grid grid-cols-2 gap-2" role="tablist" aria-label="نوع البيان">
              {([{ value: "produce", label: "استلام / تسليم" }, { value: "cash", label: "بيان نقدية" }] as const).map((option) => <button key={option.value} type="button" role="tab" aria-selected={type === option.value} onClick={() => setType(option.value)} className={`h-10 rounded-lg border px-3 text-xs font-bold ${type === option.value ? "border-[#064E3B] bg-[#064E3B] text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-emerald-50"}`}>{option.label}</button>)}
            </div></div>
            <form id="statement-form" onSubmit={printStatement} className="space-y-4 p-4">
              {type === "cash" && <div className="grid grid-cols-2 gap-2" aria-label="نوع السند">{([{ value: "receipt", label: "سند قبض" }, { value: "payment", label: "سند صرف" }] as const).map((option) => <button key={option.value} type="button" aria-pressed={cashType === option.value} onClick={() => setCashType(option.value)} className={`h-9 rounded-lg border text-xs font-bold ${cashType === option.value ? "border-emerald-700 bg-emerald-50 text-emerald-900" : "border-slate-200 text-slate-600"}`}>{option.label}</button>)}</div>}
              <div className="grid gap-3 sm:grid-cols-2">
                <InputField label="رقم المستند" value={form.serial} onChange={(value) => update("serial", value)} required/><InputField label="التاريخ" type="date" value={form.date} onChange={(value) => update("date", value)} required/>
                {type === "produce" ? <>
                  <InputField label="المسلِّم" value={form.party} onChange={(value) => update("party", value)} required/><InputField label="المستلم" value={form.counterparty} onChange={(value) => update("counterparty", value)} required/>
                  <InputField label="المحصول / المنتج" value={form.item} onChange={(value) => update("item", value)} required/><InputField label="الصنف" value={form.variety} onChange={(value) => update("variety", value)}/>
                  <InputField label="الكمية" type="number" value={form.quantity} onChange={(value) => update("quantity", value)} required/><label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-700">الوحدة</span><select value={form.unit} onChange={(event) => update("unit", event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-700"><option>طن</option><option>كجم</option><option>صندوق</option><option>عبوة</option><option>قطعة</option></select></label>
                  <InputField label="حالة المنتج عند التسليم" value={form.condition} onChange={(value) => update("condition", value)}/><InputField label="مكان الاستلام / التسليم" value={form.location} onChange={(value) => update("location", value)} required/>
                </> : <>
                  <InputField label={cashType === "receipt" ? "استلمت من" : "صُرفت إلى"} value={form.party} onChange={(value) => update("party", value)} required/><InputField label="المبلغ (جنيه مصري)" type="number" value={form.amount} onChange={(value) => update("amount", value)} required/>
                  <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-700">طريقة الدفع</span><select value={form.method} onChange={(event) => update("method", event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-700"><option>نقداً</option><option>تحويل بنكي</option><option>محفظة إلكترونية</option><option>شيك</option></select></label><InputField label="رقم مرجعي / رقم الشيك" value={form.reference} onChange={(value) => update("reference", value)}/>
                  <div className="sm:col-span-2"><InputField label="وذلك عن" value={form.reason} onChange={(value) => update("reason", value)} required/></div>
                </>}
              </div>
              <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-700">ملاحظات إضافية</span><textarea rows={3} value={form.notes} onChange={(event) => update("notes", event.target.value)} className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10"/></label>
              <div className="border-t border-slate-100 pt-3"><p className="text-[11px] leading-5 text-slate-500">تفتح الطباعة لمعاينة المستند؛ اختر «حفظ بتنسيق PDF» للحصول على نسخة رقمية.</p><button type="submit" className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#064E3B] px-4 text-sm font-bold text-white hover:bg-emerald-900"><Download size={16}/> معاينة وطباعة البيان</button></div>
            </form>
          </section>
          <section className="min-w-0"><div className="statement-no-print mb-3 flex items-center justify-between"><div><h2 className="text-sm font-extrabold text-emerald-900">معاينة مباشرة</h2><p className="mt-1 text-[11px] text-slate-500">تتحدث المعاينة مع إدخال البيانات</p></div><span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-bold text-emerald-900">A4 · {type === "produce" ? "بيان حركة" : "سند نقدية"}</span></div>
            <article className="statement-print-root mx-auto flex min-h-[720px] w-full max-w-[720px] flex-col border border-[#dce8df] bg-white px-6 py-7 shadow-sm sm:px-9 sm:py-9">
              <header className="flex items-center justify-between gap-4 border-b-2 border-[#064E3B] pb-4"><div className="flex items-center gap-2.5"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#064E3B] text-white"><Leaf size={20}/></span><div><p className="text-sm font-extrabold text-[#064E3B]">ContCrops</p><p className="mt-1 text-[9px] text-slate-500">منصة التجارة الزراعية</p></div></div><div className="text-left text-[10px] leading-5 text-slate-500"><p>رقم المستند</p><p dir="ltr" className="font-mono font-bold text-[#064E3B]">{form.serial || "—"}</p><p>التاريخ: {formattedDate}</p></div></header>
              <div className="py-7 text-center"><p className="text-[10px] font-bold text-[#064E3B]">مستند تعاملات زراعية</p><h2 className="mt-2 text-xl font-extrabold text-slate-900">{title}</h2></div>
              <section className="space-y-1">{type === "produce" ? <>{valueLine("المسلِّم:", form.party)}{valueLine("المستلم:", form.counterparty)}{valueLine("المحصول / المنتج:", form.item)}{valueLine("الصنف:", form.variety)}{valueLine("الكمية:", form.quantity ? `${form.quantity} ${form.unit}` : "")}{valueLine("الحالة:", form.condition)}{valueLine("المكان:", form.location)}<p className="mt-5 rounded-lg bg-[#F0FDF4] p-3 text-xs leading-6 text-slate-700">أقرّ الطرفان باستلام وتسليم الكمية الموضحة أعلاه بالحالة والمواصفات المبينة في هذا البيان.</p></> : <>{valueLine(cashType === "receipt" ? "استلمت من:" : "صُرفت إلى:", form.party)}{valueLine("المبلغ:", form.amount ? `${Number(form.amount).toLocaleString("ar-EG")} جنيه مصري` : "")}{valueLine("طريقة الدفع:", form.method)}{valueLine("رقم مرجعي:", form.reference)}{valueLine("وذلك عن:", form.reason)}<p className="mt-5 rounded-lg bg-[#F0FDF4] p-3 text-xs leading-6 text-slate-700">أقرّ {cashType === "receipt" ? "باستلام" : "بصرف"} المبلغ الموضح أعلاه مقابل البيان المذكور.</p></>}{form.notes && valueLine("ملاحظات:", form.notes)}</section>
              <section className="mt-auto grid grid-cols-2 gap-6 pt-12 text-center text-xs"><div><p className="font-bold text-[#064E3B]">توقيع الطرف الأول</p><div className="mt-12 border-b border-dashed border-slate-400"/></div><div><p className="font-bold text-[#064E3B]">توقيع الطرف الثاني</p><div className="mt-12 border-b border-dashed border-slate-400"/></div></section>
              <footer className="mt-6 flex items-center justify-between border-t border-[#cfe5d5] pt-3 text-[9px] text-slate-500"><span className="font-bold text-[#064E3B]">ContCrops · التعاملات الزراعية</span><span>رقم المستند: {form.serial || "—"}</span></footer>
            </article>
          </section>
        </div>
      </div>
    </main>
  );
}