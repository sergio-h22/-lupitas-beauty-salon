'use client';

import Link from 'next/link';
import { useT, useLang } from '@/lib/i18n';
import { BUSINESS } from '@/lib/business';
import { SERVICES } from '@/lib/services';
import Hero from '@/components/Hero';
import TrustBand from '@/components/TrustBand';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import ServiceIndex from '@/components/ServiceIndex';
import BeforeAfter from '@/components/BeforeAfter';
import Specialists from '@/components/Specialists';
import Reviews from '@/components/Reviews';
import LocationSection from '@/components/LocationSection';
import Promos from '@/components/Promos';
import BookingCTA from '@/components/BookingCTA';
import PhotoPlaceholder from '@/components/PhotoPlaceholder';

/**
 * Section rhythm is deliberately uneven — an asymmetric split, then a
 * full-width index, then a two-up, then a dark band. A page where every
 * section is a centred heading over a grid is what reads as templated,
 * however good the individual pieces are.
 */
export default function HomePage() {
  const t = useT();
  const { lang } = useLang();
  const popular = SERVICES.filter((s) => s.popular);

  return (
    <>
      <Hero />
      <TrustBand />

      {/* 01 — The studio. Asymmetric: type holds the left third, photography
          steps down the right in an offset pair. */}
      <section className="py-section-lg">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeading
              index="01"
              eyebrow={t('welcome.eyebrow')}
              title={t('welcome.title')}
              align="left"
            />
            <Reveal delay={0.22} className="mt-8 max-w-prose leading-relaxed text-ink-muted">
              {t('welcome.body')}
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-8 border-l border-sand pl-5 font-display text-[1.15rem] italic leading-relaxed text-ink">
                {BUSINESS.positioning[lang]}
              </p>
            </Reveal>
            <Reveal delay={0.36} className="mt-10">
              <Link href="/about" className="btn-quiet">
                {t('nav.about')}
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:gap-7 lg:col-span-7">
            <Reveal>
              <PhotoPlaceholder
                label={lang === 'es' ? 'Interior del estudio' : 'Studio interior'}
                ratio="aspect-[3/4]"
                sizes="(min-width: 1024px) 29vw, 45vw"
              />
            </Reveal>
            <Reveal delay={0.14} className="mt-10 sm:mt-16">
              <PhotoPlaceholder
                label={lang === 'es' ? 'Estilista trabajando' : 'Stylist at work'}
                ratio="aspect-[3/4]"
                sizes="(min-width: 1024px) 29vw, 45vw"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 02 — The menu, set as an index rather than a card grid. */}
      <section className="bg-bone-deep py-section">
        <div className="shell">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              index="02"
              eyebrow={t('services.eyebrow')}
              title={t('services.title')}
              subtitle={t('services.subtitle')}
              align="left"
            />
            <Reveal delay={0.2} className="flex-none">
              <Link href="/services" className="btn-quiet">
                {t('services.viewAll')}
              </Link>
            </Reveal>
          </div>

          <div className="mt-14 md:mt-20">
            <ServiceIndex services={popular} />
          </div>
        </div>
      </section>

      {/* 03 — Proof of craft. */}
      <section className="py-section">
        <div className="shell">
          <SectionHeading
            index="03"
            eyebrow={t('gallery.eyebrow')}
            title={t('gallery.title')}
            subtitle={t('gallery.subtitle')}
            align="left"
          />
          <div className="mt-14 grid gap-8 md:mt-20 md:grid-cols-2 md:gap-10">
            <Reveal>
              <BeforeAfter label="Balayage" />
            </Reveal>
            <Reveal delay={0.12}>
              <BeforeAfter label={lang === 'es' ? 'Color y corte' : 'Color & cut'} />
            </Reveal>
          </div>
          <Reveal delay={0.2} className="mt-12">
            <Link href="/gallery" className="btn-quiet">
              {t('gallery.viewAll')}
            </Link>
          </Reveal>
        </div>
      </section>

      <Specialists index="04" />
      <Reviews index="05" />
      <Promos index="06" />
      <LocationSection index="07" />
      <BookingCTA />
    </>
  );
}
