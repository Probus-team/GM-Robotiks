import { site } from './site';
import { robots } from './robots';
import { midSentence } from '../lib/text';
import { legalPages } from './legal';

// Canonical public pages. Match Cloudflare's directory-style HTML URLs.
export const publicPages = [
  { path: '/', title: `${site.name} · ${site.tagline}` },
  { path: '/robots/', title: `Catálogo de robots Pudu · ${site.name}` },
  ...robots.map((robot) => ({ path: robotPath(robot.id), title: robotTitle(robot) })),
  ...legalPages.map(({ path, title }) => ({ path, title })),
];

export function robotPath(id: string): string {
  return `/robots/${id}/`;
}

export function robotTitle(robot: { name: string; role: string }): string {
  return `${robot.name}: ${midSentence(robot.role)} · ${site.shortName}`;
}

export function canonicalPath(path: string): string {
  return path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`;
}
