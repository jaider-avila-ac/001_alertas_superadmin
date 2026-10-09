import { QueryClient } from '@tanstack/react-query'

// cache de lo que se pide al backend, solo en memoria (no ocupa espacio del navegador).
// los datos se actualizan solo al recargar la pagina o al entrar a una pantalla: se muestra al instante
// lo que ya se tenia y se pide una vez en segundo plano; react solo repinta lo que cambio.
// nunca se pregunta cada cierto tiempo. no se pide al volver a la pestana
export const clienteConsultas = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 1,
    },
  },
})

// al entrar o salir: nada de una sesion le queda a la siguiente
export function olvidarTodo() {
  clienteConsultas.clear()
}
