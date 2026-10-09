import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { LogOut } from 'lucide-react'
import Cargando from '../../../components/ui/Cargando'
import Mensaje from '../../../components/ui/Mensaje'
import Paginacion from '../../../components/ui/Paginacion'
import Vacio from '../../../components/ui/Vacio'
import useDatos from '../../../lib/useDatos'
import { cerrarSesionUsuario, cerrarTodasLasSesiones, listarSesiones } from '../../../services/sesionService'
import useSesionesEnVivo from '../hooks/useSesionesEnVivo'
import { aplicarCambio } from '../utils/sesiones'
import { FilaSesion, TarjetaSesion } from './FilaSesion'
import ResumenSesiones from './ResumenSesiones'

const ROLES = [
  { valor: '', texto: 'Todos los roles' },
  { valor: 'ADMIN', texto: 'Administradores' },
  { valor: 'DOCENTE', texto: 'Docentes' },
  { valor: 'PSICORIENTADOR', texto: 'Psicorientadores' },
  { valor: 'ESTUDIANTE', texto: 'Estudiantes' },
]

// quien tiene la sesion abierta en la institucion, en tiempo real: los cambios llegan por websocket
// y solo se actualiza la fila o el contador que cambio. cerrar saca al usuario al instante
export default function SesionesSeccion({ slug }) {
  const cliente = useQueryClient()
  const [rol, setRol] = useState('')
  const [pagina, setPagina] = useState(0)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [ocupado, setOcupado] = useState(null)
  const [desfase, setDesfase] = useState(0)

  const consulta = useDatos(['sesiones', slug, rol, pagina], function () {
    return listarSesiones(slug, rol, pagina)
  })
  const datos = consulta.datos

  // lo que se esta viendo, para aplicar los cambios que llegan
  const vista = useRef({ slug: slug, rol: rol, pagina: pagina })
  vista.current = { slug: slug, rol: rol, pagina: pagina }

  // diferencia de reloj con el servidor. solo se cambia si se movio mas de 2 s (asi no se redibuja todo)
  useEffect(() => {
    if (!datos) {
      return
    }
    const nuevo = datos.resumen.ahora - datos.recibidoEn
    setDesfase((actual) => (Math.abs(nuevo - actual) > 2000 ? nuevo : actual))
  }, [datos])

  // si se cerraron todas las de la ultima pagina, se vuelve a la anterior
  useEffect(() => {
    if (datos && datos.pagina.contenido.length === 0 && pagina > 0) {
      setPagina(pagina - 1)
    }
  }, [datos, pagina])

  function alRecibir(evento) {
    const actual = vista.current
    if (evento.slug !== actual.slug) {
      return
    }
    const claveInstitucion = ['superadmin', 'sesiones', actual.slug]
    // se cerraron muchas a la vez: se pide la pagina de nuevo
    if (evento.tipo === 'todas' || evento.tipo === 'rol') {
      cliente.invalidateQueries({ queryKey: claveInstitucion })
      return
    }
    // las otras paginas o filtros ya guardados quedan viejos: se piden al volver a ellas
    cliente.invalidateQueries({ queryKey: claveInstitucion, refetchType: 'none' })
    cliente.setQueryData(claveInstitucion.concat([actual.rol, actual.pagina]), (anterior) =>
      aplicarCambio(anterior, evento, actual.rol, actual.pagina),
    )
  }

  // al volver la conexion se pide la pagina por si algo cambio mientras estuvo caida
  function alReconectar() {
    cliente.invalidateQueries({ queryKey: ['superadmin', 'sesiones', vista.current.slug] })
  }

  const conectado = useSesionesEnVivo(alRecibir, alReconectar)

  // estable: las filas no se redibujan por esta funcion
  const cerrarUna = useCallback(
    async (sesion) => {
      const nombre = sesion.nombres + ' ' + sesion.apellidos
      if (!window.confirm('¿Cerrar la sesion de ' + nombre + ' en ' + sesion.navegador + ' (' + sesion.dispositivo + ')?')) {
        return
      }
      setMensaje('')
      setError('')
      setOcupado(sesion.codigo)
      try {
        await cerrarSesionUsuario(slug, sesion.codigo)
        setMensaje('Sesion de ' + nombre + ' cerrada.')
      } catch (err) {
        setError(err.message)
      }
      setOcupado(null)
    },
    [slug],
  )

  async function cerrarTodas() {
    if (
      !window.confirm('Se cerraran todas las sesiones de esta institucion, incluidas las de los administradores. ¿Continuar?')
    ) {
      return
    }
    setMensaje('')
    setError('')
    setOcupado('todas')
    try {
      const respuesta = await cerrarTodasLasSesiones(slug)
      setMensaje('Se cerraron ' + respuesta.cerradas + ' sesiones.')
      setPagina(0)
    } catch (err) {
      setError(err.message)
    }
    setOcupado(null)
  }

  let sesiones = []
  if (datos) {
    sesiones = datos.pagina.contenido
  }

  return (
    <section className="tarjeta space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold">Sesiones abiertas</h2>
          {conectado ? (
            <span className="flex items-center gap-1.5 text-xs font-medium text-exito-700">
              <span className="h-2 w-2 bg-exito-600" />
              En vivo
            </span>
          ) : (
            <span className="text-xs text-suave">Conectando...</span>
          )}
        </div>
        <button
          className="btn-peligro"
          disabled={ocupado !== null || !datos || datos.resumen.sesiones === 0}
          onClick={cerrarTodas}
        >
          <LogOut size={16} />
          Cerrar todas
        </button>
      </div>

      <Mensaje tipo="exito">{mensaje}</Mensaje>
      <Mensaje tipo="error">{error || consulta.error}</Mensaje>

      {consulta.cargando && <Cargando texto="Cargando sesiones..." />}

      {datos && (
        <>
          <ResumenSesiones resumen={datos.resumen} desfase={desfase} />

          <div className="flex flex-col gap-1 sm:max-w-xs">
            <label htmlFor="rol-sesiones" className="text-sm font-medium">
              Rol
            </label>
            <select
              id="rol-sesiones"
              className="input"
              value={rol}
              onChange={(e) => {
                setRol(e.target.value)
                setPagina(0)
              }}
            >
              {ROLES.map((r) => (
                <option key={r.valor} value={r.valor}>
                  {r.texto}
                </option>
              ))}
            </select>
          </div>

          {sesiones.length === 0 && <Vacio texto="No hay sesiones abiertas" />}

          {sesiones.length > 0 && (
            <>
              <ul className="space-y-3 md:hidden">
                {sesiones.map((sesion) => (
                  <TarjetaSesion
                    key={sesion.codigo}
                    sesion={sesion}
                    desfase={desfase}
                    bloqueada={ocupado === sesion.codigo || ocupado === 'todas'}
                    alCerrar={cerrarUna}
                  />
                ))}
              </ul>

              <div className="hidden overflow-x-auto border border-borde md:block">
                <table className="w-full text-left text-sm">
                  <thead className="tabla-encabezado">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Usuario</th>
                      <th className="px-4 py-3 font-semibold">Equipo</th>
                      <th className="px-4 py-3 font-semibold">Entro</th>
                      <th className="px-4 py-3 font-semibold">Ultima actividad</th>
                      <th className="px-4 py-3 font-semibold">Estado</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {sesiones.map((sesion) => (
                      <FilaSesion
                        key={sesion.codigo}
                        sesion={sesion}
                        desfase={desfase}
                        bloqueada={ocupado === sesion.codigo || ocupado === 'todas'}
                        alCerrar={cerrarUna}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <Paginacion
            pagina={datos.pagina.pagina}
            totalPaginas={datos.pagina.totalPaginas}
            totalElementos={datos.pagina.totalElementos}
            alCambiar={setPagina}
          />
        </>
      )}
    </section>
  )
}
