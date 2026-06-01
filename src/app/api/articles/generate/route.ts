import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { serverEnv } from '@/lib/env';
import type { DemoArticle, DemoSection, DemoSeoVerdict } from '@/lib/demo-data';

const RequestSchema = z.object({
  keyword: z.string().min(1).max(300),
  targetLength: z.number().int().min(500).max(6000),
  articleId: z.string().min(1),
  keywordId: z.string().min(1),
});

const SYSTEM_PROMPT = `You are an expert SEO content writer specializing in destination weddings, honeymoons, proposals, and romantic travel for Wedded Wonderland — a premium Australian wedding destination platform.

Generate a comprehensive, SEO-optimized article. Return ONLY valid JSON (no markdown fences, no extra text) matching this exact shape:

{
  "h1": "string — compelling H1 title including the keyword, written for search intent",
  "slug": "string — URL slug: lowercase letters, hyphens only, no special chars, max 60 chars",
  "metaDescription": "string — exactly 140-155 characters, includes keyword naturally, ends with a CTA",
  "wordCount": number,
  "sections": [
    {
      "level": 2,
      "text": "string — H2 heading",
      "wordCount": number,
      "body": ["paragraph 1 text", "paragraph 2 text", "paragraph 3 text"]
    }
  ],
  "seoScore": number,
  "seoVerdicts": [
    {
      "rule": "string",
      "label": "string",
      "verdict": "pass",
      "detail": "string"
    }
  ]
}

Rules:
- Generate 6-8 H2 sections. Each H2 section must have 2-4 paragraphs in the body array.
- You may include one or two H3 subsections nested inside a major H2 (use level: 3 and include a body array with 1-2 paragraphs).
- Total wordCount across all sections must approximately match the requested target word count.
- Write authoritatively and naturally. Use specific details — prices, distances, venue names, seasons, visa requirements where relevant.
- seoScore must be an integer between 70 and 95.
- seoVerdicts must include exactly these 5 rules evaluated honestly:
  - rule: "keyword-in-h1", label: "Keyword in H1"
  - rule: "meta-length", label: "Meta description length"
  - rule: "word-count", label: "Word count"
  - rule: "readability", label: "Readability score"
  - rule: "internal-links", label: "Internal links" (this should be verdict: "warn" with detail explaining links will be added before publishing)
- verdict values are: "pass", "warn", or "fail"`;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.issues }, { status: 400 });
  }

  const apiKey = serverEnv.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 503 });
  }

  const { keyword, targetLength, articleId, keywordId } = parsed.data;

  const client = new OpenAI({ apiKey });

  const userPrompt = `Keyword: "${keyword}"
Target word count: ${targetLength} words
Brand context: Wedded Wonderland serves Australian couples planning destination weddings globally. Readers are engaged couples with a $30K–$150K AUD wedding budget. Tone: aspirational but practical.

Generate the complete SEO article JSON now.`;

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return NextResponse.json({ error: 'Empty AI response' }, { status: 502 });
    }

    let aiData: {
      h1: string;
      slug: string;
      metaDescription: string;
      wordCount: number;
      sections: Array<{ level: 2 | 3; text: string; wordCount: number; body?: string[] }>;
      seoScore: number;
      seoVerdicts: Array<{ rule: string; label: string; verdict: 'pass' | 'warn' | 'fail'; detail: string }>;
    };

    try {
      aiData = JSON.parse(raw);
    } catch {
      console.error('[articles/generate] JSON parse error. Raw:', raw.slice(0, 500));
      return NextResponse.json({ error: 'AI returned invalid JSON' }, { status: 502 });
    }

    // Build DemoArticle shape
    const article: DemoArticle = {
      id: articleId,
      keywordId,
      h1: aiData.h1 ?? `${keyword} — Complete Guide`,
      slug: aiData.slug ?? keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      metaDescription: aiData.metaDescription ?? '',
      wordCount: aiData.wordCount ?? targetLength,
      sections: (aiData.sections ?? []) as readonly DemoSection[],
      internalLinks: [],
      seoScore: Math.min(100, Math.max(0, Math.round(aiData.seoScore ?? 78))),
      seoVerdicts: (aiData.seoVerdicts ?? []) as readonly DemoSeoVerdict[],
      publishedAt: null,
      cmsConnectionId: null,
    };

    return NextResponse.json(article);
  } catch (err) {
    console.error('[articles/generate] OpenAI error:', err);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
