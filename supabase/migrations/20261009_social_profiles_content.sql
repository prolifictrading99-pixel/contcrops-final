create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'مستخدم ContCrops',
  city text not null default 'مصر',
  bio text not null default '',
  specialty text not null default 'عضو في مجتمع ContCrops',
  avatar_url text not null default '',
  cover_url text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.user_follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  constraint user_follows_no_self_follow check (follower_id <> following_id)
);

create table if not exists public.platform_content (
  id text primary key,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  content_type text not null check (content_type in ('article', 'crop', 'rfq', 'discussion')),
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists platform_content_owner_type_idx
  on public.platform_content (owner_id, content_type);
create index if not exists user_follows_following_idx
  on public.user_follows (following_id);

alter table public.profiles enable row level security;
alter table public.user_follows enable row level security;
alter table public.platform_content enable row level security;

drop policy if exists "Profiles are publicly readable" on public.profiles;
create policy "Profiles are publicly readable"
  on public.profiles for select using (true);
drop policy if exists "Users create their own profile" on public.profiles;
create policy "Users create their own profile"
  on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "Users update their own profile" on public.profiles;
create policy "Users update their own profile"
  on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Follow relationships are readable" on public.user_follows;
create policy "Follow relationships are readable"
  on public.user_follows for select using (true);
drop policy if exists "Users follow from their own account" on public.user_follows;
create policy "Users follow from their own account"
  on public.user_follows for insert with check (auth.uid() = follower_id);
drop policy if exists "Users unfollow from their own account" on public.user_follows;
create policy "Users unfollow from their own account"
  on public.user_follows for delete using (auth.uid() = follower_id);

drop policy if exists "Platform content is publicly readable" on public.platform_content;
create policy "Platform content is publicly readable"
  on public.platform_content for select using (true);
drop policy if exists "Users create their own content" on public.platform_content;
create policy "Users create their own content"
  on public.platform_content for insert with check (auth.uid() = owner_id);
drop policy if exists "Users update their own content" on public.platform_content;
create policy "Users update their own content"
  on public.platform_content for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
drop policy if exists "Users delete their own content" on public.platform_content;
create policy "Users delete their own content"
  on public.platform_content for delete using (auth.uid() = owner_id);
