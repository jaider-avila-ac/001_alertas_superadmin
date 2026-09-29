import { api } from './api'

const BASE = '/api/v1/superadmin/estadisticas'

// filtros: { institucion (slug), desde, hasta }. los vacios no se mandan
export function verEstadisticas(filtros) {
  const params = new URLSearchParams()
  if (filtros.institucion) {
    params.set('institucion', filtros.institucion)
  }
  if (filtros.desde) {
    params.set('desde', filtros.desde)
  }
  if (filtros.hasta) {
    params.set('hasta', filtros.hasta)
  }
  return api.get(BASE + '?' + params.toString())
}

// comparativo entre colegios, paginado
export function verComparativo(filtros, pagina) {
  const params = new URLSearchParams()
  if (filtros.desde) {
    params.set('desde', filtros.desde)
  }
  if (filtros.hasta) {
    params.set('hasta', filtros.hasta)
  }
  params.set('pagina', pagina)
  params.set('tamanio', 20)
  return api.get(BASE + '/instituciones?' + params.toString())
}
