# TADS Store — Requisitos do Projeto

> Projeto Integrador · Desenvolvimento Front-End II · IFES Campus de Alegre  
> Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas — 2º Período  
> Professor: Cleziel Franzoni da Costa · Semanas 12 a 15 · 2026

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Identidade Visual](#2-identidade-visual)
3. [Requisitos Funcionais](#3-requisitos-funcionais)
   - [RF01 — Layout Global](#rf01--layout-global)
   - [RF02 — Cabeçalho (Header)](#rf02--cabeçalho-header)
   - [RF03 — Rodapé (Footer)](#rf03--rodapé-footer)
   - [RF04 — Página Home](#rf04--página-home)
   - [RF05 — Catálogo de Produtos (Vitrine)](#rf05--catálogo-de-produtos-vitrine)
   - [RF06 — Card de Produto](#rf06--card-de-produto)
   - [RF07 — Página de Detalhe do Produto](#rf07--página-de-detalhe-do-produto)
   - [RF08 — Busca e Filtro](#rf08--busca-e-filtro)
   - [RF09 — Autenticação (Login / Cadastro)](#rf09--autenticação-login--cadastro)
   - [RF10 — Minha Conta (Área Protegida)](#rf10--minha-conta-área-protegida)
   - [RF11 — Pedidos](#rf11--pedidos)
   - [RF12 — Endereços](#rf12--endereços)
   - [RF13 — Detalhes da Conta](#rf13--detalhes-da-conta)
   - [RF14 — Lista de Desejos (Wishlist)](#rf14--lista-de-desejos-wishlist)
   - [RF15 — Carrinho de Compras](#rf15--carrinho-de-compras)
   - [RF16 — Checkout](#rf16--checkout)
   - [RF17 — Confirmação de Pedido](#rf17--confirmação-de-pedido)
   - [RF18 — Página 404](#rf18--página-404)
4. [Requisitos Não-Funcionais](#4-requisitos-não-funcionais)
5. [Arquitetura de Componentes React](#5-arquitetura-de-componentes-react)
6. [Estrutura de Rotas](#6-estrutura-de-rotas)
7. [Integração com API — DummyJSON](#7-integração-com-api--dummyjson)
8. [Critérios de Avaliação](#8-critérios-de-avaliação)
9. [Entregas por Etapa](#9-entregas-por-etapa)
10. [Como Rodar o Projeto](#10-como-rodar-o-projeto)

---

## 1. Visão Geral

A **TADS Store** é uma aplicação de e-commerce (marketplace) desenvolvida em **React + Vite**, construída de forma incremental ao longo de quatro semanas. A aplicação consome dados reais da API pública **DummyJSON**, possui navegação SPA com React Router e uma área protegida por autenticação simulada.

| Atributo | Valor |
|---|---|
| Tipo | Single Page Application (SPA) |
| Framework | React 18+ com Vite |
| API de dados | DummyJSON (https://dummyjson.com) |
| Roteamento | React Router DOM v6 |
| Entrega final | Semana 15 |
| Valor | 18 pontos |

---

## 2. Identidade Visual

A TADS Store possui identidade visual própria, diferenciada do sistema de referência.

| Elemento | Especificação |
|---|---|
| Logo | Ícone hexagonal com letras "TA" + seta + texto "TADS STORE" |
| Paleta principal | Verde escuro (`#1a472a`) e verde médio (`#2d6a4f`) |
| Paleta de destaque | Verde claro (`#52b788`) e branco |
| Favicon | `tads_ico.ico` (fornecido) |
| Fonte sugerida | Sans-serif moderna (ex.: Inter, Roboto) |
| Tom | Tecnológico, confiável, moderno |

---

## 3. Requisitos Funcionais

---

### RF01 — Layout Global

**Descrição:** Todo o conteúdo da aplicação deve estar envolvido por um componente `Layout` reutilizável, que exibe o cabeçalho e rodapé em todas as telas, variando apenas o conteúdo central (`children`).

**Critérios de aceitação:**
- [ ] O componente `Layout` recebe e renderiza `props.children`
- [ ] O cabeçalho e rodapé aparecem em todas as rotas
- [ ] O conteúdo principal fica dentro de uma tag `<main>`
- [ ] Breadcrumb de navegação exibido abaixo do cabeçalho (ex.: `Home / Produtos / Produto X`)

---

### RF02 — Cabeçalho (Header)

**Descrição:** Barra superior fixa com logo, busca global, acesso à conta e carrinho.

**Critérios de aceitação:**
- [ ] Exibe o logo da TADS Store (imagem + nome)
- [ ] Campo de busca global com seletor de categoria e botão "Search"
- [ ] Ícone e contador da Lista de Desejos (wishlist)
- [ ] Ícone, contador de itens e valor total do carrinho
- [ ] Barra superior (topbar) com:
  - Usuário **não logado**: links "Sign up" e "Login"
  - Usuário **logado**: mensagem "Welcome [nome]!" e botão "Logout"
- [ ] Menu de navegação principal com itens: Home, Comprar, Categorias, Mais Vendidos
- [ ] Botão "All Categories" que abre painel lateral de categorias
- [ ] Mini-carrinho flutuante (dropdown) ao passar/clicar no ícone do carrinho, exibindo itens, subtotal e botões "View Cart" e "Checkout"

---

### RF03 — Rodapé (Footer)

**Descrição:** Rodapé simples com informações legais.

**Critérios de aceitação:**
- [ ] Texto de copyright: `© [ano] TADS Store. Todos os direitos reservados.`
- [ ] Links opcionais: Política de Privacidade, Termos de Uso

---

### RF04 — Página Home

**Descrição:** Página inicial da loja com banner hero, produtos em destaque, produtos sugeridos e notícias recentes.

**Critérios de aceitação:**
- [ ] **Banner Hero:** imagem/área de destaque com promoções ou chamada principal da loja
- [ ] **Grid de destaques laterais:** 4 banners menores de categorias/promoções ao lado do banner principal
- [ ] **Seção "Produtos Sugeridos":** lista horizontal de produtos recomendados
- [ ] **Seção "Produtos em Destaque":** grid com tabs de filtro rápido por categoria (All Categories), exibindo até 8 produtos em cards
- [ ] Botão "View All" que leva à página de catálogo completo
- [ ] **Seção "Notícias Recentes":** lista de artigos com imagem, título, data e resumo
- [ ] **Seção "Depoimentos":** área para exibição de avaliações de clientes
- [ ] Todos os dados de produtos vêm da API DummyJSON

---

### RF05 — Catálogo de Produtos (Vitrine)

**Descrição:** Página de listagem completa de produtos com ordenação e paginação.

**Critérios de aceitação:**
- [ ] Título "PRODUTOS" no topo da seção
- [ ] Alternância de visualização: **grid** (ícone grade) e **lista** (ícone lista)
- [ ] Seletor de ordenação: "Ordenação padrão", "Menor preço", "Maior preço", "A-Z", "Z-A"
- [ ] Grid de produtos com no mínimo 9 cards por página (3 colunas × 3 linhas)
- [ ] **Paginação** numérica com navegação por páginas (1, 2, 3, 4, ... última, →)
- [ ] Estado de **carregando** ("Carregando produtos...") enquanto a API responde
- [ ] Estado de **erro** com mensagem amigável se a API falhar
- [ ] Estado de **lista vazia** se nenhum produto for encontrado

---

### RF06 — Card de Produto

**Descrição:** Componente reutilizável que representa um produto individual na vitrine.

**Critérios de aceitação:**
- [ ] Exibe imagem do produto (`thumbnail`)
- [ ] Exibe nome do produto (`title`)
- [ ] Exibe avaliação por estrelas (0–5) com contador de avaliações
- [ ] Exibe preço formatado em Real (`R$ XX,XX`)
- [ ] Exibe preço original riscado quando há desconto (`discountPercentage`)
- [ ] Selo/badge de promoção ("SALE X%") quando `discountPercentage > 0`
- [ ] Botão de **Favoritar** (♡ / ♥) com estado local por card
- [ ] Botão de **Adicionar ao Carrinho** (ícone carrinho)
- [ ] Botão de **Comparar** (ícone comparar)
- [ ] Ao clicar no card (imagem ou nome), navega para a página de detalhe do produto
- [ ] Modal de **Quick View** ao clicar em preview rápido, exibindo imagem, nome, preço, variações (tamanho, cor) e botão comprar
- [ ] Prop `key` única baseada em `id` (obrigatório para listas com `.map()`)

---

### RF07 — Página de Detalhe do Produto

**Descrição:** Página completa com todas as informações de um produto específico, acessível via rota `/produto/:id`.

**Critérios de aceitação:**
- [ ] Busca o produto pelo `id` da URL usando `useEffect` + `fetch`
- [ ] Galeria de imagens: imagem principal grande + thumbnails clicáveis abaixo
- [ ] Lupa de zoom sobre a imagem principal
- [ ] Exibe nome (`title`), avaliação, quantidade vendida ("X sold")
- [ ] Exibe preço em destaque (`R$ XX,XX`)
- [ ] Descrição curta do produto
- [ ] Seletor de **tamanho** (botões: XS, S, M, L, XL)
- [ ] Seletor de **cor** (botões coloridos)
- [ ] Botão "Limpar" para resetar seleções de variação
- [ ] Informação de estoque ("X em estoque")
- [ ] Seletor de **quantidade** (botões `-` e `+` com campo numérico)
- [ ] Botão principal "COMPRAR" (adicionar ao carrinho)
- [ ] Links "Browse Wishlist" e "Comparar"
- [ ] SKU e Categoria do produto
- [ ] Abas de conteúdo: **Descrição**, **Informação adicional**, **Avaliações (N)**
- [ ] Breadcrumb com caminho completo (Início / Categoria / Subcategoria / Nome do produto)
- [ ] Setas de navegação lateral para produto anterior/próximo

---

### RF08 — Busca e Filtro

**Descrição:** Sistema de busca e filtragem de produtos acessível tanto no cabeçalho quanto na vitrine.

**Critérios de aceitação:**
- [ ] Campo de busca controlado (`value` + `onChange`) com estado `busca`
- [ ] Seletor de categoria no cabeçalho filtra a busca por categoria
- [ ] Busca filtra produtos por nome em tempo real (`.filter()` com `.toLowerCase().includes()`)
- [ ] Filtro por categoria via `<select>` ou botões na vitrine
- [ ] Quando busca não retorna resultados, exibir mensagem "Nenhum produto encontrado"
- [ ] A lista exibida sempre usa a lista **filtrada** no `.map()`, nunca a original
- [ ] Estado `busca` e `categoria` independentes, combinados no filtro

---

### RF09 — Autenticação (Login / Cadastro)

**Descrição:** Tela de acesso à conta com formulários de login e cadastro lado a lado.

**Critérios de aceitação:**
- [ ] Rota `/login` exibe a página "MINHA CONTA"
- [ ] **Formulário de Login** (lado esquerdo):
  - Campo "Username or email address" (obrigatório)
  - Campo "Password" (obrigatório)
  - Checkbox "Remember me"
  - Botão "LOGIN"
  - Link "Lost your password?"
- [ ] **Formulário de Cadastro** (lado direito):
  - Campo "Email address" (obrigatório)
  - Campo "Password" (obrigatório)
  - Texto sobre uso de dados pessoais
  - Botão "REGISTER"
- [ ] Login simulado: usuário e senha fixos definidos pelo desenvolvedor
- [ ] Após login bem-sucedido: redireciona para `/minha-conta`
- [ ] Após login: topbar exibe "Welcome [nome]!" e botão "Logout"
- [ ] **Logout**: limpa o estado de autenticação e redireciona para `/login`
- [ ] Credenciais de teste documentadas no README

---

### RF10 — Minha Conta (Área Protegida)

**Descrição:** Painel do usuário logado com navegação lateral e visão geral da conta.

**Critérios de aceitação:**
- [ ] Rota `/minha-conta` protegida — redireciona para `/login` se não autenticado
- [ ] Menu lateral com itens: Painel, Pedidos, Downloads, Endereços, Detalhes da Conta, Sair
- [ ] Item ativo no menu fica destacado (cor de destaque)
- [ ] **Painel (visão geral):** mensagem "Olá, [nome]! (Não é [nome]? Sair)" + texto explicativo com links para Compras recentes, Endereços e Senha
- [ ] Cada item do menu lateral navega para a sub-rota correspondente

---

### RF11 — Pedidos

**Descrição:** Listagem de pedidos realizados pelo usuário logado.

**Critérios de aceitação:**
- [ ] Acessível via menu lateral em `/minha-conta/pedidos`
- [ ] Tabela com colunas: **Pedido** (#número), **Data**, **Status**, **Total** (valor + qtd de itens), **Ações**
- [ ] Botão "VISUALIZAR" em cada linha que abre os detalhes do pedido
- [ ] Página de **detalhe do pedido** exibe:
  - Número e status do pedido (ex.: "Pedido #8547 foi realizado em [data] e está Aguardando")
  - Tabela "Detalhes do pedido" com produto, quantidade e total por item
  - Subtotal, Método de pagamento e Total geral
  - **Endereço de faturamento** com todos os campos
- [ ] Paginação com botão "PRÓXIMO" quando há mais de uma página de pedidos
- [ ] Dados simulados (array fixo) ou provenientes da API, conforme disponibilidade

---

### RF12 — Endereços

**Descrição:** Gerenciamento dos endereços de entrega e faturamento do usuário.

**Critérios de aceitação:**
- [ ] Acessível via menu lateral em `/minha-conta/enderecos`
- [ ] Exibe dois blocos lado a lado:
  - **Billing Address** (Endereço de faturamento)
  - **Shipping Address** (Endereço de entrega)
- [ ] Cada bloco exibe: Nome, Empresa, Endereço, Número, Cidade, Estado, CEP
- [ ] Botão "Edit" em cada bloco para edição do endereço
- [ ] Texto informativo: "Os endereços a seguir serão usados na página de checkout por padrão."

---

### RF13 — Detalhes da Conta

**Descrição:** Formulário para edição dos dados pessoais e senha do usuário.

**Critérios de aceitação:**
- [ ] Acessível via menu lateral em `/minha-conta/detalhes`
- [ ] Campos de dados pessoais:
  - First name (obrigatório)
  - Last name (obrigatório)
  - Display name (obrigatório) — nome exibido na loja e em avaliações
  - Email address (obrigatório)
- [ ] Seção "Password Change":
  - Current Password (deixar em branco para não alterar)
  - New Password (deixar em branco para não alterar)
  - Confirm New Password
- [ ] Botão "SAVE CHANGES" para salvar as alterações
- [ ] Validação básica: campos obrigatórios não podem estar vazios

---

### RF14 — Lista de Desejos (Wishlist)

**Descrição:** Página da lista de produtos favoritados pelo usuário.

**Critérios de aceitação:**
- [ ] Rota `/lista-de-desejos` com título "LISTA DE DESEJOS"
- [ ] Tabela com colunas: (imagem), **Product Name**, **Unit Price**, **Stock Status**, **Add to cart**, **Remove**
- [ ] Quando vazia: mensagem "No products were added to the wishlist"
- [ ] Botão "Add to cart" move o produto para o carrinho
- [ ] Botão "Remove" (×) remove o produto da lista
- [ ] Contador de wishlist no cabeçalho atualiza em tempo real

---

### RF15 — Carrinho de Compras

**Descrição:** Página completa de gerenciamento do carrinho de compras.

**Critérios de aceitação:**
- [ ] Rota `/carrinho` com título "CARRINHO"
- [ ] Tabela com colunas: **Image**, **Product**, **Price**, **Quantity**, **Total**, **Remove**
- [ ] Cada linha exibe imagem, nome do produto (com variações ex.: "Produto - Tam, Cor"), preço unitário, controles de quantidade (`-` / campo / `+`), total da linha e botão remover (ícone lixeira)
- [ ] Campo "Coupon code" + botão "Apply Coupon"
- [ ] Botão "Update Cart" para atualizar quantidades
- [ ] **Resumo "Total no carrinho"** (lado direito ou abaixo):
  - Subtotal
  - Total
  - Botão "Concluir Compra →" que leva para `/checkout`
- [ ] **Mini-carrinho (dropdown no cabeçalho)** exibe os mesmos itens com botões "View Cart" e "Checkout"
- [ ] Remover item do carrinho atualiza o contador no cabeçalho imediatamente
- [ ] Carrinho vazio exibe mensagem adequada

---

### RF16 — Checkout

**Descrição:** Página de finalização de compra com formulário de dados e resumo do pedido.

**Critérios de aceitação:**
- [ ] Rota `/checkout` com título "CHECKOUT"
- [ ] Banner de cupom de desconto no topo ("Você tem um cupom? Clique aqui")
- [ ] **Formulário "Detalhes de faturamento"** (esquerda):
  - Nome (obrigatório), Sobrenome (obrigatório)
  - Nome da empresa (opcional)
  - País (select, obrigatório)
  - Endereço (obrigatório), Número
  - Cidade (obrigatório), Estado (select, obrigatório), CEP (obrigatório)
  - Telefone (obrigatório), E-mail (obrigatório)
- [ ] Seção "Informação adicional" com campo de notas do pedido (opcional)
- [ ] **Resumo "Your order"** (direita):
  - Lista de produtos com nome, quantidade e subtotal
  - Subtotal e Total geral
- [ ] **Métodos de pagamento** (radio buttons):
  - Transferência bancária (com texto explicativo)
  - Cheque
  - Pagamento na entrega (com texto "Pagar em dinheiro na entrega")
- [ ] Checkbox "Li e concordo com os termos e condições do site" (obrigatório)
- [ ] Botão "FINALIZAR COMPRA" — desabilitado se termos não aceitos
- [ ] Após finalizar: redireciona para página de confirmação

---

### RF17 — Confirmação de Pedido

**Descrição:** Página de sucesso exibida após a finalização da compra.

**Critérios de aceitação:**
- [ ] Título "PEDIDO RECEBIDO" com mensagem "Obrigado. Seu pedido foi recebido."
- [ ] Bloco de resumo com: Número do pedido, Data, E-mail, Total, Método de pagamento
- [ ] Informação do método de pagamento escolhido
- [ ] Seção "Detalhes do pedido": tabela com produtos, subtotal, método e total
- [ ] Seção "Endereço de faturamento" com todos os dados informados no checkout
- [ ] Carrinho é esvaziado após confirmação

---

### RF18 — Página 404

**Descrição:** Página exibida quando uma rota não existe.

**Critérios de aceitação:**
- [ ] Exibida em qualquer rota não mapeada (`path="*"`)
- [ ] Mensagem clara informando que a página não foi encontrada
- [ ] Botão ou link para voltar à Home

---

## 4. Requisitos Não-Funcionais

| ID | Requisito | Descrição |
|---|---|---|
| RNF01 | Performance | A vitrine deve exibir o estado "Carregando..." enquanto aguarda resposta da API, evitando tela em branco |
| RNF02 | Tratamento de erros | Toda chamada à API deve ter `.catch()` com mensagem de erro amigável ao usuário |
| RNF03 | Responsividade | Layout adaptável para desktop (mínimo 1280px) com suporte básico a telas menores |
| RNF04 | Acessibilidade | Botões e links com texto descritivo; imagens com atributo `alt` |
| RNF05 | Imutabilidade de estado | Nunca alterar o estado diretamente — sempre usar as funções `set...()` do `useState` |
| RNF06 | Chaves únicas | Todo `.map()` deve utilizar `key={item.id}` para evitar warnings do React |
| RNF07 | Organização de código | Separação clara entre `components/` (reutilizáveis) e `pages/` (telas/rotas) |
| RNF08 | Versionamento | Projeto versionado no GitHub desde a Etapa 1, com commits por etapa |
| RNF09 | Inicialização | O projeto deve rodar sem erros com `npm install` + `npm run dev` |
| RNF10 | Sem node_modules no repositório | Arquivo `.gitignore` configurado para excluir `node_modules/` |

---

## 5. Arquitetura de Componentes React

```
src/
├── components/              # Peças reutilizáveis (não sabem de rotas)
│   ├── Layout.jsx           # Embrulha todas as páginas (Cabecalho + main + Rodape)
│   ├── Cabecalho.jsx        # Header com logo, busca, topbar, nav e mini-cart
│   ├── Rodape.jsx           # Footer com copyright
│   ├── ProdutoCard.jsx      # Card individual de produto (composição de peças)
│   ├── Vitrine.jsx          # Grid de cards com estados loading/erro/vazio
│   ├── Botao.jsx            # Botão genérico reutilizável (props: texto, cor, aoClicar)
│   ├── Selo.jsx             # Badge/tag genérico (props: texto, cor)
│   ├── Card.jsx             # Embrulho genérico com children
│   ├── BotaoFavorito.jsx    # Botão ♡/♥ com estado local
│   ├── MiniCarrinho.jsx     # Dropdown do carrinho no cabeçalho
│   ├── RotaPrivada.jsx      # Guard de rota: redireciona se não autenticado
│   └── Breadcrumb.jsx       # Trilha de navegação
│
├── pages/                   # Telas (cada uma = uma rota)
│   ├── Home.jsx             # Página inicial com banner e destaques
│   ├── Produtos.jsx         # Catálogo completo com paginação
│   ├── Detalhe.jsx          # Página de detalhe do produto (/produto/:id)
│   ├── Login.jsx            # Tela de login + cadastro
│   ├── MinhaConta.jsx       # Painel da conta (área protegida)
│   ├── Pedidos.jsx          # Lista de pedidos do usuário
│   ├── DetalhePedido.jsx    # Detalhes de um pedido específico
│   ├── Enderecos.jsx        # Gerenciamento de endereços
│   ├── DetalhesConta.jsx    # Edição de dados pessoais e senha
│   ├── ListaDesejos.jsx     # Wishlist do usuário
│   ├── Carrinho.jsx         # Página do carrinho
│   ├── Checkout.jsx         # Formulário de finalização de compra
│   ├── PedidoRecebido.jsx   # Confirmação pós-compra
│   └── NaoEncontrado.jsx    # Página 404
│
├── App.jsx                  # Configuração de rotas (BrowserRouter + Routes)
├── App.css                  # Estilos globais e variáveis CSS
└── main.jsx                 # Ponto de entrada da aplicação
```

---

## 6. Estrutura de Rotas

| Rota | Componente | Protegida | Descrição |
|---|---|---|---|
| `/` | `Home` | Não | Página inicial |
| `/produtos` | `Produtos` | Não | Catálogo completo |
| `/produto/:id` | `Detalhe` | Não | Detalhe de produto |
| `/login` | `Login` | Não | Login e cadastro |
| `/carrinho` | `Carrinho` | Não | Carrinho de compras |
| `/lista-de-desejos` | `ListaDesejos` | Não | Wishlist |
| `/checkout` | `Checkout` | Não | Finalização de compra |
| `/pedido-recebido` | `PedidoRecebido` | Não | Confirmação de pedido |
| `/minha-conta` | `MinhaConta` | **Sim** | Painel do usuário |
| `/minha-conta/pedidos` | `Pedidos` | **Sim** | Lista de pedidos |
| `/minha-conta/pedidos/:id` | `DetalhePedido` | **Sim** | Detalhe do pedido |
| `/minha-conta/enderecos` | `Enderecos` | **Sim** | Endereços |
| `/minha-conta/detalhes` | `DetalhesConta` | **Sim** | Dados da conta |
| `*` | `NaoEncontrado` | Não | Página 404 |

---

## 7. Integração com API — DummyJSON

Base URL: `https://dummyjson.com`

| Endpoint | Método | Para que serve | Etapa |
|---|---|---|---|
| `/products?limit=12&skip=0` | GET | Lista produtos com paginação | 2 |
| `/products/search?q={termo}` | GET | Busca por texto | 2 |
| `/products/categories` | GET | Lista de categorias para filtro | 2 |
| `/products/category/{cat}` | GET | Produtos de uma categoria | 2 |
| `/products/{id}` | GET | Detalhe de produto por ID | 3 |
| `/auth/login` | POST | Login real com token (bônus) | 4 |

**Campos do produto retornados pela API:**

| Campo | Tipo | Uso |
|---|---|---|
| `id` | number | Chave única, ID na rota |
| `title` | string | Nome do produto |
| `description` | string | Descrição completa |
| `price` | number | Preço |
| `discountPercentage` | number | % de desconto |
| `rating` | number | Avaliação (0–5) |
| `stock` | number | Quantidade em estoque |
| `brand` | string | Marca |
| `category` | string | Categoria |
| `thumbnail` | string | URL da imagem principal |
| `images` | string[] | URLs da galeria |

---

## 8. Critérios de Avaliação

| Critério | Etapa | Pontos | O que é avaliado |
|---|---|---|---|
| Componentização | Etapa 1 (Sem. 12) | 3,5 | Componentes reutilizáveis, props, composição, `children`, organização em pastas |
| Estado, Hooks e API | Etapa 2 (Sem. 13) | 4,5 | Consumo de API com `useEffect`/`useState`, busca, filtro, loading e erro |
| Navegação SPA | Etapa 3 (Sem. 14) | 3,5 | React Router, rota de detalhe com `:id` e página 404 |
| Autenticação | Etapa 4 (Sem. 15) | 3,5 | Login, rota protegida com redirecionamento e logout |
| Qualidade e README | Todas | 3,0 | Código limpo, identidade própria, README claro, repositório organizado |
| **TOTAL** | | **18,0** | |

**Bônus (até +2,0 pontos):**
- Deploy online (Vercel ou Netlify)
- Login real com token via DummyJSON (`POST /auth/login`)
- Carrinho de compras funcional
- Melhorias notáveis de design e usabilidade

---

## 9. Entregas por Etapa

### Etapa 1 — Semana 12 · Componentização

- [ ] Projeto criado com Vite (`npm create vite@latest tads-store -- --template react`)
- [ ] Rodando com `npm run dev`
- [ ] Componentes: `Layout` (com `children`), `Cabecalho`, `Rodape`, `Vitrine`, `ProdutoCard`
- [ ] Peças de UI: `Botao` e `Selo`
- [ ] Mínimo de 4 produtos em array fixo exibidos via `.map()`
- [ ] Renderização condicional (ex.: selo de frete grátis)
- [ ] CSS com identidade própria (cores e logo da TADS Store)
- [ ] Primeiro commit no GitHub

### Etapa 2 — Semana 13 · Estado, Hooks e API

- [ ] Vitrine carrega produtos da DummyJSON via `useEffect` + `fetch`
- [ ] Estado de `carregando` exibido na tela
- [ ] Estado de `erro` com mensagem amigável
- [ ] `ProdutoCard` exibindo `title`, `price` e `thumbnail`
- [ ] Campo de busca funcional (input controlado)
- [ ] Filtro por categoria (`<select>` ou botões)
- [ ] `BotaoFavorito` com estado local por card
- [ ] Commit no GitHub (evolução do mesmo projeto)

### Etapa 3 — Semana 14 · SPA e Rotas

- [ ] `react-router-dom` instalado e configurado
- [ ] Rota `/` → `Home`
- [ ] Rota `/produtos` → `Produtos`
- [ ] Rota `/produto/:id` → `Detalhe` (busca produto pelo ID da URL)
- [ ] Rota `*` → `NaoEncontrado` (404)
- [ ] Clique no card navega para página de detalhe
- [ ] Commit no GitHub

### Etapa 4 — Semana 15 · Autenticação + Entrega Final

- [ ] Tela de login com formulário funcional
- [ ] Login simulado com usuário/senha fixos
- [ ] Rota `/minha-conta` protegida com `RotaPrivada`
- [ ] Redirecionamento para `/login` se não autenticado
- [ ] Logout funcional
- [ ] README completo e atualizado
- [ ] Prints das telas principais
- [ ] Repositório GitHub público e organizado
- [ ] **Entrega no AVA dentro do prazo**

---

## 10. Como Rodar o Projeto

```bash
# 1. Clonar o repositório
git clone https://github.com/seu-usuario/tads-store.git

# 2. Entrar na pasta
cd tads-store

# 3. Instalar dependências
npm install

# 4. Iniciar o servidor de desenvolvimento
npm run dev

# 5. Abrir no navegador
# http://localhost:5173
```

**Credenciais de teste (login simulado):**

| Campo | Valor |
|---|---|
| Usuário | `admin` |
| Senha | `tads2026` |

> ⚠️ Estas credenciais são para demonstração do projeto. O login simulado não acessa nenhum servidor externo.

---

*TADS Store · Desenvolvimento Front-End II · IFES Campus de Alegre · 2026*
