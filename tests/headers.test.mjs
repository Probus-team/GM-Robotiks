import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
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

// Every HTML page the site builds, from src/pages itself rather than from the sitemap or the data files, so a
// page added without a sitemap entry (or outside the robot and legal lists) still has to get the header above.
// Endpoints (.ts: sitemap, robots.txt, llms.txt, social images) are not pages; 404.astro is served for missing
// paths rather than at a path of its own.
const pagesDir = new URL('../src/pages/', import.meta.url);
const builtPages = () => readdirSync(pagesDir, { recursive: true })
  .map((file) => String(file).replaceAll('\\', '/'))
  .filter((file) => file.endsWith('.astro') && file !== '404.astro')
  .flatMap((file) => {
    const route = file.replace(/\.astro$/, '').replace(/(^|\/)index$/, '');
    const url = route ? `/${route}/` : '/';
    if (!url.includes('[')) return [url];
    if (url === '/robots/[id]/') return robots.map((robot) => `/robots/${robot.id}/`);
    throw new Error(`${file}: a new dynamic page; list its paths in tests/headers.test.mjs`);
  });

test('every page in src/pages gets the five-minute header, listed in the sitemap or not', () => {
  const pages = builtPages();
  for (const path of ['/', '/robots/', '/privacidad/', '/terminos/', '/eliminacion-de-datos/', '/robots/et1/']) assert.ok(pages.includes(path), path);
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
