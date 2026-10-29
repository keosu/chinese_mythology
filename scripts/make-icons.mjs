// Builds PWA icons from the 太阳神鸟 artwork.
import sharp from 'sharp';
import fs from 'node:fs';

fs.mkdirSync('public/icons', { recursive: true });
const art = 'public/art/taiyangshenniao.webp';

async function icon(size, out, { pad = 0.1, round = true } = {}) {
  const inner = Math.round(size * (1 - pad * 2));
  const bird = await sharp(art).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  const r = size / 2;
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <defs>
      <radialGradient id="g" cx="50%" cy="45%" r="60%">
        <stop offset="0" stop-color="#2a1d0c"/>
        <stop offset="0.6" stop-color="#110c08"/>
        <stop offset="1" stop-color="#07060b"/>
      </radialGradient>
    </defs>
    ${round ? `<circle cx="${r}" cy="${r}" r="${r}" fill="url(#g)"/>
    <circle cx="${r}" cy="${r}" r="${r * 0.96}" fill="none" stroke="#e8c068" stroke-opacity="0.55" stroke-width="${size * 0.012}"/>`
      : `<rect width="${size}" height="${size}" fill="url(#g)"/>`}
  </svg>`);
  await sharp(bg)
    .composite([{ input: bird, gravity: 'center' }])
    .png()
    .toFile(out);
  console.log('✓', out);
}

await icon(192, 'public/icons/icon-192.png');
await icon(512, 'public/icons/icon-512.png');
await icon(512, 'public/icons/icon-maskable-512.png', { pad: 0.2, round: false });
await icon(180, 'public/apple-touch-icon.png', { pad: 0.12, round: false });
await icon(64, 'public/favicon.png', { pad: 0.04 });
