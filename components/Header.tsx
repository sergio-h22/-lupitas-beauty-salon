'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLang, useT } from '@/lib/i18n';
import { BUSINESS } from '@/lib/business';
import Logo from './Logo';

export default function Header() {
  const t = useT();
  const { lang, setLang } = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // The drawer covers the page, so the page behind it must not scroll — and
  // Escape has to close it, or keyboard users are trapped.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const links = [
    { href: '/', label: t('nav.home') },
    { href: '/services', label: t('nav.services') },
    { href: '/gallery', label: t('nav.gallery') },
    { href: '/about', label: t('nav.about') },
  ];

  // Only the homepage opens on a dark hero, so only there can the bar sit
  // transparent and inverted before the first scroll.
  const overHero = pathname === '/' && !scrolled && !open;

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-[background-color,border-color] duration-600 ease-luxe ${
          overHero
            ? 'border-transparent bg-transparent'
            : 'border-ink/10 bg-bone/90 backdrop-blur-md'
        }`}
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link
            href="/"
            aria-label={BUSINESS.name}
            className="flex-none transition-opacity duration-400 ease-luxe hover:opacity-70"
          >
            <Logo tone={overHero ? 'light' : 'dark'} />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-10 lg:flex">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? 'page' : undefined}
                  className={`group relative py-2 font-body text-label font-medium uppercase transition-colors duration-400 ease-luxe ${
                    overHero ? 'text-bone/75 hover:text-bone' : 'text-ink-mid hover:text-ink'
                  } ${active ? (overHero ? '!text-bone' : '!text-ink') : ''}`}
                >
                  {l.label}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-0.5 left-0 h-px w-full origin-right bg-sand transition-transform duration-600 ease-luxe group-hover:origin-left group-hover:scale-x-100 ${
                      active ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 sm:gap-5">
            <LangToggle lang={lang} setLang={setLang} label={t('a11y.langSwitch')} light={overHero} />

            <a
              href={`tel:${BUSINESS.phoneHref}`}
              className={`hidden min-h-[44px] items-center font-body text-label font-medium uppercase transition-colors duration-400 ease-luxe xl:inline-flex ${
                overHero ? 'text-bone/75 hover:text-bone' : 'text-ink-mid hover:text-ink'
              }`}
            >
              {BUSINESS.phone}
            </a>

            <Link
              href="/book"
              className={`hidden md:inline-flex ${overHero ? 'btn-ondark' : 'btn-primary'} !min-h-[46px] !px-6`}
            >
              {t('nav.book')}
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className={`-mr-2 inline-flex h-11 w-11 cursor-pointer items-center justify-center transition-colors duration-400 ease-luxe lg:hidden ${
                open ? 'text-bone' : overHero ? 'text-bone' : 'text-ink'
              }`}
            >
              <span className="sr-only">{open ? t('nav.close') : t('nav.menu')}</span>
              <Burger open={open} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-bleed drawer. A dark ground makes the transition feel like a
          deliberate mode change rather than a panel sliding out of a page. */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.menu')}
        aria-hidden={!open}
        className={`fixed inset-0 z-[55] bg-ink transition-[opacity,visibility] duration-600 ease-luxe lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className="flex h-full flex-col justify-between pb-[max(2rem,env(safe-area-inset-bottom))] pt-[var(--header-h)]">
          <nav aria-label="Mobile" className="shell mt-10 flex flex-col">
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                tabIndex={open ? 0 : -1}
                style={{ transitionDelay: open ? `${120 + i * 60}ms` : '0ms' }}
                className={`border-b border-bone/10 py-5 font-display text-[clamp(1.7rem,7vw,2.4rem)] text-bone transition-[opacity,transform] duration-600 ease-luxe ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
              >
                <span className="flex items-baseline gap-4">
                  <span className="serial !text-bone/30" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {l.label}
                </span>
              </Link>
            ))}
          </nav>

          <div
            style={{ transitionDelay: open ? '400ms' : '0ms' }}
            className={`shell flex flex-col gap-4 transition-[opacity,transform] duration-600 ease-luxe ${
              open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <Link href="/book" tabIndex={open ? 0 : -1} className="btn-ondark w-full">
              {t('nav.book')}
            </Link>
            <a
              href={`tel:${BUSINESS.phoneHref}`}
              tabIndex={open ? 0 : -1}
              className="btn-ondark-outline w-full"
            >
              {BUSINESS.phone}
            </a>
            <p className="mt-2 text-center font-body text-label font-medium uppercase text-sand-soft">
              {t('welcome.appointment')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function LangToggle({
  lang,
  setLang,
  label,
  light,
}: {
  lang: 'en' | 'es';
  setLang: (l: 'en' | 'es') => void;
  label: string;
  light: boolean;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`flex h-10 items-center border font-body text-[0.62rem] font-medium uppercase tracking-[0.14em] transition-colors duration-600 ease-luxe ${
        light ? 'border-bone/25' : 'border-ink/15'
      }`}
    >
      {(['en', 'es'] as const).map((code) => {
        const on = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={on}
            className={`h-full min-w-[36px] cursor-pointer px-2 transition-colors duration-400 ease-luxe ${
              on
                ? light
                  ? 'bg-bone text-ink'
                  : 'bg-ink text-bone'
                : light
                  ? 'text-bone/60 hover:text-bone'
                  : 'text-ink-muted hover:text-ink'
            }`}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

/** Two rules that cross into an X — cheaper than swapping two icons, and the
 *  motion itself tells the user what the control just did. */
function Burger({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative block h-4 w-6">
      <span
        className={`absolute left-0 block h-px w-full bg-current transition-transform duration-400 ease-luxe ${
          open ? 'top-1/2 rotate-45' : 'top-1'
        }`}
      />
      <span
        className={`absolute left-0 block h-px w-full bg-current transition-transform duration-400 ease-luxe ${
          open ? 'top-1/2 -rotate-45' : 'top-[calc(100%-0.25rem)]'
        }`}
      />
    </span>
  );
}
