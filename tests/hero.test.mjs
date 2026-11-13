import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../src/components/Hero.astro', import.meta.url), 'utf8');
const script = stripTypeScriptTypes(source.match(/<script>([\s\S]*?)<\/script>/)[1]);

const POSTER = 'https://gmrobotiks.com/_astro/poster.avif';
// A poster of 66 kB whose body took `ms` to arrive: 528 kbit / ms.
const posterEntry = (ms) => ({ transferSize: 66_300, encodedBodySize: 66_000, responseStart: 200, responseEnd: 200 + ms });

function setup({
  reduce = false, portrait = false, loaded = true, hash = '', scrollY = 0, width = 1254, dpr = 1,
  av1 = true, entry = posterEntry(20), connection, stored,
} = {}) {
  const handlers = {};
  const on = (name, callback) => (handlers[name] ??= []).push(callback);
  const fire = (name) => (handlers[name] ?? []).forEach((callback) => callback());
  const timers = [];
  const observers = [];
  const storage = new Map(stored ? [['hero-video-tier', stored]] : []);
  const classes = new Set();
  const videoEvents = {};
  const video = {
    dataset: { portrait: '/media/hero/montage-portrait', landscape: '/media/hero/montage-landscape' },
    clientWidth: width, paused: true, currentTime: 0, plays: 0,
    classList: { add: (name) => classes.add(name), contains: (name) => classes.has(name) },
    canPlayType: (type) => (av1 && type.includes('av01') ? 'probably' : ''),
    addEventListener: (name, callback) => (videoEvents[name] ??= []).push(callback),
    emit: (name) => (videoEvents[name] ?? []).forEach((callback) => callback()),
    play() { this.plays++; this.paused = false; return Promise.resolve(); },
    pause() { this.paused = true; },
  };
  const toggle = { hidden: true, attributes: {}, setAttribute(name, value) { this.attributes[name] = value; }, addEventListener: (name, callback) => (toggle.click = callback) };
  const toggleLabel = { textContent: 'Pausar video' };
  const elements = {
    '[data-hero-video]': video, '[data-hero-poster]': { currentSrc: POSTER }, '[data-hero-toggle]': toggle,
    '[data-toggle-label]': toggleLabel, '[data-shots]': { textContent: '[{"at":0,"robot":"a","label":"A","where":"x"}]' },
  };
  const documentElement = { dataset: {} };
  const document = {
    hidden: false, readyState: loaded ? 'complete' : 'loading', documentElement, addEventListener: on,
    querySelector: (selector) => elements[selector] ?? null, querySelectorAll: () => [],
  };
  class IntersectionObserver {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe() {}
  }
  const window = {
    IntersectionObserver,
    scrollY, devicePixelRatio: dpr, addEventListener: on, dispatchEvent: (event) => fire(event.type),
    matchMedia: (query) => ({ matches: query.includes('reduced-motion') ? reduce : query.includes('aspect-ratio') ? portrait : false }),
    setTimeout: (callback, ms) => timers.push({ callback, ms }),
  };
  runInNewContext(script, {
    document, window, location: { hash }, navigator: { connection },
    performance: { getEntriesByName: (name) => (name === POSTER && entry ? [entry] : []) },
    localStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    clearTimeout: () => {}, Event: class { constructor(type) { this.type = type; } },
    IntersectionObserver,
  });
  const see = (isIntersecting = true) => observers[0].callback([{ isIntersecting }]);
  return { video, toggle, toggleLabel, timers, storage, documentElement, window, see, load: () => fire('load'), classes };
}

test('nothing is attached before the page has loaded', () => {
  const state = setup({ loaded: false });
  state.see();
  assert.equal(state.video.src, undefined);
  state.load();
  assert.equal(state.video.src, '/media/hero/montage-landscape-720-av1.mp4');
  assert.equal(state.video.plays, 1);
});

test('a page opened at the top starts the montage at once; one opened at an anchor waits for the hero to stay on screen', () => {
  const top = setup();
  top.see();
  assert.equal(top.timers.length, 0);
  assert.ok(top.video.src);

  const anchored = setup({ hash: '#contacto' });
  anchored.see();
  assert.equal(anchored.video.src, undefined);
  assert.equal(anchored.timers[0].ms, 600);
  anchored.timers[0].callback();
  assert.ok(anchored.video.src);

  // Still scrolling when the moment is up (a slow device): wait again, from where the page is now.
  const scrolling = setup({ hash: '#contacto' });
  scrolling.see();
  scrolling.window.scrollY = 300;
  scrolling.timers[0].callback();
  assert.equal(scrolling.video.src, undefined);
  assert.equal(scrolling.timers.length, 2);
  scrolling.timers[1].callback();
  assert.ok(scrolling.video.src);

  const gone = setup({ hash: '#contacto' });
  gone.see();
  gone.see(false);
  gone.timers[0].callback();
  assert.equal(gone.video.src, undefined);
});

