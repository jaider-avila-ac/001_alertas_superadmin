import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

// se registra una sola vez lo que usan los graficos (asi el paquete no carga todo chart.js)
Chart.register(ArcElement, BarElement, LineElement, PointElement, Filler, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels)

Chart.defaults.font.family = 'system-ui, -apple-system, "Segoe UI", sans-serif'
Chart.defaults.font.size = 12
Chart.defaults.color = '#52514e'
Chart.defaults.animation.duration = 400
// la leyenda va aparte en html (con numero y porcentaje)
Chart.defaults.plugins.legend.display = false
// las etiquetas se prenden en cada grafico
Chart.defaults.plugins.datalabels = { display: false }

// la plataforma usa solo cinco colores: el fucsia de la marca y cuatro mas.
// son los mismos de tailwind.config.js. el gris queda para "sin dato" y canceladas
export const FUCSIA = '#ec4899'
export const AZUL = '#3b82f6'
export const VERDE = '#10b981'
export const AMBAR = '#f59e0b'
export const ROJO = '#ef4444'
export const GRIS = '#9ca3af'

// estados de las alertas (siempre con su nombre al lado)
export const ESTADOS = {
  PENDIENTE: AMBAR,
  EN_PROCESO: AZUL,
  COMPLETADA: VERDE,
}

// nivel de la alerta
export const NIVELES = {
  LEVE: VERDE,
  MODERADO: AMBAR,
  ALTO: FUCSIA,
  CRITICO: ROJO,
}

export const MARCA = FUCSIA
export const TINTA = '#0b0b0b'
export const TINTA_SUAVE = '#52514e'
export const LINEA = '#e1e0d9'

export function porcentaje(valor, total) {
  if (!total) {
    return 0
  }
  return Math.round((valor / total) * 1000) / 10
}

export function textoPorcentaje(valor, total) {
  return String(porcentaje(valor, total)).replace('.', ',') + '%'
}

export function sumar(datos) {
  let total = 0
  for (const dato of datos) {
    total = total + dato.total
  }
  return total
}

// parte un nombre largo en lineas de hasta 16 letras (chart.js pinta cada linea del arreglo)
export function partirEtiqueta(texto) {
  const maximo = 16
  if (!texto || texto.length <= maximo) {
    return texto
  }
  const lineas = []
  let actual = ''
  for (const palabra of texto.split(' ')) {
    if (actual === '') {
      actual = palabra
    } else if (actual.length + 1 + palabra.length <= maximo) {
      actual = actual + ' ' + palabra
    } else {
      lineas.push(actual)
      actual = palabra
    }
  }
  if (actual !== '') {
    lineas.push(actual)
  }
  return lineas
}
