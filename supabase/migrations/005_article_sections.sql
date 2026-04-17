-- Migration: 005_article_sections
-- Purpose: Heading hierarchy stored as structured rows instead of a blob.
-- Lets Phase 6 validators check H2 -> H3 hierarchy without Markdown parsing.

create table if not exists public.article_sections (
  id            uuid primary key default gen_random_uuid(),
  article_id    uuid not null references public.articles(id) on delete cascade,
  workspace_id  uuid not null references public.workspaces(id) on delete cascade,
  position      integer not null check (position >= 0),
  heading_level smallint not null check (heading_level between 2 and 4),
  heading_text  text not null check (char_length(heading_text) between 3 and 140),
  body_markdown text not null default '',
  created_at    timestamptz not null default now(),
  unique (article_id, position)
);

create index if not exists idx_sections_article   on public.article_sections(article_id, position);
create index if not exists idx_sections_workspace on public.article_sections(workspace_id);

alter table public.article_sections enable row level security;

create policy sections_member_read on public.article_sections
  for select using (
    workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid())
  );

create policy sections_editor_write on public.article_sections
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
