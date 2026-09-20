// The approved source has a transparent background and a few near-invisible flecks.
// Preserve its RGB gradients and visible alpha; discard only alpha <= 8 / 255.
export function extractArtwork(pixels, info, region) {
  if (info.width !== 1774 || info.height !== 887) throw new Error('Source dimensions changed; review extraction regions before rebuilding.');
  if (info.channels !== 4) throw new Error('Source must have an alpha channel.');
  if (pixels.length !== info.width * info.height * 4 || pixels[3] !== 0) throw new Error('Source must preserve its transparent background.');
  const [left, top, width, height] = region;
  if (!region.every(Number.isInteger) || left < 0 || top < 0 || width <= 0 || height <= 0 || left + width > info.width || top + height > info.height) throw new Error('Invalid artwork crop.');
  const rgba = Buffer.alloc(width * height * 4);
  const mask = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = ((top + y) * info.width + left + x) * 4;
    const p = y * width + x;
    if (pixels[i + 3] <= 8) continue;
    pixels.copy(rgba, p * 4, i, i + 4);
    if (pixels[i + 3] >= 128) mask[p] = 1;
  }
  return { rgba, masks: [mask], width, height, left };
}
