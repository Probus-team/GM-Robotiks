// 1200×630 link-preview image per robot, built at build time: the robot's
// cut-out on the navy ground with the white GM logo. No rendered text, so the
// output does not depend on the fonts installed on the build machine; the
// title travels in og:title.
import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { robots } from '../../data/robots';

export const getStaticPaths: GetStaticPaths = () => robots.map((robot) => ({ params: { id: robot.id } }));

const W = 1200;
const H = 630;
const root = process.cwd();

const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#123559"/><stop offset="0.6" stop-color="#0e2942"/><stop offset="1" stop-color="#0a1c2b"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.68" cy="0.86" r="0.45">
      <stop offset="0" stop-color="#2a8cff" stop-opacity="0.45"/><stop offset="1" stop-color="#2a8cff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="floor" x1="0" x2="1">
      <stop offset="0" stop-color="#6fb2ea" stop-opacity="0"/><stop offset="0.25" stop-color="#6fb2ea"/>
      <stop offset="0.75" stop-color="#6fb2ea"/><stop offset="1" stop-color="#6fb2ea" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <rect x="380" y="566" width="820" height="3" fill="url(#floor)"/>
</svg>`);

export const GET: APIRoute = async ({ params }) => {
  const id = params.id!;
  const cutout = await sharp(await readFile(join(root, 'src/assets/robots', `${id}.webp`)))
    .resize({ width: 640, height: 500, fit: 'inside' })
    .png()
    .toBuffer();
  const { width = 0, height = 0 } = await sharp(cutout).metadata();
  const logo = await sharp(await readFile(join(root, 'public/brand/logo-full-white.png')))
    .resize({ width: 300 })
    .png()
    .toBuffer();

  const jpeg = await sharp(background)
    .composite([
      { input: logo, left: 64, top: 64 },
      { input: cutout, left: Math.round(790 - width / 2), top: 566 - height },
    ])
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(jpeg), { headers: { 'Content-Type': 'image/jpeg' } });
};
