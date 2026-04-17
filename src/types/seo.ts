/**
 * SEO-specific types. These are the shapes the pipeline and the UI reason
 * about. Storage maps to these via `database.ts`.
 */

import type {
  ArticleRow,
  ArticleSectionRow,
  InternalLinkRow,
  RuleVerdict,
  SchemaType,
  SeoVerdict,
} from './database';

export interface MetaTags {
  readonly title: string;
  readonly description: string;
  readonly canonical: string | null;
  readonly robots: 'index,follow' | 'noindex,nofollow' | 'index,nofollow' | 'noindex,follow';
  readonly og: {
    readonly title: string;
    readonly description: string;
    readonly type: 'article';
    readonly image: string | null;
  };
  readonly twitter: {
    readonly card: 'summary_large_image' | 'summary';
    readonly title: string;
    readonly description: string;
    readonly image: string | null;
  };
}

export interface SchemaOrgArticle {
  readonly '@context': 'https://schema.org';
  readonly '@type': SchemaType;
  readonly headline: string;
  readonly description: string;
  readonly datePublished: string;
  readonly dateModified: string;
  readonly author: { readonly '@type': 'Organization' | 'Person'; readonly name: string };
  readonly mainEntityOfPage: { readonly '@type': 'WebPage'; readonly '@id': string };
  readonly image?: string;
}

export interface Heading {
  readonly level: 2 | 3 | 4;
  readonly text: string;
  readonly position: number;
}

export interface ArticleForRender {
  readonly article: ArticleRow;
  readonly sections: readonly ArticleSectionRow[];
  readonly internalLinks: readonly InternalLinkRow[];
  readonly meta: MetaTags;
  readonly schema: SchemaOrgArticle;
}

// ---------- SEO validation report (Phase 6 writes these) --------------------

export interface RuleResult {
  readonly key: string;
  readonly verdict: RuleVerdict;
  readonly message: string;
  readonly details: Readonly<Record<string, unknown>>;
}

export interface SEOReport {
  readonly articleId: string;
  readonly overallScore: number;
  readonly verdict: SeoVerdict;
  readonly results: readonly RuleResult[];
  readonly createdAt: string;
}
