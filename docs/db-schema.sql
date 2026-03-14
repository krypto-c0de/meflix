create extension if not exists pgcrypto;

create table if not exists series_generations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age_range text not null,
  genre text not null,
  tone text not null,
  vibe text not null,
  chaos text not null,
  dream_cast text,
  title text not null,
  tagline text not null,
  synopsis text not null,
  preview_synopsis text not null,
  cast_json jsonb not null default '[]'::jsonb,
  episodes_json jsonb not null default '[]'::jsonb,
  poster_prompt text not null,
  is_paid boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  series_generation_id uuid not null references series_generations(id) on delete cascade,
  provider text not null,
  provider_payment_id text not null unique,
  amount_cents integer not null,
  status text not null,
  customer_name text not null,
  customer_email text not null,
  br_code text not null,
  br_code_base64 text not null,
  expires_at timestamptz not null,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists provider_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text not null unique,
  event_type text not null,
  raw_payload jsonb not null,
  processed_at timestamptz not null default now()
);
