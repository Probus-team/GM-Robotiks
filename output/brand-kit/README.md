# GM Robotiks IA — approved logo asset kit

Source: the blue logo selected as option 1 in the WhatsApp poll, with five votes at verification. The unchanged source is `approved-original.jpg`, also stored at `src/assets/brand/source/gm-robotiks-approved.jpg`.

Open `preview.html` to compare the exports. The public files and the site's responsive WebP images have been replaced locally. Publishing still requires a commit and push through CI/CD.

## Files

| Asset | Location | Use |
| --- | --- | --- |
| Full logo, color / white / navy monochrome | `public/brand/logo-full*.svg` and `.png` | Complete approved lockup, including frame and side bars |
| GM monogram, color / white / navy monochrome | `public/brand/logo-mark*.svg` and `.png` | Standalone symbol, without frame or descriptor |
| Wordmark, navy / white | `public/brand/wordmark*.svg` and `.png` | Original ROBOTIKS IA lettering, extracted rather than retyped |
| Small G symbol, navy / white | `public/brand/logo-micro*.svg` and `.png` | Compact favicon mark extracted from the original G |
| Adaptive favicon | `public/favicon.svg` | White G on a navy tile; reads the same in light and dark browser themes |
| Legacy favicon | `public/favicon.ico` | 16, 32, 48, 64, 128, and 256 px in one file |
| PNG favicon fallbacks | `public/favicon-{16,32,48,64,128,256}.png` | White G on a navy tile; square corners below 32 px, rounded above |
| Apple touch icon | `public/apple-touch-icon.png` | 180 × 180, white GM on full-bleed navy; iOS applies its own mask |
| App icons | `public/icon-192.png`, `public/icon-512.png` | White GM on a rounded navy tile |
| Maskable app icon | `public/icon-512-maskable.png` | 512 × 512, full-bleed navy with extra padding for circular or rounded masks |
| Profile icon | `public/brand/icon-1024.png` | 1024 × 1024, white GM on full-bleed navy |
| Social sharing card | `public/og-default.png` | 1200 × 630, logo, existing tagline, and website address |
| Larger logo PNG | `logo-full-2400.png` | 2400 px wide, rendered from the traced SVG |
| Responsive site assets | `src/assets/brand/optimized/*.webp` | Full, white, and mark variants in the existing size set |
| Metadata and inventory | `brand.json`, `asset-manifest.json` | Colors, copy, source provenance, paths, and file sizes |

## Brand content

- Name: **GM Robotiks IA**. Short name: **GM Robotiks**.
- Tagline: **Robots de servicio Pudu para México**.
- Logo alt text: **GM Robotiks IA**. Decorative logos inside an already labelled link should use empty alt text.
- Navy: **#123559**. Blue: **#2A7ABC**. White: **#FFFFFF**.
- On screen the blue is used one step darker, **#2875B4** — same hue and saturation, 2% less lightness — so small text clears WCAG AA on white and on the pale `--mist` ground. Artwork keeps the exact **#2A7ABC**.
- Pudu Robotics is a separate manufacturer name and retains its existing spelling.

Use the full-color logo on white or pale backgrounds. Use white versions on dark or photographic backgrounds. Keep clear space of at least one wordmark-letter height around a full logo. Preserve aspect ratio; do not stretch, crop off the frame or bars, add effects, or retype the lettering. At very small sizes use the G favicon instead of shrinking the full descriptor to unreadable text.

## Production method and fidelity

The JPEG is the unchanged approved source. PNG exports preserve its geometry while removing the white background and normalizing JPEG color variation to the two sampled ink colors. White and monochrome variants retain the same alpha mask. SVG files contain actual traced paths, with simplification below one source pixel; they are derived vectors, not the designer's original vector master. The 2400 px export scales those paths and does not add source detail. The AI-generated checkerboard version is not used.

Every icon is a filled navy tile carrying the mark in white. A navy-on-transparent mark disappeared against a dark browser tab or dark home screen; the tile gives each icon its own ground so it reads identically everywhere.

## Site palette

The page palette is built from the same two inks, in `src/styles/global.css`:

| Token | Value | Use |
| --- | --- | --- |
| `--navy` / `--navy-deep` / `--navy-ink` | `#123559` / `#0E2942` / `#0A1C2B` | Dark section grounds and hero gradients |
| `--blue` | `#2875B4` | Eyebrows, links, tags and focus rings on light grounds |
| `--blue-light` | `#6FB2EA` | The same accents on navy, where the logo blue only reaches 2.7:1 |
| `--blue-tint` | `#DCEAF7` | Underlines and focus halos |
| `--mist` / `--mist-2` | `#F4F7FA` / `#E6EDF4` | Pale section grounds and card plates |
| `--text` / `--muted` | `#14212E` / `#5C6F80` | Body copy |
| `--accent` | `--blue`, or `--blue-light` under `.on-dark` | One switch so eyebrows and focus rings stay legible on either ground |

Primary actions are `.btn-white` (white fill, navy text) on navy grounds and `.btn-navy` (navy fill, white text) on light ones — both 12.5:1. Layout, type, spacing and motion are unchanged.

## Rebuild

Run `bun run brand:build` from the repository root. Sharp is pinned as an explicit development dependency. The script regenerates assets from the preserved JPEG without a network request or AI generation. If the source is replaced, review its dimensions and extraction regions before rebuilding.
