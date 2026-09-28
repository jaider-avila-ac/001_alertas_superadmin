import { api, nuevaLlave } from './api'

const BASE = '/api/v1/superadmin/instituciones'

// la institucion va por su slug y el administrador por su codigo (nunca ids)
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

export function buscarInstitucion(slug) {
  return api.get(BASE + '/' + slug)
}

// llave: se genera una vez por formulario, asi el doble clic no crea dos instituciones
export function crearInstitucion(datos, llave) {
  return api.post(BASE, datos, { llave: llave || nuevaLlave() })
}

export function actualizarInstitucion(slug, datos) {
  return api.put(BASE + '/' + slug, datos)
}

export function inactivarInstitucion(slug, motivo) {
  return api.patch(BASE + '/' + slug + '/inactivar', { motivo: motivo })
}

export function activarInstitucion(slug) {
  return api.patch(BASE + '/' + slug + '/activar')
}

export function cambiarSms(slug, activo) {
  return api.patch(BASE + '/' + slug + '/sms', { activo: activo })
}

export function listarAdministradores(slug) {
  return api.get(BASE + '/' + slug + '/administradores')
}

export function crearAdministrador(slug, datos, llave) {
  return api.post(BASE + '/' + slug + '/administradores', datos, { llave: llave || nuevaLlave() })
}

export function restablecerContrasenaAdministrador(slug, codigo) {
  return api.post(BASE + '/' + slug + '/administradores/' + codigo + '/restablecer-contrasena')
}

// el admin no puede cambiar su propia contrasena, se la pone el superadmin
export function asignarContrasenaAdministrador(slug, codigo, nueva) {
  return api.put(BASE + '/' + slug + '/administradores/' + codigo + '/contrasena', { nueva: nueva })
}

export function cambiarEstadoAdministrador(slug, codigo, activo) {
  return api.patch(BASE + '/' + slug + '/administradores/' + codigo + '/estado', { activo: activo })
}
