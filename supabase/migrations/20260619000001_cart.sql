-- ============================================================
-- TADS Store · Carrinho persistente por usuário
-- ------------------------------------------------------------
-- Execute no Supabase: Dashboard → SQL Editor → New query → Run.
-- ============================================================

-- Itens do carrinho de cada usuário (relação com auth.users).
-- Guarda um snapshot do produto (jsonb) para renderizar sem refetch.
create table if not exists public.cart_items (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users on delete cascade,
  product_id integer not null,
  quantity   integer not null default 1,
  product    jsonb,
  created_at timestamptz default now(),
  unique (user_id, product_id)
);

-- Cada usuário só enxerga/gerencia o próprio carrinho.
alter table public.cart_items enable row level security;

create policy "carrinho próprio" on public.cart_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
