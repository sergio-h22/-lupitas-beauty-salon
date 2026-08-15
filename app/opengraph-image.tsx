import { ImageResponse } from 'next/og';
import { BUSINESS } from '@/lib/business';

/**
 * Generated at build time. The site previously shared with no image at all,
 * which on every social surface renders as a bare grey card — the cheapest
 * possible first impression for a brand that is trying to look expensive.
 */
export const alt = `${BUSINESS.name} — hair salon in ${BUSINESS.address.city}, ${BUSINESS.address.state}`;
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
          background: 'radial-gradient(125% 95% at 72% 12%, #2A2621 0%, #0E0D0C 62%)',
          padding: '72px 80px',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 56, height: 1, background: '#C9A227' }} />
          {/* Satori requires an explicit display on any node with more than one
              child, so interpolated text is joined into a single string. */}
          <div
            style={{
              color: 'rgba(250,247,241,0.55)',
              fontSize: 20,
              letterSpacing: 6,
              textTransform: 'uppercase',
            }}
          >
            {`${BUSINESS.address.city}, ${BUSINESS.address.state}`}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#FAF7F1', fontSize: 92, lineHeight: 1.02, letterSpacing: -3 }}>
            {BUSINESS.name}
          </div>
          <div
            style={{
              color: '#E0C877',
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
            borderTop: '1px solid rgba(250,247,241,0.15)',
            paddingTop: 28,
            color: 'rgba(250,247,241,0.7)',
            fontSize: 22,
            letterSpacing: 2,
          }}
        >
          <div>{BUSINESS.phone}</div>
          <div style={{ color: '#E0C877' }}>Se habla español</div>
        </div>
      </div>
    ),
    size,
  );
}
