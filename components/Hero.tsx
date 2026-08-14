'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useT, useLang } from '@/lib/i18n';
import { BUSINESS, HERO_VIDEO } from '@/lib/business';

/**
 * The hero video is deliberately not part of the initial payload: it mounts
 * only after the hero is visible, and is skipped entirely on Save-Data or
 * 2G/3G. Until a real file exists at /public/video/hero.mp4 the gradient
 * ground stands in on its own.
 */
export default function Hero() {
  const t = useT();
  const { lang } = useLang();
  const reduced = useReducedMotion();
  const [showVideo, setShowVideo] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const hasVideo = Boolean(HERO_VIDEO.mp4 || HERO_VIDEO.webm);

  useEffect(() => {
    if (reduced || !hasVideo) return;

    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
      .connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /2g|3g/.test(conn.effectiveType)) return;

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowVideo(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, hasVideo]);

  const fade = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      ref={ref}
      className="relative flex min-h-[clamp(560px,86vh,860px)] items-center overflow-hidden bg-ink"
    >
      {/* Ground: always painted, so there is never a blank frame or layout shift. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_20%,#2A2724_0%,#111111_60%)]"
      />

      {showVideo && hasVideo && (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={HERO_VIDEO.poster || undefined}
          aria-hidden="true"
          tabIndex={-1}
        >
          {HERO_VIDEO.webm && <source src={HERO_VIDEO.webm} type="video/webm" />}
          {HERO_VIDEO.mp4 && <source src={HERO_VIDEO.mp4} type="video/mp4" />}
        </video>
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25"
      />

      <div className="shell relative py-24">
        <motion.p {...fade(0.05)} className="eyebrow !text-gold">
          {BUSINESS.address.city}, {BUSINESS.address.state}
        </motion.p>

        <motion.h1
          {...fade(0.15)}
          className="mt-6 max-w-4xl text-[clamp(2.6rem,7vw,5rem)] font-medium !text-cream"
        >
          {BUSINESS.name}
        </motion.h1>

        <motion.p
          {...fade(0.28)}
          className="mt-6 max-w-xl font-display text-[clamp(1.1rem,2.4vw,1.6rem)] italic leading-snug text-gold"
        >
          {BUSINESS.tagline[lang]}
        </motion.p>

        <motion.div {...fade(0.4)} className="mt-10 flex flex-wrap gap-4">
          <Link href="/book" className="btn-ondark">
            {t('hero.cta1')}
          </Link>
          <Link
            href="/services"
            className="btn border border-cream/35 text-cream hover:border-cream hover:bg-cream hover:text-ink"
          >
            {t('hero.cta2')}
          </Link>
        </motion.div>

        <motion.p {...fade(0.5)} className="mt-8 text-sm text-cream/60">
          {t('welcome.seHabla')} &nbsp;·&nbsp;{' '}
          <a href={`tel:${BUSINESS.phoneHref}`} className="font-semibold text-cream hover:text-gold">
            {BUSINESS.phone}
          </a>
        </motion.p>
      </div>
    </section>
  );
}
