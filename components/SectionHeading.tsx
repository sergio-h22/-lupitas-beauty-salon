'use client';

import { ReactNode } from 'react';
import Reveal from './Reveal';

/**
 * The editorial section header.
 *
 * The previous version stamped an identical eyebrow + sand rule + centred
 * heading onto seven consecutive sections, which is the strongest "template"
 * tell a page can have. This one is built to vary: a serial numeral turns the
 * page into a sequence, and `align` lets sections alternate between an
 * asymmetric left column and a centred statement.
 */
export default function SectionHeading({
  index,
  eyebrow,
  title,
  subtitle,
  align = 'left',
  tone = 'dark',
  size = 'md',
}: {
  /** Serial numeral, e.g. "01". Omit on sections that stand outside the sequence. */
  index?: string;
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  align?: 'center' | 'left';
  tone?: 'dark' | 'light';
  size?: 'md' | 'lg';
}) {
  const light = tone === 'light';
  const centered = align === 'center';

  return (
    <div className={centered ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl'}>
      <Reveal
        className={`flex items-center gap-4 ${centered ? 'justify-center' : ''}`}
        variant="lift"
      >
        {index && (
          <span className={`serial ${light ? '!text-bone/40' : ''}`} aria-hidden="true">
            {index}
          </span>
        )}
        {index && (
          <span
            aria-hidden="true"
            className={`h-px w-8 ${light ? 'bg-bone/25' : 'bg-ink/20'}`}
          />
        )}
        <span className={light ? 'eyebrow-light' : 'eyebrow'}>{eyebrow}</span>
      </Reveal>

      <Reveal
        as="h2"
        variant="mask"
        delay={0.08}
        className={`mt-7 ${size === 'lg' ? 'text-display-lg' : 'text-display-md'} ${
          light ? '!text-bone' : ''
        }`}
      >
        <span>{title}</span>
      </Reveal>

      {subtitle && (
        <Reveal
          delay={0.18}
          className={`mt-6 max-w-prose text-[0.98rem] leading-relaxed ${
            centered ? 'mx-auto' : ''
          } ${light ? 'text-bone/60' : 'text-ink-muted'}`}
        >
          {subtitle}
        </Reveal>
      )}
    </div>
  );
}
