/**
 * Wordmark — a reduction of the studio's two existing marks into one lockup.
 *
 * The profile mark is a black disc holding a stacked JAESO / STUDIO; the
 * booking card is a hand-drawn signature. Neither survives alone at header
 * scale: the stacked lockup is illegible inside a 36px disc, and a bare
 * signature gives a favicon nothing to hold. So the disc keeps only the
 * monogram, and the signature carries the name beside it with STUDIO tracked
 * out beneath — the same two voices, split by the job each can actually do.
 *
 * The J is drawn as a path rather than set as <text>: an SVG that borrows a
 * webfont renders as a fallback serif for the swap period and as nothing at
 * all in an <img> or an OG card, and a monogram that flickers is worse than
 * one that is simply always right.
 *
 * `currentColor` is deliberately avoided — the mark inverts as a pair, disc
 * and monogram together, and inheriting one of them would break the other.
 */
export default function Logo({
  tone = 'dark',
  className = '',
}: {
  tone?: 'dark' | 'light';
  className?: string;
}) {
  // `tone` names the ground, not the ink: 'light' means the mark sits on the
  // near-black ground of the hero and footer, so the disc flips to bone.
  const onDark = tone === 'light';
  const disc = onDark ? '#F5F2EC' : '#0A0A0A';
  const monogram = onDark ? '#0A0A0A' : '#F5F2EC';
  const ink = onDark ? '#F5F2EC' : '#0A0A0A';
  const sub = onDark ? '#B9AA96' : '#6E6252';

  return (
    <span className={`inline-flex items-center gap-3.5 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        aria-hidden="true"
        className="h-9 w-9 flex-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="20" cy="20" r="20" fill={disc} />
        {/* Didone J: flat top serif, unbracketed stem, open hook. */}
        <path
          d="M16.4 12.4 H28.2 M23 12.4 V24.6 C23 27.9 20.7 29.9 17.6 29.9 C14.7 29.9 12.6 28.3 11.9 25.6"
          stroke={monogram}
          strokeWidth="1.6"
          fill="none"
        />
      </svg>

      <span className="flex flex-col leading-none">
        {/* The signature runs ~40% smaller than its em box, so it is set well
            above the display size it has to optically match, then pulled back
            with negative margins rather than being allowed to set the row
            height. */}
        <span
          className="signature -mt-1.5 -mb-1 text-[2.15rem]"
          style={{ color: ink }}
        >
          Jaeso
        </span>
        <span
          className="font-body text-[0.48rem] font-medium uppercase tracking-[0.42em]"
          style={{ color: sub }}
        >
          Studio
        </span>
      </span>
    </span>
  );
}
