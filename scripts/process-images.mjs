// Converts black-ink-on-white line art into transparent gilded line art.
// Usage: node scripts/process-images.mjs [srcDir] [outDir]
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const srcDir = process.argv[2] ?? 'art-src';
const outDir = process.argv[3] ?? 'public/art';
const MAX_W = 640;

fs.mkdirSync(outDir, { recursive: true });

// gold gradient from top (pale gold) to bottom (deep amber)
const TOP = [255, 236, 180];
const MID = [232, 190, 105];
const BOT = [196, 128, 58];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function gradient(t) {
  if (t < 0.5) {
    const k = t / 0.5;
    return TOP.map((c, i) => lerp(c, MID[i], k));
  }
  const k = (t - 0.5) / 0.5;
  return MID.map((c, i) => lerp(c, BOT[i], k));
}

function smooth(e0, e1, x) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

async function processOne(file) {
  const id = path.basename(file, path.extname(file));
  const out = path.join(outDir, `${id}.webp`);
  const img = sharp(path.join(srcDir, file)).resize({ width: MAX_W, withoutEnlargement: true });
  const { data, info } = await img.greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const rgba = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    const col = gradient(y / (h - 1));
    const fy = Math.min(y, h - 1 - y) / h;
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const lum = data[i] / 255;
      // ink density: treat near-white paper as fully transparent
      let a = smooth(0.06, 0.72, 1 - lum);
      a = Math.pow(a, 0.8);
      // feather the borders so full-bleed elements dissolve softly
      const fx = Math.min(x, w - 1 - x) / w;
      const edge = smooth(0, 0.07, Math.min(fx, fy));
      a *= edge;
      const o = i * 4;
      rgba[o] = col[0];
      rgba[o + 1] = col[1];
      rgba[o + 2] = col[2];
      rgba[o + 3] = Math.round(a * 255);
    }
  }
  await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
    .webp({ quality: 82, alphaQuality: 90, effort: 5 })
    .toFile(out);
  return out;
}

const files = fs
  .readdirSync(srcDir)
  .filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
const only = process.env.ONLY?.split(',');
for (const f of files) {
  const id = path.basename(f, path.extname(f));
  if (only && !only.includes(id)) continue;
  const out = path.join(outDir, `${id}.webp`);
  if (!process.env.FORCE && fs.existsSync(out) &&
      fs.statSync(out).mtimeMs > fs.statSync(path.join(srcDir, f)).mtimeMs) continue;
  await processOne(f);
  console.log('✓', out);
}

const manifest = fs
  .readdirSync(outDir)
  .filter((f) => f.endsWith('.webp'))
  .map((f) => f.replace(/\.webp$/, ''))
  .sort();
fs.writeFileSync('src/data/art-manifest.json', JSON.stringify(manifest, null, 0) + '\n');
console.log(`manifest: ${manifest.length} images`);
