import { useState } from 'react'
import { KeyRound, LockKeyhole, Power, UserPlus } from 'lucide-react'
import Insignia from '../../../components/ui/Insignia'
import Mensaje from '../../../components/ui/Mensaje'
import Modal from '../../../components/ui/Modal'
import Vacio from '../../../components/ui/Vacio'
import { nuevaLlave } from '../../../services/api'
import {
  asignarContrasenaAdministrador,
  cambiarEstadoAdministrador,
  crearAdministrador,
  restablecerContrasenaAdministrador,
} from '../../../services/institucionService'
import { formatearFecha, vaciosANull } from '../../../utils/texto'
import DatosAdministradorCampos, { ADMINISTRADOR_VACIO } from './DatosAdministradorCampos'

export default function AdministradoresSeccion({ slug, administradores, alCambiar, alAgregar }) {
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [ocupado, setOcupado] = useState(null)

  const [modalAbierto, setModalAbierto] = useState(false)
  const [nuevo, setNuevo] = useState(ADMINISTRADOR_VACIO)
  const [llave, setLlave] = useState(nuevaLlave())
  const [errorModal, setErrorModal] = useState('')
  const [guardando, setGuardando] = useState(false)

  // asignar contrasena: el admin no puede cambiar la suya, se la pone el superadmin
  const [adminClave, setAdminClave] = useState(null)
  const [claveNueva, setClaveNueva] = useState('')
  const [errorClave, setErrorClave] = useState('')

  async function restablecer(admin) {
    const confirmado = window.confirm(
      'La contrasena de ' + admin.nombres + ' volvera a ser su numero de documento. ¿Continuar?'
    )
    if (!confirmado) {
      return
    }
    setMensaje('')
    setError('')
    setOcupado(admin.codigo)
    try {
      const actualizado = await restablecerContrasenaAdministrador(slug, admin.codigo)
      alCambiar(actualizado)
      setMensaje('Contrasena restablecida. Ahora es el numero de documento: ' + admin.nroDoc)
    } catch (err) {
      setError(err.message)
    }
    setOcupado(null)
  }

  async function cambiarEstado(admin) {
    const activar = !admin.activo
    if (!activar && !window.confirm('¿Inactivar a ' + admin.nombres + '? Se le cerrara la sesion.')) {
      return
    }
    setMensaje('')
    setError('')
    setOcupado(admin.codigo)
    try {
      const actualizado = await cambiarEstadoAdministrador(slug, admin.codigo, activar)
      alCambiar(actualizado)
    } catch (err) {
      setError(err.message)
    }
    setOcupado(null)
  }

  function abrirAsignar(admin) {
    setAdminClave(admin)
    setClaveNueva('')
    setErrorClave('')
  }

  async function guardarClave(e) {
    e.preventDefault()
    setErrorClave('')
    setGuardando(true)
    try {
      const actualizado = await asignarContrasenaAdministrador(slug, adminClave.codigo, claveNueva)
      alCambiar(actualizado)
      setMensaje('Contrasena asignada a ' + adminClave.nombres + '. Se cerraron sus sesiones abiertas.')
      setAdminClave(null)
    } catch (err) {
      setErrorClave(err.message)
    }
    setGuardando(false)
  }

  function abrirModal() {
    setNuevo(ADMINISTRADOR_VACIO)
    setLlave(nuevaLlave())
    setErrorModal('')
    setModalAbierto(true)
  }

  async function guardarNuevo(e) {
    e.preventDefault()
    setErrorModal('')
    setGuardando(true)
    try {
      const creado = await crearAdministrador(slug, vaciosANull(nuevo), llave)
      alAgregar(creado)
      setModalAbierto(false)
      setMensaje('Administrador creado. Usuario y contrasena inicial: ' + creado.nroDoc)
    } catch (err) {
      setErrorModal(err.message)
      // con los datos corregidos es otro envio
      setLlave(nuevaLlave())
    }
    setGuardando(false)
  }

  return (
    <section className="tarjeta space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold">Administradores</h2>
        <button className="btn-secundario" onClick={abrirModal}>
          <UserPlus size={16} />
          Agregar
        </button>
      </div>

      <Mensaje tipo="exito">{mensaje}</Mensaje>
      <Mensaje tipo="error">{error}</Mensaje>

      {administradores.length === 0 && <Vacio texto="Esta institucion no tiene administradores" />}

      <ul className="divide-y divide-borde">
        {administradores.map((admin) => (
          <li key={admin.codigo} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-medium">
                {admin.nombres} {admin.apellidos}
              </p>
              <p className="text-sm text-suave">
                {admin.tipoDoc} {admin.nroDoc}
                {admin.correo && ' · ' + admin.correo}
              </p>
              <div className="mt-1 flex flex-wrap gap-2">
                {admin.activo ? <Insignia tipo="exito">Activo</Insignia> : <Insignia tipo="peligro">Inactivo</Insignia>}
                {admin.debeCambiarContrasena && <Insignia tipo="aviso">Debe cambiar contrasena</Insignia>}
                {admin.ultimoIngreso && <Insignia tipo="neutro">Ultimo ingreso: {formatearFecha(admin.ultimoIngreso)}</Insignia>}
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button className="btn-secundario" disabled={ocupado === admin.codigo} onClick={() => abrirAsignar(admin)}>
                <LockKeyhole size={16} />
                Asignar contrasena
              </button>
              <button className="btn-secundario" disabled={ocupado === admin.codigo} onClick={() => restablecer(admin)}>
                <KeyRound size={16} />
                Restablecer
              </button>
              <button className="btn-secundario" disabled={ocupado === admin.codigo} onClick={() => cambiarEstado(admin)}>
                <Power size={16} />
                {admin.activo ? 'Inactivar' : 'Activar'}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Modal abierto={adminClave !== null} titulo="Asignar contrasena" alCerrar={() => setAdminClave(null)}>
        {adminClave && (
          <form onSubmit={guardarClave} className="space-y-4">
            <p className="text-sm text-suave">
              El administrador no puede cambiar su propia contrasena. La que escribas aqui sera la nueva contrasena de{' '}
              <strong className="text-texto">
                {adminClave.nombres} {adminClave.apellidos}
              </strong>
              .
            </p>
            <Mensaje tipo="error">{errorClave}</Mensaje>
            <div>
              <label htmlFor="claveNueva" className="etiqueta">
                Contrasena nueva<span className="text-peligro-600"> *</span>
              </label>
              <input
                id="claveNueva"
                type="text"
                className="input"
                required
                minLength={8}
                maxLength={72}
                autoComplete="off"
                value={claveNueva}
                onChange={(e) => setClaveNueva(e.target.value)}
              />
              <p className="mt-1 text-xs text-suave">Minimo 8 caracteres. Se muestra para que la puedas dictar.</p>
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" className="btn-secundario" onClick={() => setAdminClave(null)}>
                Cancelar
              </button>
              <button type="submit" className="btn-primario" disabled={guardando || claveNueva.length < 8}>
                {guardando ? 'Guardando...' : 'Asignar'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Modal abierto={modalAbierto} titulo="Nuevo administrador" alCerrar={() => setModalAbierto(false)}>
        <form onSubmit={guardarNuevo} className="space-y-4">
          <Mensaje tipo="error">{errorModal}</Mensaje>
          <DatosAdministradorCampos valores={nuevo} alCambiar={setNuevo} />
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" className="btn-secundario" onClick={() => setModalAbierto(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn-primario" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Crear administrador'}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  )
}
