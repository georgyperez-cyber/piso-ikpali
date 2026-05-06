#!/usr/bin/env node
import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";

const SRC = path.resolve(process.cwd(), "../_originals_quarantine/ASSETS");
const OUT = path.resolve(process.cwd(), "public/assets-optimized");

const SLUG = (s) => s.toLowerCase().replace(/\.[^.]+$/, "").replace(/\s+/g, "-");

// Per-category target widths (single largest size — keep payload small).
// We intentionally do NOT generate huge desktop versions for things that always render small.
const PROFILES = {
  // Texturas: heavy backgrounds → cap aggressively
  textura: { widths: [1280, 800], format: "webp", quality: 60 },
  // Hero foto icons: rendered at ~360–480px in hero, never huge
  "hero icono foto": { widths: [720, 480], format: "webp", quality: 78 },
  "hero icono negro": { widths: [600, 400], format: "webp", quality: 82 },
  "hero icono": { widths: [600, 400], format: "webp", quality: 82 }, // red icons
  publico: { widths: [720, 480], format: "webp", quality: 72 },
  "cuadricula byn": { widths: [1200, 720], format: "webp", quality: 70 },
  "cuadricula rojo": { widths: [1200, 720], format: "webp", quality: 78 },
  // Architect sketches: line art on white — preserve detail at higher quality
  plano: { widths: [1600, 1000], format: "webp", quality: 88 },
};

function profileFor(name) {
  const lower = name.toLowerCase();
  for (const key of Object.keys(PROFILES)) {
    if (lower.startsWith(key)) return { key, ...PROFILES[key] };
  }
  return { key: "misc", widths: [1200], format: "webp", quality: 75 };
}

async function processFile(file) {
  const src = path.join(SRC, file);
  const base = SLUG(file);
  const prof = profileFor(file);

  const meta = await sharp(src).metadata();
  const results = [];
  for (const w of prof.widths) {
    const width = Math.min(w, meta.width || w);
    const outPath = path.join(OUT, `${base}-${w}.webp`);
    await sharp(src)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: prof.quality, effort: 5 })
      .toFile(outPath);
    const stat = await fs.stat(outPath);
    results.push({ outPath: path.relative(process.cwd(), outPath), kb: Math.round(stat.size / 1024) });
  }
  return { file, profile: prof.key, sizes: results };
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const files = (await fs.readdir(SRC)).filter((f) => /\.(png|jpe?g)$/i.test(f));
  console.log(`Optimizing ${files.length} assets → ${OUT}`);
  const concurrency = 4;
  let i = 0;
  const queue = files.slice();
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const f = queue.shift();
      try {
        const r = await processFile(f);
        const sizes = r.sizes.map((s) => `${path.basename(s.outPath)} ${s.kb}KB`).join(", ");
        console.log(`✓ [${++i}/${files.length}] ${f} → ${sizes}`);
      } catch (err) {
        console.error(`✗ ${f}: ${err.message}`);
      }
    }
  });
  await Promise.all(workers);
  console.log("Done.");
}

main();
