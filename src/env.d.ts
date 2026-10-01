/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** API key de Resend. Solo se usa en src/pages/api/contact.ts (server-side). */
  readonly RESEND_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
