import { useEffect, useState } from 'react'
import { EN_LINEA_MS } from '../utils/sesiones'

// desfase: diferencia entre el reloj del servidor y el de este equipo (ms)

// true mientras la sesion este en linea. cambia sola en el momento exacto en que pasa a inactiva,
// y solo se vuelve a dibujar la fila que la usa
export function useEnLinea(ultimaActividad, desfase) {
  const vence = new Date(ultimaActividad).getTime() + EN_LINEA_MS
  const [enLinea, setEnLinea] = useState(vence > Date.now() + desfase)

  useEffect(() => {
    const restante = vence - (Date.now() + desfase)
    setEnLinea(restante > 0)
    if (restante <= 0) {
      return undefined
    }
    const reloj = setTimeout(() => setEnLinea(false), restante + 50)
    return () => clearTimeout(reloj)
  }, [vence, desfase])

  return enLinea
}

// cuantas sesiones de la institucion siguen en linea. actividad: ultima actividad (ms) de las que
// estaban en linea cuando llego el resumen. se recuenta cuando vence la siguiente
export function useConteoEnLinea(actividad, desfase) {
  const [, setVuelta] = useState(0)
  const ahora = Date.now() + desfase

  let cuenta = 0
  let proximo = null
  for (const momento of actividad) {
    const vence = momento + EN_LINEA_MS
    if (vence > ahora) {
      cuenta = cuenta + 1
      if (proximo === null || vence < proximo) {
        proximo = vence
      }
    }
  }

  useEffect(() => {
    if (proximo === null) {
      return undefined
    }
    const reloj = setTimeout(() => setVuelta((n) => n + 1), proximo - (Date.now() + desfase) + 50)
    return () => clearTimeout(reloj)
  }, [proximo, desfase])

  return cuenta
}
