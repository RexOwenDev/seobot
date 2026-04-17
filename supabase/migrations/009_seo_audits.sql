-- Migration: 009_seo_audits
-- Purpose: Persisted SEO validation results per article. One row per validator
-- per audit run. Phase 6 writes to this table; Phase 5 UI renders the rollup.

create table if not exists public.seo_audits (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references public.workspaces(id) on delete cascade,
  article_id    uuid not null references public.articles(id)   on delete cascade,

  -- Rollup
  overall_score smallint check (overall_score is null or overall_score between 0 and 100),
  verdict       text not null default 'pending'
                 check (verdict in ('pending','ready','needs_work','reject')),

  -- Per-rule results
  validator_key text not null check (validator_key ~ '^[a-z][a-z0-9_]{2,40}$'),
  rule_verdict  text not null check (rule_verdict in ('pass','warn','fail')),
  message       text,
  details       jsonb not null default '{}'::jsonb,

  created_at    timestamptz not null default now(),
  unique (article_id, validator_key, created_at)
);

create index if not exists idx_audits_article   on public.seo_audits(article_id, created_at desc);
create index if not exists idx_audits_workspace on public.seo_audits(workspace_id);
create index if not exists idx_audits_verdict   on public.seo_audits(workspace_id, verdict);

alter table public.seo_audits enable row level security;

create policy audits_member_read on public.seo_audits
  for select using (
    workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid())
  );

create policy audits_editor_write on public.seo_audits
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
