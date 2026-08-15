'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Lang = 'en' | 'es';

const DICT = {
  nav: {
    home: { en: 'Home', es: 'Inicio' },
    services: { en: 'Services', es: 'Servicios' },
    gallery: { en: 'Gallery', es: 'Galería' },
    about: { en: 'About', es: 'Nosotros' },
    book: { en: 'Book Appointment', es: 'Reservar Cita' },
    call: { en: 'Call', es: 'Llamar' },
    menu: { en: 'Menu', es: 'Menú' },
    close: { en: 'Close', es: 'Cerrar' },
  },
  hero: {
    cta1: { en: 'Book Your Appointment', es: 'Reserva Tu Cita' },
    cta2: { en: 'View Services', es: 'Ver Servicios' },
    scroll: { en: 'Scroll', es: 'Desliza' },
  },
  /** Short-form versions of facts already stated elsewhere on the page, cut
   *  down to fit the trust band that sits directly beneath the hero. */
  trust: {
    appointment: { en: 'By appointment only', es: 'Solo con cita previa' },
    oneChair: { en: 'One guest at a time', es: 'Una clienta a la vez' },
    consult: { en: 'Every visit starts with a consultation', es: 'Cada visita empieza con una consulta' },
    quickBook: { en: 'Book online in a minute', es: 'Reserva en línea en un minuto' },
  },
  welcome: {
    eyebrow: { en: 'Welcome', es: 'Bienvenida' },
    title: { en: 'A studio built around one chair at a time', es: 'Un estudio construido alrededor de una silla a la vez' },
    body: {
      en: 'Jaeso Studio is a boutique hair studio in Anaheim. We book one guest at a time, which means the room is yours, the pace is yours, and nobody is being finished off in the next chair. We take the time to understand your hair before we ever pick up the scissors.',
      es: 'Jaeso Studio es un estudio de cabello boutique en Anaheim. Atendemos a una clienta a la vez: el espacio es tuyo, el ritmo es tuyo y nadie está siendo terminado a toda prisa en la silla de al lado. Nos tomamos el tiempo de entender tu cabello antes de tomar las tijeras.',
    },
    appointment: { en: 'By appointment', es: 'Con cita previa' },
  },
  services: {
    eyebrow: { en: 'Services', es: 'Servicios' },
    title: { en: 'What we do', es: 'Lo que hacemos' },
    subtitle: {
      en: 'Every appointment starts with a consultation. Prices are given up front, before any work begins.',
      es: 'Cada cita comienza con una consulta. Los precios se dan por adelantado, antes de empezar.',
    },
    all: { en: 'All Services', es: 'Todos los Servicios' },
    viewAll: { en: 'View full service menu', es: 'Ver menú completo de servicios' },
    book: { en: 'Book', es: 'Reservar' },
    quote: { en: 'Quote on request', es: 'Precio a consultar' },
    popular: { en: 'Popular', es: 'Popular' },
    min: { en: 'min', es: 'min' },
    hr: { en: 'hr', es: 'h' },
  },
  gallery: {
    eyebrow: { en: 'Gallery', es: 'Galería' },
    title: { en: 'Before & after', es: 'Antes y después' },
    subtitle: {
      en: 'Real transformations from the chair. Drag the handle to compare.',
      es: 'Transformaciones reales. Arrastra para comparar.',
    },
    before: { en: 'Before', es: 'Antes' },
    after: { en: 'After', es: 'Después' },
    viewAll: { en: 'View full gallery', es: 'Ver galería completa' },
    placeholder: {
      en: 'Photography coming soon',
      es: 'Fotografía próximamente',
    },
  },
  team: {
    eyebrow: { en: 'Our Team', es: 'Nuestro Equipo' },
    title: { en: 'Meet the stylists', es: 'Conoce a las estilistas' },
    bookWith: { en: 'Book with', es: 'Reservar con' },
  },
  reviews: {
    eyebrow: { en: 'Reviews', es: 'Reseñas' },
    title: { en: 'What our clients say', es: 'Lo que dicen nuestras clientas' },
    placeholder: {
      en: 'Review placeholder — replace with a real Google review once collected.',
      es: 'Reseña de ejemplo — reemplazar con una reseña real de Google.',
    },
  },
  location: {
    eyebrow: { en: 'Visit Us', es: 'Visítanos' },
    title: { en: 'Find the studio', es: 'Encuentra el estudio' },
    hours: { en: 'Hours', es: 'Horario' },
    closed: { en: 'Closed', es: 'Cerrado' },
    openNow: { en: 'Open now', es: 'Abierto ahora' },
    closedNow: { en: 'Closed now', es: 'Cerrado ahora' },
    directions: { en: 'Get Directions', es: 'Cómo Llegar' },
    callUs: { en: 'Call Us', es: 'Llámanos' },
    parking: {
      en: 'Studio hours are appointment hours — the door is answered for booked guests.',
      es: 'El horario del estudio es horario de citas: abrimos para clientas con reserva.',
    },
  },
  cta: {
    title: { en: 'Ready when you are', es: 'Listas cuando tú lo estés' },
    body: {
      en: 'Book online in under a minute — no account needed. Prefer to talk it through? Call us and we’ll help you choose.',
      es: 'Reserva en línea en menos de un minuto, sin necesidad de cuenta. ¿Prefieres hablar? Llámanos y te ayudamos a elegir.',
    },
  },
  booking: {
    title: { en: 'Book an appointment', es: 'Reservar una cita' },
    subtitle: { en: 'No account needed. Takes about a minute.', es: 'Sin cuenta. Toma alrededor de un minuto.' },
    step: { en: 'Step', es: 'Paso' },
    of: { en: 'of', es: 'de' },
    step1: { en: 'Choose a service', es: 'Elige un servicio' },
    step2: { en: 'Choose a specialist', es: 'Elige una especialista' },
    step3: { en: 'Choose a date', es: 'Elige una fecha' },
    step4: { en: 'Choose a time', es: 'Elige una hora' },
    step5: { en: 'Your details', es: 'Tus datos' },
    anyone: { en: 'No preference', es: 'Sin preferencia' },
    anyoneNote: { en: 'We’ll assign the first available specialist', es: 'Asignaremos la primera especialista disponible' },
    back: { en: 'Back', es: 'Atrás' },
    next: { en: 'Continue', es: 'Continuar' },
    confirm: { en: 'Confirm Appointment', es: 'Confirmar Cita' },
    name: { en: 'Full name', es: 'Nombre completo' },
    phone: { en: 'Phone number', es: 'Número de teléfono' },
    emailLabel: { en: 'Email', es: 'Correo electrónico' },
    notes: { en: 'Notes (optional)', es: 'Notas (opcional)' },
    notesHint: {
      en: 'Anything we should know — hair history, allergies, what you’re hoping for.',
      es: 'Algo que debamos saber: historial del cabello, alergias, lo que buscas.',
    },
    required: { en: 'Required', es: 'Obligatorio' },
    invalidPhone: { en: 'Enter a valid phone number', es: 'Ingresa un número de teléfono válido' },
    invalidEmail: { en: 'Enter a valid email address', es: 'Ingresa un correo electrónico válido' },
    noSlots: { en: 'No times available on this day', es: 'No hay horarios disponibles ese día' },
    closedDay: { en: 'The studio is closed on this day', es: 'El estudio está cerrado ese día' },
    summary: { en: 'Your appointment', es: 'Tu cita' },
    labelService: { en: 'Service', es: 'Servicio' },
    labelDate: { en: 'Date', es: 'Fecha' },
    labelTime: { en: 'Time', es: 'Hora' },
    labelSpecialist: { en: 'Specialist', es: 'Especialista' },
    done: { en: 'You’re booked', es: 'Tu cita está reservada' },
    doneBody: {
      en: 'We’ve saved your appointment. You’ll get a confirmation shortly.',
      es: 'Hemos guardado tu cita. Recibirás una confirmación en breve.',
    },
    demoNotice: {
      en: 'Demo mode: this appointment is saved in your browser only. Connect a database and messaging provider to send real confirmations.',
      es: 'Modo demo: esta cita se guarda solo en tu navegador. Conecta una base de datos y un proveedor de mensajería para enviar confirmaciones reales.',
    },
    another: { en: 'Book another', es: 'Reservar otra' },
    addCalendar: { en: 'Add to calendar', es: 'Agregar al calendario' },
    with: { en: 'with', es: 'con' },
  },
  newsletter: {
    title: { en: 'Get beauty tips & special offers', es: 'Recibe consejos de belleza y ofertas' },
    body: {
      en: 'Occasional emails about promotions and seasonal looks. No spam, unsubscribe anytime.',
      es: 'Correos ocasionales sobre promociones y looks de temporada. Sin spam, cancela cuando quieras.',
    },
    placeholder: { en: 'your@email.com', es: 'tu@correo.com' },
    submit: { en: 'Sign Up', es: 'Suscribirse' },
    thanks: { en: 'Thank you — you’re on the list.', es: 'Gracias — ya estás en la lista.' },
  },
  promos: {
    eyebrow: { en: 'Offers', es: 'Ofertas' },
    newClient: { en: 'New Client Special', es: 'Especial de Cliente Nueva' },
    newClientBody: {
      en: 'Placeholder offer — set your own new-customer discount here.',
      es: 'Oferta de ejemplo — define aquí tu descuento para clientes nuevas.',
    },
    referral: { en: 'Referral Discount', es: 'Descuento por Referido' },
    referralBody: {
      en: 'Placeholder offer — reward clients who send a friend.',
      es: 'Oferta de ejemplo — premia a quienes recomienden a una amiga.',
    },
    seasonal: { en: 'Seasonal Promotion', es: 'Promoción de Temporada' },
    seasonalBody: {
      en: 'Placeholder offer — use for the holiday and event season.',
      es: 'Oferta de ejemplo — úsala para fiestas y temporada de eventos.',
    },
  },
  footer: {
    rights: { en: 'All rights reserved.', es: 'Todos los derechos reservados.' },
    social: { en: 'Follow us', es: 'Síguenos' },
    socialSoon: { en: 'Coming soon', es: 'Próximamente' },
  },
  a11y: {
    skip: { en: 'Skip to main content', es: 'Saltar al contenido principal' },
    langSwitch: { en: 'Switch language', es: 'Cambiar idioma' },
    compareSlider: { en: 'Before and after comparison slider', es: 'Control de comparación antes y después' },
  },
} as const;

type Dict = typeof DICT;

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'en',
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const stored = window.localStorage.getItem('jaeso-lang') as Lang | null;
    if (stored === 'en' || stored === 'es') {
      setLangState(stored);
      return;
    }
    if (navigator.language?.toLowerCase().startsWith('es')) setLangState('es');
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem('jaeso-lang', l);
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/** t('nav.services') → localized string */
export function useT() {
  const { lang } = useLang();
  return function t(path: string): string {
    const parts = path.split('.');
    let node: unknown = DICT;
    for (const p of parts) {
      node = (node as Record<string, unknown>)?.[p];
      if (node === undefined) return path;
    }
    const leaf = node as { en: string; es: string };
    return leaf[lang] ?? leaf.en;
  };
}

/** For picking the right half of a {en, es} pair stored in data files. */
export function useLocalized() {
  const { lang } = useLang();
  return function pick(pair: { en: string; es: string }) {
    return pair[lang] ?? pair.en;
  };
}
