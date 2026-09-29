import { useCallback, useEffect, useRef, useState } from 'react'
import { BellRing, Building2, MessageSquare, Receipt, X } from 'lucide-react'
import Cargando from '../../../components/ui/Cargando'
import Insignia from '../../../components/ui/Insignia'
import Mensaje from '../../../components/ui/Mensaje'
import Paginacion from '../../../components/ui/Paginacion'
import { verComparativo, verEstadisticas } from '../../../services/estadisticaService'
import BarrasApiladas from '../../../components/graficos/BarrasApiladas'
import BarrasHorizontales from '../../../components/graficos/BarrasHorizontales'
import Columnas from '../../../components/graficos/Columnas'
import Indicador from '../../../components/graficos/Indicador'
import Linea from '../../../components/graficos/Linea'
import Dona from '../../../components/graficos/Dona'
import TarjetaGrafico from '../../../components/graficos/TarjetaGrafico'
import {
  CIELO,
  ESMERALDA,
  ESTADOS,
  INDIGO,
  ROSADO,
  coloresPorNombre,
  textoPorcentaje,
} from '../../../components/graficos/configuracion'

// color fijo por rol (no por puesto): no cambia con los filtros
const COLOR_ROL = { ADMIN: CIELO, PSICORIENTADOR: ROSADO, DOCENTE: INDIGO, ESTUDIANTE: ESMERALDA }

// alertas por cada 100 estudiantes activos, para comparar colegios de distinto tamanio
function porCien(alertas, estudiantes) {
  if (!estudiantes) {
    return '—'
  }
  const valor = Math.round((alertas / estudiantes) * 1000) / 10
  return String(valor).replace('.', ',')
}

// solo los colegios con alertas, con sus tres estados
function filasComparativo(contenido) {
  const filas = []
  for (const fila of contenido) {
    if (fila.alertas > 0) {
      filas.push({ etiqueta: fila.nombre, valores: [fila.pendientes, fila.enProceso, fila.completadas] })
    }
  }
  return filas
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

    const roles = []
    for (const rol of datos.usuariosPorRol) {
      roles.push({ ...rol, color: COLOR_ROL[rol.clave] })
    }

    const nombresCategorias = []
    for (const categoria of datos.porCategoria) {
      nombresCategorias.push(categoria.clave)
    }
    const colorCategoria = coloresPorNombre(nombresCategorias)
    const categorias = []
    for (const categoria of datos.porCategoria) {
      categorias.push({ ...categoria, color: colorCategoria[categoria.clave] })
    }

    // lo que se cobra son los segmentos
    const segmentos = []
    for (const mes of datos.smsPorMes) {
      segmentos.push({ clave: mes.clave, etiqueta: mes.etiqueta, total: mes.segmentos })
    }

    let fallidos = '0%'
    if (r.smsEnviados + r.smsFallidos > 0) {
      fallidos = textoPorcentaje(r.smsFallidos, r.smsEnviados + r.smsFallidos)
    }

    cuerpo = (
      <>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Indicador titulo="Colegios activos" color={CIELO} icono={Building2} valor={r.institucionesActivas} detalle={r.institucionesInactivas + ' inhabilitados'} />
          <Indicador titulo="Alertas" color={INDIGO} icono={BellRing} valor={r.alertas} />
          <Indicador titulo="SMS enviados" color="#ec4899" icono={MessageSquare} valor={r.smsEnviados} detalle={fallidos + ' fallidos (' + r.smsFallidos + ')'} />
          <Indicador titulo="Segmentos de SMS" color="#a855f7" icono={Receipt} valor={r.smsSegmentos} detalle="Lo que cobra el proveedor" />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <TarjetaGrafico titulo="Usuarios activos por rol" descripcion="En colegios activos">
            <Dona datos={roles} textoCentro="usuarios" vacio="Sin usuarios activos" />
          </TarjetaGrafico>
          <TarjetaGrafico className="lg:col-span-2" titulo="Alertas por mes" descripcion="Cuantas alertas se crearon cada mes">
            <Linea datos={datos.porMes} />
          </TarjetaGrafico>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <TarjetaGrafico
            titulo="Alertas por categoria"
            descripcion="Las categorias que se llaman igual en distintos colegios se juntan"
          >
            <BarrasHorizontales datos={categorias} />
          </TarjetaGrafico>
          <TarjetaGrafico titulo="Segmentos de SMS por mes" descripcion="Partes de 160 caracteres: lo que cobra el proveedor">
            <Linea datos={segmentos} color={ROSADO} unidad="segmentos" vacio="Sin SMS con estos filtros" />
          </TarjetaGrafico>
        </div>
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
            <p className="-mt-2 mb-3 text-xs text-suave">
              Alertas de cada colegio de esta pagina por estado; dentro de cada tramo, su porcentaje. Abajo el detalle.
            </p>
            <div className="mb-6">
              <BarrasApiladas
                filas={filasComparativo(comparativo.contenido)}
                series={[
                  { nombre: 'Pendientes', color: ESTADOS.PENDIENTE },
                  { nombre: 'En proceso', color: ESTADOS.EN_PROCESO },
                  { nombre: 'Completadas', color: ESTADOS.COMPLETADA },
                ]}
                vacio="Ningun colegio tiene alertas con estos filtros"
              />
            </div>
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
