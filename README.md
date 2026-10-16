# GM Robotiks IA

Marketing site for GM Robotiks IA, distributor and integrator of Pudu Robotics service robots in Mexico. Built with Astro (static output).

## Commands

| Command | Action |
| --- | --- |
| `bun install` | Install dependencies |
| `bun run dev` | Start the dev server at `localhost:4321` |
| `bun run build` | Build the static site to `dist/` |
| `bun run brand:build` | Rebuild logos, favicons, app icons, and the brand review kit |
| `bun run preview` | Preview the production build |

## Structure

```text
src/
├── assets/brand/source/     # approved transparent robot logo (source of truth)
├── assets/robots/           # robot cut-outs, one <id>.webp per robot (SOURCES.md lists provenance)
├── assets/scenes/           # robots in context, one <id>.webp where available
├── assets/software/         # Pudu Link / Pudu Cloud screenshots
├── components/              # Header, Hero, Visor, Showcase, Lineup, Savings, Proof, Process, Fleet,
│                            # Catalog, Docs, Contact, Footer, Icon, BrandImage
├── data/
│   ├── robots.ts            # Pudu catalog: specs, key figures, use cases, case videos, documents
│   ├── deployments.ts       # Mexican client deployments (empty until the client provides them)
│   ├── showcase.ts          # full-screen home panels, one per robot line
│   ├── seo.ts               # canonical pages for the sitemap and robot page titles
│   └── site.ts              # site name, nav, main button, contact channels
├── lib/
│   ├── media.ts             # resolves robot cut-outs and scenes by id
│   ├── roi.ts               # savings calculator math and its assumptions
│   └── whatsapp.ts          # WhatsApp links with a prewritten message
├── layouts/Layout.astro     # head, metadata, JSON-LD, fonts, scroll reveal
├── pages/
│   ├── index.astro          # home: video hero, showcase, lineup, calculator, proof, process, fleet, contact
│   ├── robots/index.astro   # catalog by line, documents, contact (/robots/#limpieza jumps to a line)
│   ├── robots/[id].astro    # one page per robot, with Product JSON-LD
│   ├── og/[id].jpg.ts       # 1200×630 link-preview image per robot, built with sharp
│   └── 404.astro
└── styles/global.css        # design tokens, type scale, frames, buttons, reveals
public/
├── brand/                   # logo lockups: full, mark, wordmark, white and mono variants
├── favicon.ico              # 16–256 px multi-size icon, plus PNG favicons and app icons
├── media/hero/              # home video montage, landscape and portrait, AV1 and H.264
├── media/cases/             # web-encoded case videos and posters
├── media/loops/             # short muted cuts of Pudu case films for the home showcase
├── media/docs/              # official Pudu PDFs
└── site.webmanifest
```

## Content notes

- Brand exports and usage notes are in [output/brand-kit/README.md](output/brand-kit/README.md). Open [the asset preview](output/brand-kit/preview.html) locally to review color, white, icon, and favicon versions. The active master is `src/assets/brand/source/gm-robotiks-approved.png`; the older `gm-robotics-ia-original.jpg` is a legacy reference.

- Product figures come from Pudu's official spec sheets and product pages (2025 brochure, 2026 cleaning catalog, September 2026 ET1 / GT-series pages). Update them in `src/data/robots.ts`. Each robot has three `keyFigures` (shown large on its page) and its `useCases`; pages, the sitemap and `llms.txt` are generated from this file.
- Images go through `astro:assets` (`<Picture>`, AVIF with WebP fallback, `srcset`); encoder quality is set in `src/lib/image-service.ts`. To add or improve a robot image, drop `<id>.webp` into `src/assets/robots/` (transparent, trimmed) or `src/assets/scenes/`, saved as WebP q95 at the largest size the source allows. Record where it came from in `src/assets/robots/SOURCES.md`.
- Every photo and video is Pudu Robotics' material and is credited as such. Case videos are marked `deployment` (shot at a Pudu customer site) or `promo` (product video).
- Mexican deployments go in `src/data/deployments.ts`, only with the client's written permission, our own site photos and a number measured in the client's pilot. While the list is empty, the home page shows marked placeholder slots on preview and local hosts only; `gmrobotiks.com` hides them.
- The savings calculator's math and assumptions live in `src/lib/roi.ts` and are listed next to the result on the page. It does not subtract the robot's price.
- Contact channels (`email`, `whatsapp`, `formEndpoint`) live in `src/data/site.ts`. The form is WhatsApp-first: submitting opens WhatsApp with the lead written out for the sales number, and "Prefiero correo" opens the same text as an email. If `formEndpoint` is set, the form posts JSON there instead. "Cotizar" buttons on robot pages and catalog tiles open WhatsApp with a message for that robot.
- Fonts (Bricolage Grotesque, Figtree) are fetched at build time through Astro's fonts API, configured in `astro.config.mjs`.

