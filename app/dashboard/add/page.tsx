"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddCropPage(){
  const [form, setForm] = useState({ name: "", price: "", quantity: "", city: "الجيزة", farmer_name: "", image_url: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e:any){
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.from("crops").insert([{
      name: form.name,
      price: Number(form.price),
      quantity: Number(form.quantity),
      city: form.city,
      farmer_name: form.farmer_name || "مزارع",
      image_url: form.image_url,
    }]).select();

    setLoading(false);
    if(error){
      alert("حصل مشكلة: " + error.message);
    } else {
      alert("تمت الإضافة بنجاح ✅");
      router.push("/");
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fdf8] p-4">
      <div className="max-w-xl mx-auto bg-white rounded-[24px] border p-6 mt-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-black text-xl">+ إضافة محصول جديد</h1>
          <Link href="/" className="text-sm bg-gray-100 px-4 py-2 rounded-full font-bold">← السوق</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="اسم المحصول - مثال: طماطم بلدي" className="w-full border rounded-xl h-12 px-4 outline-none focus:ring-2 focus:ring-green-500" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
          <div className="grid grid-cols-2 gap-3">
            <input required type="number" placeholder="السعر بالجنيه" className="w-full border rounded-xl h-12 px-4 outline-none focus:ring-2 focus:ring-green-500" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} />
            <input required type="number" placeholder="الكمية (طن)" className="w-full border rounded-xl h-12 px-4 outline-none focus:ring-2 focus:ring-green-500" value={form.quantity} onChange={e=>setForm({...form, quantity: e.target.value})} />
          </div>
          <input placeholder="المدينة - مثال: البحيرة" className="w-full border rounded-xl h-12 px-4 outline-none focus:ring-2 focus:ring-green-500" value={form.city} onChange={e=>setForm({...form, city: e.target.value})} />
          <input placeholder="اسم المزارع" className="w-full border rounded-xl h-12 px-4 outline-none focus:ring-2 focus:ring-green-500" value={form.farmer_name} onChange={e=>setForm({...form, farmer_name: e.target.value})} />
          <input placeholder="لينك الصورة (https://...)" className="w-full border rounded-xl h-12 px-4 outline-none focus:ring-2 focus:ring-green-500" value={form.image_url} onChange={e=>setForm({...form, image_url: e.target.value})} />
          <p className="text-[11px] text-gray-400">ممكن تسيب لينك الصورة فاضي وهيحط صورة افتراضية حلوة</p>

          <button disabled={loading} className="w-full bg-green-600 text-white h-12 rounded-full font-black hover:bg-green-700 disabled:opacity-50">
            {loading? "جاري الإضافة..." : "نشر المحصول 🚀"}
          </button>
        </form>
      </div>
    </main>
  )
}