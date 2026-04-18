# CMS Integrations

SEOBot supports two CMS targets out of the box: **WordPress** (REST API v2) and **Shopify** (Admin API 2025-01). Both follow the same canonical adapter pattern — a `Draft` is converted to a `CanonicalPublishPayload` and then mapped to the CMS-specific request shape.

---

## WordPress REST API v2

**Reference:** https://developer.wordpress.org/rest-api/reference/posts/

### Authentication

WordPress Application Passwords (introduced in WP 5.6). The password is generated in WP Admin → Users → Application Passwords and used as HTTP Basic auth:

```
Authorization: Basic base64(username:app-password)
```

Spaces in the generated Application Password are stripped before base64-encoding (WP generates passwords with spaces for readability; the API accepts them without spaces).

### Endpoints

| Operation | Endpoint | Method |
|---|---|---|
| Create post | `/wp-json/wp/v2/posts` | POST |
| Update post | `/wp-json/wp/v2/posts/:id` | POST (WP uses POST for updates, not PUT/PATCH) |
| Get post | `/wp-json/wp/v2/posts/:id` | GET |
| Upload media | `/wp-json/wp/v2/media` | POST (multipart/form-data, raw binary) |
| Get categories | `/wp-json/wp/v2/categories` | GET |
| Create category | `/wp-json/wp/v2/categories` | POST |
| Get tags | `/wp-json/wp/v2/tags` | GET |
| Create tag | `/wp-json/wp/v2/tags` | POST |

### Post payload shape

```typescript
interface WordPressPostCreate {
  title:   string;           // H1 text
  slug:    string;           // URL-safe slug
  content: string;           // HTML body (Markdown converted before sending)
  status:  'draft' | 'publish' | 'private' | 'future';
  date?:   string;           // ISO 8601 — required when status = 'future'
  categories?: number[];     // pre-resolved category IDs
  tags?:       number[];     // pre-resolved tag IDs
  featured_media?: number;   // media ID from prior /wp/v2/media upload
  meta: {
    _yoast_wpseo_metadesc?:  string;  // meta description (Yoast SEO plugin)
    _yoast_wpseo_canonical?: string;  // canonical URL (if set)
  };
}
```

> **Note on `PUT` vs `POST`:** The WordPress REST API uses `POST` for both create and update operations on posts. Unlike most REST APIs, there is no `PUT` or `PATCH` endpoint for posts.

### Taxonomy resolution

Categories and tags are referenced by integer ID, not by name. The adapter provides `getOrCreateCategory()` and `getOrCreateTag()` helpers that query `?search=name` and create the term if not found. Batch helpers `resolveCategoryIds()` and `resolveTagIds()` accept a string array and return the resolved integer IDs.

### Featured image upload

Media upload uses `POST /wp/v2/media` with a raw binary body — **not** JSON. Required headers:

```
Content-Type: image/jpeg          (or image/png, image/webp, etc.)
Content-Disposition: attachment; filename="featured.jpg"
```

The returned `id` from the media response is then passed as `featured_media` in the post create/update payload.

---

## Shopify Admin API 2025-01

**Reference:** https://shopify.dev/docs/api/admin-rest/2025-01/resources/article

### Authentication

Custom App with an Admin API access token:

```
X-Shopify-Access-Token: {token}
```

Required OAuth scopes: `write_content` (articles), `read_content` (list blogs).

### Endpoints

| Operation | Endpoint | Method |
|---|---|---|
| List blogs | `/admin/api/2025-01/blogs.json` | GET |
| Get blog | `/admin/api/2025-01/blogs/:blog_id.json` | GET |
| Create article | `/admin/api/2025-01/blogs/:blog_id/articles.json` | POST |
| Update article | `/admin/api/2025-01/blogs/:blog_id/articles/:article_id.json` | PUT |
| Get article | `/admin/api/2025-01/blogs/:blog_id/articles/:article_id.json` | GET |

> **Note:** Every article endpoint requires a `blog_id`. There is no top-level `/articles.json` route — articles always belong to a blog.

### Article payload shape

```typescript
interface ShopifyArticleCreate {
  article: {
    title:       string;
    handle:      string;           // URL slug — Shopify calls this "handle", not "slug"
    body_html:   string;           // HTML body
    author:      string;
    tags?:       string;           // CSV string — Shopify REJECTS an array here
    published:   boolean;          // true = live, false = draft
    published_at?: string;         // ISO 8601 — Shopify uses this for scheduling
    metafields?: ShopifyMetafield[];
  };
}

// SEO metafields
{
  namespace: 'seo',
  key: 'description',              // maps from metaDescription
  value: string,
  type: 'single_line_text_field',
}
{
  namespace: 'seo',
  key: 'canonical_url',            // maps from canonicalUrl (if set)
  value: string,
  type: 'url',
}
```

### Critical: tags as CSV

Shopify's article API accepts tags as a **comma-separated string**, not an array:

```json
{ "tags": "Tools, Reviews, Commercial" }   ✓ correct
{ "tags": ["Tools", "Reviews", "Commercial"] }  ✗ Shopify stores this as "[object Object]"
```

The `canonicalToShopify()` adapter converts the `string[]` tags array to CSV explicitly. This is documented inline to prevent the bug from recurring.

### Blog discovery

Articles must be assigned to an existing blog. The `getOrCreateBlog()` helper lists all blogs (`GET /blogs.json`) and returns the matching blog by title, creating it if not found.

---

## Adapter pattern

The three adapter functions form a clean boundary between the domain model and CMS-specific wire formats:

```
Draft  →  draftToCanonical()  →  CanonicalPublishPayload
                                         │
                          ┌──────────────┴──────────────┐
                 canonicalToWordPress()       canonicalToShopify()
                          │                              │
                  WordPressPostCreate          ShopifyArticleCreate
```

Adding a third CMS (Ghost, Contentful, Webflow, etc.) means adding:
1. A `canonicalTo<CMS>()` function in `src/lib/cms/<cms>/`
2. A new arm in the `publishArticle()` dispatcher
3. A new `provider` value in the `cms_connections` table CHECK constraint

The `Draft`, `CanonicalPublishPayload`, and all upstream pipeline types are unchanged.
