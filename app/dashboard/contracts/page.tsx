"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Download,
  FileCheck2,
  FileText,
  Leaf,
  ShieldCheck,
  Truck,
  Warehouse,
} from "lucide-react";

type ContractType = "crop-sale" | "supply" | "lease";

type ContractFormData = {
  type: ContractType;
  partyAName: string;
  partyAId: string;
  partyAAddress: string;
  partyBName: string;
  partyBId: string;
  partyBAddress: string;
  cropType: string;
  quantity: string;
  unit: string;
  unitPrice: string;
  paymentTerms: string;
  deliveryDate: string;
  deliveryLocation: string;
  facilityType: string;
  facilityLocation: string;
  facilityArea: string;
  leasePeriod: string;
  rent: string;
  deposit: string;
  cancellationPenalty: string;
  disputeResolution: string;
  additionalTerms: string;
};

const initialForm: ContractFormData = {
  type: "crop-sale",
  partyAName: "",
  partyAId: "",
  partyAAddress: "",
  partyBName: "",
  partyBId: "",
  partyBAddress: "",
  cropType: "",
  quantity: "",
  unit: "طن",
  unitPrice: "",
  paymentTerms: "تحويل بنكي خلال 3 أيام عمل من استلام الشحنة.",
  deliveryDate: "",
  deliveryLocation: "",
  facilityType: "مخزن تبريد",
  facilityLocation: "",
  facilityArea: "",
  leasePeriod: "",
  rent: "",
  deposit: "",
  cancellationPenalty: "يلتزم الطرف المتسبب في الإلغاء بتعويض الطرف الآخر عن الأضرار المباشرة المثبتة، بما لا يتجاوز 10% من قيمة العقد.",
  disputeResolution: "يسعى الطرفان إلى التسوية الودية خلال 15 يوماً، وفي حال تعذر ذلك يكون الاختصاص للجهات القضائية المختصة في جمهورية مصر العربية.",
  additionalTerms: "",
};

const contractTypes: { id: ContractType; title: string; description: string; icon: typeof Leaf }[] = [
  { id: "crop-sale", title: "بيع محصول", description: "اتفاق بيع وشراء محصول زراعي", icon: Leaf },
  { id: "supply", title: "توريد زراعي B2B", description: "توريد منتظم بين المنشآت", icon: Truck },
  { id: "lease", title: "إيجار مخزن أو محطة", description: "تأجير منشأة تخزين أو تعبئة", icon: Warehouse },
];

const contractTitles: Record<ContractType, string> = {
  "crop-sale": "عقد بيع محصول زراعي",
  supply: "عقد توريد زراعي بين منشآت",
  lease: "عقد إيجار مخزن تبريد أو محطة تعبئة",
};

function createContractSerial() {
  const token = window.crypto.randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase();
  return `CC-${new Date().getFullYear()}-${token}`;
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  dir,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  dir?: "ltr" | "rtl";
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-xs font-bold text-slate-700">{label}{required && <span className="text-rose-600"> *</span>}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        dir={dir}
        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10"
      />
    </label>
  );
}

function FormSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-xs font-bold text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10"
      >
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function FormNotes({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-slate-700">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10"
      />
    </label>
  );
}

function DocumentLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 gap-2 border-b border-[#dbe9df] py-2 text-[11px] leading-5">
      <span className="shrink-0 font-bold text-[#064E3B]">{label}</span>
      <span className="min-w-0 break-words text-slate-800">{value || "غير محدد"}</span>
    </div>
  );
}

