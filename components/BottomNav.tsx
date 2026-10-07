"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function BottomNav(){
  const pathname = usePathname();
  const router = useRouter();

  const goToMyProfile = ()=>{
    const u = JSON.parse(localStorage.getItem("contcrops_user") || "null");
    if(u?.phone) router.push(`/users/${u.phone}`);
    else router.push("/login");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <div className="max-w-6xl mx-auto flex justify-around py-2">
        <Link href="/market" className={`flex flex-col items-center ${pathname==="/market"? "text-green-600" : "text-gray-400"}`}>
          <span className="text-lg">🛒</span><span className="text- font-bold">السوق</span>
        </Link>
        <Link href="/farmers" className={`flex flex-col items-center ${pathname.startsWith("/farmers")? "text-green-600" : "text-gray-400"}`}>
          <span className="text-lg">🧑‍🌾</span><span className="text-">المجتمع</span>
        </Link>
        <Link href="/dashboard" className={`flex flex-col items-center ${pathname.startsWith("/dashboard")? "text-green-600" : "text-gray-400"}`}>
          <span className="text-lg">📊</span><span className="text-">لوحتي</span>
        </Link>
        <Link href="/messages" className={`flex flex-col items-center ${pathname.startsWith("/messages")? "text-green-600" : "text-gray-400"}`}>
          <span className="text-lg">💬</span><span className="text-">الرسائل</span>
        </Link>
        <button onClick={goToMyProfile} className={`flex flex-col items-center ${pathname.startsWith("/users") || pathname.startsWith("/settings")? "text-green-600" : "text-gray-400"}`}>
          <span className="text-lg">👤</span><span className="text-">حسابي</span>
        </button>
      </div>
    </div>
  )
}