# Mercado Pago MCP Server

**Mercado Pago MCP Server** implementa o padrão aberto [Model Context Protocol (MCP)](https://modelcontextprotocol.io) para facilitar o acesso às APIs e ferramentas do Mercado Pago para agentes de IA ou LLMs em ambientes de desenvolvimento compatíveis.

Este servidor atua como intermediário, traduzindo os recursos do ecossistema do Mercado Pago em _tools_ executáveis que aplicações de inteligência artificial podem acionar para realizar ações, estendendo as capacidades tradicionais das APIs do Mercado Pago para fluxos automatizados ou assistidos por IA.

## O que você pode fazer com o MCP Server

O MCP Server disponibiliza _tools_ que cobrem o ciclo completo de integração, do onboarding até a validação em produção:

- Pesquise a documentação oficial do Mercado Pago sem sair do seu ambiente de desenvolvimento.
- Gerencie suas aplicações: crie novas aplicações, obtenha credenciais e consulte as informações vinculadas à sua conta. **Disponível somente via OAuth.**
- Configure e monitore notificações Webhooks.
- Crie usuários de teste e gerencie seus saldos para validar fluxos de pagamento.
- Melhore a qualidade da sua integração antes de ir para produção e realize a medição oficial do Mercado Pago.

Para informações específicas sobre cada _tool_ e seus parâmetros, consulte [Tools disponíveis](/developers/pt/docs/mcp-server/tools).

## Pré-requisitos

Antes de começar a utilizar o servidor, confirme se está com todo o ambiente preparado:

| Requisito | Descrição |
|-|-|
| **Cliente** | A conexão ao Mercado Pago MCP Server é remota, portanto você precisa escolher um cliente a partir do qual interagir com o assistente. A solução está disponível para os principais agentes de IA: Cursor (versão 1 ou superior), VS Code, Windsurf, Cline, Claude Desktop ou Code, e ChatGPT. Em todos os casos, certifique-se de ter a versão mais recente disponível. |