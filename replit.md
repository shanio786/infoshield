# InfoShield — Information Warfare Educational App

**University of Canberra Project ID:** 2026-S1-35  
**Developer:** Muhammad Shafi  
**Sponsor:** OnFact (moin@onfact.xyz)  
**Supervisor:** Abu Barkat Ullah

## Overview

InfoShield is a complete interactive educational web application about information warfare and disinformation. Users learn through structured modules, take knowledge-check quizzes, earn XP and badges, explore real Australian case studies, and participate in community forum discussions.

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

- **No authentication** — uses a fixed `guest-user` ID for all progress tracking
- **API client** — auto-generated from OpenAPI spec via `@workspace/api-client-react` with React Query hooks
- **Icons** — stored as string names (e.g., "BookOpen") in DB; rendered via `DynamicIcon` component in `src/lib/icon-map.tsx`
- **Markdown** — lesson content and case studies are stored as markdown, rendered via `react-markdown`

## Frontend Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Cinematic hero with global stats |
| `/learn` | Learn | Module listing with icons + levels |
| `/learn/:id` | ModuleDetail | Lesson list timeline view |
| `/learn/:moduleId/lesson/:lessonId` | LessonDetail | Markdown lesson content + Mark as Complete |
| `/quiz` | QuizHub | Quiz card listing |
| `/quiz/:id` | QuizDetail | Interactive multi-step quiz with scoring |
| `/dashboard` | Dashboard | XP, levels, progress, recommended module |
| `/badges` | Badges | Earned + locked badge showcase |
| `/case-studies` | CaseStudies | Australian disinformation case study cards |
| `/case-studies/:slug` | CaseStudyDetail | Full case study with markdown content |
| `/forum` | Forum | Community discussion board |
| `/forum/:postId` | ForumPostDetail | Individual post with replies |

## API Endpoints

All endpoints prefixed with `/api/`:

- `GET /modules` — list all 5 learning modules
- `GET /modules/:id` — module with lessons
- `GET /lessons/:id` — full lesson content (markdown)
- `POST /lessons/:id/complete` — mark lesson complete, award XP
- `GET /quizzes` — list all quizzes
- `GET /quizzes/:id` — quiz with questions (no correct answers)
- `POST /quizzes/:quizId/submit` — submit answers, get score + badges
- `GET /badges` — all badges
- `GET /progress/:userId` — user's completed lessons + earned badges
- `GET /dashboard/:userId` — full dashboard data (XP, level, activity)
- `GET /dashboard/stats` — global platform stats
- `GET /case-studies` — list case studies
- `GET /case-studies/:slug` — full case study
- `GET /forum` — forum posts
- `GET /forum/:postId` — post with replies
- `POST /forum` — create new post
- `POST /forum/:postId/reply` — add reply

## Database Schema (PostgreSQL via Drizzle ORM)

Tables: `modules`, `lessons`, `quizzes`, `quiz_questions`, `quiz_attempts`, `badges`, `user_badges`, `user_xp`, `user_progress`, `forum_posts`, `forum_replies`, `case_studies`

## Seed Data

Run `pnpm --filter @workspace/scripts run seed` to populate:
- 5 learning modules (Understanding Misinformation → Coordinated Influence Operations)
- 9 lessons with rich Australian-context content
- 3 quizzes with 10 total questions
- 7 badges (common → legendary)
- 2 case studies: 2019 Death Tax Campaign, 2023 Voice Referendum Disinformation

## Design

- Dark navy/slate theme (`#0b1120` background, `#38bdf8` electric blue primary)
- Inter (body) + Playfair Display (headings) via Google Fonts
- Framer Motion animations throughout
- Intelligence briefing aesthetic ("Command Center", "Clearance: Guest", "Commence Briefing")
- Responsive with sidebar (desktop) / top nav (mobile)

## Running Locally

```bash
# Start API server
pnpm --filter @workspace/api-server run dev

# Start frontend
pnpm --filter @workspace/infoshield run dev
```
