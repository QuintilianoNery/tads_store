# 007 — Mercado Pago na Vercel (Checkout Pro + Webhook)

> **Substitui** a arquitetura dos docs `002` e `004` (que usavam Supabase Edge
> Function). A integração agora roda em **funções serverless da Vercel**.

## Visão geral

Pagamento via **Checkout Pro** (cartão, Pix, boleto), com o Access Token
**secreto** vivendo só no servidor. O pedido é confirmado por **webhook**
(server-side), à prova de o cliente fechar a aba.

```
Frontend (Vite)                         Vercel (serverless)            Mercado Pago
───────────────                         ───────────────────            ────────────
Checkout
  createPendingOrder  ─────────────────────────────────────────►  Supabase (status 'pendente')
  createPreference    ── POST /api/create-preference ──►  cria a Preference  ──► { init_point }
  window.open(init_point, '_blank')  ───────────────────────────────────────►  Checkout Pro (nova aba)
  navega /pedido-recebido?order=ID  (aba original: polling do pedido)

                              paga ▼
Mercado Pago  ── POST /api/mp-webhook ──►  valida x-signature
                                           busca o pagamento (Payment.get)
                                           grava status 'pago'/'cancelado'
                                           no Supabase via SERVICE ROLE
/pedido-recebido (polling) vê status='pago' → sucesso + limpa carrinho
```

## Arquivos

| Arquivo | Papel |
|---|---|
| `src/lib/mercadopago.js` | Frontend: mapeia o carrinho, monta `back_urls`/`notification_url` (só https) e chama `/api/create-preference`. |
| `api/create-preference.js` | Serverless: cria a Preference com o `MP_ACCESS_TOKEN` (segredo). |
| `api/mp-webhook.js` | Serverless: recebe a notificação, valida assinatura e confirma o pedido (service role). |
| `api/_lib/mpSignature.js` | Verificação HMAC-SHA256 da assinatura `x-signature` (puro, testado). |
| `src/screens/Checkout.jsx` | Cria pedido pendente, abre o MP em nova aba, manda a aba para `/pedido-recebido`. |
| `src/screens/PedidoRecebido.jsx` | Acompanha o pedido por polling até confirmar. |
| `src/services/orderService.js` | `createOrder` (status/preference), `setOrderPreference`, `getOrderById`, `markOrderPaid`, `getStockConsumption` (só `pago`). |
| `vercel.json` | Rewrite SPA (tudo → `index.html`, exceto `/api/*`). |

## Variáveis de ambiente

| Variável | Escopo | Descrição |
|---|---|---|
| `VITE_MP_PUBLIC_KEY` | frontend | Chave pública (não é segredo). |
| `MP_ACCESS_TOKEN` | **servidor** | Access Token (segredo). Cria a preference e busca o pagamento. |
| `MP_WEBHOOK_SECRET` | **servidor** | Segredo de assinatura do webhook (painel do MP). Valida `x-signature`. |
| `SUPABASE_SERVICE_ROLE_KEY` | **servidor** | Ignora RLS — o webhook grava o pedido sem sessão do usuário. |
| `SUPABASE_URL` | servidor | Opcional (default: `VITE_SUPABASE_URL`). |

Local: tudo no `.env` (lido pelo `vercel dev`). Produção: Vercel → Settings →
Environment Variables (escopo **Production**).

## Configurar o webhook (painel do Mercado Pago)

1. Suas integrações → sua aplicação → **Webhooks**.
2. URL: `https://SEU-APP.vercel.app/api/mp-webhook` · Evento: **Pagamentos**.
3. Copie a **assinatura secreta** → `MP_WEBHOOK_SECRET`.

## Dev local

Dois processos (o Vite não serve `/api`):

```powershell
vercel dev      # porta 3000 — funções /api (lê o .env)
npm run dev     # porta 5173 — app (proxy /api → 3000 via vite.config.js)
```

Use a loja em `http://localhost:5173`. O **webhook não é alcançável em
localhost** — para testar a confirmação localmente, a tela de espera tem um
fallback de DEV: acesse `/pedido-recebido?order=<id>&status=approved` (desligado
em produção).

## Teste (na Vercel, fluxo completo)

- Pague em **janela anônima** como **comprador de teste** (nunca a conta de
  vendedor) com cartão de teste (titular `APRO`, CPF `12345678909`).
- O webhook confirma o pedido no servidor → a aba que aguardava mostra sucesso e
  o pedido aparece em Meus Pedidos — mesmo fechando a aba do pagamento.
- Credenciais e cartões de teste: ver `005` e o `README`.

## Fora de escopo

- Reembolsos/estornos; status intermediários além de `pago`/`cancelado`.
- O pedido `pendente` (Pix/boleto aguardando) só vira `pago` quando o webhook
  recebe a confirmação do pagamento efetivo.
