/**
 * Hand-written database types. Generated types from the Supabase CLI can
 * replace this file in production; keeping it hand-authored here makes the
 * SEO constraints visible at a glance.
 */

export type PlanTier = 'starter' | 'agency' | 'enterprise';
export type MemberRole = 'owner' | 'editor' | 'viewer';
export type KeywordIntent =
  | 'informational'
  | 'navigational'
  | 'transactional'
  | 'commercial';
export type BriefStatus =
  | 'queued'
  | 'researching'
  | 'outlined'
  | 'drafted'
  | 'reviewed'
  | 'published'
  | 'archived';
export type ArticleStatus =
  | 'draft'
  | 'reviewing'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'archived';
export type SchemaType =
  | 'Article'
  | 'BlogPosting'
  | 'NewsArticle'
  | 'HowTo'
  | 'FAQPage';
export type CmsProvider = 'wordpress' | 'shopify';
export type CmsVerificationStatus =
  | 'unverified'
  | 'verified'
  | 'invalid'
  | 'revoked';
export type PublishJobStatus =
  | 'queued'
  | 'running'
  | 'succeeded'
  | 'failed'
  | 'cancelled';
export type SeoVerdict = 'pending' | 'ready' | 'needs_work' | 'reject';
export type RuleVerdict = 'pass' | 'warn' | 'fail';
export type Tone =
  | 'professional'
  | 'conversational'
  | 'authoritative'
  | 'playful'
  | 'technical';

export interface WorkspaceRow {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  plan_tier: PlanTier;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMemberRow {
  workspace_id: string;
  user_id: string;
  role: MemberRole;
  joined_at: string;
}

export interface KeywordRow {
  id: string;
  workspace_id: string;
  phrase: string;
  locale: string;
  search_volume: number | null;
  difficulty: number | null;
  intent: KeywordIntent;
  cluster: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BriefRow {
  id: string;
  workspace_id: string;
  keyword_id: string;
  title_hint: string | null;
  target_length: number | null;
  tone: Tone | null;
  audience: string | null;
  required_entities: string[];
  banned_terms: string[];
  status: BriefStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleRow {
  id: string;
  workspace_id: string;
  brief_id: string;
  h1: string;
  slug: string;
  meta_description: string;
  canonical_url: string | null;
  schema_type: SchemaType;
  body_markdown: string;
  excerpt: string | null;
  reading_time_mins: number | null;
  word_count: number | null;
  categories: string[];
  tags: string[];
  featured_image_url: string | null;
  featured_image_alt: string | null;
  status: ArticleStatus;
  scheduled_for: string | null;
  published_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleSectionRow {
  id: string;
  article_id: string;
  workspace_id: string;
  position: number;
  heading_level: 2 | 3 | 4;
  heading_text: string;
  body_markdown: string;
  created_at: string;
}

export interface InternalLinkRow {
  id: string;
  workspace_id: string;
  source_article_id: string;
  target_article_id: string | null;
  target_url: string | null;
  anchor_text: string;
  position_hint: 'intro' | 'body' | 'conclusion' | null;
  accepted: boolean;
  relevance_score: number | null;
  created_at: string;
}

export interface CmsConnectionRow {
  id: string;
  workspace_id: string;
  provider: CmsProvider;
  display_name: string;
  site_url: string;
  key_version: number;
  wp_username: string | null;
  shopify_shop: string | null;
  last_verified_at: string | null;
  verification_status: CmsVerificationStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
  // ciphertext / iv / auth_tag intentionally excluded — service-role only.
}

export interface PublishJobRow {
  id: string;
  workspace_id: string;
  article_id: string;
  cms_connection_id: string;
  target_provider: CmsProvider;
  target_post_id: string | null;
  target_url: string | null;
  status: PublishJobStatus;
  attempts: number;
  last_error: string | null;
  idempotency_key: string;
  queued_at: string;
  started_at: string | null;
  completed_at: string | null;
  created_by: string;
}

export interface SeoAuditRow {
  id: string;
  workspace_id: string;
  article_id: string;
  overall_score: number | null;
  verdict: SeoVerdict;
  validator_key: string;
  rule_verdict: RuleVerdict;
  message: string | null;
  details: Record<string, unknown>;
  created_at: string;
}
