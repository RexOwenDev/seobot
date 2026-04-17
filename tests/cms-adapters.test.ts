import { describe, expect, it } from 'vitest';
import type {
  CanonicalPublishPayload,
  WordPressPostCreate,
  ShopifyArticleCreate,
} from '../src/types/cms';
import {
  draftToCanonical,
  canonicalToWordPress,
  canonicalToShopify,
} from '../src/lib/cms/adapters';

// Import the Phase 3 draft fixture as our test input
import draftFixture from './fixtures/pipeline/draft.json';
import type { Draft } from '../src/types/pipeline';

// Type-level: fixture must satisfy Draft
const _draftTypeCheck = draftFixture satisfies Draft;
void _draftTypeCheck;

const ARTICLE_ID = '00000000-0000-0000-0000-000000000001';

// ── draftToCanonical ──────────────────────────────────────────────────────────

describe('draftToCanonical', () => {
  it('maps h1 → title', () => {
    const canonical = draftToCanonical(draftFixture, { articleId: ARTICLE_ID, status: 'draft' });
    expect(canonical.title).toBe(draftFixture.h1);
  });

  it('maps slug verbatim', () => {
    const canonical = draftToCanonical(draftFixture, { articleId: ARTICLE_ID, status: 'draft' });
    expect(canonical.slug).toBe(draftFixture.slug);
  });

  it('maps metaDescription verbatim', () => {
    const canonical = draftToCanonical(draftFixture, { articleId: ARTICLE_ID, status: 'draft' });
    expect(canonical.metaDescription).toBe(draftFixture.metaDescription);
  });

  it('maps canonicalUrl verbatim (null)', () => {
    const canonical = draftToCanonical(draftFixture, { articleId: ARTICLE_ID, status: 'draft' });
    expect(canonical.canonicalUrl).toBeNull();
  });

  it('produces non-empty bodyHtml containing section headings', () => {
    const canonical = draftToCanonical(draftFixture, { articleId: ARTICLE_ID, status: 'draft' });
    expect(canonical.bodyHtml.length).toBeGreaterThan(0);

    // All section headings must appear in the HTML output
    for (const section of draftFixture.sections) {
      const tag = `h${section.level}`;
      expect(canonical.bodyHtml).toContain(`<${tag}>${section.text}</${tag}>`);
    }
  });

  it('applies categories and tags from options', () => {
    const canonical = draftToCanonical(draftFixture, {
      articleId: ARTICLE_ID,
      status: 'draft',
      categories: ['Tools & Equipment', 'Automotive'],
      tags: ['torque wrenches', 'industrial'],
    });
    expect(canonical.categories).toEqual(['Tools & Equipment', 'Automotive']);
    expect(canonical.tags).toEqual(['torque wrenches', 'industrial']);
  });

  it('defaults categories and tags to empty arrays', () => {
    const canonical = draftToCanonical(draftFixture, { articleId: ARTICLE_ID, status: 'draft' });
    expect(canonical.categories).toEqual([]);
    expect(canonical.tags).toEqual([]);
  });

  it('maps featuredImageUrl when provided', () => {
    const canonical = draftToCanonical(draftFixture, {
      articleId: ARTICLE_ID,
      status: 'draft',
      featuredImageUrl: 'https://cdn.forgetorque.com/torque-wrench.jpg',
      featuredImageAlt: 'ForgeTorque Pro-900 torque wrench',
    });
    expect(canonical.featuredImage).not.toBeNull();
    expect(canonical.featuredImage?.url).toBe('https://cdn.forgetorque.com/torque-wrench.jpg');
    expect(canonical.featuredImage?.alt).toBe('ForgeTorque Pro-900 torque wrench');
  });

  it('sets featuredImage to null when no URL provided', () => {
    const canonical = draftToCanonical(draftFixture, { articleId: ARTICLE_ID, status: 'draft' });
    expect(canonical.featuredImage).toBeNull();
  });

  it('result satisfies CanonicalPublishPayload shape', () => {
    const canonical: CanonicalPublishPayload = draftToCanonical(draftFixture, {
      articleId: ARTICLE_ID,
      status: 'draft',
    });
    expect(canonical).toBeDefined();
  });
});

// ── canonicalToWordPress ──────────────────────────────────────────────────────

