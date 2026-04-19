import 'server-only';
import type { Draft } from '@/types/pipeline';
import type {
  CanonicalPublishPayload,
  WordPressPostCreate,
  ShopifyArticleCreate,
  ShopifyMetafield,
} from '@/types/cms';

// Phase 5: replace with a proper Unified.js remark → rehype pipeline.
// This stub converts the most common Markdown patterns from our fixture data
// to keep the canonical payload valid HTML without adding a parse dependency.
function markdownToHtml(markdown: string): string {
  return markdown
    .split('\n\n')
    .map(para => `<p>${para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</p>`)
    .join('\n');
}

// Assembles full article HTML from intro bodyMarkdown + ordered sections.
function buildArticleHtml(draft: Draft): string {
  const intro = markdownToHtml(draft.bodyMarkdown);
  const sections = draft.sections
    .map(section => {
      const tag = `h${section.level}` as 'h2' | 'h3' | 'h4';
      return `<${tag}>${section.text}</${tag}>\n${markdownToHtml(section.bodyMarkdown)}`;
    })
    .join('\n\n');
  return `${intro}\n\n${sections}`;
}

/**
 * Converts a pipeline `Draft` to the canonical publish payload.
 *
 * This is the single point where `bodyMarkdown` is converted to `bodyHtml`.
 * All downstream CMS adapters operate on the canonical payload and never
 * touch Markdown directly.
 */
export function draftToCanonical(
  draft: Draft,
  options: {
    readonly articleId: string;
    readonly status: CanonicalPublishPayload['status'];
    readonly categories?: readonly string[];
    readonly tags?: readonly string[];
    readonly featuredImageUrl?: string | null;
    readonly featuredImageAlt?: string | null;
    readonly publishAt?: string | null;
  },
): CanonicalPublishPayload {
  return {
    articleId: options.articleId,
    title: draft.h1,
    slug: draft.slug,
    bodyHtml: buildArticleHtml(draft),
    // Trim whitespace and coerce empty string to null: `?? null` would pass '' through
    // because nullish coalescing only replaces null/undefined, not empty string.
    excerpt: draft.bodyMarkdown.split('\n\n')[0]?.trim() || null,
    metaDescription: draft.metaDescription,
    canonicalUrl: draft.canonicalUrl,
    categories: options.categories ?? [],
    tags: options.tags ?? [],
    featuredImage:
      options.featuredImageUrl != null
        ? { url: options.featuredImageUrl, alt: options.featuredImageAlt ?? '' }
        : null,
    status: options.status,
    publishAt: options.publishAt ?? null,
  };
}

/**
 * Maps a canonical payload to a WordPress REST API v2 post creation shape.
 *
 * Field mapping:
 *   title              → title
 *   slug               → slug
 *   bodyHtml           → content
 *   excerpt            → excerpt
 *   status             → status (direct — both use 'draft'/'publish'/'private'/'future')
 *   publishAt          → date (used when status = 'future')
 *   metaDescription    → meta._yoast_wpseo_metadesc
 *   canonicalUrl       → meta._yoast_wpseo_canonical
 *   categoryIds        → categories (pre-resolved numeric IDs)
 *   tagIds             → tags (pre-resolved numeric IDs)
 *   featuredMediaId    → featured_media
 *
 * Pre-resolving IDs: callers must call `resolveCategoryIds()` and
 * `resolveTagIds()` from `wordpress/taxonomy.ts` before this function.
 */
export function canonicalToWordPress(
  payload: CanonicalPublishPayload,
  options?: {
    readonly categoryIds?: readonly number[];
    readonly tagIds?: readonly number[];
    readonly featuredMediaId?: number;
  },
): WordPressPostCreate {
  const post: WordPressPostCreate = {
    title: payload.title,
    slug: payload.slug,
    content: payload.bodyHtml,
    status: payload.status,
    meta: {
      _yoast_wpseo_metadesc: payload.metaDescription,
      ...(payload.canonicalUrl != null && {
        _yoast_wpseo_canonical: payload.canonicalUrl,
      }),
    },
  };

  // Only include optional fields when values are present —
  // WP REST API ignores absent optional fields but rejects null values for some.
  if (payload.excerpt != null) {
    return {
      ...post,
      excerpt: payload.excerpt,
      ...(payload.status === 'future' && payload.publishAt != null && { date: payload.publishAt }),
      ...(options?.categoryIds?.length && { categories: options.categoryIds }),
      ...(options?.tagIds?.length && { tags: options.tagIds }),
      ...(options?.featuredMediaId != null && { featured_media: options.featuredMediaId }),
    };
  }

  return {
    ...post,
    ...(payload.status === 'future' && payload.publishAt != null && { date: payload.publishAt }),
    ...(options?.categoryIds?.length && { categories: options.categoryIds }),
    ...(options?.tagIds?.length && { tags: options.tagIds }),
    ...(options?.featuredMediaId != null && { featured_media: options.featuredMediaId }),
  };
}

/**
 * Maps a canonical payload to a Shopify Admin API article creation shape.
 *
 * Field mapping:
 *   title              → article.title
 *   slug               → article.handle  (Shopify uses "handle" not "slug")
 *   bodyHtml           → article.body_html
 *   excerpt            → article.summary_html (list-view excerpt — NOT meta description)
 *   tags               → article.tags (CSV string — Shopify does NOT use an array)
 *   metaDescription    → article.metafields[{ namespace:'seo', key:'description' }]
 *   canonicalUrl       → article.metafields[{ namespace:'seo', key:'canonical_url' }]
 *   status='publish'   → article.published=true
 *   publishAt          → article.published_at
 *   featuredImage      → article.image.src + image.alt
 *
 * IMPORTANT: Shopify tags MUST be a CSV string, not a JSON array.
 * Passing an array causes the API to store "[object Object]" literally.
 */
export function canonicalToShopify(
  payload: CanonicalPublishPayload,
  options: {
    readonly blogId: number;
    readonly author: string;
  },
): ShopifyArticleCreate {
  const metafields: ShopifyMetafield[] = [
    {
      namespace: 'seo',
      key: 'description',
      type: 'single_line_text_field',
      value: payload.metaDescription,
    },
  ];

  if (payload.canonicalUrl != null) {
    metafields.push({
      namespace: 'seo',
      key: 'canonical_url',
      type: 'url',
      value: payload.canonicalUrl,
    });
  }

  return {
    article: {
      title: payload.title,
      handle: payload.slug,
      body_html: payload.bodyHtml,
      blog_id: options.blogId,
      author: options.author,
      // Shopify tags MUST be a CSV string — array would produce "[object Object]"
      tags: payload.tags.join(',') || undefined,
      summary_html: payload.excerpt ?? undefined,
      published: payload.status === 'publish',
      published_at: payload.publishAt ?? undefined,
      metafields,
      image: payload.featuredImage != null
        ? { src: payload.featuredImage.url, alt: payload.featuredImage.alt }
        : undefined,
    },
  };
}
