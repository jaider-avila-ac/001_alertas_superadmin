import { Line } from 'react-chartjs-2'
import { INDIGO, LINEA, TINTA, sumar, textoPorcentaje } from './configuracion'

// evolucion en el tiempo (meses): linea con el area suave debajo y el numero sobre cada punto
export default function Linea({ datos, color, unidad, vacio }) {
  const total = sumar(datos)

  if (total === 0) {
    return <p className="text-sm text-suave">{vacio || 'Sin datos con estos filtros'}</p>
  }

  const etiquetas = []
  const valores = []
  for (const dato of datos) {
    etiquetas.push(dato.etiqueta)
    valores.push(dato.total)
  }

  const trazo = color || INDIGO
  const nombre = unidad || 'alertas'

  const data = {
    labels: etiquetas,
    datasets: [
      {
        data: valores,
        borderColor: trazo,
        backgroundColor: trazo + '26',
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: trazo,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      },
    ],
  }

  const opciones = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 24, left: 8, right: 16 } },
    scales: {
      y: { beginAtZero: true, grid: { color: LINEA }, ticks: { precision: 0 }, border: { display: false } },
      x: { grid: { display: false }, ticks: { color: TINTA } },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (contexto) {
            return ' ' + contexto.parsed.y + ' ' + nombre + ' (' + textoPorcentaje(contexto.parsed.y, total) + ' del periodo)'
          },
        },
      },
      datalabels: {
        display: true,
        anchor: 'end',
        align: 'top',
        offset: 4,
        color: TINTA,
        font: { weight: 'bold' },
      },
    },
  }

  return (
    <div className="h-64">
      <Line data={data} options={opciones} />
    </div>
  )
}
