import { site } from './site';

// Canonical public pages. Match Cloudflare's directory-style HTML URLs.
export const publicPages = [
  { path: '/', title: `${site.name} · ${site.tagline}` },
  { path: '/robots/', title: `Catálogo de robots Pudu · ${site.name}` },
] as const;

export function canonicalPath(path: string): string {
  return path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`;
}
