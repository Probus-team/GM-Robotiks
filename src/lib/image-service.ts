// Astro's sharp service with our encoder quality per output format. Sharp's
// defaults (AVIF 50, WebP 80) visibly soften the product renders and band the
// dark gradients, and the masters in src/assets are WebP q95, so these numbers
// decide what visitors see.
//
// The quality is written into each image transform rather than the service
// config on purpose: Astro's image cache key (and the output file name) covers
// the transform but not the service config, and Cloudflare's build cache keeps
// node_modules/.astro between builds. Changing a number here re-encodes every
// image; changing it in astro.config.mjs would leave cached images untouched.
import type { ImageTransform, LocalImageService } from 'astro';
import sharpService from 'astro/assets/services/sharp';

export const formatQuality: Record<string, number> = { avif: 70, webp: 86 };

const service: LocalImageService = {
  ...sharpService,
  async validateOptions(options, imageConfig) {
    const validated: ImageTransform = await sharpService.validateOptions!(options, imageConfig);
    if (validated.quality === undefined && typeof validated.format === 'string' && validated.format in formatQuality) {
      validated.quality = formatQuality[validated.format];
    }
    return validated;
  },
};

export default service;
