// WordPress
export { createWordPressClient } from './wordpress/client';
export type { WordPressClientConfig, WordPressClient } from './wordpress/client';
export { WP_ENDPOINTS } from './wordpress/client';
export { createPost, updatePost, getPost } from './wordpress/posts';
export { uploadFeaturedImage } from './wordpress/media';
export {
  getOrCreateCategory,
  getOrCreateTag,
  resolveCategoryIds,
  resolveTagIds,
} from './wordpress/taxonomy';
export type { WordPressTerm } from './wordpress/taxonomy';

// Shopify
export { createShopifyClient, SHOPIFY_API_VERSION } from './shopify/client';
export type { ShopifyClientConfig, ShopifyClient } from './shopify/client';
export { SHOPIFY_ENDPOINTS } from './shopify/client';
export { createArticle, updateArticle, getArticle } from './shopify/articles';
export { listBlogs, getOrCreateBlog } from './shopify/blogs';

// Adapters (canonical layer)
export { draftToCanonical, canonicalToWordPress, canonicalToShopify } from './adapters';

// Publish
export { publishArticle } from './publish';
export type { PublishJobStub } from './publish';
