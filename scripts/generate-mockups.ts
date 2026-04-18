/**
 * generate-mockups.ts — Screenshot static mockup HTML pages → PNG via Playwright
 *
 * Usage:   tsx scripts/generate-mockups.ts
 * Prereq:  @playwright/test devDep + `npx playwright install chromium`
 *
 * Security:
 *   - All file paths are hardcoded constants — no dynamic user input.
 *   - Pages are loaded via file:// protocol — zero network access.
 *   - Mockup HTML files must contain no external resource fetches (CDN, API calls).
 *   - Browser runs headless with no sandbox escape surface (no execute permissions).
 *
 * Output files (committed to repo — regenerate when mockups change):
 *   docs/mockups/keyword-input.png
 *   docs/mockups/article-preview.png
 *   docs/mockups/publish-dashboard.png
 */
import { chromium } from '@playwright/test';
import { join, resolve } from 'node:path';
import { mkdir, access } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

// ── Path constants ────────────────────────────────────────────────────────────

const ROOT = resolve(join(__dirname, '..'));
const MOCKUP_DIR = join(ROOT, 'docs', 'mockups');

interface Mockup {
  readonly label: string;
  readonly html: string;
  readonly out: string;
}

const MOCKUPS: readonly Mockup[] = [
  {
    label: 'Keyword Input',
    html: join(MOCKUP_DIR, 'keyword-input.html'),
    out:  join(MOCKUP_DIR, 'keyword-input.png'),
  },
  {
    label: 'Article Preview',
    html: join(MOCKUP_DIR, 'article-preview.html'),
    out:  join(MOCKUP_DIR, 'article-preview.png'),
  },
  {
    label: 'Publish Dashboard',
    html: join(MOCKUP_DIR, 'publish-dashboard.html'),
    out:  join(MOCKUP_DIR, 'publish-dashboard.png'),
  },
] as const;

const VIEWPORT = { width: 1440, height: 900 } as const;

// ── Validate HTML sources exist before launching browser ──────────────────────

async function assertSourcesExist(): Promise<void> {
  for (const mockup of MOCKUPS) {
    try {
      await access(mockup.html);
    } catch {
      throw new Error(
        `Source HTML not found: ${mockup.html}\n` +
        `  Ensure docs/mockups/ HTML files are committed before running this script.`,
      );
    }
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  await mkdir(MOCKUP_DIR, { recursive: true });
  await assertSourcesExist();

  console.log('[mockups] Launching Chromium (headless)…');

  // launch() options: headless only — no --no-sandbox flag (not needed for file:// protocol)
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize(VIEWPORT);

  try {
    for (const mockup of MOCKUPS) {
      // file:// protocol — no HTTP server, no external network access possible
      const fileUrl = pathToFileURL(mockup.html).href;
      await page.goto(fileUrl, { waitUntil: 'networkidle' });
      await page.screenshot({ path: mockup.out, fullPage: false });
      console.log(`[mockups] ✓ ${mockup.label} → ${mockup.out}`);
    }
  } finally {
    // Always close — even on screenshot failure
    await browser.close();
  }

  console.log('[mockups] All mockups captured successfully.');
}

main().catch((err) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`[mockups] Fatal: ${msg}`);
  if (msg.includes('Executable doesn')) {
    console.error('[mockups]   Chromium not installed. Run: npx playwright install chromium');
  }
  process.exit(1);
});
