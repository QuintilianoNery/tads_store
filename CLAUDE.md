# CLAUDE.md — Guia do projeto TADS Store

Contexto para manutenção assistida por IA. Mantenha conciso e atualizado.
Leia só a seção relevante; os caminhos abaixo são os pontos de entrada.

## O que é

Loja virtual (SPA React) — porta de um protótipo offline para uma versão
real com **Supabase** (auth + dados) e catálogo da **API DummyJSON**.

## Stack

- **React 18 + Vite** (`vite.config.js`), roteamento `react-router-dom`.
- **Supabase** (`@supabase/supabase-js`) — auth JWT + Postgres + RLS.
- **DummyJSON** — catálogo de produtos (somente leitura; ver armadilha de estoque).
- **Vitest** — testes (`tests/unit` em node + Storybook em browser).
- Estilo: CSS vars (design tokens), sem framework de UI.

## ⚠️ Armadilhas importantes

- **App ativo = `src/screens/` + `src/context/StoreContext.jsx`** (ver
  `src/App.jsx`). O design system fica em `src/components/ds/`.
- **Estoque não persiste na DummyJSON**: ela aceita `PUT` e finge sucesso,
  mas não grava. A baixa real é **derivada dos pedidos pagos** (Supabase): o
  estoque exibido = base da DummyJSON − soma do que o usuário comprou
  (`getStockConsumption`, só `status='pago'`). Ver `StoreContext`
  (`baseStockRef`, `reloadStock`).

## Estrutura (pontos de entrada)

- `src/App.jsx` — rotas. Rotas protegidas via `src/components/RotaProtegida`.
- `src/context/StoreContext.jsx` — **estado global**: catálogo, carrinho,
  favoritos, usuário/sessão, busca, navegação (`nav`), `createPendingOrder`,
  `reloadStock`. Hub central.
- `src/screens/` — telas: Home, Catalog, Detail, Cart, Checkout, Login,
  Account, Wishlist, Help (Central de Ajuda/FAQ).
- `src/components/ds/` — design system (Button, Input, Badge, Spinner,
  StarRating, ProductCard) com stories `.stories.jsx`.
- `src/components/AddressBook.jsx` — agenda de endereços (CRUD), usada na
  conta e no checkout (modo `selectable`).
- `src/services/` — acesso a dados: `supabase.js` (cliente), `authService`,
  `productService` (DummyJSON), `favoritesService`, `cartService`,
  `addressService`, `orderService`, `reviewService` (avaliações).
- `src/lib/` — `format.js` (`fmtBRL`, `finalPrice`), `orderNumber.js` (puros) e
  `mercadopago.js` (helper do Checkout Pro — monta o payload e chama `/api`).
- `src/utils/` — `validators.js`, `masks.js` (CPF/CNPJ, telefone, CEP, e-mail).
- `api/` — funções **serverless da Vercel** (Node): `create-preference.js` (cria
  a preference) e `mp-webhook.js` (confirma o pagamento). Segredos só aqui no
  servidor; `api/_lib/` é código compartilhado (não vira rota). Em dev, rode
  `vercel dev` (3000) junto do Vite — o `vite.config.js` faz proxy de `/api`.

## Navegação

`nav(name, id?)` no `StoreContext` mapeia nomes → rotas via `ROUTE_PATH`.
Chaves válidas: `home, catalog, detail, cart, checkout, login, wishlist,
account, help`. Chave inexistente cai em `/` (home) — atenção a typos.
(A rota `/pedido-recebido` é alcançada por navegação direta/back_url, não por `nav`.)

## Pagamento (Mercado Pago — Checkout Pro)

Fluxo final (ver `docs/progresso/007`). Por que servidor: o Access Token é
segredo e **não** pode ir pro frontend.

- **Início (Checkout):** cria o pedido `pendente` (`createPendingOrder`), gera a
  preference via `api/create-preference.js` (helper `src/lib/mercadopago.js`) e
  abre o Checkout Pro em **nova aba**; a aba original vai pra `/pedido-recebido`
  e acompanha o pedido por **polling**.
