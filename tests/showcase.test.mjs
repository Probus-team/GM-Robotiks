import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../src/components/Showcase.astro', import.meta.url), 'utf8');
const script = stripTypeScriptTypes(source.match(/<script>([\s\S]*?)<\/script>/)[1]);

function setup(reduce = false) {
  const listeners = {};
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
    dataset: { src: `/loop-${i}.mp4` }, paused: true, loads: 0,
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
  const document = { hidden: false, querySelector: () => root, addEventListener: (name, callback) => listeners[name] = callback };
  runInNewContext(script, {
    document,
    window: { innerHeight: 800, matchMedia: () => ({ matches: reduce }), addEventListener: (name, callback) => listeners[name] = callback },
    requestAnimationFrame: (callback) => { frame = callback; return 1; },
    IntersectionObserver: class {
      constructor(callback) { this.callback = callback; observers.push(this); }
      observe() {}
      unobserve() {}
    },
  });
  const scroll = (tops) => {
    panels.forEach((panel, i) => panel.top = tops[i]);
    listeners.scroll();
    frame();
  };
  return { videos, panels, document, listeners, observers, railItems, scroll, flush: () => frame() };
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

test('reduced motion reveals panel content without downloading or playing loops', () => {
  const state = setup(true);
  state.scroll([0, 800, 1600, 2400, 3200]);
  assert.equal(state.panels[0].classList.contains('is-active'), true);
  assert.equal(state.observers.length, 0);
  assert.ok(state.videos.every((video) => !video.src && video.paused));
});
