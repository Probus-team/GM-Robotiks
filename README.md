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

## Deployment

Repository: `Probus-team/GM-Robotiks`. Cloudflare Worker: `gm-robotiks`.
Production hosts: `https://gmrobotiks.com` and `https://www.gmrobotiks.com`.
The canonical URL is `https://gmrobotiks.com`.

Cloudflare Workers Builds uses the GitHub integration with these settings:

| Setting | Value |
| --- | --- |
| Root directory | `/` |
| Production branch | `main` |
| Build command | `bun install --frozen-lockfile && bun run build && bun run check:deploy` |
| Production deploy command | `bun run deploy` |
| Non-production branch builds | Enabled |
| Non-production deploy command | `bun run deploy:preview` |
| Node / Bun | `24.16.0` / `1.3.14` (build variable `BUN_VERSION`) |

Pushes to `main` build and deploy production. Branch pushes build isolated
Worker versions with preview URLs, which the Cloudflare GitHub integration
links from pull requests. Uploading a preview does not promote it to production
or change the production domain bindings. Preview and workers.dev URLs send
`X-Robots-Tag: noindex, nofollow` to keep them out of search results.

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
must include `X-Robots-Tag: noindex, nofollow`.

After merging, verify the Cloudflare production deployment identifies the
merged commit, and that both production hosts respond over HTTPS. Check the
canonical URL and an image, video, and PDF from the deployed site. Production
must not send the preview-only `X-Robots-Tag` header.
