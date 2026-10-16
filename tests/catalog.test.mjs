import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { cases, families, robots } from '../src/data/robots.ts';
import { panels } from '../src/data/showcase.ts';
import { robotQuoteMessage, robotQuoteUrl } from '../src/lib/whatsapp.ts';

const file = (path) => new URL(`../${path}`, import.meta.url);

test('every robot has a unique, URL-safe id and a known line', () => {
  const ids = robots.map((r) => r.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const robot of robots) {
    assert.match(robot.id, /^[a-z0-9-]+$/, robot.id);
    assert.ok(families.some((f) => f.id === robot.family), robot.id);
  }
});

test('every robot page has three headline figures, use cases and a cut-out', () => {
  for (const robot of robots) {
    assert.equal(robot.keyFigures.length, 3, robot.id);
    for (const figure of robot.keyFigures) assert.ok(figure.value && figure.label, robot.id);
    assert.ok(robot.useCases.length >= 3, robot.id);
    assert.ok(existsSync(file(`src/assets/robots/${robot.id}.webp`)), `missing cut-out for ${robot.id}`);
  }
});

test('BG1 Pro no longer reuses the BG1 image', () => {
  const bg1 = readFileSync(file('src/assets/robots/bg1.webp'));
  const bg1Pro = readFileSync(file('src/assets/robots/bg1-pro.webp'));
  assert.notDeepEqual(bg1, bg1Pro);
});

test('case videos linked from robot pages exist, and each says where it was shot', () => {
  for (const robot of robots.filter((r) => r.caseId)) {
    assert.ok(cases.some((c) => c.id === robot.caseId), `${robot.id} → ${robot.caseId}`);
  }
  for (const clip of cases) {
    assert.ok(['deployment', 'promo'].includes(clip.kind), clip.id);
    assert.ok(existsSync(file(`public${clip.src}`)), clip.src);
    assert.ok(existsSync(file(`public${clip.poster}`)), clip.poster);
  }
});

test('downloadable spec sheets exist', () => {
  for (const robot of robots.filter((r) => r.doc)) assert.ok(existsSync(file(`public${robot.doc}`)), robot.doc);
});

test('"Cotizar" opens WhatsApp with a message written for that robot', () => {
  const robot = robots.find((r) => r.id === 'et1');
  const page = 'https://gmrobotiks.com/robots/et1/';
  const message = robotQuoteMessage(robot, page);
  assert.match(message, /PUDU ET1/);
  // Acronyms keep their case inside the sentence.
  assert.match(message, /\(fregadora-secadora compacta con IA\)/);
  assert.match(robotQuoteMessage(robots.find((r) => r.id === 't600'), page), /\(AMR de carga pesada\)/);
  assert.ok(message.endsWith(page));
  const url = new URL(robotQuoteUrl('523319566711', robot, page));
  assert.equal(url.origin + url.pathname, 'https://wa.me/523319566711');
  assert.equal(url.searchParams.get('text'), message);
});

test('home videos come in AV1 and H.264, each within the 5 MB budget, with posters', () => {
  const videos = ['landscape', 'portrait'].flatMap((o) => ['av1', 'h264'].map((c) => `public/media/hero/montage-${o}-${c}.mp4`));
  for (const panel of panels) {
    if (panel.media.type !== 'video') continue;
    videos.push(`public${panel.media.src}`, `public${panel.media.av1}`);
    assert.ok(existsSync(file(`public${panel.media.poster}`)), panel.media.poster);
  }
  assert.equal(videos.length, 10);
  for (const path of videos) {
    assert.ok(existsSync(file(path)), path);
    const size = readFileSync(file(path)).length;
    assert.ok(size < 5_000_000, `${path} is ${size} bytes`);
  }
  for (const name of ['poster-landscape.webp', 'poster-portrait.webp']) {
    assert.ok(existsSync(file(`src/assets/hero/${name}`)), name);
  }
});