## Home videos

`scripts/build-videos.sh <source-dir>` rebuilds the home montage
(`public/media/hero/`), the showcase loops (`public/media/loops/`) and their
posters from Pudu Robotics' original files. The script lists every source file
with its URL (Pudu's CDN or the Pudu Robotics YouTube channel), the cut points
and the encoder settings. Each clip is cut once to a lossless intermediate and
encoded once as AV1 and once as H.264; the page picks AV1 where the browser
decodes it. Every file stays under 5 MB (`tests/catalog.test.mjs`).

The montage is 10 s: KettyBot Pro in a café (4K source), ET1 in a store, T600
in a warehouse, GT5 and GT7, with no burned-in captions. Shot start times and
captions are in `src/components/Hero.astro`; keep them in sync when re-cutting.
Its posters are `src/assets/hero/poster-*.webp` (WebP q95 masters), so astro:assets
makes the AVIF/WebP sizes.

The case films in `public/media/cases/` are still the earlier 576p–720p web
encodes; their posters are 1600 px frames from the originals.

## Deployment

Repository: `Probus-team/GM-Robotiks`. Cloudflare Worker: `gm-robotiks`.
Production hosts: `https://gmrobotiks.com` and `https://www.gmrobotiks.com`.
The canonical URL is `https://gmrobotiks.com`.

Cloudflare Workers Builds uses the GitHub integration with these settings:

| Setting | Value |
| --- | --- |
| Root directory | `/` |
| Production branch | `main` |
| Build command | `npx --yes bun@1.3.14 install --frozen-lockfile && npx --yes bun@1.3.14 run build && npx --yes bun@1.3.14 run check:deploy` |
| Production deploy command | `bun run deploy` |
| Non-production branch builds | Enabled |
| Non-production deploy command | `npx wrangler versions upload` |
| Node / Bun | `24.16.0` / `1.3.14` |

The shared build command pins Bun explicitly because Cloudflare's production
build variables are not inherited by non-production branch builds. The initial
Cloudflare dependency bootstrap may use its preinstalled Bun; the frozen install,
site build, and deployment validation above use the pinned version.

Pushes to `main` build and deploy production. Branch pushes build isolated
Worker versions with preview URLs, which the Cloudflare GitHub integration
links from pull requests. Uploading a preview does not promote it to production
or change the production domain bindings. Preview and workers.dev URLs send
`X-Robots-Tag` with `noindex` to keep them out of search results. Cloudflare
overrides version-preview responses to `noindex`; the asset rule also applies
`nofollow` to the main workers.dev hostname.

GitHub Actions also builds and validates the deployment on every pull request
and push to `main`, without Cloudflare credentials. Cloudflare owns the deploy
credential; no deployment secrets are stored in the repository.

Deploy by committing and pushing. Do not deploy directly from a local checkout.
For local validation, run `bun install --frozen-lockfile`, `bun run build`, and
`bun run check:deploy`. The last command is a dry run and does not publish.
For a rollback, revert the relevant commit and push to `main`.

### Release verification

Before merging a pull request, confirm that both the GitHub CI check and the
Cloudflare Workers build succeed. Open the preview URL linked by Cloudflare
and check the page, images, videos, and document downloads. The preview response
must include `noindex` in its `X-Robots-Tag` header.

After merging, verify the Cloudflare production deployment identifies the
merged commit, and that both production hosts respond over HTTPS. Check the
canonical URL and an image, video, and PDF from the deployed site. Production
must not send the preview-only `X-Robots-Tag` header.

## Showcase loops

`public/media/loops/*.mp4` are 6–8 s muted cuts of the case videos, for the
full-screen panels on the home page. To regenerate one (example: the
Limpieza loop, seconds 4–12 of the CC1 video):

```sh
ffmpeg -ss 4 -t 8 -i public/media/cases/cc1-factory.mp4 -an \
  -vf "scale='min(1280,iw)':-2,fps=30,format=yuv420p" \
  -c:v libx264 -preset slow -crf 27 -movflags +faststart \
  public/media/loops/limpieza.mp4
```

Then export the first frame as `<name>-poster.webp`. Panels are defined in
`src/data/showcase.ts`.
