# Lara Health

Uma plataforma abrangente de gestão de saúde construída com tecnologias web modernas. Este monorepo contém tanto o backend da API quanto a aplicação frontend para gerenciar dados

## Integração Financeira Lara

A plataforma possui integração completa com os serviços financeiros da Lara:

### Fluxo de Propostas Financeiras

1. **Inicialização**: Criação de proposta financeira através da API Lara
2. **Cálculo de Parcelas**: Uso de módulo WASM para cálculos de planos de pagamento
3. **Finalização**: Conclusão do contrato e envio via WhatsApp
4. **Rastreamento**: Monitoramento do status da proposta durante todo o processo

### Componentes Principais

- **Cliente Lara API**: Comunicação com serviços externos da Lara
- **Autenticação JWT**: Acesso seguro à API Lara com tokens de empresa
- **Módulo WASM**: Cálculos de alta performance para planos de pagamento
- **Gestão de Status**: Controle do estado das propostas nos registros de consultas
- **Gestão de Status**: Controle do estado dos contratos ao processar os webhooks

## 🏗️ Arquitetura

Este projeto está estruturado como um monorepo PNPM workspace com dois pacotes principais:

- **API** (`/api`) - Backend Node.js/Express com banco de dados MySQL e Prisma ORM
- **Frontend** (`/app`) - Aplicação React com componentes de UI modernos e integração com serviços financeiros Lara

## 🚀 Início Rápido

### Pré-requisitos

- Node.js (v22 ou superior)
- PNPM (v10 ou superior)

### Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd lara-health
```

2. Instale as dependências:

```bash
pnpm install
```

3. Inicie o ambiente de desenvolvimento:

```bash
pnpm start
```

Isso iniciará tanto o servidor da API (porta 3000) quanto o servidor de desenvolvimento do frontend simultaneamente.

## 📁 Estrutura do Projeto

```text
lara-health/
├── api/                     # API Backend
│   ├── src/
│   │   ├── controllers/     # Manipuladores de requisição
│   │   ├── services/        # Lógica de negócio
│   │   ├── routes/          # Rotas da API
│   │   ├── database/        # Configuração do banco e seeding
│   │   ├── api/             # Cliente Lara API
│   │   ├── types/           # Tipos TypeScript para Lara
│   │   └── server.ts        # Configuração do servidor Express
│   ├── prisma/
│   │   └── schema.prisma    # Schema do banco Prisma
│   └── package.json
├── app/                 # Aplicação Frontend
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── routes/          # Rotas do TanStack Router
│   │   ├── services/        # Serviços cliente da API
│   │   ├── types/           # Tipos TypeScript
│   │   └── main.tsx         # Ponto de entrada da aplicação
│   └── package.json
└── package.json            # Configuração do workspace raiz
```

## 🛠️ Stack Tecnológica

### Backend (API)

- **Runtime**: Node.js com TypeScript
- **Framework**: Express.js
- **Banco de Dados**: MySQL com Prisma ORM
- **Autenticação**: JWT (JSON Web Tokens)
- **Integrações Externas**: API Lara para serviços financeiros
- **Qualidade de Código**: Biome para linting e formatação
- **Desenvolvimento**: ts-node-dev para hot reloading

### Frontend

- **Framework**: React 18 com TypeScript
- **Ferramenta de Build**: Vite
- **Roteamento**: TanStack Router
- **Componentes UI**: Primitivos do Radix UI
- **Estilização**: CSS com Tailwind CSS para design moderno
- **Gráficos**: Recharts para visualização de dados
- **Estado**: TanStack Query para gerenciamento de estado do servidor
- **Cálculos Financeiros**: WASM para cálculos de planos de pagamento
- **Ícones**: Tabler Icons e Lucide React
- **Desenvolvimento**: Servidor dev do Vite com HMR

## 🏥 Funcionalidades

### Funcionalidade Principal

- **Gestão de Empresas**: Criar e gerenciar organizações de saúde com chaves API para integração Lara
- **Gestão de Funcionários**: Gerenciar registros e dados de saúde dos funcionários com vinculação ao Lara ID
- **Gestão de Pacientes**: Sistema completo de cadastro de pacientes com informações pessoais e endereços
- **Sistema de Consultas**: Agendamento e gerenciamento de consultas médicas com integração financeira
- **Propostas Financeiras**: Fluxo completo de criação e finalização de propostas através da API Lara
- **Planos de Pagamento**: Cálculo e visualização de planos de pagamento com módulo WASM
- **Autenticação**: Login seguro e gestão de usuários com SSO via Lara
- **Dashboard**: Gráficos interativos e análises de saúde
- **Tabelas de Dados**: Visualizações de dados de saúde ordenáveis e filtráveis

### Endpoints da API

- **Empresas**: `/company` - Operações CRUD de empresas
- **Funcionários**: `/employee`, `/employees` - Gestão de funcionários
- **Pacientes**: `/patient`, `/patients` - Gestão completa de pacientes
- **Consultas**: `/appointment`, `/appointments` - Sistema de consultas médicas
- **Lara**: `/initialize-lara-proposal`, `/complete-lara-proposal` - Fluxo de propostas financeiras
- **Autenticação**: `/login` - Autenticação de usuários
- **Webhooks**: Integrações com sistemas externos

### Funcionalidades do Frontend

- Dashboard responsivo com métricas de saúde
- Interface completa para gestão de pacientes e consultas
- Fluxo de propostas Lara com visualização de planos de pagamento
- Cálculo interativo de parcelas com módulo WASM
- Visualização interativa de dados com Recharts
- Barra lateral de navegação amigável
- Atualizações de dados em tempo real com TanStack Query
- Componentes de UI acessíveis com Radix UI
- Interface responsiva com Tailwind CSS

## 🔧 Desenvolvimento

### Configuração de Ambiente

A API suporta múltiplos ambientes:

- `dev` - Ambiente de desenvolvimento
- `stage` - Ambiente de homologação
- `prod` - Ambiente de produção

Crie arquivos `.env` específicos para cada ambiente no diretório da API:

- `.env.dev`
- `.env.stage`
- `.env.prod`

### Scripts Disponíveis

#### Nível Raiz

```bash
pnpm start          # Iniciar tanto API quanto frontend
```

#### API (`/api`)

```bash
pnpm start:dev      # Iniciar API em modo desenvolvimento
pnpm start:stage    # Iniciar API em modo homologação
pnpm start:prod     # Iniciar API em modo produção
pnpm db:push        # Aplicar alterações do schema no banco
pnpm db:seed        # Executar seeding do banco de dados
pnpm compose        # Iniciar containers Docker (MySQL)
pnpm prisma:studio  # Abrir Prisma Studio para visualização do banco
```

#### Frontend (`/app`)

```bash
pnpm dev            # Iniciar servidor de desenvolvimento
pnpm build          # Build para produção
pnpm preview        # Visualizar build de produção
pnpm lint           # Executar ESLint
```

### Banco de Dados

O projeto usa MySQL com Prisma ORM para armazenamento de dados:

- **ORM**: Prisma para operações type-safe no banco
- **Migrações**: Sistema de migrações do Prisma
- **Schema**: Definido em `api/prisma/schema.prisma`
- **Seeding**: Scripts de inicialização de dados
- **Modelos Principais**:
  - **Company**: Empresas com chaves API para integração Lara
  - **Employee**: Funcionários com Lara ID para autenticação SSO
  - **Patient**: Pacientes com informações completas e endereços
  - **Appointment**: Consultas com tracking de propostas financeiras
  - **Address**: Informações geográficas dos pacientes

## 🔐 Autenticação

A plataforma usa autenticação baseada em JWT com integração Lara:

- Endpoint de login fornece tokens de acesso
- Rotas protegidas requerem tokens JWT válidos
- Suporta onboarding de usuários e acesso à plataforma
- Integração SSO com Lara API através de Lara ID
- Gestão de chaves API por empresa para acesso aos serviços Lara

## 🎨 Componentes UI

O frontend inclui um conjunto abrangente de componentes UI:

- **Navegação**: Barra lateral, breadcrumbs, cabeçalhos
- **Exibição de Dados**: Tabelas, gráficos, cards, badges
- **Formulários**: Inputs, selects, checkboxes, botões
- **Layout**: Sheets, drawers, abas, separadores
- **Feedback**: Toasts, skeletons, tooltips

## � Integração Financeira Lara

A plataforma possui integração completa com os serviços financeiros da Lara:

### Fluxo de Propostas Financeiras

1. **Inicialização**: Criação de proposta financeira através da API Lara
2. **Cálculo de Parcelas**: Uso de módulo WASM para cálculos de planos de pagamento
3. **Finalização**: Conclusão do contrato e envio via WhatsApp
4. **Rastreamento**: Monitoramento do status da proposta durante todo o processo

### Componentes Principais

- **Cliente Lara API**: Comunicação com serviços externos da Lara
- **Autenticação JWT**: Acesso seguro à API com tokens de empresa
- **Módulo WASM**: Cálculos de alta performance para planos de pagamento
- **Gestão de Status**: Controle do estado das propostas nos registros de consultas