- **Confirmação server-side:** `api/mp-webhook.js` valida a assinatura
  (`x-signature`) e grava `status='pago'` via **service role** — à prova de
  fechar a aba. Em DEV há fallback no cliente (`?status=approved`), desligado em
  produção.
- `back_urls`/`notification_url` exigem **https público** → só funcionam 100%
  no deploy da Vercel (o MP não alcança `localhost`).
- Segredos de servidor (sem `VITE_`): `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`,
  `SUPABASE_SERVICE_ROLE_KEY`. Público no frontend: `VITE_MP_PUBLIC_KEY`.

## Supabase

- Cliente em `src/services/supabase.js` (lança erro sem env vars).
- Tabelas (migrations em `supabase/migrations/`): `profiles`, `addresses`,
  `orders`, `order_items`, `favorites`, `cart_items`, `reviews`. Todas com **RLS**
  (cada usuário só acessa o próprio dado). `reviews` é **sem moderação**: leitura
  pública de todas; cada usuário cria/edita só a própria (uma por produto). A
  coluna `status` existe mas não é usada para gating (ver migration
  `20260620010000_reviews_sem_moderacao.sql`).
- Env (`.env`, ver `.env.example`): `VITE_SUPABASE_URL`,
  `VITE_SUPABASE_ANON_KEY`. Opcional: `VITE_API_BASE_URL` (default DummyJSON).
- Migrations rodam manualmente no SQL Editor do Supabase, caso o terminal tenha acesso, deve sempre perguntar ao usuário se deseja executá-las, se possível o terminal deve fazer um backup automático do banco antes de rodar as migrations, para evitar perda de dados acidental.
- Aplicar sem backup (recomentado) Roda supabase db push'. 
  - A migration é aditiva (só cria a tabela reviews + RLS), não toca em dados existentes risco de perda praticamente nulo.

## Comandos

- `npm run dev` — desenvolvimento.
- `npm run build` / `npm run preview` — build de produção.
- `npm test` — todos os testes (unit node + Storybook browser/Playwright).
- `npx vitest run --project unit` — só os unitários (rápido, sem browser).
- `npm run storybook` — Storybook (componentes do DS).
- `npm run lint` — ESLint (`--max-warnings 0`).

## Testes

- `tests/unit/*.test.js` — lógica pura e serviços (Supabase mockado via
  `tests/helpers/supabaseMock.js`). Imports via alias `@/`.
- Stories `.stories.jsx` com `play` — testes de componente no browser.
- Config em `vitest.config.js` (dois projetos: `unit` e `storybook`).

## Convenções

- Comentários e textos de UI em **pt-BR**.
- Cada etapa do plano vira um commit `feat:`/`fix:`/`test:` (após teste).
- Validação de formulário centralizada em `utils/validators.js`;
  formatação de campos em `utils/masks.js`.

## Checklist ao manter (sempre)

1. **Analisar o legado / código morto**: antes de mexer, confira se há
   implementações duplicadas ou não usadas (grep dos imports). Não deixe
   código órfão; remova o que ficar sem uso após a mudança.
2. **Atualizar os testes ao final**: toda mudança de comportamento deve ter
   teste em `tests/unit/` (lógica/serviço) e rodar `npx vitest run --project unit`.
   Os testes devem ser executados ao final, antes do commit, para garantir que nada quebrou.
3. **Atualizar o  quando necessStorybookário**: se um componente do DS mudar
   de API ou ganhar estado novo, atualize/crie a `.stories.jsx` (com `play`).
   O Storybook deve ser consultado para validar visualmente as mudanças e garantir que os componentes que forem incluidos na tela.}
   Somente somente se forem criados novos componentes ou mudanças visuais significativas. Se for só lógica, não precisa mexer no Storybook.
