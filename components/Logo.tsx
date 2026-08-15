import BrandMark from './BrandMark';

/**
 * The header and footer wordmark.
 *
 * This is the studio's own lockup — signature plus figure — used as drawn,
 * with no "STUDIO" line appended. The temptation is to bolt the word on so
 * the header states the business name in full, but the mark is a signature:
 * setting a tracked-out label beside someone's handwriting is what makes it
 * read as a template rather than as theirs. The full name is carried by the
 * page title, the footer sign-off and the structured data instead.
 *
 * The mark paints in `currentColor`, so `tone` is just a text colour — there
 * is no second copy of the artwork for dark grounds.
 */
export default function Logo({
  tone = 'dark',
  className = '',
}: {
  tone?: 'dark' | 'light';
  className?: string;
}) {
  // `tone` names the ground, not the ink: 'light' means the mark sits on the
  // near-black ground of the hero and footer, so the line work flips to bone.
  const ink = tone === 'light' ? 'text-bone' : 'text-ink';

  return (
    <BrandMark
      variant="lockup"
      title="Jaeso Studio"
      className={`h-12 w-auto flex-none ${ink} ${className}`}
    />
  );
}
