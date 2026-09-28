import { api, nuevaLlave } from './api'

const BASE = '/api/v1/superadmin/instituciones'

export function listarInstituciones(filtros) {
  const params = new URLSearchParams()

  if (filtros.texto) {
    params.set('texto', filtros.texto)
  }
  if (filtros.activa === 'si') {
    params.set('activa', 'true')
  }
  if (filtros.activa === 'no') {
    params.set('activa', 'false')
  }
  params.set('pagina', filtros.pagina)
  params.set('tamanio', filtros.tamanio)

  return api.get(BASE + '?' + params.toString())
}

export function buscarInstitucion(id) {
  return api.get(BASE + '/' + id)
}

// llave: se genera una vez por formulario, asi el doble clic no crea dos instituciones
export function crearInstitucion(datos, llave) {
  return api.post(BASE, datos, { llave: llave || nuevaLlave() })
}

export function actualizarInstitucion(id, datos) {
  return api.put(BASE + '/' + id, datos)
}

export function inactivarInstitucion(id, motivo) {
  return api.patch(BASE + '/' + id + '/inactivar', { motivo: motivo })
}

export function activarInstitucion(id) {
  return api.patch(BASE + '/' + id + '/activar')
}

export function cambiarSms(id, activo) {
  return api.patch(BASE + '/' + id + '/sms', { activo: activo })
}

export function listarAdministradores(id) {
  return api.get(BASE + '/' + id + '/administradores')
}

export function crearAdministrador(id, datos, llave) {
  return api.post(BASE + '/' + id + '/administradores', datos, { llave: llave || nuevaLlave() })
}

export function restablecerContrasenaAdministrador(id, usuarioId) {
  return api.post(BASE + '/' + id + '/administradores/' + usuarioId + '/restablecer-contrasena')
}

// el admin no puede cambiar su propia contrasena, se la pone el superadmin
export function asignarContrasenaAdministrador(id, usuarioId, nueva) {
  return api.put(BASE + '/' + id + '/administradores/' + usuarioId + '/contrasena', { nueva: nueva })
}

export function cambiarEstadoAdministrador(id, usuarioId, activo) {
  return api.patch(BASE + '/' + id + '/administradores/' + usuarioId + '/estado', { activo: activo })
}
