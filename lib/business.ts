/**
 * Single source of truth for everything the studio can change without a
 * developer. Two categories live here and they are not the same:
 *
 *   Confirmed — name and city come from the studio's own profile.
 *   PLACEHOLDER — phone, email, street, ZIP, geo and domain are stand-ins and
 *   are marked as such below. The phone number is deliberately in the reserved
 *   555-01xx range so it can never dial a real stranger if it ships by mistake.
 *   Replace every line marked PLACEHOLDER before launch; nothing else in the
 *   codebase hardcodes these values.
 */
export const BUSINESS = {
  name: 'Jaeso Studio',
  tagline: {
    en: 'Considered Cuts. Lived-In Colour. One Chair at a Time.',
    es: 'Cortes Pensados. Color Que Se Vive. Una Silla a la Vez.',
  },
  positioning: {
    en: 'A boutique hair studio in Anaheim, California — precision cutting, lived-in colour and unhurried appointments by design.',
    es: 'Un estudio de cabello boutique en Anaheim, California: cortes de precisión, color natural y citas sin prisa, por diseño.',
  },
  // PLACEHOLDER — reserved 555-01xx number. Replace with the studio's line.
  phone: '(714) 555-0142',
  phoneHref: '+17145550142',
  // PLACEHOLDER — replace with the studio's real inbox.
  email: 'hello@jaesostudio.com',
  address: {
    // PLACEHOLDER — replace with the studio's street address.
    street: '000 Placeholder Ave, Suite 000',
    city: 'Anaheim',
    state: 'CA',
    // PLACEHOLDER — replace with the studio's ZIP.
    zip: '92805',
    country: 'US',
  },
  // PLACEHOLDER — city centroid. Replace with the exact pin from the
  // studio's Google Business Profile, or the map link will land down the road.
  geo: { lat: 33.8353, lng: -117.9145 },
  // PLACEHOLDER — replace with the live domain before launch.
  siteUrl: 'https://jaesostudio.com',
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

/**
 * PLACEHOLDER SCHEDULE — day: 0 = Sunday. `null` means closed, and the
 * booking flow reads it directly, so a wrong line here sells appointments on
 * a day the studio is shut. Confirm all seven before launch.
 *
 * Times are 24h local.
 */
export const HOURS: { day: number; open: string | null; close: string | null }[] = [
  { day: 1, open: null, close: null },
  { day: 2, open: '10:00', close: '19:00' },
  { day: 3, open: '10:00', close: '19:00' },
  { day: 4, open: '10:00', close: '20:00' },
  { day: 5, open: '10:00', close: '20:00' },
  { day: 6, open: '09:00', close: '17:00' },
  { day: 0, open: null, close: null },
];

export const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export function isClosedOn(dayOfWeek: number) {
  return HOURS.find((h) => h.day === dayOfWeek)?.open === null;
}
