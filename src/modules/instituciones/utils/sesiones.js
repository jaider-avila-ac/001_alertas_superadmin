// una sesion esta en linea si tuvo actividad en estos ultimos 2 minutos (igual que en el backend)
export const EN_LINEA_MS = 120000

// aplica un cambio que llego por el websocket a la pagina que se esta viendo.
// solo cambia lo necesario: las filas que no cambiaron conservan el mismo objeto
// (asi react no las vuelve a dibujar)
export function aplicarCambio(actual, evento, rol, pagina) {
  if (!actual) {
    return actual
  }

  const coincide = !rol || evento.rol === rol
  const anterior = actual.pagina
  let contenido = anterior.contenido
  let total = anterior.totalElementos

  let estaba = false
  for (const sesion of contenido) {
    if (sesion.codigo === evento.codigo) {
      estaba = true
    }
  }

  if (evento.tipo === 'abierta') {
    // las nuevas van arriba, en la primera pagina
    if (coincide && !estaba) {
      total = total + 1
      if (pagina === 0) {
        contenido = [evento.sesion].concat(contenido).slice(0, anterior.tamanio)
      }
    }
  } else if (evento.tipo === 'actividad') {
    if (estaba) {
      const nuevo = []
      for (const sesion of contenido) {
        if (sesion.codigo === evento.codigo) {
          nuevo.push(evento.sesion)
        } else {
          nuevo.push(sesion)
        }
      }
      contenido = nuevo
    }
  } else if (evento.tipo === 'cerrada') {
    if (coincide) {
      total = Math.max(0, total - 1)
    }
    if (estaba) {
      const nuevo = []
      for (const sesion of contenido) {
        if (sesion.codigo !== evento.codigo) {
          nuevo.push(sesion)
        }
      }
      contenido = nuevo
    }
  }

  return {
    ...actual,
    resumen: evento.resumen,
    recibidoEn: Date.now(),
    pagina: {
      ...anterior,
      contenido: contenido,
      totalElementos: total,
      totalPaginas: Math.ceil(total / anterior.tamanio),
    },
  }
}
