-- Migration: 008_publish_jobs
-- Purpose: Queue of publish attempts. Lifecycle:
--   queued -> running -> succeeded | failed (with attempts counter for retries)

create table if not exists public.publish_jobs (
  id                 uuid primary key default gen_random_uuid(),
  workspace_id       uuid not null references public.workspaces(id) on delete cascade,
  article_id         uuid not null references public.articles(id)   on delete cascade,
  cms_connection_id  uuid not null references public.cms_connections(id) on delete restrict,

  target_provider    text not null check (target_provider in ('wordpress','shopify')),
  target_post_id     text,   -- CMS-assigned ID once published (WP integer cast to text, Shopify GID)
  target_url         text,   -- canonical live URL after publish

  status             text not null default 'queued'
                      check (status in ('queued','running','succeeded','failed','cancelled')),
  attempts           smallint not null default 0 check (attempts >= 0 and attempts <= 5),
  last_error         text,
  idempotency_key    text not null unique,   -- client-supplied, deduplicates retries

  queued_at          timestamptz not null default now(),
  started_at         timestamptz,
  completed_at       timestamptz,
  created_by         uuid not null references auth.users(id)
);

create index if not exists idx_jobs_workspace   on public.publish_jobs(workspace_id, status);
create index if not exists idx_jobs_article     on public.publish_jobs(article_id);
create index if not exists idx_jobs_queued      on public.publish_jobs(queued_at)
  where status = 'queued';

alter table public.publish_jobs enable row level security;

create policy jobs_member_read on public.publish_jobs
  for select using (
    workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid())
  );

create policy jobs_editor_write on public.publish_jobs
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
