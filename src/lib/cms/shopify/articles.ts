import 'server-only';
import type {
  ShopifyArticleCreate,
  ShopifyArticleResponse,
  CmsOperationOutcome,
} from '@/types/cms';
import type { ShopifyClient } from './client';

// Fixture representing a successfully created Shopify article (unpublished).
const SHOPIFY_ARTICLE_FIXTURE: ShopifyArticleResponse = {
  article: {
    id: 1001,
    title: 'Best Industrial Torque Wrenches for Commercial Automotive Shops',
    handle: 'best-industrial-torque-wrenches-commercial-automotive-shops',
    body_html:
      '<p>Choosing the right torque wrench for a commercial automotive shop is a decision that affects technician safety, vehicle liability, and ISO certification compliance.</p>',
    blog_id: 1,
    author: 'ForgeTorque Editorial',
    tags: 'torque wrenches,industrial tools,commercial automotive',
    published_at: null,
    created_at: '2025-06-15T09:00:00-05:00',
    updated_at: '2025-06-15T09:00:00-05:00',
  },
};

/**
 * Creates a new article in a Shopify blog.
 *
 * Shopify endpoint: POST {baseUrl}/blogs/{blog_id}/articles.json
 * Body: { article: ShopifyArticleCreate['article'] }
 *
 * Stub: returns fixture data. Phase 5 wires in the actual fetch() call.
 */
export async function createArticle(
  client: ShopifyClient,
  blogId: number,
  payload: ShopifyArticleCreate,
): Promise<CmsOperationOutcome<ShopifyArticleResponse>> {
  // Phase 5: fetch(`${client.baseUrl}/blogs/${blogId}/articles.json`, { method: 'POST', headers: client.headers, body: JSON.stringify(payload) })
  void client;
  return {
    ok: true,
    data: {
      article: {
        ...SHOPIFY_ARTICLE_FIXTURE.article,
        blog_id: blogId,
        title: payload.article.title,
        handle: payload.article.handle ?? SHOPIFY_ARTICLE_FIXTURE.article.handle,
        author: payload.article.author,
        tags: payload.article.tags ?? SHOPIFY_ARTICLE_FIXTURE.article.tags,
        published_at: payload.article.published ? new Date().toISOString() : null,
      },
    },
    httpStatus: 201,
  };
}

/**
 * Updates an existing Shopify article.
 *
 * Shopify endpoint: PUT {baseUrl}/blogs/{blog_id}/articles/{article_id}.json
 *
 * Stub: returns fixture with updated fields.
 */
export async function updateArticle(
  client: ShopifyClient,
  blogId: number,
  articleId: number,
  payload: Partial<ShopifyArticleCreate>,
): Promise<CmsOperationOutcome<ShopifyArticleResponse>> {
  // Phase 5: fetch(`${client.baseUrl}/blogs/${blogId}/articles/${articleId}.json`, { method: 'PUT', ... })
  void client;
  return {
    ok: true,
    data: {
      article: {
        ...SHOPIFY_ARTICLE_FIXTURE.article,
        id: articleId,
        blog_id: blogId,
        title: payload.article?.title ?? SHOPIFY_ARTICLE_FIXTURE.article.title,
        handle: payload.article?.handle ?? SHOPIFY_ARTICLE_FIXTURE.article.handle,
        updated_at: new Date().toISOString(),
      },
    },
    httpStatus: 200,
  };
}

/**
 * Retrieves a single Shopify article by blog ID and article ID.
 *
 * Shopify endpoint: GET {baseUrl}/blogs/{blog_id}/articles/{article_id}.json
 *
 * Stub: returns fixture data.
 */
export async function getArticle(
  client: ShopifyClient,
  blogId: number,
  articleId: number,
): Promise<CmsOperationOutcome<ShopifyArticleResponse>> {
  // Phase 5: fetch(`${client.baseUrl}/blogs/${blogId}/articles/${articleId}.json`, { headers: client.headers })
  void client;
  return {
    ok: true,
    data: {
      article: {
        ...SHOPIFY_ARTICLE_FIXTURE.article,
        id: articleId,
        blog_id: blogId,
      },
    },
    httpStatus: 200,
  };
}
