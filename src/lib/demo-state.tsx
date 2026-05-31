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
  type DemoKeyword,
  type DemoArticle,
} from '@/lib/demo-data';

// ── Stored shape ──────────────────────────────────────────────────────────────
// Only dynamic (user-generated) entries are stored; fixtures are always merged in.

interface StoredState {
  keywords: DemoKeyword[];
  articles: DemoArticle[];
}

const STORAGE_KEY = 'seobot-demo-v1';

function readStorage(): StoredState {
  if (typeof window === 'undefined') return { keywords: [], articles: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredState) : { keywords: [], articles: [] };
  } catch {
    return { keywords: [], articles: [] };
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
  /** All articles: dynamic (newest first) + fixtures */
  articles: readonly DemoArticle[];
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
}

const DemoStateContext = createContext<DemoStateValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [dynamic, setDynamic] = useState<StoredState>({ keywords: [], articles: [] });

  // Load from localStorage after mount (avoids SSR hydration mismatch)
  useEffect(() => {
    setDynamic(readStorage());
  }, []);

  // Merge: dynamic entries first (newest first), then fixtures
  const keywords = [...dynamic.keywords, ...DEMO_KEYWORDS] as readonly DemoKeyword[];
  const articles = [...dynamic.articles, ...DEMO_ARTICLES] as readonly DemoArticle[];

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

  return (
    <DemoStateContext.Provider
      value={{ keywords, articles, stats, addKeyword, updateKeywordStatus, addArticle }}
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
