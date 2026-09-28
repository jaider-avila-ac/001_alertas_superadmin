import { api } from './api'

export function iniciarSesion(usuario, contrasena) {
  return api.post('/api/v1/superadmin/auth/login', { usuario: usuario, contrasena: contrasena })
}

export function obtenerYo() {
  return api.get('/api/v1/superadmin/auth/yo')
}

export function cambiarContrasena(actual, nueva) {
  return api.put('/api/v1/superadmin/auth/contrasena', { actual: actual, nueva: nueva })
}
