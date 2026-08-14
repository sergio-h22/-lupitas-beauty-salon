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

// Placeholder names and copy — replace with the real team before launch.
export const SPECIALISTS: Specialist[] = [
  {
    id: 'specialist-1',
    name: 'Specialist One',
    role: { en: 'Master Stylist & Owner', es: 'Estilista Principal y Propietaria' },
    bio: {
      en: 'Placeholder biography. Replace with this stylist’s real experience, specialties and years in the chair.',
      es: 'Biografía de ejemplo. Reemplazar con la experiencia real, especialidades y años de trayectoria.',
    },
    photo: '',
    services: [],
  },
  {
    id: 'specialist-2',
    name: 'Specialist Two',
    role: { en: 'Color Specialist', es: 'Especialista en Color' },
    bio: {
      en: 'Placeholder biography. Replace with this stylist’s real experience, specialties and years in the chair.',
      es: 'Biografía de ejemplo. Reemplazar con la experiencia real, especialidades y años de trayectoria.',
    },
    photo: '',
    services: [],
  },
  {
    id: 'specialist-3',
    name: 'Specialist Three',
    role: { en: 'Stylist', es: 'Estilista' },
    bio: {
      en: 'Placeholder biography. Replace with this stylist’s real experience, specialties and years in the chair.',
      es: 'Biografía de ejemplo. Reemplazar con la experiencia real, especialidades y años de trayectoria.',
    },
    photo: '',
    services: [],
  },
];

export const ANY_SPECIALIST = 'any';