test('the screen picks the size and the browser the codec', () => {
  const src = (options) => { const state = setup(options); state.see(); return state.video.src; };
  assert.equal(src({ width: 1254, dpr: 1 }), '/media/hero/montage-landscape-720-av1.mp4');
  assert.equal(src({ width: 1254, dpr: 2 }), '/media/hero/montage-landscape-av1.mp4');
  assert.equal(src({ width: 1894, dpr: 1 }), '/media/hero/montage-landscape-av1.mp4');
  assert.equal(src({ width: 1894, dpr: 1, av1: false }), '/media/hero/montage-landscape-h264.mp4');
  assert.equal(src({ portrait: true, width: 380, dpr: 3 }), '/media/hero/montage-portrait-av1.mp4');
});

test('the connection caps the bitrate, measured on the poster that was just downloaded', () => {
  const src = (options) => { const state = setup(options); state.see(); return state.video.src; };
  // 66 kB in 20 ms is 26 Mbps; in 150 ms, 3.5 Mbps; in 800 ms, 0.66 Mbps.
  assert.equal(src({ width: 1894, entry: posterEntry(20) }), '/media/hero/montage-landscape-av1.mp4');
  assert.equal(src({ width: 1894, entry: posterEntry(150) }), '/media/hero/montage-landscape-720-av1.mp4');
  assert.equal(src({ width: 1894, entry: posterEntry(800) }), '/media/hero/montage-landscape-lite-av1.mp4');
  assert.equal(src({ portrait: true, entry: posterEntry(150) }), '/media/hero/montage-portrait-av1.mp4');
  assert.equal(src({ portrait: true, entry: posterEntry(800) }), '/media/hero/montage-portrait-lite-av1.mp4');
  assert.equal(src({ width: 1894, connection: { effectiveType: '3g' } }), '/media/hero/montage-landscape-lite-av1.mp4');
});

test('a poster from the cache says nothing about the connection: the last measurement is used', () => {
  const cached = { transferSize: 0, encodedBodySize: 66_000, responseStart: 5, responseEnd: 6 };
  const first = setup({ width: 1894, entry: posterEntry(800) });
  first.see();
  assert.equal(first.storage.get('hero-video-tier'), 'lite');
  const again = setup({ width: 1894, entry: cached, stored: 'lite' });
  again.see();
  assert.equal(again.video.src, '/media/hero/montage-landscape-lite-av1.mp4');
  const unknown = setup({ width: 1894, entry: cached });
  unknown.see();
  assert.equal(unknown.video.src, '/media/hero/montage-landscape-av1.mp4');
});

test('too slow for any rendition, or data saver: the montage waits for the play button and then takes the smallest file', () => {
  for (const options of [{ entry: posterEntry(2000) }, { connection: { saveData: true } }, { connection: { effectiveType: '2g' } }]) {
    const state = setup({ width: 1894, ...options });
    state.see();
    assert.equal(state.video.src, undefined);
    assert.equal(state.toggle.hidden, false);
    assert.equal(state.toggle.attributes['aria-pressed'], 'true');
    assert.equal(state.toggleLabel.textContent, 'Reproducir video');
    assert.equal(state.documentElement.dataset.heroMontage, 'slow');
    state.toggle.click();
    assert.equal(state.video.src, '/media/hero/montage-landscape-lite-av1.mp4');
    assert.equal(state.video.plays, 1);
  }
});

test('reduced motion never downloads the montage and shows no button', () => {
  const state = setup({ reduce: true });
  state.see();
  assert.equal(state.video.src, undefined);
  assert.equal(state.toggle.hidden, true);
  assert.equal(state.documentElement.dataset.heroMontage, 'slow');
});

test('the showcase is told when the montage has what it needs, and whether the connection is slow', () => {
  const fast = setup();
  fast.see();
  assert.equal(fast.documentElement.dataset.heroMontage, undefined);
  fast.video.emit('canplaythrough');
  assert.equal(fast.documentElement.dataset.heroMontage, 'ready');

  const slow = setup({ entry: posterEntry(800) });
  slow.see();
  slow.video.emit('canplaythrough');
  assert.equal(slow.documentElement.dataset.heroMontage, 'slow');
});

test('the video is shown once it is playing, and pauses when the hero leaves the screen', () => {
  const state = setup();
  state.see();
  assert.equal(state.classes.has('is-playing'), false);
  state.video.emit('playing');
  assert.equal(state.classes.has('is-playing'), true);
  state.see(false);
  assert.equal(state.video.paused, true);
  state.see();
  assert.equal(state.video.paused, false);
});
