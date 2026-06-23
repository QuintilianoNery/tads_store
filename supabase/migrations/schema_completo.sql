-- ============================================================
-- TADS Store · Esquema COMPLETO do banco (Supabase / PostgreSQL)
-- ------------------------------------------------------------
-- Estrutura consolidada de todas as migrations, para subir o banco
-- DO ZERO em um projeto Supabase novo.
--
-- Como usar: Dashboard → SQL Editor → New query → cole tudo → Run.
-- (NÃO faz parte da sequência de migrations versionadas; é só um
--  snapshot do estado final do schema. Reflete as decisões já tomadas,
--  incluindo "avaliações sem moderação".)
--
-- Idempotente: usa "create ... if not exists" e "drop policy if exists",
-- então pode ser reexecutado sem erro.
-- ============================================================

-- ============================================================
-- TABELAS
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

-- Favoritos (lista de desejos por usuário).
-- product_id é o id do produto no DummyJSON.
create table if not exists public.favorites (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users on delete cascade,
  product_id integer not null,
  created_at timestamptz default now(),
  unique (user_id, product_id)
);

-- Carrinho persistente por usuário.
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

-- Avaliações de produtos (estrelas + comentário).
-- product_id é o id do produto no DummyJSON. Cada usuário pode ter uma
-- avaliação por produto (unique). SEM moderação: toda avaliação aparece
-- imediatamente (a coluna `status` existe mas não controla a exibição).
create table if not exists public.reviews (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users on delete cascade not null,
  product_id   integer not null,
  order_id     uuid references public.orders on delete set null,
  rating       integer not null check (rating between 1 and 5),
  comment      text,
  author_name  text,
  status       text not null default 'pendente'
                 check (status in ('pendente', 'aprovada', 'rejeitada')),
  created_at   timestamptz default now(),
  unique (user_id, product_id)
);

-- Índice para a listagem de avaliações por produto.
create index if not exists reviews_product_status_idx
  on public.reviews (product_id, status);

-- ============================================================
-- ROW LEVEL SECURITY (cada usuário só enxerga os próprios dados)
-- ============================================================
alter table public.profiles    enable row level security;
alter table public.addresses   enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;
alter table public.favorites   enable row level security;
alter table public.cart_items  enable row level security;
alter table public.reviews     enable row level security;

-- Perfil
drop policy if exists "perfil próprio" on public.profiles;
create policy "perfil próprio" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Endereços
drop policy if exists "endereços próprios" on public.addresses;
create policy "endereços próprios" on public.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Pedidos
drop policy if exists "pedidos próprios" on public.orders;
create policy "pedidos próprios" on public.orders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Itens dos pedidos
drop policy if exists "itens dos meus pedidos" on public.order_items;
create policy "itens dos meus pedidos" on public.order_items
  for all using (
    exists (select 1 from public.orders o
            where o.id = order_items.order_id and o.user_id = auth.uid())
  );

-- Favoritos
drop policy if exists "favoritos próprios" on public.favorites;
create policy "favoritos próprios" on public.favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Carrinho
drop policy if exists "carrinho próprio" on public.cart_items;
create policy "carrinho próprio" on public.cart_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Avaliações (sem moderação):
-- leitura pública total; cada usuário cria/edita/remove só a própria.
drop policy if exists "ler avaliações" on public.reviews;
create policy "ler avaliações" on public.reviews
  for select using (true);

drop policy if exists "inserir avaliação própria" on public.reviews;
create policy "inserir avaliação própria" on public.reviews
  for insert with check (auth.uid() = user_id);

drop policy if exists "atualizar avaliação própria" on public.reviews;
create policy "atualizar avaliação própria" on public.reviews
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "remover avaliação própria" on public.reviews;
create policy "remover avaliação própria" on public.reviews
  for delete using (auth.uid() = user_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

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
