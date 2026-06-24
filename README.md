# SIRDE — Sistema de Rastreamento de Dentes

> Frontend do sistema de biobanco odontológico para gestão, rastreamento e cessão de dentes.

---

## Visão Geral

O **SIRDE** é uma aplicação web desenvolvida para clínicas, dentistas e instituições de ensino que participam de biobancos odontológicos. O sistema permite:

- Cadastro e rastreamento de dentes com histórico completo de movimentações
- Gestão de doadores, remessas e locais de armazenamento
- Fluxo de solicitações com workflow de aprovação e recusa
- Controle de cessões vinculadas a solicitações aprovadas
- Painel administrativo para usuários, auditoria e perfis de acesso
- Dashboard com métricas e atividade recente

---

## Stack

| Tecnologia | Versão |
|---|---|
| React | 19 |
| Vite | 7 |
| Ant Design | 6 |
| React Router | 7 |
| Axios | 1 |
| Tailwind CSS | 4 |
| lucide-react | — |

Autenticação via **cookie httpOnly** (JWT — access token 5 min / refresh token 7 dias).

---

## Módulos

| Módulo | Rota |
|---|---|
| Dashboard | `/home` |
| Dentes | `/dentes` |
| Detalhe do Dente | `/dentes/:id` |
| Doadores | `/doadores` |
| Remessas | `/remessas` |
| Solicitações | `/solicitacoes` |
| Cessões | `/cessoes` |
| Instituições | `/instituicoes` |
| Clínicas | `/clinicas` |
| Dentistas | `/dentistas` |
| Locais de Armazenamento | `/locais` |
| Usuários | `/usuarios` |
| Auditoria | `/auditoria` |
| Perfil | `/perfil` |

---

## Como rodar

### Pré-requisitos

- Node.js 20+
- Backend SIRDE rodando em `localhost:3000`

### Instalação

```bash
git clone https://github.com/AntonioPauloFidel/SIRDE_FrontEnd.git
cd SIRDE_FrontEnd
npm install
```

### Configuração

Copie o arquivo de exemplo e ajuste se necessário:

```bash
cp .env.example .env
```

> Em desenvolvimento o Vite já faz proxy de `/api` para `localhost:3000` automaticamente — não é preciso alterar o `.env`.

### Executar

```bash
npm run dev
```

Acesse `http://localhost:5173`.

### Build

```bash
npm run build
```

---

## Estrutura

```
src/
├── assets/          # Imagens e recursos estáticos
├── components/      # Componentes reutilizáveis (Table, Modal, FilterBar, Carousel…)
├── constants/       # Enums do sistema (STATUS_DENTE, TIPO_DENTE, PERFIL_USUARIO…)
├── contexts/        # AuthContext — estado global de autenticação
├── hooks/           # Hooks customizados (useAuth, useToast)
├── layouts/         # LayoutAutenticado (Navbar + Footer) e LayoutPublico
├── pages/
│   ├── Login/       # Tela de login
│   └── modules/     # Páginas protegidas — herdam Navbar + Footer automaticamente
├── routes/          # AppRoutes, ProtectedRoute, PublicRoute
└── services/        # Chamadas à API (axios) organizadas por domínio
```

---

## Licença

MIT © 2026 Antonio Paulo Pereira Fidel, Savio e Leydson
