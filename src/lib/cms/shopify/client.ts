import 'server-only';

// Shopify Admin REST API client configuration.
//
// Auth: Admin API access token via X-Shopify-Access-Token header.
//   NOT OAuth — this is the private app / custom app token flow.
//   Token is stored in SHOPIFY_ADMIN_ACCESS_TOKEN env (never in client bundle).
//
// API version: 2025-01 (locked — bump deliberately, don't use 'latest' alias)
// Base URL pattern: https://{shop}.myshopify.com/admin/api/2025-01/
//
// SSRF note: the shop domain MUST come from operator-controlled env variables
// (SHOPIFY_SHOP). User-supplied shop domains are NOT accepted.
//
// Reference: https://shopify.dev/docs/api/admin-rest/2025-01/resources/article

export const SHOPIFY_API_VERSION = '2025-01' as const;

export interface ShopifyClientConfig {
  readonly shop: string;            // e.g. "demo-store.myshopify.com"
  readonly adminAccessToken: string;
}

export interface ShopifyClient {
  readonly baseUrl: string;
  readonly headers: Readonly<Record<string, string>>;
}

/**
 * Creates a typed Shopify Admin API client from explicit config.
 *
 * In production (Phase 5+): the caller decrypts credentials from the
 * `cms_connections` table (service-role Supabase RPC) and passes them here.
 * Credentials never transit through user-facing API surfaces.
 */
export function createShopifyClient(config: ShopifyClientConfig): ShopifyClient {
  const shop = config.shop.replace(/\/$/, '');
  const baseUrl = `https://${shop}/admin/api/${SHOPIFY_API_VERSION}`;

  return {
    baseUrl,
    headers: {
      'X-Shopify-Access-Token': config.adminAccessToken,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };
}

// Shopify Admin REST API endpoint paths (relative to baseUrl)
export const SHOPIFY_ENDPOINTS = {
  blogs: '/blogs.json',
  blog: (blogId: number) => `/blogs/${blogId}.json`,
  articles: (blogId: number) => `/blogs/${blogId}/articles.json`,
  article: (blogId: number, articleId: number) => `/blogs/${blogId}/articles/${articleId}.json`,
} as const;
