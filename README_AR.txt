
# ContCrops - ملفات المشروع - فين تحط كل ملف في VS Code

1. افتح مجلد مشروعك contcrops-final في VS Code

2. الملفات:

- app/page.tsx  ->  انسخ محتوى الملف اللي هبعتهولك وحطه في: contcrops-final/app/page.tsx  (امسح القديم كله وحط الجديد)
- app/layout.tsx -> حطه في: contcrops-final/app/layout.tsx
- app/globals.css -> حطه في: contcrops-final/app/globals.css
- lib/supabase.ts -> حطه في: contcrops-final/lib/supabase.ts (لو مجلد lib مش موجود اعمله)

3. لو عندك ملفات تانية زي:
- app/market/page.tsx  -> امسحه (احنا خلينا السوق هو الصفحة الرئيسية /)
- app/farmers/page.tsx -> امسحه (بقى جوه تبويبة المجتمع)
- app/profile/page.tsx -> ممكن تسيبه بس الرئيسي بقى في التبويبة

4. شغل:
npm install
npm run dev

5. افتح http://localhost:3000 هتلاقي صفحة تسجيل دخول -> دوس دخول تجريبي -> هتدخل المنصة بالـ 7 تبويبات

6. لربط Supabase الحقيقي:
- في page.tsx بدل CROPS_MOCK بـ fetch من supabase.from('crops').select()
- و colleagues من supabase.from('profiles').select()

كل الأكواد جاهزة بنفس تصميمك بالظبط.
