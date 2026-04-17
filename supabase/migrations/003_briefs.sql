-- Migration: 003_briefs
-- Purpose: A content brief is the *request* for an article. It captures the
-- operator's constraints (length, tone, target audience) without embedding
-- any proprietary prompt template.

create table if not exists public.briefs (
  id                uuid primary key default gen_random_uuid(),
  workspace_id      uuid not null references public.workspaces(id) on delete cascade,
  keyword_id        uuid not null references public.keywords(id)    on delete restrict,
  title_hint        text,
  target_length     integer check (target_length is null or target_length between 300 and 6000),
  tone              text check (tone is null or tone in ('professional','conversational','authoritative','playful','technical')),
  audience          text,
  required_entities text[] not null default '{}',
  banned_terms      text[] not null default '{}',
  status            text not null default 'queued'
                     check (status in ('queued','researching','outlined','drafted','reviewed','published','archived')),
  created_by        uuid not null references auth.users(id),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_briefs_workspace on public.briefs(workspace_id);
create index if not exists idx_briefs_keyword   on public.briefs(keyword_id);
create index if not exists idx_briefs_status    on public.briefs(workspace_id, status);

alter table public.briefs enable row level security;

create policy briefs_member_read on public.briefs
  for select using (
    workspace_id in (select workspace_id from public.workspace_members where user_id = auth.uid())
  );

create policy briefs_editor_write on public.briefs
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
