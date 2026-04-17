-- Migration: 004_articles
-- Purpose: Canonical article shape. SEO-critical fields are NOT NULL so the
-- database itself refuses to store an article missing an H1 or meta_description.
-- This is P08's (SEO Strategist) veto built into the schema.

create table if not exists public.articles (
  id                 uuid primary key default gen_random_uuid(),
  workspace_id       uuid not null references public.workspaces(id) on delete cascade,
  brief_id           uuid not null references public.briefs(id)     on delete cascade,

  -- SEO-critical fields (structurally required)
  h1                 text not null check (char_length(h1) between 20 and 80),
  slug               text not null check (slug ~ '^[a-z0-9][a-z0-9-]{1,80}[a-z0-9]$'),
  meta_description   text not null check (char_length(meta_description) between 120 and 170),
  canonical_url      text,
  schema_type        text not null default 'Article'
                      check (schema_type in ('Article','BlogPosting','NewsArticle','HowTo','FAQPage')),

  -- Content
  body_markdown      text not null default '',
  excerpt            text,
  reading_time_mins  smallint check (reading_time_mins is null or reading_time_mins > 0),
  word_count         integer  check (word_count is null or word_count >= 0),

  -- Taxonomy mirrors (per-CMS target)
  categories         text[] not null default '{}',
  tags               text[] not null default '{}',

  -- Featured image
  featured_image_url text,
  featured_image_alt text,

  -- Pipeline state
  status             text not null default 'draft'
                      check (status in ('draft','reviewing','approved','scheduled','published','archived')),
  scheduled_for      timestamptz,
  published_at       timestamptz,

  created_by         uuid not null references auth.users(id),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  unique (workspace_id, slug)
);

create index if not exists idx_articles_workspace on public.articles(workspace_id);
create index if not exists idx_articles_brief     on public.articles(brief_id);
create index if not exists idx_articles_status    on public.articles(workspace_id, status);
create index if not exists idx_articles_scheduled on public.articles(workspace_id, scheduled_for)
  where scheduled_for is not null;

alter table public.articles enable row level security;

create policy articles_member_read on public.articles
  for select using (
    workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid())
  );

create policy articles_editor_write on public.articles
  for all using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role in ('owner','editor')
    )
  ) with check (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role in ('owner','editor')
    )
  );
