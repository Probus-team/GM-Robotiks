# GM Robotiks IA brand assets

The master is the user's supplied blue robot logo, preserved unchanged in `approved-original.png` and `src/assets/brand/source/gm-robotiks-approved.png`. The source checksum and crop coordinates are recorded in `brand.json`.

Open `preview.html` to inspect every export, favicons at actual size, app masking, and the social card. `asset-review.png` is a compact contact sheet.

| Asset | Location | Use |
| --- | --- | --- |
| Full color logo | `public/brand/logo-full.{png,svg}` | Light backgrounds, original blue lettering and robot gradients |
| Full logo for dark backgrounds | `public/brand/logo-full-white.{png,svg}` | Original color robot with white lettering |
| Single-color full logo | `public/brand/logo-full-mono*.{png,svg}` | Navy or white silhouette for single-ink use |
| Robot emblem only | `public/brand/logo-mark*.{png,svg}` | Color, white, navy monochrome, and white monochrome |
| Lettering only | `public/brand/wordmark*.{png,svg}` | GM and Robotiks IA, original lettering in blue or white |
| Compact mark | `public/brand/logo-micro*.{png,svg}` | Robot emblem, color or white; retained compact-mark filenames |
| Browser icons | `public/favicon.svg`, `public/favicon.ico`, `public/favicon-{16,32,48,64,128,256}.png` | Blue robot on a white tile for light and dark browser themes |
| Apple touch icon | `public/apple-touch-icon.png` | 180 × 180, opaque square; iOS applies the mask |
| App icons | `public/icon-192.png`, `public/icon-512.png` | Rounded white tiles with the color emblem |
| Maskable icon | `public/icon-512-maskable.png` | 512 × 512, opaque white with artwork inside the circular safe zone |
| Profile icon | `public/brand/icon-1024.png` | 1024 × 1024 white tile |
| Social card | `public/og-default.png`, `social-card.svg` | 1200 × 630, logo, tagline, and site address |
| Large logo | `logo-full-2400.png` | Transparent PNG, 2400 px wide |
| Site images | `src/assets/brand/optimized/*.webp` | Lossless responsive exports for header and footer |
| Inventory | `asset-manifest.json` | Public asset paths and byte sizes |

## Fidelity and formats

Exports crop the original artwork without retyping or redrawing it. Visible RGB gradients and transparency are preserved; near-invisible source flecks with alpha at or below 8/255 are removed. Robot eyes remain transparent. Dark-background full logos change only the lettering to white.

Color SVGs embed PNG artwork to preserve the supplied gradients. They are portable SVG containers, **not editable vector masters**. Monochrome SVGs contain actual traced silhouette paths. The 2400 px PNG is an enlargement and does not add source detail. No image generation was needed.

Use the color lockup on white or pale backgrounds and the white-letter lockup on dark backgrounds. Keep the aspect ratio and leave clear space around the artwork. At favicon sizes, use the robot emblem rather than the complete name.

The page's existing navy and accessible text colors remain in `src/styles/global.css`. Artwork uses the supplied blue/cyan gradient. Pudu product logos and manufacturer names are unchanged.

## Rebuild and validate

Run `bun run brand:build`, then `bun run test` and `bun run build`. Sharp is already pinned in the project. Rebuilding is deterministic and requires no image service or network access. If the master changes, update and verify extraction coordinates before rebuilding. Tests cover the source checksum, gradients, alpha, dark-background lettering, crop validation, icon sizes, mask safety, ICO entries, and renderable SVG exports.
