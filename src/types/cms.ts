/**
 * CMS payload types — these shapes mirror the real WordPress REST API v2 and
 * Shopify Admin API contracts. P10 (CMS Integration Expert) veto applies: if
 * we add a field here that does not exist in the real API docs, stop.
 *
 * References:
 *   WordPress REST API v2 — https://developer.wordpress.org/rest-api/reference/posts/
 *   Shopify Admin API     — https://shopify.dev/docs/api/admin-rest/2025-01/resources/article
 */

// ---------- Canonical (our shape) -------------------------------------------

export interface CanonicalPublishPayload {
  readonly articleId: string;
  readonly title: string;
  readonly slug: string;
  readonly bodyHtml: string;
  readonly excerpt: string | null;
  readonly metaDescription: string;
  readonly canonicalUrl: string | null;
  readonly categories: readonly string[];
  readonly tags: readonly string[];
  readonly featuredImage: {
    readonly url: string;
    readonly alt: string;
  } | null;
  readonly status: 'draft' | 'publish' | 'private' | 'future';
  readonly publishAt: string | null;
}

// ---------- WordPress REST API v2 -------------------------------------------

export type WordPressStatus =
  | 'publish'
  | 'future'
  | 'draft'
  | 'pending'
  | 'private';

export interface WordPressPostCreate {
  readonly title: string;
  readonly slug: string;
  readonly content: string;
  readonly excerpt?: string;
  readonly status: WordPressStatus;
  readonly date?: string; // ISO 8601, used with status='future'
  readonly categories?: readonly number[];
  readonly tags?: readonly number[];
  readonly featured_media?: number;
  readonly meta?: {
    readonly _yoast_wpseo_metadesc?: string;
    readonly _yoast_wpseo_canonical?: string;
  };
}

export interface WordPressPostResponse {
  readonly id: number;
  readonly date: string;
  readonly slug: string;
  readonly status: WordPressStatus;
  readonly link: string;
  readonly title: { readonly rendered: string };
  readonly content: { readonly rendered: string; readonly protected: boolean };
  readonly excerpt: { readonly rendered: string };
  readonly categories: readonly number[];
  readonly tags: readonly number[];
  readonly featured_media: number;
}

export interface WordPressMediaCreate {
  readonly file: Blob;
  readonly title?: string;
  readonly alt_text?: string;
}

export interface WordPressMediaResponse {
  readonly id: number;
  readonly source_url: string;
  readonly alt_text: string;
  readonly mime_type: string;
}

// ---------- Shopify Admin API -----------------------------------------------

export type ShopifyArticlePublishedStatus = 'published' | 'unpublished';

export interface ShopifyArticleCreate {
  readonly article: {
    readonly title: string;
    readonly author: string;
    readonly body_html: string;
    readonly blog_id: number;
    readonly handle?: string;
    readonly summary_html?: string;
    readonly tags?: string; // Shopify uses CSV, not array
    readonly published?: boolean;
    readonly published_at?: string;
    readonly metafields?: readonly ShopifyMetafield[];
    readonly image?: { readonly src: string; readonly alt?: string };
  };
}

export interface ShopifyMetafield {
  readonly namespace: string;
  readonly key: string;
  readonly type:
    | 'single_line_text_field'
    | 'multi_line_text_field'
    | 'url';
  readonly value: string;
}

export interface ShopifyArticleResponse {
  readonly article: {
    readonly id: number;
    readonly title: string;
    readonly handle: string;
    readonly body_html: string;
    readonly blog_id: number;
    readonly author: string;
    readonly tags: string;
    readonly published_at: string | null;
    readonly created_at: string;
    readonly updated_at: string;
  };
}

export interface ShopifyBlog {
  readonly id: number;
  readonly handle: string;
  readonly title: string;
}

// ---------- Discriminated union for the adapter layer ----------------------

export type CmsPostCreate =
  | { readonly provider: 'wordpress'; readonly payload: WordPressPostCreate }
  | { readonly provider: 'shopify'; readonly payload: ShopifyArticleCreate };

export type CmsPostResponse =
  | { readonly provider: 'wordpress'; readonly data: WordPressPostResponse }
  | { readonly provider: 'shopify'; readonly data: ShopifyArticleResponse };

// ---------- CMS operation outcome (Result/Either for CMS API calls) --------

export type CmsErrorCode =
  | 'auth_failed'       // 401 from the CMS API
  | 'not_found'         // 404 from the CMS API
  | 'rate_limited'      // 429 from the CMS API
  | 'validation_failed' // payload rejected by CMS (422 / 400)
  | 'upstream_error'    // 5xx from the CMS API
  | 'timeout';          // request took longer than the budget

export interface CmsOperationResult<T> {
  readonly ok: true;
  readonly data: T;
  readonly httpStatus: number;
}

export interface CmsOperationError {
  readonly ok: false;
  readonly code: CmsErrorCode;
  readonly message: string;
  readonly httpStatus?: number;
}

export type CmsOperationOutcome<T> = CmsOperationResult<T> | CmsOperationError;
