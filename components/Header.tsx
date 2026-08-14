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

  const links = [
    { href: '/', label: t('nav.home') },
    { href: '/services', label: t('nav.services') },
    { href: '/gallery', label: t('nav.gallery') },
    { href: '/about', label: t('nav.about') },
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-250 ${
        scrolled ? 'border-ink/10 bg-cream/95 backdrop-blur' : 'border-transparent bg-cream'
      }`}
    >
      <div className="shell flex h-[72px] items-center justify-between gap-4">
        <Link href="/" aria-label={BUSINESS.name} className="flex-none">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className={`text-[0.78rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-250 ${
                  active ? 'text-gold-text' : 'text-ink hover:text-gold-text'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LangToggle lang={lang} setLang={setLang} label={t('a11y.langSwitch')} />

          <a
            href={`tel:${BUSINESS.phoneHref}`}
            className="hidden min-h-[44px] items-center gap-2 px-2 text-[0.78rem] font-semibold tracking-wide text-ink transition-colors duration-250 hover:text-gold-text sm:inline-flex"
          >
            <PhoneIcon />
            {BUSINESS.phone}
          </a>

          <Link href="/book" className="btn-primary hidden md:inline-flex">
            {t('nav.book')}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center text-ink lg:hidden"
          >
            <span className="sr-only">{open ? t('nav.close') : t('nav.menu')}</span>
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-ink/10 bg-cream lg:hidden">
          <div className="shell flex flex-col py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="min-h-[48px] border-b border-ink/5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={`tel:${BUSINESS.phoneHref}`}
              className="flex min-h-[48px] items-center gap-2 border-b border-ink/5 py-3 text-sm font-semibold text-ink sm:hidden"
            >
              <PhoneIcon />
              {BUSINESS.phone}
            </a>
            <Link href="/book" className="btn-primary mt-4">
              {t('nav.book')}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

function LangToggle({
  lang,
  setLang,
  label,
}: {
  lang: 'en' | 'es';
  setLang: (l: 'en' | 'es') => void;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex h-11 items-center border border-ink/20 text-[0.7rem] font-semibold uppercase tracking-[0.1em]"
    >
      {(['en', 'es'] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`h-full min-w-[40px] cursor-pointer px-2 transition-colors duration-250 ${
            lang === code ? 'bg-ink text-cream' : 'text-ink hover:bg-ink/5'
          }`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path strokeLinecap="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}
