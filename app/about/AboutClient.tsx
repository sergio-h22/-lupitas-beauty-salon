'use client';

import { useT, useLang } from '@/lib/i18n';
import { BUSINESS } from '@/lib/business';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import PhotoPlaceholder from '@/components/PhotoPlaceholder';
import Specialists from '@/components/Specialists';
import LocationSection from '@/components/LocationSection';
import BookingCTA from '@/components/BookingCTA';

const COPY = {
  story: {
    en: 'Lupita’s Beauty Salon has served Anaheim from West Orangewood Avenue, five minutes from the Disneyland Resort. The salon was built around one idea: that a haircut is a conversation before it is a service. Clients come back because they are listened to, not because they were upsold.',
    es: 'Lupita’s Beauty Salon atiende a Anaheim desde West Orangewood Avenue, a cinco minutos del Disneyland Resort. El salón se construyó sobre una idea: que un corte de cabello es una conversación antes que un servicio. Las clientas regresan porque se les escucha, no porque se les vendió de más.',
  },
  mission: {
    en: 'Lupita’s Beauty Salon is dedicated to helping every customer feel confident and beautiful through personalized hair care and professional styling.',
    es: 'Lupita’s Beauty Salon se dedica a ayudar a cada cliente a sentirse segura y hermosa mediante cuidado capilar personalizado y peinado profesional.',
  },
  experience: {
    en: 'Every appointment begins with a consultation — your hair history, what has worked, what has not, and how much time you actually want to spend styling at home. Pricing is confirmed before any work begins, so nothing on the final bill is a surprise.',
    es: 'Cada cita comienza con una consulta: el historial de tu cabello, lo que ha funcionado, lo que no, y cuánto tiempo realmente quieres dedicar al peinado en casa. El precio se confirma antes de empezar, para que nada en la cuenta final sea una sorpresa.',
  },
  values: [
    {
      title: { en: 'Personalized', es: 'Personalizado' },
      body: {
        en: 'No two heads of hair are the same, so no two appointments run the same way.',
        es: 'No hay dos cabellos iguales, así que no hay dos citas iguales.',
      },
    },
    {
      title: { en: 'Bilingual', es: 'Bilingüe' },
      body: {
        en: 'Se habla español. Explain what you want in the language you think in.',
        es: 'Se habla español. Explica lo que quieres en el idioma en que piensas.',
      },
    },
    {
      title: { en: 'Honest pricing', es: 'Precios honestos' },
      body: {
        en: 'Quoted up front, every time, before the first section is clipped.',
        es: 'Cotizado por adelantado, siempre, antes del primer corte.',
      },
    },
  ],
};

export default function AboutClient() {
  const t = useT();
  const { lang } = useLang();

  return (
    <>
      <PageHeader
        eyebrow={t('nav.about')}
        title={t('welcome.title')}
        subtitle={BUSINESS.positioning[lang]}
      />

      <section className="py-section">
        <div className="shell grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">{lang === 'es' ? 'Nuestra historia' : 'Our story'}</p>
            <div className="rule-gold mt-4" />
            <p className="mt-8 leading-relaxed text-ink-muted">{COPY.story[lang]}</p>
            <blockquote className="mt-8 border-l-2 border-gold pl-6 font-display text-[1.2rem] italic leading-relaxed text-ink">
              {COPY.mission[lang]}
            </blockquote>
            <p className="mt-8 leading-relaxed text-ink-muted">{COPY.experience[lang]}</p>
          </Reveal>

          <Reveal delay={0.12} className="grid grid-cols-2 gap-5">
            <PhotoPlaceholder label="Salon entrance" ratio="aspect-[3/4]" />
            <PhotoPlaceholder label="Hair stations" ratio="aspect-[3/4]" className="mt-10" />
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-deep py-section">
        <div className="shell">
          <ul className="grid gap-8 md:grid-cols-3">
            {COPY.values.map((v, i) => (
              <Reveal as="li" key={v.title.en} delay={i * 0.08} className="text-center">
                <h3 className="font-display text-[1.35rem]">{v.title[lang]}</h3>
                <div className="rule-gold mx-auto mt-4" />
                <p className="mt-5 text-sm leading-relaxed text-ink-muted">{v.body[lang]}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Specialists />
      <LocationSection />
      <BookingCTA />
    </>
  );
}
