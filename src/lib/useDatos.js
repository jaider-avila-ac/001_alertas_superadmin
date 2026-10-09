import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'

// pide datos al backend con cache. clave: lo que identifica la consulta (ej. ['instituciones', filtros]).
// al cambiar un filtro se sigue viendo lo anterior hasta que llegue lo nuevo;
// opciones.mantenerAnterior: false cuando lo anterior confundiria. opciones.activa: false para no pedir todavia
export default function useDatos(clave, pedir, opciones) {
  const cliente = useQueryClient()

  let activa = true
  if (opciones && opciones.activa === false) {
    activa = false
  }

  let anterior = keepPreviousData
  if (opciones && opciones.mantenerAnterior === false) {
    anterior = undefined
  }

  const claveCompleta = ['superadmin'].concat(clave)

  const consulta = useQuery({
    queryKey: claveCompleta,
    queryFn: pedir,
    placeholderData: anterior,
    enabled: activa,
  })

  let error = ''
  if (consulta.error) {
    error = consulta.error.message
  }

  return {
    datos: consulta.data,
    error: error,
    cargando: consulta.isPending && activa,
    actualizando: consulta.isFetching,
    recargar: consulta.refetch,
    poner: function (valor) {
      cliente.setQueryData(claveCompleta, valor)
    },
  }
}
