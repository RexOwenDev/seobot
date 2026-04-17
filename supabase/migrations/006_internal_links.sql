-- Migration: 006_internal_links
-- Purpose: Internal link suggestions per article. Source article -> target URL
-- (either another article in the workspace or an external-to-seobot URL on the
-- operator's own site that the pipeline discovered during research).

create table if not exists public.internal_links (
  id                 uuid primary key default gen_random_uuid(),
  workspace_id       uuid not null references public.workspaces(id) on delete cascade,
  source_article_id  uuid not null references public.articles(id)   on delete cascade,
  target_article_id  uuid        references public.articles(id)     on delete set null,
  target_url         text,
  anchor_text        text not null check (char_length(anchor_text) between 2 and 120),
  position_hint      text check (position_hint is null or position_hint in ('intro','body','conclusion')),
  accepted           boolean not null default false,
  relevance_score    smallint check (relevance_score is null or relevance_score between 0 and 100),
  created_at         timestamptz not null default now(),
  check (target_article_id is not null or target_url is not null)
);

create index if not exists idx_links_source on public.internal_links(source_article_id);
create index if not exists idx_links_target on public.internal_links(target_article_id)
  where target_article_id is not null;

alter table public.internal_links enable row level security;

create policy links_member_read on public.internal_links
  for select using (
    workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid())
  );

create policy links_editor_write on public.internal_links
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
