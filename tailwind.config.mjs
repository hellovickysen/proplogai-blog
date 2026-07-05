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
        violet: '#a78bfa',
        cyan: '#22d3ee',
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(120deg, #a78bfa, #22d3ee)',
      },
    },
  },
  plugins: [],
};
