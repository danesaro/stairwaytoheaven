import type { IconName } from './icons';

export const SITE_URL = 'https://gradasygradas.com';
const phoneHref = '+573165763232';

export const site = {
  name: 'Gradas & Gradas',
  shortName: 'Gradas&Gradas',
  url: SITE_URL,
  locale: 'es_CO',
  lang: 'es-CO',
  themeColor: '#feb900',
  description:
    'Empresa caleña especializada en fabricación e instalación de gradas prefabricadas, mantenimiento, reparación y remodelación de escaleras.',
  founded: '2011',
  email: 'gradasygradascali@gmail.com',
  phone: '+57 316 576 3232',
  phoneHref,
  whatsapp: `https://wa.me/${phoneHref.slice(1)}`,
  address: {
    street: 'Calle 84 Norte #8N-36',
    neighborhood: 'Ciudadela Floralia',
    city: 'Cali',
    region: 'Valle del Cauca',
    country: 'CO',
    postalCode: '760001',
  },
  geo: {
    latitude: 3.480628,
    longitude: -76.514442,
  },
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
    { days: ['Saturday'], opens: '08:00', closes: '13:00' },
  ],
  social: [
    { name: 'Facebook', icon: 'facebook', href: 'https://www.facebook.com/gradasygradas' },
    { name: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/gradasygradas' },
  ] satisfies { name: string; icon: IconName; href: string }[],
} as const;

export const fullAddress = `${site.address.street}, ${site.address.neighborhood}, ${site.address.city}, ${site.address.region}`;

export const navLinks = [
  { href: '/galeria', label: 'Proyectos' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/acerca-de-nosotros', label: 'Nosotros', footerLabel: 'Nuestra historia' },
  { href: '/contactanos', label: 'Contacto' },
] as const;

/** Consulta contextual usando el mismo número que las acciones principales. */
export function whatsappLink(message: string): string {
  return `${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
