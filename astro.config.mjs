import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// output: 'static' prerenderiza todas las páginas; solo las rutas con
// `export const prerender = false` (api/contact.ts) se renderizan on-demand.
export default defineConfig({
  adapter: vercel(),
  output: 'static',
  trailingSlash: 'ignore',
  redirects: {
    '/inicio': { status: 301, destination: '/' },
  },
  build: {
    format: 'directory',
  },
  image: {
    // AVIF pesa menos pero cuesta mucho más CPU en Vercel Functions; WebP cubre
    // el 95% del caso. Los PNG/JPEG originales (logos, about) no se recomprimen.
    responsiveStyles: true,
  },
});
