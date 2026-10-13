// Robot images go through astro:assets, so every <Picture> gets AVIF/WebP and a
// srcset. Sources and their provenance are listed in src/assets/robots/SOURCES.md.
import type { ImageMetadata } from 'astro';

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
