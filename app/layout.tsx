import type { Metadata } from 'next';
import { Playfair_Display, Jost } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SkipLink from '@/components/SkipLink';
import MobileCallBar from '@/components/MobileCallBar';
import { BUSINESS, ADDRESS_LINE, HOURS } from '@/lib/business';

/**
 * Five weights total, down from nine.
 *
 * Playfair carries every heading at a single regular weight — a high-contrast
 * serif set large does not need bolding, and faux-bolding it is what makes a
 * display face look cheap. Jost (a geometric in the Futura lineage) replaces
 * Inter for UI and body: Inter is the default of every generated template, and
 * tracked-out uppercase is exactly where a geometric earns its keep.
 */
const display = Playfair_Display({
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
    default: "Lupita's Beauty Salon | Hair Salon in Anaheim, CA",
    template: "%s | Lupita's Beauty Salon",
  },
  description:
    "Lupita's Beauty Salon is a trusted hair and beauty studio in Anaheim, CA, minutes from Disneyland. Haircuts, color, highlights and balayage. Se habla español. Book online.",
  keywords: [
    "Lupita's Beauty Salon Anaheim",
    'hair salon Anaheim CA',
    'beauty salon near Disneyland',
    "women's haircut Anaheim",
    'hair color specialist Anaheim',
    'Orange County beauty salon',
    'salón de belleza Anaheim',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['es_US'],
    url: BUSINESS.siteUrl,
    siteName: BUSINESS.name,
    title: "Lupita's Beauty Salon | Hair Salon in Anaheim, CA",
    description:
      'Personalized hair care and professional styling in Anaheim. Haircuts, color, highlights, balayage. Book online in under a minute.',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Lupita's Beauty Salon | Hair Salon in Anaheim, CA",
    description: 'Personalized hair care and professional styling in Anaheim, CA. Book online.',
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
    '@id': `${BUSINESS.siteUrl}/#salon`,
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
