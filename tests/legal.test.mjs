import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { legal, legalPages } from '../src/data/legal.ts';

const file = (path) => new URL(`../${path}`, import.meta.url);

// Meta's app settings link to these URLs; moving one breaks the WhatsApp app review.
test('the privacy, terms and data deletion pages keep their URLs', () => {
  assert.deepEqual(legalPages.map((p) => p.path), ['/privacidad/', '/terminos/', '/eliminacion-de-datos/']);
  for (const page of legalPages) {
    assert.ok(existsSync(file(`src/pages${page.path.replace(/\/$/, '')}.astro`)), page.path);
  }
});

test('the documents name the company, an address and a contact email, and are linked from the footer and sitemap', () => {
  assert.equal(legal.company, 'GM Robotiks IA');
  assert.match(legal.address, /Guadalajara, Jalisco/);
  assert.match(legal.email, /^[^@\s]+@gmrobotiks\.com$/);
  assert.match(readFileSync(file('src/components/Footer.astro'), 'utf8'), /legalPages/);
  assert.match(readFileSync(file('src/data/seo.ts'), 'utf8'), /\.\.\.legalPages/);
});
