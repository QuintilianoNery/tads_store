# Supabase — Migrations (SQL)

Scripts SQL do banco de dados da **TADS Store**.

| Arquivo | Descrição |
|---|---|
| `20260608000000_initial_schema.sql` | Tabelas (`profiles`, `addresses`, `orders`, `order_items`), RLS e trigger de criação de perfil. |
| `20260619000000_favorites.sql` | Tabela `favorites` (lista de desejos por usuário) + RLS. |
| `20260619000001_cart.sql` | Tabela `cart_items` (carrinho persistente por usuário) + RLS. |
| `20260620000000_reviews.sql` | Tabela `reviews` (avaliações com estrelas + comentário) + RLS. |
| `20260620010000_reviews_sem_moderacao.sql` | Remove a moderação: leitura pública de todas as avaliações (aparecem na hora). |

## Como aplicar

### Opção A — SQL Editor (mais simples)

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard) → seu projeto.
2. Menu **SQL Editor** → **New query**.
3. Cole o conteúdo do arquivo `.sql` e clique em **Run**.

### Opção B — Supabase CLI

```powershell
supabase link --project-ref SEU_PROJECT_REF
supabase db push
```

> Observação: a integração de pagamento (Mercado Pago) **usa** a tabela `orders`
> — o pedido é criado como `pendente` e confirmado (`pago`) pelo webhook. As
> funções de pagamento ficam em `api/` (serverless da Vercel), e o webhook grava
> o status via service role. Ver `docs/progresso/007`.
