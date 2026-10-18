import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { test } from 'node:test';

const requireFromAstro = createRequire(import.meta.resolve('astro/package.json'));
const semver = requireFromAstro('semver');
const lock = readFileSync(new URL('../bun.lock', import.meta.url), 'utf8');

// Floors from the October 2026 advisories. Check nested copies as well as hoisted ones.
const patchedRanges = {
  // GHSA-mpr7-6m5w-76rw and GHSA-98hj-9722-w3j8.
  astro: '>=7.3.3',
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

const astroPackage = import.meta.resolve('astro/package.json');
const { stringifyAnimation } = await import(new URL('dist/runtime/server/transition.js', astroPackage));
const { renderJSX } = await import(new URL('dist/runtime/server/jsx.js', astroPackage));
const { jsx } = await import('astro/jsx-runtime');

test('transition animation properties cannot inject CSS rules', () => {
  for (const property of ['name', 'duration', 'delay', 'easing', 'direction', 'fillMode']) {
    const css = stringifyAnimation({ name: 'fade', [property]: '1ms;}#injected{color:red' });
    assert.ok(!css.includes(';}#injected{'), `${property} must contain CSS delimiters`);
    assert.ok(css.includes('\\3B \\7D #injected\\7B color:red'));
  }
});

test('transition animations preserve CSS functions, numeric durations, and multiple animations', () => {
  const duration = 'calc(1s + var(--transition-delay, 200ms))';
  const css = stringifyAnimation([{ name: 'fade', duration }, { name: 'slide', duration: 125 }]);
  assert.ok(css.includes(`animation-duration: ${duration}, 125ms;`));
  assert.ok(css.includes('animation-name: fade, slide;'));
});

for (const tag of ['script', 'style']) {
  test(`dynamic JSX ${tag} children cannot terminate their element`, async () => {
    const payload = `</${tag}><script id="injected">alert(1)</script>`;
    const html = String(await renderJSX({}, jsx(tag, { children: payload })));
    assert.ok(!html.includes('<script id="injected">'));
    assert.equal(html.split(`</${tag}>`).length - 1, 1);
    assert.equal(String(await renderJSX({}, jsx(tag, { children: '' }))), `<${tag}></${tag}>`);
    const trusted = tag === 'script' ? 'console.log("trusted")' : 'p::before { content: "trusted"; }';
    assert.equal(
      String(await renderJSX({}, jsx(tag, { 'set:html': trusted }))),
      `<${tag}>${trusted}</${tag}>`,
    );
  });
}
