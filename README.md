# BrainLog — GitHub for your mind

> Track every book, article, podcast, and paper you consume. Build your intellectual fingerprint. Share a living portrait of who you are intellectually.

**Stack:** Next.js 14 (App Router) · Python FastAPI · Supabase · Clerk · Anthropic Claude

---

## Project Structure

```
BrainLog/
├── frontend/         # Next.js 14 App Router (deploy to Vercel)
├── backend/          # FastAPI (deploy to Railway)
└── supabase/
    └── schema.sql    # Database schema — run in Supabase SQL editor
```

---

## Local Setup

### Prerequisites

- Node.js 18+
- Python 3.11+
- A [Clerk](https://clerk.com) account
- A [Supabase](https://supabase.com) project
- An [Anthropic](https://console.anthropic.com) API key

---

### 1. Supabase — Run the schema

1. Go to your Supabase project → SQL Editor
2. Paste and run `supabase/schema.sql`

---

### 2. Backend (FastAPI)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Fill in your values in .env
```

**Backend `.env` variables:**

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Service role key (bypasses RLS) |
| `CLERK_JWKS_URL` | `https://<your-clerk-domain>.clerk.accounts.dev/.well-known/jwks.json` |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `CORS_ORIGINS` | Comma-separated allowed origins |

```bash
# Run dev server
uvicorn app.main:app --reload
# API available at http://localhost:8000
# Docs at http://localhost:8000/docs
```

---

### 3. Frontend (Next.js)

```bash
cd frontend
npm install

cp .env.example .env.local
# Fill in your values in .env.local
```

**Frontend `.env.local` variables:**

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_API_URL` | Backend URL (e.g. `http://localhost:8000`) |

```bash
npm run dev
# Frontend at http://localhost:3000
```

---

## Deployment

### Backend → Railway

1. Push `backend/` to a GitHub repo (or connect the monorepo)
2. Create a Railway project → deploy from GitHub
3. Set environment variables in Railway dashboard
4. Railway will auto-detect the `Procfile` and run:
   ```
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

### Frontend → Vercel

1. Import the repo into Vercel
2. Set **Root Directory** to `frontend`
3. Set environment variables (from `.env.example`)
4. Vercel auto-detects Next.js and deploys

---

## Phase 1 API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/media` | ✅ | Create a media entry (triggers Claude insight) |
| `GET` | `/media` | ✅ | List your media |
| `PATCH` | `/media/{id}` | ✅ | Update a media item |
| `DELETE` | `/media/{id}` | ✅ | Delete a media item |
| `GET` | `/profile/{username}` | ❌ | Public profile |
| `GET` | `/stats/activity-grid` | ✅ | 26-week activity data |
| `GET` | `/stats/streak` | ✅ | Current + longest streak |
| `GET` | `/stats/fingerprint` | ✅ | Theme % breakdown |

---

## Design System

| Token | Value |
|---|---|
| Background | `#0D0D0D` |
| Surface | `#141414` |
| Accent | `#E8D5A3` |
| Heading font | Playfair Display |
| Mono font | JetBrains Mono |
| Body font | Crimson Pro |

---

## Auth Flow

1. User signs up/in via Clerk (modal or dedicated page)
2. clerk.js issues a signed JWT
3. Frontend attaches `Authorization: Bearer <token>` to every API call
4. FastAPI middleware validates the RS256 JWT signature against Clerk's JWKS endpoint
5. `sub` claim (Clerk user ID) is used to identify the user — **never trusted from client body**

---

## Definition of Done (Phase 1)

- [x] Clerk auth (signup, login, session)
- [x] Manual media entry form
- [x] All 8 FastAPI endpoints
- [x] Public profile page `/u/[username]`
- [x] Claude AI insight on every media entry
- [x] GitHub-style 26-week activity grid
- [x] Reading streak
- [x] Intellectual fingerprint chart
- [x] `.env.example` files
- [ ] Frontend live on Vercel ← deploy with your keys
- [ ] Backend live on Railway ← deploy with your keys
