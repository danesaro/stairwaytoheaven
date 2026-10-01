import type { APIRoute } from 'astro';
import { SITE_URL } from '../data/site';

export const prerender = true;

export const GET: APIRoute = async () => {
  const today = new Date().toISOString().slice(0, 10);

  // El home aparece una sola vez: /inicio es un redirect 301 hacia "/".
  const paths = [
    { path: '/', priority: '1.0', changefreq: 'monthly' },
    { path: '/servicios', priority: '0.9', changefreq: 'monthly' },
    { path: '/galeria', priority: '0.8', changefreq: 'monthly' },
    { path: '/acerca-de-nosotros', priority: '0.6', changefreq: 'yearly' },
    { path: '/contactanos', priority: '0.8', changefreq: 'yearly' },
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    ({ path, priority, changefreq }) => `  <url>
    <loc>${new URL(path, SITE_URL).href}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
