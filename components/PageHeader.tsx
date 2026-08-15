'use client';

import Reveal from './Reveal';

/**
 * Interior-page masthead. Left-aligned and set large, so a subpage opens with
 * the same editorial voice as the homepage instead of a centred banner.
 */
export default function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="border-b border-ink/10 bg-bone-deep pb-section-sm pt-[clamp(4rem,10vw,7rem)]">
      <div className="shell">
        <Reveal className="flex items-center gap-4">
          <span aria-hidden="true" className="h-px w-10 bg-sand" />
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>

        <Reveal as="h1" variant="mask" delay={0.08} className="mt-7 max-w-4xl text-display-lg">
          <span>{title}</span>
        </Reveal>

        {subtitle && (
          <Reveal delay={0.18} className="mt-6 max-w-prose leading-relaxed text-ink-muted">
            {subtitle}
          </Reveal>
        )}
      </div>
    </section>
  );
}
