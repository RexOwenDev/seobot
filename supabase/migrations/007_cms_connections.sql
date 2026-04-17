-- Migration: 007_cms_connections
-- Purpose: CMS credential envelope. NEVER stores plaintext.
--
-- Envelope encryption pattern:
--   - plaintext credentials (WP app password, Shopify admin token) are encrypted
--     at the application boundary with AES-256-GCM using a key from a KMS
--     (Phase 4 wires the actual cipher; schema reserves the columns).
--   - ciphertext + iv + auth_tag are stored here.
--   - key_version lets the operator rotate keys without re-encrypting rows
--     immediately (lazy rotation).
--
-- P04 (Security Lead) veto: never add a plaintext_credentials column, ever.

create table if not exists public.cms_connections (
  id               uuid primary key default gen_random_uuid(),
  workspace_id     uuid not null references public.workspaces(id) on delete cascade,
  provider         text not null check (provider in ('wordpress','shopify')),
  display_name     text not null check (char_length(display_name) between 2 and 80),
  site_url         text not null check (site_url ~ '^https://'),

  -- Envelope encryption columns (populated by application, never by user input)
  ciphertext       bytea not null,
  iv               bytea not null check (octet_length(iv) = 12),    -- GCM standard
  auth_tag         bytea not null check (octet_length(auth_tag) = 16),
  key_version      integer not null default 1 check (key_version >= 1),

  -- Non-sensitive metadata
  wp_username      text,      -- WordPress: username, paired with app password in ciphertext
  shopify_shop     text,      -- Shopify: my-store.myshopify.com
  last_verified_at timestamptz,
  verification_status text not null default 'unverified'
                    check (verification_status in ('unverified','verified','invalid','revoked')),

  created_by       uuid not null references auth.users(id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  unique (workspace_id, provider, site_url)
);

create index if not exists idx_cms_workspace on public.cms_connections(workspace_id, provider);

alter table public.cms_connections enable row level security;

-- Only owners read CMS connections; editors cannot view credentials
create policy cms_owner_read on public.cms_connections
  for select using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role = 'owner'
    )
  );

create policy cms_owner_write on public.cms_connections
  for all using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role = 'owner'
    )
  ) with check (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid() and role = 'owner'
    )
  );

-- Revoke direct column access on ciphertext from authenticated role.
-- Application uses service role for decryption.
revoke select (ciphertext, iv, auth_tag) on public.cms_connections from authenticated;
