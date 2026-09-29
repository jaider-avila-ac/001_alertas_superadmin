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

// colores del dashboard del sistema anterior (tailwind: indigo, pink, sky, amber, emerald, purple, blue).
// este orden separa bien los vecinos, tambien para daltonismo. el color sigue a la categoria, no a su puesto
export const INDIGO = '#6366f1'
export const ROSADO = '#f826a9'
export const CIELO = '#0ea5e9'
export const AMBAR = '#fbbf24'
export const ESMERALDA = '#34d399'
export const MORADO = '#c084fc'
export const VERDE = '#10b981'
export const AZUL = '#60a5fa'
export const GRIS = '#9ca3af'

export const CATEGORICOS = [INDIGO, ROSADO, CIELO, AMBAR, ESMERALDA, MORADO, VERDE, AZUL]

// estados de las alertas (siempre con su nombre al lado)
export const ESTADOS = {
  PENDIENTE: AMBAR,
  EN_PROCESO: AZUL,
  COMPLETADA: ESMERALDA,
}

// nivel de la alerta: los mismos colores del grafico de niveles anterior
export const NIVELES = {
  LEVE: ESMERALDA,
  MODERADO: AMBAR,
  ALTO: ROSADO,
  CRITICO: MORADO,
}

export const MARCA = '#ec4899'
export const TINTA = '#0b0b0b'
export const TINTA_SUAVE = '#52514e'
export const LINEA = '#e1e0d9'

// un color distinto para cada nombre de la lista, por orden alfabetico: no depende de cuantas
// alertas tenga ni del orden en que llegue, asi no cambia al filtrar. devuelve { nombre: color }
export function coloresPorNombre(nombres) {
  const ordenados = nombres.slice().sort(function (a, b) {
    return a.localeCompare(b, 'es')
  })
  const colores = {}
  for (let i = 0; i < ordenados.length; i++) {
    colores[ordenados[i]] = CATEGORICOS[i % CATEGORICOS.length]
  }
  return colores
}

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
