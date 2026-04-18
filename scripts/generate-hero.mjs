#!/usr/bin/env node
/**
 * generate-hero.mjs — Generate docs/hero.png using Gemini Imagen 4.0
 *
 * Usage:   node scripts/generate-hero.mjs
 * Prereq:  GEMINI_API_KEY set in environment (personal key — see SETUP.md)
 *
 * Security:
 *   - API key is read from env only, never echoed or logged.
 *   - Script exits with code 1 immediately if the key is missing.
 *   - Output is written via fs.writeFile — no shell commands.
 *
 * Model: imagen-4.0-generate-001
 * Output: docs/hero.png (committed to repo — regenerate when prompt changes)
 */
import { GoogleGenAI } from '@google/genai';
import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DOCS_DIR = join(ROOT, 'docs');
const OUT_PATH = join(DOCS_DIR, 'hero.png');

// ── Guard: fail immediately if key is absent — never proceed with undefined ──
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('[generate-hero] ERROR: GEMINI_API_KEY is not set.');
  console.error('  Provide your personal Gemini API key (NOT the DesignShopp key).');
  console.error('  See SETUP.md § "Asset generation scripts" for the key source.');
  process.exit(1);
}

const IMAGE_PROMPT = [
  'Dark-themed developer tool dashboard hero image.',
  'Shows a minimal keyword input form on the left, a horizontal pipeline diagram',
  'with labeled steps (Research → Outline → Draft → SEO Audit → Publish) in the centre,',
  'and an SEO score badge reading "94 / 100 Ready" in emerald green on the right.',
  'Background: deep zinc-900 (#18181b). Accent: emerald-400 (#34d399).',
  'Typography is clean monospace. Subtle grid overlay. No humans, no logos.',
  '16:9 aspect ratio. Professional, understated, developer-tool aesthetic.',
].join(' ');

async function main() {
  const ai = new GoogleGenAI({ apiKey });

  console.log('[generate-hero] Requesting image from Gemini Imagen 4.0…');
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: IMAGE_PROMPT,
    config: {
      numberOfImages: 1,
      aspectRatio: '16:9',
    },
  });

  const image = response.generatedImages?.[0];
  if (!image?.image?.imageBytes) {
    throw new Error('No image data returned — Gemini API may have filtered the prompt.');
  }

  const bytes = Buffer.from(image.image.imageBytes, 'base64');
  await mkdir(DOCS_DIR, { recursive: true });
  await writeFile(OUT_PATH, bytes);

  const kb = Math.round(bytes.length / 1024);
  console.log(`[generate-hero] Saved ${kb} KB → ${OUT_PATH}`);
}

main().catch((err) => {
  // Log message only — never the error object which might include request headers
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`[generate-hero] Fatal: ${msg}`);
  process.exit(1);
});
