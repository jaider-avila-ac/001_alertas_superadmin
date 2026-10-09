import { memo } from 'react'
import { useConteoEnLinea } from '../hooks/useEnLinea'

function Conteo({ etiqueta, valor, destacado }) {
  return (
    <div className="border border-borde bg-superficie px-4 py-3">
      <p className="text-xs text-suave">{etiqueta}</p>
      <p className={'text-2xl font-semibold ' + (destacado ? 'text-primario-600' : '')}>{valor}</p>
    </div>
  )
}

// solo "en linea ahora" se recuenta con el tiempo; lo demas cambia cuando llega un resumen nuevo
function EnLineaAhora({ actividad, desfase }) {
  const cuenta = useConteoEnLinea(actividad, desfase)
  return <Conteo etiqueta="En linea ahora" valor={cuenta} destacado />
}

function ResumenSesiones({ resumen, desfase }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <EnLineaAhora actividad={resumen.actividadEnLinea} desfase={desfase} />
      <Conteo etiqueta="Usuarios con sesion" valor={resumen.usuarios} />
      <Conteo etiqueta="Sesiones abiertas" valor={resumen.sesiones} />
      <Conteo
        etiqueta="Por rol (AD / DO / PS / ES)"
        valor={
          resumen.administradores + ' / ' + resumen.docentes + ' / ' + resumen.psicorientadores + ' / ' + resumen.estudiantes
        }
      />
    </div>
  )
}

export default memo(ResumenSesiones)
