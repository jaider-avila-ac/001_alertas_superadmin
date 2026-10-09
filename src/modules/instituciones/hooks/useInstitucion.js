import useDatos from '../../../lib/useDatos'
import { buscarInstitucion, listarAdministradores } from '../../../services/institucionService'

// detalle de una institucion con sus administradores, con cache
export default function useInstitucion(slug) {
  const consultaInstitucion = useDatos(
    ['institucion', slug],
    function () {
      return buscarInstitucion(slug)
    },
    { mantenerAnterior: false }
  )
  const consultaAdministradores = useDatos(
    ['administradores', slug],
    function () {
      return listarAdministradores(slug)
    },
    { mantenerAnterior: false }
  )

  let institucion = null
  if (consultaInstitucion.datos) {
    institucion = consultaInstitucion.datos
  }

  let administradores = []
  if (consultaAdministradores.datos) {
    administradores = consultaAdministradores.datos
  }

  // despues de una accion se reemplaza solo lo que cambio, sin volver a cargar todo
  function reemplazarAdministrador(actualizado) {
    const lista = []
    for (const admin of administradores) {
      if (admin.codigo === actualizado.codigo) {
        lista.push(actualizado)
      } else {
        lista.push(admin)
      }
    }
    consultaAdministradores.poner(lista)
  }

  function agregarAdministrador(nuevo) {
    consultaAdministradores.poner([...administradores, nuevo])
  }

  async function recargar() {
    await consultaInstitucion.recargar()
    await consultaAdministradores.recargar()
  }

  return {
    institucion: institucion,
    setInstitucion: consultaInstitucion.poner,
    administradores: administradores,
    reemplazarAdministrador: reemplazarAdministrador,
    agregarAdministrador: agregarAdministrador,
    cargando: consultaInstitucion.cargando || consultaAdministradores.cargando,
    error: consultaInstitucion.error || consultaAdministradores.error,
    recargar: recargar,
  }
}
