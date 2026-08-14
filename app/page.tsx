'use client';

import Link from 'next/link';
import { useT, useLang } from '@/lib/i18n';
import { BUSINESS } from '@/lib/business';
import { SERVICES } from '@/lib/services';
import Hero from '@/components/Hero';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import ServiceCard from '@/components/ServiceCard';
import BeforeAfter from '@/components/BeforeAfter';
import Specialists from '@/components/Specialists';
import Reviews from '@/components/Reviews';
import LocationSection from '@/components/LocationSection';
import Promos from '@/components/Promos';
import BookingCTA from '@/components/BookingCTA';
import PhotoPlaceholder from '@/components/PhotoPlaceholder';

export default function HomePage() {
  const t = useT();
  const { lang } = useLang();
  const popular = SERVICES.filter((s) => s.popular);

  return (
    <>
      <Hero />

      {/* Welcome */}
      <section className="py-section">
        <div className="shell grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">{t('welcome.eyebrow')}</p>
            <div className="rule-gold mt-4" />
            <h2 className="mt-6 text-[clamp(1.9rem,4.5vw,3rem)]">{t('welcome.title')}</h2>
            <p className="mt-6 leading-relaxed text-ink-muted">{t('welcome.body')}</p>
            <p className="mt-6 font-display text-[1.15rem] italic text-gold-text">
              {BUSINESS.positioning[lang]}
            </p>
            <Link href="/about" className="btn-outline mt-9">
              {t('nav.about')}
            </Link>
          </Reveal>

          <Reveal delay={0.12} className="grid grid-cols-2 gap-5">
            <PhotoPlaceholder label="Salon interior" ratio="aspect-[3/4]" />
            <PhotoPlaceholder label="Stylist at work" ratio="aspect-[3/4]" className="mt-10" />
          </Reveal>
        </div>
      </section>

      {/* Services preview */}
      <section className="bg-cream-deep py-section">
        <div className="shell">
          <SectionHeading
            eyebrow={t('services.eyebrow')}
            title={t('services.title')}
            subtitle={t('services.subtitle')}
          />
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.07}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <Link href="/services" className="btn-primary">
              {t('services.viewAll')}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Before & after */}
      <section className="py-section">
        <div className="shell">
          <SectionHeading
            eyebrow={t('gallery.eyebrow')}
            title={t('gallery.title')}
            subtitle={t('gallery.subtitle')}
          />
          <div className="mt-16 grid gap-10 md:grid-cols-2">
            <Reveal>
              <BeforeAfter label={lang === 'es' ? 'Balayage' : 'Balayage'} />
            </Reveal>
            <Reveal delay={0.1}>
              <BeforeAfter label={lang === 'es' ? 'Color y corte' : 'Color & cut'} />
            </Reveal>
          </div>
          <Reveal className="mt-12 text-center">
            <Link href="/gallery" className="btn-outline">
              {t('gallery.viewAll')}
            </Link>
          </Reveal>
        </div>
      </section>

      <Specialists />
      <Reviews />
      <Promos />
      <LocationSection />
      <BookingCTA />
    </>
  );
}
