import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { test } from 'node:test';

const requireFromAstro = createRequire(import.meta.resolve('astro/package.json'));
const semver = requireFromAstro('semver');
const lock = readFileSync(new URL('../bun.lock', import.meta.url), 'utf8');

// Check nested copies as well as hoisted ones, including Miniflare tooling.
const patchedRanges = {
  // GHSA-mpr7-6m5w-76rw and GHSA-98hj-9722-w3j8.
  astro: '>=7.3.3',
  devalue: '>=5.9.3',
  'http-cache-semantics': '>=4.3.0',
  sharp: '>=0.35.5',
  'smol-toml': '>=1.9.0',
  'source-map-js': '>=1.2.2',
  undici: '^6.28.1 || ^7.30.1 || >=8.12.2',
  // October 2026 Vite dev-server and Zod resource-exhaustion advisories.
  vite: '~8.2.4 || >=8.3.3',
  zod: '>=4.6.6',
};

for (const [name, range] of Object.entries(patchedRanges)) {
  test(`all locked ${name} copies meet the recorded security floor`, () => {
    const entries = [...lock.matchAll(/^\s*"([^"]+)": \["([^"@]+)@([^"]+)"/gm)]
      .filter(([, , packageName]) => packageName === name);
    assert.ok(entries.length > 0, `${name} must be present in the lockfile`);
    for (const [, path, , version] of entries) {
      assert.ok(semver.satisfies(version, range), `${path}@${version} must satisfy ${range}`);
    }
  });
}

test('font downloads use Undici with the October integrity and denial-of-service fixes', () => {
  const entries = [...lock.matchAll(/^\s*"([^"]+)": \["undici@([^"]+)"/gm)]
    .filter(([, , version]) => semver.major(version) === 8);
  assert.ok(entries.length > 0, 'the font downloader must retain its Undici dependency');
  for (const [, path, version] of entries) {
    assert.ok(semver.satisfies(version, '^8.12.2'), `${path}@${version} must satisfy ^8.12.2`);
  }
});

const requireFromWrangler = createRequire(import.meta.resolve('wrangler/package.json'));
for (const [name, requireFromOwner] of [
  ['font fetches', createRequire(requireFromAstro.resolve('unifont'))],
  ['Miniflare fetches', createRequire(requireFromWrangler.resolve('miniflare'))],
]) {
  test(`${name} verify uppercase and mixed-case integrity tokens without accepting tampered content`, async () => {
    const { fetch } = await import(requireFromOwner.resolve('undici'));
    const digest = createHash('sha256').update('trusted').digest('base64');
    for (const algorithm of ['sha256', 'SHA256', 'Sha256']) {
      const integrity = `${algorithm}-${digest}`;
      assert.equal(await (await fetch('data:,trusted', { integrity })).text(), 'trusted');
      await assert.rejects(fetch('data:,tampered', { integrity }), /fetch failed/);
    }
    assert.equal(await (await fetch('data:,unpinned')).text(), 'unpinned');
  });
}

test('Vite rejects protocol-relative script injection during HTML transformation', async (t) => {
  const { createServer } = await import(requireFromAstro.resolve('vite'));
  const server = await createServer({
    configFile: false,
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, watch: null },
  });
  t.after(() => server.close());
  const html = '<script type="module">console.log("trusted")</script>';
  const transformed = await server.transformIndexHtml('//evil.example/payload.js?/../../package.json', html);
  assert.ok(!transformed.includes('src="//evil.example/'), transformed);
  const normal = await server.transformIndexHtml('/index.html', html);
  assert.ok(normal.includes('type="module"'));
  assert.ok(!normal.includes('evil.example'));
});

for (const [kind, schema, container] of [
  ['array', (z, element) => z.array(element).max(1), (items) => items],
  ['set', (z, element) => z.set(element).max(1), (items) => new Set(items)],
  ['map', (z, element) => z.map(z.string(), element).max(1),
    (items) => new Map(items.map((value, index) => [String(index), value]))],
]) {
  test(`Zod rejects an oversized ${kind} before parsing its elements`, async () => {
    const { z } = await import(requireFromAstro.resolve('zod'));
    let parsed = 0;
    const bounded = schema(z, z.preprocess((value) => { parsed++; return value; }, z.number()));
    const oversized = bounded.safeParse(container([1, 2]));
    assert.equal(oversized.success, false);
    assert.equal(oversized.error.issues[0].code, 'too_big');
    assert.equal(parsed, 0, 'oversized collections must not allocate per-element validation results');
    assert.equal(bounded.safeParse(container([])).success, true);
    assert.equal(bounded.safeParse(container([1])).success, true);
    assert.equal(parsed, 1);
    assert.equal(bounded.safeParse(container(['invalid'])).success, false);
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

// Bundled packages are invisible to lockfile audits. Check the published bundle
// markers as well, using the fixed versions recorded in Wrangler 4.158.0.
const bundledSources = [
  readFileSync(new URL('wrangler-dist/cli.js', import.meta.resolve('wrangler/package.json')), 'utf8'),
  readFileSync(requireFromWrangler.resolve('miniflare'), 'utf8'),
];
for (const [name, range] of Object.entries({
  'brace-expansion': '^2.1.7 || >=5.0.12',
  minimatch: '^5.1.9 || >=10.2.5',
  'fast-xml-parser': '>=4.5.5',
  'shell-quote': '>=1.11.0',
  yaml: '>=2.8.3',
})) {
  test(`Wrangler and Miniflare bundle patched ${name} copies`, () => {
    const versions = bundledSources.flatMap((source) =>
      [...source.matchAll(new RegExp(`${name}@([0-9]+\\.[0-9]+\\.[0-9]+)`, 'g'))]
        .map((match) => match[1]));
    assert.ok(versions.length > 0, `${name} must be identifiable in the published bundles`);
    for (const version of versions) {
      assert.ok(semver.satisfies(version, range), `${name}@${version} must satisfy ${range}`);
    }
  });
}
