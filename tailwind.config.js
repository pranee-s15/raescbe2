/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        boutique: {
          maroon: '#6B0F1A',
          gold: '#D4AF37',
          white: '#FFFFFF',
          background: '#FAF7F5',
          ink: '#2D211E',
          rose: '#9C3F50',
          blush: '#F1E8E2'
        }
      },
      fontFamily: {
        brand: ['"Attera"', '"Times New Roman"', 'serif'],
        display: ['"Poppins"', '"Segoe UI"', 'sans-serif'],
        section: ['"Poppins"', '"Segoe UI"', 'sans-serif'],
        body: ['"Inter"', '"Segoe UI"', 'sans-serif']
      },
      boxShadow: {
        luxe: '0 24px 60px rgba(107, 15, 26, 0.12)',
        soft: '0 16px 40px rgba(27, 23, 21, 0.08)'
      },
      backgroundImage: {
        halo:
          'radial-gradient(circle at top, rgba(212, 175, 55, 0.18), rgba(250, 247, 245, 0) 45%)',
        velvet:
          'linear-gradient(135deg, rgba(107, 15, 26, 0.94), rgba(74, 6, 16, 0.95), rgba(212, 175, 55, 0.2))'
      }
    }
  },
  plugins: []
};
