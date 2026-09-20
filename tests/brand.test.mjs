import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import sharp from 'sharp';

const file = (name) => new URL(`../${name}`, import.meta.url);
const source = file('src/assets/brand/source/gm-robotiks-approved.png');
const decode = (input) => sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

test('the master is the exact supplied transparent artwork', async () => {
  const bytes = await readFile(source);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), 'cd9196528f86c7c30a75db762a3cd25c88188d5f8c08e8cbc31a1b7721fb3ff9');
});

test('full logo and robot-only mark preserve gradients and transparent eyes', async () => {
  const full = await decode(await readFile(file('public/brand/logo-full.png')));
  const mark = await decode(await readFile(file('public/brand/logo-mark.png')));
  assert.ok(full.info.width / full.info.height > 3, 'new horizontal lockup');
  assert.ok(mark.info.width / mark.info.height > 1 && mark.info.width / mark.info.height < 1.2, 'robot emblem, without letters');
  const colors = new Set();
  for (let i = 0; i < mark.data.length; i += 4) if (mark.data[i + 3] > 220) colors.add(mark.data.subarray(i, i + 3).toString('hex'));
  assert.ok(colors.size > 1000, 'preserve the supplied blue and cyan gradients');
  assert.equal(mark.data[3], 0, 'transparent outer margin');
  // Left eye center, relative to the documented crop at (70, 198).
  assert.equal(mark.data[((480 - 198) * mark.info.width + 410 - 70) * 4 + 3], 0);
});

test('dark-background lockup keeps the color emblem and makes lettering white', async () => {
  const color = await decode(await readFile(file('public/brand/logo-full.png')));
  const white = await decode(await readFile(file('public/brand/logo-full-white.png')));
  assert.deepEqual(white.info, color.info);
  for (const [x, y, kind] of [[450, 250, 'emblem'], [900, 300, 'letter']]) {
    const offset = ((y - 198) * color.info.width + x - 70) * 4;
    if (kind === 'emblem') assert.deepEqual(white.data.subarray(offset, offset + 4), color.data.subarray(offset, offset + 4));
    else {
      assert.ok(color.data[offset + 3] > 220);
      assert.deepEqual([...white.data.subarray(offset, offset + 4)], [255, 255, 255, color.data[offset + 3]]);
    }
  }
});

test('icons have all required sizes and OS-masked tiles are fully opaque', async () => {
  for (const [name, size] of [['apple-touch-icon', 180], ['icon-192', 192], ['icon-512', 512], ['icon-512-maskable', 512], ...[16,32,48,64,128,256].map(size => [`favicon-${size}`, size])]) {
    const { data, info } = await decode(await readFile(file(`public/${name}.png`)));
    assert.equal(info.width, size); assert.equal(info.height, size);
    if (['apple-touch-icon', 'icon-512-maskable'].includes(name)) {
      for (let i = 3; i < data.length; i += 4) assert.equal(data[i], 255);
    }
    if (name === 'icon-512-maskable') {
      // Every non-background pixel must remain within the circular safe zone.
      for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) assert.ok(Math.hypot(x - 255.5, y - 255.5) < size * 0.4);
      }
    }
  }
  const ico = await readFile(file('public/favicon.ico'));
  assert.equal(ico.readUInt16LE(2), 1);
  assert.equal(ico.readUInt16LE(4), 6);
  for (let i = 0; i < 6; i++) {
    const start = 6 + i * 16, length = ico.readUInt32LE(start + 8), offset = ico.readUInt32LE(start + 12);
    const png = await sharp(ico.subarray(offset, offset + length)).metadata();
    assert.equal(png.width, ico[start] || 256);
  }
});

test('extraction rejects wrong source dimensions, opaque sources, and out-of-bounds crops', async () => {
  const { extractArtwork } = await import('../scripts/brand-artwork.mjs');
  assert.throws(() => extractArtwork(Buffer.alloc(4), { width: 1, height: 1, channels: 4 }, [0, 0, 1, 1]), /dimensions/i);
  assert.throws(() => extractArtwork(Buffer.alloc(0), { width: 1774, height: 887, channels: 3 }, [0, 0, 1, 1]), /alpha/i);
  assert.throws(() => extractArtwork(Buffer.alloc(1774 * 887 * 4, 255), { width: 1774, height: 887, channels: 4 }, [0, 0, 1, 1]), /transparen/i);
  const { data, info } = await decode(await readFile(source));
  assert.throws(() => extractArtwork(data, info, [1700, 0, 100, 100]), /crop/i);
  assert.throws(() => extractArtwork(data, info, [0, 0, 0, 100]), /crop/i);
});

test('extraction removes near-invisible fringe without quantizing visible color', async () => {
  const { extractArtwork } = await import('../scripts/brand-artwork.mjs');
  const data = Buffer.alloc(1774 * 887 * 4);
  data.set([12, 100, 230, 8, 30, 150, 240, 128, 50, 180, 250, 255], 4);
  const result = extractArtwork(data, { width: 1774, height: 887, channels: 4 }, [1, 0, 3, 1]);
  assert.deepEqual([...result.rgba], [0, 0, 0, 0, 30, 150, 240, 128, 50, 180, 250, 255]);
});

test('every SVG export renders, mono exports are paths, and metadata describes the new master', async () => {
  const inventory = JSON.parse(await readFile(file('output/brand-kit/asset-manifest.json'), 'utf8'));
  for (const { file: name, bytes } of inventory) {
    const buffer = await readFile(file(name));
    assert.equal(buffer.length, bytes, name);
    if (name.endsWith('.svg')) assert.ok((await sharp(buffer).png().toBuffer()).length > 100);
  }
  const mono = await readFile(file('public/brand/logo-mark-mono.svg'), 'utf8');
  assert.match(mono, /<path/); assert.doesNotMatch(mono, /<image/);
  const metadata = JSON.parse(await readFile(file('output/brand-kit/brand.json'), 'utf8'));
  assert.equal(metadata.source, 'src/assets/brand/source/gm-robotiks-approved.png');
  assert.match(metadata.alt.mark, /robot/i);
});
