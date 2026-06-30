-- Rode UMA VEZ no SQL Editor do Supabase.
-- Cria uma tabela dedicada só para o keep-alive, para não poluir tabelas reais.

create table if not exists public.keepalive (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  note text
);

-- O script usa a service_role key, que ignora RLS. Mantemos RLS ligado e
-- sem políticas públicas para que ninguém com a chave anon consiga ler/escrever.
alter table public.keepalive enable row level security;

-- Garante o acesso MÍNIMO da service_role só a esta tabela (idempotente).
-- Não toca em nenhuma outra tabela; suas políticas de RLS continuam intactas.
grant usage on schema public to service_role;
grant select, insert, delete on public.keepalive to service_role;
