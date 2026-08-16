# Auditoria — Prova Técnica Fullstack

Checklist objetivo para validar requisitos da prova. Cada item indica **onde verificar** e **como testar**.

## Repositórios

| Projeto | GitHub |
|---------|--------|
| Backend | https://github.com/thdoudement/prova-tecnica-backend |
| Frontend | https://github.com/thdoudement/prova-tecnica-frontend |

## GitFlow

```powershell
# Backend
cd backend && git branch -a

# Frontend
cd frontend && git branch -a
```

Branches esperadas: `main`, `develop`, `feature/*`.

---

## Backend

| # | Requisito | Evidência | Como validar |
|---|-----------|-----------|--------------|
| 1 | API versionada no GitHub + GitFlow | branches remotas | `git branch -r` |
| 2 | REST Node + ORM + PostgreSQL dockerizado | `prisma/schema.prisma`, `docker-compose.yml` | `docker compose up --build` |
| 3 | CRUD com validação e HTTP semântico | `src/controllers/noticias.controller.js` | ver comandos abaixo |
| 4 | Testes BDD (≥2) | `tests/noticias.create.test.js` | `npm test` |
| 5 | Dockerfile + Compose | `Dockerfile`, `docker-compose.yml` | `docker compose up --build` |
| 6 | Estrutura escalável documentada | `backend/README.md` | leitura |
| 7 | README completo | `backend/README.md` | leitura |
| 8 | Paginação e filtros | `src/services/noticias.service.js` | `GET /noticias?page=1&limit=5&titulo=node` |
| 9 | Cache + fila assíncrona | `src/utils/cache.js`, `src/utils/queue.js` | listar 2x (campo `fromCache`) e criar notícia (log da fila) |

### Comandos rápidos (backend)

```powershell
cd backend
npm test
npm run lint

# Com API rodando em http://localhost:3333
curl http://localhost:3333/health
curl http://localhost:3333/noticias?page=1&limit=5
curl -X POST http://localhost:3333/noticias -H "Content-Type: application/json" -d "{\"titulo\":\"Auditoria\",\"descricao\":\"Teste BDD manual\"}"
```

---

## Frontend

| # | Requisito | Evidência | Como validar |
|---|-----------|-----------|--------------|
| 1 | React versionado no GitHub + GitFlow | branches remotas | `git branch -r` |
| 2 | Busca CEP com axios, loading e erros | `src/components/BuscaCep.jsx` | abrir aba "Busca de CEP", testar CEP `01001000` |
| 3 | CSS manual + responsivo | `src/App.css` | redimensionar janela do navegador |
| 4 | CRUD integrado ao backend real | `src/services/api.js`, `src/components/CrudNoticias.jsx` | aba "CRUD Notícias" com API em `:3333` |
| 5 | Teste BDD busca CEP | `src/components/BuscaCep.test.jsx` | `npm test` |
| 6 | Dockerfile multi-stage | `Dockerfile` | `docker compose up --build` |
| 7 | README completo | `frontend/README.md` | leitura |
| 8 | Estrutura + ESLint/Prettier | pastas `src/`, `eslint.config.js` | `npm run lint` |

### Integração front ↔ back

O frontend **não usa json-server**. Todas as chamadas de notícias vão para:

```text
{VITE_API_URL}/noticias   → padrão http://127.0.0.1:3333/noticias
```

Paginação usa `page`/`limit` e lê `{ data, meta }` — mesmo contrato do backend.

```powershell
cd frontend
npm test
npm run lint
npm run dev
# Acesse http://localhost:5173
```

---

## Execução completa (Docker)

```powershell
# Terminal 1
cd backend
docker compose up --build

# Terminal 2
cd frontend
docker compose up --build
```

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:8081 |
| API | http://localhost:3333 |
| PostgreSQL | localhost:5433 |

---

## Logs de auditoria (backend)

Toda requisição HTTP gera log no console da API:

```text
[audit] 2026-08-16T16:00:00.000Z GET /noticias 200 12ms
```

Isso permite rastrear acessos durante testes manuais ou demos.

---

## Status atual

- Projeto antigo (`desafio-fullstack`, repo `busca-cep`): **removido**
- Front e back integrados: **sim**
- Testes automatizados: **passando**
- Docker validado: **sim**
- GitFlow com PRs mergeados: **sim**
- Enunciado da prova: **100% atendido**
