# StairwayToHeaven — Gradas & Gradas

Sitio web de **Gradas & Gradas**, empresa caleña de gradas y escaleras con operación en el área
metropolitana de Cali y algunos municipios del Valle del Cauca. Diseño, fabricación, instalación,
pasamanos, mantenimiento y asesoría en espacios reducidos.

---

## Stack

- **Astro 5** con `@astrojs/vercel` (output `static`; solo `src/pages/api/contact.ts`
  se renderiza on-demand; `/inicio` es un redirect estático)
- **CSS propio**: base y transiciones nativas en `src/styles/base.css`, tokens y
  composición editorial en `src/styles/editorial.css`, estilos específicos junto a los componentes
- **Iconos SVG inline** mediante `Icon.astro`, con los dibujos de Bootstrap Icons
  utilizados por el sitio; sin fuente ni CSS del catálogo completo
- **Galería con CSS Grid** y filtro nativo por categoría
- **GLightbox** para imágenes y video: CSS y JS se cargan al abrir una ampliación
- **Navegación nativa entre documentos**, con View Transitions donde se soportan
- **Resend** para el envío de correos del formulario de contacto
- Imágenes servidas por **`astro:assets`** desde `src/assets/img`

## Requisitos

- Node.js 20 o superior
- Una API key de Resend con el dominio `mail.gradasygradas.com` verificado

## Puesta en marcha

```bash
npm ci
cp .env.example .env      # completar RESEND_API_KEY
npm run dev               # http://localhost:4321
```

## Scripts

| Comando                | Qué hace                                                 |
| ---------------------- | -------------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo                                   |
| `npm run build`        | `astro check` + `astro build` (lo que corre Vercel)      |
| `npm run build:only`   | Solo build, sin typecheck                                |
| `npm run preview`      | Preview de Astro; el adaptador Vercel puede no admitirlo |
| `npm run check`        | Typecheck de `.astro` + `.ts` (`astro check`)            |
| `npm run format`       | Prettier sobre todo el proyecto                          |
| `npm run format:check` | Verifica formato sin escribir (para CI)                  |

## Estructura

```
src/
  assets/img/          imágenes fuente (las optimiza astro:assets)
  components/          SiteHeader, SiteFooter, PageIntro, ConsultationCTA,
                       FeaturedProject, PortfolioGrid, PortfolioCard, ContactForm, Icon, Seo
  data/                site.ts, services.ts, projects.ts, home.ts, icons.ts
  layouts/MainLayout   shell: head, SEO, header, footer, scripts
  pages/               una por ruta + api/contact.ts + sitemap.xml.ts
  scripts/page.ts      filtro nativo y carga diferida de GLightbox
  styles/base.css      reset, utilidades compartidas, skip link y View Transitions
  styles/editorial.css tokens, tipografía y composición compartida de páginas
public/                GLightbox, favicon, imagen OG, robots.txt y manifest
```

### Dónde cambiar el contenido

Los datos compartidos se editan en estos archivos; el texto específico de cada página
se mantiene en su `.astro`:

- Datos de la empresa, contacto, WhatsApp, redes, dirección y navegación → `src/data/site.ts`
- Los 6 servicios → `src/data/services.ts`
- Las 13 fotografías de la galería: título, alt y categoría → `src/data/projects.ts`
- Trabajos seleccionados y soluciones de portada → `src/data/home.ts`
- Colores y tipografía → tokens de `.editorial-site` en `src/styles/editorial.css`
- Menú, footer, formulario y galería → estilos en sus componentes `.astro`

`site.whatsapp` contiene el destino principal. `whatsappLink(mensaje)` agrega una
consulta contextual sin duplicar el número de teléfono. Los enlaces de navegación
se comparten entre header y footer; el logo enlaza al inicio.

### Iconos

```astro
---
import Icon from '../components/Icon.astro';
---

<a href="/galeria">
  Ver proyectos <Icon name="arrow-up-right" />
</a>
```

Los nombres están tipados en `src/data/icons.ts`. Los SVG son decorativos y heredan
el color y tamaño del texto; un botón que solo tenga icono debe incluir su propio
`aria-label`. Licencia de los dibujos en `THIRD-PARTY-NOTICES.md`.

### Formulario compartido

```astro
<ContactForm idPrefix="contact" />
```

Tiene una única presentación, con nombre, correo, teléfono opcional y mensaje.
El prefijo debe ser único por formulario para asociar etiquetas y ayuda.

## Rutas

| Ruta                  | Contenido                                                        |
| --------------------- | ---------------------------------------------------------------- |
| `/`                   | Portada editorial, trabajos seleccionados, soluciones y contacto |
| `/servicios`          | Servicios y propuesta de valor                                   |
| `/galeria`            | Galería completa con filtros                                     |
| `/acerca-de-nosotros` | Historia de la empresa                                           |
| `/contactanos`        | Datos de contacto, mapa y formulario                             |
| `/inicio`             | Redirect 301 a `/` (compatibilidad con links anteriores)         |

`vercel.json` define el 301 de `/inicio` y las cabeceras de caché y seguridad.

## Formulario de contacto

`POST /api/contact` acepta `application/json` y `multipart/form-data` (para submit sin JS), y
responde siempre JSON:

```jsonc
{ "ok": true }                                  // 200
{ "ok": false, "error": "Escribe tu nombre." } // 400
```

Protecciones: honeypot (`website`), rate limit por IP en memoria (5 envíos / 10 min), validación de
largo de cada campo y formato de correo. El rate limit en memoria no sobrevive a instancias
distintas de Vercel Functions; si el volumen de spam lo justifica, moverlo a Vercel Firewall o Upstash.

## Notas de despliegue

- Las variables de entorno se configuran en el panel de Vercel (`RESEND_API_KEY`).
- El remitente `no-reply@mail.gradasygradas.com` debe estar verificado en Resend.
- Los assets con hash bajo `/_astro/` usan caché inmutable. Los archivos de `/assets/`
  se revalidan para que una actualización de CSS, JS o imagen OG llegue al navegador.

## Verificación

Antes de desplegar:

```bash
npm run build
npm run format:check
```

Las páginas se generan estáticamente; la función de contacto requiere `RESEND_API_KEY`
en Vercel. Las interacciones respetan `prefers-reduced-motion`, y las fotografías
conservan un enlace directo si falla la carga del lightbox.

Las herramientas locales de navegador y Lighthouse están en `dev-tools/` y su setup
en `dev-tools/DEV-SERVER.md`. Esa carpeta y `docs/` están excluidas de Git por decisión
del proyecto; las herramientas locales no forman parte de las dependencias de producción.
