// "Institucion Educativa San Jose" -> "institucion-educativa-san-jose"
export function generarSlug(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

// el backend valida formatos, un campo vacio debe llegar como null y no como ""
export function vaciosANull(objeto) {
  const limpio = {}
  for (const clave of Object.keys(objeto)) {
    const valor = objeto[clave]
    if (typeof valor === 'string' && valor.trim() === '') {
      limpio[clave] = null
    } else {
      limpio[clave] = valor
    }
  }
  return limpio
}

export function formatearFecha(iso) {
  if (!iso) {
    return ''
  }
  return new Date(iso).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
}
