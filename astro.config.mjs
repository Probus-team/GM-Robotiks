// @ts-check
import { defineConfig, fontProviders, sharpImageService } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://gmrobotiks.com',
  // Sharp defaults (AVIF 50, WebP 80) visibly soften the product renders and
  // band the dark gradients. Masters in src/assets are WebP q95, so these
  // settings decide what visitors see.
  image: {
    service: sharpImageService({
      avif: { quality: 70 },
      webp: { quality: 86, smartSubsample: true },
    }),
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
