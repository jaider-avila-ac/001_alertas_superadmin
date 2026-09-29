import { Bar } from 'react-chartjs-2'
import { LINEA, TINTA, textoPorcentaje } from './configuracion'

// una barra por fila partida en tramos (ej. por psicorientador: completadas y en curso).
// dentro de cada tramo su porcentaje de la fila. filas: [{ etiqueta, valores: [n, n] }]
// series: [{ nombre, color }] en el mismo orden que valores
export default function BarrasApiladas({ filas, series, vacio }) {
  if (filas.length === 0) {
    return <p className="text-sm text-suave">{vacio || 'Sin datos con estos filtros'}</p>
  }

  const etiquetas = []
  const totales = []
  for (const fila of filas) {
    etiquetas.push(fila.etiqueta)
    let total = 0
    for (const valor of fila.valores) {
      total = total + valor
    }
    totales.push(total)
  }

  const datasets = []
  for (let i = 0; i < series.length; i++) {
    const valores = []
    for (const fila of filas) {
      valores.push(fila.valores[i])
    }
    datasets.push({
      label: series[i].nombre,
      data: valores,
      backgroundColor: series[i].color,
      // separacion entre tramos del color de la superficie
      borderColor: '#ffffff',
      borderWidth: { right: 2 },
      barPercentage: 0.75,
    })
  }

  const opciones = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true, beginAtZero: true, grid: { color: LINEA }, ticks: { precision: 0 }, border: { display: false } },
      y: { stacked: true, grid: { display: false }, ticks: { color: TINTA } },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (contexto) {
            const total = totales[contexto.dataIndex]
            return ' ' + contexto.dataset.label + ': ' + contexto.parsed.x + ' (' + textoPorcentaje(contexto.parsed.x, total) + ')'
          },
        },
      },
      datalabels: {
        display: function (contexto) {
          const total = totales[contexto.dataIndex]
          const valor = contexto.dataset.data[contexto.dataIndex]
          return valor > 0 && valor / total >= 0.12
        },
        color: '#ffffff',
        font: { weight: 'bold' },
        formatter: function (valor, contexto) {
          return textoPorcentaje(valor, totales[contexto.dataIndex])
        },
      },
    },
  }

  const alto = Math.max(110, filas.length * 40 + 40)

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-4 text-sm">
        {series.map((serie) => (
          <span key={serie.nombre} className="flex items-center gap-2">
            <span className="h-3 w-3" style={{ backgroundColor: serie.color }} />
            {serie.nombre}
          </span>
        ))}
      </div>
      <div style={{ height: alto + 'px' }}>
        <Bar data={{ labels: etiquetas, datasets: datasets }} options={opciones} />
      </div>
    </div>
  )
}
