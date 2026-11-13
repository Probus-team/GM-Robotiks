import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../src/components/Showcase.astro', import.meta.url), 'utf8');
const script = stripTypeScriptTypes(source.match(/<script>([\s\S]*?)<\/script>/)[1]);

// hero: 'none' (no montage on the page), 'pending' (montage still loading), or the state Hero.astro
// announced before this script ran ('ready', 'slow').
function setup(reduce = false, { loaded = true, hero = 'none' } = {}) {
  const handlers = {};
  const on = (name, callback) => (handlers[name] ??= []).push(callback);
  const listeners = new Proxy({}, { get: (_, name) => (...args) => (handlers[name] ?? []).forEach((callback) => callback(...args)) });
  const observers = [];
  let frame;
  const classList = () => {
    const values = new Set();
    return {
      add: (name) => values.add(name),
      contains: (name) => values.has(name),
      toggle: (name, value) => value ? values.add(name) : values.delete(name),
    };
  };
  const videos = Array.from({ length: 3 }, (_, i) => ({
    dataset: { src: `/loop-${i}.mp4`, poster: `/loop-${i}.webp` }, paused: true, loads: 0,
    load() { this.loads++; },
    play() { this.paused = false; return Promise.resolve(); },
    pause() { this.paused = true; },
  }));
  const panels = Array.from({ length: 5 }, (_, i) => ({
    top: 1000 + i * 800,
    dataset: { panel: i === 4 ? 'all' : String(i) },
    classList: classList(),
    style: { setProperty() {} },
    querySelector: () => videos[i] ?? null,
    getBoundingClientRect() { return { top: this.top, bottom: this.top + 800, height: 800 }; },
  }));
  const railItems = panels.map((panel) => ({ dataset: { railItem: panel.dataset.panel }, classList: classList() }));
  const root = {
    querySelectorAll: (selector) => selector === '[data-panel]' ? panels : railItems,
    querySelector: () => ({ classList: classList() }),
  };
  const documentElement = { dataset: hero === 'ready' || hero === 'slow' ? { heroMontage: hero } : {} };
  const document = {
    hidden: false, documentElement, addEventListener: on,
    querySelector: (selector) => selector === '[data-hero-video]' ? (hero === 'none' ? null : {}) : root,
  };
  runInNewContext(script, {
    document,
    window: { innerHeight: 800, matchMedia: () => ({ matches: reduce }), addEventListener: on },
    requestAnimationFrame: (callback) => { frame = callback; return 1; },
    IntersectionObserver: class {
      constructor(callback) { this.callback = callback; observers.push(this); }
      observe() {}
      unobserve() {}
    },
  });
  if (loaded) listeners.load();
  const scroll = (tops) => {
    panels.forEach((panel, i) => panel.top = tops[i]);
    listeners.scroll();
    frame();
  };
  const announce = (state) => {
    documentElement.dataset.heroMontage = state;
    listeners['hero-montage']();
  };
  return { videos, panels, document, listeners, observers, railItems, scroll, announce, flush: () => frame() };
}

test('distant loops do not fetch; approaching loops preload without playing', () => {
  const state = setup();
  assert.ok(state.videos.every((video) => !video.src && video.loads === 0 && video.paused));
  state.observers[0].callback([{ target: state.videos[0], isIntersecting: true }]);
  assert.equal(state.videos[0].src, '/loop-0.mp4');
  assert.equal(state.videos[0].loads, 1);
  assert.equal(state.videos[0].paused, true);
  assert.equal(state.videos[1].src, undefined);
});

test('loops use the AV1 file only where the browser can decode it', () => {
  const state = setup();
  state.videos[0].dataset.srcAv1 = '/loop-0-av1.mp4';
  state.videos[0].canPlayType = (type) => type.includes('av01') ? 'probably' : '';
  state.videos[1].dataset.srcAv1 = '/loop-1-av1.mp4';
  state.videos[1].canPlayType = () => '';
  state.observers[0].callback([
    { target: state.videos[0], isIntersecting: true },
    { target: state.videos[1], isIntersecting: true },
  ]);
  assert.equal(state.videos[0].src, '/loop-0-av1.mp4');
  assert.equal(state.videos[1].src, '/loop-1.mp4');
});

