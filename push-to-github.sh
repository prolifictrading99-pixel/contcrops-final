#!/bin/bash
set -e
echo "🌿 ContCrops - دفع لـ GitHub"

# نظف
rm -rf .next

# init if needed
if [ ! -d ".git" ]; then
  git init
fi

# .gitignore موجود
git add .
git status

# commit
git commit -m "feat: شعار C اسود اخضر + تواصل تبادل نمو مستدام + اسعار احترافية + كل حساب باسمه + صورة 200px + Supabase مربوط - نفس التصميم" || echo "لا يوجد تغييرات جديدة"

# اذا عندك remote
if git remote | grep -q origin; then
  echo "Remote موجود:"
  git remote -v
  echo "هيتعمل push..."
  git branch -M main
  git push -u origin main
else
  echo ""
  echo "⚠️  اعمل ريبو جديد على github.com/new"
  echo "وبعدها شغل:"
  echo "git remote add origin https://github.com/YOUR_USERNAME/contcrops-final.git"
  echo "git branch -M main"
  echo "git push -u origin main"
fi
