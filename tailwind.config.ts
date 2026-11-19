import type { Config } from 'tailwindcss'

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        elevated: token('elevated'),
        line: token('line'),
        fg: token('fg'),
        muted: token('muted'),
        accent: {
          DEFAULT: token('accent'),
          fg: token('accent-fg'),
        },
        violet: token('violet'),
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
      },
      fontSize: {
        // Fluid type scale
        'display-xl': ['clamp(2.75rem, 7.5vw + 0.5rem, 5.5rem)', { lineHeight: '1', letterSpacing: '-0.035em' }],
        'display-lg': ['clamp(2.25rem, 4vw + 0.75rem, 3.75rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-md': ['clamp(1.5rem, 2vw + 0.75rem, 2.25rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
      },
      maxWidth: { content: '72rem' },
      keyframes: {
        aurora: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(4%, -3%, 0) scale(1.08)' },
        },
        blink: { '0%, 50%': { opacity: '1' }, '50.01%, 100%': { opacity: '0' } },
      },
      animation: {
        aurora: 'aurora 18s ease-in-out infinite',
        blink: 'blink 1.1s step-end infinite',
      },
    },
  },
  plugins: [],
}

export default config
