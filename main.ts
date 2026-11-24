// news-image-20261124 — entry program (Node 22, standard library only).
//
// The poster summing up Tuesday 24 November 2026 is the entry.png beside
// this file. The program copies it into the grader's output directory and
// verifies the copy: non-empty, at most 1 MiB, the limits the gate checks.
//
// Run locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const source = new URL('./entry.png', import.meta.url);
const target = join(outDir, 'entry.png');

if (!existsSync(source)) {
  throw new Error('entry.png is missing from the repository');
}

copyFileSync(source, target);

const bytes = statSync(target).size;
if (bytes === 0 || bytes > 1048576) {
  throw new Error(`entry.png is ${bytes} bytes; the gate allows 1..1048576`);
}

console.log(`wrote ${target} (${bytes} bytes)`);
