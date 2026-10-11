"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FilePlus2 } from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type ContractDraft = {
  supplier: string;
  supplierPhone: string;
  buyer: string;
  buyerPhone: string;
  crop: string;
  quantity: string;
  unit: string;
  quality: string;
  packaging: string;
  price: string;
  paymentMethod: string;
  delivery_date: string;
  terms: string;
};

const initialForm: ContractDraft = {
  supplier: "",
  supplierPhone: "",
  buyer: "",
  buyerPhone: "",
  crop: "",
  quantity: "",
  unit: "طن",
  quality: "",
  packaging: "",
  price: "",
  paymentMethod: "تحويل بنكي",
  delivery_date: "",
  terms: "",
};

export default function WriteContractPage() {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const update = (field: keyof ContractDraft, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const saveContract = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const additionalDetails = [
      form.buyer.trim() && `المشتري: ${form.buyer.trim()}`,
      form.supplierPhone.trim() && `هاتف المورد: ${form.supplierPhone.trim()}`,
      form.buyerPhone.trim() && `هاتف المشتري: ${form.buyerPhone.trim()}`,
      `الوحدة: ${form.unit}`,
      form.quality.trim() && `الجودة / المواصفات: ${form.quality.trim()}`,
      form.packaging.trim() && `التعبئة: ${form.packaging.trim()}`,
      `طريقة السداد: ${form.paymentMethod}`,
    ].filter((detail): detail is string => Boolean(detail));
    const contract = {
      supplier: form.supplier.trim(),
      crop: form.crop.trim(),
      quantity: Number(form.quantity),
      price: Number(form.price),
      delivery_date: form.delivery_date,
      terms: [form.terms.trim(), ...additionalDetails].filter(Boolean).join("\n"),
      status: "review",
    };

    try {
      if (isSupabaseConfigured()) {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error("سجّل الدخول بحساب المنصة لحفظ العقد في Supabase.");

        const { error: insertError } = await supabase
          .from("contracts")
          .insert({ ...contract, created_by: user.id });
        if (insertError) throw insertError;
      } else {
        let saved: Array<Record<string, unknown>> = [];
        try {
          const existing = JSON.parse(localStorage.getItem("contcrops_contracts") || "[]");
          if (Array.isArray(existing)) saved = existing;
        } catch {
          saved = [];
        }
        saved.unshift({ ...contract, id: crypto.randomUUID(), created_at: new Date().toISOString() });
        localStorage.setItem("contcrops_contracts", JSON.stringify(saved));
      }

      setForm(initialForm);
      setToast("تم حفظ العقد بنجاح");
      window.setTimeout(() => setToast(""), 3500);
    } catch (saveError) {
      console.error("Could not save contract", saveError);
      setError(saveError instanceof Error ? saveError.message : "تعذر حفظ العقد. حاول مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10";

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 p-4 pb-20 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800"><FilePlus2 size={20}/></span>
            <div><p className="text-xs font-bold text-emerald-800">ContCrops · العقود</p><h1 className="mt-1 text-lg font-black">كتابة عقد</h1></div>
          </div>
          <Link href="/admin" className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-100 px-3 text-xs font-bold text-slate-700 hover:bg-emerald-50"><ArrowRight size={15}/> لوحة التحكم</Link>
        </header>

        <form onSubmit={saveContract} className="mt-4 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-bold text-slate-700">المورد / الطرف الأول <span className="text-rose-600">*</span><input required value={form.supplier} onChange={(event) => update("supplier", event.target.value)} className={inputClass} placeholder="اسم المورد أو المنشأة" autoComplete="organization"/></label>
            <label className="block text-xs font-bold text-slate-700">هاتف المورد<input type="tel" value={form.supplierPhone} onChange={(event) => update("supplierPhone", event.target.value)} className={inputClass} placeholder="رقم للتواصل" dir="ltr"/></label>
            <label className="block text-xs font-bold text-slate-700">المشتري / الطرف الثاني<input value={form.buyer} onChange={(event) => update("buyer", event.target.value)} className={inputClass} placeholder="اسم المشتري أو المنشأة" autoComplete="organization"/></label>
            <label className="block text-xs font-bold text-slate-700">هاتف المشتري<input type="tel" value={form.buyerPhone} onChange={(event) => update("buyerPhone", event.target.value)} className={inputClass} placeholder="رقم للتواصل" dir="ltr"/></label>
            <label className="block text-xs font-bold text-slate-700">المحصول <span className="text-rose-600">*</span><input required value={form.crop} onChange={(event) => update("crop", event.target.value)} className={inputClass} placeholder="نوع المحصول والصنف"/></label>
            <div className="grid grid-cols-[1fr_110px] gap-2"><label className="block text-xs font-bold text-slate-700">الكمية <span className="text-rose-600">*</span><input required min="0.01" step="any" type="number" value={form.quantity} onChange={(event) => update("quantity", event.target.value)} className={inputClass} placeholder="الكمية"/></label><label className="block text-xs font-bold text-slate-700">الوحدة<select value={form.unit} onChange={(event) => update("unit", event.target.value)} className={inputClass}><option>طن</option><option>كجم</option><option>صندوق</option><option>عبوة</option></select></label></div>
            <label className="block text-xs font-bold text-slate-700">سعر الوحدة (جنيه مصري) <span className="text-rose-600">*</span><input required min="0" step="any" type="number" value={form.price} onChange={(event) => update("price", event.target.value)} className={inputClass} placeholder="سعر الوحدة"/></label>
            <label className="block text-xs font-bold text-slate-700">الجودة / المواصفات<input value={form.quality} onChange={(event) => update("quality", event.target.value)} className={inputClass} placeholder="درجة الفرز أو المواصفة"/></label>
            <label className="block text-xs font-bold text-slate-700">نوع التعبئة<input value={form.packaging} onChange={(event) => update("packaging", event.target.value)} className={inputClass} placeholder="صناديق، شكاير، عبوات..."/></label>
            <label className="block text-xs font-bold text-slate-700">طريقة السداد<select value={form.paymentMethod} onChange={(event) => update("paymentMethod", event.target.value)} className={inputClass}><option>تحويل بنكي</option><option>نقداً</option><option>محفظة إلكترونية</option><option>شيك</option><option>دفعات متفق عليها</option></select></label>
            <label className="block text-xs font-bold text-slate-700 sm:col-span-2">تاريخ التسليم <span className="text-rose-600">*</span><input required type="date" value={form.delivery_date} onChange={(event) => update("delivery_date", event.target.value)} className={inputClass}/></label>
            <label className="block text-xs font-bold text-slate-700 sm:col-span-2">شروط إضافية<textarea value={form.terms} onChange={(event) => update("terms", event.target.value)} rows={4} className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10" placeholder="شروط الدفع والجودة والنقل وغيرها"/></label>
          </div>

          {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-5 text-rose-700">{error}</p>}
          <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="text-[11px] text-slate-500">ستُحفظ تفاصيل الأطراف والمواصفات ضمن شروط العقد، بحالة «قيد المراجعة».</p>
            <button type="submit" disabled={saving} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#064E3B] px-5 text-sm font-bold text-white hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-60">{saving ? "جارٍ الحفظ..." : "حفظ العقد"}</button>
          </div>
        </form>
      </div>

      {toast && <div role="status" className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-[#064E3B] px-4 py-3 text-sm font-bold text-white shadow-lg"><CheckCircle2 size={18}/>{toast}</div>}
    </main>
  );
}