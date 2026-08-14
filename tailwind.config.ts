import type { Config } from 'tailwindcss';

/**
 * "Editorial Atelier" design system.
 *
 * Two rules govern every token here:
 *  1. Gold is punctuation, not paint. It appears on dark ground, on hairlines
 *     and on a handful of numerals — never as body text on cream, where it
 *     measures 1.95:1 and fails WCAG outright. `gold.text` is the compliant
 *     substitute (5.61:1).
 *  2. Scale carries the luxury, not ornament. The display sizes below are
 *     deliberately far apart so a page reads as composed rather than filled.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0E0D0C',
          soft: '#221F1B',
          // 8.99:1 on cream.
          mid: '#4A443C',
          // 6.17:1 on cream.
          muted: '#635C52',
          /**
           * The lightest tone allowed to carry real text — service durations,
           * prices, captions and serial numerals all use it at ~10px. Measured
           * 5.17:1 on cream and 4.66:1 on cream-deep, so it clears AA on both
           * grounds. A lighter grey looked better and failed: #948C81 measures
           * 3.10:1 on cream, which is unreadable at this size.
           */
          faint: '#6F6859',
        },
        cream: {
          DEFAULT: '#FAF7F1',
          deep: '#F1EBE0',
          warm: '#E8E0D1',
        },
        gold: {
          DEFAULT: '#C9A227',
          soft: '#E0C877',
          // Text-safe on cream (5.61:1). Champagne gold itself fails at 1.95:1.
          text: '#7A5F18',
          deep: '#A67C1A',
        },
        rose: {
          DEFAULT: '#D8A7A7',
          // Text-safe on cream (5.66:1).
          text: '#8C5252',
        },
      },

      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },

      /**
       * Wide gaps between steps are intentional. Mid-sized headings everywhere
       * is what makes a page read as a template.
       */
      fontSize: {
        'display-xl': ['clamp(3.2rem, 10.5vw, 8.5rem)', { lineHeight: '0.9', letterSpacing: '-0.035em' }],
        'display-lg': ['clamp(2.5rem, 6.5vw, 5.25rem)', { lineHeight: '0.98', letterSpacing: '-0.028em' }],
        'display-md': ['clamp(1.9rem, 4.4vw, 3.25rem)', { lineHeight: '1.06', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(1.4rem, 2.8vw, 2rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        label: ['0.66rem', { lineHeight: '1', letterSpacing: '0.24em' }],
        'label-lg': ['0.75rem', { lineHeight: '1', letterSpacing: '0.18em' }],
      },

      spacing: {
        section: 'clamp(5rem, 11vw, 9rem)',
        'section-sm': 'clamp(3.25rem, 7vw, 5.5rem)',
        'section-lg': 'clamp(7rem, 15vw, 13rem)',
        gutter: 'clamp(1.5rem, 5vw, 5rem)',
      },

      maxWidth: {
        shell: '1440px',
        prose: '62ch',
        measure: '44ch',
      },

      transitionDuration: {
        DEFAULT: '250ms',
        '250': '250ms',
        '400': '400ms',
        '600': '600ms',
        '900': '900ms',
      },

      transitionTimingFunction: {
        // Signature curve — slow out, decisive settle. Used for every reveal.
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
        drawer: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },

      keyframes: {
        'mask-up': {
          from: { transform: 'translate3d(0, 105%, 0)' },
          to: { transform: 'translate3d(0, 0, 0)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translate3d(0, 24px, 0)' },
          to: { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        'rule-draw': {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
