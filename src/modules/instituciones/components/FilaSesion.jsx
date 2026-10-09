import { memo } from 'react'
import { LogOut, Monitor, Smartphone, Tablet } from 'lucide-react'
import Insignia from '../../../components/ui/Insignia'
import { formatearFecha } from '../../../utils/texto'
import { useEnLinea } from '../hooks/useEnLinea'

const NOMBRE_ROL = {
  ADMIN: 'Administrador',
  DOCENTE: 'Docente',
  PSICORIENTADOR: 'Psicorientador',
  ESTUDIANTE: 'Estudiante',
}

function IconoEquipo({ dispositivo }) {
  if (dispositivo === 'Celular') {
    return <Smartphone size={16} className="shrink-0 text-suave" />
  }
  if (dispositivo === 'Tableta') {
    return <Tablet size={16} className="shrink-0 text-suave" />
  }
  return <Monitor size={16} className="shrink-0 text-suave" />
}

function Estado({ enLinea }) {
  if (enLinea) {
    return <Insignia tipo="exito">En linea</Insignia>
  }
  return <Insignia tipo="neutro">Inactiva</Insignia>
}

// celular: tarjeta
function TarjetaSesionBase({ sesion, desfase, bloqueada, alCerrar }) {
  const enLinea = useEnLinea(sesion.ultimaActividad, desfase)
  return (
    <li className="border border-borde p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium">
            {sesion.nombres} {sesion.apellidos}
          </p>
          <p className="text-sm text-suave">
            {NOMBRE_ROL[sesion.rol]} · {sesion.documento}
          </p>
        </div>
        <Estado enLinea={enLinea} />
      </div>
      <p className="mt-2 flex items-center gap-2 text-sm">
        <IconoEquipo dispositivo={sesion.dispositivo} />
        {sesion.dispositivo} · {sesion.sistema} · {sesion.navegador}
      </p>
      <p className="mt-1 text-xs text-suave">Entro: {formatearFecha(sesion.inicio)}</p>
      <p className="text-xs text-suave">Ultima actividad: {formatearFecha(sesion.ultimaActividad)}</p>
      <button className="btn-secundario mt-3 w-full" disabled={bloqueada} onClick={() => alCerrar(sesion)}>
        <LogOut size={16} />
        Cerrar sesion
      </button>
    </li>
  )
}

// escritorio: fila de la tabla
function FilaSesionBase({ sesion, desfase, bloqueada, alCerrar }) {
  const enLinea = useEnLinea(sesion.ultimaActividad, desfase)
  return (
    <tr className="border-t border-borde">
      <td className="px-4 py-3">
        <p className="font-medium">
          {sesion.nombres} {sesion.apellidos}
        </p>
        <p className="text-xs text-suave">
          {NOMBRE_ROL[sesion.rol]} · {sesion.documento}
        </p>
      </td>
      <td className="px-4 py-3">
        <span className="flex items-center gap-2">
          <IconoEquipo dispositivo={sesion.dispositivo} />
          <span>
            {sesion.dispositivo}
            <span className="block text-xs text-suave">
              {sesion.sistema} · {sesion.navegador}
            </span>
          </span>
        </span>
      </td>
      <td className="px-4 py-3 text-suave">{formatearFecha(sesion.inicio)}</td>
      <td className="px-4 py-3 text-suave">{formatearFecha(sesion.ultimaActividad)}</td>
      <td className="px-4 py-3">
        <Estado enLinea={enLinea} />
      </td>
      <td className="px-4 py-3 text-right">
        <button className="btn-secundario" disabled={bloqueada} onClick={() => alCerrar(sesion)}>
          <LogOut size={16} />
          Cerrar
        </button>
      </td>
    </tr>
  )
}

// memo: solo se vuelve a dibujar la fila cuyo dato cambio
export const TarjetaSesion = memo(TarjetaSesionBase)
export const FilaSesion = memo(FilaSesionBase)
