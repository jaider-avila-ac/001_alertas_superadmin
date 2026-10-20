// los colores se definen solo aqui. en los componentes se usan estos nombres.
// la plataforma usa cinco colores: fucsia (primario), verde (exito), ambar (aviso), rojo (peligro) y azul (info).
// cada uno tiene solo tres tonos: claro para fondos, el color y oscuro para texto o al pasar el mouse.
// los graficos usan los mismos valores (components/graficos/configuracion.js)
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primario: {
          50: '#fdf2f8',
          100: '#fdf2f8',
          200: '#fdf2f8',
          400: '#ec4899',
          500: '#ec4899',
          600: '#be185d',
          700: '#be185d',
        },
        fondo: '#f9fafb',
        superficie: '#ffffff',
        borde: '#e5e7eb',
        texto: '#1f2937',
        suave: '#6b7280',
        exito: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#10b981',
          700: '#047857',
        },
        aviso: {
          50: '#fffbeb',
          500: '#f59e0b',
          700: '#b45309',
        },
        peligro: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#ef4444',
          700: '#b91c1c',
        },
        info: {
          50: '#eff6ff',
          500: '#3b82f6',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
}
