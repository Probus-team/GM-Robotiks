import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import service, { formatQuality } from '../src/lib/image-service.ts';

const src = { src: '/robot.webp', width: 1200, height: 900, format: 'webp' };

test('each output format gets its own quality inside the transform, so it is part of the cache key', async () => {
  assert.deepEqual(formatQuality, { avif: 70, webp: 86 });
  assert.equal((await service.validateOptions({ src, format: 'avif' }, {})).quality, 70);
  assert.equal((await service.validateOptions({ src, format: 'webp' }, {})).quality, 86);
  assert.equal((await service.validateOptions({ src, format: 'avif', quality: 40 }, {})).quality, 40);
  // Without its own list, Astro hashes its defaults, which include quality.
  assert.ok(!service.propertiesToHash || service.propertiesToHash.includes('quality'));
});

test('astro.config.mjs uses this service', () => {
  const config = readFileSync(new URL('../astro.config.mjs', import.meta.url), 'utf8');
  assert.match(config, /entrypoint: '\.\/src\/lib\/image-service\.ts'/);
});
