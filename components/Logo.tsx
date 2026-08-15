/**
 * Wordmark + shear-blade monogram. Vector, so the same source scales from a
 * favicon to signage. `currentColor` is deliberately avoided on the accent so
 * the brass hairline survives on both grounds.
 */
export default function Logo({
  tone = 'dark',
  className = '',
}: {
  tone?: 'dark' | 'light';
  className?: string;
}) {
  const ink = tone === 'light' ? '#FAF7F1' : '#0E0D0C';
  const accent = tone === 'light' ? '#E0C877' : '#C9A227';
  const sub = tone === 'light' ? '#E0C877' : '#7A5F18';

  return (
    <span className={`inline-flex items-center gap-3.5 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        aria-hidden="true"
        className="h-9 w-9 flex-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="20" cy="20" r="19" stroke={accent} strokeWidth="0.9" />
        <path d="M13.5 11.5 L26 25.5 M26.5 11.5 L14 25.5" stroke={ink} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="14.5" cy="28.5" r="2.6" stroke={ink} strokeWidth="1.2" />
        <circle cx="25.5" cy="28.5" r="2.6" stroke={ink} strokeWidth="1.2" />
      </svg>

      <span className="flex flex-col leading-none">
        <span
          className="font-display text-[1.3rem] tracking-[-0.015em]"
          style={{ color: ink }}
        >
          Lupita&rsquo;s
        </span>
        <span
          className="mt-1.5 font-body text-[0.48rem] font-medium uppercase tracking-[0.36em]"
          style={{ color: sub }}
        >
          Beauty Salon
        </span>
      </span>
    </span>
  );
}
