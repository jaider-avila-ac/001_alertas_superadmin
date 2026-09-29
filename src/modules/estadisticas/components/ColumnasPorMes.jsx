// columnas por mes con el numero encima y el mes debajo. campo: que valor de cada mes se dibuja
export default function ColumnasPorMes({ titulo, datos, campo, vacio }) {
  let maximo = 0
  for (const dato of datos) {
    if (dato[campo] > maximo) {
      maximo = dato[campo]
    }
  }

  return (
    <section className="tarjeta">
      <h2 className="mb-4 font-semibold">{titulo}</h2>
      {maximo === 0 ? (
        <p className="text-sm text-suave">{vacio || 'Sin datos con estos filtros'}</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex min-w-max items-end gap-0.5 border-b border-borde" style={{ height: '11rem' }}>
            {datos.map((dato) => (
              <div
                key={dato.clave}
                className="flex h-full w-14 flex-col items-center justify-end hover:bg-fondo"
                title={dato.etiqueta + ': ' + dato[campo]}
              >
                <span className="mb-1 text-xs font-semibold tabular-nums text-texto">{dato[campo]}</span>
                <span
                  className="block w-8 bg-primario-500"
                  style={{ height: 'calc(' + (dato[campo] / maximo) * 100 + '% - 1.25rem)' }}
                />
              </div>
            ))}
          </div>
          <div className="flex min-w-max gap-0.5">
            {datos.map((dato) => (
              <span key={dato.clave} className="w-14 pt-1 text-center text-xs text-suave">
                {dato.etiqueta}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
