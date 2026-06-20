# TADS Store

Marketplace de tecnologia (pt-BR) construído em **React 18 + Vite**, fiel ao
**TADS Store Design System** (trust-blue + âmbar, fonte Manrope).

Nasceu como protótipo offline e evoluiu para uma versão real:

- **Autenticação e dados** no **Supabase** (auth JWT + Postgres com RLS).
- **Catálogo** vindo da **API DummyJSON** (somente leitura).
- Carrinho, favoritos, endereços e pedidos **persistidos por usuário**.

## Funcionalidades

- **Conta e sessão**: cadastro, login, logout e sessão persistente (JWT do
  Supabase) — o usuário permanece logado após reload.
- **Perfil**: dados do usuário e troca de senha na própria conta.
- **Favoritos** vinculados ao usuário (sincronizados no Supabase).
- **Carrinho** vinculado ao usuário, com controle de estoque (opções de compra
  desabilitadas quando indisponível).
- **Checkout em etapas**: entrega (com agenda de endereços), pagamento e
  confirmação (resumo antes de finalizar).
- **Pedidos**: histórico e detalhes por usuário.
- **Rotas protegidas**: apenas usuários autenticados acessam seus próprios dados.
- **Validação e máscaras** de formulário (CPF/CNPJ, telefone, CEP, e-mail).

> ⚠️ **Estoque**: a DummyJSON não persiste alterações de estoque (aceita `PUT` e
> finge sucesso). A baixa real é **derivada dos pedidos** no Supabase: o estoque
> exibido = base da DummyJSON − soma do que o usuário comprou. Ver
> `getStockConsumption` / `placeOrder` em
> [`src/context/StoreContext.jsx`](src/context/StoreContext.jsx).

## Stack

- **React 18 + Vite** ([`vite.config.js`](vite.config.js)) + `react-router-dom`.
- **Supabase** (`@supabase/supabase-js`) — auth + Postgres + RLS.
- **DummyJSON** — catálogo de produtos.
- **Vitest** — testes unitários (node) + testes de componente (Storybook/browser).
- Estilo: CSS vars (design tokens), sem framework de UI.

## Requisitos

- Node.js 18+
- npm
- Uma conta/projeto no [Supabase](https://supabase.com) (auth + banco)

## Configuração (variáveis de ambiente)

Copie o exemplo e preencha com os seus valores:

```bash
cp .env.example .env
```

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | ✅ | URL do projeto Supabase (Settings → API) |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Chave anônima do Supabase |
| `VITE_MP_PUBLIC_KEY` | opcional | Chave pública do Mercado Pago |
| `VITE_API_BASE_URL` | opcional | Base da API de catálogo (default DummyJSON) |

> O cliente Supabase ([`src/services/supabase.js`](src/services/supabase.js))
> lança erro se as variáveis obrigatórias não estiverem definidas.

### Banco de dados (migrations)

As tabelas (`profiles`, `addresses`, `orders`, `order_items`, `favorites`,
`cart_items`) ficam em [`supabase/migrations/`](supabase/migrations/), todas com
**RLS** (cada usuário só acessa o próprio dado). Rode os arquivos `.sql`
manualmente no **SQL Editor** do Supabase, na ordem cronológica do nome.

## Como rodar

> Todos os comandos são executados a partir da **raiz do projeto** (`tads_store/`).

```bash
npm install        # instala as dependências
npm run dev        # app em http://localhost:5173
npm run build      # build de produção (pasta dist/)
npm run preview    # serve o build de produção
```

## Scripts disponíveis

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Sobe a aplicação (Vite) em <http://localhost:5173> |
| `npm run build` | Gera o build de produção em `dist/` |
| `npm run preview` | Serve localmente o build de produção |
| `npm run lint` | Roda o ESLint (`--max-warnings 0`) |
| `npm run storybook` | Sobe o Storybook em <http://localhost:6006> |
| `npm run build-storybook` | Gera o Storybook estático em `storybook-static/` |
| `npm test` | Roda todos os testes (unit em node + Storybook em browser) |
| `npm run test:watch` | Roda os testes em modo watch |

## Testes

São dois projetos de teste (config em [`vitest.config.js`](vitest.config.js)):

- **`unit`** — lógica pura e serviços, em [`tests/unit/`](tests/unit/). O Supabase
  é mockado via [`tests/helpers/supabaseMock.js`](tests/helpers/supabaseMock.js).
  Imports usam o alias `@/`.
- **`storybook`** — testes de componente do Design System, nas `*.stories.jsx`
  com função `play`, rodando em **Chromium real via Playwright**.

```bash
npm test                              # tudo (unit + storybook)
npx vitest run --project unit         # só os unitários (rápido, sem browser)
npx vitest --ui                       # dashboard no navegador
npx vitest --browser.headless=false   # abre o Chromium para ver as interações
```

> A primeira execução do projeto `storybook` pode ser mais lenta porque o
> Playwright inicializa o navegador.

## Estrutura

```text
src/
├── App.jsx            # rotas (protegidas via components/RotaProtegida)
├── components/
│   ├── ds/            # Design System: Button, Input, Badge, StarRating, Spinner, ProductCard (+ stories)
│   ├── AddressBook.jsx# agenda de endereços (CRUD), usada na conta e no checkout
│   ├── Header.jsx     # cabeçalho (topbar + busca + nav)
│   ├── Footer.jsx     # rodapé
│   └── Icon.jsx       # ícones Lucide inline
├── context/           # StoreContext — estado global (catálogo, carrinho, favoritos, sessão, nav)
├── screens/           # Home, Catalog, Detail, Cart, Checkout, Login, Account, Wishlist
├── services/          # acesso a dados: supabase, auth, product, favorites, cart, address, order
├── lib/               # puros: format.js (fmtBRL, finalPrice), orderNumber.js
├── utils/             # validators.js, masks.js
└── styles/            # tokens (variables.css) + reset global (global.css)

supabase/migrations/   # schema SQL (rodar manualmente no Supabase)
tests/                 # unit/ (node) + helpers/
```

## Contribuição

1. Crie uma branch a partir de `main` (`feature/...` ou `fix/...`).
2. Siga as convenções (textos e comentários em **pt-BR**).
3. Cada mudança de comportamento deve ter teste em `tests/unit/`; rode
   `npx vitest run --project unit` antes de commitar.
4. Atualize o Storybook quando um componente do DS mudar de API ou ganhar
   estado novo.
5. Garanta `npm run lint` sem warnings.
6. Commits seguem `feat:` / `fix:` / `test:` / `docs:` / `chore:`.
7. Abra um PR para `main` para revisão.

> Mais contexto de arquitetura e armadilhas em [`CLAUDE.md`](CLAUDE.md).
