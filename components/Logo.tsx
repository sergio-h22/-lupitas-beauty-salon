/**
 * Wordmark + minimal shear-blade monogram. Vector, so it scales to signage
 * and business cards from the same source.
 */
export default function Logo({
  tone = 'dark',
  className = '',
}: {
  tone?: 'dark' | 'light';
  className?: string;
}) {
  const ink = tone === 'light' ? '#FAF6EF' : '#111111';
  const accent = '#D4AF37';

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        aria-hidden="true"
        className="h-9 w-9 flex-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="20" cy="20" r="19" stroke={accent} strokeWidth="1" />
        <path
          d="M13.5 11.5 L26 25.5 M26.5 11.5 L14 25.5"
          stroke={ink}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="14.5" cy="28.5" r="2.6" stroke={ink} strokeWidth="1.4" />
        <circle cx="25.5" cy="28.5" r="2.6" stroke={ink} strokeWidth="1.4" />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className="font-display text-[1.35rem] font-semibold tracking-[0.01em]"
          style={{ color: ink }}
        >
          Lupita&rsquo;s
        </span>
        <span
          className="mt-1 font-body text-[0.5rem] font-medium uppercase tracking-[0.34em]"
          style={{ color: tone === 'light' ? '#D4AF37' : '#7A5F18' }}
        >
          Beauty Salon
        </span>
      </span>
    </span>
  );
}
