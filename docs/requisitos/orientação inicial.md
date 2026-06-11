Olá Kiro, tudo bem? 



Vamos iniciar a criação do projeto com base nos requisitos levantados. Lembrando que seja realizada a implementação com boas praticas de desenvolvimento de software, e reutilização de componentes. Boas praticas de desenvolvimento js, css, html. Boas praticas de reutilização e performance.

A parte de backand e banco de dados, deve ser feita para usar superbase, com registro de usuários, cadastro e registro com autenticação JWT no superbase.





P: Você já tem um projeto criado no Supabase com a URL e a chave anon key em mãos? R: Não, ainda vou criar agora

P: Qual estilo de CSS prefere usar no projeto? R: CSS Modules (arquivo .module.css por componente)

P: Para o gerenciamento de estado global (carrinho, usuário logado, wishlist), qual abordagem prefere? R: Zustand (leve e simples)



Lembrando que, vou utilizar o checout Checkout Pro do mercado pago, para fazer a parte do checout da minha aplicação

Primeiro de tudo preciso configurar na minha aplicação os dados do mercado pago 


Já instalei 
Instale o SDK do Mercado Pago na linguagem que melhor se adapta à sua integração, utilizando um gerenciador de dependências, conforme demonstrado a seguir.

npm install mercadopago
Agora configure para mim

// SDK do Mercado Pago
import { MercadoPagoConfig, Preference } from 'mercadopago';
// Adicione credenciais
const client = new MercadoPagoConfig({ accessToken: 'YOUR_ACCESS_TOKEN' });

Faça essa parte do mercado pago primeiro se for possíve se precisar pode usar o MCP do mercadopago C:\Repositorios\tads_store\mcp_mercado_pago.md,
depois siga com as instruções de desenvolvimento da aplicação.
C:\Repositorios\tads_store\Levantamento de requisitos.md

monte uma pasta para registrar os pontos que forem implementados, apra facilitar sua memória depois.
pode cirar 001 e o nome do arquivo.md, 02 ....







