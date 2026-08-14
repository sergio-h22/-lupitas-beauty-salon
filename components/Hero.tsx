'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useT, useLang } from '@/lib/i18n';
import { BUSINESS, HERO_VIDEO } from '@/lib/business';
import Reveal from './Reveal';

/**
 * Editorial hero.
 *
 * Composition rather than decoration: the brand line and locality sit as quiet
 * meta above a statement set at display scale, anchored to the lower-left of a
 * full-viewport frame. Anchoring low (rather than centring) is what separates
 * an art-directed page from a template — it leaves the top two thirds as
 * deliberate negative space.
 *
 * The video is deliberately not part of the initial payload: it mounts only
 * once the hero is on screen, and is skipped entirely on Save-Data or 2G/3G.
 * Until real footage exists at /public/video the ground stands on its own and
 * nothing is requested.
 */
export default function Hero() {
  const t = useT();
  const { lang } = useLang();
  const [showVideo, setShowVideo] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const hasVideo = Boolean(HERO_VIDEO.mp4 || HERO_VIDEO.webm);

  useEffect(() => {
    if (!hasVideo) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection;
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
  }, [hasVideo]);

  // Each sentence of the tagline becomes its own typeset line, with the stop
  // set in gold — one of the few places the accent is allowed to appear.
  const lines = BUSINESS.tagline[lang]
    .split(/\.\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink pb-[clamp(3rem,8vh,6rem)] pt-[calc(var(--header-h)+5rem)]"
      /* The header is sticky, so it sits *in* the flow and reserves its own
         height. Pulling the hero up by exactly that height is what lets the bar
         float transparently over the dark ground instead of over the cream
         body — without it the inverted logo and nav render cream-on-cream and
         are effectively invisible. */
      style={{ marginTop: 'calc(var(--header-h) * -1)' }}
    >
      {/* Ground: always painted, so there is never a blank frame or a shift. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(125%_95%_at_72%_12%,#2A2621_0%,#0E0D0C_62%)]"
      />

      {showVideo && hasVideo && (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-40"
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
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20"
      />

      {/* Meta rail — brand and locality, kept small so the statement can be
          large. It also gives the upper third something to hold on phones,
          where the statement is anchored low and the top would otherwise be
          a large empty field. */}
      <div className="shell absolute inset-x-0 top-[calc(var(--header-h)+1.75rem)] z-10 flex items-center justify-between gap-4">
        <Reveal className="flex items-center gap-4">
          <span className="hidden h-px w-10 bg-gold/50 sm:block" aria-hidden="true" />
          <span className="font-body text-label font-medium uppercase text-cream/55">
            <span className="hidden sm:inline">{BUSINESS.name} — </span>
            {BUSINESS.address.city}, {BUSINESS.address.state}
          </span>
        </Reveal>
        <Reveal delay={0.1} className="hidden flex-none md:block">
          <span className="font-body text-label font-medium uppercase text-gold-soft">
            {t('welcome.seHabla')}
          </span>
        </Reveal>
      </div>

      <div className="shell relative z-10">
        <h1 className="max-w-[16ch] text-[clamp(2.15rem,6.4vw,5.25rem)] font-normal leading-[1.02] tracking-[-0.03em] !text-cream">
          {lines.map((line, i) => (
            <Reveal key={line} as="span" variant="mask" delay={0.06 + i * 0.09} className="block">
              <span className="block">
                {line}
                <span className="text-gold">.</span>
              </span>
            </Reveal>
          ))}
        </h1>

        <div className="mt-10 flex flex-col gap-9 lg:mt-14 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <Reveal delay={0.34} className="max-w-measure">
            <p className="text-[0.98rem] leading-relaxed text-cream/60">
              {BUSINESS.positioning[lang]}
            </p>
          </Reveal>

          {/* Equal widths when stacked — two differently sized buttons in a
              column is the detail that makes a hero look unconsidered. */}
          <Reveal
            delay={0.42}
            className="grid flex-none grid-cols-1 gap-3 sm:auto-cols-max sm:grid-flow-col sm:gap-4"
          >
            <Link href="/book" className="btn-ondark">
              {t('hero.cta1')}
            </Link>
            <Link href="/services" className="btn-ondark-outline">
              {t('hero.cta2')}
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.5} className="mt-12 flex items-center justify-between border-t border-cream/12 pt-6">
          <a
            href={`tel:${BUSINESS.phoneHref}`}
            className="font-body text-label-lg font-medium uppercase text-cream/70 transition-colors duration-400 ease-luxe hover:text-gold-soft"
          >
            {BUSINESS.phone}
          </a>
          <span
            aria-hidden="true"
            className="hidden items-center gap-3 font-body text-label font-medium uppercase text-cream/50 sm:flex"
          >
            {t('hero.scroll')}
            <ScrollCue />
          </span>
        </Reveal>
      </div>
    </section>
  );
}

function ScrollCue() {
  return (
    <span className="relative block h-8 w-px overflow-hidden bg-cream/20">
      <span className="absolute inset-x-0 top-0 h-3 animate-[scroll-cue_2.2s_cubic-bezier(0.22,1,0.36,1)_infinite] bg-gold" />
      <style>{`@keyframes scroll-cue{0%{transform:translateY(-100%)}60%,100%{transform:translateY(800%)}}`}</style>
    </span>
  );
}
