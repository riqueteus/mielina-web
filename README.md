# Mielina

> Plataforma web que apoia pessoas com Esclerose Múltipla (EM) com informação confiável, triagem inicial e acompanhamento da evolução de laudos de ressonância magnética — tudo com o apoio de Inteligência Artificial.

<img width="684" height="478" alt="mielina" src="https://github.com/user-attachments/assets/e2fa74fa-815c-481c-8899-30be04f18c4d" />

---

## O que é o Mielina?

O Mielina é um **assistente digital para quem convive com Esclerose Múltipla**. Ele reúne em um só lugar:

- **Informação confiável** sobre a doença, respondida por uma IA treinada em fontes médicas.
- **Uma triagem inicial** (questionário CIS) com análise automatizada de indícios.
- **Acompanhamento da evolução da doença** a partir de laudos de ressonância magnética, com extração automática de dados e gráficos comparativos.

O objetivo é **dar autonomia e clareza ao paciente**, sempre em conjunto com o acompanhamento médico — a plataforma **não substitui profissionais de saúde**.

---

## Funcionalidades

| Funcionalidade | O que faz |
|---|---|
| **Dúvidas** | Chat com IA (RAG) treinada em fontes médicas, com respostas e referências. |
| **Triagem (CIS)** | Questionário guiado que avalia indícios e classifica o nível de risco por IA. |
| **Meus Laudos** | Upload de laudos de RM em PDF; a IA extrai as informações estruturadas e a plataforma gera gráficos de evolução das lesões e distribuição por região. |
| **Resultados** | Histórico de triagens e análises anteriores em um só lugar. |

---

## Como funciona por dentro

```
┌──────────────┐     HTTP      ┌──────────────┐     HTTP      ┌──────────────────────┐
│   Frontend   │ ────────────▶ │   Backend    │ ────────────▶ │  Serviços de IA      │
│  React + Vite│               │ Express + TS │               │  (RAG, classificação,│
│              │ ◀──────────── │              │ ◀──────────── │   extração de laudos)│
└──────────────┘               └──────┬───────┘               └──────────────────────┘
                                      │
                                      ▼
                              ┌──────────────┐
                              │   Supabase   │
                              │ Postgres +   │
                              │ Auth + Storage│
                              └──────────────┘
```

| Componente | Responsabilidade |
|---|---|
| **Frontend** | Interface do usuário (React + TypeScript + Chakra UI). |
| **Backend** | API que valida, autentica e orquestra as chamadas aos serviços de IA e ao banco. |
| **Supabase** | Autenticação (Google), banco de dados e armazenamento privado dos PDFs. |
| **Serviços de IA** | Chatbot (RAG), classificação de triagem e extração estruturada de laudos. |

---

## Tecnologias

**Frontend:** React 19, TypeScript, Vite, Chakra UI, Tailwind CSS, React Router
**Backend:** Node.js, Express, TypeScript
**Dados & Autenticação:** Supabase (PostgreSQL, Auth, Storage)
**Inteligência Artificial:** serviços em Python/FastAPI (RAG, classificação e extração de laudos)

---

## Estrutura do projeto

```
├── backend/                 # API em Express + integração com Supabase e serviços de IA
├── frontend/                # SPA em React (páginas, componentes e serviços)
├── docs/                    # Documentação detalhada (arquitetura, guias, deploy)
└── package.json             # Scripts e dependências da raiz
```

---

## Como rodar localmente

1. Crie o arquivo `.env` do backend.
2. Suba o backend:
   ```bash
   cd backend && npm install && npm run dev
   ```
3. Suba o frontend:
   ```bash
   cd frontend && npm install && npm run dev
   ```


---

## Segurança e privacidade

Os laudos contêm dados sensíveis do usuário, e isso é tratado com prioridade:

- **Armazenamento privado:** PDFs ficam em um bucket privado com Row Level Security (RLS) — cada usuário acessa apenas os próprios arquivos.
- **Acesso temporário:** os PDFs são abertos por URLs assinadas com expiração (não são links públicos).
- **Autenticação:** todas as rotas exigem login (Google, via Supabase).
- **Proteção contra duplicidade:** o mesmo PDF é bloqueado por hash SHA-256, evitando registros duplicados.

---

## Roadmap

- Área para profissionais de saúde acompanharem pacientes.
- Suporte a novos tipos de exame e relatórios.
- Exportação de relatórios de evolução para compartilhar com o médico.