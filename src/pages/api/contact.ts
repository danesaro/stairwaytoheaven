import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

// No prerenderizar esta ruta
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();

  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();    // en inicio.astro
  const subject = String(formData.get('subject') ?? '').trim(); // en contactanos.astro
  const message = String(formData.get('message') ?? '').trim();

  if (!name || !email || !message) {
    return new Response('Por favor completa nombre, correo y mensaje.', { status: 400 });
  }

  const finalSubject =
    subject || `Nuevo mensaje desde la web - ${name}`;

  const textBody = `
Nombre: ${name}
Email: ${email}
Teléfono: ${phone || 'No indicado'}

Asunto: ${subject || '(sin asunto)'}

Mensaje:
${message}
  `.trim();

  try {
    await resend.emails.send({
      from: 'Web Gradas & Gradas <no-reply@mail.gradasygradas.com>', // usa tu dominio verificado
      to: 'gradasygradascali@gmail.com',                     // correo donde quieres recibir
      replyTo: email,
      subject: finalSubject,
      text: textBody,
    });

    // validate.js espera 'OK' para mostrar el mensaje de éxito
    return new Response('OK', { status: 200 });
  } catch (error) { 
    console.error('Error al enviar correo de contacto', error);
    return new Response('Error al enviar el mensaje. Inténtalo más tarde.', {
      status: 500,
    });
  }
};