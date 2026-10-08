# ContCrops 🌿 - مربوط بـ Supabase

## نفس التصميم 100% + مربوط بـ Supabase

### المميزات الجديدة:
- ✅ صورة المحصول صغرت من 420px لـ 260px + object-contain
- ✅ زرار المراسلة شغال 100% بين الزملاء
- ✅ مربوط بـ Supabase: crops, colleagues, discussions, messages, comments, follows, likes
- ✅ فلتر: الكل - فريش - مجمد - مجفف - محطات فرز وتعبئة - مستلزمات زراعة - مستلزمات انتاج - نقل ولوجيستك
- ✅ نفس التصميم rounded-[24px]

### خطوات ربط Supabase:

1. روح https://supabase.com واعمل مشروع جديد
2. افتح SQL Editor والصق محتوى ملف `supabase/schema.sql` وشغله
3. انسخ .env.example لـ .env.local وحط بياناتك:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
4. شغل:
```
npm install
npm run dev
```

لو مفيش .env.local المنصة هتشتغل بـ MOCK DATA عادي.

### تحديث GitHub:

```bash
chmod +x update-github.sh
./update-github.sh

# اول مرة:
git remote add origin https://github.com/YOUR_USERNAME/contcrops-final.git
git branch -M main
git push -u origin main

# بعد كده:
git add .
git commit -m "update"
git push
```
