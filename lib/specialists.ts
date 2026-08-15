export type Specialist = {
  id: string;
  name: string;
  role: { en: string; es: string };
  bio: { en: string; es: string };
  /** Set to a path under /public once real photography exists. */
  photo: string;
  /** Service ids this specialist takes. Empty array = all services. */
  services: string[];
};

/**
 * PLACEHOLDER TEAM — names, roles and biographies are all stand-ins. Replace
 * every entry with the studio's real stylists before launch: these names are
 * offered to clients as the person who will be cutting their hair, and the
 * booking flow assigns appointments by the `id` field below.
 */
export const SPECIALISTS: Specialist[] = [
  {
    id: 'specialist-1',
    name: 'Stylist One',
    role: { en: 'Founder & Master Stylist', es: 'Fundadora y Estilista Principal' },
    bio: {
      en: 'Placeholder biography. Replace with this stylist’s real experience, specialties and years in the chair.',
      es: 'Biografía de ejemplo. Reemplazar con la experiencia real, especialidades y años de trayectoria.',
    },
    photo: '',
    services: [],
  },
  {
    id: 'specialist-2',
    name: 'Stylist Two',
    role: { en: 'Colour Specialist', es: 'Especialista en Color' },
    bio: {
      en: 'Placeholder biography. Replace with this stylist’s real experience, specialties and years in the chair.',
      es: 'Biografía de ejemplo. Reemplazar con la experiencia real, especialidades y años de trayectoria.',
    },
    photo: '',
    services: [],
  },
  {
    id: 'specialist-3',
    name: 'Stylist Three',
    role: { en: 'Cutting Specialist', es: 'Especialista en Corte' },
    bio: {
      en: 'Placeholder biography. Replace with this stylist’s real experience, specialties and years in the chair.',
      es: 'Biografía de ejemplo. Reemplazar con la experiencia real, especialidades y años de trayectoria.',
    },
    photo: '',
    services: [],
  },
];

export const ANY_SPECIALIST = 'any';
