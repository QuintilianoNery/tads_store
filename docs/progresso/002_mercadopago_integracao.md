# 002 — Integração Mercado Pago (Checkout Pro)

> ⚠️ **Histórico — substituído pelo `007`.** Esta versão usava uma **Supabase
> Edge Function** (`supabase/functions/create-preference`, já removida). A
> arquitetura atual roda em **funções serverless da Vercel** (`api/`) e inclui
> webhook. Ver [`007_mercadopago_vercel.md`](007_mercadopago_vercel.md).

## Objetivo

Permitir que o cliente pague o pedido via **Mercado Pago** (cartão de
crédito/débito, PIX e boleto), de forma **segura**.

## Por que NÃO usamos o SDK direto no frontend

O trecho sugerido na orientação inicial:

```js
import { MercadoPagoConfig, Preference } from 'mercadopago';
const client = new MercadoPagoConfig({ accessToken: 'YOUR_ACCESS_TOKEN' });
```

…é **código de servidor (Node/Deno)**. O `accessToken` é um **segredo**: se ele
ficar no código React (que roda no navegador), qualquer pessoa consegue ler e
usar a sua conta do Mercado Pago. Por isso **nunca** colocamos o access token
no frontend nem em variáveis `VITE_*`.

### Arquitetura adotada

```
Frontend (React/Vite)                 Servidor seguro (Supabase Edge Function)
─────────────────────                 ─────────────────────────────────────────
src/lib/mercadopago.js   ── POST ──▶  supabase/functions/create-preference
  monta itens do carrinho                 usa MP_ACCESS_TOKEN (segredo)
  e dados do comprador                    cria a Preference no Mercado Pago
                          ◀── init_point ── devolve a URL de pagamento

Frontend redireciona o usuário → Checkout Pro (página do Mercado Pago)
                                  ↓ paga
Mercado Pago redireciona de volta → /pedido-recebido?status=approved&order=NNN
```

- **Chave pública** (`VITE_MP_PUBLIC_KEY`): pode ficar no frontend (não é segredo).
- **Access token** (`MP_ACCESS_TOKEN`): só existe no servidor (Edge Function).

## Arquivos criados / alterados

| Arquivo | O que faz |
|---|---|
| `src/lib/mercadopago.js` | Helper de frontend: monta o payload, chama a Edge Function e devolve `init_point`. |
| `supabase/functions/create-preference/index.ts` | Edge Function (Deno) que cria a Preference usando o token secreto. |
| `src/pages/Checkout.jsx` | Adiciona o método "Mercado Pago"; ao finalizar, cria a preference e redireciona. |
| `src/pages/PedidoRecebido.jsx` | Lê o retorno do Mercado Pago (`?status=...`), recupera o pedido salvo e limpa o carrinho. |

## Fluxo no código

1. `Checkout.jsx` → `handleSubmit`:
   - valida o formulário e os termos;
   - se o método for `mercadopago`, chama `createPreference({ items, payer, externalReference })`;
   - salva o pedido em `sessionStorage` (`tads-pending-order`) para a confirmação;
   - `window.location.href = initPoint` (vai para o Mercado Pago).
2. Mercado Pago processa e redireciona para
   `/pedido-recebido?status=approved&order=NNN`.
3. `PedidoRecebido.jsx`:
   - recupera o pedido do `sessionStorage`;
   - se o status não for `failure`, esvazia o carrinho e exibe a confirmação;
   - mostra aviso de "pendente" para PIX/boleto (`status=pending`).

## Degradação graciosa

Se a Edge Function ainda **não** estiver publicada, o pagamento via Mercado Pago
exibe uma mensagem de erro amigável no checkout, **sem quebrar a aplicação**. Os
demais métodos (transferência, pagamento na entrega) continuam funcionando de
forma simulada.

## Para funcionar de ponta a ponta

1. Publicar a Edge Function → `004_edge_function_create_preference.md`
2. Configurar credenciais → `005_mercadopago_setup.md`

## Teste rápido

- Use **credenciais de TESTE** e **usuários de teste** do Mercado Pago (ver `005`).
- No checkout, selecione "Mercado Pago", finalize, pague com um cartão de teste
  e confirme o redirecionamento de volta para `/pedido-recebido`.
