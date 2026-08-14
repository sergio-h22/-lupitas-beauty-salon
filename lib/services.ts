export type Service = {
  id: string;
  category: 'cuts' | 'color' | 'treatments' | 'styling';
  name: { en: string; es: string };
  blurb: { en: string; es: string };
  /** Minutes. Drives the booking system's slot length. */
  minutes: number;
  /** Empty string renders "Quote on request" — no invented pricing. */
  price: string;
  popular?: boolean;
};

export const CATEGORIES = [
  { id: 'cuts', label: { en: 'Haircuts', es: 'Cortes de Cabello' } },
  { id: 'color', label: { en: 'Color', es: 'Color' } },
  { id: 'treatments', label: { en: 'Treatments', es: 'Tratamientos' } },
  { id: 'styling', label: { en: 'Styling', es: 'Peinados' } },
] as const;

export const SERVICES: Service[] = [
  {
    id: 'womens-haircut',
    category: 'cuts',
    name: { en: "Women's Haircut", es: 'Corte de Cabello para Mujer' },
    blurb: {
      en: 'A consultation, precision cut and finish shaped to your hair type and the way you actually style it at home.',
      es: 'Consulta, corte de precisión y acabado adaptado a tu tipo de cabello y a cómo lo peinas en casa.',
    },
    minutes: 45,
    price: '',
    popular: true,
  },
  {
    id: 'mens-haircut',
    category: 'cuts',
    name: { en: "Men's Haircut", es: 'Corte de Cabello para Hombre' },
    blurb: {
      en: 'Clipper or scissor cut, cleaned up through the neck and around the ears, finished with styling.',
      es: 'Corte con máquina o tijera, perfilado en cuello y orejas, con peinado final.',
    },
    minutes: 45,
    price: '',
  },
  {
    id: 'childrens-haircut',
    category: 'cuts',
    name: { en: "Children's Haircut", es: 'Corte de Cabello para Niños' },
    blurb: {
      en: 'Patient, unhurried cuts for kids — we work at their pace so the chair stays a good place to be.',
      es: 'Cortes pacientes y sin prisa para niños: trabajamos a su ritmo para que la silla sea un buen lugar.',
    },
    minutes: 45,
    price: '',
  },
  {
    id: 'hair-coloring',
    category: 'color',
    name: { en: 'Hair Coloring', es: 'Tinte de Cabello' },
    blurb: {
      en: 'Single-process color for grey coverage, going richer, or a full change of tone.',
      es: 'Color en un solo proceso para cubrir canas, intensificar el tono o un cambio completo.',
    },
    minutes: 120,
    price: '',
    popular: true,
  },
  {
    id: 'highlights',
    category: 'color',
    name: { en: 'Highlights', es: 'Rayitos / Luces' },
    blurb: {
      en: 'Foiled highlights placed for dimension and brightness, toned to finish.',
      es: 'Luces en papel aluminio colocadas para dar dimensión y luz, con matizado final.',
    },
    minutes: 180,
    price: '',
    popular: true,
  },
  {
    id: 'balayage',
    category: 'color',
    name: { en: 'Balayage', es: 'Balayage' },
    blurb: {
      en: 'Hand-painted, softly blended lightening that grows out gracefully without a hard line.',
      es: 'Aclarado pintado a mano y difuminado que crece de forma natural, sin línea marcada.',
    },
    minutes: 180,
    price: '',
    popular: true,
  },
  {
    id: 'hair-treatments',
    category: 'treatments',
    name: { en: 'Hair Treatments', es: 'Tratamientos Capilares' },
    blurb: {
      en: 'Deep conditioning and bond-repair treatments for hair that feels dry, stressed or over-processed.',
      es: 'Hidratación profunda y reparación para cabello seco, maltratado o muy procesado.',
    },
    minutes: 45,
    price: '',
  },
  {
    id: 'hair-extensions',
    category: 'treatments',
    name: { en: 'Hair Extensions', es: 'Extensiones de Cabello' },
    blurb: {
      en: 'Added length and fullness, colour-matched and cut in so it moves like your own hair. Consultation first.',
      es: 'Largo y volumen extra, con color igualado y corte integrado para que se mueva como tu cabello. Requiere consulta.',
    },
    minutes: 180,
    price: '',
  },
  {
    id: 'blowout',
    category: 'styling',
    name: { en: 'Blowout', es: 'Secado y Peinado' },
    blurb: {
      en: 'A smooth, full blow-dry with lasting shape — the fastest way to look freshly done.',
      es: 'Secado liso y con volumen que dura: la forma más rápida de verte recién arreglada.',
    },
    minutes: 45,
    price: '',
    popular: true,
  },
  {
    id: 'hair-styling',
    category: 'styling',
    name: { en: 'Hair Styling', es: 'Peinado' },
    blurb: {
      en: 'Curls, waves, straightening or an updo for an evening out.',
      es: 'Rizos, ondas, alaciado o recogido para una noche especial.',
    },
    minutes: 45,
    price: '',
  },
  {
    id: 'special-occasion',
    category: 'styling',
    name: { en: 'Special Occasion Hair', es: 'Peinado para Ocasiones Especiales' },
    blurb: {
      en: 'Weddings, quinceañeras, graduations and photos — styled to hold all day and photograph well.',
      es: 'Bodas, quinceañeras, graduaciones y fotos: peinados que duran todo el día y lucen en cámara.',
    },
    minutes: 120,
    price: '',
  },
];

export function serviceById(id: string) {
  return SERVICES.find((s) => s.id === id);
}
