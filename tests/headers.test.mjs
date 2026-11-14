import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { robots } from '../src/data/robots.ts';
import { legalPages } from '../src/data/legal.ts';

// public/_headers as Cloudflare reads it: a path line, then indented "Name: value" lines.
const rules = [];
for (const line of readFileSync(new URL('../public/_headers', import.meta.url), 'utf8').split('\n')) {
  if (!line.trim() || line.startsWith('#')) continue;
  if (/^\s/.test(line)) {
    const [name, ...value] = line.trim().split(':');
    rules.at(-1).headers[name.toLowerCase()] = value.join(':').trim();
  } else rules.push({ path: line.trim(), headers: {} });
}
const cacheControl = (path) => rules
  .filter((rule) => rule.path.startsWith('/') && new RegExp(`^${rule.path.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`).test(path))
  .map((rule) => rule.headers['cache-control']).filter(Boolean);

test('every page may be reused by the browser for five minutes, and by nothing longer', () => {
  const pages = ['/', '/robots/', ...robots.map((robot) => `/robots/${robot.id}/`), ...legalPages.map((page) => page.path)];
  for (const page of pages) assert.deepEqual(cacheControl(page), ['public, max-age=300, must-revalidate'], page);
});

test('files that search engines and assistants poll are checked on every request', () => {
  for (const path of ['/sitemap.xml', '/robots.txt', '/llms.txt', '/site.webmanifest']) assert.deepEqual(cacheControl(path), [], path);
});

test('no path gets two Cache-Control values (Cloudflare would join them with a comma)', () => {
  for (const path of ['/', '/robots/et1/', '/_astro/x.css', '/media/hero/x.mp4', '/brand/logo-full.png', '/favicon-32.png', '/favicon.ico', '/icon-192.png', '/apple-touch-icon.png']) {
    assert.ok(cacheControl(path).length <= 1, path);
  }
});
