// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://gmrobotiks.com',
  // Every page's CSS is 2 to 8 kB compressed. As <style> it arrives with the
  // document; as a stylesheet it cost one more round trip before first paint.
  build: { inlineStylesheets: 'always' },
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
      // The stand-in while the font loads is ours (global.css, "Fallbacks for the
      // web fonts"). Astro's generated one measured the latin-ext file and came
      // out a third too large (size-adjust 132.6% where the text needs 101%).
      optimizedFallbacks: false,
      fallbacks: ['GM Display Fallback', 'Arial Narrow', 'Arial', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Figtree',
      cssVariable: '--font-body',
      weights: ['300 800'],
      // No italic: the only <em> and <cite> on the site are styled upright.
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      optimizedFallbacks: false,
      fallbacks: ['GM Body Fallback', 'Helvetica Neue', 'Arial', 'sans-serif'],
    },
  ],
});