describe('canonicalToWordPress', () => {
  const canonical = draftToCanonical(draftFixture, {
    articleId: ARTICLE_ID,
    status: 'draft',
    categories: ['Tools & Equipment'],
    tags: ['torque wrenches'],
  });

  it('maps title to WP title field', () => {
    const wp = canonicalToWordPress(canonical);
    expect(wp.title).toBe(canonical.title);
  });

  it('maps slug to WP slug field', () => {
    const wp = canonicalToWordPress(canonical);
    expect(wp.slug).toBe(canonical.slug);
  });

  it('maps bodyHtml to WP content field', () => {
    const wp = canonicalToWordPress(canonical);
    expect(wp.content).toBe(canonical.bodyHtml);
  });

  it('maps status directly to WP status', () => {
    const wpDraft = canonicalToWordPress(canonical);
    expect(wpDraft.status).toBe('draft');

    const publishedCanonical = draftToCanonical(draftFixture, {
      articleId: ARTICLE_ID,
      status: 'publish',
    });
    const wpPublished = canonicalToWordPress(publishedCanonical);
    expect(wpPublished.status).toBe('publish');
  });

  it('maps metaDescription to _yoast_wpseo_metadesc', () => {
    const wp = canonicalToWordPress(canonical);
    expect(wp.meta?._yoast_wpseo_metadesc).toBe(canonical.metaDescription);
  });

  it('does NOT set _yoast_wpseo_canonical when canonicalUrl is null', () => {
    const wp = canonicalToWordPress(canonical);
    expect(wp.meta?._yoast_wpseo_canonical).toBeUndefined();
  });

  it('sets _yoast_wpseo_canonical when canonicalUrl is provided', () => {
    const canonicalWithUrl: CanonicalPublishPayload = {
      ...canonical,
      canonicalUrl: 'https://forgetorque.com/best-industrial-torque-wrenches',
    };
    const wp = canonicalToWordPress(canonicalWithUrl);
    expect(wp.meta?._yoast_wpseo_canonical).toBe('https://forgetorque.com/best-industrial-torque-wrenches');
  });

  it('passes pre-resolved category IDs through', () => {
    const wp = canonicalToWordPress(canonical, { categoryIds: [5, 8] });
    expect(wp.categories).toEqual([5, 8]);
  });

  it('passes pre-resolved tag IDs through', () => {
    const wp = canonicalToWordPress(canonical, { tagIds: [12, 15] });
    expect(wp.tags).toEqual([12, 15]);
  });

  it('passes featuredMediaId through', () => {
    const wp = canonicalToWordPress(canonical, { featuredMediaId: 101 });
    expect(wp.featured_media).toBe(101);
  });

  it('sets date when status is future and publishAt is provided', () => {
    const futureCanonical: CanonicalPublishPayload = {
      ...canonical,
      status: 'future',
      publishAt: '2025-12-01T09:00:00Z',
    };
    const wp = canonicalToWordPress(futureCanonical);
    expect(wp.date).toBe('2025-12-01T09:00:00Z');
  });

  it('result satisfies WordPressPostCreate shape', () => {
    const wp: WordPressPostCreate = canonicalToWordPress(canonical);
    expect(wp).toBeDefined();
  });
});

// ── canonicalToShopify ────────────────────────────────────────────────────────

