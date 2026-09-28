import { Link } from 'react-router-dom'
import { ChevronRight, MapPin } from 'lucide-react'
import Insignia from '../../../components/ui/Insignia'

function EstadoInsignia({ activa }) {
  if (activa) {
    return <Insignia tipo="exito">Habilitada</Insignia>
  }
  return <Insignia tipo="peligro">Inhabilitada</Insignia>
}

function ubicacion(institucion) {
  const partes = []
  if (institucion.municipio) {
    partes.push(institucion.municipio)
  }
  if (institucion.departamento) {
    partes.push(institucion.departamento)
  }
  return partes.join(', ')
}

export default function InstitucionesLista({ instituciones }) {
  return (
    <>
      {/* celular: tarjetas */}
      <ul className="space-y-3 md:hidden">
        {instituciones.map((institucion) => (
          <li key={institucion.id}>
            <Link to={'/instituciones/' + institucion.id} className="tarjeta flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate font-medium">{institucion.nombre}</p>
                <p className="truncate text-sm text-suave">/{institucion.slug}</p>
                <div className="mt-2">
                  <EstadoInsignia activa={institucion.activa} />
                </div>
              </div>
              <ChevronRight className="shrink-0 text-suave" size={18} />
            </Link>
          </li>
        ))}
      </ul>

      {/* escritorio: tabla */}
      <div className="hidden overflow-hidden border border-borde bg-superficie shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead className="tabla-encabezado">
            <tr>
              <th className="px-4 py-3 font-semibold">Institucion</th>
              <th className="px-4 py-3 font-semibold">Enlace</th>
              <th className="px-4 py-3 font-semibold">Ubicacion</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {instituciones.map((institucion) => (
              <tr key={institucion.id} className="border-t border-borde transition-colors hover:bg-primario-50">
                <td className="px-4 py-3 font-medium">{institucion.nombre}</td>
                <td className="px-4 py-3 text-suave">/{institucion.slug}</td>
                <td className="px-4 py-3 text-suave">
                  {ubicacion(institucion) && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={14} />
                      {ubicacion(institucion)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <EstadoInsignia activa={institucion.activa} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link to={'/instituciones/' + institucion.id} className="font-semibold text-primario-500 hover:text-primario-600">
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
