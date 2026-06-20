-- ============================================================
-- TADS Store · Avaliações de produtos (estrelas + comentário)
-- ------------------------------------------------------------
-- Execute no Supabase: Dashboard → SQL Editor → New query → Run.
-- ============================================================

-- Avaliação de um produto por um usuário (relação com auth.users).
-- product_id é o id do produto no DummyJSON. Cada usuário pode ter uma
-- avaliação por produto (unique). A moderação é feita pelo campo `status`:
-- toda avaliação entra como 'pendente' e só aparece publicamente após ser
-- marcada como 'aprovada' (manualmente, pelo Dashboard → Table editor).
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

alter table public.reviews enable row level security;

-- Leitura pública: qualquer pessoa vê apenas avaliações aprovadas (catálogo).
create policy "ler avaliações aprovadas" on public.reviews
  for select using (status = 'aprovada');

-- O usuário também enxerga as próprias avaliações (pendentes/rejeitadas).
create policy "ler avaliações próprias" on public.reviews
  for select using (auth.uid() = user_id);

-- O usuário cria/edita/remove somente as próprias avaliações.
create policy "inserir avaliação própria" on public.reviews
  for insert with check (auth.uid() = user_id);

create policy "atualizar avaliação própria" on public.reviews
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "remover avaliação própria" on public.reviews
  for delete using (auth.uid() = user_id);

-- Índice para a listagem de avaliações aprovadas por produto.
create index if not exists reviews_product_status_idx
  on public.reviews (product_id, status);
