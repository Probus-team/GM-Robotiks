import sharp from 'sharp';
import { mkdir, writeFile, copyFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Rebuild every logo export from the approved WhatsApp artwork, without AI redraws.
const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'src/assets/brand/source/gm-robotiks-approved.jpg');
const brand = path.join(root, 'public/brand');
const publicDir = path.join(root, 'public');
const optimized = path.join(root, 'src/assets/brand/optimized');
const kit = path.join(root, 'output/brand-kit');
for (const dir of [brand, optimized, kit]) await mkdir(dir, { recursive: true });

const palette = { navy: '#123559', blue: '#2a7abc', white: '#ffffff' };
const colors = [[18, 53, 89], [42, 122, 188]];
const { data: pixels, info } = await sharp(source).removeAlpha().raw().toBuffer({ resolveWithObject: true });
if (info.width !== 1254 || info.height !== 1254) throw new Error('Source dimensions changed; review extraction regions before rebuilding.');

// Rectangles isolate existing artwork. They do not rearrange or redraw its shapes.
const regions = {
  'logo-full': [76, 330, 1103, 592],
  'logo-mark': [223, 393, 804, 340],
  wordmark: [230, 770, 798, 80],
  'logo-micro': [223, 393, 412, 340],
};

function extract([left, top, width, height], navyOnly = false) {
  const rgba = Buffer.alloc(width * height * 4);
  const masks = [new Uint8Array(width * height), new Uint8Array(width * height)];
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = ((top + y) * info.width + left + x) * info.channels;
    const rgb = [pixels[i], pixels[i + 1], pixels[i + 2]];
    // Ignore neutral JPEG background noise. Both brand inks have blue chroma.
    if (rgb[2] - rgb[0] < 12) continue;
    let best;
    for (let color = 0; color < colors.length; color++) {
      const ink = colors[color];
      const d = ink.map(v => 255 - v);
      const alpha = Math.max(0, Math.min(1, d.reduce((sum, v, c) => sum + v * (255 - rgb[c]), 0) / d.reduce((sum, v) => sum + v * v, 0)));
      const error = rgb.reduce((sum, v, c) => sum + (v - (255 - alpha * d[c])) ** 2, 0);
      if (!best || error < best.error) best = { color, alpha, error };
    }
    if (best.alpha < 0.08 || (navyOnly && best.color !== 0)) continue;
    const alpha = best.alpha > 0.96 ? 1 : best.alpha;
    const p = y * width + x;
    rgba.set([...colors[best.color], Math.round(alpha * 255)], p * 4);
    if (alpha >= 0.5) masks[best.color][p] = 1;
  }
  if (navyOnly) {
    // Discard disconnected JPEG flecks from the neighboring blue M.
    const visited = new Uint8Array(width * height);
    let largest = [];
    for (let p = 0; p < visited.length; p++) {
      if (visited[p] || !rgba[p * 4 + 3]) continue;
      const component = [p]; visited[p] = 1;
      for (let i = 0; i < component.length; i++) {
        const q = component[i], x = q % width, y = Math.floor(q / width);
        const neighbors = [x > 0 ? q - 1 : -1, x + 1 < width ? q + 1 : -1, y > 0 ? q - width : -1, y + 1 < height ? q + width : -1];
        for (const next of neighbors) if (next >= 0 && !visited[next] && rgba[next * 4 + 3]) { visited[next] = 1; component.push(next); }
      }
      if (component.length > largest.length) largest = component;
    }
    const keep = new Set(largest);
    for (let p = 0; p < visited.length; p++) if (!keep.has(p)) { rgba[p * 4 + 3] = 0; masks[0][p] = 0; masks[1][p] = 0; }
  }
  return { rgba, masks, width, height };
}

// Trace pixel boundaries, then simplify by less than one source pixel. SVGs contain
// real paths (including counters in the letters), never embedded raster images.
function simplify(points, tolerance = 0.7) {
  if (points.length <= 2) return points;
  const [ax, ay] = points[0], [bx, by] = points.at(-1);
  const dx = bx - ax, dy = by - ay, length = dx * dx + dy * dy;
  let max = 0, index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i];
    const t = length ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / length)) : 0;
    const distance = (x - ax - t * dx) ** 2 + (y - ay - t * dy) ** 2;
    if (distance > max) { max = distance; index = i; }
  }
  return max > tolerance ** 2 ? [...simplify(points.slice(0, index + 1), tolerance).slice(0, -1), ...simplify(points.slice(index), tolerance)] : [points[0], points.at(-1)];
}

