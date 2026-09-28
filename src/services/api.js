// cliente base: url, token, errores y sin conexion. todo el acceso http pasa por aqui

const URL_API = import.meta.env.VITE_API_URL
const CLAVE_TOKEN = 'sa_token'

export function guardarToken(token) {
  localStorage.setItem(CLAVE_TOKEN, token)
}

export function leerToken() {
  return localStorage.getItem(CLAVE_TOKEN)
}

export function borrarToken() {
  localStorage.removeItem(CLAVE_TOKEN)
}

// para los POST que crean algo: si el usuario da doble clic, el backend rechaza el segundo
export function nuevaLlave() {
  return crypto.randomUUID()
}

async function solicitud(metodo, ruta, cuerpo, opciones) {
  const cabeceras = { 'Content-Type': 'application/json' }
  const token = leerToken()

  if (token) {
    cabeceras.Authorization = 'Bearer ' + token
  }

  if (opciones && opciones.llave) {
    cabeceras['Idempotency-Key'] = opciones.llave
  }

  let respuesta

  try {
    respuesta = await fetch(URL_API + ruta, {
      method: metodo,
      headers: cabeceras,
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    })
  } catch (e) {
    if (!navigator.onLine) {
      throw new Error('No tienes conexion a internet')
    }
    throw new Error('No se pudo conectar con el servidor')
  }

  // sesion vencida o cerrada desde otro lado: se avisa a la app para que mande al login
  if (respuesta.status === 401 && ruta !== '/api/v1/superadmin/auth/login') {
    borrarToken()
    window.dispatchEvent(new Event('sesion-vencida'))
  }

  let datos = null
  const texto = await respuesta.text()

  if (texto) {
    try {
      datos = JSON.parse(texto)
    } catch (e) {
      datos = null
    }
  }

  if (!respuesta.ok) {
    let mensaje = 'Ocurrio un error, intenta de nuevo'
    if (datos && datos.message) {
      mensaje = datos.message
    }
    const error = new Error(mensaje)
    error.status = respuesta.status
    throw error
  }

  return datos
}

export const api = {
  get: function (ruta) {
    return solicitud('GET', ruta)
  },
  post: function (ruta, cuerpo, opciones) {
    return solicitud('POST', ruta, cuerpo, opciones)
  },
  put: function (ruta, cuerpo) {
    return solicitud('PUT', ruta, cuerpo)
  },
  patch: function (ruta, cuerpo) {
    return solicitud('PATCH', ruta, cuerpo)
  },
}
