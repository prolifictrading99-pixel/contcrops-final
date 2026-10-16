# ContCrops — منصة زراعية اجتماعية ومهنية

**تواصل - تبادل خبرات - نمو مستدام**

ContCrops is an Arabic-first agricultural social and business platform built with Next.js, TypeScript, Tailwind CSS, and Supabase. It connects farmers, traders, exporters, importers, agricultural companies, and service providers.

## Current Status

**Stage 1 (Foundation)** is complete. The project has:
- Next.js App Router project structure with TypeScript strict mode
- Arabic RTL layout with Cairo font
- Professional agricultural green + black brand identity
- Responsive navigation: top bar (desktop), bottom bar (mobile), side menu, mobile drawer
- All planned page routes created with realistic empty states
- Auth page stubs (login, register, reset-password)
- Shared UI component library
- Supabase client utilities (browser + server) ready for Stage 2

Stages 2–6 will add: Supabase authentication, database migrations, social feed, messaging, marketplace, services, prices, document management, admin panel, and security review.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 3 |
| Backend | Supabase (Auth, PostgreSQL, Storage, Realtime) |
| Icons | lucide-react |
| Fonts | Cairo (Google Fonts via next/font) |

## Project Structure

```
contcrops/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout (RTL, fonts, metadata)
│   │   ├── globals.css         # Global styles + Tailwind
│   │   ├── page.tsx            # Redirects to /home
│   │   ├── loading.tsx         # Global loading state
│   │   ├── not-found.tsx       # 404 page
│   │   ├── home/               # الرئيسية - home feed
│   │   ├── community/          # المجتمع - community
│   │   ├── messages/           # الرسائل - messaging
│   │   ├── colleagues/         # الزملاء - colleagues
│   │   ├── marketplace/        # السوق الزراعي
│   │   ├── services/           # الخدمات
│   │   ├── prices/             # الأسعار
│   │   ├── dashboard/          # لوحة التحكم
│   │   ├── profile/            # الملف الشخصي
│   │   ├── notifications/      # الإشعارات
│   │   ├── settings/           # الإعدادات
│   │   ├── admin/              # لوحة الإدارة
│   │   └── auth/               # Authentication pages
│   │       ├── layout.tsx      # Auth layout (centered card)
│   │       ├── login/
│   │       ├── register/
│   │       └── reset-password/
│   ├── components/             # Shared UI components
│   │   ├── AppNav.tsx          # Navigation (top bar, sidebar, drawer)
│   │   ├── ContentLayout.tsx   # Page wrapper with sidebar
│   │   ├── Avatar.tsx          # User avatar with initials fallback
│   │   ├── Logo.tsx            # ContCrops brand logo
│   │   └── ui.tsx              # Spinner, EmptyState, PageHeader, etc.
│   └── lib/                    # Utilities and config
│       ├── supabase-browser.ts # Browser Supabase client factory
│       ├── supabase-server.ts  # Server Supabase client factory
│       └── utils.ts            # cn(), timeAgo(), formatDate(), etc.
├── public/                     # Static assets
├── .env.example                # Environment variable template
├── .gitignore
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

## Local Setup (Windows 11)

### Prerequisites

1. **Node.js 18.17+** — download from https://nodejs.org
2. **Visual Studio Code** — download from https://code.visualstudio.com
3. **Git** (optional) — download from https://git-scm.com

### Steps

1. **Open the project in VS Code**

   ```bash
   # If you have the project as a ZIP, extract it first
   cd path\to\contcrops
   code .
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the project root:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

   > **Note:** Stage 1 runs without Supabase configured. Auth forms display an informational message. Supabase is required starting from Stage 2.

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open http://localhost:3000 in your browser.

5. **Build for production**

   ```bash
   npm run build
   npm start
   ```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checker |

## Environment Variables

| Variable | Scope | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Supabase service role key — **never expose in browser** |

See `.env.example` for a template.

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Brand Green 600 | `#16a34a` | Primary buttons, active nav, accents |
| Brand Green 700 | `#15803d` | Hover states |
| Brand Green 50 | `#f0fdf4` | Light backgrounds |
| Ink 900 | `#0f172a` | Body text, headings |
| Ink 50 | `#f8fafc` | Page background |

## Navigation

**Primary tabs** (visible in top bar on desktop, bottom bar on mobile):
1. الرئيسية → `/home`
2. المجتمع → `/community`
3. الرسائل → `/messages`
4. الزملاء → `/colleagues`

**Side menu** (desktop right sidebar, mobile drawer):
- السوق الزراعي → `/marketplace`
- الخدمات → `/services`
- الأسعار اليومية والعالمية → `/prices`
- لوحة التحكم → `/dashboard`
- الملف الشخصي → `/profile`
- الإشعارات → `/notifications`
- الإعدادات → `/settings`
- لوحة الإدارة → `/admin`

## Stage 2 Prerequisites

Before Stage 2 can begin, the following is needed:

1. **Create a Supabase project** at https://supabase.com
2. **Copy the project URL and anon key** into `.env.local`
3. **Copy the service role key** into `.env.local` (server-side only)
4. **Confirm the Supabase project region** and confirm email confirmation is disabled for dev

Stage 2 will implement:
- Supabase Auth integration (sign up, login, logout, password reset)
- Database migrations with RLS policies
- User profiles (create, edit, public profile pages)
- Protected routes

## License

This project is proprietary. All rights reserved.
# cont
