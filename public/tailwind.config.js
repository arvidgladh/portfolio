// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Här definieras vilka filer Tailwind ska skanna för att hitta klasser
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Inkluderar din src-mapp
  ],
  theme: {
    // 'extend' låter oss lägga till nya värden utan att skriva över standardvärdena
    extend: {
      fontFamily: {
        // Huvudfont: Vår lugna och läsbara UI-font (ersätter standard 'sans')
        sans: ['Inter', 'sans-serif'],
        
        // Sifferfont: Dedikerad för all finansiell data (används via .number)
        'mono-tnum': ['JetBrains Mono', 'monospace'],
      },
      // Lägg till en custom, subtil skugga för vår "Paus"-känsla
      boxShadow: {
        'paus-subtle': '0 4px 12px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      },
      // Här kan du även lägga till en custom, lugnare färgpalett om vi vill byta bort från indigo/rose
      colors: {
        // Exempel på att byta ut default indigo mot en lugnare violett/blå
        'paus-primary': '#6366f1', // Original Indigo-500
        'paus-negative': '#ef4444', // Original Rose/Red
        'paus-positive': '#10b981', // Original Emerald/Green
      }
    },
  },
  plugins: [],
}