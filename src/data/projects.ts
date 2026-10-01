import type { ImageMetadata } from 'astro';

import GradaLibre1 from '../assets/img/projects/GradaLibre-1.webp';
import GradaLibre2 from '../assets/img/projects/GradaLibre-2.webp';
import GradaLibre3 from '../assets/img/projects/GradaLibre-3.webp';
import GradaLibre4 from '../assets/img/projects/GradaLibre-4.webp';
import GradaLibre5 from '../assets/img/projects/GradaLibre-5.webp';
import GradaLibre6 from '../assets/img/projects/GradaLibre-6.webp';
import GradaLibre7 from '../assets/img/projects/GradaLibre-7.webp';
import GradaLibre8 from '../assets/img/projects/GradaLibre-8.webp';
import GradaTapada1 from '../assets/img/projects/GradaTapada-1.webp';
import GradaTapada2 from '../assets/img/projects/GradaTapada-2.webp';
import GradaMadera1 from '../assets/img/projects/GradaMadera-1.webp';
import GradaMadera2 from '../assets/img/projects/GradaMadera-2.webp';
import GradaFish1 from '../assets/img/projects/GradaFish-1.webp';

export type ProjectCategory = 'libres' | 'tapadas' | 'otros';

export interface Project {
  image: ImageMetadata;
  alt: string;
  title: string;
  category: ProjectCategory;
  /** Grupo de GLightbox: permite navegar entre fotos de la misma categoría. */
  gallery: string;
}

export const projects: Project[] = [
  {
    image: GradaLibre1,
    alt: 'Grada libre en concreto con pasos separados y pasamanos metálico',
    title: 'Gradas libres',
    category: 'libres',
    gallery: 'libres',
  },
  {
    image: GradaTapada1,
    alt: 'Grada tapada con Stringer macizo y revestimiento en acabado oscuro',
    title: 'Gradas tapadas',
    category: 'tapadas',
    gallery: 'tapadas',
  },
  {
    image: GradaFish1,
    alt: 'Grada espina de pescado en interior',
    title: 'Espina de pescado',
    category: 'otros',
    gallery: 'otros',
  },
  {
    image: GradaLibre2,
    alt: 'Grada libre con pasos de piedra y barandilla lateral',
    title: 'Gradas libres',
    category: 'libres',
    gallery: 'libres',
  },
  {
    image: GradaLibre3,
    alt: 'Grada libre de dos tramos con descansillo',
    title: 'Gradas libres',
    category: 'libres',
    gallery: 'libres',
  },
  {
    image: GradaLibre4,
    alt: 'Grada libre vertical con pasamanos en acero',
    title: 'Gradas libres',
    category: 'libres',
    gallery: 'libres',
  },
  {
    image: GradaMadera1,
    alt: 'Grada con pasos de madera y pasamanos en acero',
    title: 'Peldaños de madera',
    category: 'otros',
    gallery: 'otros',
  },
  {
    image: GradaMadera2,
    alt: 'Grada con pasos de madera y pasamanos metálico, vista lateral',
    title: 'Peldaños de madera',
    category: 'otros',
    gallery: 'otros',
  },
  {
    image: GradaTapada2,
    alt: 'Grada tapada con Stringer macizo y acabado en porcelanato',
    title: 'Gradas tapadas',
    category: 'tapadas',
    gallery: 'tapadas',
  },
  {
    image: GradaLibre5,
    alt: 'Grada libre en granite con pasamanos de vidrio',
    title: 'Gradas libres',
    category: 'libres',
    gallery: 'libres',
  },
  {
    image: GradaLibre6,
    alt: 'Grada libre con doble tramo y barandilla curva',
    title: 'Gradas libres',
    category: 'libres',
    gallery: 'libres',
  },
  {
    image: GradaLibre7,
    alt: 'Grada libre amplia con pasamanos en madera',
    title: 'Gradas libres',
    category: 'libres',
    gallery: 'libres',
  },
  {
    image: GradaLibre8,
    alt: 'Grada libre en interior con pasamanos metálico y acabado mate',
    title: 'Gradas libres',
    category: 'libres',
    gallery: 'libres',
  },
];

export const projectFilters: { label: string; filter: 'all' | ProjectCategory }[] = [
  { label: 'Todo', filter: 'all' },
  { label: 'Gradas libres', filter: 'libres' },
  { label: 'Gradas tapadas', filter: 'tapadas' },
  { label: 'Otros', filter: 'otros' },
];
