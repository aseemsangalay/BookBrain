-- ============================================================
-- BrainLog Phase 1 — Supabase Schema
-- Run this in the Supabase SQL editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Users ────────────────────────────────────────────────────
create table if not exists public.users (
  id          uuid primary key default uuid_generate_v4(),
  clerk_id    text not null unique,
  username    text not null unique,
  bio         text,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- ── Media Items ──────────────────────────────────────────────
create type media_type as enum (
  'book', 'article', 'podcast', 'video', 'paper', 'newsletter'
);

create type media_status as enum ('read', 'reading', 'want');

create table if not exists public.media_items (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references public.users(id) on delete cascade,
  type             media_type not null,
  title            text not null,
  author           text,
  url              text,
  cover_url        text,
  status           media_status not null default 'read',
  rating           smallint check (rating between 1 and 5),
  date_completed   date,
  ai_insight       text,
  source_metadata  jsonb,
  created_at       timestamptz not null default now()
);

create index if not exists media_items_user_id_idx on public.media_items(user_id);
create index if not exists media_items_created_at_idx on public.media_items(created_at desc);

-- ── Activity Log ─────────────────────────────────────────────
create table if not exists public.activity_log (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.users(id) on delete cascade,
  date         date not null,
  items_logged integer not null default 1,
  unique(user_id, date)
);

create index if not exists activity_log_user_date_idx on public.activity_log(user_id, date);

-- ── Row Level Security ────────────────────────────────────────
-- Note: We use the service role key in the backend, which bypasses RLS.
-- The policies below are for completeness and future use with anon key.

alter table public.users enable row level security;
alter table public.media_items enable row level security;
alter table public.activity_log enable row level security;

-- Public read for users table (profile pages)
create policy "public read users"
  on public.users for select using (true);

-- Public read for media items (public profile)
create policy "public read media"
  on public.media_items for select using (true);

-- Service role can do everything (used by backend)
-- No additional policies needed for service role.
