import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CircleCheck } from 'lucide-react'
import BotonCopiar from '../../../components/ui/BotonCopiar'
import Mensaje from '../../../components/ui/Mensaje'
import { nuevaLlave } from '../../../services/api'
import { crearInstitucion } from '../../../services/institucionService'
import { vaciosANull } from '../../../utils/texto'
import DatosAdministradorCampos, { ADMINISTRADOR_VACIO } from '../components/DatosAdministradorCampos'
import DatosInstitucionCampos, { INSTITUCION_VACIA } from '../components/DatosInstitucionCampos'

const URL_FRONT = import.meta.env.VITE_URL_FRONT

export default function CrearInstitucionPage() {
  const [institucion, setInstitucion] = useState(INSTITUCION_VACIA)
  const [administrador, setAdministrador] = useState(ADMINISTRADOR_VACIO)
  const [slugAutomatico, setSlugAutomatico] = useState(true)

  // una llave por intento: el doble clic sobre "Crear" no crea dos instituciones
  const [llave, setLlave] = useState(nuevaLlave())
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [creada, setCreada] = useState(null)

  async function enviar(e) {
    e.preventDefault()
    setError('')
    setEnviando(true)
    try {
      const respuesta = await crearInstitucion(
        { institucion: vaciosANull(institucion), administrador: vaciosANull(administrador) },
        llave
      )
      setCreada(respuesta)
    } catch (err) {
      setError(err.message)
      setLlave(nuevaLlave())
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setEnviando(false)
  }

  if (creada) {
    return (
      <div className="max-w-2xl space-y-4">
        <div className="tarjeta space-y-4">
          <div className="flex items-center gap-2 text-exito-700">
            <CircleCheck size={22} />
            <h1 className="text-lg font-semibold">Institucion creada</h1>
          </div>

          <p className="text-sm text-suave">
            <strong className="text-texto">{creada.institucion.nombre}</strong> ya tiene sus grados, el año lectivo
            activo y las categorias de alerta. Comparte este enlace con la institucion:
          </p>

          <div className="flex flex-col gap-2 bg-fondo p-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="break-all font-medium text-primario-700">{creada.institucion.enlace}</span>
            <BotonCopiar texto={creada.institucion.enlace} />
          </div>

          <div className="border border-borde p-3 text-sm">
            <p className="font-medium">Administrador</p>
            <p className="text-suave">
              {creada.administrador.nombres} {creada.administrador.apellidos}
            </p>
            <p className="mt-2">
              Usuario y contrasena inicial: <strong>{creada.administrador.nroDoc}</strong>
            </p>
            <p className="text-suave">
              El administrador no puede cambiar su propia contrasena. Si quieres darle otra, usa "Asignar contrasena" en
              el detalle de la institucion.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link to={'/instituciones/' + creada.institucion.slug} className="btn-primario">
              Ver institucion
            </Link>
            <Link to="/instituciones" className="btn-secundario">
              Volver al listado
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-4">
      <Link to="/instituciones" className="inline-flex items-center gap-1 text-sm text-suave hover:text-texto">
        <ArrowLeft size={16} />
        Instituciones
      </Link>

      <form onSubmit={enviar} className="space-y-4">
        <Mensaje tipo="error">{error}</Mensaje>

        <section className="tarjeta space-y-4">
          <h2 className="font-semibold">Datos de la institucion</h2>
          <DatosInstitucionCampos
            valores={institucion}
            alCambiar={setInstitucion}
            slugAutomatico={slugAutomatico}
            setSlugAutomatico={setSlugAutomatico}
            urlFront={URL_FRONT}
          />
        </section>

        <section className="tarjeta space-y-4">
          <div>
            <h2 className="font-semibold">Primer administrador</h2>
            <p className="text-sm text-suave">Su usuario y contrasena inicial seran el numero de documento.</p>
          </div>
          <DatosAdministradorCampos valores={administrador} alCambiar={setAdministrador} />
        </section>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Link to="/instituciones" className="btn-secundario">
            Cancelar
          </Link>
          <button type="submit" className="btn-primario" disabled={enviando}>
            {enviando ? 'Creando...' : 'Crear institucion'}
          </button>
        </div>
      </form>
    </div>
  )
}
