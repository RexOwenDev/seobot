import 'server-only';
import type { ShopifyBlog, CmsOperationOutcome } from '@/types/cms';
import type { ShopifyClient } from './client';

// Fixture blogs matching the ForgeTorque demo workspace
const SHOPIFY_BLOGS_FIXTURE: readonly ShopifyBlog[] = [
  { id: 1, handle: 'news', title: 'ForgeTorque News' },
  { id: 2, handle: 'technical-guides', title: 'Technical Guides' },
  { id: 3, handle: 'industry-insights', title: 'Industry Insights' },
];

/**
 * Lists all blogs in the Shopify store.
 *
 * Shopify endpoint: GET {baseUrl}/blogs.json
 *
 * Stub: returns fixture blogs. Phase 5 wires in the actual fetch() call.
 */
export async function listBlogs(
  client: ShopifyClient,
): Promise<CmsOperationOutcome<readonly ShopifyBlog[]>> {
  // Phase 5: fetch(`${client.baseUrl}/blogs.json`, { headers: client.headers })
  void client;
  return { ok: true, data: SHOPIFY_BLOGS_FIXTURE, httpStatus: 200 };
}

/**
 * Returns the Shopify blog matching the given handle, creating it if absent.
 *
 * Shopify lookup: GET {baseUrl}/blogs.json — filter client-side by handle
 *   (Shopify API does not support handle filtering natively)
 * Shopify create: POST {baseUrl}/blogs.json { blog: { title, handle } }
 *
 * Stub: returns fixture blog. Phase 5 wires in the list-then-create pattern.
 */
export async function getOrCreateBlog(
  client: ShopifyClient,
  handle: string,
  title: string,
): Promise<CmsOperationOutcome<ShopifyBlog>> {
  // Phase 5:
  // 1. GET /blogs.json
  // 2. Find blog where blog.handle === handle
  // 3. If found, return it
  // 4. If not found, POST /blogs.json { blog: { handle, title, commentable: 'no' } }
  void client;

  const existing = SHOPIFY_BLOGS_FIXTURE.find(b => b.handle === handle);
  if (existing !== undefined) {
    return { ok: true, data: existing, httpStatus: 200 };
  }

  const newBlog: ShopifyBlog = {
    id: Math.floor(Math.random() * 9000) + 1000,
    handle,
    title,
  };
  return { ok: true, data: newBlog, httpStatus: 201 };
}
