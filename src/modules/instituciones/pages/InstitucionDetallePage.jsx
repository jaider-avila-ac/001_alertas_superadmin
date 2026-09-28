import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MessageSquare, Pencil, Power } from 'lucide-react'
import BotonCopiar from '../../../components/ui/BotonCopiar'
import Cargando from '../../../components/ui/Cargando'
import Insignia from '../../../components/ui/Insignia'
import Mensaje from '../../../components/ui/Mensaje'
import { activarInstitucion, actualizarInstitucion, cambiarSms, inactivarInstitucion } from '../../../services/institucionService'
import { formatearFecha, vaciosANull } from '../../../utils/texto'
import AdministradoresSeccion from '../components/AdministradoresSeccion'
import DatosInstitucionCampos from '../components/DatosInstitucionCampos'
import InactivarModal from '../components/InactivarModal'
import useInstitucion from '../hooks/useInstitucion'

const URL_FRONT = import.meta.env.VITE_URL_FRONT

// pasa null a "" para que los inputs queden controlados
function datosParaFormulario(institucion) {
  return {
    nombre: institucion.nombre || '',
    slug: institucion.slug || '',
    codigoDane: institucion.codigoDane || '',
    municipio: institucion.municipio || '',
    departamento: institucion.departamento || '',
    direccion: institucion.direccion || '',
    telefono: institucion.telefono || '',
    correo: institucion.correo || '',
  }
}

function Dato({ etiqueta, valor }) {
  return (
    <div>
      <dt className="text-xs text-suave">{etiqueta}</dt>
      <dd className="text-sm">{valor || '—'}</dd>
    </div>
  )
}

