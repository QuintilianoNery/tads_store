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
  mas não grava. A baixa real é **derivada dos pedidos** (Supabase): o estoque
  exibido = base da DummyJSON − soma do que o usuário comprou
  (`getStockConsumption`). Ver `StoreContext` (`baseStockRef`, `placeOrder`).

## Estrutura (pontos de entrada)

- `src/App.jsx` — rotas. Rotas protegidas via `src/components/RotaProtegida`.
- `src/context/StoreContext.jsx` — **estado global**: catálogo, carrinho,
  favoritos, usuário/sessão, busca, navegação (`nav`), `placeOrder`. Hub central.
- `src/screens/` — telas: Home, Catalog, Detail, Cart, Checkout, Login,
  Account, Wishlist, Help (Central de Ajuda/FAQ).
- `src/components/ds/` — design system (Button, Input, Badge, Spinner,
  StarRating, ProductCard) com stories `.stories.jsx`.
- `src/components/AddressBook.jsx` — agenda de endereços (CRUD), usada na
  conta e no checkout (modo `selectable`).
- `src/services/` — acesso a dados: `supabase.js` (cliente), `authService`,
  `productService` (DummyJSON), `favoritesService`, `cartService`,
  `addressService`, `orderService`.
- `src/lib/` — puros: `format.js` (`fmtBRL`, `finalPrice`), `orderNumber.js`.
- `src/utils/` — `validators.js`, `masks.js` (CPF/CNPJ, telefone, CEP, e-mail).

## Navegação

`nav(name, id?)` no `StoreContext` mapeia nomes → rotas via `ROUTE_PATH`.
Chaves válidas: `home, catalog, detail, cart, checkout, login, wishlist,
account, help`. Chave inexistente cai em `/` (home) — atenção a typos.

## Supabase

- Cliente em `src/services/supabase.js` (lança erro sem env vars).
- Tabelas (migrations em `supabase/migrations/`): `profiles`, `addresses`,
  `orders`, `order_items`, `favorites`, `cart_items`. Todas com **RLS**
  (cada usuário só acessa o próprio dado).
- Env (`.env`, ver `.env.example`): `VITE_SUPABASE_URL`,
  `VITE_SUPABASE_ANON_KEY`. Opcional: `VITE_API_BASE_URL` (default DummyJSON).
- Migrations rodam manualmente no SQL Editor do Supabase.

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
3. **Atualizar o Storybook quando necessário**: se um componente do DS mudar
   de API ou ganhar estado novo, atualize/crie a `.stories.jsx` (com `play`).
