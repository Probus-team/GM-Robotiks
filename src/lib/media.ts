// Robot images go through astro:assets, so every <Picture> gets AVIF/WebP and a
// srcset. Sources and their provenance are listed in src/assets/robots/SOURCES.md.
import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import posterLandscape from '../assets/hero/poster-landscape.webp';
import posterPortrait from '../assets/hero/poster-portrait.webp';

const load = (modules: Record<string, ImageMetadata>) =>
  Object.fromEntries(
    Object.entries(modules).map(([path, image]) => [path.split('/').pop()!.replace(/\.\w+$/, ''), image]),
  );

const cutouts = load(import.meta.glob<ImageMetadata>('../assets/robots/*.webp', { eager: true, import: 'default' }));
const scenes = load(import.meta.glob<ImageMetadata>('../assets/scenes/*.webp', { eager: true, import: 'default' }));

/** Transparent product render, trimmed to the robot. Every catalog robot has one. */
export function robotCutout(id: string): ImageMetadata {
  const image = cutouts[id];
  if (!image) throw new Error(`Missing cut-out for robot "${id}" in src/assets/robots`);
  return image;
}

/** Manufacturer photo or render of the robot in context, when there is one. */
export function robotScene(id: string): ImageMetadata | undefined {
  return scenes[id];
}

export function scene(id: string): ImageMetadata {
  const image = scenes[id];
  if (!image) throw new Error(`Missing scene "${id}" in src/assets/scenes`);
  return image;
}

/**
 * AVIF and WebP srcsets for the home video poster, landscape and portrait. The
 * hero renders them and the home page preloads the AVIF one that matches.
 */
export async function heroPosters() {
  const [landAvif, landWebp, portAvif, portWebp] = await Promise.all([
    getImage({ src: posterLandscape, widths: [960, 1440, 1920], format: 'avif' }),
    getImage({ src: posterLandscape, widths: [960, 1440, 1920], format: 'webp' }),
    getImage({ src: posterPortrait, widths: [480, 720], format: 'avif' }),
    getImage({ src: posterPortrait, widths: [480, 720], format: 'webp' }),
  ]);
  return { sizes: '100vw', landAvif, landWebp, portAvif, portWebp };
}
