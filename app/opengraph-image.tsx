import { ImageResponse } from 'next/og';
import { BUSINESS } from '@/lib/business';

/**
 * Generated at build time. The site previously shared with no image at all,
 * which on every social surface renders as a bare grey card — the cheapest
 * possible first impression for a brand that is trying to look expensive.
 *
 * Satori rasterises this without the app's webfonts, so the card is composed
 * to survive in system faces: the identity is carried by the disc monogram,
 * the near-black ground and the tracked-out lockup, none of which depend on
 * Bodoni or Italianno arriving. Sending the signature here would render it in
 * whatever serif the renderer happens to hold, which is worse than not
 * sending it.
 */
export const alt = `${BUSINESS.name} — hair studio in ${BUSINESS.address.city}, ${BUSINESS.address.state}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0A0A0A',
          padding: '68px 80px',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Disc + monogram, drawn rather than set — see components/Logo.tsx. */}
          <svg width="74" height="74" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#F5F2EC" />
            <path
              d="M16.4 12.4 H28.2 M23 12.4 V24.6 C23 27.9 20.7 29.9 17.6 29.9 C14.7 29.9 12.6 28.3 11.9 25.6"
              stroke="#0A0A0A"
              strokeWidth="1.6"
              fill="none"
            />
          </svg>
          {/* Satori requires an explicit display on any node with more than one
              child, so interpolated text is joined into a single string. */}
          <div
            style={{
              color: 'rgba(245,242,236,0.55)',
              fontSize: 20,
              letterSpacing: 6,
              textTransform: 'uppercase',
            }}
          >
            {`${BUSINESS.address.city}, ${BUSINESS.address.state}`}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#F5F2EC', fontSize: 96, lineHeight: 1.02, letterSpacing: -3 }}>
            {BUSINESS.name}
          </div>
          <div
            style={{
              color: '#B9AA96',
              fontSize: 34,
              marginTop: 22,
              lineHeight: 1.3,
              maxWidth: 820,
            }}
          >
            {BUSINESS.tagline.en}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(245,242,236,0.15)',
            paddingTop: 28,
            color: 'rgba(245,242,236,0.7)',
            fontSize: 22,
            letterSpacing: 2,
          }}
        >
          <div>{BUSINESS.phone}</div>
          <div style={{ color: '#B9AA96' }}>By appointment</div>
        </div>
      </div>
    ),
    size,
  );
}
