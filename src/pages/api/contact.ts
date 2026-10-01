import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { site } from '../../data/site';

export const prerender = false;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const LIMITS = {
  name: 120,
  email: 200,
  phone: 40,
  subject: 150,
  message: 4000,
} as const;

type Field = keyof typeof LIMITS;

// Límite por IP en memoria. Suficiente para frenar el envío automatizado más común
// sin dependencias; no sustituye un rate limit en el edge (Vercel Firewall / Upstash).
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 };
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < RATE_LIMIT.windowMs);

  if (recent.length >= RATE_LIMIT.max) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  hits.set(ip, recent);

  // Poda opportunista para que el Map no crezca sin límite.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (now - (times.at(-1) ?? 0) > RATE_LIMIT.windowMs) hits.delete(key);
    }
  }

  return false;
}

function json(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

async function readPayload(request: Request): Promise<Record<string, string>> {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const parsed = await request.json();
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).map(([key, value]) => [key, String(value ?? '')]),
    );
  }

  // Fallback para submit nativo sin JavaScript.
  const formData = await request.formData();
  return Object.fromEntries([...formData.entries()].map(([key, value]) => [key, String(value)]));
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('Falta RESEND_API_KEY: el formulario de contacto no puede enviar correos.');
    return json({ ok: false, error: 'El servicio de contacto no está disponible en este momento.' }, 503);
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'desconocida';

  if (isRateLimited(ip)) {
    return json(
      { ok: false, error: 'Demasiados envíos seguidos. Espera unos minutos e inténtalo de nuevo.' },
      429,
    );
  }

  let payload: Record<string, string>;
  try {
    payload = await readPayload(request);
  } catch {
    return json({ ok: false, error: 'No pudimos leer el formulario. Inténtalo de nuevo.' }, 400);
  }

  // Honeypot: si viene relleno es un bot. Respondemos 200 para no darle pistas.
  if (payload.website) {
    return json({ ok: true }, 200);
  }

  const fields = Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [key, value.trim()]),
  ) as Record<Field, string | undefined>;

  const errors: string[] = [];

  for (const [field, max] of Object.entries(LIMITS) as [Field, number][]) {
    if ((fields[field]?.length ?? 0) > max) errors.push(`El campo ${field} excede el largo permitido.`);
  }

  const name = fields.name ?? '';
  const email = fields.email ?? '';
  const message = fields.message ?? '';

  if (!name) errors.push('Escribe tu nombre.');
  if (!email) errors.push('Escribe tu correo electrónico.');
  else if (!EMAIL_REGEX.test(email)) errors.push('El correo electrónico no tiene un formato válido.');
  if (!message) errors.push('Escribe tu mensaje.');
  else if (message.length < 10) errors.push('Tu mensaje es demasiado corto.');

  if (errors.length > 0) {
    return json({ ok: false, error: errors.join(' ') }, 400);
  }

  const resend = new Resend(apiKey);
  const subject = fields.subject || `Nuevo mensaje desde la web - ${name}`;

  const textBody = [
    `Nombre: ${name}`,
    `Email: ${email}`,
    `Teléfono: ${fields.phone || 'No indicado'}`,
    '',
    `Asunto: ${fields.subject || '(sin asunto)'}`,
    '',
    'Mensaje:',
    message,
  ].join('\n');

  try {
    const { error } = await resend.emails.send({
      from: 'Web Gradas & Gradas <no-reply@mail.gradasygradas.com>',
      to: site.email,
      replyTo: email,
      subject,
      text: textBody,
    });

    if (error) throw new Error(error.message);
  } catch (error) {
    console.error('Error al enviar el correo de contacto:', error);
    return json(
      { ok: false, error: 'No pudimos enviar tu mensaje. Inténtalo más tarde o escríbenos por WhatsApp.' },
      502,
    );
  }

  return json({ ok: true }, 200);
};

// El resto de métodos no debe revelar nada ni ejecutar nada.
export const ALL: APIRoute = () => json({ ok: false, error: 'Método no permitido.' }, 405);
