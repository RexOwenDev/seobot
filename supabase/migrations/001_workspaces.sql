-- Migration: 001_workspaces
-- Purpose: Multi-tenant root. Every agency (or solo operator) is a workspace.
-- All downstream tables scope by workspace_id; RLS enforces isolation.

create extension if not exists "pgcrypto";

create table if not exists public.workspaces (
  id           uuid primary key default gen_random_uuid(),
  name         text not null check (char_length(name) between 2 and 120),
  slug         text not null unique check (slug ~ '^[a-z0-9-]{2,60}$'),
  owner_id     uuid not null references auth.users(id) on delete restrict,
  plan_tier    text not null default 'starter' check (plan_tier in ('starter','agency','enterprise')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_workspaces_owner on public.workspaces(owner_id);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  role         text not null check (role in ('owner','editor','viewer')),
  joined_at    timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create index if not exists idx_members_user on public.workspace_members(user_id);

-- RLS
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;

create policy workspaces_read on public.workspaces
  for select using (
    id in (select workspace_id from public.workspace_members where user_id = auth.uid())
  );

create policy workspaces_owner_write on public.workspaces
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy members_read on public.workspace_members
  for select using (
    workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid())
  );

create policy members_owner_write on public.workspace_members
  for all using (
    workspace_id in (select id from public.workspaces where owner_id = auth.uid())
  ) with check (
    workspace_id in (select id from public.workspaces where owner_id = auth.uid())
  );
