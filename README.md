# InfoShield — Information Warfare & Disinformation Education Platform

**University of Canberra — Project ID: 2026-S1-35**  
**Developer:** Muhammad Shafi  
**Sponsor:** OnFact  
**Supervisor:** Abu Barkat Ullah

---

## Overview

InfoShield is an interactive educational web application designed to teach users about information warfare and disinformation tactics. It provides a structured learning experience with modules, quizzes, puzzles, case studies, and a community forum — all built around a gamified XP and badge system.

## Features

- Structured learning modules on information warfare
- Interactive knowledge-check quizzes
- Gamified puzzles (word matching, fill-in-the-blank, drag-and-order)
- Real Australian disinformation case studies
- XP and badge reward system
- Community discussion forum
- User authentication (register / login / profile)
- Personal progress dashboard

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (Drizzle ORM) |
| Auth | bcryptjs + express-session |
| API | OpenAPI spec with auto-generated React Query hooks |
| Monorepo | pnpm workspaces |

## Project Structure

```
artifacts/
  api-server/     — Express.js REST API
  infoshield/     — React + Vite frontend
lib/
  api-spec/       — OpenAPI YAML + generated client hooks
  db/             — Drizzle ORM schema + PostgreSQL connection
scripts/          — Database seed script
```

## Getting Started

### Prerequisites

- Node.js v20+
- pnpm v8+
- PostgreSQL 14+

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/infoshield.git
cd infoshield
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Set up the database

```bash
pnpm --filter @workspace/db run push
pnpm tsx scripts/seed.ts
```

### 5. Start development servers

```bash
# Terminal 1 — API server
pnpm --filter @workspace/api-server run dev

# Terminal 2 — Frontend
pnpm --filter @workspace/infoshield run dev
```

Frontend runs on `http://localhost:5173`  
API runs on `http://localhost:8080`

## Production Deployment

### Build frontend

```bash
pnpm --filter @workspace/infoshield run build
```

Static files will be in `artifacts/infoshield/dist/`

### Start API server with PM2

```bash
pm2 start "pnpm --filter @workspace/api-server run dev" --name infoshield-api
pm2 save
```

### Nginx configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /path/to/infoshield/artifacts/infoshield/dist;
    index index.html;

    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Environment Variables

See `.env.example` for all required variables.

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Secret key for session encryption |
| `NODE_ENV` | `development` or `production` |
| `PORT` | API server port (default: 8080) |

## License

University of Canberra — Academic Project 2026
