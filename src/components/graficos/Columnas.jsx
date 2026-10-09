import { Bar } from 'react-chartjs-2'
import { INDIGO, LINEA, TINTA, sumar, textoPorcentaje } from './configuracion'

// columnas sobre el eje x en orden (meses, niveles). encima de cada una el numero;
// conPorcentaje: ademas su parte del total (niveles). datos: [{ clave, etiqueta, total, color? }]
export default function Columnas({ datos, conPorcentaje, vacio, unidad }) {
  const total = sumar(datos)

  if (total === 0) {
    return <p className="text-sm text-suave">{vacio || 'Sin datos con estos filtros'}</p>
  }

  const etiquetas = []
  const valores = []
  const colores = []
  for (const dato of datos) {
    etiquetas.push(dato.etiqueta)
    valores.push(dato.total)
    colores.push(dato.color || INDIGO)
  }

  const nombre = unidad || 'alertas'

  const data = {
    labels: etiquetas,
    datasets: [{ data: valores, backgroundColor: colores, maxBarThickness: 56 }],
  }

  const opciones = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 24 } },
    scales: {
      y: { beginAtZero: true, grid: { color: LINEA }, ticks: { precision: 0 }, border: { display: false } },
      x: { grid: { display: false }, ticks: { color: TINTA } },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (contexto) {
            return ' ' + contexto.parsed.y + ' ' + nombre + ' (' + textoPorcentaje(contexto.parsed.y, total) + ')'
          },
        },
      },
      datalabels: {
        display: function (contexto) {
          return contexto.dataset.data[contexto.dataIndex] > 0
        },
        anchor: 'end',
        align: 'end',
        color: TINTA,
        font: { weight: 'bold' },
        formatter: function (valor) {
          if (conPorcentaje) {
            return valor + ' · ' + textoPorcentaje(valor, total)
          }
          return valor
        },
      },
    },
  }

  return (
    <div className="relative h-64 w-full min-w-0">
      <Bar data={data} options={opciones} />
    </div>
  )
}
