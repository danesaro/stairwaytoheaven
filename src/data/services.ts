export interface Service {
  title: string;
  description: string;
  href: string;
}

export const services: Service[] = [
  {
    title: 'Fabricación de gradas prefabricadas',
    description:
      'Fabricamos gradas prefabricadas para obras nuevas y remodelaciones. Cuéntanos cómo es tu espacio para consultar diseños, materiales y opciones de instalación.',
    href: '/servicios#fabricacion',
  },
  {
    title: 'Mantenimiento y reparación de escaleras',
    description:
      'Realizamos mantenimiento y reparación de escaleras existentes. Envíanos fotos de las zonas desgastadas o que necesitan atención para consultar el trabajo adecuado.',
    href: '/servicios#mantenimiento',
  },
  {
    title: 'Remodelación de escaleras',
    description:
      'Renovamos escaleras existentes para acompañar los cambios de tu hogar. Cuéntanos qué quieres transformar del diseño o los acabados y comparte fotos de su estado actual.',
    href: '/servicios#remodelacion',
  },
  {
    title: 'Instalación de gradas prefabricadas',
    description:
      'Instalamos gradas prefabricadas. Comparte el estado de tu obra, la ubicación y las medidas aproximadas para consultar el alcance de la instalación.',
    href: '/servicios#instalacion',
  },
  {
    title: 'Asesoría en espacios reducidos',
    description:
      'Orientación para encontrar una solución cuando el espacio es limitado. Una foto y medidas aproximadas nos ayudan a entender tu necesidad.',
    href: '/servicios#asesoria',
  },
  {
    title: 'Provisión de pasamanos',
    description:
      'Pasamanos y barandillas para complementar tu escalera. Consulta diseños y acabados según la estructura y el uso del espacio.',
    href: '/servicios#pasamanos',
  },
];