export default function ContractGeneratorPage() {
  const [form, setForm] = useState<ContractFormData>(initialForm);
  const [step, setStep] = useState(1);
  const [serial, setSerial] = useState("CC-2026-PENDING");
  const [contractDate, setContractDate] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setSerial(createContractSerial());
    setContractDate(new Intl.DateTimeFormat("ar-EG", { dateStyle: "long" }).format(new Date()));
  }, []);

  const update = (key: keyof ContractFormData, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setNotice("");
  };

  const advance = () => {
    if (step === 1 && (!form.partyAName.trim() || !form.partyAId.trim() || !form.partyAAddress.trim() || !form.partyBName.trim() || !form.partyBId.trim() || !form.partyBAddress.trim())) {
      setNotice("أكمل بيانات الطرفين المطلوبة قبل المتابعة.");
      return;
    }
    if (step === 2) {
      const missingCropDetails = form.type !== "lease" && (!form.cropType.trim() || !form.quantity.trim() || !form.unitPrice.trim() || !form.deliveryDate || !form.deliveryLocation.trim());
      const missingLeaseDetails = form.type === "lease" && (!form.facilityLocation.trim() || !form.leasePeriod.trim() || !form.rent.trim());
      if (missingCropDetails || missingLeaseDetails) {
        setNotice(form.type === "lease" ? "أكمل موقع المنشأة ومدة الإيجار وقيمة الإيجار." : "أكمل بيانات المحصول والكمية والسعر والتسليم.");
        return;
      }
    }
    setStep((current) => Math.min(3, current + 1));
    setNotice("");
  };

  const printContract = () => window.print();

  const quantityValue = form.quantity ? `${form.quantity} ${form.unit}` : "غير محدد";
  const totalValue = form.quantity && form.unitPrice
    ? `${(Number(form.quantity) * Number(form.unitPrice)).toLocaleString("ar-EG")} جنيه مصري`
    : "غير محدد";

  return (
    <main dir="rtl" className="contract-page min-h-screen bg-[#F0FDF4] text-slate-900">
      <div className="contract-no-print mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#cfe5d5] pb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#064E3B] text-[#F0FDF4]"><Leaf size={22}/></span>
            <div>
              <p className="text-sm font-extrabold text-[#064E3B]">ContCrops</p>
              <p className="mt-0.5 text-xs text-slate-500">مركز العقود الزراعية</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#cfe5d5] bg-white px-3 text-xs font-bold text-[#064E3B] hover:bg-[#F0FDF4]"><ArrowRight size={15}/> السوق</Link>
            <button type="button" onClick={printContract} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#064E3B] px-4 text-xs font-bold text-white hover:bg-[#043c2d]"><Download size={15}/> تنزيل PDF</button>
          </div>
        </header>

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#064E3B]"><ShieldCheck size={14}/> مساحة العقود الموثقة</div>
            <h1 className="text-2xl font-extrabold text-[#064E3B] sm:text-3xl">إنشاء عقد زراعي</h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">أنشئ مسودة واضحة للطرفين، راجع معاينتها، ثم نزّلها للطباعة والتوقيع.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-[#cfe5d5] bg-white px-3 py-2 text-xs text-slate-600">
            <BadgeCheck size={16} className="text-[#064E3B]"/>
            <span>رقم العقد</span><b dir="ltr" className="font-mono text-[#064E3B]">{serial}</b>
          </div>
        </div>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(340px,0.78fr)_minmax(570px,1.22fr)]">
          <section className="overflow-hidden rounded-xl border border-[#cfe5d5] bg-white shadow-sm">
            <div className="border-b border-[#e4eee7] px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div><p className="text-sm font-extrabold text-[#064E3B]">تفاصيل العقد</p><p className="mt-1 text-[11px] text-slate-500">الخطوة {step} من 3</p></div>
                <FileText size={20} className="text-[#064E3B]"/>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-1.5" aria-label="مراحل إعداد العقد">
                {["الأطراف", "الصفقة", "الشروط"].map((label, index) => <div key={label} className={`h-1 rounded-full ${step >= index + 1 ? "bg-[#064E3B]" : "bg-[#e5eee8]"}`} title={label}/>) }
              </div>
            </div>

            <div className="space-y-5 p-5">
              {step === 1 && <>
                <div>
                  <h2 className="text-xs font-extrabold text-slate-800">نوع العقد</h2>
                  <div className="mt-2 grid gap-2">
                    {contractTypes.map(({ id, title, description, icon: Icon }) => <label key={id} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${form.type === id ? "border-[#064E3B] bg-[#F0FDF4] ring-1 ring-[#064E3B]/10" : "border-slate-200 hover:border-[#9fc8ad]"}`}>
                      <input type="radio" name="contractType" value={id} checked={form.type === id} onChange={() => update("type", id)} className="sr-only"/>
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${form.type === id ? "bg-[#064E3B] text-white" : "bg-slate-100 text-slate-500"}`}><Icon size={18}/></span>
                      <span className="min-w-0"><span className="block text-xs font-extrabold text-slate-800">{title}</span><span className="mt-1 block text-[10px] text-slate-500">{description}</span></span>
                    </label>)}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3 rounded-lg bg-[#F0FDF4] p-3">
                    <h2 className="text-xs font-extrabold text-[#064E3B]">الطرف الأول</h2>
                    <FormField label="الاسم / اسم المنشأة" value={form.partyAName} onChange={(value) => update("partyAName", value)} required/>
                    <FormField label="الرقم القومي / السجل التجاري" value={form.partyAId} onChange={(value) => update("partyAId", value)} dir="ltr" required/>
                    <FormField label="العنوان" value={form.partyAAddress} onChange={(value) => update("partyAAddress", value)} required/>
                  </div>
                  <div className="space-y-3 rounded-lg bg-[#F0FDF4] p-3">
                    <h2 className="text-xs font-extrabold text-[#064E3B]">الطرف الثاني</h2>
                    <FormField label="الاسم / اسم المنشأة" value={form.partyBName} onChange={(value) => update("partyBName", value)} required/>
                    <FormField label="الرقم القومي / السجل التجاري" value={form.partyBId} onChange={(value) => update("partyBId", value)} dir="ltr" required/>
                    <FormField label="العنوان" value={form.partyBAddress} onChange={(value) => update("partyBAddress", value)} required/>
                  </div>
                </div>
              </>}

              {step === 2 && (form.type === "lease" ? <>
                <div className="rounded-lg bg-[#F0FDF4] p-3 text-xs font-bold text-[#064E3B]">بيانات المنشأة ومدة الإيجار</div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormSelect label="نوع المنشأة" value={form.facilityType} onChange={(value) => update("facilityType", value)} options={["مخزن تبريد", "محطة تعبئة", "مخزن جاف", "منشأة زراعية أخرى"]}/>
                  <FormField label="المساحة (م²)" value={form.facilityArea} onChange={(value) => update("facilityArea", value)} type="number" placeholder="مثال: 500"/>
                  <FormField label="موقع المنشأة" value={form.facilityLocation} onChange={(value) => update("facilityLocation", value)} required/>
                  <FormField label="مدة الإيجار" value={form.leasePeriod} onChange={(value) => update("leasePeriod", value)} placeholder="مثال: 12 شهراً" required/>
                  <FormField label="قيمة الإيجار (جنيه)" value={form.rent} onChange={(value) => update("rent", value)} type="number" required/>
                  <FormField label="مبلغ التأمين (جنيه)" value={form.deposit} onChange={(value) => update("deposit", value)} type="number"/>
                  <FormField label="تاريخ بدء العقد" value={form.deliveryDate} onChange={(value) => update("deliveryDate", value)} type="date"/>
                </div>
                <FormNotes label="مواعيد وطريقة سداد الإيجار" value={form.paymentTerms} onChange={(value) => update("paymentTerms", value)}/>
              </> : <>
                <div className="rounded-lg bg-[#F0FDF4] p-3 text-xs font-bold text-[#064E3B]">المحصول والكميات والتسليم</div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="نوع المحصول / الصنف" value={form.cropType} onChange={(value) => update("cropType", value)} placeholder="مثال: بطاطس سبونتا" required/>
                  <div className="grid grid-cols-[1fr_105px] gap-2">
                    <FormField label="الكمية" value={form.quantity} onChange={(value) => update("quantity", value)} type="number" required/>
                    <FormSelect label="الوحدة" value={form.unit} onChange={(value) => update("unit", value)} options={["طن", "كجم", "صندوق", "عبوة"]}/>
                  </div>
                  <FormField label="سعر الوحدة (جنيه)" value={form.unitPrice} onChange={(value) => update("unitPrice", value)} type="number" required/>
                  <FormField label="موعد التسليم" value={form.deliveryDate} onChange={(value) => update("deliveryDate", value)} type="date" required/>
                  <FormField label="مكان التسليم" value={form.deliveryLocation} onChange={(value) => update("deliveryLocation", value)} required/>
                </div>
                <FormNotes label="شروط الدفع" value={form.paymentTerms} onChange={(value) => update("paymentTerms", value)}/>
              </>)}

              {step === 3 && <>
                <div className="rounded-lg bg-[#F0FDF4] p-3 text-xs font-bold text-[#064E3B]">الأحكام والشروط القانونية</div>
                <FormNotes label="غرامة الإلغاء أو الإخلال" value={form.cancellationPenalty} onChange={(value) => update("cancellationPenalty", value)} rows={4}/>
                <FormNotes label="فض النزاعات والقانون المختص" value={form.disputeResolution} onChange={(value) => update("disputeResolution", value)} rows={4}/>
                <FormNotes label="شروط إضافية (اختياري)" value={form.additionalTerms} onChange={(value) => update("additionalTerms", value)} rows={3}/>
                <div className="flex items-start gap-2 rounded-lg border border-[#cfe5d5] p-3 text-[11px] leading-5 text-slate-600"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#064E3B]"/><p>هذه المسودة أداة لتنظيم الاتفاق ولا تُعد استشارة قانونية. راجع العقد مع مختص قبل التوقيع، وتحقق من مستندات وهوية الأطراف.</p></div>
              </>}

              {notice && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">{notice}</p>}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <button type="button" onClick={() => { setStep((current) => Math.max(1, current - 1)); setNotice(""); }} disabled={step === 1} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:invisible"><ArrowRight size={15}/> السابق</button>
                {step < 3 ? <button type="button" onClick={advance} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#064E3B] px-4 text-xs font-bold text-white hover:bg-[#043c2d]">التالي <ArrowLeft size={15}/></button> : <button type="button" onClick={printContract} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#064E3B] px-4 text-xs font-bold text-white hover:bg-[#043c2d]"><Download size={15}/> تنزيل PDF</button>}
              </div>
            </div>
          </section>

          <section className="min-w-0" aria-label="معاينة العقد">
            <div className="contract-no-print mb-3 flex items-center justify-between gap-3">
              <div><h2 className="text-sm font-extrabold text-[#064E3B]">معاينة مباشرة</h2><p className="mt-1 text-[11px] text-slate-500">تظهر التغييرات هنا فور إدخالها</p></div>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[#cfe5d5] bg-white px-2.5 py-1.5 text-[10px] font-bold text-[#064E3B]"><FileCheck2 size={13}/> A4 · مسودة</span>
            </div>

            <article className="contract-print-root mx-auto flex min-h-[780px] w-full max-w-[720px] flex-col border border-[#dce8df] bg-white px-6 py-7 shadow-[0_10px_40px_rgba(6,78,59,0.09)] sm:px-9 sm:py-9">
              <header className="flex items-start justify-between gap-4 border-b-2 border-[#064E3B] pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#064E3B] text-[#F0FDF4]"><Leaf size={20}/></span>
                  <div><p className="text-sm font-extrabold text-[#064E3B]">ContCrops</p><p className="mt-0.5 text-[9px] text-slate-500">منصة موثوقة للتجارة الزراعية</p></div>
                </div>
                <div className="text-left text-[9px] leading-5 text-slate-500">
                  <p>رقم العقد</p><p dir="ltr" className="font-mono font-bold text-[#064E3B]">{serial}</p>
                  <p className="mt-1">تاريخ الإصدار: {contractDate || "—"}</p>
                </div>
              </header>

              <div className="py-5 text-center">
                <p className="text-[9px] font-bold text-[#064E3B]">عقد زراعي · مسودة قابلة للطباعة</p>
                <h2 className="mt-1.5 text-base font-extrabold text-slate-900 sm:text-lg">{contractTitles[form.type]}</h2>
                <p className="mt-2 text-[10px] leading-5 text-slate-600">إنه في يوم {contractDate || "................"}، تم الاتفاق والتراضي بين الطرفين الموضحين أدناه على البنود التالية:</p>
              </div>

              <section className="grid grid-cols-2 gap-3">
                {[{ title: "الطرف الأول", name: form.partyAName, id: form.partyAId, address: form.partyAAddress }, { title: "الطرف الثاني", name: form.partyBName, id: form.partyBId, address: form.partyBAddress }].map((party) => <div key={party.title} className="rounded-md border border-[#dbe9df] bg-[#F0FDF4] p-3">
                  <h3 className="mb-1 border-b border-[#cfe5d5] pb-1.5 text-[10px] font-extrabold text-[#064E3B]">{party.title}</h3>
                  <DocumentLine label="الاسم:" value={party.name}/>
                  <DocumentLine label="الرقم:" value={party.id}/>
                  <DocumentLine label="العنوان:" value={party.address}/>
                </div>)}
              </section>

              <section className="mt-4">
                <h3 className="mb-1 border-r-[3px] border-[#064E3B] pr-2 text-[11px] font-extrabold text-[#064E3B]">موضوع العقد ومواصفاته</h3>
                {form.type === "lease" ? <div className="grid grid-cols-2 gap-x-5">
                  <DocumentLine label="المنشأة:" value={form.facilityType}/>
                  <DocumentLine label="المساحة:" value={form.facilityArea ? `${form.facilityArea} م²` : "غير محدد"}/>
                  <DocumentLine label="الموقع:" value={form.facilityLocation}/>
                  <DocumentLine label="المدة:" value={form.leasePeriod}/>
                  <DocumentLine label="الإيجار:" value={form.rent ? `${Number(form.rent).toLocaleString("ar-EG")} جنيه مصري` : "غير محدد"}/>
                  <DocumentLine label="التأمين:" value={form.deposit ? `${Number(form.deposit).toLocaleString("ar-EG")} جنيه مصري` : "غير محدد"}/>
                  <DocumentLine label="بدء العقد:" value={form.deliveryDate || "غير محدد"}/>
                  <DocumentLine label="السداد:" value={form.paymentTerms}/>
                </div> : <div className="grid grid-cols-2 gap-x-5">
                  <DocumentLine label="المحصول:" value={form.cropType}/>
                  <DocumentLine label="الكمية:" value={quantityValue}/>
                  <DocumentLine label="سعر الوحدة:" value={form.unitPrice ? `${Number(form.unitPrice).toLocaleString("ar-EG")} جنيه` : "غير محدد"}/>
                  <DocumentLine label="القيمة التقديرية:" value={totalValue}/>
                  <DocumentLine label="موعد التسليم:" value={form.deliveryDate || "غير محدد"}/>
                  <DocumentLine label="مكان التسليم:" value={form.deliveryLocation}/>
                  <div className="col-span-2"><DocumentLine label="شروط الدفع:" value={form.paymentTerms}/></div>
                </div>}
              </section>

              <section className="mt-4 space-y-2.5 text-[9px] leading-[1.75] text-slate-700">
                <h3 className="border-r-[3px] border-[#064E3B] pr-2 text-[11px] font-extrabold text-[#064E3B]">الشروط والأحكام</h3>
                <p><b className="text-slate-900">أولاً ـ التزامات الطرفين:</b> يلتزم كل طرف بتنفيذ ما ورد في هذا العقد بحسن نية، ويقر بصحة البيانات والمستندات المقدمة منه. ويقر الطرفان بأن المواصفات والكميات ومواعيد التسليم أو الانتفاع المبينة أعلاه جزء لا يتجزأ من الاتفاق.</p>
                <p><b className="text-slate-900">ثانياً ـ المقابل والسداد:</b> يتم السداد وفق الشروط المحددة في هذا العقد، وبالوسيلة المتفق عليها بين الطرفين، مع إثبات أي دفعات أو استلامات بمستند مكتوب موقع.</p>
                <p><b className="text-slate-900">ثالثاً ـ الإلغاء والإخلال:</b> {form.cancellationPenalty || "تطبق أحكام القانون والاتفاق المكتوب بين الطرفين."}</p>
                <p><b className="text-slate-900">رابعاً ـ فض النزاعات:</b> {form.disputeResolution || "تطبق القواعد القانونية المختصة في جمهورية مصر العربية."}</p>
                {form.additionalTerms && <p><b className="text-slate-900">خامساً ـ شروط إضافية:</b> {form.additionalTerms}</p>}
                <p>حرر هذا العقد من نسختين أصليتين باللغة العربية، تسلم كل طرف نسخة للعمل بموجبها، وبعد الاطلاع والقبول تم التوقيع أدناه.</p>
              </section>

              <section className="mt-auto pt-5">
                <div className="grid grid-cols-2 gap-4">
                  {[{ title: "توقيع الطرف الأول", name: form.partyAName }, { title: "توقيع الطرف الثاني", name: form.partyBName }].map((party) => <div key={party.title} className="rounded-md border border-[#cfe5d5] p-2.5">
                    <h3 className="text-[10px] font-extrabold text-[#064E3B]">{party.title}</h3>
                    <p className="mt-1 text-[9px] text-slate-600">{party.name || "الاسم: ................................"}</p>
                    <div className="mt-2 h-8 border-b border-dashed border-slate-400"/>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-[8px] text-slate-500">بصمة الإبهام</span>
                      <span className="h-10 w-10 rounded border border-dashed border-slate-400" aria-label="مربع بصمة الإبهام"/>
                    </div>
                  </div>)}
                </div>
              </section>

              <footer className="mt-4 flex items-center justify-between border-t border-[#cfe5d5] pt-2 text-[8px] text-slate-500">
                <span className="font-extrabold text-[#064E3B]">ContCrops <span className="font-normal text-slate-500">· عقود التجارة الزراعية</span></span>
                <span>رمز التحقق: <b dir="ltr" className="font-mono text-[#064E3B]">{serial}</b></span>
              </footer>
            </article>
          </section>
        </div>
        <p className="contract-no-print mx-auto mt-5 max-w-3xl text-center text-[10px] leading-5 text-slate-500">تُنزل المسودة عبر نافذة الطباعة في المتصفح. اختر «حفظ بتنسيق PDF» للحصول على نسخة رقمية، ثم راجعها قانونياً قبل التوقيع.</p>
      </div>
    </main>
  );
}