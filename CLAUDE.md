# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

BrainLog is a "GitHub for your mind" — a media tracking app where users log books, articles, podcasts, papers, and videos. It generates AI insights via Claude on every entry and shows a GitHub-style activity heatmap, reading streak, and intellectual fingerprint chart.

**Stack:** Next.js 14 (App Router) · Python FastAPI · Supabase (Postgres) · Clerk (auth) · Anthropic Claude

## Commands

### Backend (FastAPI)

```bash
cd backend
source venv/bin/activate          # activate virtualenv
uvicorn app.main:app --reload     # dev server at http://localhost:8000
                                   # API docs at http://localhost:8000/docs
pip install -r requirements.txt   # install deps
```

### Frontend (Next.js)

```bash
cd frontend
npm run dev      # dev server at http://localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

## Architecture

### Request Flow

1. User authenticates via Clerk (frontend)
2. Frontend gets a signed RS256 JWT from Clerk and attaches it as `Authorization: Bearer <token>`
3. FastAPI middleware (`backend/app/auth.py`) validates the JWT against Clerk's JWKS endpoint (cached in-memory)
4. `_ensure_user()` in `routes.py` auto-upserts a `users` row on first request using the `sub` claim — no Clerk webhook needed
5. All Supabase writes use the service role key (bypasses RLS)

### Backend (`backend/app/`)

- `main.py` — FastAPI app, CORS middleware, global error handler
- `routes.py` — All 8 API endpoints (media CRUD, public profile, stats)
- `auth.py` — Clerk JWT validation dependency (`get_current_user`)
- `ai.py` — Claude insight generation (called on every `POST /media`, best-effort — failures are silently swallowed)
- `database.py` — Supabase client singleton
- `models.py` — Pydantic models (`MediaCreate`, `MediaItem`, `MediaUpdate`, `ProfileResponse`)
- `config.py` — Env var loading

### Frontend (`frontend/`)

- `app/` — Next.js App Router pages: `/` (landing), `/dashboard`, `/log`, `/u/[username]` (public profile), `/sign-in`, `/sign-up`
- `components/` — `Navbar`, `MediaCard`, `LogForm`, `ActivityGrid`, `FingerprintChart`, `TypeBadge`
- `lib/api.ts` — Typed fetch wrappers for all backend endpoints; reads `NEXT_PUBLIC_API_URL`
- `lib/types.ts` — Shared TypeScript types mirroring backend Pydantic models

### Database (`supabase/schema.sql`)

Three tables: `users` (clerk_id, username), `media_items` (type enum, status enum, ai_insight), `activity_log` (user_id, date, items_logged). RLS is enabled but the backend uses the service role key, so policies are for future anon-key use only.

### Design System

Dark-only. Tailwind utility classes map to custom tokens defined in `tailwind.config`:
- `bg-bg` (`#0D0D0D`), `bg-surface` (`#141414`), `text-accent` (`#E8D5A3`)
- Component classes (`.card`, `.btn-primary`, `.btn-ghost`, `.btn-danger`, `.input-base`, `.badge`) defined in `globals.css` `@layer components`
- Fonts: Playfair Display (serif/headings), JetBrains Mono (mono/labels), Crimson Pro (body)

### Auth Note

`dashboard/page.tsx` currently has Clerk's `useAuth()` commented out and uses mock values (`isSignedIn = true`, `getToken = async () => "mock_token"`). This is intentional for local dev without Clerk keys — re-enable `useAuth()` before deploying.

## Environment Variables

**Backend** (`.env`): `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `CLERK_JWKS_URL`, `CLERK_SECRET_KEY`, `ANTHROPIC_API_KEY`, `CORS_ORIGINS`

**Frontend** (`.env.local`): `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_API_URL`

Copy from `.env.example` / `.env.local.example` in each directory.
