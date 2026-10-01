import type { ImageMetadata } from 'astro';
import spiralStair from '../assets/img/projects/GradaTapada-1.webp';
import interiorStair from '../assets/img/projects/GradaFish-1.webp';
import stoneDetail from '../assets/img/projects/GradaLibre-4.webp';

export interface SelectedWork {
  image: ImageMetadata;
  title: string;
  description: string;
  alt: string;
}

export const selectedWorks: SelectedWork[] = [
  {
    image: spiralStair,
    title: 'Una forma de conectar',
    description: 'Escalera caracol exterior con pasamanos metálico.',
    alt: 'Escalera caracol de varios tramos instalada en el exterior de una vivienda',
  },
  {
    image: interiorStair,
    title: 'Un nuevo recorrido interior',
    description: 'Gradas con pasos abiertos y pasamanos metálico.',
    alt: 'Escalera interior con peldaños abiertos de acabado claro y barandilla blanca',
  },
  {
    image: stoneDetail,
    title: 'El detalle de cada paso',
    description: 'Acabado de piedra en una escalera caracol.',
    alt: 'Vista superior de peldaños de una escalera caracol con incrustaciones de piedra',
  },
];

export const homeSolutions = [
  {
    number: '01',
    title: 'Gradas prefabricadas',
    description: 'Fabricación e instalación de gradas prefabricadas para tu obra nueva o remodelación.',
    href: '/servicios#fabricacion',
  },
  {
    number: '02',
    title: 'Mantenimiento de escaleras',
    description:
      'Mantenimiento y reparación de escaleras existentes. Cuéntanos qué zonas necesitan atención.',
    href: '/servicios#mantenimiento',
  },
  {
    number: '03',
    title: 'Remodelación de escaleras',
    description: 'Renueva el diseño y los acabados de tu escalera. Conversemos sobre lo que quieres cambiar.',
    href: '/servicios#remodelacion',
  },
] as const;
