# 004 — Edge Function `create-preference` (deploy)

Esta Edge Function roda **no servidor do Supabase** (Deno) e guarda o
`MP_ACCESS_TOKEN` em segredo. Ela recebe os itens do carrinho e devolve a URL de
pagamento (`init_point`).

O código já está em:
[`supabase/functions/create-preference/index.ts`](../../supabase/functions/create-preference/index.ts)

## Pré-requisitos

- Conta no [Supabase](https://supabase.com) com um projeto criado.
- **Supabase CLI** instalado:
  ```powershell
  npm install -g supabase
  # ou via scoop:  scoop install supabase
  ```
- **Docker Desktop** (necessário apenas se for testar localmente com `supabase functions serve`).

## Passo a passo (deploy)

```powershell
# 1. Autenticar
supabase login

# 2. Vincular o projeto local ao seu projeto Supabase
#    O PROJECT_REF aparece em: Dashboard → Settings → General → Reference ID
supabase link --project-ref SEU_PROJECT_REF

# 3. Cadastrar o Access Token como SEGREDO do servidor
#    (NUNCA coloque este token no frontend nem em variáveis VITE_*)
supabase secrets set MP_ACCESS_TOKEN="APP_USR-xxxxxxxx..."

# 4. Publicar a função
#    --no-verify-jwt permite chamar sem login do usuário (checkout de visitante)
supabase functions deploy create-preference --no-verify-jwt
```

Após o deploy, a função fica disponível em:

```
https://SEU_PROJECT_REF.supabase.co/functions/v1/create-preference
```

…que é exatamente a URL que `src/lib/mercadopago.js` monta a partir de
`VITE_SUPABASE_URL`.

## Testar localmente (opcional)

```powershell
# Define o segredo para o ambiente local
supabase functions serve create-preference --env-file ./supabase/.env.local

# Em outro terminal, testa com curl:
curl -X POST http://localhost:54321/functions/v1/create-preference `
  -H "Content-Type: application/json" `
  -d '{ "items": [{ "title": "Teste", "quantity": 1, "unit_price": 10, "currency_id": "BRL" }] }'
```

Crie `supabase/.env.local` (NÃO commitar) com:

```
MP_ACCESS_TOKEN=APP_USR-xxxxxxxx...
```

## O que a função faz (resumo)

1. Aceita `POST` com `{ items, payer, back_urls, external_reference }`.
2. Trata CORS (pré-flight `OPTIONS`).
3. Cria a `Preference` no Mercado Pago com `auto_return: 'approved'`.
4. Devolve `{ id, init_point, sandbox_init_point }`.

## Erros comuns

| Sintoma | Causa provável |
|---|---|
| `MP_ACCESS_TOKEN não configurado` | Esqueceu o `supabase secrets set` (passo 3). |
| HTTP 401 ao chamar do frontend | Falta enviar o `apikey`/`Authorization` (já tratado no helper) ou função publicada sem `--no-verify-jwt`. |
| CORS bloqueado | Função não publicada com os headers de CORS (já inclusos no código). |
| `init_point` ausente | Access token inválido ou de outra conta/país. |
