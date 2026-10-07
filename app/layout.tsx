import type { Metadata } from "next";
import { Cairo } from "next/font/google";
// @ts-expect-error Next.js handles CSS side-effect imports through its generated types.
import "./globals.css";
const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "600", "700", "900"] });

export const metadata: Metadata = {
  title: "ContCrops - منصة المحاصيل",
  description: "سوق المحاصيل وثريد المزارعين",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className + " bg-[#f5f6f1]"}>
        {/* شلنا الـ BottomNav من هنا - مفيش تبويبات تحت خلاص */}
        {children}
      </body>
    </html>
  );
}