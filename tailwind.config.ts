import type { Config } from 'tailwindcss';

/**
 * "Signature Monochrome" design system — Jaeso Studio.
 *
 * The identity is a black disc, a bone card and a hand-drawn signature. There
 * is no third colour in it, so there is no third colour here either. Three
 * rules govern every token below:
 *
 *  1. The palette is ink, bone and one warm neutral. Where a gilded salon
 *     brand would punctuate with gold, this one punctuates with contrast —
 *     bone on near-black, a hairline, the signature itself. Sand is a
 *     quiet warm grey, not an accent colour; at 2.03:1 on bone it is never
 *     allowed to carry text. `sand.text` is the compliant substitute (5.32:1).
 *  2. Red belongs to errors alone. `alert` is a system colour, never a brand
 *     one — nothing decorative is ever tinted with it.
 *  3. Scale carries the luxury, not ornament. The display sizes below are
 *     deliberately far apart so a page reads as composed rather than filled.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /** Near-black rather than pure #000 — it holds the Bodoni hairlines. */
        ink: {
          DEFAULT: '#0A0A0A',
          soft: '#1C1B1A',
          // 9.33:1 on bone.
          mid: '#443F38',
          // 6.38:1 on bone.
          muted: '#5E574C',
          /**
           * The lightest tone allowed to carry real text — service durations,
           * prices, captions and serial numerals all use it at ~10px. Measured
           * 5.31:1 on bone and 4.73:1 on bone-deep, so it clears AA on both
           * grounds. A lighter grey looked better and failed: #948C81 measures
           * 2.90:1 on bone, which is unreadable at this size.
           */
          faint: '#6B6355',
        },
        /** The card ground of the brand's booking tile — warm, not white. */
        bone: {
          DEFAULT: '#F5F2EC',
          deep: '#EAE5DC',
          warm: '#DDD6C9',
        },
        sand: {
          DEFAULT: '#B9AA96',
          // 12.61:1 on ink — the only sand tone cleared for text, and only there.
          soft: '#D8CDBC',
          // Text-safe on bone (5.32:1). Sand itself fails at 2.03:1.
          text: '#6E6252',
          deep: '#8C7D69',
        },
        /** System-only. Fills and hairlines use DEFAULT; text uses the pair below. */
        alert: {
          DEFAULT: '#C0463C',
          // 10.01:1 on ink — for closed-day markers in the inverted footer.
          soft: '#E8A9A0',
          // 7.24:1 on bone.
          text: '#94291F',
        },
      },

      fontFamily: {
        display: ['var(--font-display)', 'Didot', 'Georgia', 'serif'],
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
