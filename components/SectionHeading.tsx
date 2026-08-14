import { ReactNode } from 'react';
import Reveal from './Reveal';

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  tone = 'dark',
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  align?: 'center' | 'left';
  tone?: 'dark' | 'light';
}) {
  return (
    <Reveal className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className={`eyebrow ${tone === 'light' ? '!text-gold' : ''}`}>{eyebrow}</p>
      <div className={`rule-gold mt-4 ${align === 'center' ? 'mx-auto' : ''}`} />
      <h2
        className={`mt-6 text-[clamp(1.9rem,4.5vw,3rem)] ${
          tone === 'light' ? '!text-cream' : ''
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-5 text-base leading-relaxed ${tone === 'light' ? 'text-cream/70' : 'text-ink-muted'}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
