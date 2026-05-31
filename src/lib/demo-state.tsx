'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  DEMO_KEYWORDS,
  DEMO_ARTICLES,
  DEMO_PUBLISH_JOBS,
  DEMO_CMS_CONNECTIONS,
  type DemoKeyword,
  type DemoArticle,
  type DemoPublishJob,
  type DemoCmsConnection,
} from '@/lib/demo-data';

// ── Stored shape ──────────────────────────────────────────────────────────────
// Only dynamic (user-generated) entries are stored; fixtures are always merged in.

interface StoredState {
  keywords: DemoKeyword[];
  articles: DemoArticle[];
  publishedOverrides: Record<string, string>; // articleId → publishedAt ISO string
  publishJobs: DemoPublishJob[];
  connections: DemoCmsConnection[];
}

const STORAGE_KEY = 'seobot-demo-v1';

function readStorage(): StoredState {
  if (typeof window === 'undefined') return { keywords: [], articles: [], publishedOverrides: {}, publishJobs: [], connections: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { keywords: [], articles: [], publishedOverrides: {}, publishJobs: [], connections: [] };
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    return {
      keywords: parsed.keywords ?? [],
      articles: parsed.articles ?? [],
      publishedOverrides: parsed.publishedOverrides ?? {},
      publishJobs: parsed.publishJobs ?? [],
      connections: parsed.connections ?? [],
    };
  } catch {
    return { keywords: [], articles: [], publishedOverrides: {}, publishJobs: [], connections: [] };
  }
}

function writeStorage(state: StoredState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors silently
  }
}

// ── Context shape ─────────────────────────────────────────────────────────────

interface DemoStateValue {
  /** All keywords: dynamic (newest first) + fixtures */
  keywords: readonly DemoKeyword[];
  /** All articles: dynamic (newest first) + fixtures, with publish overrides applied */
  articles: readonly DemoArticle[];
  /** All publish jobs: dynamic (newest first) + fixtures */
  publishJobs: readonly DemoPublishJob[];
  /** All CMS connections: dynamic (newest first) + fixtures */
  connections: readonly DemoCmsConnection[];
  /** Live stats derived from full merged dataset */
  stats: {
    keywordsTracked: number;
    articlesGenerated: number;
    articlesPublished: number;
    avgSeoScore: number;
  };
  /** Add a new keyword. Returns the generated id. */
  addKeyword: (data: Omit<DemoKeyword, 'id' | 'articleId'>) => string;
  /** Update status (and optionally articleId) of a dynamic keyword by id. */
  updateKeywordStatus: (
    id: string,
    status: DemoKeyword['status'],
    articleId?: string,
  ) => void;
  /** Add a generated article. */
  addArticle: (article: DemoArticle) => void;
  /** Mark any article (fixture or dynamic) as published. Creates a publish job. Persists across navigation. */
  publishArticle: (id: string, articleH1: string) => void;
  /** Add a new CMS connection. Persists across navigation. */
  addCmsConnection: (data: Omit<DemoCmsConnection, 'id'>) => void;
  /** Clear all user-generated data and reset to fixture state. */
  resetDemo: () => void;
}

const DemoStateContext = createContext<DemoStateValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [dynamic, setDynamic] = useState<StoredState>({ keywords: [], articles: [], publishedOverrides: {}, publishJobs: [], connections: [] });

  // Load from localStorage after mount (avoids SSR hydration mismatch)
  useEffect(() => {
    setDynamic(readStorage());
  }, []);

  // Merge: dynamic entries first (newest first), then fixtures
  // Apply publishedOverrides to any article (fixture or dynamic)
  const keywords = [...dynamic.keywords, ...DEMO_KEYWORDS] as readonly DemoKeyword[];
  const articles = [...dynamic.articles, ...DEMO_ARTICLES].map(a => {
    const overrideDate = dynamic.publishedOverrides[a.id];
    if (overrideDate) {
      return { ...a, publishedAt: overrideDate, cmsConnectionId: 'cms-con-001' } as DemoArticle;
    }
    return a;
  }) as readonly DemoArticle[];
  const publishJobs = [...dynamic.publishJobs, ...DEMO_PUBLISH_JOBS] as readonly DemoPublishJob[];
  const connections = [...dynamic.connections, ...DEMO_CMS_CONNECTIONS] as readonly DemoCmsConnection[];

  const stats = {
    keywordsTracked: keywords.length,
    articlesGenerated: articles.length,
    articlesPublished: articles.filter(a => a.publishedAt !== null).length,
    avgSeoScore:
      articles.length > 0
        ? Math.round(articles.reduce((s, a) => s + a.seoScore, 0) / articles.length)
        : 0,
  };

  const addKeyword = useCallback((data: Omit<DemoKeyword, 'id' | 'articleId'>): string => {
    const id = `kw-gen-${Date.now()}`;
    const kw: DemoKeyword = { ...data, id, articleId: null };
    setDynamic(prev => {
      const next = { ...prev, keywords: [kw, ...prev.keywords] };
      writeStorage(next);
      return next;
    });
    return id;
  }, []);

  const updateKeywordStatus = useCallback(
    (id: string, status: DemoKeyword['status'], articleId?: string) => {
      setDynamic(prev => {
        const next = {
          ...prev,
          keywords: prev.keywords.map(kw =>
            kw.id === id
              ? { ...kw, status, ...(articleId !== undefined ? { articleId } : {}) }
              : kw,
          ),
        };
        writeStorage(next);
        return next;
      });
    },
    [],
  );

  const addArticle = useCallback((article: DemoArticle) => {
    setDynamic(prev => {
      const next = { ...prev, articles: [article, ...prev.articles] };
      writeStorage(next);
      return next;
    });
  }, []);

  const publishArticle = useCallback((id: string, articleH1: string) => {
    setDynamic(prev => {
      const now = new Date().toISOString();
      const newJob: DemoPublishJob = {
        id: `job-${Date.now()}`,
        articleId: id,
        articleH1,
        cmsConnectionId: 'cms-con-001',
        provider: 'wordpress',
        status: 'succeeded',
        startedAt: now,
        completedAt: now,
        externalUrl: null,
      };
      const next: StoredState = {
        ...prev,
        publishedOverrides: { ...prev.publishedOverrides, [id]: now },
        publishJobs: [newJob, ...prev.publishJobs],
        // Flip any dynamic keyword referencing this article to 'published'
        keywords: prev.keywords.map(kw =>
          kw.articleId === id ? { ...kw, status: 'published' as const } : kw
        ),
      };
      writeStorage(next);
      return next;
    });
  }, []);

  const addCmsConnection = useCallback((data: Omit<DemoCmsConnection, 'id'>) => {
    const conn: DemoCmsConnection = { ...data, id: `cms-dyn-${Date.now()}` } as DemoCmsConnection;
    setDynamic(prev => {
      const next = { ...prev, connections: [conn, ...prev.connections] };
      writeStorage(next);
      return next;
    });
  }, []);

  const resetDemo = useCallback(() => {
    const empty: StoredState = { keywords: [], articles: [], publishedOverrides: {}, publishJobs: [], connections: [] };
    writeStorage(empty);
    setDynamic(empty);
  }, []);

  return (
    <DemoStateContext.Provider
      value={{ keywords, articles, publishJobs, connections, stats, addKeyword, updateKeywordStatus, addArticle, publishArticle, addCmsConnection, resetDemo }}
    >
      {children}
    </DemoStateContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useDemoState(): DemoStateValue {
  const ctx = useContext(DemoStateContext);
  if (!ctx) throw new Error('useDemoState must be used within <DemoStateProvider>');
  return ctx;
}
