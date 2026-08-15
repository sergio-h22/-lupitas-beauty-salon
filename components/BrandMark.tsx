import { WORDMARK, SWASH } from './brand-art';

/**
 * The studio's mark: the signature, its underline, and the drawn figure.
 *
 * Everything paints in `currentColor`, so the whole lockup inverts by setting
 * a text colour on the parent — there is no light/dark variant to keep in
 * sync, because the brand genuinely is one ink on one ground.
 *
 * Three cuts, because one drawing cannot do all three jobs. `lockup` is the
 * mark as the studio uses it. `word` drops the figure for places that are
 * already unmistakably the brand — the footer sign-off, set at the scale of
 * a page. `figure` drops the signature for the reverse case: at favicon size
 * the script collapses into a grey smudge, while the figure survives, so the
 * tab icon carries the half that still reads at 16px.
 */
export type BrandVariant = 'lockup' | 'word' | 'figure';

/** Tuned per cut so each sits on its own edges with no dead margin. */
const VIEWBOX: Record<BrandVariant, string> = {
  lockup: '-4 -10 348 152',
  word: '-4 -10 252 152',
  figure: '222 18 96 172',
};

/**
 * The figure. Stroke weight is set once here rather than per path so the
 * whole drawing keeps a single pen — the hair is the only filled shape, and
 * it is filled because it is drawn as a mass in the original, not as strokes.
 */
function Figure() {
  return (
    <>
      <g
        fill="none"
        stroke="currentColor"
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
      <g fill="currentColor">
        <circle cx="270" cy="64" r="2.4" />
        <circle cx="286" cy="64" r="2.4" />
        {/* Swept fringe — overlapping points, drawn as one mass. */}
        <path
          d="M292 52 C286 40, 274 34, 262 34 C250 34, 240 30, 232 24
             C238 34, 248 40, 258 42 C246 42, 236 40, 228 36
             C236 46, 248 52, 260 52 C250 54, 242 54, 234 52
             C244 60, 258 62, 270 58 C278 55, 286 54, 292 58 Z"
        />
        {/* The strand falling behind the right of the head. */}
        <path d="M294 56 C300 68, 300 82, 296 92 C298 80, 296 66, 291 58 Z" />
      </g>
    </>
  );
}

export default function BrandMark({
  variant = 'lockup',
  className = '',
  title,
}: {
  variant?: BrandVariant;
  className?: string;
  /** Omit for decorative use; the SVG is then hidden from assistive tech. */
  title?: string;
}) {
  return (
    <svg
      viewBox={VIEWBOX[variant]}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      xmlns="http://www.w3.org/2000/svg"
    >
      {variant !== 'figure' && (
        <>
          {/* The outline is cut with the baseline at y=0, so it is lifted
              into the box here rather than being re-exported per use. */}
          <g transform="translate(21.1,83.4)">
            <path fill="currentColor" d={WORDMARK} />
          </g>
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="3.6"
            strokeLinecap="round"
            d={SWASH}
          />
        </>
      )}

      {variant !== 'word' && (
        <g transform={variant === 'figure' ? undefined : 'translate(72,-24.5) scale(0.84)'}>
          <Figure />
        </g>
      )}
    </svg>
  );
}
