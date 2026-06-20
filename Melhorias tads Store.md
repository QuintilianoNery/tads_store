# Melhorias TADS Store — Plano de Implementação

> Itens agrupados por tema e ordenados por dependência técnica.
> Cada etapa vira um commit (após confirmação dos testes).

---

## Etapa 1 — Autenticação, sessão e segurança (base) - OK

> Tudo depois depende disso. Hoje o app roda com estado em memória
> (`StoreContext`) e login falso. Vamos conectar a implementação real de
> Supabase (já existente em `src/store`, `src/services`, `src/pages`).

- Usar a conexão com o Supabase para registrar o cadastro do usuário, fazer
  login e manter a sessão ativa enquanto o usuário estiver logado.
- Criar/usar o formulário de registro solicitando as informações necessárias.
- Usar a autenticação JWT do Supabase para gerenciar as sessões dos usuários.
- Se realizar o reload da página, o usuário deve permanecer logado, até terminar
  a sessão — que se encerra após um tempo de inatividade, ou quando clicar em
  "sair".
- Implementar a funcionalidade de logout para encerrar a sessão.
- Garantir armazenamento seguro das informações (hashing de senhas e
  criptografia de dados sensíveis — gerenciado pelo Supabase).

## Etapa 2 — UX dos formulários (validação e feedback) - OK

- Implementar uma interface de login e registro intuitiva.
- Implementar validação de formulário (dados válidos e completos antes de enviar).
- Fornecer feedback claro durante login, registro e compra (erros, sucessos e
  próximos passos).

## Etapa 3 — Proteção de rotas e dados - OK

- Certificar-se de que apenas usuários autenticados acessem suas próprias
  informações e realizem compras.

## Etapa 4 — Perfil do usuário (troca de senha) - OK

- Campo de troca de senha dentro do próprio cadastro do usuário.

## Etapa 5 — Favoritos vinculados ao usuário - OK

- Favoritos registrados e relacionados ao cadastro do usuário; ao
  adicionar/remover, atualizar no Supabase mantendo a lista sempre atualizada.
- Caso não logado: não apresentar a quantidade de itens favoritos.
  Ao logar: mostrar a quantidade no coração e, ao clicar, abrir a lista de
  favoritos do usuário para visualizar/gerenciar.
- Ao logar, limpar o estado anônimo de favoritos (e carrinho) e mostrar a
  quantidade real vinda do cadastro.

## Etapa 6 — Carrinho e controle de estoque - OK

- Se o produto não estiver em estoque, desabilitar as opções de compra e
  informar a indisponibilidade ao usuário.
- Ao logar, limpar o carrinho anônimo e refletir a quantidade real do cadastro.

## Etapa 7 — Checkout em etapas (entrega, pagamento, confirmação) - OK

- Step de **entrega**: dados de entrega; opção de adicionar novo endereço,
  registrado e relacionado ao cadastro do usuário (gerenciar endereços).
- Step de **pagamento**: escolher entre métodos (cartão de crédito, boleto, etc.).
- Step de **confirmação**: resumo da compra (produtos, endereço, método de
  pagamento e valor total) para revisão antes de finalizar.
- Se logado, os dados para a compra devem vir do cadastro do usuário logado.
- Quando vierem do cadastro, os campos ficam desabilitados, exibidos como um
  resumo do cadastro para o usuário confirmar antes de finalizar.

## Etapa 8 — Pedidos e atualização de estoque - OK

- Compras registradas e relacionadas ao cadastro do usuário (histórico e
  detalhes de cada compra).
- Ao finalizar, fazer request à API DummyJSON atualizando o estoque dos produtos comprados, mantendo o estoque sempre atualizado.

## Etapa 9 — AtuAdicionar login com google ou outras ferramentas conforme habilitado no supabase
- Implementar login social usando Google ou outras ferramentas de autenticação disponíveis no Supabase, para facilitar o acesso dos usuários e aumentar a taxa de conversão.

## Etapa 10 — Atualizar storybook caso necessário - OK
- Garantir que os componentes relacionados a autenticação, perfil, favoritos,
  carrinho e checkout estejam documentados e testados no Storybook.

## Etapa 11 — Atualizar os testes - OK
- Garantir que os testes de unidade e integração cubram as novas funcionalidades
  implementadas, especialmente para autenticação, perfil do usuário, favoritos,
  carrinho e checkout.

 (Fazer a 12.1, no lugar da 12 o me sugira a melhro forma)## Etapa 12 — Criar arquivo de memória de leitura do projeto para facilitar manutenções proximas com ia
- Criar um arquivo de resumo do projeto, incluindo a estrutura do código, principais funcionalidades e dependências, para facilitar futuras manutenções e melhorias com IA.

