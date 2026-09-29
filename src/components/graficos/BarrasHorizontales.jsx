import { Bar } from 'react-chartjs-2'
import { AZUL, LINEA, TINTA, sumar, textoPorcentaje } from './configuracion'

// comparar cantidades entre muchas categorias con nombres largos (categorias, grupos).
// al final de cada barra: el numero y su porcentaje del total.
// datos: [{ clave, etiqueta, total, color? }] (sin color va azul)
export default function BarrasHorizontales({ datos, vacio }) {
  const total = sumar(datos)

  if (total === 0) {
    return <p className="text-sm text-suave">{vacio || 'Sin datos con estos filtros'}</p>
  }

  const etiquetas = []
  const valores = []
  const colores = []
  let maximo = 0
  for (const dato of datos) {
    etiquetas.push(dato.etiqueta)
    valores.push(dato.total)
    colores.push(dato.color || AZUL)
    if (dato.total > maximo) {
      maximo = dato.total
    }
  }

  const data = {
    labels: etiquetas,
    datasets: [{ data: valores, backgroundColor: colores, barPercentage: 0.8, categoryPercentage: 0.9 }],
  }

  const opciones = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    // espacio a la derecha para la etiqueta del final
    layout: { padding: { right: 70 } },
    scales: {
      x: { beginAtZero: true, suggestedMax: maximo, grid: { color: LINEA }, ticks: { precision: 0 }, border: { display: false } },
      y: { grid: { display: false }, ticks: { color: TINTA, autoSkip: false } },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (contexto) {
            return ' ' + contexto.parsed.x + ' alertas (' + textoPorcentaje(contexto.parsed.x, total) + ')'
          },
        },
      },
      datalabels: {
        display: true,
        anchor: 'end',
        align: 'end',
        clamp: true,
        color: TINTA,
        font: { weight: 'bold' },
        formatter: function (valor) {
          return valor + '  ' + textoPorcentaje(valor, total)
        },
      },
    },
  }

  // alto segun cuantas barras haya
  const alto = Math.max(120, datos.length * 34 + 30)

  return (
    <div style={{ height: alto + 'px' }}>
      <Bar data={data} options={opciones} />
    </div>
  )
}
