// barras horizontales de una sola serie: etiqueta, barra y el numero al final
export default function Barras({ titulo, datos, vacio }) {
  let maximo = 0
  for (const dato of datos) {
    if (dato.total > maximo) {
      maximo = dato.total
    }
  }

  return (
    <section className="tarjeta">
      <h2 className="mb-4 font-semibold">{titulo}</h2>
      {maximo === 0 ? (
        <p className="text-sm text-suave">{vacio || 'Sin datos con estos filtros'}</p>
      ) : (
        <ul className="space-y-2">
          {datos.map((dato) => (
            <li
              key={dato.clave}
              className="grid grid-cols-[minmax(0,11rem)_1fr_auto] items-center gap-3 text-sm hover:bg-fondo"
              title={dato.etiqueta + ': ' + dato.total}
            >
              <span className="truncate text-texto">{dato.etiqueta}</span>
              <span className="h-4 bg-fondo">
                <span className="block h-4 bg-primario-500" style={{ width: (dato.total / maximo) * 100 + '%' }} />
              </span>
              <span className="w-10 text-right font-semibold tabular-nums text-texto">{dato.total}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
