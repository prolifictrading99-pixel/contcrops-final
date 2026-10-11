"use client";

import { ArrowDownRight, ArrowUpRight, CircleDollarSign } from "lucide-react";

export type CropTickerItem = {
  crop: string;
  label: string;
  price: string;
  trend: number;
  icon: string;
};

export const DAILY_CROP_PRICES: CropTickerItem[] = [
  { crop: "بطاطس", label: "فرز أول", price: "12.5", trend: 2.4, icon: "🥔" },
  { crop: "برتقال", label: "أبو سرة", price: "18", trend: 1.2, icon: "🍊" },
  { crop: "بصل", label: "أحمر", price: "15", trend: -0.8, icon: "🧅" },
  { crop: "طماطم", label: "فرز أول", price: "12", trend: 3.1, icon: "🍅" },
  { crop: "ثوم", label: "بلدي", price: "32", trend: -1.4, icon: "🧄" },
];

export function CropPriceTicker({ onSelect }: { onSelect: (crop: string) => void }) {
  return (
    <section aria-label="مؤشر أسعار المحاصيل اليوم" className="ticker-scrollbar mb-5 overflow-x-auto rounded-xl bg-[#064E3B] text-[#F0FDF4] shadow-sm">
      <div className="ticker-track flex w-max items-stretch p-2.5">
        {[false, true].map((duplicate) => <div key={String(duplicate)} aria-hidden={duplicate} className="flex shrink-0 items-stretch gap-2 pl-2">
          <div className="flex shrink-0 items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 text-xs font-extrabold">
            <CircleDollarSign size={17}/><span>مؤشر اليوم</span>
          </div>
          {DAILY_CROP_PRICES.map((item) => {
            const up = item.trend >= 0;
            const TrendIcon = up ? ArrowUpRight : ArrowDownRight;
            return <button key={item.crop} type="button" tabIndex={duplicate ? -1 : undefined} onClick={() => onSelect(item.crop)} title={`تصفية السوق حسب ${item.crop}`} className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-right transition hover:bg-white/10 focus-visible:bg-white/10">
              <span className="text-xl" aria-hidden="true">{item.icon}</span>
              <span className="min-w-0"><span className="block text-xs font-extrabold">{item.crop} - {item.label}</span><span className="mt-0.5 block text-[10px] text-emerald-100/80">{item.price} جنيه/كجم</span></span>
              <span className={`mr-1 inline-flex items-center gap-0.5 text-[11px] font-extrabold ${up ? "text-emerald-200" : "text-rose-200"}`}><TrendIcon size={14}/>{up ? "+" : ""}{item.trend}%</span>
            </button>;
          })}
        </div>)}
      </div>
      <p className="px-4 pb-2 text-[9px] text-emerald-100/60">مؤشرات استرشادية تجريبية وليست تسعيرة رسمية. اضغط على الصنف لعرضه في السوق.</p>
    </section>
  );
}
