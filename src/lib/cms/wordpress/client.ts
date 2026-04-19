import 'server-only';

// WordPress REST API v2 client configuration.
//
// Auth: Application Passwords (WP 5.6+).
//   Stored in env as username + app password with spaces stripped.
//   Encoded as Basic auth: base64(username + ':' + strippedPassword)
//
// Base URL pattern: {siteUrl}/wp-json/wp/v2/
//
// SSRF note: siteUrl MUST come from operator-controlled env variables
// (never from user-supplied request bodies) to prevent Server-Side
// Request Forgery against internal network resources.
//
// Reference: https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/

export interface WordPressClientConfig {
  readonly siteUrl: string;
  readonly username: string;
  // App password with spaces stripped: "xxxx xxxx xxxx" → "xxxxxxxxxxxx"
  readonly appPassword: string;
}

export interface WordPressClient {
  readonly baseUrl: string;
  readonly authHeader: string;
  readonly jsonHeaders: Readonly<Record<string, string>>;
}

/**
 * Creates a typed WP REST API client from explicit config.
 *
 * In production (Phase 5+): the caller decrypts credentials from the
 * `cms_connections` table (service-role Supabase RPC) and passes them here.
 * Credentials never transit through user-facing API surfaces.
 */
export function createWordPressClient(config: WordPressClientConfig): WordPressClient {
  // Strip spaces from app password — WP admin displays them for readability
  // but they must be removed before Basic auth encoding.
  const stripped = config.appPassword.replace(/\s+/g, '');
  const authHeader = `Basic ${Buffer.from(`${config.username}:${stripped}`).toString('base64')}`;
  const baseUrl = `${config.siteUrl.replace(/\/$/, '')}/wp-json/wp/v2`;

  return {
    baseUrl,
    authHeader,
    jsonHeaders: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };
}

// WordPress REST API v2 endpoint paths (relative to baseUrl)
export const WP_ENDPOINTS = {
  posts: '/posts',
  post: (id: number) => `/posts/${id}`,
  media: '/media',
  mediaItem: (id: number) => `/media/${id}`, // renamed from 'medium' — consistent with the collection key
  categories: '/categories',
  category: (id: number) => `/categories/${id}`,
  tags: '/tags',
  tag: (id: number) => `/tags/${id}`,
} as const;
