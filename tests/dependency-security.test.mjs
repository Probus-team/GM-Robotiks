import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { test } from 'node:test';

const requireFromAstro = createRequire(import.meta.resolve('astro/package.json'));
const semver = requireFromAstro('semver');
const lock = readFileSync(new URL('../bun.lock', import.meta.url), 'utf8');

// Floors from the October 2026 advisories. Check nested copies as well as hoisted ones.
const patchedRanges = {
  devalue: '>=5.9.3',
  'http-cache-semantics': '>=4.3.0',
  sharp: '>=0.35.5',
  'smol-toml': '>=1.9.0',
  'source-map-js': '>=1.2.2',
  undici: '^6.28.1 || ^7.29.1 || >=8.10.2',
};

for (const [name, range] of Object.entries(patchedRanges)) {
  test(`all locked ${name} copies include the security fixes`, () => {
    const entries = [...lock.matchAll(/^\s*"([^"]+)": \["([^"@]+)@([^"]+)"/gm)]
      .filter(([, , packageName]) => packageName === name);
    for (const [, path, , version] of entries) {
      assert.ok(semver.satisfies(version, range), `${path}@${version} must satisfy ${range}`);
    }
  });
}

test('serializing a Node Buffer view does not disclose its backing buffer', async () => {
  const { stringify, parse } = await import(requireFromAstro.resolve('devalue'));
  const backing = Buffer.from([91, 92, 10, 20, 93, 94]);
  const view = backing.subarray(2, 4);
  const restored = parse(stringify(view));
  assert.deepEqual([...restored], [10, 20]);
  assert.deepEqual([...new Uint8Array(restored.buffer)], [10, 20]);
  assert.deepEqual(parse(stringify(Buffer.alloc(0))), new Uint8Array());
});
