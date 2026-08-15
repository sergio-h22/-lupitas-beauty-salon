'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

type Variant = 'lift' | 'mask' | 'rule';

/**
 * Scroll-triggered entrance, CSS-driven.
 *
 * This deliberately does not use an animation library. The whole motion
 * language here is "move opacity and transform once, then get out of the way",
 * which CSS does natively — importing a runtime to do it costs ~50 kB gzipped
 * on every page for no capability we actually use.
 *
 * All instances share one IntersectionObserver, so a long page costs one
 * callback rather than thirty. `prefers-reduced-motion` is handled in CSS
 * (globals.css) so the resting state is guaranteed even before this mounts.
 */

type Entry = { onEnter: () => void };

let observer: IntersectionObserver | null = null;
const registry = new Map<Element, Entry>();

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        registry.get(entry.target)?.onEnter();
        observer?.unobserve(entry.target);
        registry.delete(entry.target);
      }
    },
    // Fires a touch before the element is fully on screen, so the motion is
    // already underway by the time the eye arrives.
    { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
  );
  return observer;
}

export default function Reveal({
  children,
  delay = 0,
  variant = 'lift',
  className = '',
  as = 'div',
}: {
  /** Optional — the `rule` variant animates a bare hairline with no content. */
  children?: ReactNode;
  /** Seconds, matching the previous API. */
  delay?: number;
  variant?: Variant;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article' | 'span' | 'h1' | 'h2' | 'p';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;

    // Anything already in view on first paint should animate immediately
    // rather than wait for a scroll that may never come.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }

    registry.set(el, { onEnter: () => setShown(true) });
    getObserver().observe(el);

    return () => {
      registry.delete(el);
      observer?.unobserve(el);
    };
  }, [shown]);

  const Tag = as as 'div';
  const base = variant === 'mask' ? 'reveal-mask' : variant === 'rule' ? 'reveal-rule' : 'reveal';

  return (
    <Tag
      ref={ref}
      className={`${base}${shown ? ' is-in' : ''} ${className}`}
      style={
        delay
          ? ({ '--reveal-delay': `${Math.round(delay * 1000)}ms` } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </Tag>
  );
}
