"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type PlatformUser = {
  id: string | number;
  name: string;
  accountType: string;
  phone: string;
  city: string;
  specialty: string;
  avatar: string;
};

function normalizePlatformUser(row: any): PlatformUser {
  const name = row?.display_name || row?.name || row?.full_name || "مستخدم ContCrops";
  const city = row?.city || row?.region || row?.province || "غير محدد";
  const specialty = row?.specialty || row?.role || row?.account_type || "عضو في المجتمع";
  const avatar = row?.avatar_url || row?.avatar || "https://i.pravatar.cc/100?img=12";
  const phone = row?.phone || row?.phone_number || row?.mobile || row?.mobile_number || "غير متاح";
  const accountType = row?.role || row?.account_type || row?.user_type || "member";

  return {
    id: row?.id ?? name,
    name,
    accountType,
    phone,
    city,
    specialty,
    avatar,
  };
}

async function loadUsersFromSupabase(): Promise<PlatformUser[]> {
  if (!isSupabaseConfigured()) return [];

  const queries = [
    supabase.from("profiles").select("id,display_name,city,specialty,avatar_url,bio,updated_at").limit(200),
    supabase.from("colleagues").select("id,name,city,specialty,avatar,bio,online,cover").limit(200),
  ];

  for (const query of queries) {
    const { data, error } = await query;
    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map(normalizePlatformUser);
    }
  }

  return [];
}

export default function FollowingPage() {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await loadUsersFromSupabase();
        if (!mounted) return;
        setUsers(data);
        if (!data.length) {
          setError("لا توجد بيانات مستخدمين فعالة في Supabase حالياً.");
        }
      } catch (loadError) {
        if (mounted) {
          setError("تعذر جلب بيانات المستخدمين من Supabase.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();
    return () => { mounted = false; };
  }, []);

  return (
    <main dir="rtl" className="min-h-screen bg-[#f7f8f3] p-4 pb-24 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div>
            <p className="text-xs font-bold text-emerald-800">ContCrops · المستخدمون</p>
            <h1 className="mt-1 text-xl font-black">قائمة المستخدمين الفاعلين</h1>
          </div>
          <Link href="/admin" className="inline-flex h-10 items-center rounded-xl bg-slate-100 px-3 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900">
            لوحة التحكم
          </Link>
        </header>

        {loading && <p className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">جارٍ جلب المستخدمين الحقيقيين من Supabase...</p>}
        {error && <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{error}</p>}

        {!loading && users.length > 0 && (
          <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-right text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-bold">اسم المستخدم</th>
                    <th className="px-4 py-3 font-bold">نوع الحساب</th>
                    <th className="px-4 py-3 font-bold">رقم الهاتف</th>
                    <th className="px-4 py-3 font-bold">المحافظة</th>
                    <th className="px-4 py-3 font-bold">التخصص</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((person) => (
                    <tr key={String(person.id)} className="border-t border-slate-100">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={person.avatar} alt={person.name} className="h-10 w-10 rounded-full object-cover" />
                          <span className="font-bold text-slate-800">{person.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{String(person.accountType)}</td>
                      <td className="px-4 py-3 text-slate-600">{person.phone}</td>
                      <td className="px-4 py-3 text-slate-600">{person.city}</td>
                      <td className="px-4 py-3 text-slate-600">{person.specialty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
