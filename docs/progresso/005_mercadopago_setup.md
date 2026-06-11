# 005 — Credenciais Mercado Pago e configuração do `.env`

## 1. Obter as credenciais

1. Acesse o [Painel de Desenvolvedores do Mercado Pago](https://www.mercadopago.com.br/developers/panel).
2. Crie (ou abra) uma **aplicação** do tipo *Checkout Pro / Pagamentos online*.
3. Em **Credenciais**, você verá dois conjuntos:
   - **Credenciais de teste** (prefixo `TEST-`) → use durante o desenvolvimento.
   - **Credenciais de produção** (prefixo `APP_USR-`) → use só quando for ao ar.
4. De cada conjunto você precisa de:
   - **Public Key** → vai para o frontend (`VITE_MP_PUBLIC_KEY`).
   - **Access Token** → vai **somente** para o servidor (segredo da Edge Function).

## 2. Configurar o `.env` (frontend)

No arquivo `.env` da raiz (já existe no projeto, **não é commitado**):

```env
# Supabase
VITE_SUPABASE_URL=https://SEU_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key

# Mercado Pago — chave PÚBLICA (pode ficar no frontend)
VITE_MP_PUBLIC_KEY=APP_USR-xxxx   # ou TEST-xxxx em desenvolvimento

# DummyJSON
VITE_API_BASE_URL=https://dummyjson.com
```

> O **Access Token NÃO vai no `.env` do frontend**. Ele é cadastrado como segredo
> no servidor: `supabase secrets set MP_ACCESS_TOKEN="..."` (ver `004`).

## 3. ⚠️ Segurança — importante

- **Nunca** exponha o Access Token em código do navegador ou em variáveis `VITE_*`
  (tudo que começa com `VITE_` é embutido no bundle e fica visível).
- O `.gitignore` já ignora `.env` — confirme que ele **nunca** foi commitado:
  ```powershell
  git log --all --oneline -- .env   # não deve retornar nada
  ```
- Se um Access Token de **produção** (`APP_USR-`) já foi exposto/compartilhado,
  **revogue e gere um novo** no painel do Mercado Pago.
- Para desenvolver e testar, prefira sempre as credenciais **`TEST-`**.

## 4. Usuários e cartões de teste

No painel → **Contas de teste**, crie um comprador de teste. Use os
[cartões de teste do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/test-cards)
para simular aprovação/recusa:

| Cartão | Resultado |
|---|---|
| Mastercard `5031 4332 1540 6351` | Aprovado |
| Visa `4235 6477 2802 5682` | Aprovado |
| (use nome do titular `APRO`) | Pagamento aprovado |
| (use nome do titular `OTHE`) | Recusado por erro geral |

CVV qualquer (ex.: `123`) e validade futura (ex.: `11/30`).

## 5. Checklist final

- [ ] `VITE_MP_PUBLIC_KEY` no `.env`
- [ ] `MP_ACCESS_TOKEN` cadastrado via `supabase secrets set`
- [ ] Edge Function `create-preference` publicada (ver `004`)
- [ ] Testado com cartão de teste → redireciona e volta para `/pedido-recebido`
