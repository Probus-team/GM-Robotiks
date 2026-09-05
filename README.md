# GM Robotics IA

Marketing site for GM Robotics IA, distributor and integrator of Pudu Robotics service robots in Mexico. Built with Astro (static output).

## Commands

| Command | Action |
| --- | --- |
| `bun install` | Install dependencies |
| `bun run dev` | Start the dev server at `localhost:4321` |
| `bun run build` | Build the static site to `dist/` |
| `bun run preview` | Preview the production build |

## Structure

```text
src/
├── assets/brand/            # original logo file (source of truth)
├── components/              # Header, Hero, Visor, Catalog, Cases, Process, Fleet, Docs, Contact, Footer
├── data/
│   ├── robots.ts            # Pudu catalog, case videos and downloadable documents
│   └── site.ts              # site name, nav, contact channels
├── layouts/Layout.astro     # head, favicons, fonts, scroll reveal
├── pages/index.astro
└── styles/global.css        # design tokens and base styles
public/
├── brand/                   # logo lockups: full, mark, wordmark, white and mono variants
├── favicon.ico              # 16–256 px multi-size icon, plus PNG favicons and app icons
├── media/robots/            # product images (webp)
├── media/cases/             # web-encoded case videos and posters
├── media/docs/              # official Pudu PDFs
├── media/hero/, media/software/
└── site.webmanifest
```

## Content notes

- Product figures come from Pudu's official spec sheets and product pages (2025 brochure, 2026 cleaning catalog, September 2026 ET1 / GT-series pages). Update them in `src/data/robots.ts`.
- Contact channels (`email`, `whatsapp`, `formEndpoint`) live in `src/data/site.ts`. The form posts to `formEndpoint` when set, falls back to a prefilled `mailto:` when only `email` is set, and otherwise shows a configuration notice.
- Fonts (Bricolage Grotesque, Figtree) are fetched at build time through Astro's fonts API, configured in `astro.config.mjs`.
