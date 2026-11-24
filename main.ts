// news-image-20261124 — entry program (Node 22, standard library only).
//
// The poster summing up Tuesday 24 November 2026 is the entry.png beside
// this file. The program copies it into the grader's output directory and
// verifies the copy: non-empty, at most 1 MiB, and exactly 1024x1024 pixels
// (read from the PNG IHDR chunk) — the limits the gate checks.
//
// Run locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, readFileSync, statSync } from 'node:fs';
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

// PNG layout: 8-byte signature, then the IHDR chunk (4-byte length, 4-byte
// "IHDR" type, then width and height as big-endian uint32 at bytes 16-23).
const header = readFileSync(target).subarray(0, 24);
if (
  header.length < 24 ||
  header.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a' ||
  header.subarray(12, 16).toString('ascii') !== 'IHDR'
) {
  throw new Error('entry.png is not a valid PNG (bad signature or IHDR)');
}
const width = header.readUInt32BE(16);
const height = header.readUInt32BE(20);
if (width !== 1024 || height !== 1024) {
  throw new Error(`entry.png is ${width}x${height}; the gate requires 1024x1024`);
}

console.log(`wrote ${target} (${bytes} bytes, ${width}x${height})`);
