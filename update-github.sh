#!/bin/bash
# ContCrops - تحديث GitHub + Supabase

echo "🌿 ContCrops - ربط Supabase وتحديث GitHub"

# 1. تأكد من git
if [ ! -d ".git" ]; then
  git init
  echo "تم إنشاء git repo"
fi

# 2. ملفات .gitignore
cat > .gitignore << 'EOF'
node_modules
.next
.env.local
.env
dist
.DS_Store
EOF

# 3. اضافة كل الملفات
git add .

# 4. كوميت
git commit -m "feat: ربط Supabase كامل + صورة صغيرة 260px + مراسلة بين الزملاء + فلتر فريش/مجمد/مجفف/محطات فرز وتعبئة/مستلزمات زراعة/مستلزمات انتاج/نقل ولوجيستك - نفس التصميم"

# 5. ارفع لـ GitHub (غير الرابط)
# git remote add origin https://github.com/YOUR_USERNAME/contcrops-final.git
# git branch -M main
# git push -u origin main

echo ""
echo "✅ جاهز للرفع!"
echo "اعمل:"
echo "git remote add origin https://github.com/YOUR_USERNAME/contcrops-final.git"
echo "git branch -M main"
echo "git push -u origin main"
