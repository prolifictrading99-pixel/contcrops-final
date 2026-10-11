alter table public.profiles
  add column if not exists role text not null default 'farmer',
  add column if not exists account_status text not null default 'active';

do $$ begin
  alter table public.profiles drop constraint if exists profiles_role_check;
  alter table public.profiles add constraint profiles_role_check
    check (role in ('farmer', 'trader', 'admin'));
exception when others then null;
end $$;

do $$ begin
  alter table public.profiles drop constraint if exists profiles_account_status_check;
  alter table public.profiles add constraint profiles_account_status_check
    check (account_status in ('active', 'pending', 'suspended'));
exception when others then null;
end $$;

alter table public.contracts
  add column if not exists kind text not null default 'sale';

do $$ begin
  alter table public.contracts drop constraint if exists contracts_kind_check;
  alter table public.contracts add constraint contracts_kind_check
    check (kind in ('sale', 'purchase'));
exception when others then null;
end $$;

create table if not exists public.platform_statements (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references auth.users(id) on delete set null,
  statement_type text not null check (statement_type in ('produce', 'cash')),
  cash_type text check (cash_type in ('receipt', 'payment')),
  serial text,
  party text,
  counterparty text,
  item text,
  quantity numeric,
  amount numeric default 0,
  status text not null default 'recorded',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists platform_statements_created_at_idx
  on public.platform_statements (created_at desc);

alter table public.platform_statements enable row level security;

drop policy if exists "Users read their statements" on public.platform_statements;
create policy "Users read their statements"
  on public.platform_statements for select
  using (
    auth.uid() = created_by
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop policy if exists "Users create their statements" on public.platform_statements;
create policy "Users create their statements"
  on public.platform_statements for insert
  with check (auth.uid() = created_by);

drop policy if exists "Admins read all contracts" on public.contracts;
create policy "Admins read all contracts"
  on public.contracts for select
  using (
    auth.uid() = created_by
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop policy if exists "Admins update contracts" on public.contracts;
create policy "Admins update contracts"
  on public.contracts for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Admins update account status" on public.profiles;
create policy "Admins update account status"
  on public.profiles for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create table if not exists public.activity_notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  actor_name text not null default 'زميل في ContCrops',
  actor_avatar text not null default '',
  type text not null,
  title text not null default '',
  body text not null default '',
  related_title text not null default '',
  related_type text not null default '',
  related_id text not null default '',
  read boolean not null default false,
  created_at timestamptz not null default now(),
  constraint activity_notifications_no_self check (actor_id is null or actor_id <> recipient_id)
);

create index if not exists activity_notifications_recipient_idx
  on public.activity_notifications (recipient_id, created_at desc);

alter table public.activity_notifications enable row level security;

drop policy if exists "Users read their activity notifications" on public.activity_notifications;
create policy "Users read their activity notifications"
  on public.activity_notifications for select using (auth.uid() = recipient_id);

drop policy if exists "Users insert activity notifications" on public.activity_notifications;
create policy "Users insert activity notifications"
  on public.activity_notifications for insert
  with check (auth.uid() = actor_id and actor_id <> recipient_id);

drop policy if exists "Users update their activity notifications" on public.activity_notifications;
create policy "Users update their activity notifications"
  on public.activity_notifications for update using (auth.uid() = recipient_id);

drop policy if exists "Users delete their activity notifications" on public.activity_notifications;
create policy "Users delete their activity notifications"
  on public.activity_notifications for delete using (auth.uid() = recipient_id);
