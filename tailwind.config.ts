import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#111111', soft: '#2A2724', muted: '#5A544C' },
        cream: { DEFAULT: '#FAF6EF', deep: '#F2EBDF', warm: '#EFE7D8' },
        gold: {
          DEFAULT: '#D4AF37',
          // Text-safe on cream (5.61:1) — champagne gold itself fails at 1.95:1.
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
      spacing: {
        section: 'clamp(4rem, 10vw, 8rem)',
      },
      maxWidth: {
        shell: '1280px',
      },
      transitionDuration: {
        DEFAULT: '250ms',
        '250': '250ms',
      },
    },
  },
  plugins: [],
};

export default config;
