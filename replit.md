# InfoShield — Information Warfare Educational App

**University of Canberra Project ID:** 2026-S1-35  
**Developer:** Muhammad Shafi  
**Sponsor:** OnFact (moin@onfact.xyz)  
**Supervisor:** Abu Barkat Ullah

## Overview

InfoShield is a complete interactive educational web application about information warfare and disinformation. Users register/login, learn through structured modules, complete interactive puzzles, take knowledge-check quizzes, earn XP and badges, explore real Australian case studies, and participate in community forum discussions.

## Architecture

This is a pnpm monorepo with three main artifacts:

```
artifacts/
  api-server/     — Express.js REST API (port 8080)
  infoshield/     — React + Vite frontend (served at /)
  mockup-sandbox/ — Canvas design preview server
lib/
  api-spec/       — OpenAPI YAML + generated React Query hooks
  db/             — Drizzle ORM schema + PostgreSQL connection
scripts/          — Seed script for initial data
```

## Key Technical Decisions

- **Email/Password Authentication** — bcryptjs + express-session + connect-pg-simple
  - Session cookie: `infoshield.sid`
  - `SESSION_SECRET` env var (defaults to `infoshield-dev-secret-2026`)
  - `AuthProvider` + `useAuth` hook in `src/context/auth.tsx`
  - Login page in `src/pages/login.tsx` (shows when not authenticated)
- **API client** — auto-generated from OpenAPI spec via `@workspace/api-client-react` with React Query hooks
- **Session type** — Extended in `src/types/session.d.ts` to include `userId` and `displayName`
- **UI theme** — Dark navy/slate + electric cyan (#00e5ff), intelligence briefing aesthetic
- **No mocked data** — all content is seeded to PostgreSQL via `scripts/seed.ts`

## Database Schema

Tables in PostgreSQL (managed by Drizzle ORM):

| Table | Purpose |
|-------|---------|
| `users` | User accounts (userId, displayName, email, password_hash, role) |
| `modules` | Learning modules (title, description, icon, order) |
| `lessons` | Lessons within modules (title, content, xpReward, order) |
| `quizzes` | Module quizzes |
| `quiz_questions` | Individual quiz questions |
| `quiz_attempts` | User quiz attempt records |
| `user_progress` | Lesson completion tracking |
| `user_xp` | XP and level per user |
| `user_badges` | Earned badge records |
| `badges` | Badge definitions |
| `forum_posts` | Discussion forum posts |
| `forum_replies` | Forum post replies |
| `case_studies` | Australian disinformation case studies |
| `puzzles` | Interactive puzzle definitions |
| `puzzle_completions` | User puzzle completion records |

## API Routes

All routes are under `/api/`:

- `POST /auth/register` — Create account
- `POST /auth/login` — Sign in
- `POST /auth/logout` — Sign out
- `GET /auth/me` — Get current user
- `GET /modules` — List all modules
- `GET /modules/:id` — Module detail
- `GET /lessons/:id` — Lesson detail
- `POST /lessons/:id/complete` — Mark lesson complete
- `GET /quizzes` — List quizzes
- `GET /quizzes/:id` — Quiz detail
- `POST /quizzes/:id/attempt` — Submit quiz answers
- `GET /dashboard/:userId` — User dashboard (XP, progress, next module, resume lesson)
- `GET /dashboard/stats` — Platform-wide statistics
- `GET /badges` — All badges
- `GET /users/:userId/badges` — User's earned badges
- `GET /forum` — Forum posts
- `GET /forum/:id` — Forum post + replies
- `POST /forum` — Create post
- `POST /forum/:id/replies` — Add reply
- `GET /case-studies` — Case studies list
- `GET /case-studies/:id` — Case study detail
- `GET /puzzles` — All puzzles
- `POST /puzzles/:id/complete` — Mark puzzle complete

## Frontend Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home` | Landing / welcome page |
| `/learn` | `Learn` | Modules list |
| `/learn/:moduleId` | `ModuleDetail` | Module overview + lessons |
| `/learn/:moduleId/lesson/:id` | `LessonDetail` | Lesson content + completion |
| `/quiz` | `QuizHub` | Quiz browser |
| `/quiz/:quizId` | `QuizDetail` | Interactive quiz |
| `/puzzles` | `PuzzlesPage` | Interactive puzzles (Word Match, Fill Blank, Drag Order) |
| `/dashboard` | `Dashboard` | Command Center — XP, stats, resume learning |
| `/badges` | `Badges` | Awards / badges collection |
| `/case-studies` | `CaseStudies` | Case study browser |
| `/case-studies/:id` | `CaseStudyDetail` | Full case study |
| `/forum` | `Forum` | Community discussion |
| `/forum/:id` | `ForumPostDetail` | Forum thread |

## Interactive Puzzle Types

Three puzzle types in `src/components/puzzles/`:
1. **WordMatchPuzzle** — Match terms to definitions by clicking pairs
2. **FillBlankPuzzle** — Fill in missing words from a word bank
3. **DragOrderPuzzle** — Arrange items in correct sequence

## Dashboard Resume Learning

The dashboard API (`/dashboard/:userId`) returns a `resumeLesson` field with:
- `lessonId`, `lessonTitle`, `moduleId`, `moduleTitle`, `moduleIcon`

The dashboard shows a "Resume Briefing" banner at the top when the user has prior progress, linking directly to the next uncompleted lesson.

## Running Locally

```bash
# Install dependencies
pnpm install

# Start both servers (normally via Replit workflows)
pnpm --filter @workspace/api-server run dev   # port 8080
pnpm --filter @workspace/infoshield run dev    # port from PORT env

# Seed the database
pnpm --filter @workspace/api-server run seed

# Push DB schema changes
pnpm --filter @workspace/db run push-force
```

## Environment Variables

| Var | Purpose | Default |
|-----|---------|---------|
| `DATABASE_URL` | PostgreSQL connection string | (required) |
| `SESSION_SECRET` | Express session secret | `infoshield-dev-secret-2026` |
| `PORT` | Dev server port | (set by Replit) |
| `BASE_PATH` | Vite base path | (set by Replit) |
