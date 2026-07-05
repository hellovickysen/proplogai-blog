/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#07070b',
          secondary: '#0b0b14',
          card: '#12121a',
        },
        profit: '#34d399',
        loss: '#f87171',
        accent: '#fbbf24',
        violet: '#8b5cf6',
        cyan: '#22d3ee',
        amber: '#fbbf24',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(120deg, #8b5cf6, #22d3ee)',
      },
    },
  },
  plugins: [],
};
