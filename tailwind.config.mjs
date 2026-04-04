/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5F5DC',
        'cream-dark': '#E8E8D0',
        gold: '#D4AF37',
        'gold-light': '#E5C555',
        'gold-dark': '#B8960C',
        silver: '#C0C0C0',
        'watch-black': '#1A1A1A',
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'system-ui', 'sans-serif'],
        display: ['Inter', 'Noto Sans JP', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
