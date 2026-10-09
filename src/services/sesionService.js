import { api } from './api'

const URL_API = import.meta.env.VITE_API_URL

const BASE = '/api/v1/superadmin'

// sesiones abiertas de la institucion. rol vacio = todas.
// recibidoEn: cuando llego, para corregir si el reloj del equipo esta corrido
export async function listarSesiones(slug, rol, pagina) {
  const params = new URLSearchParams()
  if (rol) {
    params.set('rol', rol)
  }
  params.set('pagina', pagina)
  params.set('tamanio', 20)
  const datos = await api.get(BASE + '/instituciones/' + slug + '/sesiones?' + params.toString())
  return { ...datos, recibidoEn: Date.now() }
}

// el usuario sale al instante de esa sesion
export function cerrarSesionUsuario(slug, codigo) {
  return api.delete(BASE + '/instituciones/' + slug + '/sesiones/' + codigo)
}

export function cerrarTodasLasSesiones(slug) {
  return api.delete(BASE + '/instituciones/' + slug + '/sesiones')
}

// websocket con los cambios de sesiones: primero un ticket de un solo uso (con el token).
// http -> ws, https -> wss
export async function abrirConexionSesiones() {
  const respuesta = await api.post(BASE + '/sesiones/ticket')
  const base = URL_API.replace(/^http/, 'ws')
  return new WebSocket(base + '/ws/superadmin?ticket=' + encodeURIComponent(respuesta.ticket))
}
