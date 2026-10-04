/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gym: {
          void: '#070709',
          surface: '#0D0D11',
          panel: '#14151C',
          elevated: '#1E1F28',
          border: '#27272A',
          borderLight: '#3F3F46',
          orange: '#E1601B',
          glow: '#FF7728',
          amber: '#FFA055',
          gold: '#FFD700',
          muted: '#71717A',
          subtle: '#A1A1AA',
        }
      },
      fontFamily: {
        display: ['Oswald', 'Bebas Neue', 'sans-serif'],
        mono: ['JetBrains Mono', 'Space Grotesk', 'monospace'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(225, 96, 27, 0.25)',
        'glow-md': '0 0 20px rgba(225, 96, 27, 0.4)',
        'glow-lg': '0 0 35px rgba(225, 96, 27, 0.55)',
      }
    },
  },
  plugins: [],
}