describe('canonicalToShopify', () => {
  const canonical = draftToCanonical(draftFixture, {
    articleId: ARTICLE_ID,
    status: 'draft',
    tags: ['torque wrenches', 'industrial tools', 'commercial automotive'],
  });
  const BLOG_ID = 2;
  const AUTHOR = 'ForgeTorque Editorial';

  it('maps title to article.title', () => {
    const shopify = canonicalToShopify(canonical, { blogId: BLOG_ID, author: AUTHOR });
    expect(shopify.article.title).toBe(canonical.title);
  });

  it('maps slug to article.handle (not slug!)', () => {
    const shopify = canonicalToShopify(canonical, { blogId: BLOG_ID, author: AUTHOR });
    expect(shopify.article.handle).toBe(canonical.slug);
  });

  it('maps bodyHtml to article.body_html', () => {
    const shopify = canonicalToShopify(canonical, { blogId: BLOG_ID, author: AUTHOR });
    expect(shopify.article.body_html).toBe(canonical.bodyHtml);
  });

  it('maps blogId to article.blog_id', () => {
    const shopify = canonicalToShopify(canonical, { blogId: BLOG_ID, author: AUTHOR });
    expect(shopify.article.blog_id).toBe(BLOG_ID);
  });

  it('maps author to article.author', () => {
    const shopify = canonicalToShopify(canonical, { blogId: BLOG_ID, author: AUTHOR });
    expect(shopify.article.author).toBe(AUTHOR);
  });

  it('converts tags array to CSV string (NOT an array)', () => {
    const shopify = canonicalToShopify(canonical, { blogId: BLOG_ID, author: AUTHOR });
    // MUST be a string — Shopify rejects arrays
    expect(typeof shopify.article.tags).toBe('string');
    expect(shopify.article.tags).toBe('torque wrenches,industrial tools,commercial automotive');
  });

  it('sets published=false when status is draft', () => {
    const shopify = canonicalToShopify(canonical, { blogId: BLOG_ID, author: AUTHOR });
    expect(shopify.article.published).toBe(false);
  });

  it('sets published=true when status is publish', () => {
    const publishedCanonical: CanonicalPublishPayload = { ...canonical, status: 'publish' };
    const shopify = canonicalToShopify(publishedCanonical, { blogId: BLOG_ID, author: AUTHOR });
    expect(shopify.article.published).toBe(true);
  });

  it('includes seo.description metafield with correct type', () => {
    const shopify = canonicalToShopify(canonical, { blogId: BLOG_ID, author: AUTHOR });
    const seoMeta = shopify.article.metafields?.find(
      m => m.namespace === 'seo' && m.key === 'description',
    );
    expect(seoMeta).toBeDefined();
    expect(seoMeta?.type).toBe('single_line_text_field');
    expect(seoMeta?.value).toBe(canonical.metaDescription);
  });

  it('does NOT include seo.canonical_url metafield when canonicalUrl is null', () => {
    const shopify = canonicalToShopify(canonical, { blogId: BLOG_ID, author: AUTHOR });
    const canonicalMeta = shopify.article.metafields?.find(
      m => m.namespace === 'seo' && m.key === 'canonical_url',
    );
    expect(canonicalMeta).toBeUndefined();
  });

  it('includes seo.canonical_url metafield with type url when set', () => {
    const canonicalWithUrl: CanonicalPublishPayload = {
      ...canonical,
      canonicalUrl: 'https://forgetorque.com/best-industrial-torque-wrenches',
    };
    const shopify = canonicalToShopify(canonicalWithUrl, { blogId: BLOG_ID, author: AUTHOR });
    const canonicalMeta = shopify.article.metafields?.find(
      m => m.namespace === 'seo' && m.key === 'canonical_url',
    );
    expect(canonicalMeta?.type).toBe('url');
    expect(canonicalMeta?.value).toBe('https://forgetorque.com/best-industrial-torque-wrenches');
  });

  it('result satisfies ShopifyArticleCreate shape', () => {
    const shopify: ShopifyArticleCreate = canonicalToShopify(canonical, {
      blogId: BLOG_ID,
      author: AUTHOR,
    });
    expect(shopify).toBeDefined();
  });
});

// ── Full adapter round-trip ───────────────────────────────────────────────────

describe('adapter round-trip (Draft → Canonical → WP + Shopify)', () => {
  it('WP and Shopify outputs share the same title and slug/handle', () => {
    const canonical = draftToCanonical(draftFixture, { articleId: ARTICLE_ID, status: 'draft' });
    const wp = canonicalToWordPress(canonical);
    const shopify = canonicalToShopify(canonical, { blogId: 1, author: 'Test Author' });

    expect(wp.title).toBe(shopify.article.title);
    // WP uses 'slug', Shopify uses 'handle' — both come from canonical.slug
    expect(wp.slug).toBe(shopify.article.handle);
  });

  it('both outputs preserve the meta description', () => {
    const canonical = draftToCanonical(draftFixture, { articleId: ARTICLE_ID, status: 'draft' });
    const wp = canonicalToWordPress(canonical);
    const shopify = canonicalToShopify(canonical, { blogId: 1, author: 'Test Author' });

    const shopifyMeta = shopify.article.metafields?.find(
      m => m.namespace === 'seo' && m.key === 'description',
    );
    expect(wp.meta?._yoast_wpseo_metadesc).toBe(shopifyMeta?.value);
    expect(wp.meta?._yoast_wpseo_metadesc).toBe(draftFixture.metaDescription);
  });
});
