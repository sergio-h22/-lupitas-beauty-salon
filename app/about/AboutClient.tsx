'use client';

import { useT, useLang } from '@/lib/i18n';
import { BUSINESS } from '@/lib/business';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import PhotoPlaceholder from '@/components/PhotoPlaceholder';
import Specialists from '@/components/Specialists';
import LocationSection from '@/components/LocationSection';
import BookingCTA from '@/components/BookingCTA';

/**
 * PLACEHOLDER NARRATIVE. The structure is right — story, mission, method,
 * three values — but every sentence below describes a studio in general
 * rather than this one. Replace with the founder's own account before launch.
 */
const COPY = {
  story: {
    en: 'Jaeso Studio is a small hair studio in Anaheim, California, built around a single idea: that a haircut is a conversation before it is a service. One guest is booked at a time, so an appointment is never squeezed between two others. Clients come back because they were listened to, not because they were upsold.',
    es: 'Jaeso Studio es un pequeño estudio de cabello en Anaheim, California, construido sobre una idea: que un corte de cabello es una conversación antes que un servicio. Se reserva a una clienta a la vez, así que ninguna cita queda apretada entre otras dos. Las clientas regresan porque se les escuchó, no porque se les vendió de más.',
  },
  mission: {
    en: 'Cut with intention, coloured to live in, and finished at a pace that leaves room to change your mind.',
    es: 'Cortado con intención, con color para vivir en él, y terminado a un ritmo que deja espacio para cambiar de opinión.',
  },
  experience: {
    en: 'Every appointment begins with a consultation — your hair history, what has worked, what has not, and how much time you actually want to spend styling at home. Pricing is confirmed before any work begins, so nothing on the final bill is a surprise.',
    es: 'Cada cita comienza con una consulta: el historial de tu cabello, lo que ha funcionado, lo que no, y cuánto tiempo realmente quieres dedicar al peinado en casa. El precio se confirma antes de empezar, para que nada en la cuenta final sea una sorpresa.',
  },
  values: [
    {
      title: { en: 'One at a time', es: 'Una a la vez' },
      body: {
        en: 'A single guest per slot. The room, the mirror and the hour are yours.',
        es: 'Una sola clienta por turno. El espacio, el espejo y la hora son tuyos.',
      },
    },
    {
      title: { en: 'Built to grow out', es: 'Hecho para crecer' },
      body: {
        en: 'Colour and shape placed so month four still looks deliberate, not overdue.',
        es: 'Color y forma pensados para que el cuarto mes siga viéndose intencional, no vencido.',
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

      <section className="py-section-lg">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <Reveal className="flex items-center gap-4">
              <span className="serial" aria-hidden="true">
                01
              </span>
              <span aria-hidden="true" className="h-px w-8 bg-ink/20" />
              <span className="eyebrow">{lang === 'es' ? 'Nuestra historia' : 'Our story'}</span>
            </Reveal>

            <Reveal delay={0.1} className="mt-8 max-w-prose leading-relaxed text-ink-muted">
              {COPY.story[lang]}
            </Reveal>

            <Reveal delay={0.18}>
              <blockquote className="mt-10 border-l border-sand pl-6 font-display text-[clamp(1.25rem,2.6vw,1.7rem)] leading-snug text-ink">
                {COPY.mission[lang]}
              </blockquote>
            </Reveal>

            <Reveal delay={0.24} className="mt-10 max-w-prose leading-relaxed text-ink-muted">
              {COPY.experience[lang]}
            </Reveal>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:gap-7 lg:col-span-5">
            <Reveal>
              <PhotoPlaceholder
                label={lang === 'es' ? 'Entrada del estudio' : 'Studio entrance'}
                ratio="aspect-[3/4]"
                sizes="(min-width: 1024px) 21vw, 45vw"
              />
            </Reveal>
            <Reveal delay={0.14} className="mt-10 sm:mt-16">
              <PhotoPlaceholder
                label={lang === 'es' ? 'Estaciones de trabajo' : 'Hair stations'}
                ratio="aspect-[3/4]"
                sizes="(min-width: 1024px) 21vw, 45vw"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-bone-deep py-section">
        <div className="shell">
          <Reveal className="flex items-center gap-4">
            <span className="serial" aria-hidden="true">
              02
            </span>
            <span aria-hidden="true" className="h-px w-8 bg-ink/20" />
            <span className="eyebrow">{lang === 'es' ? 'Lo que nos guía' : 'What guides us'}</span>
          </Reveal>

          <ul className="mt-10 grid border-t border-ink/10 md:grid-cols-3">
            {COPY.values.map((v, i) => (
              <Reveal
                as="li"
                key={v.title.en}
                delay={i * 0.08}
                className={`border-b border-ink/10 py-9 md:border-b-0 md:py-12 ${
                  i > 0 ? 'md:border-l md:border-ink/10 md:pl-10' : 'md:pr-10'
                } ${i === 1 ? 'md:px-10' : ''}`}
              >
                <span className="serial" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 text-display-sm">{v.title[lang]}</h3>
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-muted">
                  {v.body[lang]}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Specialists index="03" />
      <LocationSection index="04" />
      <BookingCTA />
    </>
  );
}
