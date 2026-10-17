// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://gmrobotiks.com',
  // Encoder quality per format lives in src/lib/image-service.ts, where it is
  // part of each image's cache key.
  image: {
    service: {
      entrypoint: './src/lib/image-service.ts',
      config: { webp: { smartSubsample: true } },
    },
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Bricolage Grotesque',
      cssVariable: '--font-display',
      weights: ['400 800'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Arial Narrow', 'Arial', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Figtree',
      cssVariable: '--font-body',
      weights: ['300 800'],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
    },
  ],
});
