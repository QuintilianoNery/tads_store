-- ============================================================
-- 003 — TADS Store · Esquema do banco (Supabase / PostgreSQL)
-- ------------------------------------------------------------
-- Execute no Supabase: Dashboard → SQL Editor → New query → Run.
-- Necessário apenas se você for persistir pedidos/endereços no banco.
-- (A integração de pagamento NÃO depende destas tabelas.)
-- ============================================================

-- Perfil do usuário (1:1 com auth.users)
create table if not exists public.profiles (
  id           uuid primary key references auth.users on delete cascade,
  full_name    text,
  display_name text,
  avatar_url   text,
  created_at   timestamptz default now()
);

-- Endereços de faturamento/entrega
create table if not exists public.addresses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users on delete cascade,
  type        text check (type in ('billing', 'shipping')),
  first_name  text,
  last_name   text,
  company     text,
  address     text,
  number      text,
  city        text,
  state       text,
  zip_code    text,
  country     text,
  phone       text,
  created_at  timestamptz default now()
);

-- Pedidos
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users on delete set null,
  mp_preference_id text,
  mp_payment_id    text,
  status           text default 'pendente' check (status in ('pendente','pago','cancelado')),
  subtotal         numeric,
  total            numeric,
  payment_method   text,
  billing_address  jsonb,
  notes            text,
  created_at       timestamptz default now()
);

-- Itens de cada pedido
create table if not exists public.order_items (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid references public.orders on delete cascade,
  product_id        integer,
  product_title     text,
  product_thumbnail text,
  quantity          integer,
  unit_price        numeric,
  total_price       numeric
);

-- ============================================================
-- Row Level Security (cada usuário só enxerga os próprios dados)
-- ============================================================
alter table public.profiles    enable row level security;
alter table public.addresses   enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

create policy "perfil próprio"     on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "endereços próprios" on public.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "pedidos próprios"   on public.orders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "itens dos meus pedidos" on public.order_items
  for all using (
    exists (select 1 from public.orders o
            where o.id = order_items.order_id and o.user_id = auth.uid())
  );

-- Cria o profile automaticamente quando um usuário se cadastra
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
