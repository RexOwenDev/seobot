/**
 * generate-diagrams.ts — Render Mermaid .mmd source files → SVG
 *
 * Usage:   tsx scripts/generate-diagrams.ts
 * Prereq:  @mermaid-js/mermaid-cli installed (devDep) — provides the `mmdc` binary.
 *
 * Security:
 *   - Uses execFile (NOT exec) — args passed as array, never shell-interpolated.
 *   - All source and output paths are hardcoded — no user input, no path traversal.
 *   - ENOENT errors (mmdc not found) produce an actionable error message.
 *
 * Output files (committed to repo — regenerate when diagrams change):
 *   docs/pipeline-flow.svg
 *   docs/cms-publish-sequence.svg
 *   docs/schema.svg
 *   docs/architecture.svg
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join, resolve } from 'node:path';
import { mkdir } from 'node:fs/promises';

const execFileAsync = promisify(execFile);

// ── Path constants ────────────────────────────────────────────────────────────

const ROOT = resolve(join(__dirname, '..'));
const SRC_DIR = join(ROOT, 'docs', 'diagrams');
const OUT_DIR = join(ROOT, 'docs');

interface Diagram {
  readonly label: string;
  readonly src: string;
  readonly out: string;
}

const DIAGRAMS: readonly Diagram[] = [
  {
    label: 'Pipeline Flow',
    src: join(SRC_DIR, 'pipeline-flow.mmd'),
    out: join(OUT_DIR, 'pipeline-flow.svg'),
  },
  {
    label: 'CMS Publish Sequence',
    src: join(SRC_DIR, 'cms-publish-sequence.mmd'),
    out: join(OUT_DIR, 'cms-publish-sequence.svg'),
  },
  {
    label: 'Database Schema',
    src: join(SRC_DIR, 'schema.mmd'),
    out: join(OUT_DIR, 'schema.svg'),
  },
  {
    label: 'System Architecture',
    src: join(SRC_DIR, 'architecture.mmd'),
    out: join(OUT_DIR, 'architecture.svg'),
  },
] as const;

// ── mmdc options applied to every diagram ────────────────────────────────────

const MMDC_BASE_FLAGS: readonly string[] = [
  '--theme', 'dark',
  '--backgroundColor', 'transparent',
  '--width', '1200',
];

// ── Render one diagram ────────────────────────────────────────────────────────

async function renderDiagram(diagram: Diagram): Promise<void> {
  // Arguments are an array — execFile never passes them through a shell
  const args: string[] = [
    ...MMDC_BASE_FLAGS,
    '--input',  diagram.src,
    '--output', diagram.out,
  ];

  await execFileAsync('mmdc', args);
  console.log(`[diagrams] ✓ ${diagram.label} → ${diagram.out}`);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  await mkdir(OUT_DIR, { recursive: true });
  console.log(`[diagrams] Rendering ${DIAGRAMS.length} diagrams…`);

  let failures = 0;
  for (const diagram of DIAGRAMS) {
    try {
      await renderDiagram(diagram);
    } catch (err) {
      failures += 1;
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[diagrams] ✗ ${diagram.label}: ${msg}`);

      if (msg.includes('ENOENT')) {
        console.error('[diagrams]   mmdc binary not found.');
        console.error('[diagrams]   Run: npm install  (devDeps include @mermaid-js/mermaid-cli)');
        // No point trying remaining diagrams if mmdc isn't installed
        break;
      }
    }
  }

  if (failures > 0) {
    process.exit(1);
  }
  console.log('[diagrams] All diagrams rendered successfully.');
}

main().catch((err) => {
  console.error('[diagrams] Fatal:', err instanceof Error ? err.message : err);
  process.exit(1);
});
