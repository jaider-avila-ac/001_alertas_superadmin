import { useCallback, useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import Cargando from '../../../components/ui/Cargando'
import Insignia from '../../../components/ui/Insignia'
import Mensaje from '../../../components/ui/Mensaje'
import Paginacion from '../../../components/ui/Paginacion'
import { verComparativo, verEstadisticas } from '../../../services/estadisticaService'
import Barras from '../components/Barras'
import ColumnasPorMes from '../components/ColumnasPorMes'

function Indicador({ titulo, valor, detalle }) {
  return (
    <div className="tarjeta">
      <p className="text-xs font-medium text-suave">{titulo}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-texto">{valor}</p>
      {detalle && <p className="mt-1 text-xs text-suave">{detalle}</p>}
    </div>
  )
}

// alertas por cada 100 estudiantes activos, para comparar colegios de distinto tamanio
function porCien(alertas, estudiantes) {
  if (!estudiantes) {
    return '—'
  }
  const valor = Math.round((alertas / estudiantes) * 1000) / 10
  return String(valor).replace('.', ',')
}

// estadisticas entre colegios: solo totales, nunca nombres de estudiantes ni lo que dicen las alertas
export default function EstadisticasPage() {
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  // { slug, nombre } del colegio elegido en el comparativo, o null para todos
  const [institucion, setInstitucion] = useState(null)
  const [pagina, setPagina] = useState(0)
  const [datos, setDatos] = useState(null)
  const [comparativo, setComparativo] = useState(null)
  const [error, setError] = useState('')
  const consulta = useRef(0)
  const consultaTabla = useRef(0)

  let slug = ''
  if (institucion) {
    slug = institucion.slug
  }

  const cargar = useCallback(async () => {
    consulta.current = consulta.current + 1
    const esta = consulta.current
    setError('')
    try {
      const respuesta = await verEstadisticas({ institucion: slug, desde: desde, hasta: hasta })
      if (esta === consulta.current) {
        setDatos(respuesta)
      }
    } catch (err) {
      if (esta === consulta.current) {
        setError(err.message)
      }
    }
  }, [slug, desde, hasta])

  const cargarTabla = useCallback(async () => {
    consultaTabla.current = consultaTabla.current + 1
    const esta = consultaTabla.current
    try {
      const respuesta = await verComparativo({ desde: desde, hasta: hasta }, pagina)
      if (esta === consultaTabla.current) {
        setComparativo(respuesta)
      }
    } catch (err) {
      if (esta === consultaTabla.current) {
        setError(err.message)
      }
    }
  }, [desde, hasta, pagina])

  useEffect(() => {
    cargar()
  }, [cargar])

  useEffect(() => {
    cargarTabla()
  }, [cargarTabla])

  function cambiarFecha(cambiar, valor) {
    cambiar(valor)
    setPagina(0)
  }

  let cuerpo = null
  if (datos) {
    const r = datos.resumen
    cuerpo = (
      <>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Indicador titulo="Colegios activos" valor={r.institucionesActivas} detalle={r.institucionesInactivas + ' inhabilitados'} />
          <Indicador titulo="Alertas" valor={r.alertas} />
          <Indicador titulo="SMS enviados" valor={r.smsEnviados} detalle={r.smsFallidos + ' fallidos'} />
          <Indicador titulo="Segmentos de SMS" valor={r.smsSegmentos} detalle="Lo que cobra el proveedor" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Barras titulo="Usuarios activos por rol" datos={datos.usuariosPorRol} vacio="Sin usuarios activos" />
          <Barras titulo="Alertas por categoria" datos={datos.porCategoria} />
        </div>

        <ColumnasPorMes titulo="Alertas por mes" datos={datos.porMes} campo="total" />
        <ColumnasPorMes titulo="Segmentos de SMS por mes" datos={datos.smsPorMes} campo="segmentos" vacio="Sin SMS con estos filtros" />
      </>
    )
  } else if (!error) {
    cuerpo = <Cargando />
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="filtro-desde" className="mb-1 block text-xs font-semibold text-suave">
            Desde
          </label>
          <input id="filtro-desde" className="input" type="date" value={desde} onChange={(e) => cambiarFecha(setDesde, e.target.value)} />
        </div>
        <div>
          <label htmlFor="filtro-hasta" className="mb-1 block text-xs font-semibold text-suave">
            Hasta
          </label>
          <input id="filtro-hasta" className="input" type="date" value={hasta} onChange={(e) => cambiarFecha(setHasta, e.target.value)} />
        </div>
        {institucion && (
          <button
            className="btn-secundario"
            onClick={() => setInstitucion(null)}
            title="Ver todos los colegios"
          >
            {institucion.nombre}
            <X size={16} />
          </button>
        )}
      </div>

      <p className="text-sm text-suave">
        {institucion ? 'Solo ' + institucion.nombre + '.' : 'Todos los colegios.'} Solo se muestran totales: ni nombres de
        estudiantes ni lo que dicen las alertas.
      </p>

      <Mensaje tipo="error">{error}</Mensaje>
      {cuerpo}

      <section className="tarjeta">
        <h2 className="mb-4 font-semibold">Comparativo entre colegios</h2>
        {!comparativo ? (
          <Cargando />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[56rem] text-sm">
                <thead className="tabla-encabezado">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Colegio</th>
                    <th className="px-3 py-2 text-right font-semibold">Estudiantes</th>
                    <th className="px-3 py-2 text-right font-semibold">Alertas</th>
                    <th className="px-3 py-2 text-right font-semibold">Por 100 est.</th>
                    <th className="px-3 py-2 text-right font-semibold">Pendientes</th>
                    <th className="px-3 py-2 text-right font-semibold">En proceso</th>
                    <th className="px-3 py-2 text-right font-semibold">Completadas</th>
                    <th className="px-3 py-2 text-right font-semibold">SMS</th>
                    <th className="px-3 py-2 text-right font-semibold">Segmentos</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-borde">
                  {comparativo.contenido.map((fila) => (
                    <tr key={fila.slug} className={institucion && institucion.slug === fila.slug ? 'bg-primario-50' : ''}>
                      <td className="px-3 py-2">
                        <span className="font-medium">{fila.nombre}</span>
                        {!fila.activa && (
                          <span className="ml-2">
                            <Insignia tipo="peligro">Inhabilitado</Insignia>
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">{fila.estudiantes}</td>
                      <td className="px-3 py-2 text-right font-semibold tabular-nums">{fila.alertas}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{porCien(fila.alertas, fila.estudiantes)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{fila.pendientes}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{fila.enProceso}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{fila.completadas}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{fila.smsEnviados}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{fila.smsSegmentos}</td>
                      <td className="px-3 py-2 text-right">
                        <button
                          className="text-sm font-semibold text-primario-500 hover:text-primario-600"
                          onClick={() => setInstitucion({ slug: fila.slug, nombre: fila.nombre })}
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Paginacion
              pagina={comparativo.pagina}
              totalPaginas={comparativo.totalPaginas}
              totalElementos={comparativo.totalElementos}
              alCambiar={setPagina}
            />
          </>
        )}
      </section>
    </div>
  )
}
