# Boas-vindas ao backend do projeto networking-manager!

Aqui você vai encontrar os detalhes de como instalar/rodar as dependêndencias/requisições do backend deste projeto.

# Entregáveis

<details>
  <summary><strong>👨‍💻 O que foi desenvolvido</strong></summary><br />

  Construção de uma Plataforma de Gestão para Grupos de Networking.

</details>

# Orientações

<details>
  <summary><strong>:whale: Rodando Backend Localmente</strong></summary><br />
  
  ## Instalação

  1. Após clonar o repositório e entrar no diretório networking-manager/backend:

  > Instale as dependências [**Caso existam**] com `npm install`

</details>

<details>
  <summary><strong>🔁 Live reload</strong></summary><br />

  Uso o [Nodemon](https://nodemon.io) para monitorar as mudanças nos arquivos e reiniciar o servidor automaticamente.

  Este projeto já vem com as dependências relacionadas ao _nodemon_ configuradas no arquivo `package.json`.

  Para iniciar o servidor em modo de desenvolvimento basta executar o comando `npm run dev`. Este comando fará com que o servidor reinicie de forma automática ao salvar uma modificação realizada nos arquivos backend do projeto.
</details>

<details>
  <summary><strong>🛠 Testes</strong></summary><br />

  Usaremos o [Jest](https://jestjs.io/pt-BR/) e o [Frisby](https://docs.frisbyjs.com/) para fazer os testes de API.

  Este projeto já vem configurado e com suas dependências

  ### Executando todos os testes

  Para poder executar os testes, inicie sua aplicação com `npm run dev`, em seguida, basta executar o comando `npm test` e **todos** os seus testes serão executados.

  ### Executando um teste específico

  Para executar um teste expecífico, inicie sua aplicação com `npm run dev`, em seguida, basta executar o comando `npm test nome-do-teste`.

  Ex: Para executar o teste referente ao **login**, basta digitar `npm test login`.

  :warning: **Importante:** os comandos de testes podem ser executados tanto no terminal do seu computador quanto do **_Docker_**.
  Obs: testes desevolvidos pelo time da trybe.
</details>

<details>
  <summary><strong>🗣 Me dê feedbacks sobre o projeto!</strong></summary><br />

</details>
