/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: {
          primary: '#0B0D17',
          secondary: '#111420',
          card: '#161929',
          hover: '#1C2035',
        },
        accent: {
          purple: '#7C5CFC',
          'purple-light': '#9B7DFF',
          'purple-dim': '#7C5CFC33',
          blue: '#4DA3FF',
          teal: '#2DD4BF',
          pink: '#F472B6',
          orange: '#FB923C',
        },
        text: {
          primary: '#EAEAF0',
          secondary: '#8B8FA8',
          muted: '#525672',
        },
        border: {
          subtle: '#1E2235',
          DEFAULT: '#252840',
        },
      },
    },
  },
  plugins: [],
}
