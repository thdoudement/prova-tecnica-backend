# Guia de Entrega — Prova Técnica Fullstack

Documento final para avaliação. Use este arquivo como ponto de partida.

## Repositórios

| Projeto | Repositório | Branch principal |
|---------|-------------|------------------|
| Backend | https://github.com/thdoudement/prova-tecnica-backend | `main` |
| Frontend | https://github.com/thdoudement/prova-tecnica-frontend | `main` |

## GitFlow utilizado

```text
main ─────────────── versão estável (entrega)
  ↑
develop ──────────── integração contínua
  ↑
feature/* ────────── funcionalidades
```

| Branch | Backend | Frontend |
|--------|---------|----------|
| `main` | Release final | Release final |
| `develop` | Integração da API | Integração do app |
| `feature/noticias-crud` | CRUD + paginação + cache | — |
| `feature/busca-cep` | — | Busca CEP + testes BDD |

Pull Requests criados no GitHub seguindo este fluxo.

## Checklist do enunciado (100%)

### Frontend

| # | Requisito | Status |
|---|-----------|--------|
| 1 | React no GitHub + GitFlow | ✅ |
| 2 | Busca CEP (ViaCEP, axios, loading, erros, UX) | ✅ |
| 3 | CSS manual + responsivo | ✅ |
| 4 | CRUD Notícias integrado ao backend com paginação | ✅ |
| 5 | Teste BDD busca CEP | ✅ |
| 6 | Dockerfile multi-stage | ✅ |
| 7 | README completo | ✅ |
| 8 | Justificativa de estrutura + ESLint/Prettier | ✅ |

### Backend

| # | Requisito | Status |
|---|-----------|--------|
| 1 | API no GitHub + GitFlow | ✅ |
| 2 | Node + ORM + PostgreSQL dockerizado | ✅ |
| 3 | CRUD + validação + HTTP semântico | ✅ |
| 4 | Testes BDD (≥2) criação de notícia | ✅ |
| 5 | Dockerfile + Docker Compose (API + DB) | ✅ |
| 6 | Justificativa + preparação para escalar | ✅ |
| 7 | README completo | ✅ |
| 8 | Paginação + filtros + metadados | ✅ |
| 9 | Cache em memória + fila assíncrona | ✅ |

Detalhes e comandos de verificação: **[AUDITORIA.md](./AUDITORIA.md)**.

## Como executar (avaliador)

### Opção A — Docker (recomendado)

```powershell
# Backend (API + PostgreSQL)
cd backend
docker compose up --build -d

# Frontend
cd frontend
docker compose up --build -d
```

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:8081 |
| API | http://localhost:3333/health |
| Swagger/curls | ver AUDITORIA.md |

### Opção B — Local

```powershell
# Terminal 1 — Backend
cd backend
npm install
copy .env.example .env
npx prisma generate
docker compose up -d db
npx prisma db push
npm run dev

# Terminal 2 — Frontend
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend: http://localhost:5173

## Testes automatizados

```powershell
cd backend && npm test && npm run lint
cd frontend && npm test && npm run lint
```

## Integração front ↔ back

- Frontend: `src/services/api.js` → `http://127.0.0.1:3333/noticias`
- Paginação: `page`, `limit`
- Resposta: `{ data, meta }`
- Sem json-server

## Responsividade

CSS manual em `frontend/src/App.css` com breakpoint `@media (max-width: 640px)`.

## Logs de auditoria (backend)

Cada requisição HTTP registra:

```text
[audit] 2026-08-16T16:00:00.000Z GET /noticias 200 12ms
```

---

**Projeto pronto para entrega.**
