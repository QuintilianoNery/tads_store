# Supabase — Migrations (SQL)

Scripts SQL do banco de dados da **TADS Store**.

| Arquivo | Descrição |
|---|---|
| `20260608000000_initial_schema.sql` | Tabelas (`profiles`, `addresses`, `orders`, `order_items`), RLS e trigger de criação de perfil. |

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

> Observação: a integração de pagamento (Mercado Pago) **não** depende destas
> tabelas. Elas são necessárias apenas se você for persistir pedidos,
> endereços e perfis no banco. A Edge Function de pagamento fica em
> `supabase/functions/create-preference/` (ver `docs/progresso/004`).
