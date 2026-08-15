import type { Metadata } from 'next';
import { Bodoni_Moda, Jost } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SkipLink from '@/components/SkipLink';
import MobileCallBar from '@/components/MobileCallBar';
import { BUSINESS, ADDRESS_LINE, HOURS } from '@/lib/business';

/**
 * Two faces, five weights, each with exactly one job.
 *
 * Bodoni Moda is a Didone — the fashion-plate serif, and the closest type
 * relative of the stark JAESO lockup. It carries every heading at a single
 * regular weight: a high-contrast serif set large does not need bolding, and
 * faux-bolding it is what makes a display face look cheap. Jost (a geometric
 * in the Futura lineage) takes UI and body, where tracked-out uppercase is
 * exactly where a geometric earns its keep.
 *
 * There is deliberately no script face. The signature is the studio's own
 * artwork and ships as vector outlines (components/brand-art.ts), so the mark
 * cannot flash a fallback hand while a webfont loads, and no third party gets
 * to change what the brand's handwriting looks like.
 */
const display = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-display',
  display: 'swap',
});

const body = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS.siteUrl),
  title: {
    default: 'Jaeso Studio | Hair Studio in Anaheim, CA',
    template: '%s | Jaeso Studio',
  },
  description:
    'Jaeso Studio is a boutique hair studio in Anaheim, CA. Precision cutting, lived-in colour, balayage and blowouts, by appointment. Book online.',
  keywords: [
    'Jaeso Studio Anaheim',
    'hair studio Anaheim CA',
    'boutique hair salon Anaheim',
    'balayage Anaheim',
    'hair color specialist Anaheim',
    'Orange County hair studio',
    'estudio de cabello Anaheim',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['es_US'],
    url: BUSINESS.siteUrl,
    siteName: BUSINESS.name,
    title: 'Jaeso Studio | Hair Studio in Anaheim, CA',
    description:
      'Precision cutting and lived-in colour in Anaheim. Cuts, balayage, highlights and blowouts. Book online in under a minute.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaeso Studio | Hair Studio in Anaheim, CA',
    description: 'Precision cutting and lived-in colour in Anaheim, CA. Book online.',
  },
  robots: { index: true, follow: true },
};

const DAY_NAMES: Record<number, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

function schema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    '@id': `${BUSINESS.siteUrl}/#studio`,
    name: BUSINESS.name,
    description: BUSINESS.positioning.en,
    url: BUSINESS.siteUrl,
    telephone: BUSINESS.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.state,
      postalCode: BUSINESS.address.zip,
      addressCountry: BUSINESS.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.lat,
      longitude: BUSINESS.geo.lng,
    },
    openingHoursSpecification: HOURS.filter((h) => h.open).map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${DAY_NAMES[h.day]}`,
      opens: h.open,
      closes: h.close,
    })),
    areaServed: [
      { '@type': 'City', name: 'Anaheim' },
      { '@type': 'AdministrativeArea', name: 'Orange County' },
    ],
    knowsLanguage: ['en', 'es'],
    priceRange: '$$',
    currenciesAccepted: 'USD',
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        {/* Scroll reveals start at opacity 0 and are switched on by an
            IntersectionObserver. Without JS that observer never runs, so the
            resting state has to be restored here or the page reads as blank. */}
        <noscript>
          <style>{`.reveal,.reveal-mask>*,.reveal-rule{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema()) }}
        />
        <LanguageProvider>
          <SkipLink />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <MobileCallBar />
        </LanguageProvider>
      </body>
    </html>
  );
}
