import fs from 'fs';
import path from 'path';

const appDir = './app';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // 1. امسح أي سطر فيه createClient من supabase-js
  content = content.replace(/import\s*\{[^}]*createClient[^}]*\}\s*from\s*["']@supabase\/supabase-js["'];?\n?/g, '');
  content = content.replace(/const\s+supabase\s*=\s*createClient\([^)]*\)[^;]*;?\n?/g, '');
  content = content.replace(/const\s+supabase\s*=\s*createClient\(process\.env[^\n]*\n/g, '');

  // 2. لو مفيش الـ import الصح، ضيفه بعد "use client";
  if (!content.includes('@/lib/supabaseClient')) {
    if (content.includes('"use client"') || content.includes("'use client'")) {
      content = content.replace(/("use client";|'use client';)\s*/, `$1\nimport { supabase } from "@/lib/supabaseClient";\n`);
    } else {
      content = `import { supabase } from "@/lib/supabaseClient";\n` + content;
    }
  }

  // 3. شيل التكرار لو اتكرر
  const matches = content.match(/import \{ supabase \} from "@\/lib\/supabaseClient";/g);
  if (matches && matches.length > 1) {
    // خلي أول واحد بس
    let first = true;
    content = content.replace(/import \{ supabase \} from "@\/lib\/supabaseClient";\n?/g, (m) => {
      if (first) { first = false; return m; }
      return '';
    });
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ اتصلح: ${filePath}`);
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (file.endsWith('.tsx') || file.endsWith('.ts')) fixFile(full);
  }
}

walk(appDir);
walk('./components');
console.log('🎉 كل الملفات اتصلحت! اعمل npm run dev');
