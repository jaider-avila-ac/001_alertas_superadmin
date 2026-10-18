// reglas de los campos, las mismas del backend (shared/validacion/Validaciones.java).
// los filtros van en el onChange (no dejan escribir lo que no va), el formato al salir del campo
// y las reglas al enviar: devuelven el mensaje del problema o '' si esta bien

const NOMBRE = /^\p{L}+([ '’-]\p{L}+)*$/u
const LUGAR = /^[\p{L} .,'’-]+$/u
const TEXTO_BASICO = /^[\p{L}0-9 .,'’"\-()&/#°º]+$/u
const DIRECCION = /^[\p{L}0-9 .,'’\-()#°º/]+$/u
const CELULAR = /^3[0-9]{9}$/
const TELEFONO = /^[0-9]{7,10}$/
const CORREO = /^[a-z0-9_%+-]+(\.[a-z0-9_%+-]+)*@([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,24}$/
const DOCUMENTO_NUMERICO = /^[0-9]{3,15}$/
const DOCUMENTO_EXTRANJERO = /^[A-Za-z0-9]{3,20}$/
const CODIGO_DANE = /^[0-9]{12}$/
const GRUPO = /^[A-Za-z0-9]+([ -][A-Za-z0-9]+)*$/
const LETRA = /\p{L}/u
const NUMERO = /[0-9]/

// van en minuscula si no son la primera palabra: "Maria de los Angeles"
const PARTICULAS = ['de', 'del', 'la', 'las', 'los', 'y', 'e']

export function vacio(texto) {
  return texto === null || texto === undefined || String(texto).trim() === ''
}

// ---------------------------------------------------------------- filtros (onChange)

export function soloNumeros(texto) {
  return texto.replace(/[^0-9]/g, '')
}

// nombres y apellidos: letras, espacios, guion y apostrofe
export function soloLetras(texto) {
  return texto.replace(/[^\p{L} '’-]/gu, '')
}

// la cedula de extranjeria puede llevar letras, los demas documentos solo numeros
export function filtrarDocumento(texto, tipoDoc) {
  if (tipoDoc === 'CE') {
    return texto.replace(/[^A-Za-z0-9]/g, '')
  }
  return soloNumeros(texto)
}

export function sinEspacios(texto) {
  return texto.replace(/\s/g, '')
}

// nombre de grupo: letras y numeros en mayuscula (A, 01, 6A)
export function filtrarGrupo(texto) {
  return texto.toUpperCase().replace(/[^A-Z0-9 -]/g, '')
}

// ---------------------------------------------------------------- formato (onBlur)

export function espacios(texto) {
  if (vacio(texto)) {
    return ''
  }
  return texto.trim().replace(/\s+/g, ' ')
}

// la primera letra en mayuscula y las demas en minuscula. tambien despues de - ' y .
function mayusculaInicial(palabra) {
  let resultado = ''
  let siguienteMayuscula = true
  for (const letra of palabra) {
    if (siguienteMayuscula && LETRA.test(letra)) {
      resultado = resultado + letra.toLocaleUpperCase('es-CO')
    } else {
      resultado = resultado + letra
    }
    if (LETRA.test(letra) || NUMERO.test(letra)) {
      siguienteMayuscula = false
    }
    if (letra === '-' || letra === "'" || letra === '.') {
      siguienteMayuscula = true
    }
  }
  return resultado
}

// "mARIA   jOSE de la CRUZ" -> "Maria Jose de la Cruz"
export function nombrePropio(texto) {
  const limpio = espacios(texto).replace(/’/g, "'").toLocaleLowerCase('es-CO')
  if (limpio === '') {
    return ''
  }
  const palabras = limpio.split(' ')
  const resultado = []
  for (let i = 0; i < palabras.length; i++) {
    if (i > 0 && PARTICULAS.includes(palabras[i])) {
      resultado.push(palabras[i])
    } else {
      resultado.push(mayusculaInicial(palabras[i]))
    }
  }
  return resultado.join(' ')
}

export function formatoCorreo(texto) {
  if (vacio(texto)) {
    return ''
  }
  return texto.trim().toLowerCase()
}

// ---------------------------------------------------------------- reglas (al enviar)

export function errorObligatorio(valor, mensaje) {
  if (vacio(valor)) {
    return mensaje
  }
  return ''
}

export function errorNombre(valor, mensaje = 'Solo se permiten letras') {
  if (vacio(valor)) {
    return ''
  }
  const limpio = espacios(valor)
  if (limpio.length < 2 || !NOMBRE.test(limpio)) {
    return mensaje
  }
  return ''
}

export function errorLugar(valor, mensaje = 'Solo se permiten letras') {
  if (vacio(valor)) {
    return ''
  }
  const limpio = espacios(valor)
  if (limpio.length < 2 || !LUGAR.test(limpio) || !LETRA.test(limpio)) {
    return mensaje
  }
  return ''
}

export function errorTextoBasico(valor, mensaje = 'Tiene caracteres que no se permiten') {
  if (vacio(valor)) {
    return ''
  }
  const limpio = espacios(valor)
  if (!TEXTO_BASICO.test(limpio) || !LETRA.test(limpio)) {
    return mensaje
  }
  return ''
}

export function errorDireccion(valor, mensaje = 'La direccion no es valida') {
  if (vacio(valor)) {
    return ''
  }
  const limpio = espacios(valor)
  if (limpio.length < 3 || !DIRECCION.test(limpio) || !LETRA.test(limpio)) {
    return mensaje
  }
  return ''
}

export function errorCelular(valor, mensaje = 'El celular debe tener 10 digitos y empezar por 3') {
  if (vacio(valor)) {
    return ''
  }
  if (!CELULAR.test(valor.trim())) {
    return mensaje
  }
  return ''
}

export function errorTelefono(valor, mensaje = 'El telefono solo lleva numeros, de 7 a 10 digitos') {
  if (vacio(valor)) {
    return ''
  }
  if (!TELEFONO.test(valor.trim())) {
    return mensaje
  }
  return ''
}

export function errorCorreo(valor, mensaje = 'El correo no es valido') {
  if (vacio(valor)) {
    return ''
  }
  const limpio = formatoCorreo(valor)
  // la parte antes de la @ no pasa de 64
  if (limpio.length > 120 || limpio.indexOf('@') > 64 || !CORREO.test(limpio)) {
    return mensaje
  }
  return ''
}

export function errorCodigoDane(valor) {
  if (vacio(valor)) {
    return ''
  }
  if (!CODIGO_DANE.test(valor.trim())) {
    return 'El codigo DANE tiene 12 numeros'
  }
  return ''
}

export function errorDocumento(tipoDoc, nroDoc) {
  if (vacio(nroDoc)) {
    return 'El numero de documento es obligatorio'
  }
  const limpio = nroDoc.trim()
  if (tipoDoc === 'CE') {
    if (!DOCUMENTO_EXTRANJERO.test(limpio)) {
      return 'La cedula de extranjeria solo lleva letras y numeros, de 3 a 20'
    }
    return ''
  }
  if (!DOCUMENTO_NUMERICO.test(limpio)) {
    return 'El numero de documento solo lleva numeros, de 3 a 15 digitos'
  }
  if (limpio.replace(/0/g, '') === '') {
    return 'El numero de documento no es valido'
  }
  return ''
}

export function errorGrupo(valor) {
  if (vacio(valor)) {
    return 'El nombre del grupo es obligatorio'
  }
  if (!GRUPO.test(valor.trim())) {
    return 'El grupo solo lleva letras y numeros, ej: A, 01 o 6A'
  }
  return ''
}

// textos libres: que no sean solo numeros o signos
export function errorConLetras(valor, mensaje = 'Escribe un texto con letras') {
  if (vacio(valor)) {
    return ''
  }
  if (!LETRA.test(valor)) {
    return mensaje
  }
  return ''
}

export function errorContrasena(valor) {
  if (vacio(valor)) {
    return 'La contrasena nueva es obligatoria'
  }
  if (valor.length < 8 || valor.length > 72) {
    return 'La contrasena debe tener entre 8 y 72 caracteres'
  }
  if (!LETRA.test(valor) || !NUMERO.test(valor)) {
    return 'La contrasena debe tener al menos una letra y un numero'
  }
  return ''
}

// ---------------------------------------------------------------- ayudas

// el primer mensaje que no este vacio
export function primero(mensajes) {
  for (const mensaje of mensajes) {
    if (mensaje) {
      return mensaje
    }
  }
  return ''
}

// deja solo los campos con problema: { nombres: 'Los nombres solo llevan letras' }
export function conProblema(errores) {
  const resultado = {}
  for (const campo of Object.keys(errores)) {
    if (errores[campo]) {
      resultado[campo] = errores[campo]
    }
  }
  return resultado
}

export function hayErrores(errores) {
  return Object.keys(errores).length > 0
}
