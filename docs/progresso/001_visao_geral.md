# 001 — Visão Geral do Progresso

> Pasta de registro dos pontos implementados na **TADS Store**, para servir de
> memória e facilitar a continuidade do desenvolvimento.

## Como esta pasta funciona

Cada arquivo numerado registra uma etapa/assunto implementado:

| Arquivo | Assunto |
|---|---|
| `001_visao_geral.md` | Este índice e estado geral do projeto |
| `002_mercadopago_integracao.md` | Integração de pagamento Mercado Pago (frontend) |
| `supabase/migrations/*_initial_schema.sql` | Script SQL das tabelas no Supabase |
| `004_edge_function_create_preference.md` | Código e deploy da Edge Function de pagamento |
| `005_mercadopago_setup.md` | Como obter credenciais MP e configurar `.env` |
| `006_bug_filtro_busca_categorias.md` | Bug: filtro de busca preso ao navegar por categorias (corrigido) |

## Stack do projeto

- **React 18 + Vite** (SPA)
- **React Router DOM v6** (navegação)
- **Zustand** (estado global: carrinho, wishlist, auth) com persistência em localStorage
- **Supabase** (autenticação e, opcionalmente, persistência de pedidos)
- **Mercado Pago Checkout Pro** (pagamento, via Edge Function)
- **DummyJSON** (catálogo de produtos)

## Estado atual (resumo)

✅ Implementado e funcionando:
- Layout global (Header, Footer, Layout, Breadcrumb), identidade visual própria
- Catálogo com paginação, busca, filtro, ordenação, estados loading/erro/vazio
- Card de produto, página de detalhe (`/produto/:id`)
- Carrinho completo (`/carrinho`) + mini-carrinho no header
- Wishlist (`/lista-de-desejos`)
- Autenticação + rota protegida (`/minha-conta` e sub-rotas)
- Checkout (`/checkout`) e confirmação (`/pedido-recebido`)
- Página 404
- **Integração Mercado Pago** (ver `002`)

⚠️ Requer ação manual do desenvolvedor para o pagamento funcionar de ponta a ponta:
- Publicar a Edge Function `create-preference` no Supabase (ver `004`)
- Configurar as credenciais do Mercado Pago (ver `005`)

> Revisão detalhada dos requisitos (RF01–RF18): ver final do `002` e o relatório
> entregue no chat.
