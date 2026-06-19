-- ============================================================
-- TADS Store · Favoritos (lista de desejos por usuário)
-- ------------------------------------------------------------
-- Execute no Supabase: Dashboard → SQL Editor → New query → Run.
-- ============================================================

-- Produtos favoritados por cada usuário (relação com auth.users).
-- product_id é o id do produto no DummyJSON.
create table if not exists public.favorites (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users on delete cascade,
  product_id integer not null,
  created_at timestamptz default now(),
  unique (user_id, product_id)
);

-- Cada usuário só enxerga/gerencia os próprios favoritos.
alter table public.favorites enable row level security;

create policy "favoritos próprios" on public.favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
