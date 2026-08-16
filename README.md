# API de Notícias — Prova Técnica Backend

API RESTful em Node.js + Express, Prisma ORM e PostgreSQL dockerizado, com cache em memória, fila assíncrona simulada, paginação, filtros e testes BDD.

## Tecnologias

- Node.js 20 + Express
- Prisma ORM + PostgreSQL 16
- Jest + Supertest (BDD)
- ESLint + Prettier
- Docker multi-stage + Docker Compose

## Estrutura de pastas

```text
backend/
├── src/
│   ├── routes/           # Rotas HTTP
│   ├── controllers/      # Tradução HTTP ↔ services
│   ├── services/         # Regras de negócio, Prisma, cache
│   ├── utils/            # Validação, cache e fila
│   ├── prisma/           # Cliente Prisma singleton
│   ├── app.js            # Configuração Express
│   └── server.js         # Bootstrap
├── prisma/schema.prisma  # Modelo de dados
├── tests/                # Testes BDD
├── Dockerfile
└── docker-compose.yml
```

### Justificativa da estrutura

A separação **routes → controllers → services** facilita escalar a API: novos endpoints reutilizam validação, cache e acesso ao banco sem misturar HTTP com regra de negócio. Utilitários isolados (`cache.js`, `queue.js`, `validateNoticia.js`) permitem trocar implementações (Redis, BullMQ) sem alterar controllers.

## GitFlow

Branches previstas:

| Branch | Uso |
|--------|-----|
| `main` | Produção estável |
| `develop` | Integração contínua |
| `feature/*` | Novas funcionalidades |
| `release/*` | Preparação de release |
| `hotfix/*` | Correções urgentes em produção |

### Publicar no GitHub

```powershell
cd backend
git init
git add .
git commit -m "feat: estrutura inicial da api de noticias"
git branch -M main
git checkout -b develop
git remote add origin https://github.com/SEU_USUARIO/prova-tecnica-backend.git
git push -u origin main develop
```

## Configuração local

```powershell
cd backend
npm install
copy .env.example .env
npx prisma generate
npx prisma db push
npm run dev
```

API disponível em `http://localhost:3333`.

## Docker

```powershell
cd backend
docker compose up --build
```

- API: `http://localhost:3333`
- Health: `GET /health`
- PostgreSQL: `localhost:5432`

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/noticias` | Lista com paginação e filtros |
| GET | `/noticias/:id` | Busca por ID |
| POST | `/noticias` | Cria notícia |
| PUT | `/noticias/:id` | Atualiza notícia |
| DELETE | `/noticias/:id` | Remove notícia |

### Paginação e filtros

`GET /noticias?page=1&limit=10&titulo=node&descricao=api`

Resposta:

```json
{
  "data": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "fromCache": false
}
```

## Testes

```powershell
npm test
npm run lint
```

## Cache e fila assíncrona

- **Cache:** listagens são cacheadas por 30s em memória; writes invalidam o cache.
- **Fila:** após criar uma notícia, um job simulado é enfileirado e processado de forma assíncrona (log no console).

## Preparação para escalar

- Trocar cache em memória por Redis alterando apenas `src/utils/cache.js`.
- Extrair fila para BullMQ/RabbitMQ mantendo a interface de `queue.js`.
- Adicionar camada de repository se o domínio crescer além de Notícias.
- Horizontalizar a API com stateless containers + PostgreSQL gerenciado.

## Auditoria da prova técnica

Checklist completo com requisitos, evidências e comandos de validação: **[AUDITORIA.md](./AUDITORIA.md)**.
