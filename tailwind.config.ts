import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '380px',
      },
      colors: {
        bg:           'var(--bg)',
        surface:      'var(--surface)',
        primary:      'var(--primary)',
        accent:       'var(--accent)',
        'muted-green':'var(--muted-green)',
        text:         'var(--text)',
        'text-muted': 'var(--text-muted)',
        line:         'rgba(242,245,243,0.08)',
        'line-strong':'rgba(242,245,243,0.16)',
      },
      fontFamily: {
        grotesk: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        inter:   ['Inter', 'sans-serif'],
        mono:    ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '2px',
        pill:    '999px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        micro: '200ms',
        reveal: '750ms',
      },
    },
  },
  plugins: [],
};

export default config;