test('visible transitions keep both loops running, covered loops pause, reverse scrolling resumes', () => {
  const state = setup();
  state.scroll([0, 800, 1600, 2400, 3200]);
  assert.deepEqual(state.videos.map((video) => video.paused), [false, true, true]);
  state.scroll([0, 360, 1160, 1960, 2760]);
  assert.deepEqual(state.videos.map((video) => video.paused), [false, false, true]);
  assert.equal(state.railItems[1].classList.contains('is-current'), true);
  state.scroll([0, 0, 800, 1600, 2400]);
  assert.deepEqual(state.videos.map((video) => video.paused), [true, false, true]);
  state.scroll([0, 440, 1240, 2040, 2840]);
  assert.deepEqual(state.videos.map((video) => video.paused), [false, false, true]);
  assert.equal(state.railItems[0].classList.contains('is-current'), true);
  assert.deepEqual(state.videos.map((video) => video.loads), [1, 1, 0]);
  state.scroll([-800, -800, -800, -800, -800]);
  assert.ok(state.videos.every((video) => video.paused));
});

test('covered and scrolled-away panels pause the still drift but keep their revealed text', () => {
  const state = setup();
  const offscreen = () => state.panels.map((panel) => panel.classList.contains('is-offscreen'));
  state.scroll([0, 800, 1600, 2400, 3200]);
  assert.deepEqual(offscreen(), [false, true, true, true, true]);
  state.scroll([0, 360, 1160, 1960, 2760]);
  assert.deepEqual(offscreen(), [false, false, true, true, true]);
  state.scroll([0, 0, 800, 1600, 2400]);
  assert.deepEqual(offscreen(), [true, false, true, true, true]);
  assert.equal(state.panels[0].classList.contains('is-active'), true);
  state.scroll([0, 440, 1240, 2040, 2840]);
  assert.deepEqual(offscreen(), [false, false, true, true, true]);
  state.scroll([-800, -800, -800, -800, -800]);
  assert.ok(offscreen().every(Boolean));
});

test('hidden tabs pause playback and visible tabs restore the exposed loop', () => {
  const state = setup();
  state.scroll([0, 800, 1600, 2400, 3200]);
  state.document.hidden = true;
  state.listeners.visibilitychange();
  assert.ok(state.videos.every((video) => video.paused));
  state.document.hidden = false;
  state.listeners.visibilitychange();
  state.flush();
  assert.equal(state.videos[0].paused, false);
});

test('reduced motion reveals panel content and posters without downloading or playing loops', () => {
  const state = setup(true);
  state.observers[0].callback([{ target: state.videos[1], isIntersecting: true }]);
  state.scroll([0, 800, 1600, 2400, 3200]);
  assert.equal(state.panels[0].classList.contains('is-active'), true);
  assert.equal(state.videos[0].poster, '/loop-0.webp');
  assert.equal(state.videos[1].poster, '/loop-1.webp');
  assert.ok(state.videos.every((video) => !video.src && video.paused));
});

test('nothing in the showcase downloads before the page has loaded', () => {
  const state = setup(false, { loaded: false });
  assert.equal(state.observers.length, 0);
  assert.ok(state.videos.every((video) => !video.src && !video.poster));
  state.listeners.load();
  assert.equal(state.observers.length, 1);
});

test('a loop within reach waits for the hero montage, and gets its poster meanwhile', () => {
  const state = setup(false, { hero: 'pending' });
  state.observers[0].callback([{ target: state.videos[0], isIntersecting: true }]);
  assert.equal(state.videos[0].poster, '/loop-0.webp');
  assert.equal(state.videos[0].src, undefined);
  state.announce('ready');
  assert.equal(state.videos[0].src, '/loop-0.mp4');
  assert.equal(state.videos[0].loads, 1);
  assert.equal(state.videos[1].src, undefined);
});

test('a montage on a slow connection does not release the loops; the first scroll does', () => {
  const state = setup(false, { hero: 'pending' });
  state.observers[0].callback([{ target: state.videos[0], isIntersecting: true }]);
  state.announce('slow');
  assert.equal(state.videos[0].src, undefined);
  state.scroll([900, 1700, 2500, 3300, 4100]);
  assert.equal(state.videos[0].src, '/loop-0.mp4');
  assert.equal(state.videos[0].paused, true);
});

test('a montage that was ready before the showcase script ran does not hold the loops', () => {
  const state = setup(false, { hero: 'ready' });
  state.observers[0].callback([{ target: state.videos[0], isIntersecting: true }]);
  assert.equal(state.videos[0].src, '/loop-0.mp4');
});
