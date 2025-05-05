# 📋 Sistema de Controle de Presença – Projeto ELLP

Sistema desenvolvido para o **Projeto ELLP – Ensino Lúdico de Lógica e Programação**, com o objetivo de registrar e monitorar a presença de alunos em oficinas educacionais voltadas para jovens em situação de vulnerabilidade social.

## 🏗️ Diagrama de Arquitetura
O sistema segue uma arquitetura baseada em camadas, integrando o frontend em React.js, backend com Node.js e Express, e serviços do Firebase para autenticação e banco de dados.

Componentes:

    Usuário (Admin/Monitor): Acessa via navegador.

    Frontend (React.js): Interface de usuário com funcionalidades como cadastro, visualização e registro de presença.

    Backend (Node.js + Express): API responsável por regras de negócio, autenticação e geração de relatórios.

    Firebase:

        Auth (Email/Senha): Gerencia login dos usuários.

        Realtime Database: Armazena dados de alunos, oficinas e presenças.
    ![Diagrama de Arquitetura](./Docs/DiagramaArquitetura.jpeg)

## ✨ Funcionalidades
- **RelatorioCSV:** Geração de relatórios de presença e histórico.
- **AutenticacaoService:** Realiza login e logout de usuários.

![Diagrama de Classes](./Docs/DiagramadeClasses.jpeg)

## 🖥️ Tecnologias Utilizadas


- ✅ Cadastrar aluno
- ✅ Cadastrar oficina
- ✅ Registrar presença
- ✅ Editar dados (aluno/oficina)
- ✅ Visualizar lista de presença
- ✅ Visualizar histórico do aluno
- ✅ Excluir registro incorreto
- ✅ Gerar relatório CSV

## 🎭 Casos de Uso

O sistema conta com dois perfis de usuário: **Administrador** e **Monitor**. Ambos podem realizar a maioria das ações, mas apenas o Administrador pode excluir registros incorretos.

![Casos de Uso](./Docs/DiagramaCasosdeUso.jpeg)

## 🧩 Diagrama de Classes

O sistema é estruturado em torno das seguintes entidades principais:

- **Usuario:** Responsável por acessar o sistema.
- **Aluno:** Representa os participantes das oficinas.
- **Oficina:** Evento educacional com título, descrição e data.
- **Presenca:** Relaciona alunos e oficinas, com registro de data.
- **Frontend:** React.js
- **Backend:** Node.js com Express
- **Banco de Dados & Autenticação:** Firebase
- **Relatórios:** Exportação em CSV

## 🚀 Como Executar o Projeto

1. Clone o repositório:
   git clone https://github.com/lluciomoraesUTF/sistema_presenca_ellp.git
   
2.  Instale as dependências do frontend e backend:
    cd Frontend
    npm install
    cd ../Backend
    npm install
O sistema é estruturado em torno das seguintes entidades principais:

- **Usuario:** Responsável por acessar o sistema.
- **Aluno:** Representa os participantes das oficinas.
- **Oficina:** Evento educacional com título, descrição e data.
- **Presenca:** Relaciona alunos e oficinas, com registro de data.
- **RelatorioCSV:** Geração de relatórios de presença e histórico.
- **AutenticacaoService:** Realiza login e logout de usuários.

![Diagrama de Classes](./Docs/DiagramadeClasses.jpeg)

## 🖥️ Tecnologias Utilizadas

- **Frontend:** React.js
- **Backend:** Node.js com Express

    
3.  Configure o Firebase:
    Crie um projeto no Firebase.
    Ative a autenticação por email e senha.
    Substitua as credenciais no arquivo .env.

4.  Inicie os servidores:

    Backend:        
        npm run dev
    
    Frontend:
        cd ../Frontend
        npm start

## 📁 Estrutura do Projeto

sistema_presença_ellp/
├── Frontend/               # React.js
├── Backend/                # Express.js
├── Docs/                   # Diagramas
│   ├── DiagramadeClasses.jpeg
│   └── DiagramaCasosUso.jpeg
│   └── DiagramaArquitetura.jpeg
└── README.md

## 🛡️ Licença
Este projeto está licenciado sob a MIT License.

## 👥 Desenvolvedores
Rythielly Garcia Bezerra

Gustavo Betiati

Lúcio da Cruz de Moraes

