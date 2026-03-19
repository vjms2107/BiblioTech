# 📚 Sistema de Gerenciamento de Biblioteca

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

Uma aplicação Full Stack robusta para controle de acervo bibliográfico, locações e gestão de usuários, desenvolvida com foco em segurança e usabilidade.

---

## 🚀 Funcionalidades

### **Para Clientes**
*   **Catálogo Dinâmico:** Visualização de livros com capas reais, autores e categorias.
*   **Sistema de Locação:** Interface simples para realizar empréstimos de livros disponíveis.
*   **Autenticação Segura:** Login persistente via JWT (JSON Web Tokens).

### **Para Administradores**
*   **Dashboard de Gestão:** Painel exclusivo para monitorar o total de livros, usuários e locações ativas.
*   **Controle de Inventário:** Cadastro, edição e exclusão de livros e usuários.
*   **Gestão de Devoluções:** Interface para dar baixa em locações e atualizar o status do acervo automaticamente.

---

## 🛠️ Tecnologias Utilizadas

*   **Backend:** Node.js com Framework Express.
*   **Banco de Dados:** SQLite (leve e eficiente para ambientes de desenvolvimento).
*   **ORM:** Sequelize para abstração e manipulação de dados.
*   **Frontend:** HTML5, CSS3 (Design Responsivo) e JavaScript Assíncrono (Fetch API).
*   **Segurança:** Autenticação baseada em níveis de acesso (Admin/Cliente).

---

## 📦 Como rodar o projeto

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/SEU_USUARIO/NOME_DO_REPO.git](https://github.com/SEU_USUARIO/NOME_DO_REPO.git)
2.**Instale as dependências**
  npm install
3.**Inicie o servidor**
  node script.js
4.**Acesse o navegdor**
  http://localhost:3000

##📂 Estrutura de Arquivos Principal

  **script.js**: Ponto de entrada da aplicação e configuração das rotas API.
  
  **models/**: Definição dos esquemas (Livros, Usuarios, Locacaos).
  
  **public/**: Arquivos estáticos (HTML, CSS e scripts do front-end).
  
  **.gitignore**: Configuração para ignorar arquivos desnecessários (node_modules, banco local).

##O Gemini disse
Com certeza! Para um projeto ser respeitado no GitHub, o README precisa ser o "tapete vermelho". Ele deve explicar o que é o sistema, quais tecnologias usa e, principalmente, como outra pessoa pode rodar o código.

Crie um arquivo chamado README.md na raiz do seu projeto e cole o conteúdo abaixo:

Markdown
# 📚 Sistema de Gerenciamento de Biblioteca

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

Uma aplicação Full Stack robusta para controle de acervo bibliográfico, locações e gestão de usuários, desenvolvida com foco em segurança e usabilidade.

---

## 🚀 Funcionalidades

### **Para Clientes**
*   **Catálogo Dinâmico:** Visualização de livros com capas reais, autores e categorias.
*   **Sistema de Locação:** Interface simples para realizar empréstimos de livros disponíveis.
*   **Autenticação Segura:** Login persistente via JWT (JSON Web Tokens).

### **Para Administradores**
*   **Dashboard de Gestão:** Painel exclusivo para monitorar o total de livros, usuários e locações ativas.
*   **Controle de Inventário:** Cadastro, edição e exclusão de livros e usuários.
*   **Gestão de Devoluções:** Interface para dar baixa em locações e atualizar o status do acervo automaticamente.

---

## 🛠️ Tecnologias Utilizadas

*   **Backend:** Node.js com Framework Express.
*   **Banco de Dados:** SQLite (leve e eficiente para ambientes de desenvolvimento).
*   **ORM:** Sequelize para abstração e manipulação de dados.
*   **Frontend:** HTML5, CSS3 (Design Responsivo) e JavaScript Assíncrono (Fetch API).
*   **Segurança:** Autenticação baseada em níveis de acesso (Admin/Cliente).

---

## 📦 Como rodar o projeto

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/SEU_USUARIO/NOME_DO_REPO.git](https://github.com/SEU_USUARIO/NOME_DO_REPO.git)
2.**Instale as dependências:**
npm install
3.**Inicie o servidor:**
node script.js
O banco de dados SQLite será criado e sincronizado automaticamente na primeira execução.

4.**Acesse no navegador:**
http://localhost:3000

##📂 Estrutura de Arquivos Principal
**script.js:** Ponto de entrada da aplicação e configuração das rotas API.

**models/:** Definição dos esquemas (Livros, Usuarios, Locacaos).

**public/:** Arquivos estáticos (HTML, CSS e scripts do front-end).

**.gitignore:** Configuração para ignorar arquivos desnecessários (node_modules, banco local).

##📝 Licença
Este projeto está sob a licença MIT. Sinta-se à vontade para usar, modificar e distribuir.

Desenvolvido com 💻 e ☕ por [Victor Maciel].
