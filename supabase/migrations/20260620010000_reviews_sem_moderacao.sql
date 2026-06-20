-- ============================================================
-- TADS Store · Avaliações sem moderação (ajuste da Etapa 16)
-- ------------------------------------------------------------
-- Decisão de produto: inicialmente NÃO há aprovação manual. Toda avaliação
-- criada pelo usuário aparece imediatamente na página/lista de produtos.
-- Substitui a leitura pública restrita a 'aprovada' por leitura pública total.
-- ============================================================

drop policy if exists "ler avaliações aprovadas" on public.reviews;
drop policy if exists "ler avaliações próprias" on public.reviews;

-- Leitura pública: qualquer pessoa vê todas as avaliações (sem moderação).
create policy "ler avaliações" on public.reviews
  for select using (true);