function trace(mask, width, height) {
  const stride = width + 1;
  const edges = new Map();
  const add = (a, b) => { const list = edges.get(a) ?? []; list.push(b); edges.set(a, list); };
  const on = (x, y) => x >= 0 && x < width && y >= 0 && y < height && mask[y * width + x];
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if (on(x, y)) {
    const a = y * stride + x, b = a + 1, c = b + stride, d = a + stride;
    if (!on(x, y - 1)) add(a, b);
    if (!on(x + 1, y)) add(b, c);
    if (!on(x, y + 1)) add(c, d);
    if (!on(x - 1, y)) add(d, a);
  }
  const paths = [];
  while (edges.size) {
    const start = edges.keys().next().value;
    const points = [];
    let current = start;
    do {
      points.push([current % stride, Math.floor(current / stride)]);
      const next = edges.get(current);
      if (!next?.length) throw new Error('Unclosed vector contour');
      const end = next.pop();
      if (!next.length) edges.delete(current);
      current = end;
    } while (current !== start);
    if (points.length < 8) continue;
    const area = Math.abs(points.reduce((sum, p, i) => { const q = points[(i + 1) % points.length]; return sum + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
    if (area < 3) continue;
    const half = Math.floor(points.length / 2);
    const loop = [...simplify(points.slice(0, half + 1)).slice(0, -1), ...simplify([...points.slice(half), points[0]])];
    paths.push(`M${loop.map(p => p.join(' ')).join('L')}Z`);
  }
  return paths.join('');
}

const assets = {};
for (const [name, region] of Object.entries(regions)) {
  const asset = extract(region, name === 'logo-micro');
  asset.paths = asset.masks.map(mask => trace(mask, asset.width, asset.height));
  assets[name] = asset;
}

function svg(asset, variant = 'color', padding = 0) {
  const fills = variant === 'white' ? [palette.white, palette.white] : variant === 'mono' ? [palette.navy, palette.navy] : [palette.navy, palette.blue];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-padding} ${-padding} ${asset.width + padding * 2} ${asset.height + padding * 2}"><title>GM Robotiks IA</title>${asset.paths.map((d, i) => `<path fill="${fills[i]}" fill-rule="evenodd" d="${d}"/>`).join('')}</svg>`;
}

async function png(asset, variant = 'color') {
  const rgba = Buffer.from(asset.rgba);
  if (variant !== 'color') for (let i = 0; i < rgba.length; i += 4) rgba.set(variant === 'white' ? [255, 255, 255] : colors[0], i);
  return sharp(rgba, { raw: { width: asset.width, height: asset.height, channels: 4 } }).png().toBuffer();
}

const exports = [
  ['logo-full', 'logo-full', 'color'], ['logo-full-white', 'logo-full', 'white'], ['logo-full-mono', 'logo-full', 'mono'],
  ['logo-mark', 'logo-mark', 'color'], ['logo-mark-white', 'logo-mark', 'white'],
  ['logo-mark-mono', 'logo-mark', 'mono'], ['logo-mark-mono-white', 'logo-mark', 'white'],
  ['wordmark', 'wordmark', 'color'], ['wordmark-white', 'wordmark', 'white'],
  ['logo-micro', 'logo-micro', 'color'], ['logo-micro-white', 'logo-micro', 'white'],
];
for (const [name, key, variant] of exports) {
  await writeFile(path.join(brand, `${name}.png`), await png(assets[key], variant));
  await writeFile(path.join(brand, `${name}.svg`), svg(assets[key], variant));
}

for (const name of ['logo-full', 'logo-full-white', 'logo-mark-white']) {
  const input = path.join(brand, `${name}.png`);
  await sharp(input).webp({ lossless: true }).toFile(path.join(optimized, `${name}.webp`));
  for (const width of name === 'logo-mark-white' ? [176, 288] : [160, 240]) {
    await sharp(input).resize({ width }).webp({ lossless: true }).toFile(path.join(optimized, `${name}-${width}.webp`));
  }
}

// Every icon is a filled navy tile carrying the mark in white. A navy-on-transparent
// mark disappears against a dark browser tab or a dark home screen; the tile gives the
// icon its own ground so it reads the same everywhere.
function tile(size, radius) {
  const r = radius ? ` rx="${(size * radius).toFixed(2)}"` : '';
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}"${r} fill="${palette.navy}"/></svg>`);
}

// radius 0 means full bleed: iOS and Android maskable icons are masked by the OS,
// so they must not carry rounded corners (transparent corners come back as black).
async function square(key, size, fraction = 0.8, radius = 0.22, variant = 'white') {
  const side = Math.round(size * fraction);
  const image = await sharp(Buffer.from(svg(assets[key], variant))).resize(side, side, { fit: 'inside' }).png().toBuffer();
  return sharp(tile(size, radius)).composite([{ input: image, gravity: 'centre' }]).png().toBuffer();
}

// A single G survives 16 px better than the wide GM monogram and its small text.
const iconSizes = [16, 32, 48, 64, 128, 256];
const icoImages = [];
for (const size of iconSizes) {
  // Below 32 px the G is given more of the tile and the corners stay square:
  // at that scale a radius only eats pixels the letter needs.
  const buffer = await square('logo-micro', size, size <= 32 ? 0.78 : 0.66, size < 32 ? 0 : 0.2);
  await writeFile(path.join(publicDir, `favicon-${size}.png`), buffer);
  icoImages.push(buffer);
}
const icoHeader = Buffer.alloc(6 + icoImages.length * 16);
icoHeader.writeUInt16LE(1, 2); icoHeader.writeUInt16LE(icoImages.length, 4);
let offset = icoHeader.length;
for (let i = 0; i < icoImages.length; i++) {
  const entry = 6 + i * 16, size = iconSizes[i];
  icoHeader[entry] = size === 256 ? 0 : size; icoHeader[entry + 1] = size === 256 ? 0 : size;
  icoHeader.writeUInt16LE(1, entry + 4); icoHeader.writeUInt16LE(32, entry + 6);
  icoHeader.writeUInt32LE(icoImages[i].length, entry + 8); icoHeader.writeUInt32LE(offset, entry + 12);
  offset += icoImages[i].length;
}
await writeFile(path.join(publicDir, 'favicon.ico'), Buffer.concat([icoHeader, ...icoImages]));
const micro = assets['logo-micro'];
const microScale = (512 * 0.62) / micro.width;
const microSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="102.4" fill="${palette.navy}"/><g transform="translate(${((512 - micro.width * microScale) / 2).toFixed(2)} ${((512 - micro.height * microScale) / 2).toFixed(2)}) scale(${microScale.toFixed(4)})">${micro.paths.map(d => `<path fill="${palette.white}" fill-rule="evenodd" d="${d}"/>`).join('')}</g></svg>`;
await writeFile(path.join(publicDir, 'favicon.svg'), microSvg);
// Rounded for the icons shown as-is; full bleed for the two the OS masks itself.
for (const [name, size, fraction, radius] of [['icon-192', 192, 0.72, 0.22], ['icon-512', 512, 0.72, 0.22], ['icon-512-maskable', 512, 0.56, 0], ['apple-touch-icon', 180, 0.72, 0]]) {
  await writeFile(path.join(publicDir, `${name}.png`), await square('logo-mark', size, fraction, radius));
}
await writeFile(path.join(brand, 'icon-1024.png'), await square('logo-mark', 1024, 0.72, 0));

// Social image is a fixed-size composition of the approved paths and existing copy.
const full = assets['logo-full'];
const lockup = full.paths.map((d, i) => `<path fill="${i ? palette.blue : palette.navy}" fill-rule="evenodd" d="${d}"/>`).join('');
const social = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#fff"/><rect width="1200" height="12" fill="${palette.blue}"/><g transform="translate(270 65) scale(.6)">${lockup}</g><text x="600" y="489" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="600" fill="${palette.navy}">Robots de servicio Pudu para México</text><text x="600" y="542" text-anchor="middle" font-family="Arial, sans-serif" font-size="23" fill="${palette.blue}">gmrobotiks.com</text><rect y="610" width="1200" height="20" fill="${palette.navy}"/></svg>`;
await sharp(Buffer.from(social)).png().toFile(path.join(publicDir, 'og-default.png'));
await writeFile(path.join(kit, 'social-card.svg'), social);
await sharp(Buffer.from(svg(full))).resize({ width: 2400 }).png().toFile(path.join(kit, 'logo-full-2400.png'));
await copyFile(source, path.join(kit, 'approved-original.jpg'));

const metadata = {
  name: 'GM Robotiks IA', shortName: 'GM Robotiks', palette,
  tagline: 'Robots de servicio Pudu para México',
  alt: { full: 'GM Robotiks IA', mark: 'Monograma GM de GM Robotiks IA', micro: 'G de GM Robotiks IA' },
  source: 'src/assets/brand/source/gm-robotiks-approved.jpg',
  provenance: { chat: 'Mis Moragrega y C’s', pollQuestion: 'Cual les gusta mas', option: '1', votesAtVerification: 5, imageMessageId: '3BEE19B229F97BBAF008', pollMessageId: '3B91C73EBAA2CA252414' },
  method: 'Original geometry extracted from JPEG. Inks normalized to sampled navy/blue; background removed. SVG paths traced at native resolution with subpixel simplification.',
};
await writeFile(path.join(kit, 'brand.json'), `${JSON.stringify(metadata, null, 2)}\n`);

const tiles = exports.filter(([name]) => !name.includes('mono-white')).map(([name]) => `<article class="${name.endsWith('white') ? 'dark' : ''}"><div class="art"><img src="../../public/brand/${name}.svg" alt="${name}"/></div><h2>${name}</h2><a href="../../public/brand/${name}.svg">SVG</a> · <a href="../../public/brand/${name}.png">PNG</a></article>`).join('');
await writeFile(path.join(kit, 'preview.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>GM Robotiks IA — brand assets</title><style>body{margin:0;background:#eef3f7;color:#123559;font:16px system-ui}main{max-width:1140px;margin:0 auto;padding:48px 24px}h1{font-size:36px;margin:0 0 12px}p{line-height:1.6}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}article{padding:24px;border:1px solid #d6e1eb;border-radius:14px;background:white}article.dark{background:#123559;color:white}article.dark a{color:white}.art{height:180px;display:flex;align-items:center;justify-content:center}.art img{max-width:100%;max-height:160px}h2{font-size:16px;margin:24px 0 8px}a{color:#2a7abc}.icons{display:flex;align-items:center;gap:24px;flex-wrap:wrap;padding:28px;background:white;border-radius:14px}.social{width:100%;border-radius:14px}.swatch{display:inline-block;width:20px;height:20px;border-radius:4px;vertical-align:middle;margin-right:8px}.original{max-width:300px;width:100%}</style><main><h1>GM Robotiks IA</h1><p>Approved logo · Option 1 · Complete asset set</p><p><span class="swatch" style="background:#123559"></span>Navy #123559 &nbsp; <span class="swatch" style="background:#2a7abc"></span>Blue #2A7ABC</p><div class="grid">${tiles}</div><h2>Favicons at actual size + app icons</h2><div class="icons">${[16,32,48,64].map(s=>`<img src="../../public/favicon-${s}.png" width="${s}" height="${s}" alt="${s} pixel favicon">`).join('')}<img src="../../public/apple-touch-icon.png" width="90" height="90" alt="Apple touch icon"><img src="../../public/icon-512-maskable.png" width="110" height="110" style="border-radius:50%" alt="Circular mask preview"></div><h2>Social sharing · 1200 × 630</h2><img class="social" src="../../public/og-default.png" alt="Social sharing card"><h2>Approved source</h2><img class="original" src="approved-original.jpg" alt="Approved WhatsApp logo"></main></html>`);

const inventory = [];
for (const [name] of exports) for (const ext of ['png', 'svg']) inventory.push(`public/brand/${name}.${ext}`);
inventory.push(...iconSizes.map(size => `public/favicon-${size}.png`), 'public/favicon.ico', 'public/favicon.svg', 'public/icon-192.png', 'public/icon-512.png', 'public/icon-512-maskable.png', 'public/apple-touch-icon.png', 'public/brand/icon-1024.png', 'public/og-default.png');
await writeFile(path.join(kit, 'asset-manifest.json'), `${JSON.stringify(await Promise.all(inventory.map(async file => ({ file, bytes: (await stat(path.join(root, file))).size }))), null, 2)}\n`);

const reviewTiles = [
  ['logo-full', '#ffffff', 'Full logo · color'], ['logo-full-white', palette.navy, 'Full logo · white'],
  ['logo-mark', '#ffffff', 'GM monogram'], ['logo-mark-white', palette.navy, 'GM monogram · white'],
  ['logo-micro', '#ffffff', 'G favicon symbol'], ['wordmark', '#ffffff', 'Original wordmark'],
];
const reviewLayers = [];
for (let i = 0; i < reviewTiles.length; i++) {
  const [name, background, label] = reviewTiles[i];
  const rendered = await sharp(path.join(brand, `${name}.png`)).resize(520, 200, { fit: 'inside' }).png().toBuffer({ resolveWithObject: true });
  const caption = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="280"><text x="300" y="264" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" fill="${background === '#ffffff' ? palette.navy : '#ffffff'}">${label}</text></svg>`);
  const tile = await sharp({ create: { width: 600, height: 280, channels: 4, background } }).composite([{ input: rendered.data, left: Math.round((600 - rendered.info.width) / 2), top: Math.round((232 - rendered.info.height) / 2) }, { input: caption }]).png().toBuffer();
  reviewLayers.push({ input: tile, left: (i % 2) * 600, top: Math.floor(i / 2) * 280 });
}
await sharp({ create: { width: 1200, height: 840, channels: 4, background: '#ffffff' } }).composite(reviewLayers).png().toFile(path.join(kit, 'asset-review.png'));
console.log(`Built ${inventory.length} public assets, 9 optimized WebP files, and the review kit in output/brand-kit.`);
