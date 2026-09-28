// los colores se definen solo aqui. en los componentes se usan estos nombres.
// son los del sistema anterior: rosado como color principal y grises neutros
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primario: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
        },
        fondo: '#f9fafb',
        superficie: '#ffffff',
        borde: '#e5e7eb',
        texto: '#1f2937',
        suave: '#6b7280',
        exito: {
          50: '#f0fdf4',
          600: '#16a34a',
          700: '#15803d',
        },
        peligro: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        aviso: {
          50: '#fffbeb',
          700: '#b45309',
        },
      },
    },
  },
  plugins: [],
}
