/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,md}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF7F2',
        cream: '#F3EDE5',
        sand: '#EDE7DF',
        espresso: '#110E0C',
        cocoa: '#1C1714',
        ink: '#1F1A17',
        muted: '#7A6E65',
        accent: { DEFAULT: '#C45D12', dark: '#A8470B', soft: '#FDF0E6' },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: { container: '80rem' },
      boxShadow: {
        card: '0 1px 2px rgba(31,26,23,.04), 0 18px 40px -20px rgba(31,26,23,.18)',
        glow: '0 12px 32px -8px rgba(196,93,18,.6)',
      },
      keyframes: {
        spin: { to: { transform: 'rotate(360deg)' } },
        'spin-rev': { to: { transform: 'rotate(-360deg)' } },
        scan: { '0%,100%': { top: '8%' }, '50%': { top: '88%' } },
        kenburns: { '0%': { transform: 'scale(1)' }, '100%': { transform: 'scale(1.12)' } },
        'carousel-border': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        orbit: 'spin var(--dur,60s) linear infinite',
        'orbit-rev': 'spin-rev var(--dur,60s) linear infinite',
        scan: 'scan 5s ease-in-out infinite',
        kenburns: 'kenburns 6s ease-out infinite alternate',
        'carousel-border': 'carousel-border 6s linear infinite',
      },
    },
  },
  plugins: [],
};
