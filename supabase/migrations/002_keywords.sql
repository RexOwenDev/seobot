-- Migration: 002_keywords
-- Purpose: Target keywords with search intent classification. One keyword ->
-- many briefs (keyword reused across seasons / markets).

create table if not exists public.keywords (
  id              uuid primary key default gen_random_uuid(),
  workspace_id    uuid not null references public.workspaces(id) on delete cascade,
  phrase          text not null check (char_length(phrase) between 2 and 200),
  locale          text not null default 'en-US' check (locale ~ '^[a-z]{2}(-[A-Z]{2})?$'),
  search_volume   integer check (search_volume is null or search_volume >= 0),
  difficulty      smallint check (difficulty is null or difficulty between 0 and 100),
  intent          text not null default 'informational'
                    check (intent in ('informational','navigational','transactional','commercial')),
  cluster         text,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (workspace_id, phrase, locale)
);

create index if not exists idx_keywords_workspace on public.keywords(workspace_id);
create index if not exists idx_keywords_cluster   on public.keywords(workspace_id, cluster);
create index if not exists idx_keywords_intent    on public.keywords(workspace_id, intent);

alter table public.keywords enable row level security;

create policy keywords_member_read on public.keywords
  for select using (
    workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid())
  );

create policy keywords_editor_write on public.keywords
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