export default function InstitucionDetallePage() {
  const { id } = useParams()
  const detalle = useInstitucion(id)

  const [editando, setEditando] = useState(false)
  const [formulario, setFormulario] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [errorEdicion, setErrorEdicion] = useState('')

  const [modalInactivar, setModalInactivar] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [ocupado, setOcupado] = useState(false)

  if (detalle.cargando && !detalle.institucion) {
    return <Cargando texto="Cargando institucion..." />
  }

  if (detalle.error && !detalle.institucion) {
    return (
      <div className="space-y-4">
        <Mensaje tipo="error">{detalle.error}</Mensaje>
        <Link to="/instituciones" className="btn-secundario">
          Volver
        </Link>
      </div>
    )
  }

  const institucion = detalle.institucion

  function empezarEdicion() {
    setFormulario(datosParaFormulario(institucion))
    setErrorEdicion('')
    setEditando(true)
  }

  async function guardarEdicion(e) {
    e.preventDefault()
    if (formulario.slug !== institucion.slug) {
      const seguro = window.confirm('Cambiar el enlace hace que el anterior deje de funcionar. ¿Continuar?')
      if (!seguro) {
        return
      }
    }
    setErrorEdicion('')
    setGuardando(true)
    try {
      const actualizada = await actualizarInstitucion(id, vaciosANull(formulario))
      detalle.setInstitucion(actualizada)
      setEditando(false)
      setMensaje('Datos actualizados')
    } catch (err) {
      setErrorEdicion(err.message)
    }
    setGuardando(false)
  }

  async function inactivar(motivo) {
    const actualizada = await inactivarInstitucion(id, motivo)
    detalle.setInstitucion(actualizada)
    setModalInactivar(false)
    setMensaje('Institucion inhabilitada. Nadie de ella puede entrar.')
  }

  async function activar() {
    setMensaje('')
    setError('')
    setOcupado(true)
    try {
      const actualizada = await activarInstitucion(id)
      detalle.setInstitucion(actualizada)
      setMensaje('Institucion habilitada de nuevo')
    } catch (err) {
      setError(err.message)
    }
    setOcupado(false)
  }

  async function alternarSms() {
    setMensaje('')
    setError('')
    setOcupado(true)
    try {
      const actualizada = await cambiarSms(id, !institucion.smsActivo)
      detalle.setInstitucion(actualizada)
    } catch (err) {
      setError(err.message)
    }
    setOcupado(false)
  }

  return (
    <div className="space-y-4">
      <Link to="/instituciones" className="inline-flex items-center gap-1 text-sm text-suave hover:text-texto">
        <ArrowLeft size={16} />
        Instituciones
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold">{institucion.nombre}</h1>
        {institucion.activa ? <Insignia tipo="exito">Habilitada</Insignia> : <Insignia tipo="peligro">Inhabilitada</Insignia>}
      </div>

      <Mensaje tipo="exito">{mensaje}</Mensaje>
      <Mensaje tipo="error">{error}</Mensaje>

      <section className="tarjeta space-y-2">
        <h2 className="font-semibold">Enlace de acceso</h2>
        <div className="flex flex-col gap-2 bg-fondo p-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="break-all font-medium text-primario-700">{institucion.enlace}</span>
          <BotonCopiar texto={institucion.enlace} />
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="tarjeta space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Datos</h2>
            {!editando && (
              <button className="btn-secundario" onClick={empezarEdicion}>
                <Pencil size={16} />
                Editar
              </button>
            )}
          </div>

          {editando ? (
            <form onSubmit={guardarEdicion} className="space-y-4">
              <Mensaje tipo="error">{errorEdicion}</Mensaje>
              <DatosInstitucionCampos
                valores={formulario}
                alCambiar={setFormulario}
                slugAutomatico={false}
                setSlugAutomatico={() => {}}
                urlFront={URL_FRONT}
              />
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button type="button" className="btn-secundario" onClick={() => setEditando(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primario" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          ) : (
            <dl className="grid gap-4 sm:grid-cols-2">
              <Dato etiqueta="Codigo DANE" valor={institucion.codigoDane} />
              <Dato etiqueta="Telefono" valor={institucion.telefono} />
              <Dato etiqueta="Municipio" valor={institucion.municipio} />
              <Dato etiqueta="Departamento" valor={institucion.departamento} />
              <Dato etiqueta="Direccion" valor={institucion.direccion} />
              <Dato etiqueta="Correo" valor={institucion.correo} />
              <Dato etiqueta="Creada" valor={formatearFecha(institucion.creadoEn)} />
            </dl>
          )}
        </section>

        <section className="tarjeta space-y-4">
          <h2 className="font-semibold">Estado</h2>

          {institucion.activa ? (
            <div className="space-y-3">
              <p className="text-sm text-suave">Los usuarios de la institucion pueden entrar normalmente.</p>
              <button className="btn-peligro w-full" onClick={() => setModalInactivar(true)}>
                <Power size={16} />
                Inhabilitar
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-peligro-50 p-3 text-sm text-peligro-700">
                <p className="font-medium">Inhabilitada el {formatearFecha(institucion.inactivadaEn)}</p>
                <p>Motivo: {institucion.motivoInactivacion}</p>
              </div>
              <button className="btn-exito w-full" disabled={ocupado} onClick={activar}>
                <Power size={16} />
                Habilitar
              </button>
            </div>
          )}

          <div className="border-t border-borde pt-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 text-sm font-medium">
                  <MessageSquare size={16} />
                  Mensajes de texto (SMS)
                </p>
                <p className="text-xs text-suave">{institucion.smsActivo ? 'Encendidos' : 'Apagados'}</p>
              </div>
              <button
                role="switch"
                aria-checked={institucion.smsActivo}
                aria-label="Mensajes de texto"
                disabled={ocupado}
                onClick={alternarSms}
                className={
                  'relative h-6 w-11 shrink-0 transition ' +
                  (institucion.smsActivo ? 'bg-primario-600' : 'bg-borde')
                }
              >
                <span
                  className={
                    'absolute top-0.5 h-5 w-5 bg-superficie shadow transition ' +
                    (institucion.smsActivo ? 'left-5' : 'left-0.5')
                  }
                />
              </button>
            </div>
          </div>
        </section>
      </div>

      <AdministradoresSeccion
        institucionId={id}
        administradores={detalle.administradores}
        alCambiar={detalle.reemplazarAdministrador}
        alAgregar={detalle.agregarAdministrador}
      />

      <InactivarModal
        abierto={modalInactivar}
        nombre={institucion.nombre}
        alCerrar={() => setModalInactivar(false)}
        alConfirmar={inactivar}
      />
    </div>
  )
}
