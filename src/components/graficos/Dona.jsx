import { Doughnut } from 'react-chartjs-2'
import { TINTA, TINTA_SUAVE, sumar, textoPorcentaje } from './configuracion'

// partes de un todo (pocas: hasta 5). el porcentaje va sobre cada parte y en la leyenda, con el numero.
// datos: [{ clave, etiqueta, total, color }]. centro: texto grande en el hueco (ej. el total)
export default function Dona({ datos, centro, textoCentro, vacio }) {
  const total = sumar(datos)

  if (total === 0) {
    return <p className="text-sm text-suave">{vacio || 'Sin datos con estos filtros'}</p>
  }

  const colores = []
  const valores = []
  const etiquetas = []
  for (const dato of datos) {
    colores.push(dato.color)
    valores.push(dato.total)
    etiquetas.push(dato.etiqueta)
  }

  const data = {
    labels: etiquetas,
    datasets: [
      {
        data: valores,
        backgroundColor: colores,
        // separacion del color de la superficie entre partes
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  }

  const opciones = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      tooltip: {
        callbacks: {
          label: function (contexto) {
            return ' ' + contexto.label + ': ' + contexto.parsed + ' (' + textoPorcentaje(contexto.parsed, total) + ')'
          },
        },
      },
      datalabels: {
        // las partes muy pequenas no llevan etiqueta (se ven en la leyenda)
        display: function (contexto) {
          return contexto.dataset.data[contexto.dataIndex] / total >= 0.06
        },
        color: '#ffffff',
        font: { weight: 'bold', size: 12 },
        formatter: function (valor) {
          return textoPorcentaje(valor, total)
        },
      },
    },
  }

  return (
    <div className="flex min-w-0 flex-col items-center gap-4">
      <div className="relative h-48 w-48 shrink-0">
        <Doughnut data={data} options={opciones} />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color: TINTA }}>
            {centro === undefined ? total : centro}
          </span>
          <span className="text-xs" style={{ color: TINTA_SUAVE }}>
            {textoCentro || 'en total'}
          </span>
        </div>
      </div>
      <ul className="w-full space-y-1.5 text-sm">
        {datos.map((dato) => (
          <li key={dato.clave} className="flex items-center gap-2">
            <span className="h-3 w-3 shrink-0" style={{ backgroundColor: dato.color }} />
            <span className="min-w-0 flex-1 break-words text-texto">{dato.etiqueta}</span>
            <span className="font-semibold tabular-nums text-texto">{dato.total}</span>
            <span className="w-14 text-right tabular-nums text-suave">{textoPorcentaje(dato.total, total)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