## 12.1 - MCP local para integração com IA (Claude) - OK
Caso eu crie um mcp local do meu projeto, que tem o contexto do projeto, como subir as imagens e executar o docker, e registrar como funciona o projeto com base no a ultima atualização do repositório, e sempre que for usado, caso tenha mudancas commitadas novas na main, ele se atualiza antes de ser usado. Nesse caso ao usar com o claude, ele irá economizar tokens?

Se sim, faça estes pontos abaixo

​A abordagem correta (Granularidade):
Divida o seu MCP em ferramentas específicas para que o Claude possa escolher o que ler. Por exemplo:
​get_docker_instructions(): Retorna apenas os comandos e arquivos de setup do Docker.
​get_latest_commit_summary(): Retorna apenas o hash e a mensagem do último commit da main (evitando trazer um git diff de milhares de linhas sem necessidade).
​search_project_docs(query): Faz uma busca local no seu contexto e entrega apenas o trecho da documentação que responde à dúvida atual do modelo.
​Construindo o MCP de forma granular, você garante que o Claude trabalhe com a precisão máxima do código de produção gastando o mínimo de tokens possível por turno.

## Etapa 13 — Documentação e README - OK
- Atualizar a documentação do projeto, incluindo o README, para refletir as novas funcionalidades e instruções de uso, instalação e contribuição.

## Etapa 14 — Atualize a versão
- Atualize a versão no package.json para refletir as mudanças e melhorias implementadas, seguindo a convenção de versionamento semântico (semver).

- crie uma tag no repositório, para que o site de deploy consiga identificar a nova versão e atualizar o ambiente de produção. 1.0.0

- Realize o commit final com a mensagem "feat: release v1.0.0" para marcar a conclusão das melhorias e o lançamento da nova versão do projeto. e envie para origin

- Crie um PR para a branch main, solicitando revisão e aprovação dos mantenedores do projeto antes de realizar o merge.

- Crie uma release no GitHub, associando a tag criada, e adicione uma descrição em tópicos das principais mudanças e melhorias implementadas nesta versão. Isso ajudará os usuários a entenderem as novidades e incentivará a adoção da nova versão. isso em PTBR

## 15 — Central de Ajuda - OK

  Crie uma central de ajuda faq faker simples para que os usuários possam tirar dúvidas comuns sobre o uso do site, políticas de compra, devoluções, etc. Isso pode ser implementado como uma seção no site ou um link para um documento externo.

## 16 - Crie a opção após ter comprado um item possa avaliar com estrelas
- Após a compra, os usuários devem ter a opção de avaliar o produto com estrelas e deixar um comentário. Isso pode ser implementado como uma seção na página de detalhes do pedido ou como um link enviado por email após a compra.
- As avaliações devem ser registradas e relacionadas ao produto e ao usuário, para que outros usuários possam visualizar as avaliações e tomar decisões de compra informadas.
- As avaliações devem ser moderadas para garantir que sejam apropriadas e úteis para outros usuários. Isso pode ser feito manualmente ou usando um sistema de moderação automatizado.
- A avaliação do usuário em escrita e avaliação em estrelas, devem aparecer na página de detalhes do produto, para que outros usuários possam ler as avaliações e ver a classificação geral do produto com base nas avaliações dos usuários.
- Use o selecionador de estrelas do Storybook para implementar a funcionalidade de avaliação por estrelas, garantindo uma interface intuitiva e fácil de usar para os usuários.

## Atualizar Filtro de Avaliação
- está 4 estrelas e acima e 3 estrelas e acima, deveria ser 4 estrelas e acima e 3 estrelas e abaixo, para que o filtro de avaliação funcione corretamente e os usuários possam visualizar produtos com avaliações mais baixas, caso desejem.
- - O filtro de ofertas de produtos tem apenas Só com ofertas e Sem ofertas, deveria ser Só com ofertas e Com ofertas, para que os usuários possam visualizar produtos com ofertas disponíveis, caso desejem.

## 17 - Implementar product update

- https://dummyjson.com/docs/products#products-update
/* updating title of product with id 1 */
fetch('https://dummyjson.com/products/1', {
  method: 'PUT', /* or PATCH */
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'iPhone Galaxy +1'
  })
})
.then(res => res.json())
.then(console.log);

Veja se tem como atualizar o estoque do produto comprado, para que o estoque fique sempre atualizado, e os usuários possam ver a disponibilidade real dos produtos ao navegar pelo catálogo. Isso pode ser feito fazendo uma requisição à API DummyJSON para atualizar o estoque dos produtos comprados, garantindo que as informações de estoque estejam sempre precisas e atualizadas para os usuários.