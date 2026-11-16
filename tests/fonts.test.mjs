import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

// Whenever the web fonts arrive late (a slow connection: Chrome waits about 0.1 s for preloaded fonts), the text
// is drawn in a fallback font first, so every fallback has to be sized to its web font, on the systems visitors
// have: Arial (Windows, macOS, iOS) and Roboto (Android). Otherwise the page moves when the web fonts arrive.
const config = readFileSync(new URL('../astro.config.mjs', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const faces = [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)].map(([, body]) => ({
  family: body.match(/font-family:\s*'([^']+)'/)?.[1],
  src: body.match(/src:\s*([^;]+);/)?.[1] ?? '',
  weight: body.match(/font-weight:\s*([^;]+);/)?.[1].trim(),
  sized: /size-adjust:/.test(body) && /ascent-override:/.test(body) && /descent-override:/.test(body),
}));

test('each web font falls back to a sized Arial face, then a sized Roboto face', () => {
  const lists = [...config.matchAll(/fallbacks:\s*\[([^\]]*)\]/g)].map(([, list]) => [...list.matchAll(/'([^']+)'/g)].map(([, name]) => name));
  assert.equal(lists.length, 2);
  for (const list of lists) {
    const sized = list.filter((name) => name.startsWith('GM '));
    assert.equal(sized.length, 2, list.join(', '));
    const [arial, roboto] = sized;
    assert.equal(roboto, `${arial} Android`);
    assert.ok(list.indexOf(roboto) === list.indexOf(arial) + 1, 'the Roboto face comes straight after the Arial one');
    for (const [family, local] of [[arial, /local\('Arial/], [roboto, /local\('Roboto/]]) {
      const own = faces.filter((face) => face.family === family);
      assert.equal(own.length, 2, `${family}: a regular and a bold face`);
      for (const face of own) {
        assert.match(face.src, local, family);
        assert.doesNotMatch(face.src, /url\(/, `${family} never downloads anything`);
        assert.ok(face.sized, `${family} ${face.weight} is sized`);
      }
    }
  }
});
