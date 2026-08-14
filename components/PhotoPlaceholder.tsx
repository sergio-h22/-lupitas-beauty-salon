'use client';

import Image from 'next/image';

/**
 * Stands in until real photography exists, and reserves its aspect ratio so
 * dropping a real image in later cannot shift the layout.
 *
 * The previous version used a dashed border and the words "coming soon",
 * which reads as an unfinished site. This one is a composed plate — hairline
 * frame, ghosted monogram, caption set in the same register as the rest of
 * the page — so an unphotographed section still looks deliberate.
 */
export default function PhotoPlaceholder({
  label,
  ratio = 'aspect-[4/5]',
  src,
  className = '',
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  priority = false,
}: {
  label: string;
  ratio?: string;
  src?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={`frame group ${ratio} ${className}`}>
        <Image
          src={src}
          alt={label}
          fill
          sizes={sizes}
          priority={priority}
          className="img-editorial"
        />
      </div>
    );
  }

  return (
    <div className={`placeholder-tile ${ratio} w-full ${className}`}>
      <span aria-hidden="true" className="absolute inset-3 border border-ink/10" />

      <Monogram />

      <span className="absolute inset-x-0 bottom-6 px-6 font-body text-label font-medium uppercase text-ink-faint">
        {label}
      </span>
    </div>
  );
}

function Monogram() {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      className="h-16 w-16 text-ink/10"
      fill="none"
      stroke="currentColor"
    >
      <circle cx="20" cy="20" r="18" strokeWidth="0.6" />
      <path d="M13.5 11.5 L26 25.5 M26.5 11.5 L14 25.5" strokeWidth="0.9" strokeLinecap="round" />
      <circle cx="14.5" cy="28.5" r="2.6" strokeWidth="0.9" />
      <circle cx="25.5" cy="28.5" r="2.6" strokeWidth="0.9" />
    </svg>
  );
}
