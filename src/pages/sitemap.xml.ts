import type { APIRoute } from 'astro';
import { publicPages } from '../data/seo';

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('A canonical site URL is required to generate the sitemap.');
  const urls = publicPages.map(({ path }) => `<url><loc>${new URL(path, site).href}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
