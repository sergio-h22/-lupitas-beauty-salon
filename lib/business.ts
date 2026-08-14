export const BUSINESS = {
  name: "Lupita's Beauty Salon",
  tagline: {
    en: 'Beautiful Hair. Personalized Style. Confidence You Can Feel.',
    es: 'Cabello Hermoso. Estilo Personalizado. Confianza Que Se Siente.',
  },
  positioning: {
    en: "Anaheim's trusted beauty & hair studio providing personalized hair care and professional styling.",
    es: 'El estudio de belleza y cabello de confianza en Anaheim, con cuidado capilar personalizado y peinado profesional.',
  },
  phone: '(714) 418-8404',
  phoneHref: '+17144188404',
  email: 'hello@lupitasbeautysalon.com',
  address: {
    street: '700 W Orangewood Ave',
    city: 'Anaheim',
    state: 'CA',
    zip: '92802',
    country: 'US',
  },
  // Approximate — replace with the exact pin from your Google Business Profile.
  geo: { lat: 33.7896, lng: -117.9298 },
  siteUrl: 'https://lupitasbeautysalon.com',
  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
  },
} as const;

/**
 * Hero background video. Leave empty until real footage is in /public/video —
 * an empty value keeps the element unmounted so the page never requests a
 * file that isn't there.
 */
export const HERO_VIDEO = {
  mp4: '',
  webm: '',
  poster: '',
};

export const ADDRESS_LINE = `${BUSINESS.address.street}, ${BUSINESS.address.city}, ${BUSINESS.address.state} ${BUSINESS.address.zip}`;

export const MAPS_QUERY = encodeURIComponent(`${BUSINESS.name}, ${ADDRESS_LINE}`);

/** day: 0 = Sunday. `null` means closed. Times are 24h local. */
export const HOURS: { day: number; open: string | null; close: string | null }[] = [
  { day: 1, open: '10:00', close: '19:00' },
  { day: 2, open: null, close: null },
  { day: 3, open: '10:00', close: '19:00' },
  { day: 4, open: '10:00', close: '19:00' },
  { day: 5, open: '10:00', close: '19:00' },
  { day: 6, open: '10:00', close: '19:00' },
  { day: 0, open: '10:00', close: '19:00' },
];

export const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export function isClosedOn(dayOfWeek: number) {
  return HOURS.find((h) => h.day === dayOfWeek)?.open === null;
}
