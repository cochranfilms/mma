/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6e7f0',
          100: '#cfd1e1',
          200: '#a0a3c3',
          300: '#7176a5',
          400: '#424886',
          500: '#232766',
          600: '#191d55',
          700: '#111546',
          800: '#0a0d35',
          900: '#010043',
        },
        accent: {
          50: '#FFF7DB',
          100: '#FDEEB6',
          200: '#F9E285',
          300: '#F2D559',
          400: '#ECC83A',
          500: '#E0AB10',
          600: '#C89A0E',
          700: '#A7800B',
          800: '#836308',
          900: '#5A4305',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0, 0, 0, 0.06)',
        medium: '0 15px 40px rgba(0, 0, 0, 0.10)',
        large: '0 20px 50px rgba(0, 0, 0, 0.15)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Arial', 'Helvetica', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
