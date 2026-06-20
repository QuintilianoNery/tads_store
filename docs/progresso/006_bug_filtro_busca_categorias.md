# 006 — Bug: filtro de busca "preso" ao navegar por categorias

## Sintoma

Ao clicar em uma categoria (menu superior ou cards da Home), os produtos da
categoria **não apareciam** (lista vazia). Recarregar a página fazia os
produtos voltarem.

## Causa

O termo de busca era um estado **global** (`search` no `StoreContext`) ligado
diretamente ao campo de busca do `Header`. Depois de pesquisar:

- o texto **continuava** no campo; e
- o filtro de busca **continuava ativo**.

Ao navegar para uma categoria, o catálogo filtrava os produtos da categoria
**também pelo termo de busca antigo** — como nenhum produto da categoria batia
com o termo, a lista ficava vazia. O reload limpava o `search` (estado em
memória), por isso os produtos "voltavam".

## Correção

1. **`Header.jsx`** — o campo de busca passou a usar um estado **local**
   (`query`). Ao pesquisar (`submit`), aplica o filtro global (`setSearch`),
   navega para o catálogo e **limpa o campo** (`setQuery('')`).
2. **`StoreContext.jsx`** (`nav`) — navegar para uma categoria
   (`nav('catalog', slug)`) agora **limpa o filtro de busca** (`setSearch('')`).
3. **`Catalog.jsx`** — selecionar uma categoria na barra lateral também limpa a
   busca.

## Resultado

Pesquisar filtra e limpa o campo; ir para uma categoria descarta o filtro de
busca e mostra os produtos da categoria normalmente.
