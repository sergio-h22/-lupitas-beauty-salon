import { ImageResponse } from 'next/og';
import { BUSINESS } from '@/lib/business';
import { WORDMARK, SWASH } from '@/components/brand-art';

/**
 * Generated at build time. The site previously shared with no image at all,
 * which on every social surface renders as a bare grey card — the cheapest
 * possible first impression for a brand that is trying to look expensive.
 *
 * Satori rasterises this without the app's webfonts, which is exactly why the
 * mark is shipped as vector outlines: the signature draws here identically to
 * how it draws in the header, where a live script face would have rendered as
 * whatever serif the renderer happened to hold. Only the supporting copy falls
 * back to a system face, and it is set in sizes where that does not read as a
 * mistake.
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

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* The mark itself, at the scale the card can afford. */}
          <svg width="760" height="332" viewBox="-4 -10 348 152">
            <g transform="translate(21.1,83.4)">
              <path fill="#F5F2EC" d={WORDMARK} />
            </g>
            <path fill="none" stroke="#F5F2EC" strokeWidth="3.6" strokeLinecap="round" d={SWASH} />
            <g transform="translate(72,-24.5) scale(0.84)">
              <g
                fill="none"
                stroke="#F5F2EC"
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="278" cy="66" r="19" />
                <path d="M278 88 L256 152 C268 157, 289 157, 301 152 Z" />
                <path d="M270 100 L248 124" />
                <path d="M287 100 L311 120" />
                <path d="M268 154 L265 184" />
                <path d="M289 154 L292 184" />
              </g>
              <g fill="#F5F2EC">
                <circle cx="270" cy="64" r="2.4" />
                <circle cx="286" cy="64" r="2.4" />
                <path d="M292 52 C286 40, 274 34, 262 34 C250 34, 240 30, 232 24 C238 34, 248 40, 258 42 C246 42, 236 40, 228 36 C236 46, 248 52, 260 52 C250 54, 242 54, 234 52 C244 60, 258 62, 270 58 C278 55, 286 54, 292 58 Z" />
                <path d="M294 56 C300 68, 300 82, 296 92 C298 80, 296 66, 291 58 Z" />
              </g>
            </g>
          </svg>
          <div
            style={{
              color: '#B9AA96',
              fontSize: 32,
              marginTop: 6,
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
