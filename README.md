# TADS Store

Marketplace de tecnologia (pt-BR) construído em **React + Vite**, fiel ao protótipo
`TADS Store (offline)` e ao **TADS Store Design System** (trust-blue + âmbar, fonte
Manrope). Estado de carrinho, favoritos, usuário e busca é mantido **em memória**
(sem API/Supabase), exatamente como o modelo offline.

## Requisitos

- Node.js 18+
- npm

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
| `npm run lint` | Roda o ESLint em todo o projeto |
| `npm run storybook` | Sobe o Storybook em <http://localhost:6006> |
| `npm run build-storybook` | Gera o Storybook estático em `storybook-static/` |
| `npm test` | Roda os testes de componente (Vitest + Playwright) |
| `npm run test:watch` | Roda os testes em modo watch - Modo escuta dos arquivos, sempre que tem alterações|

## Testes

**Onde rodar:** na **raiz do projeto** (`tads_store/`) — não existe uma pasta separada
de testes. Basta executar:

```bash
npm test
```

**Onde ficam os testes:** eles são co-localizados com os componentes do Design System,
em **`src/components/ds/`**, nos arquivos `*.stories.jsx`. Cada _story_ funciona como
um caso de teste, e as funções `play` contêm os testes de interação:

```text
src/components/ds/
├── Button.stories.jsx        # clique dispara onClick; disabled não dispara
├── Input.stories.jsx         # exibe erro/aria-invalid; digitação atualiza valor
├── Badge.stories.jsx         # renderização + conteúdo
├── StarRating.stories.jsx    # acessibilidade (aria-label) + contagem
├── Spinner.stories.jsx       # role="status" / aria-label
└── ProductCard.stories.jsx   # onAddToCart / onToggleWishlist / badge de desconto
```

**Como funciona:** o runner é o **Vitest** em _browser mode_, executando cada story
num **Chromium real via Playwright** (headless). A configuração está em
[`vitest.config.js`](vitest.config.js) e usa o addon `@storybook/addon-vitest`, que
reaproveita os tokens/fonte definidos em [`.storybook/preview.jsx`](.storybook/preview.jsx).

Também é possível rodar/visualizar os testes pelo painel **Testing** dentro do
Storybook (`npm run storybook`).

> A primeira execução pode ser mais lenta porque o Playwright inicializa o navegador.

### Ver os logs e o navegador

Por padrão os testes rodam em modo _headless_ (navegador invisível). Para
acompanhar a execução e inspecionar os logs há duas formas:

```bash
npx vitest --ui                       # dashboard no navegador, com logs e detalhes de cada teste
npx vitest --browser.headless=false   # abre o Chromium real para ver as interações acontecendo
```

- `--ui` abre a interface do Vitest no navegador, com o resultado de cada _story_,
  mensagens de `console.log` e os stack traces das falhas.
- `--browser.headless=false` mostra o Chromium controlado pelo Playwright, útil
  para ver o componente sendo renderizado e as interações (`play`) em tempo real.

Os `console.log` dentro dos componentes/stories também aparecem normalmente no
terminal ao rodar `npm test` ou `npm run test:watch`.

## Estrutura

```text
src/
├── components/
│   ├── ds/            # Design System: Button, Input, Badge, StarRating, Spinner, ProductCard (+ stories/testes)
│   ├── Header.jsx     # cabeçalho (topbar + busca + nav)
│   ├── Footer.jsx     # rodapé
│   └── Icon.jsx       # ícones Lucide inline
├── context/           # StoreContext — estado global em memória
├── data/              # catálogo estático (products.js)
├── lib/               # helpers (format.js)
├── screens/           # telas: Home, Catalog, Detail, Cart, Checkout, Login, Account, Wishlist
└── styles/            # tokens (variables.css) + reset global (global.css)
```
