create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete cascade,
  supplier text not null,
  crop text not null,
  quantity numeric not null check (quantity > 0),
  price numeric not null check (price >= 0),
  delivery_date date not null,
  terms text not null default '',
  status text not null default 'review' check (status in ('active', 'review', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists contracts_created_by_created_at_idx
  on public.contracts (created_by, created_at desc);

alter table public.contracts enable row level security;

drop policy if exists "Users read their own contracts" on public.contracts;
create policy "Users read their own contracts"
  on public.contracts for select using (auth.uid() = created_by);

drop policy if exists "Users create their own contracts" on public.contracts;
create policy "Users create their own contracts"
  on public.contracts for insert with check (auth.uid() = created_by);